# 08 — API Architecture
## letter-ink-backend · Complete API Inventory

> **Analysis only. Do not modify the codebase.**

---

## 1. API Structure Overview

Medusa v2 uses **file-based routing**. Every `route.ts` file under `src/api/` becomes an endpoint. The directory structure directly maps to the URL path.

| Prefix | Audience | Auth required |
|---|---|---|
| `/store/*` | Customer-facing (public + authenticated customers) | Optional (bearer token for customer) + Publishable API key |
| `/admin/*` | Operations team | Admin JWT required |
| `/auth/*` | Authentication | None or credentials |
| `/hooks/*` | Webhooks (e.g., Stripe) | Provider signature |

---

## 2. Custom Application API Routes

These routes are **specific to The Letter Ink** — built on top of Medusa.

### Store Routes (customer-facing)

| Method | Path | Auth | Status | Description |
|---|---|---|---|---|
| GET | `/store/products/:productId/customisation` | None (public) | ✅ Implemented | Get full assembled customisation configuration for a product (groups, options, compatibility rules, text field) |
| GET | `/store/custom` | None | ✅ Implemented (placeholder) | Returns 200 — stub for future use |

**Store customisation endpoint detail (`GET /store/products/:productId/customisation`):**

```
Response schema:
{
  groups: Array<{
    id: string,
    name: string,
    type: "swatch" | "chip" | "text",
    display_order: number,
    is_required: boolean,        // from customisation_product_group
    options: Array<{
      id: string,
      label: string,
      value: string,
      color_hex: string | null,
      is_light_color: boolean,
      display_order: number,
      is_available: boolean,
      group_id: string
    }>,
    compatibility_rules?: Record<string, string[]>
    // key = source option.value, value = array of target option IDs
    // only present if at least one rule exists for this group's options
  }>,
  text_field: {
    id: string,
    product_id: string,
    label: string,
    placeholder: string,
    max_chars: number,
    is_required: boolean
  } | null
}
```

**Known issues:**
- `compatibility_rules` values are **option IDs** (not option values) — inconsistent with keys being values
- No authentication — any product ID can be queried
- If product has no groups, returns `{ groups: [], text_field: null }` (good)
- Errors return generic `{ error: "Failed to fetch customisation config" }` with status 500

---

### Admin Routes (operations team)

| Method | Path | Auth | Status | Description |
|---|---|---|---|---|
| GET | `/admin/customisation/groups` | Admin | ✅ Implemented | List all customisation groups with their options |
| POST | `/admin/customisation/groups` | Admin | ✅ Implemented | Create a new customisation group |
| PATCH | `/admin/customisation/groups/:id` | Admin | ✅ Implemented | Update a group |
| DELETE | `/admin/customisation/groups/:id` | Admin | ✅ Implemented | Soft-delete a group |
| GET | `/admin/customisation/compatibility` | Admin | ✅ Implemented | List all compatibility rules |
| POST | `/admin/customisation/compatibility` | Admin | ✅ Implemented | Create a compatibility rule |
| DELETE | `/admin/customisation/compatibility/:id` | Admin | ✅ Implemented | Delete a compatibility rule |
| GET | `/admin/customisation/products/:productId` | Admin | ✅ Implemented | Get groups linked to a product |
| POST | `/admin/customisation/products/:productId` | Admin | ✅ Implemented | Link a group to a product |
| GET | `/admin/custom` | Admin | ✅ Implemented (placeholder) | Returns 200 — stub |

**Missing admin routes (not yet implemented):**
- `PATCH /admin/customisation/products/:productId/groups/:productGroupId` — update is_required or display_order
- `DELETE /admin/customisation/products/:productId/groups/:productGroupId` — unlink group from product
- `GET /admin/customisation/groups/:id/options` — options for a specific group
- `POST /admin/customisation/groups/:id/options` — add option to group
- `PATCH /admin/customisation/options/:id` — update option
- `DELETE /admin/customisation/options/:id` — delete option
- Full text field CRUD
- Production management routes (future)

---

## 3. Medusa Core Store API Reference

These endpoints are provided by Medusa **automatically** — zero custom code required.

### Products

| Method | Path | Description |
|---|---|---|
| GET | `/store/products` | List products (with filters: category, collection, tags, price range, etc.) |
| GET | `/store/products/:id` | Get single product with variants, options, prices |

### Collections

| Method | Path | Description |
|---|---|---|
| GET | `/store/collections` | List collections |
| GET | `/store/collections/:id` | Get collection |

### Categories

| Method | Path | Description |
|---|---|---|
| GET | `/store/product-categories` | List categories (tree structure) |
| GET | `/store/product-categories/:id` | Get category |

### Cart

| Method | Path | Description |
|---|---|---|
| POST | `/store/carts` | Create a new cart |
| GET | `/store/carts/:id` | Get cart |
| POST | `/store/carts/:id/line-items` | Add line item to cart |
| PATCH | `/store/carts/:id/line-items/:id` | Update line item quantity |
| DELETE | `/store/carts/:id/line-items/:id` | Remove line item |
| POST | `/store/carts/:id/shipping-methods` | Add shipping method |
| POST | `/store/carts/:id/complete` | Complete cart → create order |
| POST | `/store/carts/:id/taxes` | Calculate taxes |

