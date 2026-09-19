# 07 — Request Lifecycle
## letter-ink-backend · How a Request Travels Through the System

> **Analysis only. Do not modify the codebase.**

---

## 1. Overview

Every HTTP request to the Medusa backend follows a predictable lifecycle through:

```
Client → Express → Medusa Middleware Stack → Route Handler → IoC Container → Module Service → MikroORM → PostgreSQL
```

The key insight: **all module services are resolved from the IoC container** via `req.scope.resolve(MODULE_KEY)`, not imported directly. This is central to Medusa's dependency injection pattern.

---

## 2. Store Request Lifecycle — Customisation Endpoint

### Request: `GET /store/products/prod_01ABC/customisation`

**Prerequisites:** Frontend sends `x-publishable-api-key` header.

```
Step 1: Client
  GET /store/products/prod_01ABC/customisation
  Headers: x-publishable-api-key: pk_...

Step 2: Medusa Express Router
  Matches file: src/api/store/products/[productId]/customisation/route.ts
  productId = "prod_01ABC"

Step 3: Medusa Middleware Stack
  ├─ CORS check → passes (origin in STORE_CORS)
  ├─ Publishable API key validation → passes
  └─ (no auth required — this is a public store route)

Step 4: Route Handler (GET function in route.ts)
  const customisationService = req.scope.resolve(CUSTOMISATION_MODULE)
  // → resolves CustomisationModuleService from IoC container

Step 5: Service Calls (5 sequential database queries)
  ├─ listCustomisationProductGroups({ product_id: "prod_01ABC" }, { order: { display_order: "ASC" } })
  │   → SELECT * FROM customisation_product_group WHERE product_id = 'prod_01ABC' AND deleted_at IS NULL ORDER BY display_order ASC
  ├─ listCustomisationGroups({ id: [groupId1, groupId2, ...] })
  │   → SELECT * FROM customisation_group WHERE id IN (...) AND deleted_at IS NULL
  ├─ listCustomisationOptions({ group_id: [groupId1, ...], is_available: true }, { order: { display_order: "ASC" } })
  │   → SELECT * FROM customisation_option WHERE group_id IN (...) AND is_available = true AND deleted_at IS NULL ORDER BY display_order ASC
  ├─ listCustomisationCompatibilityRules({ source_option_id: [optId1, optId2, ...] })
  │   → SELECT * FROM customisation_compatibility_rule WHERE source_option_id IN (...) AND deleted_at IS NULL
  └─ listCustomisationTextFields({ product_id: "prod_01ABC" })
      → SELECT * FROM customisation_text_field WHERE product_id = 'prod_01ABC' AND deleted_at IS NULL

Step 6: Assembly (in-memory)
  For each product group → find group → find options → attach compatibility rules → build response

Step 7: Response
  res.json({ groups: [...], text_field: {...} | null })
  HTTP 200
```

**Total DB queries: 5 per request** (no N+1, all done with `IN` clauses — efficient)

---

## 3. Admin Request Lifecycle — Create Customisation Group

### Request: `POST /admin/customisation/groups`

```
Step 1: Client (admin UI or API caller)
  POST /admin/customisation/groups
  Headers: Authorization: Bearer <admin_jwt>
  Body: { "name": "Paper Color", "type": "swatch", "display_order": 1, "is_required": true }

Step 2: Medusa Express Router
  Matches file: src/api/admin/customisation/groups/route.ts

Step 3: Medusa Middleware Stack
  ├─ CORS check → passes (origin in ADMIN_CORS)
  ├─ JWT validation → verifies admin token
  └─ Auth context set on req.auth_context

Step 4: Route Handler (POST function)
  const customisationService = req.scope.resolve(CUSTOMISATION_MODULE)
  const group = await customisationService.createCustomisationGroups(req.body as any)
  // ⚠️ No Zod validation — raw body accepted

Step 5: Service Call
  customisationService.createCustomisationGroups({
    name: "Paper Color",
    type: "swatch",
    display_order: 1,
    is_required: true
  })
  → MikroORM INSERT INTO customisation_group (id, name, type, display_order, is_required, created_at, updated_at)
    VALUES ('cgroup_...', 'Paper Color', 'swatch', 1, true, NOW(), NOW())

Step 6: Response
  res.json({ group: { id: "cgroup_...", name: "Paper Color", ... } })
  HTTP 200 (⚠️ should be 201 Created for POST)
```

**Issue:** POST returns 200 instead of 201 — incorrect HTTP semantics.

