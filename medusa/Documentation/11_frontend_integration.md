# The Letter Ink — Frontend Integration Guide

> **Document:** 11 — Frontend Integration Guide  
> **Scope:** Connecting `yournextstore` (Next.js) to the Medusa v2 backend

---

## Table of Contents

1. [Integration Overview](#1-integration-overview)
2. [Environment Configuration](#2-environment-configuration)
3. [Medusa JS SDK Setup](#3-medusa-js-sdk-setup)
4. [Publishable API Key](#4-publishable-api-key)
5. [Products Integration](#5-products-integration)
6. [Cart Integration](#6-cart-integration)
7. [Checkout Flow](#7-checkout-flow)
8. [Customer Authentication](#8-customer-authentication)
9. [Order Management](#9-order-management)
10. [Regions & Pricing Context](#10-regions--pricing-context)
11. [TypeScript Types](#11-typescript-types)
12. [Error Handling](#12-error-handling)
13. [Required Backend Setup Checklist](#13-required-backend-setup-checklist)

---

## 1. Integration Overview

```
yournextstore (Next.js)
  │
  ├── Uses: @medusajs/js-sdk (official client)
  │
  ├── Calls: /store/* API routes
  │          /auth/* API routes
  │
  ├── Auth: x-publishable-api-key header (always)
  │         Authorization: Bearer <jwt> (for customer routes)
  │
  └── Backend: Medusa @ http://localhost:9000
```

### Communication Contract

| Frontend Operation | Backend Endpoint | Auth |
|---|---|---|
| List products | `GET /store/products` | PK only |
| Get product | `GET /store/products/:id` | PK only |
| Create cart | `POST /store/carts` | PK only |
| Add to cart | `POST /store/carts/:id/line-items` | PK only |
| Checkout | `POST /store/carts/:id/complete` | PK only |
| Register | `POST /auth/customer/emailpass/register` then `POST /store/customers` | None → Bearer |
| Login | `POST /auth/customer/emailpass` | None |
| Profile | `GET /store/customers/me` | Bearer/Session |
| Orders | `GET /store/orders` | Bearer/Session |

---

## 2. Environment Configuration

Add to `yournextstore/.env.local`:

```env
# Medusa backend URL
NEXT_PUBLIC_MEDUSA_BACKEND_URL=http://localhost:9000

# Publishable API key (from Medusa admin → API Keys)
NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=pk_...

# Default region (optional — can be detected from user location)
NEXT_PUBLIC_DEFAULT_REGION=us

# Store URL (for canonical URLs, OG tags)
NEXT_PUBLIC_STORE_URL=http://localhost:3000
```

---

## 3. Medusa JS SDK Setup

### Install

```bash
npm install @medusajs/js-sdk
```

### SDK Client Initialization

```typescript
// lib/medusa.ts
import Medusa from "@medusajs/js-sdk"

export const sdk = new Medusa({
  baseUrl: process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL!,
  debug: process.env.NODE_ENV === "development",
  publishableKey: process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY!,
  auth: {
    type: "session",   // or "jwt"
  },
})
```

### Alternative: Fetch-based Client

```typescript
// lib/medusa-fetch.ts
const BACKEND_URL = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL
const PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY

export async function medusaFetch<T>(
  path: string,
  options: RequestInit = {},
  token?: string
): Promise<T> {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    "x-publishable-api-key": PUBLISHABLE_KEY!,
    ...options.headers,
  }

  if (token) {
    headers["Authorization"] = `Bearer ${token}`
  }

  const res = await fetch(`${BACKEND_URL}${path}`, {
    ...options,
    headers,
  })

  if (!res.ok) {
    const error = await res.json()
    throw new MedusaError(error.message, error.type, res.status)
  }

  return res.json()
}
```

---

## 4. Publishable API Key

### Create in Admin Dashboard

1. Go to Admin → API Keys
2. Click "Create API Key"
3. Set type: **Publishable**
4. Associate with sales channel: default

### Set in Frontend

```typescript
// All store requests automatically include:
headers: {
  "x-publishable-api-key": process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY
}
```

**Important:** Publishable keys are safe to expose client-side. They only scope requests to associated sales channels — they do not grant admin access.

---

## 5. Products Integration

### List Products

```typescript
// lib/products.ts

// Using SDK
export async function getProducts(params?: {
  limit?: number
  offset?: number
  category_id?: string[]
  collection_id?: string[]
  q?: string
  region_id?: string
  currency_code?: string
}) {
  const { products, count } = await sdk.store.product.list({
    fields: "id,title,handle,thumbnail,description,variants,variants.prices,options,categories,collection",
    limit: params?.limit ?? 12,
    offset: params?.offset ?? 0,
    category_id: params?.category_id,
    collection_id: params?.collection_id,
    q: params?.q,
    region_id: params?.region_id,
  })

  return { products, count }
}

// Using fetch
export async function getProductsRaw(params = {}) {
  const query = new URLSearchParams(params as any).toString()
  return medusaFetch<{
    products: StoreProduct[]
    count: number
    offset: number
    limit: number
  }>(`/store/products?${query}&fields=id,title,handle,thumbnail,variants.prices,options,images`)
}
```

### Get Single Product

```typescript
export async function getProduct(handle: string, regionId?: string) {
  const { products } = await sdk.store.product.list({
    handle,
    region_id: regionId,
    fields: "*variants,*variants.prices,*options,*options.values,*images,*categories,*tags,collection",
  })

  return products[0] ?? null
}
```

### Product Listing Page (Next.js RSC)

```tsx
// app/products/page.tsx
import { getProducts } from "@/lib/products"

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: { page?: string; category?: string; q?: string }
}) {
  const page = Number(searchParams.page ?? 1)
  const limit = 12
  const offset = (page - 1) * limit

  const { products, count } = await getProducts({
    limit,
    offset,
    category_id: searchParams.category ? [searchParams.category] : undefined,
    q: searchParams.q,
  })

  return (
    <div>
      <ProductGrid products={products} />
      <Pagination total={count} page={page} limit={limit} />
    </div>
  )
}
```

---

## 6. Cart Integration

### Cart State Management

```typescript
// context/cart-context.tsx
"use client"

import { createContext, useContext, useState, useCallback } from "react"
import { sdk } from "@/lib/medusa"
import type { StoreCart } from "@medusajs/types"

type CartContext = {
  cart: StoreCart | null
  cartId: string | null
  addItem: (variantId: string, quantity: number) => Promise<void>
  removeItem: (lineItemId: string) => Promise<void>
  updateItem: (lineItemId: string, quantity: number) => Promise<void>
  refreshCart: () => Promise<void>
}

const CartContext = createContext<CartContext | null>(null)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<StoreCart | null>(null)
  const [cartId, setCartId] = useState<string | null>(
    () => localStorage.getItem("cart_id")
  )

  const refreshCart = useCallback(async () => {
    if (!cartId) return
    const { cart } = await sdk.store.cart.retrieve(cartId)
    setCart(cart)
  }, [cartId])

  const getOrCreateCart = async () => {
    if (cartId) return cartId

    const { cart } = await sdk.store.cart.create({
      region_id: getRegionId(),  // from region context
    })

    localStorage.setItem("cart_id", cart.id)
    setCartId(cart.id)
    setCart(cart)
    return cart.id
  }

  const addItem = async (variantId: string, quantity: number) => {
    const id = await getOrCreateCart()
    const { cart: updatedCart } = await sdk.store.cart.createLineItem(id, {
      variant_id: variantId,
      quantity,
    })
    setCart(updatedCart)
  }

  const removeItem = async (lineItemId: string) => {
    if (!cartId) return
    const { cart: updatedCart } = await sdk.store.cart.deleteLineItem(
      cartId,
      lineItemId
    )
    setCart(updatedCart)
  }

  const updateItem = async (lineItemId: string, quantity: number) => {
    if (!cartId) return
    const { cart: updatedCart } = await sdk.store.cart.updateLineItem(
      cartId,
      lineItemId,
      { quantity }
    )
    setCart(updatedCart)
  }

  return (
    <CartContext.Provider value={{ cart, cartId, addItem, removeItem, updateItem, refreshCart }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error("useCart must be used within CartProvider")
  return ctx
}
```

### Add to Cart Button

```tsx
// components/add-to-cart.tsx
"use client"

import { useCart } from "@/context/cart-context"
import { useState } from "react"

export function AddToCart({ variantId }: { variantId: string }) {
  const { addItem } = useCart()
  const [loading, setLoading] = useState(false)

  const handleAdd = async () => {
    setLoading(true)
    try {
      await addItem(variantId, 1)
    } catch (err) {
      console.error("Failed to add item:", err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <button onClick={handleAdd} disabled={loading}>
      {loading ? "Adding..." : "Add to Cart"}
    </button>
  )
}
```

---

## 7. Checkout Flow

```typescript
// lib/checkout.ts

// 1. Set shipping address
export async function setShippingAddress(cartId: string, address: Address) {
  return sdk.store.cart.update(cartId, { shipping_address: address })
}

// 2. Get shipping options for cart
export async function getShippingOptions(cartId: string) {
  const { shipping_options } = await sdk.store.fulfillment.listCartOptions({
    cart_id: cartId,
  })
  return shipping_options
}

// 3. Select shipping option
export async function addShippingMethod(cartId: string, optionId: string) {
  return sdk.store.cart.addShippingMethod(cartId, {
    option_id: optionId,
  })
}

// 4. Initialize payment
export async function initializePayment(cartId: string) {
  // Get or create payment collection
  const { payment_collection } = await sdk.store.paymentCollection.create({
    cart_id: cartId,
  })

  // Create Stripe payment session
  const { payment_collection: updated } =
    await sdk.store.paymentCollection.createPaymentSession(
      payment_collection.id,
      { provider_id: "pp_stripe_stripe" }
    )

  return updated
}

// 5. Complete cart → place order
export async function completeCart(cartId: string) {
  const result = await sdk.store.cart.complete(cartId)

  if (result.type === "order") {
    // Success — clear cart from localStorage
    localStorage.removeItem("cart_id")
    return { success: true, order: result.order }
  }

  // Payment needs more action (3DS, etc.)
  return { success: false, cart: result.cart }
}
```

### Checkout Page

```tsx
// app/checkout/page.tsx
"use client"

import { useState } from "react"
import { useCart } from "@/context/cart-context"
import { useRouter } from "next/navigation"
import {
  getShippingOptions,
  addShippingMethod,
  initializePayment,
  completeCart,
} from "@/lib/checkout"
import { Elements } from "@stripe/react-stripe-js"
import { loadStripe } from "@stripe/stripe-js"

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_KEY!)

export default function CheckoutPage() {
  const { cart, cartId } = useCart()
  const router = useRouter()
  const [step, setStep] = useState<"shipping" | "payment" | "review">("shipping")

  const handleComplete = async () => {
    if (!cartId) return
    const result = await completeCart(cartId)
    if (result.success && result.order) {
      router.push(`/order/${result.order.id}?success=true`)
    }
  }

  return (
    <div>
      {step === "shipping" && <ShippingStep cartId={cartId!} onNext={() => setStep("payment")} />}
      {step === "payment" && (
        <Elements stripe={stripePromise}>
          <PaymentStep cartId={cartId!} onNext={() => setStep("review")} />
        </Elements>
      )}
      {step === "review" && (
        <ReviewStep cart={cart!} onComplete={handleComplete} />
      )}
    </div>
  )
}
```

---

## 8. Customer Authentication

### Registration

```typescript
// lib/auth.ts
export async function registerCustomer(data: {
  email: string
  password: string
  first_name: string
  last_name: string
}) {
  // Step 1: Create auth identity
  const { token } = await sdk.auth.register("customer", "emailpass", {
    email: data.email,
    password: data.password,
  })

  // Step 2: Create customer profile
  const { customer } = await sdk.store.customer.create(
    {
      email: data.email,
      first_name: data.first_name,
      last_name: data.last_name,
    },
    { Authorization: `Bearer ${token}` }
  )

  return { token, customer }
}
```

### Login

```typescript
export async function loginCustomer(email: string, password: string) {
  const { token } = await sdk.auth.login("customer", "emailpass", {
    email,
    password,
  })

  // Store token
  localStorage.setItem("customer_token", token)

  return token
}
```

### Auth Context

```tsx
// context/auth-context.tsx
"use client"

import { createContext, useContext, useState, useEffect } from "react"
import { sdk } from "@/lib/medusa"
import type { StoreCustomer } from "@medusajs/types"

type AuthContext = {
  customer: StoreCustomer | null
  token: string | null
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContext | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [customer, setCustomer] = useState<StoreCustomer | null>(null)
  const [token, setToken] = useState<string | null>(null)

  useEffect(() => {
    const savedToken = localStorage.getItem("customer_token")
    if (savedToken) {
      setToken(savedToken)
      fetchCustomer(savedToken)
    }
  }, [])

  const fetchCustomer = async (t: string) => {
    try {
      const { customer } = await sdk.store.customer.retrieve({}, {
        Authorization: `Bearer ${t}`,
      })
      setCustomer(customer)
    } catch {
      localStorage.removeItem("customer_token")
    }
  }

  const login = async (email: string, password: string) => {
    const { token: t } = await sdk.auth.login("customer", "emailpass", {
      email, password,
    })
    localStorage.setItem("customer_token", t)
    setToken(t)
    await fetchCustomer(t)
  }

  const logout = async () => {
    localStorage.removeItem("customer_token")
    setToken(null)
    setCustomer(null)
  }

  return (
    <AuthContext.Provider value={{
      customer, token, login, logout,
      isAuthenticated: !!customer,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used within AuthProvider")
  return ctx
}
```

---

## 9. Order Management

```typescript
// lib/orders.ts

export async function getOrders(token: string) {
  const { orders } = await sdk.store.order.list(
    { fields: "id,display_id,status,total,currency_code,created_at,items" },
    { Authorization: `Bearer ${token}` }
  )
  return orders
}

export async function getOrder(orderId: string) {
  const { order } = await sdk.store.order.retrieve(orderId, {
    fields: "id,display_id,status,total,subtotal,shipping_total,tax_total,currency_code,items,shipping_address,fulfillments,returns,payment_collections",
  })
  return order
}
```

---

## 10. Regions & Pricing Context

### Detect Region

```typescript
// lib/regions.ts
export async function getRegionByCountry(countryCode: string) {
  const { regions } = await sdk.store.region.list({
    fields: "id,name,currency_code,countries.iso_2",
  })

  return regions.find(r =>
    r.countries?.some(c => c.iso_2?.toLowerCase() === countryCode.toLowerCase())
  )
}

export async function detectRegion() {
  // Try to detect from browser locale or IP
  const browserLocale = navigator.language.split("-")[1]?.toLowerCase() ?? "us"

  try {
    const region = await getRegionByCountry(browserLocale)
    return region
  } catch {
    // Fallback to first available region
    const { regions } = await sdk.store.region.list()
    return regions[0]
  }
}
```

### Region Context

```tsx
// context/region-context.tsx
"use client"

import { createContext, useContext, useState, useEffect } from "react"
import { detectRegion } from "@/lib/regions"

const RegionContext = createContext<{
  regionId: string | null
  currencyCode: string | null
}>({ regionId: null, currencyCode: null })

export function RegionProvider({ children }: { children: React.ReactNode }) {
  const [regionId, setRegionId] = useState<string | null>(null)
  const [currencyCode, setCurrencyCode] = useState<string | null>(null)

  useEffect(() => {
    detectRegion().then(region => {
      if (region) {
        setRegionId(region.id)
        setCurrencyCode(region.currency_code)
      }
    })
  }, [])

  return (
    <RegionContext.Provider value={{ regionId, currencyCode }}>
      {children}
    </RegionContext.Provider>
  )
}

export const useRegion = () => useContext(RegionContext)
```

### Pass Region to Product Queries

```typescript
// Always pass region_id when fetching products for correct pricing
const { products } = await sdk.store.product.list({
  region_id: regionId,      // ← for price computation
  country_code: "US",       // ← for tax computation
  fields: "id,title,variants.prices.*",
})
```

---

## 11. TypeScript Types

The `@medusajs/types` package exports all HTTP types:

```typescript
import type {
  StoreProduct,
  StoreProductVariant,
  StoreCart,
  StoreLineItem,
  StoreShippingMethod,
  StoreOrder,
  StoreOrderLineItem,
  StoreCustomer,
  StoreRegion,
  StorePaymentCollection,
  StorePaymentSession,
  StoreFulfillment,
  StoreReturn,
  StoreProductCategory,
  StoreProductCollection,
  StoreShippingOption,
} from "@medusajs/types"
```

---

## 12. Error Handling

### Standard Error Response

```typescript
// lib/errors.ts
export class MedusaApiError extends Error {
  constructor(
    message: string,
    public type: string,
    public status: number
  ) {
    super(message)
  }
}

// Common error types
const ERROR_TYPES = {
  not_found: 404,
  invalid_data: 400,
  not_allowed: 400,
  unauthorized: 401,
  forbidden: 403,
}

export function handleApiError(error: unknown) {
  if (error instanceof MedusaApiError) {
    switch (error.type) {
      case "not_found":
        return notFound()        // Next.js notFound()
      case "unauthorized":
        return redirect("/login")
      default:
        return { error: error.message }
    }
  }
  throw error
}
```

### Form Error Handling

```typescript
// In server actions or client handlers
try {
  await addItem(variantId, quantity)
} catch (err) {
  if (err instanceof MedusaApiError && err.type === "invalid_data") {
    setError(err.message)
    return
  }
  throw err
}
```

---

## 13. Required Backend Setup Checklist

Before the frontend can function, complete these setup steps in the Medusa admin:

### 1. Create Store

- [ ] Set store name: "The Letter Ink"
- [ ] Add supported currencies (e.g., USD, INR)
- [ ] Set default currency

### 2. Create Sales Channel

- [ ] Create "Online Store" sales channel
- [ ] Note the Sales Channel ID

### 3. Create Publishable API Key

- [ ] Go to Admin → API Keys → Create
- [ ] Type: Publishable
- [ ] Associate with "Online Store" sales channel
- [ ] Copy key → set in frontend `.env.local`

### 4. Create Region

- [ ] Create region (e.g., "United States")
- [ ] Set currency: USD
- [ ] Add countries: US
- [ ] Enable automatic taxes

### 5. Configure Shipping

- [ ] Create Stock Location
- [ ] Create Fulfillment Set → associate with Stock Location
- [ ] Create Service Zone with GeoZones (country: US)
- [ ] Create Shipping Options (e.g., "Standard Shipping" - $4.99)

### 6. Configure Payment

- [ ] Add payment provider to region (Stripe)
- [ ] Set Stripe API key in backend env

### 7. Create Products

- [ ] Create product categories
- [ ] Create products with variants and pricing
- [ ] Associate products with sales channel
- [ ] Set inventory levels

### 8. Configure Tax (optional)

- [ ] Create Tax Region for each country
- [ ] Add default tax rate

### Backend Environment Variables Required

```env
DATABASE_URL=postgresql://...
JWT_SECRET=...
COOKIE_SECRET=...
ADMIN_CORS=http://localhost:5173
STORE_CORS=http://localhost:3000
AUTH_CORS=http://localhost:3000
STRIPE_API_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```
