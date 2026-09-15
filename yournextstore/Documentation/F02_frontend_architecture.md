# The Letter Ink — yournextstore: Frontend Architecture

> **Document:** F02 — Frontend Architecture  
> **Next.js Version:** 16.3.4

---

## Table of Contents

1. [Architecture Overview](#1-architecture-overview)
2. [Rendering Strategy](#2-rendering-strategy)
3. [The Prerendered Shell Pattern](#3-the-prerendered-shell-pattern)
4. [Caching Strategy](#4-caching-strategy)
5. [Proxy Middleware](#5-proxy-middleware)
6. [Cart Architecture](#6-cart-architecture)
7. [React 19 & Compiler](#7-react-19--compiler)
8. [Data Fetching Patterns](#8-data-fetching-patterns)
9. [Error Handling Architecture](#9-error-handling-architecture)
10. [Analytics Architecture](#10-analytics-architecture)
11. [Authentication Architecture](#11-authentication-architecture)

---

## 1. Architecture Overview

```
Browser
   │
   ▼
Next.js 16 (App Router)
   │
   ├── Prerendered Shell (static HTML at build time)
   │   ├── <html> + <head> (metadata, fonts, favicons)
   │   ├── <header> (nav, search, theme, account, cart button)
   │   └── <footer>
   │
   ├── Streaming Content (RSC, Suspense boundaries)
   │   ├── Page-specific content (product, cart, listing)
   │   └── CartBootstrap (cookie read, streams after shell)
   │
   ├── Client Components (interactive islands)
   │   ├── CartProvider (context)
   │   ├── CartSidebar (drawer)
   │   ├── AddToCartButton
   │   ├── VariantSelector
   │   ├── ProductFilters
   │   ├── SearchInput
   │   └── StoreChatPanel
   │
   └── Proxy Middleware (edge)
       ├── /checkout/* → Platform backend
       ├── /account/*  → Platform backend
       ├── /api/chat/* → Platform backend
       ├── /api/feed/* → Platform backend
       └── /_public/*  → Platform assets
```

---

## 2. Rendering Strategy

### Server Components (RSC) — Default

All page components are async Server Components by default. They:
- Run on the server only
- Can directly access environment variables
- Can call the commerce-kit SDK without any client-side API calls
- Never ship their code to the browser

```typescript
// Server Component — fetches and renders on server
export default async function ProductsPage({ searchParams }) {
  const products = await commerce.productBrowse({ active: true, limit: 12 })
  return <ProductGrid products={products.data} />
}
```

### Client Components — Islands Pattern

Only interactive components use `"use client"`:

```typescript
"use client"

// Client Component — runs in browser, receives props from RSC
export function AddToCartButton({ variantId }: { variantId: string }) {
  const { addItem } = useCart()
  // ...
}
```

### Server Actions — Mutations

Cart mutations use Next.js Server Actions (not API routes):

```typescript
"use server"

export async function addToCart(variantId: string, quantity = 1) {
  const cartCookie = await getCartCookieJson()
  const [error, cart] = await try_(commerce.cartUpsert({ ... }))
  // ...
}
```

---

## 3. The Prerendered Shell Pattern

This is the **most critical architectural constraint** in the project.

### What is the Shell?

The "shell" is the HTML rendered at build time (or edge) that appears instantly on any page load. It must include the entire chrome (header + footer) before any dynamic content streams in.

### Rule

> **Never `await` request-time data above the chrome.**  
> `cookies()`, `headers()`, `searchParams`, the cart — all must be read inside a `<Suspense>` boundary **below** the header and footer.

### Why This Matters

```
WITHOUT the shell pattern:
  Browser requests page → Server awaits cart cookie → Shell renders → Page paints
  Delay: network RTT + cart fetch = visible blank white page

WITH the shell pattern:
  Browser requests page → Prerendered shell (header + footer) paints instantly
  Cart cookie read streams in silently below the fold
```

### Implementation

```typescript
// app/layout.tsx

// ✅ Correct: CartBootstrap is INSIDE its own Suspense, BELOW the chrome
async function CartProviderWrapper({ children }) {
  // Only cached reads here — getNavLinks and getStoreConfig are "use cache"
  const [links, storeConfig] = await Promise.all([getNavLinks(), getStoreConfig()])

  return (
    <CartProvider>
      <header>...</header>
      <main>{children}</main>
      <footer>...</footer>
      
      <Suspense>
        <CartBootstrap />   {/* ← reads cookies() here, AFTER chrome */}
      </Suspense>
    </CartProvider>
  )
}
```

### Verification

```bash
# Build-time check (fails build on regression)
bun run build  # includes scripts/check-shell.sh

# Manual check
grep -b -o -m1 '<header' .next/server/app/index.html | cut -d: -f1
grep -b -o -m1 '<div hidden id="S:' .next/server/app/index.html | cut -d: -f1
# Header offset must be LESS THAN the first suspended segment offset
```

### Suspense Boundary Rules

| Component | Boundary Needed? | Why |
|---|---|---|
| `CartBootstrap` | ✅ Yes | Reads `cookies()` |
| `SearchInput` | ✅ Yes | Reads `useSearchParams()` |
| `StoreChatSection` | ✅ Yes | Request-time |
| `NewsletterPopupSection` | ✅ Yes | Request-time |
| `StoreJsonLd` | ✅ Yes | Dynamic data |
| Product listings | ✅ Yes | Reads `searchParams` |
| `getNavLinks()` | ❌ No | Cached (`"use cache"`) |
| `getStoreConfig()` | ❌ No | Cached (`"use cache"`) |

---

## 4. Caching Strategy

### `"use cache"` + `cacheLife()`

The project uses Next.js 16's `"use cache"` directive extensively:

```typescript
// Cache for hours — for slow-changing data (store name, nav links)
async function getNavLinks() {
  "use cache"
  cacheLife("hours")
  const [collections, me] = await Promise.all([...])
  return buildLinks(collections, me)
}

// Cache for minutes — for frequently-changing data (products, pricing)
async function ProductList({ filters }) {
  "use cache"
  cacheLife("minutes")
  const result = await commerce.productBrowse({ ... })
  return <Grid products={result.data} />
}
```

### Cache Lifespan Tiers

| Data Type | Cache Life | Rationale |
|---|---|---|
| Store name, logo, settings | `hours` | Changes rarely |
| Nav links, collections | `hours` | Changes rarely |
| Store config (currency, tax behavior) | `minutes` | Tax behavior changes affect all prices |
| Products, categories | `minutes` | Merchants update frequently |
| Product detail + reviews | `minutes` | |
| Cart | No cache | Request-time (cookie) |
| Metadata generation | `minutes` | SEO needs fresh data |

### `meGetCached()` — The Anchor Cache

`meGetCached()` is the single cached function for all store-level data:

```typescript
// lib/commerce.ts
export const meGetCached = async (token?: string) => {
  "use cache"
  const commerce = Commerce({ token, endpoint })
  return commerce.meGet()
}
```

All store settings, feature flags, and configurations route through this function, which means one cache hit provides all store-level configuration.

---

## 5. Proxy Middleware

`proxy.ts` handles two categories of proxying:

### Category 1: Platform-Owned Routes

Routes that render entirely in the YNS/Medusa platform:

| Route | Proxied To |
|---|---|
| `/checkout/*` | `${publicUrl}/${subdomain}/checkout/*` |
| `/account` | `${publicUrl}/${subdomain}/account` |
| `/account/*` | `${publicUrl}/${subdomain}/account/*` |
| `/api/chat` | `${publicUrl}/${subdomain}/api/chat` |
| `/api/chat/*` | `${publicUrl}/${subdomain}/api/chat/*` |
| `/api/feed/gmc` | Google Merchant Center feed |
| `/api/feed/meta` | Meta/Facebook feed |
| `/api/feed/openai` | OpenAI plugin feed |

### Category 2: Platform Assets

```
/_public/* → Rewrite to platform publicUrl with ?store=<subdomain>
```

These are platform-generated scripts (analytics kit, `kit.js`) served per-store.

### Proxy Headers

```typescript
requestHeaders.set("x-forwarded-host", destinationUrl.host)
requestHeaders.set("x-yns-forwarded-origin", "1")  // Marks this as a trusted proxy
```

**Security note:** The `Origin` header is forwarded verbatim — NOT overwritten. This preserves CSRF protection in the platform backend.

### `/api/auth/[...all]`

A passthrough for the platform's auth components. Client-side sign-out flows (`/api/auth/signout`) call this Next.js route, which forwards to the platform. **This is not application auth** — it's a transport layer for the hosted account system.

---

## 6. Cart Architecture

### State Flow

```
Server (SSR/RSC)                     Client
     │                                  │
     ├── Read cart cookie              CartProvider starts empty
     │   (via CartBootstrap)
     │                                  │
     ▼                                  ▼
CartBootstrap renders → bootstrap(cart, cartId) → CartContext.cart = server cart
     │
     ▼
User clicks "Add to Cart"
     │
     ▼
dispatch({ type: "ADD_ITEM", ... })  ← Instant optimistic UI (cartReducer)
     │
     ▼
addToCart(variantId) server action
     │
     ├── Success: syncCart(serverCart) ← Replace optimistic with authoritative
     └── Failure: reconcile()         ← Re-fetch from server
```

### Cart Context API

```typescript
type CartContextValue = {
  cart: Cart | null           // Current cart state
  items: CartLineItem[]       // Derived from cart.lineItems
  itemCount: number           // Total item count
  subtotal: bigint            // Display subtotal (tax-aware)
  isOpen: boolean             // Sidebar open state
  isMutating: boolean         // Transition in flight
  cartId: string | null       // Persisted cart ID
  openCart: () => void
  closeCart: () => void
  dispatch: (action: CartAction) => void       // Optimistic local mutation
  syncCart: (next: Cart | null) => void        // Authoritative sync
  reconcile: () => Promise<void>              // Refetch on failure
  bootstrap: (next: Cart | null, nextId: string | null) => void
  startMutation: (fn: () => void | Promise<void>) => void
}
```

### Cart Cookie

```typescript
// Cookie name: "yns_cart"
// Format: JSON { id: "cart_01..." }
// Flags: httpOnly, secure, sameSite: "none", partitioned: true, path: "/"
```

### Cart Math

`app/cart/cart-math.ts` provides pure functions for cart calculations:

- `cartReducer(state, action)` — Applies optimistic mutations
- `getCartDisplaySubtotal(cart, taxBehavior)` — Tax-aware subtotal
- `getLineItemUnitPrice(item, taxBehavior)` — Per-item display price

Actions: `ADD_ITEM`, `REMOVE_ITEM`, `SET_QUANTITY`, `SYNC_CART`

---

## 7. React 19 & Compiler

### React Compiler (Auto-Memoization)

```typescript
// next.config.ts
const nextConfig = {
  reactCompiler: true,                          // Enable React Compiler
  experimental: {
    turbopackRustReactCompiler: true,           // Native Turbopack integration
  }
}
```

React Compiler automatically inserts `useMemo`, `useCallback`, and `memo` — developers write plain functions without manual memoization.

### `cacheComponents`

```typescript
cacheComponents: true   // Cache React component output across requests
```

Enables component-level caching in Next.js 16 — RSCs that produce the same props get their rendered output cached.

### `partialPrefetching`

```typescript
partialPrefetching: true  // Every <Link> prefetches the route's shared App Shell
```

On hover, `<Link>` components prefetch only the shared shell (not the page data) for instant navigations.

---

## 8. Data Fetching Patterns

### RSC + commerce-kit (Server)

```typescript
// app/products/page.tsx — data on server, no fetch in browser
async function ProductList({ filters }) {
  "use cache"
  cacheLife("minutes")
  
  const result = await commerce.productBrowse({
    active: true,
    limit: PRODUCTS_PER_PAGE,
    offset,
    ...
  })
  
  return <Grid products={result.data} />
}
```

### Server Actions (Mutations)

```typescript
// app/cart/actions.ts
"use server"

export async function addToCart(variantId: string, quantity = 1) {
  const cartCookie = await getCartCookieJson()
  const [error, cart] = await try_(
    commerce.cartUpsert({ cartId: cartCookie?.id, variantId, quantity })
  )
  if (error) { /* handle */ }
  await setCartCookie({ id: cart.id })
  return { success: true, cart }
}
```

### Client-Side Action Call

```typescript
// Client Component
const handleAddToCart = async () => {
  startMutation(async () => {
    dispatch({ type: "ADD_ITEM", variantId, quantity })  // Optimistic
    const { success, cart } = await addToCart(variantId, quantity)
    if (success && cart) {
      syncCart(cart as Cart)
      trackAddToCart(variant, productName, quantity)
    } else {
      await reconcile()  // Refetch on failure
    }
  })
}
```

---

## 9. Error Handling Architecture

### Route-Level Error Boundaries

```
app/error.tsx          ← Catches errors in any page
app/global-error.tsx   ← Catches errors in the root layout
app/product/[slug]/error.tsx  ← Product-specific error recovery
```

### Not Found Pages

```
app/not-found.tsx                   ← Root 404 page
app/product/[slug]/not-found.tsx    ← Product not found
```

### `safe-try` Pattern

All async API calls are wrapped:
```typescript
const [error, result] = await try_(apiCall())
if (error) {
  console.error("Failed:", error)
  return fallback
}
// result is non-null
```

### Error Recovery in Cart

If a write fails, the cart is reconciled from the server:
```typescript
const { success, cart } = await addToCart(variantId)
if (!success) {
  await reconcile()  // Re-fetch authoritative cart
  toast.error("Could not add item. Please try again.")
}
```

---

## 10. Analytics Architecture

### Platform-Managed (DO NOT MODIFY)

Analytics tracking is managed by the platform via:
1. `instrumentation-client.ts` — Injects platform analytics kit at page load
2. `/_public/kit.js` — Platform-served script, generated per store
3. `lib/track.tsx` — Commerce event queue (publish-only)

### Event Queue Pattern

```typescript
// lib/track.tsx

// Events are queued and dispatched via window.ynsTrackQueue
const publish = (item: QueueItem) => {
  window.ynsTrackQueue = window.ynsTrackQueue || []
  window.ynsTrackQueue.push(item)
  window.dispatchEvent(new Event("yns:track"))
}
```

### Tracked Events

| Event | Trigger | Data |
|---|---|---|
| `ViewContent` | Product page mount | variant id, name, price, currency |
| `AddToCart` | Successful add to cart | variant id, name, price, quantity, currency |
| `ConsentChanged` | Cookie consent update | — |

### Consent Mode

The cookie consent banner integrates with the analytics kit via `ConsentChanged` events. It does NOT add tracker pixels — trackers are configured in the platform dashboard.

---

## 11. Authentication Architecture

### Architecture Decision

> **There is NO auth in this Next.js application.**

Authentication is entirely platform-managed:
- **Checkout:** Inline email-code sign-in inside the proxied `/checkout` 
- **Account:** Platform-rendered account area at proxied `/account`
- **Session reading:** Never done in the app — would break the prerendered shell

### What The App Does

The app only provides a passthrough route:

```typescript
// app/api/auth/[...all]/route.ts
// Forwards /api/auth/* calls from platform components to the platform backend
// (e.g., sign-out button in the account area)
```

### Account Link

```tsx
// app/layout.tsx
// Plain <a> — never <Link> for proxied routes
<a href="/account" className="p-2 hover:bg-secondary">
  <UserRound className="w-5 h-5" />
</a>
```

> **Rule:** `/checkout` and `/account` links MUST be plain `<a>` tags. Using `<Link>` causes a soft RSC navigation into the cross-zone rewrite which 500s.