### Orders

| Method | Path | Description |
|---|---|---|
| GET | `/store/orders` | List customer orders |
| GET | `/store/orders/:id` | Get order |
| POST | `/store/orders/by-cart-id` | Get order by cart ID |

### Customer Auth

| Method | Path | Description |
|---|---|---|
| POST | `/auth/customer/emailpass/register` | Register customer |
| POST | `/auth/customer/emailpass` | Login customer |
| POST | `/auth/customer/emailpass/callback` | Auth callback |
| POST | `/auth/token/refresh` | Refresh access token |
| DELETE | `/auth` | Logout |

### Customer

| Method | Path | Description |
|---|---|---|
| POST | `/store/customers` | Create customer (registration) |
| GET | `/store/customers/me` | Get current customer |
| PATCH | `/store/customers/me` | Update customer |
| GET | `/store/customers/me/addresses` | Get customer addresses |
| POST | `/store/customers/me/addresses` | Add address |
| PATCH | `/store/customers/me/addresses/:id` | Update address |
| DELETE | `/store/customers/me/addresses/:id` | Delete address |
| GET | `/store/customers/me/payment-methods` | Get saved payment methods |

### Payments

| Method | Path | Description |
|---|---|---|
| POST | `/store/payment-collections` | Create payment collection |
| GET | `/store/payment-collections/:id` | Get payment collection |
| POST | `/store/payment-collections/:id/payment-sessions` | Initialize payment session |
| POST | `/store/payment-collections/:id/payment-sessions/:session_id` | Update payment session |

### Regions and Shipping

| Method | Path | Description |
|---|---|---|
| GET | `/store/regions` | List regions |
| GET | `/store/regions/:id` | Get region |
| GET | `/store/shipping-options` | List shipping options for cart |

### Returns

| Method | Path | Description |
|---|---|---|
| POST | `/store/returns` | Create return request |

---

## 4. Medusa Core Admin API Reference (Selected)

| Method | Path | Description |
|---|---|---|
| GET | `/admin/products` | List products with full details |
| POST | `/admin/products` | Create product |
| PATCH | `/admin/products/:id` | Update product |
| DELETE | `/admin/products/:id` | Delete product |
| POST | `/admin/products/:id/variants` | Add variant |
| GET | `/admin/orders` | List orders |
| POST | `/admin/orders/:id/fulfillments` | Create fulfillment |
| POST | `/admin/orders/:id/returns` | Create return |
| GET | `/admin/customers` | List customers |
| GET | `/admin/inventory-items` | List inventory items |
| GET | `/admin/reservations` | List inventory reservations |
| POST | `/admin/regions` | Create region |
| POST | `/admin/tax-regions` | Create tax region |
| GET | `/admin/promotions` | List promotions |
| POST | `/admin/promotions` | Create promotion |
| GET | `/admin/shipping-options` | List shipping options |
| GET | `/admin/uploads` | List uploaded files |
| POST | `/admin/uploads` | Upload file |
| GET | `/admin/api-keys` | List API keys |
| POST | `/admin/api-keys` | Create API key |
| GET | `/admin/sales-channels` | List sales channels |
| GET | `/admin/stores` | List stores |
| POST | `/admin/users/create-invite` | Invite admin user |

---

## 5. API Authentication

| Context | Mechanism | Header |
|---|---|---|
| Store (public) | Publishable API key | `x-publishable-api-key: pk_...` |
| Store (logged-in customer) | JWT bearer token | `Authorization: Bearer <token>` |
| Admin | JWT bearer token | `Authorization: Bearer <token>` |
| Admin (cookie) | Session cookie | `Cookie: medusa-auth=...` |
| Webhooks | Provider-specific signature | Varies by provider |

---

## 6. Missing API Endpoints (Required for Letter Ink)

| Priority | Method | Path | Description |
|---|---|---|---|
| **Critical** | POST | `/store/carts/:id/line-items-with-customisation` | Add to cart with customisation data (or extend existing endpoint) |
| **Critical** | GET | `/store/products/:id/customisation` | Exists — but needs response format fix |
| **High** | GET | `/admin/production-orders` | List orders needing production action |
| **High** | PATCH | `/admin/production-orders/:id/status` | Update production status |
| **High** | GET | `/admin/customisation/groups/:id/options` | List options for a group |
| **High** | POST | `/admin/customisation/groups/:id/options` | Add option to group |
| **High** | PATCH | `/admin/customisation/options/:id` | Update option |
| **High** | DELETE | `/admin/customisation/options/:id` | Delete option |
| **Medium** | DELETE | `/admin/customisation/products/:productId/groups/:id` | Unlink group from product |
| **Medium** | GET/POST/DELETE | `/admin/customisation/products/:productId/text-field` | Full text field CRUD |
