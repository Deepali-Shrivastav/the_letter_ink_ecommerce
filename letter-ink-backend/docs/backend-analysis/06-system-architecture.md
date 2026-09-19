# 06 — System Architecture
## letter-ink-backend · Medusa 2.21.0

> **Analysis only. Do not modify the codebase.**

---

## 1. Architectural Style

**Medusa Modular Architecture** — a framework-opinionated modular monolith where:

- Medusa core provides ~18 commerce domain modules, each with its own isolated database schema
- Business logic runs inside **workflows** composed of typed, transactional steps
- The HTTP layer is entirely **file-based** (`src/api/store|admin/**/route.ts`)
- Cross-module data relationships use a **link system** (not SQL foreign keys between module schemas)
- All services are accessed through Medusa's built-in **IoC container** (`req.scope.resolve(MODULE)`)
- Background processing uses **Redis-backed event bus** with subscriber pattern

---

## 2. High-Level Architecture Diagram

```mermaid
flowchart TD
    FE["yournextstore Frontend\n(Next.js — apps/storefront ABSENT)"]
    Admin["Medusa Admin Dashboard\n@medusajs/dashboard\nhttp://localhost:9000/app"]
    API["Medusa HTTP Server\nExpress — http://localhost:9000"]
    AuthMW["Auth Middleware\nJWT / Session / Publishable Key"]
    FileRoutes["File-Based Route Handlers\nsrc/api/store/** | src/api/admin/**"]
    Container["IoC Container\nreq.scope.resolve()"]
    CoreModules["Medusa Core Modules\nProduct · Cart · Order · Inventory\nPayment · Fulfillment · Customer\nPricing · Promotion · Tax · Auth · ..."]
    CustomMod["Custom Customisation Module\nsrc/modules/customisation\nGroups · Options · TextFields\nCompatibilityRules · ProductGroups"]
    LinkSvc["Medusa Link System\nCross-module associations\n(product ↔ customisation_group)"]
    ORM["MikroORM\n(managed by Medusa)"]
    PG[("PostgreSQL\nmedusa-letter-ink-backend\n:5432")]
    Redis[("Redis\n:6379\nEvent Bus + Cache")]
    EventBus["Medusa Event Bus"]
    Subscribers["Subscribers\nsrc/subscribers/ — EMPTY"]
    Jobs["Scheduled Jobs\nsrc/jobs/ — EMPTY"]
    Workflows["Custom Workflows\nsrc/workflows/ — EMPTY"]
    AdminWidget["Admin Widget\nproduct-customisation-widget.tsx"]

    FE -->|"HTTP + x-publishable-api-key"| API
    Admin --> API
    API --> AuthMW
    AuthMW --> FileRoutes
    FileRoutes --> Container
    Container --> CoreModules
    Container --> CustomMod
    CoreModules --> LinkSvc
    CustomMod --> LinkSvc
    CoreModules --> ORM
    CustomMod --> ORM
    ORM --> PG
    Container --> EventBus
    EventBus --> Subscribers
    EventBus --> Redis
    Container --> Jobs
    Container --> Workflows
    Admin --> AdminWidget
    AdminWidget -->|"fetch /admin/customisation/products/:id"| API
```

---

## 3. Request Lifecycle (Simplified)

```mermaid
sequenceDiagram
    participant C as Client
    participant M as Medusa HTTP
    participant Auth as Auth Middleware
    participant R as Route Handler
    participant Scope as IoC Container
    participant Svc as Module Service
    participant ORM as MikroORM
    participant PG as PostgreSQL

    C->>M: HTTP Request
    M->>Auth: Verify JWT / Session / API Key
    Auth-->>M: authenticated user / context
    M->>R: route.ts handler (GET/POST/PATCH/DELETE)
    R->>Scope: req.scope.resolve(MODULE)
    Scope-->>R: service instance
    R->>Svc: service.listXxx() / createXxx() / updateXxx()
    Svc->>ORM: Entity Manager operations
    ORM->>PG: SQL query
    PG-->>ORM: result rows
    ORM-->>Svc: entity objects
    Svc-->>R: data
    R-->>M: res.json({ ... })
    M-->>C: HTTP Response
```

