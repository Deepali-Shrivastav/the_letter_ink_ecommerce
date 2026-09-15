# The Letter Ink — yournextstore: API Layer & Commerce Kit

> **Document:** F06 — API Layer & Commerce Kit SDK Reference

---

## Table of Contents

1. [Commerce Kit Overview](#1-commerce-kit-overview)
2. [Client Initialization](#2-client-initialization)
3. [Product API Methods](#3-product-api-methods)
4. [Cart API Methods](#4-cart-api-methods)
5. [Collection & Category Methods](#5-collection--category-methods)
6. [Blog & Content Methods](#6-blog--content-methods)
7. [Store / Me Methods](#7-store--me-methods)
8. [Search Methods](#8-search-methods)
9. [Review Methods](#9-review-methods)
10. [Legal & FAQ Methods](#10-legal--faq-methods)
11. [Notification Methods](#11-notification-methods)
12. [Server Actions Reference](#12-server-actions-reference)
13. [Error Handling Pattern](#13-error-handling-pattern)
14. [Adding New API Calls](#14-adding-new-api-calls)

---

## 1. Commerce Kit Overview

`commerce-kit` (v0.61.0) is the official TypeScript SDK that wraps all commerce API calls. It:

- Provides fully-typed request/response shapes
- Handles authentication via the `YNS_API_KEY` token
- Normalizes API errors
- Supports endpoint override (for custom/Medusa backends)

**Import pattern:**
```typescript
import { commerce } from "@/lib/commerce"

const result = await commerce.productBrowse({ ... })
```

---

## 2. Client Initialization

```typescript
// lib/commerce.ts

import { Commerce } from "commerce-kit"

const endpoint = process.env.YNS_API_URL || undefined

export const commerce = Commerce({
  token: process.env.YNS_API_KEY,   // Required — server only
  endpoint,                          // Optional — override API host
})
```

### Canonical URL Utilities

```typescript
// Resolves the canonical URL for SEO/sitemap
export function getCanonicalUrl(): string {
  if (process.env.NEXT_PUBLIC_URL)                return process.env.NEXT_PUBLIC_URL.replace(/\/$/, "")
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL)  return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  if (process.env.VERCEL_URL)                     return `https://${process.env.VERCEL_URL}`
  return "http://localhost:3000"
}
```

### Subdomain Resolution (Proxy)

```typescript
// Resolves {subdomain, publicUrl} for the proxy rewrite
export const getSubdomainPublicUrl = () => { ... }
```

---

## 3. Product API Methods

### `commerce.productBrowse(params)`

List/filter products with pagination.

**Parameters:**
```typescript
{
  active?: boolean          // true = published only
  limit?: number            // Items per page (default: varies)
  offset?: number           // Pagination offset
  orderBy?: "createdAt" | "price" | "name"
  orderDirection?: "asc" | "desc"
  category?: string         // Category slug
  collection?: string       // Collection slug
  brand?: string            // Brand filter
  priceMin?: number         // Min price filter
  priceMax?: number         // Max price filter
  vts?: string              // Variant type selector
  featured?: boolean        // Featured products
  q?: string                // Full-text search query
}
```

**Returns:**
```typescript
{
  data: Product[]
  meta: {
    count: number
    limit: number
    offset: number
  }
}
```

**Usage:**
```typescript
const result = await commerce.productBrowse({
  active: true,
  limit: 12,
  offset: 0,
  category: "bags",
  orderBy: "price",
  orderDirection: "asc",
})
```

---

### `commerce.productGet(params)`

Get a single product by ID or slug.

**Parameters:**
```typescript
{ idOrSlug: string }
```

**Returns:** `Product` (or throws if not found)

**Usage:**
```typescript
const product = await commerce.productGet({ idOrSlug: "classic-tote-bag" })
```

---

### Product Type Shape

```typescript
type Product = {
  id: string
  slug: string
  name: string
  summary: string | null
  content: TiptapDocument | null      // Rich text content
  images: string[]                    // Array of image URLs
  type: "standard" | "bundle"
  category: { id: string; slug: string; name: string } | null
  seo: {
    title: string | null
    description: string | null
    canonical: string | null
  } | null
  updatedAt: string                   // ISO 8601
  createdAt: string

  // Variants
  variants: ProductVariant[]

  // Pricing (on variants)
  // Bundle
  bundle?: { groups: BundleGroup[] }
  bundlePriceMode: "fixed" | "amount_off" | "items_sum" | null
  bundleFixedPriceAmount: string | null
  bundleFixedPriceAmountGross: string | null
  bundleAmountOffAmount: string | null
  bundleAmountOffAmountGross: string | null

  // Volume pricing
  volumePricingTiers: VolumePricingTier[] | null
}

type ProductVariant = {
  id: string
  name: string
  sku: string | null
  images: string[]
  attributes: Record<string, string>   // e.g., { Color: "Red", Size: "M" }
  available: boolean
  price: string                        // Minor units as string
  priceGross: string | null            // Gross twin (tax-inclusive)
  originalPrice: string | null         // Before discount
  originalPriceGross: string | null
  calculatedPrice: string | null
  calculatedPriceGross: string | null
  prePromotionPrice: string | null
  prePromotionPriceGross: string | null
  omnibusPrice: string | null          // Omnibus Directive: 30-day lowest
  omnibusPrice Gross: string | null
}
```

---

## 4. Cart API Methods

### `commerce.cartGet(params)`

Retrieve a cart by ID.

**Parameters:**
```typescript
{ cartId: string }
```

**Returns:** `Cart | null`

---

### `commerce.cartUpsert(params)`

Add/update/remove a line item.

**Parameters:**
```typescript
{
  cartId?: string          // Existing cart (creates new if omitted)
  variantId: string
  quantity: number         // 0 = remove item
  mode?: "add" | "set"    // "add" (default) or "set" absolute quantity
}
```

**Returns:** `Cart`

**Behavior:**
- `quantity > 0, mode = "add"` → adds to existing quantity
- `quantity > 0, mode = "set"` → sets absolute quantity
- `quantity = 0` → removes the item

---

### `commerce.cartAddBundle(params)`

Add a configured bundle to the cart.

**Parameters:**
```typescript
{
  cartId?: string
  bundleId: string
  selections: Array<{
    variantId: string
    groupId: string
    quantity: number
  }>
  currency: string
}
```

**Returns:** `Cart`

---

### Cart Type Shape

```typescript
type Cart = {
  id: string
  lineItems: CartLineItem[]
  subtotal?: number | null
  subtotalNet?: number | null
  subtotalGross?: number | null
  currency: string
}

type CartLineItem = {
  id: string
  variantId: string
  productId: string
  name: string
  slug: string
  images: string[]
  attributes: Record<string, string>
  quantity: number
  price: string                  // Unit price (minor units)
  priceGross: string | null
  originalPrice: string | null
  originalPriceGross: string | null
}
```

---

## 5. Collection & Category Methods

### `commerce.collectionBrowse(params)`

```typescript
{
  active?: boolean
  limit?: number
}
// Returns: { data: Collection[], meta: { count } }
```

### `commerce.collectionGet(params)`

```typescript
{ idOrSlug: string }
// Returns: Collection
```

### Collection Type

```typescript
type Collection = {
  id: string
  slug: string
  name: string
  description: string | null
  image: string | null
  createdAt: string
}
```

---

## 6. Blog & Content Methods

### `commerce.postBrowse(params)`

```typescript
{
  active?: boolean
  limit?: number
  offset?: number
}
// Returns: { data: BlogPost[], meta: { count } }
```

### `commerce.postGet(params)`

```typescript
{ idOrSlug: string }
// Returns: BlogPost
```

### BlogPost Type

```typescript
type BlogPost = {
  id: string
  slug: string
  title: string
  summary: string | null
  content: TiptapDocument | null
  publishedAt: string | null
  createdAt: string
  images: string[]
  seo: Seo | null
}
```

---

## 7. Store / Me Methods

### `commerce.meGet()`

Fetches all store-level configuration. This is the single source of truth for store settings.

**Returns:**

```typescript
{
  store: {
    id: string
    name: string
    subdomain: string
    currency: string              // ISO 3-letter code
    locale: string                // BCP47 (e.g., "en-US")
    taxBehavior: "inclusive" | "exclusive"
    settings: {
      storeDescription: string | null
      defaultLanguage: string | null
      ogimage: string | null
      favicon: { imageUrl: string } | null
      logo: string | { imageUrl: string } | null
      enabledTools: {
        blog: boolean
        reviews: boolean
        contactForm: boolean
        newsletterPopup: boolean
        restockNotifications: boolean
      }
      newsletterPopup: NewsletterPopupSettings | null
      // ... additional settings
    } | null
  }
  publicUrl: string
}
```

### Cached Wrapper

```typescript
// lib/commerce.ts — use this everywhere instead of commerce.meGet() directly
export const meGetCached = async (token?: string) => {
  "use cache"
  return Commerce({ token, endpoint }).meGet()
}
```

---

## 8. Search Methods

### `commerce.productSearch(params)`

Full-text product search.

**Parameters:**
```typescript
{
  q: string               // Search query
  limit?: number
  offset?: number
  sort?: string
}
// Returns: { data: Product[], meta: { count } }
```

---

## 9. Review Methods

### `commerce.productReviewsBrowse(params)`

```typescript
{
  idOrSlug: string
  limit?: number
  offset?: number
}
// Returns: { data: Review[], summary: ReviewSummary | null }
```

### `commerce.productReviewCreate(params)`

Submit a product review (Server Action).

```typescript
{
  productId: string
  rating: number           // 1–5
  title: string
  body: string
  reviewerName: string
}
// Returns: { success: boolean }
```

### ReviewSummary Type

```typescript
type ReviewSummary = {
  averageRating: number     // e.g., 4.3
  reviewCount: number
}
```

---

## 10. Legal & FAQ Methods

### `commerce.legalPageBrowse()`

```typescript
// Returns: { data: LegalPage[] }
type LegalPage = { href: string; title: string; updatedAt: string }
```

### `commerce.legalPageGet(params)`

```typescript
{ slug: string }
// Returns: LegalPage & { content: TiptapDocument }
```

### `commerce.faqBrowse()`

```typescript
// Returns: { data: FaqItem[] }
type FaqItem = { question: string; answer: string }
```

---

## 11. Notification Methods

### `commerce.restockNotificationCreate(params)`

Subscribe to restock notifications (Server Action).

```typescript
{
  variantId: string
  email: string
}
// Returns: { success: boolean }
```

### `commerce.newsletterSubscribe(params)`

```typescript
{
  email: string
  consent: boolean
}
// Returns: { success: boolean }
```

---

## 12. Server Actions Reference

All cart mutations are `"use server"` functions in `app/cart/actions.ts`:

| Action | Parameters | Description |
|---|---|---|
| `getCart()` | — | Get current cart from cookie |
| `addToCart(variantId, quantity?)` | `string, number=1` | Add item to cart |
| `removeFromCart(variantId)` | `string` | Remove item (sets quantity to 0) |
| `setCartQuantity(variantId, quantity)` | `string, number` | Set absolute quantity |
| `addBundleToCart(bundleId, selections)` | `string, array` | Add bundle configuration |

**All actions:**
1. Read `yns_cart` cookie to get `cartId`
2. Call `commerce.cartUpsert()` or `commerce.cartAddBundle()`
3. Update cookie if cart ID changed
4. Return `{ success: boolean, cart: Cart | null }`

---

## 13. Error Handling Pattern

All API calls use `safe-try`:

```typescript
import { try_ } from "safe-try"

const [error, result] = await try_(commerce.productGet({ idOrSlug: slug }))
if (error) {
  console.error("productGet failed:", error)
  return null
}
// result: Product (non-null)
```

**Error types from commerce-kit:**
- HTTP 4xx errors → thrown as `Error` with HTTP status message
- Network errors → thrown as `Error`
- Never `undefined` results — either success or throw

---

## 14. Adding New API Calls

### In a Server Component

```typescript
// app/some-page/page.tsx
import { commerce } from "@/lib/commerce"
import { try_ } from "safe-try"

async function SomePage() {
  "use cache"
  cacheLife("minutes")
  
  const [error, data] = await try_(commerce.someMethod({ ... }))
  if (error) return <ErrorState />
  
  return <Component data={data} />
}
```

### In a Server Action

```typescript
// app/some-feature/actions.ts
"use server"

import { commerce } from "@/lib/commerce"
import { try_ } from "safe-try"

export async function someAction(input: string) {
  const [error, result] = await try_(commerce.someMethod({ input }))
  if (error) return { success: false, error: error.message }
  return { success: true, result }
}
```

### In a Client Component (via Server Action)

```typescript
// Client Component
"use client"

import { someAction } from "./actions"

export function SomeButton() {
  const handleClick = async () => {
    const { success, result } = await someAction("value")
    if (!success) toast.error("Failed")
  }
  return <button onClick={handleClick}>Do Something</button>
}
```
