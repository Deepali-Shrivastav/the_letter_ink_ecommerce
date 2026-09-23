# The Letter Ink — Medusa Backend: Architecture Design Document

> **Document:** 02 — Architecture Design Document  
> **Medusa Version:** 2.20.1

---

## Table of Contents

1. [Architectural Overview](#1-architectural-overview)
2. [System Architecture Diagram](#2-system-architecture-diagram)
3. [Core Architectural Patterns](#3-core-architectural-patterns)
4. [Dependency Injection Container](#4-dependency-injection-container)
5. [Module System](#5-module-system)
6. [Workflow Engine](#6-workflow-engine)
7. [HTTP Layer](#7-http-layer)
8. [Database & ORM](#8-database--orm)
9. [Event Bus System](#9-event-bus-system)
10. [Caching Layer](#10-caching-layer)
11. [Cross-Module Data Linking](#11-cross-module-data-linking)
12. [Worker Modes](#12-worker-modes)
13. [Plugin System](#13-plugin-system)
14. [Admin Dashboard Architecture](#14-admin-dashboard-architecture)
15. [Data Flow Walkthrough](#15-data-flow-walkthrough)

---

## 1. Architectural Overview

Medusa v2 follows a **modular monolith** architecture:

- The entire commerce platform is composed of **36 isolated modules**, each owning its own database schema, business logic, and service interface.
- Modules communicate through **typed service interfaces** registered in a shared **Awilix DI container** — they never import each other's internal implementation.
- All multi-module business logic is expressed as **Workflows** — composable, compensatable transaction scripts that run via a built-in orchestration engine.
- The HTTP API layer is thin: routes delegate all logic to workflows and re-expose data through standardized response shapes.

### Key Design Principles

| Principle | Implementation |
|---|---|
| **Separation of Concerns** | Modules own their domain; routes own only HTTP |
| **DRY** | Shared logic in `@medusajs/framework/utils`; shared types in `@medusajs/framework/types` |
| **Inversion of Control** | All dependencies injected via Awilix container |
| **Compensatable Transactions** | Workflow steps define rollback (compensation) functions |
| **Pluggability** | Every infrastructure concern has an abstract module with swappable providers |

---

## 2. System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                   CLIENT LAYER                                  │
│   theletterink (Next.js)     Admin Dashboard (React + Vite)   │
└────────────────┬──────────────────────────────┬────────────────┘
                 │ Store API                    │ Admin API
                 ▼                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                   HTTP LAYER (Express.js)                       │
│                                                                 │
│  /store/*         /admin/*          /auth/*        /hooks/*     │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Middleware Pipeline                                      │  │
│  │  authenticate → validateBody → validateQuery → route     │  │
│  └──────────────────────────────────────────────────────────┘  │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                   WORKFLOW ENGINE                               │
│                                                                 │
│   createWorkflow() → Steps → Compensation → Hooks              │
│                                                                 │
│   core-flows: 37 domain groups, 200+ workflows                 │
└────────────────────────────┬────────────────────────────────────┘
                             │ resolves services via DI
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│              AWILIX DI CONTAINER                               │
│                                                                 │
│  IProductModuleService  IOrderModuleService  ICartModuleService │
│  IPaymentModuleService  IAuthModuleService   ICustomerModuleService│
│  IInventoryModuleService  IPricingModuleService  ...           │
└────────────┬────────────────────────────────────────┬──────────┘
             │                                        │
             ▼                                        ▼
┌────────────────────────┐              ┌─────────────────────────┐
│   COMMERCE MODULES     │              │  INFRASTRUCTURE MODULES │
│                        │              │                         │
│  product    pricing    │              │  event-bus-redis        │
│  order      promotion  │              │  cache-redis            │
│  cart       fulfillment│              │  workflow-engine-redis  │
│  customer   inventory  │              │  file-s3                │
│  payment    tax        │              │  search-postgres        │
│  auth       region     │              │  payment-stripe         │
│  ...                   │              │  notification-sendgrid  │
└────────────┬───────────┘              └─────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────────────────────────────┐
│              DATABASE LAYER (MikroORM + PostgreSQL)            │
│                                                                 │
│  Each module owns its own database tables                      │
│  Cross-module relations handled via link-modules pivot tables  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 3. Core Architectural Patterns

### 3.1 Module Pattern

Every commerce module follows this internal structure:

```
packages/modules/<domain>/
├── src/
│   ├── models/            ← MikroORM entity definitions (DML)
│   ├── repositories/      ← Data Access Objects
│   ├── services/          ← Business logic services
│   ├── migrations/        ← Auto-generated DB migrations
│   ├── schema/            ← GraphQL schema (optional)
│   ├── joiner-config.ts   ← Module joiner configuration
│   ├── types/             ← Module-local DTOs
│   └── index.ts           ← Module entry-point export
```

**Service Pattern:**

```typescript
// Services extend MedusaService<T> typed on their DTOs
export class ProductModuleService
  extends MedusaService<{ Product: { dto: ProductDTO } }>({ Product })
  implements IProductModuleService
{
  // Public methods: @InjectManager() + @EmitEvents()
  @InjectManager()
  @EmitEvents()
  async createProducts(data: CreateProductDTO[], @MedusaContext() ctx = {}) {
    return await this.createProducts_(data, ctx)
  }

  // Protected implementation: @InjectTransactionManager()
  @InjectTransactionManager()
  protected async createProducts_(data, @MedusaContext() ctx = {}) {
    // actual DB operations
  }
}
```

**Key Decorators:**

| Decorator | Purpose |
|---|---|
| `@InjectManager()` | Injects entity manager on public methods |
| `@InjectTransactionManager()` | Injects transactional EM on protected methods |
| `@MedusaContext()` | Injects shared context (transaction, actor info) |
| `@EmitEvents()` | Emits domain events after method completes |

### 3.2 API Route Pattern

Each route file exports named HTTP method handlers:

```typescript
// packages/medusa/src/api/admin/products/route.ts

export const GET = async (
  req: AuthenticatedMedusaRequest<HttpTypes.AdminProductListParams>,
  res: MedusaResponse<HttpTypes.AdminProductListResponse>
) => {
  const { data: products, metadata } = await refetchEntities({ ... })
  res.json({ products, count, offset, limit })
}

export const POST = async (
  req: AuthenticatedMedusaRequest<HttpTypes.AdminCreateProduct>,
  res: MedusaResponse<HttpTypes.AdminProductResponse>
) => {
  const { result } = await createProductsWorkflow(req.scope).run({ input })
  res.status(200).json({ product })
}
```

**Request object extension:**

| Property | Type | Description |
|---|---|---|
| `req.scope` | `MedusaContainer` | Request-scoped DI container |
| `req.filterableFields` | `object` | Validated, transformed query filters |
| `req.queryConfig.fields` | `string[]` | Requested fields for sparse fieldset |
| `req.queryConfig.pagination` | `object` | `{ skip, take }` pagination |
| `req.validatedBody` | `T` | Zod-validated and typed request body |
| `req.requestId` | `string` | UUID per request (tracing) |
| `req.auth_context` | `object` | Authenticated actor details |

### 3.3 Middleware Pattern

Route-level middleware is declared in `middlewares.ts` alongside each route:

```typescript
export const adminOrderRoutesMiddlewares: MiddlewareRoute[] = [
  {
    method: ["GET"],
    matcher: "/admin/orders",
    middlewares: [
      validateAndTransformQuery(AdminGetOrdersParams, listQueryConfig),
    ],
    policies: [{ resource: "order", operation: PolicyOperation.read }],
  },
]
```

**Standard middleware pipeline per route:**

```
Request
  → authenticate()          (verify JWT/session)
  → validateAndTransformQuery() (parse & validate query params via Zod)
  → validateAndTransformBody()  (parse & validate request body via Zod)
  → [custom middlewares]    (pricing context, sales channel filtering, etc.)
  → route handler
  → Response
```

### 3.4 Error Handling Pattern

```typescript
import { MedusaError } from "@medusajs/framework/utils"

// All application errors use MedusaError
throw new MedusaError(MedusaError.Types.NOT_FOUND, `Order ${id} not found`)
throw new MedusaError(MedusaError.Types.INVALID_DATA, "Email is invalid")
throw new MedusaError(MedusaError.Types.NOT_ALLOWED, "Cannot cancel a completed order")
```

| Error Type | HTTP Status | Use Case |
|---|---|---|
| `NOT_FOUND` | 404 | Resource does not exist |
| `INVALID_DATA` | 400 | Input validation failure |
| `NOT_ALLOWED` | 400 | Operation not permitted in current state |
| `UNAUTHORIZED` | 401 | Authentication required |
| `FORBIDDEN` | 403 | Insufficient permissions |
| `CONFLICT` | 409 | State conflict |

---

## 4. Dependency Injection Container

Medusa uses **Awilix** as its IoC container. All modules, services, and infrastructure adapters are registered here.

### Container Registration Keys

```typescript
ContainerRegistrationKeys.CONFIG_MODULE    // "configModule"
ContainerRegistrationKeys.LOGGER           // "logger"
ContainerRegistrationKeys.QUERY            // "@medusajs/query" — graph query engine
ContainerRegistrationKeys.PG_CONNECTION    // "pg_connection"
ContainerRegistrationKeys.REMOTE_QUERY     // "remoteQuery"
ContainerRegistrationKeys.REMOTE_LINK      // "remoteLink"
ContainerRegistrationKeys.FEATURE_FLAG_ROUTER  // feature flags
```

### Module Registration

```typescript
// Each module registers with its Modules enum key
Modules.PRODUCT       // "@medusajs/product"
Modules.ORDER         // "@medusajs/order"
Modules.CART          // "@medusajs/cart"
Modules.PAYMENT       // "@medusajs/payment"
Modules.CUSTOMER      // "@medusajs/customer"
Modules.INVENTORY     // "@medusajs/inventory"
Modules.FULFILLMENT   // "@medusajs/fulfillment"
Modules.PRICING       // "@medusajs/pricing"
Modules.PROMOTION     // "@medusajs/promotion"
Modules.AUTH          // "@medusajs/auth"
Modules.TAX           // "@medusajs/tax"
Modules.REGION        // "@medusajs/region"
Modules.SALES_CHANNEL // "@medusajs/sales-channel"
Modules.NOTIFICATION  // "@medusajs/notification"
Modules.FILE          // "@medusajs/file"
Modules.SEARCH        // "@medusajs/search"
Modules.STOCK_LOCATION // "@medusajs/stock-location"
Modules.STORE         // "@medusajs/store"
Modules.USER          // "@medusajs/user"
Modules.API_KEY       // "@medusajs/api-key"
Modules.CURRENCY      // "@medusajs/currency"
Modules.WORKFLOW_ENGINE // "@medusajs/workflow-engine-inmemory"
Modules.EVENT_BUS     // "@medusajs/event-bus-local"
Modules.CACHE         // "@medusajs/cache-inmemory"
Modules.LOCKING       // "@medusajs/locking"
```

### Request-Scoped Container

Every HTTP request gets a child scope of the global container:

```typescript
expressApp.use((req, res, next) => {
  req.scope = container.createScope() as MedusaContainer
  req.requestId = req.headers["x-request-id"] ?? v4()
  next()
})
```

This ensures request isolation for transaction management.

---

## 5. Module System

### Module Interface Contract

Every module implements a typed service interface. This interface is the only public API other modules can use:

```
Module: product
Interface: IProductModuleService
Registered as: Modules.PRODUCT
Methods: createProducts, updateProducts, deleteProducts, listProducts,
         createProductVariants, updateProductVariants, ...
```

### Data Model Layer (DML)

Models are defined using Medusa's fluent `model` builder (not raw MikroORM decorators):

```typescript
const Product = model.define("Product", {
  id: model.id({ prefix: "prod" }).primaryKey(),
  title: model.text().searchable().translatable(),
  handle: model.text(),
  status: model.enum(ProductStatus).default(ProductStatus.DRAFT),
  variants: model.hasMany(() => ProductVariant, { mappedBy: "product" }),
  // ...
})
.cascades({ delete: ["variants", "images"] })
.indexes([
  { name: "IDX_product_handle_unique", on: ["handle"], unique: true, where: "deleted_at IS NULL" }
])
```

**DML Field Types:**

| Method | PostgreSQL Type | Notes |
|---|---|---|
| `model.id()` | `varchar` | Auto-prefixed ULIDs |
| `model.text()` | `text` | |
| `model.number()` | `integer` | |
| `model.float()` | `float` | |
| `model.bigNumber()` | `numeric` | For monetary amounts |
| `model.boolean()` | `boolean` | |
| `model.dateTime()` | `timestamptz` | |
| `model.json()` | `jsonb` | |
| `model.enum()` | `enum` | PostgreSQL enum type |
| `model.autoincrement()` | `serial` | Sequential display IDs |

**DML Relation Types:**

| Method | Description |
|---|---|
| `model.hasMany()` | One-to-many |
| `model.hasOne()` | One-to-one (FK on current table or related) |
| `model.belongsTo()` | Inverse side of hasMany/hasOne |
| `model.manyToMany()` | Many-to-many with optional pivot entity |

---

## 6. Workflow Engine

### Overview

Workflows are the primary mechanism for all multi-step business operations. They are:

- **Composable:** built from reusable, typed steps
- **Compensatable:** each step can define a rollback function
- **Idempotent:** identified by string ID for deduplication
- **Observable:** emits hooks for external extension

### Workflow Anatomy

```typescript
// 1. Define a step
export const deleteProductsStep = createStep(
  "delete-products",                          // step ID (unique)
  async (ids: string[], { container }) => {   // main action
    const productModule = container.resolve<IProductModuleService>(Modules.PRODUCT)
    await productModule.softDeleteProducts(ids)
    return new StepResponse(void 0, ids)      // (result, compensationData)
  },
  async (idsToRestore, { container }) => {    // compensation (rollback)
    if (!idsToRestore?.length) return
    await container
      .resolve<IProductModuleService>(Modules.PRODUCT)
      .restoreProducts(idsToRestore)
  }
)

// 2. Compose into a workflow
export const deleteProductsWorkflow = createWorkflow(
  "delete-products",
  (input: WorkflowData<{ ids: string[] }>) => {
    deleteProductsStep(input.ids)
    const hook = createHook("productsDeleted", { ids: input.ids })
    return new WorkflowResponse(void 0, { hooks: [hook] })
  }
)

// 3. Execute from a route
await deleteProductsWorkflow(req.scope).run({ input: { ids: ["prod_01..."] } })
```

### Workflow Composition Primitives

| Primitive | Description |
|---|---|
| `createStep()` | Define an atomic, compensatable step |
| `createWorkflow()` | Compose steps into a workflow |
| `transform()` | Pure data transformation (no side effects) |
| `when()` | Conditional step execution |
| `parallelize()` | Run multiple steps concurrently |
| `createHook()` | Define extensibility hooks for plugins |
| `useQueryGraphStep()` | Built-in step to query data graph |
| `WorkflowData<T>` | Type-safe workflow input |
| `WorkflowResponse<T>` | Type-safe workflow output |
| `StepResponse<T, C>` | Step result + compensation data |

### Core Workflow Domains (37 domains, 200+ workflows)

| Domain | Key Workflows |
|---|---|
| **cart** | createCarts, updateCart, addToCart, completeCart, addShippingMethod |
| **order** | createOrder, updateOrder, cancelOrder, createFulfillment, createShipment |
| **product** | createProducts, updateProducts, deleteProducts, importProducts |
| **payment** | capturePayment, refundPayment, createPaymentSession |
| **customer** | createCustomer, updateCustomer, createCustomerAddress |
| **pricing** | createPriceLists, updatePrices, upsertVariantPrices |
| **promotion** | createPromotion, updatePromotion, addCartPromotions |
| **fulfillment** | createFulfillmentSets, createShippingOptions |
| **inventory** | createInventoryItems, updateInventoryLevels |
| **tax** | createTaxRegions, computeTaxLines |
| **auth** | generateJwtToken, createAuthIdentity |
| **notification** | sendNotifications |

---

## 7. HTTP Layer

### Application Bootstrap

The application starts via `packages/medusa/src/loaders/index.ts`:

```
initializeContainer()
  → featureFlagsLoader()
  → configLoader()
  → pgConnectionLoader()
  → policiesLoader()
  ↓
getResolvedPlugins()
mergePluginModules()
LinkLoader.load()
loadSearchIndexes()
MedusaAppLoader.load()     ← loads all registered modules
WorkflowLoader.load()
subscribersLoader()
jobsLoader()
  ↓
expressLoader()            ← sets up Express middleware stack
adminLoader()              ← serves admin UI
apiLoader()                ← registers all API routes
  ↓
createDefaultsWorkflow()   ← seeds default data
onApplicationStart()
```

### Route Registration

Routes are discovered via file-system conventions:

```
/api/admin/products/route.ts         → GET /admin/products, POST /admin/products
/api/admin/products/[id]/route.ts    → GET /admin/products/:id, POST /admin/products/:id
/api/admin/products/[id]/variants/route.ts → GET /admin/products/:id/variants
```

### CORS & Security Middleware

```typescript
// Global Express middleware stack:
compression()              // gzip responses
express.json()             // parse JSON bodies
express.urlencoded()       // parse URL-encoded bodies
requestIp()                // extract client IP
req.scope = container.createScope()  // DI scope per request
req.requestId = uuid()     // unique request ID
```

---

## 8. Database & ORM

### Technology

- **Database:** PostgreSQL (pg v8.16.3)
- **ORM:** MikroORM (managed via `@medusajs/framework/database`)
- **Migration Tool:** Auto-generated via `yarn migration:create` per module

### Multi-Schema Design

Each module owns its own set of tables. There is **no shared schema** — modules are isolated:

```
product_* tables    → managed by product module
order_* tables      → managed by order module  
cart_* tables       → managed by cart module
customer_* tables   → managed by customer module
payment_* tables    → managed by payment module
...
```

Cross-module relationships are expressed as pivot tables owned by `link-modules`.

### Soft Deletes

All entities support soft deletion. The `deleted_at` column is indexed and all queries automatically filter `WHERE deleted_at IS NULL` unless `withDeleted: true` is specified.

### Transactions

Transactions span within a module. Cross-module consistency is handled at the Workflow level via compensation functions — there is no distributed transaction. Each step commits independently; if a later step fails, compensation rolls back previous steps.

---

## 9. Event Bus System

### Architecture

```
Module Service
  → @EmitEvents() decorator
  → EventBus.emit(event, data)
  → [event-bus-local | event-bus-redis]
  → SubscriberLoader
  → subscriber handlers
```

### Built-In Subscribers (`packages/medusa/src/subscribers/`)

| Subscriber | Events | Purpose |
|---|---|---|
| `configurable-notifications.ts` | order.*, customer.* | Trigger notifications on configured events |
| `payment-webhook.ts` | payment.* | Handle payment provider webhooks |
| `search-ingestion.ts` | product.*, variant.* | Index data for search |

### Event Naming Convention

```
{entity}.{action}
Examples:
  product.created
  order.placed
  order.fulfillment.created
  customer.created
  payment.captured
```

---

## 10. Caching Layer

Medusa has a pluggable caching module:

| Module | Use Case |
|---|---|
| `cache-inmemory` | Development / single-process |
| `cache-redis` | Production / multi-process |

Cache is used for:
- Compiled pricing rule computation results
- Feature flag evaluation results
- Session tokens

---

## 11. Cross-Module Data Linking

Medusa's modules are isolated — they cannot reference each other's tables directly. Instead, **link-modules** (`packages/modules/link-modules`) define pivot tables that associate records across module boundaries.

### Examples

| Link | Modules Joined | Purpose |
|---|---|---|
| `ProductSalesChannel` | product ↔ sales-channel | Scopes products to channels |
| `OrderCart` | order ↔ cart | Associates order with originating cart |
| `CartPaymentCollection` | cart ↔ payment | Links payment to cart |
| `ProductVariantInventoryItem` | product ↔ inventory | Maps variants to inventory |
| `OrderFulfillment` | order ↔ fulfillment | Links fulfillments to orders |
| `CartPromotion` | cart ↔ promotion | Tracks applied promotions |
| `CustomerAccount` | customer ↔ auth | Associates auth identity with customer |

### Query Graph

The **Query Graph** engine allows traversal across module boundaries using declared links:

```typescript
const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)
const { data } = await query.graph({
  entity: "product",
  fields: ["id", "title", "variants.*", "variants.inventory_items.*"],
  filters: { id: productId },
})
```

---

## 12. Worker Modes

Medusa supports three deployment topologies:

### Shared Mode (default)

```typescript
// medusa-config.ts
projectConfig: { workerMode: "shared" }
```

Single process handles both HTTP API and background processing (event consumers, workflow execution). Suitable for development and small deployments.

### Server Mode

```typescript
projectConfig: { workerMode: "server" }
```

Only the HTTP API runs. Background event processing is offloaded to a separate worker process. Requires Redis for event bus.

### Worker Mode

```typescript
projectConfig: { workerMode: "worker" }
```

Only background processing (subscribers, workflows, scheduled jobs). No HTTP API. Deployed alongside one or more server-mode instances.

---

## 13. Plugin System

Plugins extend Medusa by adding:
- Custom API routes
- Custom subscribers
- Custom scheduled jobs
- Custom workflow steps
- Custom module links

Plugin resolution:

```typescript
// medusa-config.ts
plugins: [
  {
    resolve: "./plugins/my-plugin",
    options: { apiKey: "..." }
  }
]
```

Plugin directory structure mirrors the main `packages/medusa/src/` layout.

---

## 14. Admin Dashboard Architecture

The admin dashboard is a standalone React SPA served by Express at `/app/*`:

```
packages/admin/dashboard/src/
├── app.tsx          ← Root application
├── routes/          ← Page route components (mirrors admin API)
├── components/      ← Reusable UI components
├── hooks/           ← React Query hooks for API calls
├── providers/       ← Auth, theme, i18n context
├── i18n/            ← Translation files (en.json + schema)
└── lib/             ← SDK client utilities
```

The dashboard communicates with the backend exclusively through the `/admin/*` API using the `@medusajs/js-sdk`.

---

## 15. Data Flow Walkthrough

### Store Checkout Flow

```
1. Customer adds product to cart
   POST /store/carts/:id/line-items
   → addToCartWorkflow
     → validateVariantInventoryStep
     → addLineItemsStep          (cart module)
     → updateCartPromotionsStep  (promotion module)
     → getVariantsWithPricingStep (pricing module)
     → setTaxLinesStep          (tax module)

2. Customer selects shipping
   POST /store/carts/:id/shipping-methods
   → addShippingMethodToCartWorkflow
     → listShippingOptionsForCartStep
     → addShippingMethodStep
     → refreshCartTaxLinesStep

3. Customer completes checkout
   POST /store/carts/:id/complete
   → completeCartWorkflow
     → confirmVariantInventoryStep  (inventory reservation)
     → createOrderFromCartStep      (order module)
     → createPaymentSessionStep     (payment module)
     → authorizePaymentStep         (Stripe)
     → completeOrderStep
```

### Admin Order Fulfillment Flow

```
1. Admin creates fulfillment
   POST /admin/orders/:id/fulfillments
   → createOrderFulfillmentWorkflow
     → createFulfillmentStep       (fulfillment module)
     → updateOrderFulfillmentStep  (order module)
     → adjustInventoryLevelsStep   (inventory module)
     → emitFulfillmentCreatedEvent

2. Admin creates shipment
   POST /admin/orders/:id/fulfillments/:fid/shipments
   → createShipmentWorkflow
     → createShipmentStep
     → markItemsAsShippedStep
     → sendNotificationStep        (notification module)

3. Admin marks as delivered
   POST /admin/orders/:id/fulfillments/:fid/mark-as-delivered
   → markOrderFulfillmentAsDeliveredWorkflow
```