---

## 4. Module Architecture

```mermaid
flowchart TD
    subgraph "Medusa Core Modules"
        PRODUCT["Product Module\nproduct, variant, option\ncategory, collection, image"]
        CART["Cart Module\ncart, line_item\nshipping, discount"]
        ORDER["Order Module\norder, order_item\nreturn, fulfillment_ref"]
        INVENTORY["Inventory Module\ninventory_item\ninventory_level\nreservation"]
        STOCK["Stock Location Module\nstock_location\nstock_location_address"]
        PAYMENT["Payment Module\npayment_collection\npayment, payment_session"]
        FULFILLMENT["Fulfillment Module\nfulfillment_set\nservice_zone, geo_zone\nshipping_option, fulfillment"]
        CUSTOMER["Customer Module\ncustomer, customer_group\naddress"]
        PRICING["Pricing Module\nprice_set, price_rule\ncurrency, money_amount"]
        PROMOTION["Promotion Module\npromotion, campaign\ndiscount_rule"]
        TAX["Tax Module\ntax_region, tax_rate\ntax_provider"]
        AUTH["Auth Module\nauth_identity\nprovider_identity"]
        STORE["Store Module\nstore, store_currency"]
        NOTIFICATION["Notification Module\nnotification, notification_provider"]
        FILE["File Module\nfile_upload, file_provider"]
        APIKEY["API Key Module\napi_key (publishable/secret)"]
        SALESCHANNEL["Sales Channel Module\nsales_channel"]
        CURRENCY["Currency Module\ncurrency definitions"]
    end

    subgraph "Custom Application Module"
        CUSTOMISATION["Customisation Module\nCustomisationGroup\nCustomisationOption\nCustomisationTextField\nCustomisationCompatibilityRule\nCustomisationProductGroup"]
    end

    subgraph "Module Links (cross-module associations)"
        LINK1["product ↔ customisation_group\n(1-to-many)\nsrc/links/product-customisation.ts"]
        LINK2["stock_location ↔ fulfillment_provider"]
        LINK3["stock_location ↔ fulfillment_set"]
        LINK4["sales_channel ↔ api_key"]
        LINK5["sales_channel ↔ stock_location"]
    end

    PRODUCT --- LINK1
    CUSTOMISATION --- LINK1
    STOCK --- LINK2
    FULFILLMENT --- LINK2
    STOCK --- LINK3
    FULFILLMENT --- LINK3
    SALESCHANNEL --- LINK4
    APIKEY --- LINK4
    SALESCHANNEL --- LINK5
    STOCK --- LINK5
```

---

## 5. Database Schema Overview (Custom Module)

```mermaid
erDiagram
    customisation_group {
        text id PK
        text name
        text type "swatch|chip|text"
        int display_order
        bool is_required
        timestamptz created_at
        timestamptz updated_at
        timestamptz deleted_at
    }
    customisation_option {
        text id PK
        text label
        text value
        text color_hex "nullable"
        bool is_light_color
        int display_order
        bool is_available
        text group_id "not FK-enforced after migration 2"
        timestamptz created_at
        timestamptz updated_at
        timestamptz deleted_at
    }
    customisation_text_field {
        text id PK
        text product_id "cross-module ref, no FK"
        text label
        text placeholder
        int max_chars
        bool is_required
        timestamptz created_at
        timestamptz updated_at
        timestamptz deleted_at
    }
    customisation_compatibility_rule {
        text id PK
        text source_option_id "cross-module ref, no FK"
        text target_option_id "cross-module ref, no FK"
        timestamptz created_at
        timestamptz updated_at
        timestamptz deleted_at
    }
    customisation_product_group {
        text id PK
        text product_id "cross-module ref, no FK"
        text group_id "cross-module ref, no FK"
        int display_order
        bool is_required
        timestamptz created_at
        timestamptz updated_at
        timestamptz deleted_at
    }

    customisation_group ||--o{ customisation_option : "group_id (text, no DB FK)"
    customisation_group ||--o{ customisation_product_group : "group_id (text, no DB FK)"
    customisation_option ||--o{ customisation_compatibility_rule : "source_option_id"
    customisation_option ||--o{ customisation_compatibility_rule : "target_option_id"
```

