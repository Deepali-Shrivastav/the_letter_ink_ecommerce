# The Letter Ink — Medusa Backend: Store API Reference

> **Document:** 04 — Store API Reference  
> **Base URL:** `http://localhost:9000`  
> **Prefix:** `/store`  
> **Auth:** Publishable API key required via `x-publishable-api-key` header (most routes); Customer JWT/session for protected routes.

---

## Table of Contents

1. [Authentication](#1-authentication)
2. [Products](#2-products)
3. [Product Categories](#3-product-categories)
4. [Product Collections](#4-product-collections)
5. [Product Tags](#5-product-tags)
6. [Product Types](#6-product-types)
7. [Product Options](#7-product-options)
8. [Product Variants](#8-product-variants)
9. [Regions](#9-regions)
10. [Currencies](#10-currencies)
11. [Cart](#11-cart)
12. [Payment Collections](#12-payment-collections)
13. [Payment Providers](#13-payment-providers)
14. [Shipping Options](#14-shipping-options)
15. [Orders](#15-orders)
16. [Returns](#16-returns)
17. [Return Reasons](#17-return-reasons)
18. [Customers](#18-customers)
19. [Common Query Parameters](#19-common-query-parameters)

---

## 1. Authentication

Store routes use one of two auth modes:

| Method | Header / Cookie | Use Case |
|---|---|---|
| **Publishable API Key** | `x-publishable-api-key: pk_...` | Required for all store routes |
| **Customer Bearer Token** | `Authorization: Bearer <jwt>` | Authenticated customer endpoints |
| **Customer Session** | Cookie `connect.sid` | Session-based customer auth |

---

## 2. Products

### GET `/store/products`

List published products. Automatically filters `status = published`.

**Middleware:** `authenticate(optional)` → `validateAndTransformQuery` → `filterByValidSalesChannels` → `applyDefaultFilters` → `setPricingContext` → `setTaxContext`

**Query Parameters:**

| Parameter | Type | Description |
|---|---|---|
| `q` | `string` | Full-text search |
| `id` | `string \| string[]` | Filter by product ID(s) |
| `title` | `string` | Filter by title |
| `handle` | `string` | Filter by URL handle |
| `collection_id` | `string \| string[]` | Filter by collection |
| `category_id` | `string \| string[]` | Filter by category |
| `tag_id` | `string \| string[]` | Filter by tag |
| `type_id` | `string \| string[]` | Filter by type |
| `sales_channel_id` | `string \| string[]` | Filter by sales channel |
| `region_id` | `string` | Pricing context: region |
| `country_code` | `string` | Pricing context: country (ISO 2) |
| `province` | `string` | Pricing context: province |
| `cart_id` | `string` | Pricing context: cart |
| `fields` | `string` | Comma-separated fields to include |
| `limit` | `integer` | Records per page (default: 12) |
| `offset` | `integer` | Pagination offset |
| `order` | `string` | Sort field (prefix `-` for desc) |

**Response:**

```json
{
  "products": [
    {
      "id": "prod_01...",
      "title": "Classic Tote",
      "handle": "classic-tote",
      "description": "...",
      "status": "published",
      "thumbnail": "https://...",
      "weight": null,
      "variants": [
        {
          "id": "variant_01...",
          "title": "Default",
          "sku": "TOT-001",
          "prices": [
            {
              "id": "price_01...",
              "currency_code": "usd",
              "amount": 4500
            }
          ]
        }
      ],
      "options": [...],
      "tags": [...],
      "categories": [...],
      "collection": {...},
      "type": {...},
      "images": [...]
    }
  ],
  "count": 100,
  "offset": 0,
  "limit": 12
}
```

---

### GET `/store/products/:id`

Retrieve a single published product.

**Path Parameters:** `id` — Product ID

**Query Parameters:** Same as list, plus `fields` for sparse fieldset.

**Response:**

```json
{
  "product": { ...same shape as list item... }
}
```

---

## 3. Product Categories

### GET `/store/product-categories`

**Query Parameters:** `q`, `id`, `handle`, `parent_category_id`, `include_ancestors_tree`, `include_descendants_tree`, `is_internal` (default: false), `is_active` (default: true), `limit`, `offset`, `fields`

**Response:** `{ "product_categories": [...], "count", "offset", "limit" }`

### GET `/store/product-categories/:id`

**Response:** `{ "product_category": {...} }`

---

## 4. Product Collections

### GET `/store/collections`

**Query Parameters:** `id`, `handle`, `limit`, `offset`, `fields`

**Response:** `{ "collections": [...], "count", "offset", "limit" }`

### GET `/store/collections/:id`

**Response:** `{ "collection": {...} }`

---

## 5. Product Tags

### GET `/store/product-tags`

**Query Parameters:** `id`, `value`, `limit`, `offset`, `fields`

**Response:** `{ "product_tags": [...], "count", "offset", "limit" }`

---

## 6. Product Types

### GET `/store/product-types`

**Response:** `{ "product_types": [...], "count", "offset", "limit" }`

---

## 7. Product Options

### GET `/store/product-options`

**Response:** `{ "product_options": [...], "count", "offset", "limit" }`

### GET `/store/product-options/:id`

**Response:** `{ "product_option": {...} }`

---

## 8. Product Variants

### GET `/store/product-variants`

**Query Parameters:** `id`, `sku`, `product_id`, `title`, `region_id`, `country_code`, `province`, `cart_id`, `limit`, `offset`, `fields`

**Response:** `{ "variants": [...], "count", "offset", "limit" }`

### GET `/store/product-variants/:id`

**Response:** `{ "variant": {...} }`

---

## 9. Regions

### GET `/store/regions`

**Response:** `{ "regions": [...], "count", "offset", "limit" }`

### GET `/store/regions/:id`

**Response:** `{ "region": {...} }`

---

## 10. Currencies

### GET `/store/currencies`

**Response:** `{ "currencies": [...], "count", "offset", "limit" }`

---

## 11. Cart

All cart routes require `x-publishable-api-key`.

### GET `/store/carts/:id`

Retrieve cart by ID.

**Query Parameters:** `fields`

**Response:**

```json
{
  "cart": {
    "id": "cart_01...",
    "email": null,
    "currency_code": "usd",
    "region_id": "reg_01...",
    "total": 4500,
    "subtotal": 4500,
    "tax_total": 0,
    "discount_total": 0,
    "shipping_total": 0,
    "item_total": 4500,
    "items": [
      {
        "id": "li_01...",
        "title": "Classic Tote",
        "variant_id": "variant_01...",
        "product_id": "prod_01...",
        "quantity": 1,
        "unit_price": 4500,
        "subtotal": 4500,
        "total": 4500,
        "adjustments": [...],
        "tax_lines": [...]
      }
    ],
    "shipping_methods": [...],
    "payment_collection": {...},
    "promotions": [...],
    "shipping_address": {...},
    "billing_address": {...}
  }
}
```

---

### POST `/store/carts`

Create a new cart.

**Request Body:**

```json
{
  "region_id": "reg_01...",        // optional
  "sales_channel_id": "sc_01...", // optional
  "currency_code": "usd",         // optional, derived from region
  "email": "user@example.com",    // optional
  "shipping_address": {           // optional
    "first_name": "Jane",
    "last_name": "Doe",
    "address_1": "123 Main St",
    "city": "New York",
    "country_code": "US",
    "postal_code": "10001"
  },
  "billing_address": {...},       // optional
  "items": [                      // optional — pre-seed with items
    { "variant_id": "variant_01...", "quantity": 1 }
  ],
  "metadata": {}                  // optional
}
```

**Response:** `{ "cart": {...} }`

---

### POST `/store/carts/:id`

Update cart (region, email, address, metadata).

**Request Body:**

```json
{
  "region_id": "reg_01...",
  "email": "user@example.com",
  "shipping_address": {...},
  "billing_address": {...},
  "metadata": {}
}
```

**Response:** `{ "cart": {...} }`

---

### POST `/store/carts/:id/customer`

Associate authenticated customer with cart.

**Auth:** Customer JWT/session required.

**Request Body:**

```json
{}
```

**Response:** `{ "cart": {...} }`

---

### POST `/store/carts/:id/line-items`

Add a line item to the cart.

**Request Body:**

```json
{
  "variant_id": "variant_01...",
  "quantity": 2,
  "metadata": {}
}
```

**Response:** `{ "cart": {...} }`

---

### POST `/store/carts/:id/line-items/:line_id`

Update quantity of a line item.

**Request Body:**

```json
{
  "quantity": 3
}
```

**Response:** `{ "cart": {...} }`

---

### DELETE `/store/carts/:id/line-items/:line_id`

Remove a line item from the cart.

**Response:** `{ "cart": {...} }`

---

### POST `/store/carts/:id/promotions`

Apply promotion codes to cart.

**Request Body:**

```json
{
  "promo_codes": ["SUMMER20", "FREESHIP"]
}
```

**Response:** `{ "cart": {...} }`

---

### DELETE `/store/carts/:id/promotions`

Remove promotion codes from cart.

**Request Body:**

```json
{
  "promo_codes": ["SUMMER20"]
}
```

**Response:** `{ "cart": {...} }`

---

### POST `/store/carts/:id/taxes`

Recalculate tax lines for the cart.

**Request Body:**

```json
{
  "force_tax_calculate": true
}
```

**Response:** `{ "cart": {...} }`

---

### POST `/store/carts/:id/shipping-methods`

Add a shipping method to the cart.

**Request Body:**

```json
{
  "option_id": "so_01...",
  "data": {}
}
```

**Response:** `{ "cart": {...} }`

---

### POST `/store/carts/:id/complete`

Complete the cart and place the order.

**Response:**

```json
{
  "type": "order",             // "order" on success, "cart" if payment needs more action
  "order": {
    "id": "order_01...",
    "display_id": 1001,
    "status": "pending",
    "total": 4500,
    ...
  }
}
```

---

## 12. Payment Collections

### POST `/store/payment-collections`

Create a payment collection.

**Request Body:**

```json
{
  "cart_id": "cart_01..."
}
```

**Response:** `{ "payment_collection": {...} }`

---

### POST `/store/payment-collections/:id/payment-sessions`

Initialize a payment session with a provider.

**Request Body:**

```json
{
  "provider_id": "pp_stripe_stripe",
  "data": {}
}
```

**Response:** `{ "payment_collection": {...} }`

---

## 13. Payment Providers

### GET `/store/payment-providers`

List available payment providers for a region.

**Query Parameters:** `region_id` (required)

**Response:** `{ "payment_providers": [{ "id": "pp_stripe_stripe" }], "count" }`

---

## 14. Shipping Options

### GET `/store/shipping-options`

List shipping options for a cart.

**Query Parameters:** `cart_id` (required)

**Response:** `{ "shipping_options": [...], "count" }`

---

## 15. Orders

### GET `/store/orders`

**Auth:** Customer JWT/session required.

List orders for the authenticated customer.

**Query Parameters:** `id`, `status`, `limit`, `offset`, `fields`

**Response:** `{ "orders": [...], "count", "offset", "limit" }`

---

### GET `/store/orders/:id`

Retrieve order by ID (no authentication required — token-based access).

**Query Parameters:** `fields`

**Response:**

```json
{
  "order": {
    "id": "order_01...",
    "display_id": 1001,
    "status": "pending",
    "currency_code": "usd",
    "email": "user@example.com",
    "total": 4500,
    "subtotal": 4000,
    "tax_total": 0,
    "shipping_total": 500,
    "discount_total": 0,
    "items": [...],
    "shipping_methods": [...],
    "shipping_address": {...},
    "billing_address": {...},
    "payment_collections": [...],
    "fulfillments": [...],
    "returns": [...],
    "metadata": {}
  }
}
```

---

### POST `/store/orders/:id/transfer/request`

**Auth:** Customer JWT/session required.

Request to transfer an order to another customer.

**Request Body:**

```json
{
  "email": "newowner@example.com"
}
```

**Response:** `{ "order": {...} }`

---

### POST `/store/orders/:id/transfer/accept`

Accept an incoming order transfer.

**Request Body:**

```json
{
  "token": "<transfer_token>"
}
```

**Response:** `{ "order": {...} }`

---

### POST `/store/orders/:id/transfer/cancel`

**Auth:** Customer JWT/session required.

Cancel a pending order transfer request.

**Response:** `{ "order": {...} }`

---

### POST `/store/orders/:id/transfer/decline`

Decline an incoming order transfer.

**Request Body:**

```json
{
  "token": "<transfer_token>"
}
```

**Response:** `{ "order": {...} }`

---

## 16. Returns

### GET `/store/returns`

**Response:** `{ "returns": [...], "count" }`

---

## 17. Return Reasons

### GET `/store/return-reasons`

**Response:** `{ "return_reasons": [...], "count" }`

### GET `/store/return-reasons/:id`

**Response:** `{ "return_reason": {...} }`

---

## 18. Customers

### POST `/store/customers`

Register a new customer. Can be called with an unregistered token to associate auth identity.

**Auth:** Optional bearer token (unregistered).

**Request Body:**

```json
{
  "email": "user@example.com",
  "first_name": "Jane",
  "last_name": "Doe",
  "phone": "+1234567890",
  "company_name": "Acme Inc",
  "metadata": {}
}
```

**Response:** `{ "customer": {...} }`

---

### GET `/store/customers/me`

**Auth:** Customer JWT/session required.

**Response:** `{ "customer": {...} }`

---

### POST `/store/customers/me`

**Auth:** Customer JWT/session required.

Update authenticated customer profile.

**Request Body:**

```json
{
  "first_name": "Jane",
  "last_name": "Doe",
  "phone": "+1234567890",
  "company_name": "Acme",
  "metadata": {}
}
```

**Response:** `{ "customer": {...} }`

---

### GET `/store/customers/me/addresses`

**Auth:** Customer JWT/session required.

**Query Parameters:** `limit`, `offset`, `fields`

**Response:** `{ "addresses": [...], "count" }`

---

### POST `/store/customers/me/addresses`

**Auth:** Customer JWT/session required.

Add a new address.

**Request Body:**

```json
{
  "address_name": "Home",
  "is_default_shipping": true,
  "is_default_billing": false,
  "first_name": "Jane",
  "last_name": "Doe",
  "company": "Acme",
  "address_1": "123 Main St",
  "address_2": "Apt 4",
  "city": "New York",
  "country_code": "US",
  "province": "NY",
  "postal_code": "10001",
  "phone": "+1234567890",
  "metadata": {}
}
```

**Response:** `{ "customer": {...} }`

---

### GET `/store/customers/me/addresses/:address_id`

**Auth:** Customer JWT/session required.

**Response:** `{ "address": {...} }`

---

### POST `/store/customers/me/addresses/:address_id`

**Auth:** Customer JWT/session required.

Update address.

**Request Body:** Partial address fields.

**Response:** `{ "customer": {...} }`

---

### DELETE `/store/customers/me/addresses/:address_id`

**Auth:** Customer JWT/session required.

**Response:** `{ "address": {...} }`

---

## 19. Common Query Parameters

### Pagination

| Parameter | Type | Default | Description |
|---|---|---|---|
| `limit` | `integer` | varies | Records per page |
| `offset` | `integer` | `0` | Starting record |

### Sorting

| Parameter | Format | Example |
|---|---|---|
| `order` | `field` or `-field` | `order=created_at` (asc), `order=-created_at` (desc) |

### Sparse Fieldset

```
GET /store/products?fields=id,title,handle,variants.id,variants.title
```

Use dot notation for nested fields. Prefix `+` to add fields on top of defaults, `-` to remove.

### Full-Text Search

```
GET /store/products?q=tote bag
```

Uses PostgreSQL full-text search on searchable fields.

### Filter Arrays

```
GET /store/products?id[]=prod_01&id[]=prod_02
GET /store/products?category_id[]=pcat_01&category_id[]=pcat_02
```

### Standard Error Response

```json
{
  "type": "invalid_data",        // or "not_found", "not_allowed", "unauthorized"
  "message": "Description of error",
  "errors": []                   // field-level validation errors (optional)
}
```
