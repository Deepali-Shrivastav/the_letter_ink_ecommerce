# The Letter Ink — Medusa Backend: Admin API Reference

> **Document:** 05 — Admin API Reference  
> **Base URL:** `http://localhost:9000`  
> **Prefix:** `/admin`  
> **Auth:** Admin JWT bearer token required for all routes.  
> **Header:** `Authorization: Bearer <admin_jwt>`

---

## Table of Contents

1. [Authentication](#1-authentication)
2. [Products](#2-products)
3. [Product Variants](#3-product-variants)
4. [Product Options](#4-product-options)
5. [Product Categories](#5-product-categories)
6. [Product Collections](#6-product-collections)
7. [Product Tags](#7-product-tags)
8. [Product Types](#8-product-types)
9. [Orders](#9-orders)
10. [Draft Orders](#10-draft-orders)
11. [Order Changes](#11-order-changes)
12. [Order Edits](#12-order-edits)
13. [Returns](#13-returns)
14. [Claims](#14-claims)
15. [Exchanges](#15-exchanges)
16. [Fulfillments](#16-fulfillments)
17. [Fulfillment Sets](#17-fulfillment-sets)
18. [Shipping Options](#18-shipping-options)
19. [Shipping Profiles](#19-shipping-profiles)
20. [Customers](#20-customers)
21. [Customer Groups](#21-customer-groups)
22. [Payments](#22-payments)
23. [Payment Collections](#23-payment-collections)
24. [Promotions](#24-promotions)
25. [Campaigns](#25-campaigns)
26. [Price Lists](#26-price-lists)
27. [Price Preferences](#27-price-preferences)
28. [Inventory Items](#28-inventory-items)
29. [Reservations](#29-reservations)
30. [Stock Locations](#30-stock-locations)
31. [Regions](#31-regions)
32. [Tax Regions](#32-tax-regions)
33. [Tax Rates](#33-tax-rates)
34. [Sales Channels](#34-sales-channels)
35. [Currencies](#35-currencies)
36. [Stores](#36-stores)
37. [Users](#37-users)
38. [Invites](#38-invites)
39. [API Keys](#39-api-keys)
40. [Uploads](#40-uploads)
41. [Notifications](#41-notifications)
42. [Search](#42-search)
43. [Workflow Executions](#43-workflow-executions)
44. [RBAC](#44-rbac)
45. [Feature Flags](#45-feature-flags)
46. [Return Reasons & Refund Reasons](#46-return-reasons--refund-reasons)
47. [Fulfillment Providers](#47-fulfillment-providers)
48. [Tax Providers](#48-tax-providers)
49. [Translations & Locales](#49-translations--locales)
50. [Admin Views & Layouts](#50-admin-views--layouts)

---

## 1. Authentication

All admin routes require a valid JWT obtained from the Auth API:

```
POST /auth/user/emailpass        → get token
Authorization: Bearer <token>   → use on all admin routes
```

Additionally, all admin routes have the `setSecretApiKeyContext` middleware applied globally, which sets the internal secret API key context for module communication.

---

## 2. Products

### GET `/admin/products`

List all products (including drafts).

**RBAC Policy:** `product:read`

**Query Parameters:**

| Parameter | Type | Description |
|---|---|---|
| `q` | `string` | Full-text search |
| `id` | `string \| string[]` | Filter by ID(s) |
| `title` | `string` | |
| `handle` | `string` | |
| `status` | `enum[]` | `draft`, `proposed`, `published`, `rejected` |
| `collection_id` | `string[]` | |
| `category_id` | `string[]` | |
| `tag_id` | `string[]` | |
| `type_id` | `string[]` | |
| `sales_channel_id` | `string[]` | |
| `is_giftcard` | `boolean` | |
| `limit` | `integer` | Default: 50 |
| `offset` | `integer` | |
| `order` | `string` | |
| `fields` | `string` | |

**Response:** `{ "products": [...], "count", "offset", "limit" }`

---

### POST `/admin/products`

Create a new product.

**RBAC Policy:** `product:create`

**Request Body:**

```json
{
  "title": "Classic Tote Bag",
  "subtitle": null,
  "description": "A premium tote bag.",
  "handle": "classic-tote-bag",
  "is_giftcard": false,
  "status": "draft",
  "thumbnail": "https://...",
  "material": "Canvas",
  "weight": 500,
  "length": 30,
  "height": 40,
  "width": 15,
  "hs_code": null,
  "origin_country": "IN",
  "mid_code": null,
  "discountable": true,
  "metadata": {},
  "type_id": "ptyp_01...",
  "collection_id": "pcol_01...",
  "tags": [{ "id": "ptag_01..." }],
  "categories": [{ "id": "pcat_01..." }],
  "options": [
    { "title": "Color", "values": ["Red", "Blue"] }
  ],
  "variants": [
    {
      "title": "Red",
      "sku": "TOTE-RED",
      "prices": [
        { "currency_code": "usd", "amount": 4500 }
      ],
      "options": { "Color": "Red" },
      "manage_inventory": true,
      "allow_backorder": false
    }
  ]
}
```

**Response:** `{ "product": {...} }`

---

### GET `/admin/products/:id`

Retrieve product by ID. **Response:** `{ "product": {...} }`

### POST `/admin/products/:id`

Update a product. **Request Body:** Partial product fields. **Response:** `{ "product": {...} }`

### DELETE `/admin/products/:id`

Soft-delete a product. **Response:** `{ "id", "object": "product", "deleted": true }`

### POST `/admin/products/:id/variants`

Add a variant to a product.

### GET `/admin/products/:id/variants`

List variants of a product.

### POST `/admin/products/batch`

Batch create, update, delete products.

**Request Body:**
```json
{
  "create": [...],
  "update": [...],
  "delete": ["prod_01..."]
}
```

### POST `/admin/products/export`

Export products to CSV. Returns a workflow execution ID.

### POST `/admin/products/import`

Import products from CSV file.

### GET `/admin/products/imports`

List product import operations.

---

## 3. Product Variants

### GET `/admin/product-variants`

List all product variants across all products.

### GET `/admin/product-variants/:id`

### POST `/admin/product-variants/:id`

### DELETE `/admin/product-variants/:id`

### POST `/admin/product-variants/batch`

---

## 4. Product Options

### GET `/admin/product-options`

### GET `/admin/product-options/:id`

### POST `/admin/product-options/:id`

### DELETE `/admin/product-options/:id`

### POST `/admin/products/:id/options`

Add option to product.

### DELETE `/admin/products/:id/options/:option_id`

---

## 5. Product Categories

### GET `/admin/product-categories`

### POST `/admin/product-categories`

**Request Body:**
```json
{
  "name": "Bags",
  "description": "All bag products",
  "handle": "bags",
  "is_active": true,
  "is_internal": false,
  "parent_category_id": null,
  "rank": 0,
  "metadata": {}
}
```

### GET `/admin/product-categories/:id`

### POST `/admin/product-categories/:id`

### DELETE `/admin/product-categories/:id`

### POST `/admin/product-categories/:id/products/batch`

Add/remove products from category.

---

## 6. Product Collections

### GET `/admin/collections`

### POST `/admin/collections`

**Request Body:**
```json
{
  "title": "Summer Collection",
  "handle": "summer-collection",
  "metadata": {}
}
```

### GET `/admin/collections/:id`

### POST `/admin/collections/:id`

### DELETE `/admin/collections/:id`

### POST `/admin/collections/:id/products/batch`

Link products to collection.

---

## 7. Product Tags

### GET `/admin/product-tags` · POST · GET `:id` · POST `:id` · DELETE `:id`

### POST `/admin/product-tags/batch`

---

## 8. Product Types

### GET `/admin/product-types` · POST · GET `:id` · POST `:id` · DELETE `:id`

---

## 9. Orders

### GET `/admin/orders`

**RBAC Policy:** `order:read`

**Query Parameters:** `id`, `status`, `display_id`, `email`, `region_id`, `currency_code`, `sales_channel_id`, `customer_id`, `is_draft_order` (always false here), `created_at`, `updated_at`, `q`, `limit`, `offset`, `order`, `fields`

**Response:**

```json
{
  "orders": [
    {
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
      "customer_id": "cus_01...",
      "region_id": "reg_01...",
      "items": [...],
      "shipping_address": {...},
      "billing_address": {...},
      "fulfillments": [...],
      "payment_collections": [...],
      "returns": []
    }
  ],
  "count": 50,
  "offset": 0,
  "limit": 20
}
```

---

### GET `/admin/orders/:id`

Retrieve single order. **RBAC Policy:** `order:read`

### POST `/admin/orders/:id`

Update order (email, customer, address, metadata, etc.). **RBAC Policy:** `order:update`

### GET `/admin/orders/:id/line-items`

### GET `/admin/orders/:id/shipping-options`

Available shipping options for re-shipping.

### GET `/admin/orders/:id/changes`

Order change history.

### GET `/admin/orders/:id/preview`

Preview order with pending changes applied.

### POST `/admin/orders/export`

Export orders to CSV.

---

### POST `/admin/orders/:id/archive`

Archive a completed order. **RBAC Policy:** `order:update`

### POST `/admin/orders/:id/cancel`

Cancel an order. **RBAC Policy:** `order:update`

### POST `/admin/orders/:id/complete`

Mark order as complete.

**Request Body:**
```json
{
  "force_complete": false   // complete even if not fully fulfilled
}
```

### POST `/admin/orders/:id/payment-sessions/authorize`

Manually authorize a payment session.

**Request Body:**
```json
{
  "payment_session_id": "payses_01..."
}
```

### POST `/admin/orders/:id/credit-lines`

**RBAC Policy:** `credit_line:create`

Add credit line to order.

**Request Body:**
```json
{
  "reference": "manual",
  "reference_id": "...",
  "amount": 500
}
```

### POST `/admin/orders/:id/fulfillments`

Create a fulfillment for order items. **RBAC Policy:** `fulfillment:create`

**Request Body:**
```json
{
  "location_id": "sloc_01...",
  "items": [
    { "id": "ordli_01...", "quantity": 1 }
  ],
  "shipping_option_id": "so_01...",
  "send_notification": true,
  "metadata": {}
}
```

### POST `/admin/orders/:id/fulfillments/:fulfillment_id/cancel`

Cancel a fulfillment. **RBAC Policy:** `fulfillment:update`

**Request Body:** `{ "no_notification": false }`

### POST `/admin/orders/:id/fulfillments/:fulfillment_id/shipments`

Mark fulfillment as shipped.

**Request Body:**
```json
{
  "labels": [
    { "tracking_number": "...", "tracking_url": "...", "label_url": "..." }
  ],
  "send_notification": true,
  "metadata": {}
}
```

### POST `/admin/orders/:id/fulfillments/:fulfillment_id/mark-as-delivered`

Mark fulfillment as delivered.

**Request Body:** `{ "no_notification": false }`

### POST `/admin/orders/:id/transfer`

Transfer order to a registered customer.

**Request Body:**
```json
{
  "customer_id": "cus_01..."
}
```

### POST `/admin/orders/:id/transfer/guest`

Transfer order to a guest (by email).

**Request Body:**
```json
{
  "email": "guest@example.com"
}
```

### POST `/admin/orders/:id/transfer/cancel`

Cancel pending transfer.

---

## 10. Draft Orders

### GET `/admin/draft-orders`

Lists draft orders (`is_draft_order: true`).

### POST `/admin/draft-orders`

Create a draft order.

**Request Body:**
```json
{
  "status": "draft",
  "email": "customer@example.com",
  "region_id": "reg_01...",
  "currency_code": "usd",
  "customer_id": "cus_01...",
  "shipping_address": {...},
  "billing_address": {...},
  "items": [
    { "variant_id": "variant_01...", "quantity": 1, "unit_price": 4500 }
  ],
  "shipping_methods": [
    { "option_id": "so_01...", "data": {} }
  ],
  "no_notification_order": false,
  "metadata": {}
}
```

### GET `/admin/draft-orders/:id`

### POST `/admin/draft-orders/:id`

### DELETE `/admin/draft-orders/:id`

### POST `/admin/draft-orders/:id/convert`

Convert draft order to a live order.

---

## 11. Order Changes

### GET `/admin/order-changes/:id`

Retrieve an order change.

### POST `/admin/order-changes/:id/confirm`

Confirm a pending order change.

### POST `/admin/order-changes/:id/cancel`

Cancel a pending order change.

### POST `/admin/order-changes/:id/decline`

Decline an order change request.

---

## 12. Order Edits

**Order edits** modify live order items while creating a reversible OrderChange.

### POST `/admin/order-edits`

Begin an order edit.

**Request Body:**
```json
{
  "order_id": "order_01...",
  "description": "Customer requested size change",
  "internal_note": "..."
}
```

### GET `/admin/order-edits/:id`

### POST `/admin/order-edits/:id/items`

Add item to order edit.

### POST `/admin/order-edits/:id/items/:action_id`

Update item quantity.

### DELETE `/admin/order-edits/:id/items/:action_id`

Remove item from order edit.

### POST `/admin/order-edits/:id/confirm`

Confirm and apply the edit.

### DELETE `/admin/order-edits/:id`

Cancel the edit.

---

## 13. Returns

### GET `/admin/returns`

### POST `/admin/returns`

Initiate a return.

**Request Body:**
```json
{
  "order_id": "order_01...",
  "items": [
    { "id": "ordli_01...", "quantity": 1, "reason_id": "rr_01...", "note": "..." }
  ],
  "location_id": "sloc_01...",
  "shipping_option_id": "so_01...",
  "send_notification": true,
  "internal_note": "",
  "note": ""
}
```

### GET `/admin/returns/:id`

### POST `/admin/returns/:id/cancel`

### POST `/admin/returns/:id/receive`

Mark return items as received.

**Request Body:**
```json
{
  "items": [
    { "id": "retli_01...", "quantity": 1 }
  ],
  "send_notification": true
}
```

### POST `/admin/returns/:id/close`

Close return without receiving all items.

### POST `/admin/returns/:id/request`

Re-request the return.

### DELETE `/admin/returns/:id/request`

---

## 14. Claims

### GET `/admin/claims`

### POST `/admin/claims`

Create a claim (replace or refund).

**Request Body:**
```json
{
  "type": "replace",           // "replace" or "refund"
  "order_id": "order_01...",
  "claim_items": [
    { "id": "ordli_01...", "quantity": 1, "reason": "missing_item" }
  ],
  "additional_items": [
    { "variant_id": "variant_01...", "quantity": 1 }
  ],
  "return_shipping": { "option_id": "so_01..." },
  "send_notification": true
}
```

### GET `/admin/claims/:id`

### POST `/admin/claims/:id`

### DELETE `/admin/claims/:id`

### POST `/admin/claims/:id/confirm`

### POST `/admin/claims/:id/cancel`

### POST `/admin/claims/:id/shipments`

### POST `/admin/claims/:id/fulfillments`

### POST `/admin/claims/:id/inbound/items`

### POST `/admin/claims/:id/outbound/items`

---

## 15. Exchanges

Similar to Claims but for customer-initiated exchanges.

### GET `/admin/exchanges` · POST · GET `:id` · POST `:id` · DELETE `:id`

### POST `/admin/exchanges/:id/confirm`

### POST `/admin/exchanges/:id/cancel`

### POST `/admin/exchanges/:id/fulfillments`

### POST `/admin/exchanges/:id/shipments`

---

## 16. Fulfillments

### GET `/admin/fulfillments`

### POST `/admin/fulfillments/:id/cancel`

### POST `/admin/fulfillments/:id/shipments`

### POST `/admin/fulfillments/:id/mark-as-delivered`

---

## 17. Fulfillment Sets

### POST `/admin/fulfillment-sets`

```json
{ "location_id": "sloc_01...", "name": "Main Warehouse", "type": "shipping" }
```

### DELETE `/admin/fulfillment-sets/:id`

### POST `/admin/fulfillment-sets/:id/service-zones`

```json
{
  "name": "US Domestic",
  "geo_zones": [
    { "type": "country", "country_code": "us" },
    { "type": "province", "country_code": "ca", "province_code": "ON" }
  ]
}
```

### POST `/admin/fulfillment-sets/:id/service-zones/:zone_id`

Update service zone / geo zones.

### DELETE `/admin/fulfillment-sets/:id/service-zones/:zone_id`

---

## 18. Shipping Options

### GET `/admin/shipping-options`

### POST `/admin/shipping-options`

```json
{
  "name": "Standard Shipping",
  "service_zone_id": "serzo_01...",
  "shipping_profile_id": "sp_01...",
  "fulfillment_provider_id": "manual",
  "price_type": "flat_rate",
  "prices": [
    { "currency_code": "usd", "amount": 499 }
  ],
  "rules": [
    { "attribute": "item_total", "operator": "gte", "value": 5000 }
  ],
  "type": { "label": "Flat Rate", "description": "", "code": "flat_rate" },
  "data": {}
}
```

### GET `/admin/shipping-options/:id`

### POST `/admin/shipping-options/:id`

### DELETE `/admin/shipping-options/:id`

### GET `/admin/shipping-option-types`

---

## 19. Shipping Profiles

### GET `/admin/shipping-profiles` · POST · GET `:id` · POST `:id` · DELETE `:id`

---

## 20. Customers

### GET `/admin/customers`

### POST `/admin/customers`

```json
{
  "email": "customer@example.com",
  "first_name": "Jane",
  "last_name": "Doe",
  "phone": "+1234567890",
  "company_name": "Acme",
  "metadata": {}
}
```

### GET `/admin/customers/:id`

### POST `/admin/customers/:id`

### DELETE `/admin/customers/:id`

### GET `/admin/customers/:id/addresses`

### POST `/admin/customers/:id/addresses`

### POST `/admin/customers/:id/addresses/:address_id`

### DELETE `/admin/customers/:id/addresses/:address_id`

---

## 21. Customer Groups

### GET `/admin/customer-groups` · POST · GET `:id` · POST `:id` · DELETE `:id`

### POST `/admin/customer-groups/:id/customers/batch`

Add/remove customers from group.

```json
{
  "add": ["cus_01..."],
  "remove": ["cus_02..."]
}
```

---

## 22. Payments

### GET `/admin/payments` · GET `:id`

### POST `/admin/payments/:id/capture`

Capture payment.

**RBAC Policy:** (via payment collection)

```json
{
  "amount": 4500
}
```

### POST `/admin/payments/:id/refund`

Refund payment.

```json
{
  "amount": 1000,
  "refund_reason_id": "rr_01...",
  "note": "Customer requested refund"
}
```

---

## 23. Payment Collections

### GET `/admin/payment-collections` · GET `:id`

### POST `/admin/payment-collections/:id`

### DELETE `/admin/payment-collections/:id`

### POST `/admin/payment-collections/:id/mark-as-paid`

Mark payment collection as manually paid.

```json
{
  "order_id": "order_01..."
}
```

### POST `/admin/payment-collections/:id/payment-sessions/authorize`

Authorize a payment session in the collection.

---

## 24. Promotions

### GET `/admin/promotions`

**Query Parameters:** `code`, `type`, `is_automatic`, `status`, `campaign_id`, `limit`, `offset`, `fields`

### POST `/admin/promotions`

```json
{
  "code": "SUMMER20",
  "type": "standard",
  "is_automatic": false,
  "status": "active",
  "campaign_id": null,
  "application_method": {
    "type": "percentage",
    "target_type": "items",
    "value": 20,
    "currency_code": "usd",
    "allocation": "each",
    "max_quantity": null,
    "target_rules": []
  },
  "rules": [
    { "attribute": "item_total", "operator": "gte", "value": 3000 }
  ]
}
```

### GET `/admin/promotions/:id` · POST `:id` · DELETE `:id`

### GET `/admin/promotions/:id/rules`

### POST `/admin/promotions/:id/rules/batch`

Add/update/delete promotion rules.

---

## 25. Campaigns

### GET `/admin/campaigns` · POST · GET `:id` · POST `:id` · DELETE `:id`

---

## 26. Price Lists

### GET `/admin/price-lists`

**Query Parameters:** `title`, `status`, `type`, `limit`, `offset`

### POST `/admin/price-lists`

```json
{
  "title": "VIP Discount",
  "description": "Discount for VIP customers",
  "type": "sale",
  "status": "active",
  "starts_at": null,
  "ends_at": null,
  "rules": [
    { "attribute": "customer_group.id", "value": ["cusgrp_01..."] }
  ],
  "prices": [
    { "variant_id": "variant_01...", "currency_code": "usd", "amount": 3600 }
  ]
}
```

### GET `/admin/price-lists/:id` · POST `:id` · DELETE `:id`

### GET `/admin/price-lists/:id/prices` · POST `:id/prices/batch`

### DELETE `/admin/price-lists/:id/prices`

---

## 27. Price Preferences

### GET `/admin/price-preferences` · POST · GET `:id` · POST `:id` · DELETE `:id`

Controls tax-inclusive/exclusive pricing per currency/region combination.

---

## 28. Inventory Items

### GET `/admin/inventory-items`

### POST `/admin/inventory-items`

```json
{
  "sku": "TOT-RED-001",
  "title": "Classic Tote - Red",
  "description": "",
  "thumbnail": null,
  "requires_shipping": true,
  "weight": 500,
  "metadata": {}
}
```

### GET `/admin/inventory-items/:id` · POST `:id` · DELETE `:id`

### GET `/admin/inventory-items/:id/location-levels`

Inventory levels across all locations.

### POST `/admin/inventory-items/:id/location-levels`

```json
{
  "location_id": "sloc_01...",
  "stocked_quantity": 100,
  "incoming_quantity": 0
}
```

### POST `/admin/inventory-items/:id/location-levels/:location_id`

Update stock levels.

### DELETE `/admin/inventory-items/:id/location-levels/:location_id`

---

## 29. Reservations

### GET `/admin/reservations`

### POST `/admin/reservations`

```json
{
  "inventory_item_id": "iitem_01...",
  "location_id": "sloc_01...",
  "quantity": 5,
  "line_item_id": "li_01...",
  "description": "Manual reservation"
}
```

### GET `/admin/reservations/:id` · POST `:id` · DELETE `:id`

---

## 30. Stock Locations

### GET `/admin/stock-locations`

### POST `/admin/stock-locations`

```json
{
  "name": "Mumbai Warehouse",
  "address": {
    "city": "Mumbai",
    "country_code": "IN",
    "address_1": "..."
  },
  "metadata": {}
}
```

### GET `/admin/stock-locations/:id` · POST `:id` · DELETE `:id`

### POST `/admin/stock-locations/:id/fulfillment-sets`

Associate fulfillment set with location.

### POST `/admin/stock-locations/:id/fulfillment-providers`

---

## 31. Regions

### GET `/admin/regions`

### POST `/admin/regions`

```json
{
  "name": "India",
  "currency_code": "inr",
  "countries": ["IN"],
  "automatic_taxes": true,
  "payment_providers": ["pp_stripe_stripe"],
  "metadata": {}
}
```

### GET `/admin/regions/:id` · POST `:id` · DELETE `:id`

---

## 32. Tax Regions

### GET `/admin/tax-regions`

### POST `/admin/tax-regions`

```json
{
  "country_code": "IN",
  "province_code": null,
  "parent_id": null,
  "provider_id": null,
  "default_tax_rate": {
    "rate": 18,
    "name": "GST",
    "code": "GST18"
  },
  "metadata": {}
}
```

### GET `/admin/tax-regions/:id` · DELETE `:id`

---

## 33. Tax Rates

### GET `/admin/tax-rates`

### POST `/admin/tax-rates`

```json
{
  "tax_region_id": "txreg_01...",
  "rate": 18,
  "code": "GST18",
  "name": "GST",
  "is_default": true,
  "is_combinable": false,
  "rules": [
    { "reference": "product_type", "reference_id": "ptyp_01..." }
  ]
}
```

### GET `/admin/tax-rates/:id` · POST `:id` · DELETE `:id`

---

## 34. Sales Channels

### GET `/admin/sales-channels`

### POST `/admin/sales-channels`

```json
{
  "name": "Online Store",
  "description": "Main webstore channel",
  "is_disabled": false,
  "metadata": {}
}
```

### GET `/admin/sales-channels/:id` · POST `:id` · DELETE `:id`

### POST `/admin/sales-channels/:id/products/batch`

Add/remove products.

---

## 35. Currencies

### GET `/admin/currencies`

### POST `/admin/currencies`

```json
{ "code": "inr", "symbol": "₹", "symbol_native": "₹", "name": "Indian Rupee" }
```

### GET `/admin/currencies/:code` · POST `:code` · DELETE `:code`

---

## 36. Stores

### GET `/admin/stores`

List all stores (usually just one).

### GET `/admin/stores/:id`

### POST `/admin/stores/:id`

Update store configuration.

```json
{
  "name": "The Letter Ink",
  "default_sales_channel_id": "sc_01...",
  "default_region_id": "reg_01...",
  "default_location_id": "sloc_01...",
  "supported_currencies": [
    { "currency_code": "usd", "is_default": true, "is_tax_inclusive": false }
  ],
  "metadata": {}
}
```

---

## 37. Users

### GET `/admin/users`

### POST `/admin/users`

Create admin user.

```json
{
  "email": "admin@theletterink.com",
  "first_name": "Admin",
  "last_name": "User",
  "avatar_url": null,
  "metadata": {}
}
```

### GET `/admin/users/:id` · POST `:id` · DELETE `:id`

---

## 38. Invites

### GET `/admin/invites`

### POST `/admin/invites`

```json
{ "email": "newadmin@theletterink.com" }
```

### POST `/admin/invites/:id/resend`

### DELETE `/admin/invites/:id`

### POST `/admin/invites/accept`

```json
{
  "invite_token": "...",
  "auth_token": "...",  // JWT from /auth/user/emailpass
  "first_name": "New",
  "last_name": "Admin"
}
```

---

## 39. API Keys

### GET `/admin/api-keys`

**Query Parameters:** `type` (`secret` or `publishable`), `title`, `limit`, `offset`

### POST `/admin/api-keys`

Create API key.

```json
{
  "title": "Production Publishable Key",
  "type": "publishable"    // or "secret"
}
```

**Response includes the raw token only once.**

### GET `/admin/api-keys/:id` · POST `:id`

### DELETE `/admin/api-keys/:id`

Revoke API key (soft delete).

### POST `/admin/api-keys/:id/sales-channels/batch`

Associate publishable key with sales channels.

---

## 40. Uploads

### POST `/admin/uploads`

Upload file.

**Content-Type:** `multipart/form-data`

**Fields:** `files` (one or more files)

**Response:**

```json
{
  "files": [
    {
      "id": "file_01...",
      "url": "https://...",
      "size": 12345,
      "mime_type": "image/jpeg",
      "name": "product-image.jpg"
    }
  ]
}
```

### DELETE `/admin/uploads`

Delete uploaded files.

```json
{ "file_ids": ["file_01..."] }
```

---

## 41. Notifications

### GET `/admin/notifications`

**Query Parameters:** `receiver_id`, `resource_id`, `resource_type`, `channel`, `template`, `limit`, `offset`

### POST `/admin/notifications/:id/resend`

Retry a failed notification.

---

## 42. Search

### GET `/admin/search`

Full-text search across indexed entities.

**Query Parameters:** `q` (required), `entities[]`, `limit`, `offset`

### GET `/admin/search-indexes`

List configured search indexes.

### POST `/admin/search-indexes`

Create/sync search index.

---

## 43. Workflow Executions

### GET `/admin/workflows-executions`

List workflow execution history.

**Query Parameters:** `workflow_id`, `transaction_id`, `status`, `limit`, `offset`

### GET `/admin/workflows-executions/:workflow_id`

### GET `/admin/workflows-executions/:workflow_id/:transaction_id`

### GET `/admin/workflows-executions/:workflow_id/:transaction_id/:step_id`

### POST `/admin/workflows-executions/:workflow_id/:transaction_id/steps/success`

### POST `/admin/workflows-executions/:workflow_id/:transaction_id/steps/failure`

---

## 44. RBAC

### GET `/admin/rbac/roles`

### POST `/admin/rbac/roles`

```json
{
  "name": "Store Manager",
  "permissions": [
    { "action": "read", "resource_type": "order" },
    { "action": "write", "resource_type": "product" }
  ]
}
```

### GET `/admin/rbac/roles/:id` · POST `:id` · DELETE `:id`

### POST `/admin/rbac/users/:id/roles/batch`

Assign roles to admin users.

---

## 45. Feature Flags

### GET `/admin/feature-flags`

List all feature flags and their current state.

---

## 46. Return Reasons & Refund Reasons

### Return Reasons

`GET /admin/return-reasons` · `POST` · `GET /:id` · `POST /:id` · `DELETE /:id`

```json
{ "label": "Defective Product", "description": "", "metadata": {} }
```

### Refund Reasons

`GET /admin/refund-reasons` · `POST` · `GET /:id` · `POST /:id` · `DELETE /:id`

---

## 47. Fulfillment Providers

### GET `/admin/fulfillment-providers`

List registered fulfillment provider implementations.

---

## 48. Tax Providers

### GET `/admin/tax-providers`

List registered tax provider implementations.

---

## 49. Translations & Locales

### GET `/admin/locales`

List supported locales.

### GET `/admin/translations`

### POST `/admin/translations`

```json
{
  "translations": [
    {
      "resource_id": "prod_01...",
      "resource_type": "product",
      "field": "title",
      "locale": "de",
      "value": "Klassische Tragetasche"
    }
  ]
}
```

---

## 50. Admin Views & Layouts

Internal admin configuration routes for the dashboard UI.

### Views

`GET /admin/views/entities` — list registered entities  
`GET /admin/views/:entity/configurations` — view config per entity  
`POST /admin/views/:entity/configurations/:id` — save column/filter config  
`GET /admin/views/:entity/columns` — column definitions  
`POST /admin/views/:entity/columns` — create custom column  

### Layouts

`GET /admin/layouts/configurations` — all layout configs  
`GET /admin/layouts/:zone/configuration` — layout for zone  
`POST /admin/layouts/:zone/configuration` — save layout  

### Property Labels

`GET /admin/property-labels` — custom field labels

---

## RBAC Policy Matrix

| Operation | Resource | Policy String |
|---|---|---|
| List/Get | `order` | `order:read` |
| Update | `order` | `order:update` |
| Create | `fulfillment` | `fulfillment:create` |
| Update | `fulfillment` | `fulfillment:update` |
| Create | `credit_line` | `credit_line:create` |
| Read | `product` | `product:read` |
| Write | `product` | `product:create` / `product:update` |

All routes under `/admin/*` receive the `setSecretApiKeyContext` middleware which grants module-level access.

---

## Standard Admin Response Shapes

**Paginated List:**
```json
{
  "resource_name": [...],
  "count": 100,
  "offset": 0,
  "limit": 20
}
```

**Single Entity:**
```json
{
  "resource_name": { ...entity fields... }
}
```

**Delete:**
```json
{
  "id": "entity_01...",
  "object": "entity_type",
  "deleted": true
}
```