---

## 6. Checkout Flow (Medusa Core — unchanged)

```mermaid
sequenceDiagram
    participant C as Client
    participant CartAPI as /store/carts
    participant CartWF as Cart Workflows (Core)
    participant CheckoutWF as Checkout Workflows (Core)
    participant PayAPI as /store/payment-collections
    participant OrderWF as Order Workflows (Core)

    C->>CartAPI: POST /store/carts
    CartAPI->>CartWF: createCartWorkflow
    CartWF-->>C: { cart }

    C->>CartAPI: POST /store/carts/:id/line-items
    CartAPI->>CartWF: addToCartWorkflow
    CartWF-->>C: { cart }

    C->>CartAPI: POST /store/carts/:id/shipping-methods
    CartAPI->>CartWF: addShippingMethodToCartWorkflow

    C->>PayAPI: POST /store/payment-collections
    PayAPI->>CheckoutWF: initializePaymentSessionWorkflow

    C->>PayAPI: POST /store/payment-collections/:id/sessions/:id/authorize
    PayAPI->>CheckoutWF: authorizePaymentSessionWorkflow

    C->>CartAPI: POST /store/carts/:id/complete
    CartAPI->>OrderWF: completeCartWorkflow
    OrderWF-->>C: { type: "order", order }
```

---

## 7. Order Flow (Medusa Core — unchanged)

```mermaid
sequenceDiagram
    participant Cart as Cart (completed)
    participant OrderWF as completeCartWorkflow
    participant PayWF as capturePaymentWorkflow
    participant InvWF as Inventory Workflows
    participant FulfWF as createFulfillmentWorkflow
    participant DB as PostgreSQL

    Cart->>OrderWF: complete cart
    OrderWF->>DB: create order record
    OrderWF->>DB: create order line items
    OrderWF->>DB: reserve inventory
    OrderWF->>InvWF: confirmInventoryStep
    OrderWF->>PayWF: capture payment (if auto-capture)
    PayWF->>DB: update payment status
    OrderWF-->>Cart: { order }

    Note over FulfWF: Admin triggers fulfillment
    FulfWF->>DB: create fulfillment record
    FulfWF->>InvWF: deductInventoryStep
    DB-->>FulfWF: updated
```

---

## 8. Event-Driven Architecture

```mermaid
flowchart TD
    Event["Domain Event\n(e.g. order.placed, product.created)"]
    Bus["Redis Event Bus\n(Medusa managed)"]
    SubDir["src/subscribers/\n(EMPTY — no custom subscribers)"]
    CoreSubs["Medusa Core Subscribers\n(internal — e.g. inventory sync)"]

    Event --> Bus
    Bus --> SubDir
    Bus --> CoreSubs

    style SubDir stroke-dasharray: 5 5
```

**Status:** No custom event subscribers have been implemented. The event bus is active (Redis connected) but no application-specific events are being consumed.

---

## 9. Application Boundaries

| Boundary | Owner | Status |
|---|---|---|
| Store HTTP API (`/store/*`) | Medusa core + custom | Active |
| Admin HTTP API (`/admin/*`) | Medusa core + custom | Active |
| Admin Dashboard (`/app`) | Medusa dashboard | Active |
| Custom Admin Widget | Application | Active (with broken import) |
| Event Subscribers | Application | Absent |
| Scheduled Jobs | Application | Absent |
| Custom Workflows | Application | Absent |
| Storefront (`apps/storefront/`) | Application | Absent |

---

## 10. Key Architectural Decisions Observed

| Decision | Implementation | Notes |
|---|---|---|
| Module isolation | Each module owns its own DB schema | Cross-module data via links, not SQL FKs |
| Dependency injection | Medusa IoC container via `req.scope.resolve()` | No direct imports of service instances |
| File-based routing | `route.ts` convention | No router registration |
| Workflows for business logic | Convention (not yet followed for custom code) | All custom logic is in route handlers |
| Soft deletes | All custom tables have `deleted_at` | Consistent with Medusa core |
| No microservices | Single Node.js process | Appropriate for current scale |
| Redis for events + cache | Configured, not heavily used by custom code | Framework manages core usage |