---

## 4. Core Cart Lifecycle (Medusa — unchanged)

### Full checkout sequence:

```
Client: POST /store/carts
  → createCartWorkflow runs
  → Returns: { cart: { id: "cart_01...", items: [], ... } }

Client: POST /store/carts/cart_01.../line-items
  Body: { variant_id: "variant_01...", quantity: 1 }
  → addToCartWorkflow runs
  → Medusa core: creates cart_line_item, calculates price, reserves inventory
  → Returns: { cart: { ..., items: [{ id: "li_01...", variant_id: "variant_01...", quantity: 1 }] } }
  ⚠️ NO CUSTOMISATION DATA ATTACHED — this is the gap

Client: POST /store/carts/cart_01.../shipping-methods
  Body: { option_id: "so_01..." }
  → addShippingMethodToCartWorkflow
  → Returns: { cart: { ..., shipping_methods: [...] } }

Client: POST /store/payment-collections
  Body: { cart_id: "cart_01..." }
  → Creates payment collection linked to cart

Client: POST /store/payment-collections/pc_01.../payment-sessions
  Body: { provider_id: "pp_system_default" }
  → initializePaymentSessionWorkflow

Client: POST /store/carts/cart_01.../complete
  → completeCartWorkflow:
    1. Validates cart (items, shipping, payment)
    2. Captures/authorizes payment
    3. Creates order (copies cart_line_item → order_line_item, INCLUDING metadata)
    4. Reserves inventory
  → Returns: { type: "order", order: { id: "order_01...", ... } }
```

---

## 5. Authentication Flows

### Customer Login

```
Client: POST /auth/customer/emailpass
  Body: { email: "customer@example.com", password: "password" }
  → Medusa auth module validates credentials
  → Returns: { token: "eyJ..." }

Client (subsequent requests):
  Headers: Authorization: Bearer eyJ...
  → Medusa extracts customer from JWT
  → req.auth_context = { actor_id: "cust_01...", actor_type: "customer" }
```

### Admin Login

```
Client: POST /auth/user/emailpass
  Body: { email: "admin@example.com", password: "password" }
  → Returns: { token: "eyJ..." }

Client (admin requests):
  Headers: Authorization: Bearer eyJ...
  → Validated by Medusa admin middleware
  → Route handler executes only if token is valid admin JWT
```

---

## 6. Module Service Resolution Pattern

The IoC container pattern used throughout:

```typescript
// In any route handler:
const customisationService: CustomisationModuleService =
  req.scope.resolve(CUSTOMISATION_MODULE)
// CUSTOMISATION_MODULE = "customisation" (string key)

// Medusa core module:
const productService: IProductModuleService =
  req.scope.resolve(Modules.PRODUCT)
// Modules.PRODUCT = "product" (string key)
```

**Why this matters:** This pattern means:
- Services can be swapped without changing route handler code
- Tests can inject mock services
- The module system enforces boundaries — modules cannot import each other directly

---

## 7. Error Handling Lifecycle

### Custom Route Error Handling (current)

The only custom route with error handling is the store customisation endpoint:

```
try {
  // ... all service calls
  res.json({ groups, text_field })
} catch (error) {
  console.error("Error fetching product customisation:", error)
  // Logs full error with stack trace to server stdout
  res.status(500).json({ error: "Failed to fetch customisation config" })
  // Client gets generic message; diagnostic info is lost
}
```

All other custom routes have **no error handling** — unhandled errors fall to Medusa's global error handler.

### Medusa's Global Error Handler

Medusa catches unhandled route errors and returns a structured error response. This is adequate for Medusa core routes but does not provide application-specific error context for custom routes.

---

## 8. Performance Characteristics

| Request | Queries | Estimated latency (local) |
|---|---|---|
| GET `/store/products/:id/customisation` | 5 sequential | ~5-20ms |
| GET `/admin/customisation/groups` | 1 (with relations) | ~2-5ms |
| POST `/admin/customisation/groups` | 1 INSERT | ~2-5ms |
| POST `/store/carts` (core) | ~5-8 | ~20-50ms |
| POST `/store/carts/:id/complete` (core) | ~20-30 | ~100-500ms |

**The 5 sequential queries on the store customisation endpoint** could be parallelized with `Promise.all()` for Steps 2-5 (Steps 2,3,4,5 all depend on Step 1's output). Currently they run in sequence. This is a minor optimization opportunity for future implementation.
