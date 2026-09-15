# The Letter Ink — yournextstore: Medusa Backend Integration Guide

> **Document:** F09 — Medusa Integration Guide  
> **Purpose:** Replace the YNS platform API with the Medusa v2 backend

---

## Table of Contents

1. [Integration Strategy](#1-integration-strategy)
2. [Architecture Comparison](#2-architecture-comparison)
3. [Environment Configuration](#3-environment-configuration)
4. [commerce-kit to Medusa API Mapping](#4-commerce-kit-to-medusa-api-mapping)
5. [Cart Integration](#5-cart-integration)
6. [Checkout Flow](#6-checkout-flow)
7. [Authentication Flow](#7-authentication-flow)
8. [Product Data Mapping](#8-product-data-mapping)
9. [Pricing & Tax Integration](#9-pricing--tax-integration)
10. [What Needs Custom Implementation](#10-what-needs-custom-implementation)
11. [Step-by-Step Integration Checklist](#11-step-by-step-integration-checklist)

---

## 1. Integration Strategy

The `yournextstore` frontend uses `commerce-kit` SDK which abstracts the backend API. To connect it to the **Medusa backend** instead of the YNS platform, there are two approaches:

### Option A: Configure commerce-kit with Medusa endpoint (Recommended)

If `commerce-kit` supports a Medusa-compatible API, set `NEXT_PUBLIC_YNS_API_TENANT` to point to the Medusa instance. The SDK handles the rest.

```env
YNS_API_KEY=<medusa-publishable-api-key>
NEXT_PUBLIC_YNS_API_TENANT=http://localhost:9000
```

### Option B: Replace commerce-kit with Medusa JS SDK

If the API shapes differ significantly, replace `commerce-kit` calls in `lib/commerce.ts` with direct Medusa SDK calls using `@medusajs/js-sdk`.

```bash
npm install @medusajs/js-sdk @medusajs/types
```

This document covers **Option B** in full detail — the explicit Medusa SDK approach.

---

## 2. Architecture Comparison

| Concern | YNS Platform | Medusa Backend |
|---|---|---|
| Product API | `commerce.productBrowse()` | `sdk.store.product.list()` |
| Cart API | `commerce.cartUpsert()` | `sdk.store.cart.createLineItem()` |
| Checkout | Proxied `/checkout` | Medusa checkout flow |
| Auth | Proxied `/account` | Medusa customer auth |
| Search | `commerce.productSearch()` | `sdk.store.product.list({ q })` |
| Collections | `commerce.collectionBrowse()` | `sdk.store.collection.list()` |
| Reviews | `commerce.productReviewsBrowse()` | Custom extension |
| Blog | `commerce.postBrowse()` | Not in Medusa core |
| Regions | Built into SDK | Explicit region selection |

---

## 3. Environment Configuration

### yournextstore `.env.local`

```env
# Medusa backend URL
NEXT_PUBLIC_MEDUSA_BACKEND_URL=http://localhost:9000

# Publishable API key (from Medusa Admin → API Keys)
NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=pk_...

# Canonical URL for SEO
NEXT_PUBLIC_URL=https://theletterink.com

# Default region ID (from Medusa Admin → Regions)
NEXT_PUBLIC_DEFAULT_REGION_ID=reg_01...

# Default currency + locale
NEXT_PUBLIC_CURRENCY=inr
NEXT_PUBLIC_LOCALE=en-IN
```

### Medusa Backend `.env`

```env
DATABASE_URL=postgresql://...
JWT_SECRET=<64+ chars>
COOKIE_SECRET=<64+ chars>
ADMIN_CORS=http://localhost:5173
STORE_CORS=http://localhost:3000
AUTH_CORS=http://localhost:3000
REDIS_URL=redis://localhost:6379
STRIPE_API_KEY=sk_test_...
```

---

## 4. commerce-kit to Medusa API Mapping

### Initialize Medusa SDK

```typescript
// lib/medusa.ts (NEW — replaces lib/commerce.ts pattern)
import Medusa from "@medusajs/js-sdk"

export const sdk = new Medusa({
  baseUrl: process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL!,
  publishableKey: process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY!,
  auth: { type: "session" },
})
```

### Product Browse

```typescript
// YNS commerce-kit:
const result = await commerce.productBrowse({ active: true, limit: 12, category: "bags" })

// Medusa equivalent:
const { products, count } = await sdk.store.product.list({
  limit: 12,
  offset: 0,
  category_id: [categoryId],  // Note: needs category ID, not slug
  fields: "id,title,handle,thumbnail,variants,variants.prices,options,images",
  region_id: regionId,
})
```

### Product Get

```typescript
// YNS:
const product = await commerce.productGet({ idOrSlug: slug })

// Medusa:
const { products } = await sdk.store.product.list({
  handle: slug,
  region_id: regionId,
  fields: "*variants,*variants.prices,*options,*images,*categories",
})
const product = products[0] ?? null
```

### Collections

```typescript
// YNS:
const result = await commerce.collectionBrowse({ limit: 5 })

// Medusa:
const { collections } = await sdk.store.collection.list({ limit: 5 })
```

### Cart Get

```typescript
// YNS:
const cart = await commerce.cartGet({ cartId })

// Medusa:
const { cart } = await sdk.store.cart.retrieve(cartId)
```

### Cart Add Item

```typescript
// YNS:
const cart = await commerce.cartUpsert({ cartId, variantId, quantity })

// Medusa:
const { cart } = await sdk.store.cart.createLineItem(cartId, {
  variant_id: variantId,
  quantity,
})
```

### Cart Update Quantity

```typescript
// YNS: cartUpsert with mode: "set"
const cart = await commerce.cartUpsert({ cartId, variantId, quantity, mode: "set" })

// Medusa: needs line item ID, not variant ID
const { cart } = await sdk.store.cart.updateLineItem(cartId, lineItemId, { quantity })
```

> **Key Difference:** Medusa uses `lineItemId` for updates/deletes, not `variantId`. Store the line item ID in the cart context.

### Cart Remove Item

```typescript
// YNS: quantity 0
const cart = await commerce.cartUpsert({ cartId, variantId, quantity: 0 })

// Medusa:
const { cart } = await sdk.store.cart.deleteLineItem(cartId, lineItemId)
```

---

## 5. Cart Integration

### Cart Cookie

Keep the same cookie name `yns_cart` with `{ id: cartId }` — no changes needed.

### Updated `app/cart/actions.ts`

```typescript
"use server"

import { sdk } from "@/lib/medusa"
import { getCartCookieJson, setCartCookie } from "@/lib/cookies"

export async function getCart() {
  const cartCookie = await getCartCookieJson()
  if (!cartCookie?.id) return null
  
  const [error, data] = await try_(sdk.store.cart.retrieve(cartCookie.id))
  if (error) return null
  return data.cart
}

export async function addToCart(variantId: string, quantity = 1) {
  const cartCookie = await getCartCookieJson()
  
  // Create cart if needed
  if (!cartCookie?.id) {
    const { cart: newCart } = await sdk.store.cart.create({
      region_id: process.env.NEXT_PUBLIC_DEFAULT_REGION_ID!,
    })
    await setCartCookie({ id: newCart.id })
    const { cart } = await sdk.store.cart.createLineItem(newCart.id, {
      variant_id: variantId,
      quantity,
    })
    return { success: true, cart }
  }
  
  const [error, data] = await try_(
    sdk.store.cart.createLineItem(cartCookie.id, { variant_id: variantId, quantity })
  )
  if (error) return { success: false, cart: null }
  return { success: true, cart: data.cart }
}

export async function removeFromCart(lineItemId: string) {
  const cartCookie = await getCartCookieJson()
  if (!cartCookie?.id) return { success: false, cart: null }
  
  const [error, data] = await try_(
    sdk.store.cart.deleteLineItem(cartCookie.id, lineItemId)
  )
  if (error) return { success: false, cart: null }
  return { success: true, cart: data.cart }
}

export async function setCartQuantity(lineItemId: string, quantity: number) {
  const cartCookie = await getCartCookieJson()
  if (!cartCookie?.id) return { success: false, cart: null }
  
  if (quantity <= 0) return removeFromCart(lineItemId)
  
  const [error, data] = await try_(
    sdk.store.cart.updateLineItem(cartCookie.id, lineItemId, { quantity })
  )
  if (error) return { success: false, cart: null }
  return { success: true, cart: data.cart }
}
```

---

## 6. Checkout Flow

### Current (YNS Platform)

```
User clicks checkout → <a href="/checkout"> → Proxy rewrites to platform checkout
```

The entire checkout (address, shipping, payment, confirmation) is handled by the platform.

### Medusa Checkout Flow

With Medusa, checkout must be built as Next.js pages or can redirect to a hosted Medusa checkout:

**Option 1: Build custom checkout pages**

```
/checkout/address     → Set shipping address
/checkout/shipping    → Select shipping option
/checkout/payment     → Initialize Stripe payment session
/checkout/review      → Review order
→ Complete cart → Order confirmation → /order/success
```

**Option 2: Hosted Medusa checkout** (if available)

Configure `proxy.ts` to point to Medusa's checkout URL instead of the YNS platform.

### Checkout Step Implementation

```typescript
// app/checkout/address/actions.ts
"use server"

export async function setShippingAddress(address: Address) {
  const cartCookie = await getCartCookieJson()
  if (!cartCookie?.id) return { success: false }
  
  const { cart } = await sdk.store.cart.update(cartCookie.id, {
    shipping_address: address,
    billing_address: address,
    email: address.email,
  })
  return { success: true, cart }
}

// app/checkout/shipping/actions.ts
export async function getShippingOptions() {
  const cartCookie = await getCartCookieJson()
  const { shipping_options } = await sdk.store.fulfillment.listCartOptions({
    cart_id: cartCookie!.id,
  })
  return shipping_options
}

export async function selectShipping(optionId: string) {
  const cartCookie = await getCartCookieJson()
  await sdk.store.cart.addShippingMethod(cartCookie!.id, { option_id: optionId })
}

// app/checkout/payment/actions.ts
export async function initializePayment() {
  const cartCookie = await getCartCookieJson()
  const { payment_collection } = await sdk.store.paymentCollection.create({
    cart_id: cartCookie!.id,
  })
  const { payment_collection: updated } =
    await sdk.store.paymentCollection.createPaymentSession(
      payment_collection.id,
      { provider_id: "pp_stripe_stripe" }
    )
  return updated
}

// app/checkout/confirm/actions.ts
export async function completeCheckout() {
  const cartCookie = await getCartCookieJson()
  const result = await sdk.store.cart.complete(cartCookie!.id)
  if (result.type === "order") {
    // Clear cart cookie
    await setCartCookie({ id: "" })
    return { success: true, orderId: result.order.id }
  }
  return { success: false }
}
```

### Update `proxy.ts` for Medusa

Remove checkout proxy (since checkout is now local):
```typescript
// proxy.ts — update proxied routes
const proxiedRoutes = [
  // Remove "/checkout" — now handled by Next.js pages
  "/api/feed/",
  "/api/chat",
  "/account",  // Can keep if using Medusa account or build custom
]
```

---

## 7. Authentication Flow

### Current (YNS Platform)

Auth is entirely proxied to the platform — no auth in Next.js app.

### Medusa Customer Auth

With Medusa, build auth pages directly:

```typescript
// app/login/actions.ts
"use server"

export async function loginCustomer(email: string, password: string) {
  const { token } = await sdk.auth.login("customer", "emailpass", {
    email, password,
  })
  // Store in httpOnly cookie
  const cookieStore = await cookies()
  cookieStore.set("customer_token", token, {
    httpOnly: true,
    secure: true,
    path: "/",
    sameSite: "lax",
  })
  return { success: true }
}

export async function registerCustomer(data: RegisterData) {
  // Step 1: Create auth identity
  const { token } = await sdk.auth.register("customer", "emailpass", {
    email: data.email,
    password: data.password,
  })
  
  // Step 2: Create customer profile with JWT
  const { customer } = await sdk.store.customer.create(
    { email: data.email, first_name: data.firstName, last_name: data.lastName },
    { Authorization: `Bearer ${token}` }
  )
  
  // Store token
  const cookieStore = await cookies()
  cookieStore.set("customer_token", token, { httpOnly: true, secure: true, path: "/" })
  
  return { success: true, customer }
}

export async function logoutCustomer() {
  const cookieStore = await cookies()
  cookieStore.delete("customer_token")
}
```

### Protected Routes

```typescript
// middleware.ts
import { NextRequest, NextResponse } from "next/server"

export function middleware(request: NextRequest) {
  const token = request.cookies.get("customer_token")
  
  if (request.nextUrl.pathname.startsWith("/account") && !token) {
    return NextResponse.redirect(new URL("/login", request.url))
  }
  
  return NextResponse.next()
}
```

---

## 8. Product Data Mapping

### Field Name Differences

| YNS `Product` | Medusa `StoreProduct` | Notes |
|---|---|---|
| `product.name` | `product.title` | Different field name |
| `product.slug` | `product.handle` | Different field name |
| `product.summary` | `product.description` | May differ in format |
| `product.content` | `product.description` | Medusa: plain text; YNS: Tiptap JSON |
| `product.images` | `product.images[].url` | Medusa: array of objects |
| `product.category` | `product.categories[0]` | Medusa: array |
| `product.updatedAt` | `product.updated_at` | snake_case |
| `variant.price` | `variant.calculated_price?.calculated_amount` | Requires region context |
| `variant.available` | `variant.inventory_quantity > 0` | |

### Price Extraction from Medusa

```typescript
// Medusa price is in variant.prices[] — select by region + currency
const price = variant.calculated_price?.calculated_amount
  ?? variant.prices.find(p => p.currency_code === currencyCode)?.amount

// Format (minor units → display)
const displayPrice = formatMoney({
  amount: price,
  currency: currencyCode,
  locale: storeLocale,
})
```

### Adapt Product Shape

```typescript
// lib/adapters/product.ts
import type { StoreProduct } from "@medusajs/types"

export function adaptProduct(medusaProduct: StoreProduct, currencyCode: string) {
  return {
    id: medusaProduct.id,
    slug: medusaProduct.handle,
    name: medusaProduct.title,
    summary: medusaProduct.description,
    images: medusaProduct.images?.map(i => i.url) ?? [],
    category: medusaProduct.categories?.[0] 
      ? { id: medusaProduct.categories[0].id, slug: medusaProduct.categories[0].handle, name: medusaProduct.categories[0].name }
      : null,
    variants: medusaProduct.variants?.map(v => ({
      id: v.id,
      name: v.title,
      sku: v.sku,
      attributes: v.options?.reduce((acc, o) => ({
        ...acc, [o.option?.title ?? ""]: o.value
      }), {}),
      available: (v.inventory_quantity ?? 0) > 0 || !v.manage_inventory,
      price: String(v.calculated_price?.calculated_amount ?? 
             v.prices?.find(p => p.currency_code === currencyCode)?.amount ?? 0),
      images: [],
    })),
  }
}
```

---

## 9. Pricing & Tax Integration

### Region-Aware Pricing

Medusa requires a `region_id` for price computation:

```typescript
// lib/region.ts
export async function getDefaultRegion() {
  const { regions } = await sdk.store.region.list()
  return regions.find(r => 
    r.countries?.some(c => c.iso_2 === "IN")  // The Letter Ink → India
  ) ?? regions[0]
}
```

Pass `region_id` to ALL product queries:
```typescript
const { products } = await sdk.store.product.list({
  region_id: region.id,
  fields: "*variants.calculated_price",
})
```

### Tax Behavior

`lib/pricing.ts` already handles `inclusive` vs `exclusive` tax — map Medusa's region `tax_inclusive_pricing` to the `taxBehavior` value in `StoreConfigProvider`.

---

## 10. What Needs Custom Implementation

The following features exist in YNS platform but NOT in Medusa core:

| Feature | YNS Status | Medusa Status | Action Required |
|---|---|---|---|
| Product reviews | Built-in | ❌ Not in core | Build custom module + API |
| Blog / Posts | Built-in | ❌ Not in core | Build custom module |
| FAQ pages | Built-in | ❌ Not in core | Build custom module |
| Legal pages | Built-in | ❌ Not in core | Build custom module |
| Newsletter | Built-in | ❌ Not in core | Use SendGrid directly |
| Restock notifications | Built-in | ❌ Not in core | Build subscriber + notification |
| Bundle products | Built-in | ⚠️ Partial | Custom product type |
| Volume pricing | Built-in | ⚠️ Partial | Price list by quantity |
| AI chat | Built-in | ❌ Not in core | Build using Vercel AI SDK + Medusa API |
| Product feeds (GMC, Meta) | Built-in | ❌ Not in core | Build `/api/feed/*` routes |
| Analytics kit | Platform-managed | ❌ Not in core | Configure tracking manually |

---

## 11. Step-by-Step Integration Checklist

### Phase 1: Backend Setup

- [ ] Medusa backend running at `localhost:9000`
- [ ] PostgreSQL migrated (`npx medusa db:migrate`)
- [ ] Admin account created
- [ ] Sales channel created ("The Letter Ink")
- [ ] Publishable API key created and associated
- [ ] Region created (INR / India)
- [ ] Shipping configured
- [ ] Payment provider configured (Stripe)
- [ ] Products created with variants and prices

### Phase 2: Frontend Setup

- [ ] Install `@medusajs/js-sdk @medusajs/types`
- [ ] Create `lib/medusa.ts` with SDK client
- [ ] Create `lib/region.ts` for region detection
- [ ] Update `.env.local` with Medusa values

### Phase 3: API Layer Replacement

- [ ] Replace `lib/commerce.ts` `meGet()` → store settings from env or Medusa settings API
- [ ] Replace `commerce.productBrowse()` → `sdk.store.product.list()`
- [ ] Replace `commerce.productGet()` → `sdk.store.product.list({ handle })`
- [ ] Replace `commerce.collectionBrowse()` → `sdk.store.collection.list()`
- [ ] Replace `commerce.cartGet()` → `sdk.store.cart.retrieve()`
- [ ] Replace `commerce.cartUpsert()` → `sdk.store.cart.createLineItem()`
- [ ] Update cart actions for Medusa line item IDs

### Phase 4: Checkout

- [ ] Build `/checkout/address` page
- [ ] Build `/checkout/shipping` page
- [ ] Build `/checkout/payment` page (Stripe Elements)
- [ ] Build `/checkout/review` page
- [ ] Update `proxy.ts` — remove `/checkout` proxy
- [ ] Test full checkout flow

### Phase 5: Authentication

- [ ] Build `/login` and `/register` pages
- [ ] Build `/account` pages (orders, profile, addresses)
- [ ] Add customer token cookie management
- [ ] Add middleware for protected routes

### Phase 6: Custom Modules (as needed)

- [ ] Blog module (if needed)
- [ ] Reviews module (if needed)
- [ ] FAQ / Legal content (CMS or hardcoded)
- [ ] Newsletter integration (SendGrid)
- [ ] Product feeds

### Phase 7: QA

- [ ] Run `bun run check` — all types pass
- [ ] Run `bun test` — all tests pass
- [ ] Run `bun run build` — shell integrity check passes
- [ ] Run Lighthouse audit
- [ ] Test on mobile
- [ ] Test dark mode
- [ ] Test with real Stripe test cards
