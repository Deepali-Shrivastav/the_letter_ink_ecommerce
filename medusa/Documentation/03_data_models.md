# The Letter Ink — Medusa Backend: Data Model Reference

> **Document:** 03 — Data Model Reference  
> **Medusa Version:** 2.20.1

All entities use ULID-format IDs with domain prefixes (e.g., `prod_01`, `order_01`). All entities include `created_at`, `updated_at`, and `deleted_at` timestamps (soft-delete pattern) unless noted.

---

## Table of Contents

1. [Product Module](#1-product-module)
2. [Order Module](#2-order-module)
3. [Cart Module](#3-cart-module)
4. [Customer Module](#4-customer-module)
5. [Payment Module](#5-payment-module)
6. [Fulfillment Module](#6-fulfillment-module)
7. [Inventory Module](#7-inventory-module)
8. [Pricing Module](#8-pricing-module)
9. [Promotion Module](#9-promotion-module)
10. [Auth Module](#10-auth-module)
11. [Region Module](#11-region-module)
12. [Tax Module](#12-tax-module)
13. [Sales Channel Module](#13-sales-channel-module)
14. [User Module](#14-user-module)
15. [Store Module](#15-store-module)
16. [API Key Module](#16-api-key-module)
17. [Notification Module](#17-notification-module)
18. [Link Module Pivot Tables](#18-link-module-pivot-tables)
19. [Entity Relationship Diagram](#19-entity-relationship-diagram)

---

## 1. Product Module

### Product

| Field | Type | Nullable | Default | Description |
|---|---|---|---|---|
| `id` | `varchar` (ULID) | No | auto | Primary key, prefix `prod` |
| `title` | `text` | No | — | Display title (searchable, translatable) |
| `handle` | `text` | No | — | URL slug (unique per non-deleted) |
| `subtitle` | `text` | Yes | `null` | Short subtitle |
| `description` | `text` | Yes | `null` | Long description |
| `is_giftcard` | `boolean` | No | `false` | Gift card flag |
| `status` | `enum` | No | `draft` | `draft`, `proposed`, `published`, `rejected` |
| `thumbnail` | `text` | Yes | `null` | Thumbnail image URL |
| `weight` | `float` | Yes | `null` | Weight |
| `length` | `float` | Yes | `null` | Length |
| `height` | `float` | Yes | `null` | Height |
| `width` | `float` | Yes | `null` | Width |
| `origin_country` | `text` | Yes | `null` | Country of origin |
| `hs_code` | `text` | Yes | `null` | Harmonized system code |
| `mid_code` | `text` | Yes | `null` | Manufacturer ID code |
| `material` | `text` | Yes | `null` | Material description |
| `discountable` | `boolean` | No | `true` | Eligible for discounts |
| `external_id` | `text` | Yes | `null` | External system identifier |
| `metadata` | `jsonb` | Yes | `null` | Custom key-value data |
| `type_id` | `varchar` | Yes | `null` | FK → ProductType |
| `collection_id` | `varchar` | Yes | `null` | FK → ProductCollection |
| `created_at` | `timestamptz` | No | auto | |
| `updated_at` | `timestamptz` | No | auto | |
| `deleted_at` | `timestamptz` | Yes | `null` | Soft-delete timestamp |

**Relations:**
- `variants` → hasMany `ProductVariant`
- `type` → belongsTo `ProductType`
- `collection` → belongsTo `ProductCollection`
- `tags` → manyToMany `ProductTag` (pivot: `product_tags`)
- `options` → manyToMany `ProductOption` (pivot entity: `ProductProductOption`)
- `images` → hasMany `ProductImage`
- `categories` → manyToMany `ProductCategory` (pivot: `product_category_product`)

**Indexes:**
- `IDX_product_handle_unique` — unique on `(handle)` where `deleted_at IS NULL`
- `IDX_product_type_id` — on `(type_id)` where `deleted_at IS NULL`
- `IDX_product_collection_id` — on `(collection_id)` where `deleted_at IS NULL`
- `IDX_product_status` — on `(status)` where `deleted_at IS NULL`

---

### ProductVariant

| Field | Type | Nullable | Default | Description |
|---|---|---|---|---|
| `id` | `varchar` (ULID) | No | auto | Prefix `variant` |
| `product_id` | `varchar` | No | — | FK → Product |
| `title` | `text` | No | — | Variant title |
| `sku` | `text` | Yes | `null` | Stock keeping unit (unique) |
| `barcode` | `text` | Yes | `null` | Barcode |
| `ean` | `text` | Yes | `null` | EAN |
| `upc` | `text` | Yes | `null` | UPC |
| `allow_backorder` | `boolean` | No | `false` | Allow orders when out of stock |
| `manage_inventory` | `boolean` | No | `true` | Track inventory |
| `hs_code` | `text` | Yes | `null` | |
| `origin_country` | `text` | Yes | `null` | |
| `mid_code` | `text` | Yes | `null` | |
| `material` | `text` | Yes | `null` | |
| `weight` | `float` | Yes | `null` | |
| `length` | `float` | Yes | `null` | |
| `height` | `float` | Yes | `null` | |
| `width` | `float` | Yes | `null` | |
| `variant_rank` | `integer` | Yes | `null` | Display ordering |
| `metadata` | `jsonb` | Yes | `null` | |

**Relations:**
- `product` → belongsTo `Product`
- `options` → manyToMany `ProductOptionValue` (via pivot)
- `images` → manyToMany `ProductImage`

---

### ProductOption

| Field | Type | Nullable | Description |
|---|---|---|---|
| `id` | `varchar` | No | Prefix `opt` |
| `title` | `text` | No | Option name (e.g., "Color") |
| `product_id` | `varchar` | Yes | FK → Product (via pivot) |
| `metadata` | `jsonb` | Yes | |

**Relations:**
- `values` → hasMany `ProductOptionValue`
- `products` → manyToMany `Product`

---

### ProductOptionValue

| Field | Type | Nullable | Description |
|---|---|---|---|
| `id` | `varchar` | No | Prefix `optval` |
| `value` | `text` | No | Option value (e.g., "Red") |
| `option_id` | `varchar` | No | FK → ProductOption |
| `metadata` | `jsonb` | Yes | |

---

### ProductCategory

| Field | Type | Nullable | Description |
|---|---|---|---|
| `id` | `varchar` | No | Prefix `pcat` |
| `name` | `text` | No | Category name |
| `description` | `text` | No | Description |
| `handle` | `text` | No | URL slug (unique) |
| `is_active` | `boolean` | No | Visible to store |
| `is_internal` | `boolean` | No | Hidden from public |
| `rank` | `integer` | No | Display order |
| `parent_category_id` | `varchar` | Yes | FK → ProductCategory (self-ref) |
| `metadata` | `jsonb` | Yes | |

---

### ProductCollection

| Field | Type | Description |
|---|---|---|
| `id` | `varchar` | Prefix `pcol` |
| `title` | `text` | Collection name |
| `handle` | `text` | URL slug |
| `metadata` | `jsonb` | |

---

### ProductTag

| Field | Type | Description |
|---|---|---|
| `id` | `varchar` | Prefix `ptag` |
| `value` | `text` | Tag label |
| `metadata` | `jsonb` | |

---

### ProductType

| Field | Type | Description |
|---|---|---|
| `id` | `varchar` | Prefix `ptyp` |
| `value` | `text` | Type label (e.g., "T-Shirt") |
| `metadata` | `jsonb` | |

---

### ProductImage

| Field | Type | Nullable | Description |
|---|---|---|---|
| `id` | `varchar` | No | |
| `product_id` | `varchar` | No | FK → Product |
| `url` | `text` | No | Image URL |
| `rank` | `integer` | No | Display order |
| `metadata` | `jsonb` | Yes | |

---

## 2. Order Module

### Order

| Field | Type | Nullable | Default | Description |
|---|---|---|---|---|
| `id` | `varchar` (ULID) | No | auto | Prefix `order` |
| `display_id` | `integer` (serial) | No | auto | Sequential human-readable ID |
| `custom_display_id` | `text` | Yes | `null` | Custom display ID (unique) |
| `region_id` | `text` | Yes | `null` | FK → Region |
| `customer_id` | `text` | Yes | `null` | FK → Customer |
| `version` | `integer` | No | `1` | Order version for change tracking |
| `sales_channel_id` | `text` | Yes | `null` | FK → SalesChannel |
| `status` | `enum` | No | `pending` | `pending`, `completed`, `archived`, `canceled`, `requires_action` |
| `is_draft_order` | `boolean` | No | `false` | Draft order flag |
| `email` | `text` | Yes | `null` | Customer email (searchable) |
| `currency_code` | `text` | No | — | ISO 3 currency code |
| `locale` | `text` | Yes | `null` | BCP47 locale tag |
| `no_notification` | `boolean` | Yes | `null` | Suppress notifications |
| `metadata` | `jsonb` | Yes | `null` | |
| `canceled_at` | `timestamptz` | Yes | `null` | Cancellation timestamp |
| `shipping_address_id` | `varchar` | Yes | `null` | FK → OrderAddress |
| `billing_address_id` | `varchar` | Yes | `null` | FK → OrderAddress |

**Relations:**
- `shipping_address` → hasOne `OrderAddress`
- `billing_address` → hasOne `OrderAddress`
- `summary` → hasMany `OrderSummary`
- `items` → hasMany `OrderItem`
- `shipping_methods` → hasMany `OrderShipping`
- `transactions` → hasMany `OrderTransaction`
- `credit_lines` → hasMany `OrderCreditLine`
- `returns` → hasMany `Return`

**Indexes:** display_id, custom_display_id (unique), region_id, customer_id, sales_channel_id, currency_code, shipping_address_id, billing_address_id, is_draft_order, deleted_at

---

### OrderItem

| Field | Type | Nullable | Description |
|---|---|---|---|
| `id` | `varchar` | No | |
| `order_id` | `varchar` | No | FK → Order |
| `version` | `integer` | No | Order version when created |
| `item_id` | `varchar` | No | FK → LineItem |
| `quantity` | `numeric` | No | Ordered quantity |
| `fulfilled_quantity` | `numeric` | No | Fulfilled quantity |
| `shipped_quantity` | `numeric` | No | Shipped quantity |
| `return_requested_quantity` | `numeric` | No | Return requested |
| `return_received_quantity` | `numeric` | No | Return received |
| `return_dismissed_quantity` | `numeric` | No | Return dismissed |
| `written_off_quantity` | `numeric` | No | Written off |
| `unit_price` | `numeric` | No | Price per unit |
| `compare_at_unit_price` | `numeric` | Yes | Original price |
| `raw_unit_price` | `jsonb` | No | Raw bigNumber data |

---

### OrderChange

| Field | Type | Nullable | Description |
|---|---|---|---|
| `id` | `varchar` | No | |
| `order_id` | `varchar` | No | FK → Order |
| `return_id` | `varchar` | Yes | FK → Return |
| `exchange_id` | `varchar` | Yes | FK → Exchange |
| `claim_id` | `varchar` | Yes | FK → Claim |
| `version` | `integer` | No | |
| `change_type` | `enum` | Yes | `return`, `exchange`, `claim`, `edit`, `transfer` |
| `status` | `enum` | No | `pending` / `confirmed` / `declined` / `canceled` |
| `requested_by` | `text` | Yes | Actor ID |
| `confirmed_by` | `text` | Yes | |
| `declined_by` | `text` | Yes | |
| `canceled_by` | `text` | Yes | |
| `confirmed_at` | `timestamptz` | Yes | |
| `declined_at` | `timestamptz` | Yes | |
| `canceled_at` | `timestamptz` | Yes | |
| `declined_reason` | `text` | Yes | |
| `metadata` | `jsonb` | Yes | |
| `requested_at` | `timestamptz` | Yes | |

---

### Return

| Field | Type | Nullable | Description |
|---|---|---|---|
| `id` | `varchar` | No | |
| `order_id` | `varchar` | No | FK → Order |
| `exchange_id` | `varchar` | Yes | |
| `claim_id` | `varchar` | Yes | |
| `order_version` | `integer` | No | |
| `display_id` | `integer` | No | |
| `status` | `enum` | No | `open`, `requested`, `received`, `partially_received`, `canceled` |
| `location_id` | `text` | Yes | Return destination location |
| `no_notification` | `boolean` | Yes | |
| `metadata` | `jsonb` | Yes | |
| `requested_at` | `timestamptz` | Yes | |
| `received_at` | `timestamptz` | Yes | |

---

### Claim & Exchange

Similar to Return, with `claim_type` (`refund` or `replace`) and exchange-specific `allow_backorder` field respectively.

---

### OrderTransaction

| Field | Type | Nullable | Description |
|---|---|---|---|
| `id` | `varchar` | No | |
| `order_id` | `varchar` | No | FK → Order |
| `version` | `integer` | No | |
| `amount` | `numeric` | No | |
| `raw_amount` | `jsonb` | No | BigNumber representation |
| `currency_code` | `text` | No | |
| `reference` | `text` | Yes | Payment reference type |
| `reference_id` | `text` | Yes | Payment provider reference |
| `metadata` | `jsonb` | Yes | |

---

## 3. Cart Module

### Cart

| Field | Type | Nullable | Default | Description |
|---|---|---|---|---|
| `id` | `varchar` (ULID) | No | auto | Prefix `cart` |
| `region_id` | `text` | Yes | `null` | |
| `customer_id` | `text` | Yes | `null` | |
| `sales_channel_id` | `text` | Yes | `null` | |
| `email` | `text` | Yes | `null` | |
| `currency_code` | `text` | No | — | |
| `locale` | `text` | Yes | `null` | BCP47 locale |
| `metadata` | `jsonb` | Yes | `null` | |
| `completed_at` | `timestamptz` | Yes | `null` | Checkout completion time |
| `shipping_address_id` | `varchar` | Yes | `null` | |
| `billing_address_id` | `varchar` | Yes | `null` | |

**Computed BigNumber fields (not stored, calculated on read):**
`original_item_total`, `original_item_subtotal`, `original_item_tax_total`, `item_total`, `item_subtotal`, `item_tax_total`, `original_total`, `original_subtotal`, `original_tax_total`, `total`, `subtotal`, `tax_total`, `discount_total`, `discount_tax_total`, `gift_card_total`, `gift_card_tax_total`, `shipping_total`, `shipping_subtotal`, `shipping_tax_total`, `original_shipping_total`, `original_shipping_subtotal`, `original_shipping_tax_total`

---

### LineItem (Cart)

| Field | Type | Nullable | Description |
|---|---|---|---|
| `id` | `varchar` | No | |
| `cart_id` | `varchar` | No | FK → Cart |
| `title` | `text` | No | Product title at time of add |
| `subtitle` | `text` | Yes | |
| `thumbnail` | `text` | Yes | |
| `variant_id` | `text` | Yes | Product variant ID |
| `product_id` | `text` | Yes | |
| `product_title` | `text` | Yes | |
| `product_description` | `text` | Yes | |
| `product_subtitle` | `text` | Yes | |
| `product_type` | `text` | Yes | |
| `product_type_id` | `text` | Yes | |
| `product_collection` | `text` | Yes | |
| `product_handle` | `text` | Yes | |
| `variant_sku` | `text` | Yes | |
| `variant_barcode` | `text` | Yes | |
| `variant_title` | `text` | Yes | |
| `variant_option_values` | `jsonb` | Yes | |
| `requires_shipping` | `boolean` | No | |
| `is_discountable` | `boolean` | No | |
| `is_tax_inclusive` | `boolean` | No | |
| `compare_at_unit_price` | `numeric` | Yes | |
| `unit_price` | `numeric` | No | |
| `quantity` | `numeric` | No | |
| `metadata` | `jsonb` | Yes | |

---

### ShippingMethod (Cart)

| Field | Type | Nullable | Description |
|---|---|---|---|
| `id` | `varchar` | No | |
| `cart_id` | `varchar` | No | FK → Cart |
| `name` | `text` | No | Shipping method name |
| `description` | `jsonb` | Yes | |
| `amount` | `numeric` | No | Shipping cost |
| `is_tax_inclusive` | `boolean` | No | |
| `shipping_option_id` | `text` | Yes | Reference to FulfillmentShippingOption |
| `data` | `jsonb` | Yes | Provider-specific data |
| `metadata` | `jsonb` | Yes | |

---

## 4. Customer Module

### Customer

| Field | Type | Nullable | Description |
|---|---|---|---|
| `id` | `varchar` | No | Prefix `cus` |
| `email` | `text` | No | Unique email |
| `first_name` | `text` | Yes | |
| `last_name` | `text` | Yes | |
| `billing_address_id` | `varchar` | Yes | FK → CustomerAddress |
| `phone` | `text` | Yes | |
| `company_name` | `text` | Yes | |
| `has_account` | `boolean` | No | Registered account flag |
| `metadata` | `jsonb` | Yes | |

**Relations:**
- `addresses` → hasMany `CustomerAddress`
- `groups` → manyToMany `CustomerGroup`

---

### CustomerAddress

| Field | Type | Nullable | Description |
|---|---|---|---|
| `id` | `varchar` | No | |
| `customer_id` | `varchar` | No | FK → Customer |
| `address_name` | `text` | Yes | Label (e.g., "Home") |
| `is_default_shipping` | `boolean` | No | |
| `is_default_billing` | `boolean` | No | |
| `company` | `text` | Yes | |
| `first_name` | `text` | Yes | |
| `last_name` | `text` | Yes | |
| `address_1` | `text` | Yes | |
| `address_2` | `text` | Yes | |
| `city` | `text` | Yes | |
| `country_code` | `text` | Yes | ISO 2-character code |
| `province` | `text` | Yes | |
| `postal_code` | `text` | Yes | |
| `phone` | `text` | Yes | |
| `metadata` | `jsonb` | Yes | |

---

### CustomerGroup

| Field | Type | Description |
|---|---|---|
| `id` | `varchar` | Prefix `cusgrp` |
| `name` | `text` | Group name |
| `metadata` | `jsonb` | |

---

## 5. Payment Module

### PaymentCollection

| Field | Type | Nullable | Description |
|---|---|---|---|
| `id` | `varchar` | No | Prefix `paycol` |
| `currency_code` | `text` | No | |
| `amount` | `numeric` | No | Total collection amount |
| `raw_amount` | `jsonb` | No | BigNumber |
| `region_id` | `text` | Yes | |
| `status` | `enum` | No | `not_paid`, `awaiting`, `authorized`, `partially_authorized`, `canceled` |
| `metadata` | `jsonb` | Yes | |

---

### PaymentSession

| Field | Type | Nullable | Description |
|---|---|---|---|
| `id` | `varchar` | No | |
| `payment_collection_id` | `varchar` | No | FK → PaymentCollection |
| `provider_id` | `text` | No | Provider identifier (e.g., `pp_stripe_stripe`) |
| `currency_code` | `text` | No | |
| `amount` | `numeric` | No | |
| `raw_amount` | `jsonb` | No | |
| `data` | `jsonb` | No | Provider-specific session data |
| `context` | `jsonb` | Yes | |
| `status` | `enum` | No | `pending`, `authorized`, `requires_more`, `error`, `canceled` |
| `authorized_at` | `timestamptz` | Yes | |

---

### Payment

| Field | Type | Nullable | Description |
|---|---|---|---|
| `id` | `varchar` | No | |
| `payment_collection_id` | `varchar` | No | |
| `payment_session_id` | `varchar` | No | |
| `provider_id` | `text` | No | |
| `cart_id` | `text` | Yes | |
| `order_id` | `text` | Yes | |
| `customer_id` | `text` | Yes | |
| `currency_code` | `text` | No | |
| `amount` | `numeric` | No | |
| `raw_amount` | `jsonb` | No | |
| `authorized_amount` | `numeric` | Yes | |
| `captured_at` | `timestamptz` | Yes | |
| `canceled_at` | `timestamptz` | Yes | |
| `data` | `jsonb` | Yes | |
| `metadata` | `jsonb` | Yes | |

---

### Capture

| Field | Type | Description |
|---|---|---|
| `id` | `varchar` | |
| `payment_id` | `varchar` | FK → Payment |
| `amount` | `numeric` | |
| `raw_amount` | `jsonb` | |
| `captured_by` | `text` | Actor ID |
| `metadata` | `jsonb` | |

---

### Refund

| Field | Type | Description |
|---|---|---|
| `id` | `varchar` | |
| `payment_id` | `varchar` | FK → Payment |
| `amount` | `numeric` | |
| `raw_amount` | `jsonb` | |
| `refund_reason_id` | `varchar` | FK → RefundReason |
| `note` | `text` | |
| `created_by` | `text` | |
| `metadata` | `jsonb` | |

---

### RefundReason

| Field | Type | Description |
|---|---|---|
| `id` | `varchar` | |
| `label` | `text` | Human label |
| `description` | `text` | |
| `metadata` | `jsonb` | |

---

## 6. Fulfillment Module

### FulfillmentSet

| Field | Type | Description |
|---|---|---|
| `id` | `varchar` | Prefix `fuset` |
| `name` | `text` | Fulfillment set name |
| `type` | `text` | e.g., `shipping`, `pickup` |
| `metadata` | `jsonb` | |

**Relations:** → hasMany `ServiceZone`

---

### ServiceZone

| Field | Type | Description |
|---|---|---|
| `id` | `varchar` | Prefix `serzo` |
| `fulfillment_set_id` | `varchar` | FK → FulfillmentSet |
| `name` | `text` | Zone name |
| `metadata` | `jsonb` | |

**Relations:** → hasMany `GeoZone`, → hasMany `ShippingOption`

---

### GeoZone

| Field | Type | Nullable | Description |
|---|---|---|---|
| `id` | `varchar` | No | |
| `service_zone_id` | `varchar` | No | FK → ServiceZone |
| `type` | `enum` | No | `country`, `province`, `city`, `zip` |
| `country_code` | `text` | No | |
| `province_code` | `text` | Yes | |
| `city` | `text` | Yes | |
| `postal_expression` | `jsonb` | Yes | Zip code pattern |
| `metadata` | `jsonb` | Yes | |

---

### ShippingOption

| Field | Type | Nullable | Description |
|---|---|---|---|
| `id` | `varchar` | No | Prefix `so` |
| `name` | `text` | No | Display name |
| `price_type` | `enum` | No | `flat_rate` or `calculated` |
| `service_zone_id` | `varchar` | No | FK → ServiceZone |
| `shipping_profile_id` | `varchar` | Yes | FK → ShippingProfile |
| `fulfillment_provider_id` | `varchar` | Yes | FK → FulfillmentProvider |
| `data` | `jsonb` | Yes | Provider-specific data |
| `metadata` | `jsonb` | Yes | |

**Relations:** → hasMany `ShippingOptionRule`, → hasOne `ShippingOptionType`

---

### Fulfillment

| Field | Type | Nullable | Description |
|---|---|---|---|
| `id` | `varchar` | No | Prefix `ful` |
| `location_id` | `text` | Yes | Stock location ID |
| `packed_at` | `timestamptz` | Yes | |
| `shipped_at` | `timestamptz` | Yes | |
| `delivered_at` | `timestamptz` | Yes | |
| `canceled_at` | `timestamptz` | Yes | |
| `data` | `jsonb` | Yes | Provider-specific data |
| `provider_id` | `text` | No | Fulfillment provider |
| `shipping_option_id` | `varchar` | Yes | |
| `metadata` | `jsonb` | Yes | |
| `delivery_address` | FK | | → FulfillmentAddress |

---

## 7. Inventory Module

### InventoryItem

| Field | Type | Nullable | Description |
|---|---|---|---|
| `id` | `varchar` | No | Prefix `iitem` |
| `sku` | `text` | Yes | Unique SKU |
| `origin_country` | `text` | Yes | |
| `hs_code` | `text` | Yes | |
| `mid_code` | `text` | Yes | |
| `material` | `text` | Yes | |
| `weight` | `float` | Yes | |
| `length` | `float` | Yes | |
| `height` | `float` | Yes | |
| `width` | `float` | Yes | |
| `requires_shipping` | `boolean` | No | |
| `description` | `text` | Yes | |
| `title` | `text` | Yes | |
| `thumbnail` | `text` | Yes | |
| `metadata` | `jsonb` | Yes | |

---

### InventoryLevel

| Field | Type | Description |
|---|---|---|
| `id` | `varchar` | |
| `inventory_item_id` | `varchar` | FK → InventoryItem |
| `location_id` | `text` | FK → StockLocation |
| `stocked_quantity` | `integer` | Total on hand |
| `reserved_quantity` | `integer` | Reserved for pending orders |
| `incoming_quantity` | `integer` | Incoming stock |
| `metadata` | `jsonb` | |

`available_quantity` = `stocked_quantity - reserved_quantity` (computed)

---

### Reservation

| Field | Type | Nullable | Description |
|---|---|---|---|
| `id` | `varchar` | No | |
| `inventory_item_id` | `varchar` | No | |
| `location_id` | `text` | No | |
| `quantity` | `integer` | No | |
| `line_item_id` | `text` | Yes | Cart line item reference |
| `external_id` | `text` | Yes | |
| `description` | `text` | Yes | |
| `allow_backorder` | `boolean` | No | |
| `metadata` | `jsonb` | Yes | |

---

## 8. Pricing Module

### PriceSet

| Field | Type | Description |
|---|---|---|
| `id` | `varchar` | Central pricing record |
| `metadata` | `jsonb` | |

**Relations:** → hasMany `Price`, → hasMany `PriceRule`

---

### Price

| Field | Type | Nullable | Description |
|---|---|---|---|
| `id` | `varchar` | No | |
| `price_set_id` | `varchar` | No | FK → PriceSet |
| `title` | `text` | Yes | |
| `currency_code` | `text` | No | |
| `amount` | `numeric` | No | Price amount |
| `raw_amount` | `jsonb` | No | |
| `min_quantity` | `integer` | Yes | Minimum quantity for tiered pricing |
| `max_quantity` | `integer` | Yes | Maximum quantity |
| `rules_count` | `integer` | No | Number of rules applied |

---

### PriceList

| Field | Type | Nullable | Description |
|---|---|---|---|
| `id` | `varchar` | No | Prefix `plist` |
| `title` | `text` | No | |
| `description` | `text` | No | |
| `type` | `enum` | No | `sale` or `override` |
| `status` | `enum` | No | `active` or `draft` |
| `starts_at` | `timestamptz` | Yes | |
| `ends_at` | `timestamptz` | Yes | |
| `metadata` | `jsonb` | Yes | |

---

## 9. Promotion Module

### Promotion

| Field | Type | Nullable | Description |
|---|---|---|---|
| `id` | `varchar` | No | Prefix `promo` |
| `code` | `text` | Yes | Unique coupon code |
| `type` | `enum` | No | `standard` or `buyget` |
| `is_automatic` | `boolean` | No | Auto-apply |
| `status` | `enum` | No | `active`, `inactive`, `draft` |
| `campaign_id` | `varchar` | Yes | FK → Campaign |
| `metadata` | `jsonb` | Yes | |

**Relations:** → hasMany `ApplicationMethod`, → hasMany `PromotionRule`

---

### Campaign

| Field | Type | Nullable | Description |
|---|---|---|---|
| `id` | `varchar` | No | Prefix `camp` |
| `name` | `text` | No | |
| `description` | `text` | Yes | |
| `identifier` | `text` | No | Unique identifier |
| `starts_at` | `timestamptz` | Yes | |
| `ends_at` | `timestamptz` | Yes | |
| `budget` | FK | | → CampaignBudget |

---

## 10. Auth Module

### AuthIdentity

| Field | Type | Nullable | Description |
|---|---|---|---|
| `id` | `varchar` | No | Prefix `authusr` |
| `metadata` | `jsonb` | Yes | |

**Relations:** → hasMany `ProviderIdentity`

---

### ProviderIdentity

| Field | Type | Nullable | Description |
|---|---|---|---|
| `id` | `varchar` | No | |
| `auth_identity_id` | `varchar` | No | FK → AuthIdentity |
| `provider` | `text` | No | Provider ID (e.g., `emailpass`) |
| `entity_id` | `text` | No | Provider-specific user ID |
| `provider_metadata` | `jsonb` | Yes | Hashed password, tokens, etc. |
| `user_metadata` | `jsonb` | Yes | Profile data from OAuth |

---

## 11. Region Module

### Region

| Field | Type | Nullable | Description |
|---|---|---|---|
| `id` | `varchar` | No | Prefix `reg` |
| `name` | `text` | No | |
| `currency_code` | `text` | No | |
| `automatic_taxes` | `boolean` | No | Auto-calculate taxes |
| `metadata` | `jsonb` | Yes | |

**Relations:** → hasMany `RegionCountry`

---

## 12. Tax Module

### TaxRegion

| Field | Type | Nullable | Description |
|---|---|---|---|
| `id` | `varchar` | No | Prefix `txreg` |
| `provider_id` | `text` | Yes | Tax provider |
| `country_code` | `text` | No | |
| `province_code` | `text` | Yes | |
| `parent_id` | `varchar` | Yes | FK → TaxRegion (parent country) |
| `metadata` | `jsonb` | Yes | |

---

### TaxRate

| Field | Type | Nullable | Description |
|---|---|---|---|
| `id` | `varchar` | No | Prefix `txrate` |
| `tax_region_id` | `varchar` | No | FK → TaxRegion |
| `rate` | `float` | Yes | Percentage rate |
| `code` | `text` | Yes | Tax code |
| `name` | `text` | No | Display name |
| `is_default` | `boolean` | No | |
| `is_combinable` | `boolean` | No | |
| `metadata` | `jsonb` | Yes | |

---

## 13. Sales Channel Module

### SalesChannel

| Field | Type | Nullable | Description |
|---|---|---|---|
| `id` | `varchar` | No | Prefix `sc` |
| `name` | `text` | No | |
| `description` | `text` | Yes | |
| `is_disabled` | `boolean` | No | |
| `metadata` | `jsonb` | Yes | |

---

## 14. User Module

### User

| Field | Type | Nullable | Description |
|---|---|---|---|
| `id` | `varchar` | No | Prefix `user` |
| `first_name` | `text` | Yes | |
| `last_name` | `text` | Yes | |
| `email` | `text` | No | Unique email |
| `avatar_url` | `text` | Yes | |
| `metadata` | `jsonb` | Yes | |

---

### Invite

| Field | Type | Nullable | Description |
|---|---|---|---|
| `id` | `varchar` | No | |
| `email` | `text` | No | Unique pending invitation |
| `accepted` | `boolean` | No | |
| `token` | `text` | No | Secure invite token |
| `expires_at` | `timestamptz` | No | |
| `metadata` | `jsonb` | Yes | |

---

## 15. Store Module

### Store

| Field | Type | Nullable | Description |
|---|---|---|---|
| `id` | `varchar` | No | Prefix `store` |
| `name` | `text` | No | Store name |
| `supported_currencies` | FK | | → StoreCurrency[] |
| `default_sales_channel_id` | `text` | Yes | |
| `default_region_id` | `text` | Yes | |
| `default_location_id` | `text` | Yes | |
| `metadata` | `jsonb` | Yes | |

---

## 16. API Key Module

### ApiKey

| Field | Type | Nullable | Description |
|---|---|---|---|
| `id` | `varchar` | No | Prefix `apk` |
| `token` | `text` | No | Hashed API key (unique) |
| `salt` | `text` | No | Bcrypt salt |
| `redacted` | `text` | No | Visible prefix (`sk_...`) |
| `title` | `text` | No | Human label |
| `type` | `enum` | No | `secret` or `publishable` |
| `last_used_at` | `timestamptz` | Yes | |
| `created_by` | `text` | No | User ID |
| `revoked_at` | `timestamptz` | Yes | |
| `revoked_by` | `text` | Yes | |

---

## 17. Notification Module

### Notification

| Field | Type | Nullable | Description |
|---|---|---|---|
| `id` | `varchar` | No | |
| `to` | `text` | No | Recipient (email, phone, etc.) |
| `channel` | `text` | No | `email`, `sms`, etc. |
| `template` | `text` | No | Template identifier |
| `data` | `jsonb` | Yes | Template variables |
| `trigger_type` | `text` | Yes | Event that triggered |
| `resource_id` | `text` | Yes | Associated resource |
| `resource_type` | `text` | Yes | Associated resource type |
| `receiver_id` | `text` | Yes | Customer/User ID |
| `original_notification_id` | `varchar` | Yes | FK → original (for retries) |
| `idempotency_key` | `text` | Yes | Deduplication key |
| `provider_id` | `text` | Yes | Notification provider |
| `external_id` | `text` | Yes | Provider message ID |
| `status` | `enum` | No | `pending`, `success`, `failure` |

---

## 18. Link Module Pivot Tables

| Table | Module A | Module B | Purpose |
|---|---|---|---|
| `product_sales_channel` | product | sales-channel | Product availability per channel |
| `product_variant_inventory_item` | product | inventory | Variant → inventory mapping |
| `product_variant_price_set` | product | pricing | Variant pricing |
| `order_payment_collection` | order | payment | Order payment association |
| `order_cart` | order | cart | Cart that produced the order |
| `cart_payment_collection` | cart | payment | Cart payment session |
| `cart_promotion` | cart | promotion | Applied promotions |
| `customer_auth_identity` | customer | auth | Auth-to-customer binding |
| `user_auth_identity` | user | auth | Auth-to-admin user binding |
| `region_payment_provider` | region | payment | Available payment methods by region |
| `location_fulfillment_set` | stock-location | fulfillment | Stock location → fulfillment set |
| `location_fulfillment_provider` | stock-location | fulfillment | Providers available at location |
| `shipping_option_price_set` | fulfillment | pricing | Shipping option pricing |
| `order_claim` | order | order | Claim association |
| `order_exchange` | order | order | Exchange association |

---

## 19. Entity Relationship Diagram

```
Product ─────────── ProductVariant ─── ProductOptionValue ─── ProductOption
    │                     │
    │                     └──────────── InventoryItem ─── InventoryLevel ─── StockLocation
    │                                        │
    │                                        └──── Reservation
    ├── ProductCategory
    ├── ProductCollection
    ├── ProductTag
    ├── ProductType
    └── ProductImage


Cart ─── CartLineItem ─── (product/variant ref by ID, denormalized)
  │ │
  │ ├── CartShippingMethod ─── ShippingOption ─── ServiceZone ─── FulfillmentSet
  │ │                                │
  │ │                           GeoZone (country/province/city/zip)
  │ │
  │ └── Promotion (via cart_promotion link)
  │
  └── PaymentCollection ─── PaymentSession ─── Payment ─── Capture
                                                      │
                                                      └── Refund ─── RefundReason


Order ─── OrderItem ─── LineItem
    │ │
    │ ├── OrderShipping ─── ShippingMethod
    │ │
    │ ├── OrderChange ─── OrderChangeAction
    │ │         │
    │ │         ├── Return ─── ReturnItem
    │ │         ├── Claim ─── ClaimItem
    │ │         └── Exchange ─── ExchangeItem
    │ │
    │ ├── OrderTransaction ─── Payment
    │ └── CreditLine
    │
    └── Customer ─── CustomerAddress
                │
                └── AuthIdentity ─── ProviderIdentity


Region ─── Currency
       │
       └── TaxRegion ─── TaxRate
```
