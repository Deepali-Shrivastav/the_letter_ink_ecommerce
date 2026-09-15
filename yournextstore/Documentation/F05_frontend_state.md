# The Letter Ink — yournextstore: State Management

> **Document:** F05 — State Management

---

## Table of Contents

1. [State Architecture Overview](#1-state-architecture-overview)
2. [CartContext — Cart State](#2-cartcontext--cart-state)
3. [Cart Reducer (Pure State)](#3-cart-reducer-pure-state)
4. [StoreConfigProvider — Store Settings](#4-storeconfigprovider--store-settings)
5. [Optimistic Mutations Pattern](#5-optimistic-mutations-pattern)
6. [Cart Cookie Persistence](#6-cart-cookie-persistence)
7. [Server Actions as State Mutations](#7-server-actions-as-state-mutations)
8. [URL-Based State (Search, Filters, Variant)](#8-url-based-state-search-filters-variant)

---

## 1. State Architecture Overview

```
Global State (React Context)
├── CartProvider          ← Cart items, count, subtotal, sidebar open/close
└── StoreConfigProvider   ← currency, locale, taxBehavior (read-only)

URL State (searchParams)
├── /products?page=2&sort=price-asc&category=bags
├── /search?q=notebook&page=1
└── /product/[slug]?variant=var_01...

Cookie State (Server-managed)
└── yns_cart = { id: "cart_01..." }

No React Query / SWR / Zustand — plain Context + useReducer + Server Actions
```

There is deliberately **no client-side data fetching** library. All reads happen in RSCs (server), mutations go through Server Actions.

---

## 2. CartContext — Cart State

### Provider Setup

```typescript
// app/layout.tsx
<CartProvider>
  <header>...</header>
  <main>{children}</main>
  <CartSidebar />
  <Suspense>
    <CartBootstrap cart={serverCart} cartId={serverCartId} />
  </Suspense>
</CartProvider>
```

### Context Value

```typescript
type CartContextValue = {
  // State
  cart: Cart | null          // Full cart object from server
  items: CartLineItem[]      // Derived: cart.lineItems
  itemCount: number          // Derived: sum of item quantities
  subtotal: bigint           // Derived: display-currency subtotal
  isOpen: boolean            // Cart sidebar open/close
  isMutating: boolean        // Transition in flight (useTransition)
  cartId: string | null      // Persisted cart ID

  // Actions
  openCart: () => void
  closeCart: () => void
  dispatch: (action: CartAction) => void        // Optimistic local update
  syncCart: (next: Cart | null) => void         // Authoritative server sync
  reconcile: () => Promise<void>               // Re-fetch on failure
  bootstrap: (next: Cart | null, nextId: string | null) => void
  startMutation: (fn: () => void | Promise<void>) => void
}
```

### Using the Cart

```typescript
import { useCart } from "@/app/cart/cart-context"

function MyComponent() {
  const {
    cart,
    items,
    itemCount,
    subtotal,
    isOpen,
    isMutating,
    openCart,
    closeCart,
    dispatch,
    syncCart,
    reconcile,
    startMutation,
  } = useCart()
}
```

### Cart State Flow

```
1. Page loads → CartProvider starts with cart = null
2. CartBootstrap streams in (after header/footer) → calls bootstrap(serverCart, cartId)
3. bootstrap() sets cart if no mutation has happened (written.current === false)
4. User adds item → dispatch({ type: "ADD_ITEM", ... }) → instant UI update
5. addToCart() Server Action resolves → syncCart(serverCart) → UI updated with authoritative data
6. On failure → reconcile() → re-fetches from server → UI corrected
7. bfcache restore → reconcile() on "pageshow" → cart refreshed
```

---

## 3. Cart Reducer (Pure State)

`app/cart/cart-math.ts` — all pure functions, unit tested.

### CartAction Types

```typescript
type CartAction =
  | { type: "ADD_ITEM"; variantId: string; quantity: number; variant: LineItemBase }
  | { type: "REMOVE_ITEM"; variantId: string }
  | { type: "SET_QUANTITY"; variantId: string; quantity: number }
  | { type: "SYNC_CART"; cart: Cart }
```

### cartReducer

```typescript
function cartReducer(state: Cart | null, action: CartAction): Cart | null {
  switch (action.type) {
    case "ADD_ITEM":
      // Adds to existing line item or creates new
      // Clears subtotal fields (now stale until server syncs)
      return addLineItem(state, action)
      
    case "REMOVE_ITEM":
      return removeLineItem(state, action.variantId)
      
    case "SET_QUANTITY":
      if (action.quantity <= 0) return removeLineItem(state, action.variantId)
      return setLineItemQuantity(state, action.variantId, action.quantity)
      
    case "SYNC_CART":
      return action.cart
  }
}
```

### Cart Math Functions

```typescript
// Tax-behavior-aware display subtotal
function getCartDisplaySubtotal(cart: Cart | null, taxBehavior: TaxBehavior): bigint

// Unit price of a line item
function getLineItemUnitPrice(item: CartLineItem, taxBehavior: TaxBehavior): bigint
```

---

## 4. StoreConfigProvider — Store Settings

Provides store-level configuration to client components via React Context.

### Provider

```typescript
// components/store-config-provider.tsx
"use client"

type StoreConfig = {
  currency: string      // e.g., "USD" or "INR"
  locale: string        // e.g., "en-US" or "en-IN"
  taxBehavior: TaxBehavior  // "inclusive" | "exclusive"
}

const StoreConfigContext = createContext<StoreConfig | null>(null)

export function StoreConfigProvider({
  children,
  value,
}: {
  children: ReactNode
  value: StoreConfig
}) {
  return <StoreConfigContext.Provider value={value}>{children}</StoreConfigContext.Provider>
}

export function useStoreConfig() {
  const ctx = useContext(StoreConfigContext)
  if (!ctx) throw new Error("useStoreConfig must be used within StoreConfigProvider")
  return ctx
}
```

### Usage in Price Display

```typescript
// In any client component
const { currency, locale, taxBehavior } = useStoreConfig()

const price = displayPrice(variant, taxBehavior)
const formatted = formatMoney({ amount: price, currency, locale })
```

### Data Source

```typescript
// app/layout.tsx
const storeConfig = await getStoreConfig()  // "use cache" + cacheLife("minutes")

<StoreConfigProvider value={storeConfig}>
  {children}
</StoreConfigProvider>
```

---

## 5. Optimistic Mutations Pattern

The add-to-cart flow uses an optimistic update pattern:

```typescript
// app/product/[slug]/add-to-cart-button.tsx (conceptual)
"use client"

import { useCart } from "@/app/cart/cart-context"
import { addToCart } from "@/app/cart/actions"

export function AddToCartButton({ variant, productName }) {
  const { dispatch, syncCart, reconcile, startMutation, openCart } = useCart()

  const handleAddToCart = () => {
    startMutation(async () => {
      // Step 1: Optimistic update — instant UI feedback
      dispatch({
        type: "ADD_ITEM",
        variantId: variant.id,
        quantity: selectedQuantity,
        variant: {
          id: variant.id,
          name: variant.name,
          price: variant.price,
          images: variant.images,
          attributes: variant.attributes,
        },
      })

      openCart()

      // Step 2: Server action (async)
      const { success, cart } = await addToCart(variant.id, selectedQuantity)

      if (success && cart) {
        // Step 3a: Sync with authoritative server state
        syncCart(cart as Cart)
        trackAddToCart(variant, productName, selectedQuantity)
      } else {
        // Step 3b: Reconcile on failure
        await reconcile()
        toast.error("Could not add item to cart")
      }
    })
  }
}
```

### Why Not `useOptimistic`?

The project uses plain `useState` + `dispatch` instead of React 19's `useOptimistic` because:
- `useOptimistic` rebases the optimistic state on top of the synced state
- This can double-apply a local mutation if it races with the streamed-in cart from `CartBootstrap`
- Plain state + `written` ref prevents this race condition

---

## 6. Cart Cookie Persistence

```typescript
// lib/cookies.ts

export const CART_COOKIE = "yns_cart"
export type CartCookieJson = { id: string }

// Cookie flags for cross-origin checkout compatibility
export async function setCartCookie(cartCookieJson: CartCookieJson) {
  (await cookies()).set(CART_COOKIE, JSON.stringify(cartCookieJson), {
    httpOnly: true,     // Not accessible via JS
    secure: true,       // HTTPS only
    sameSite: "none",   // Needed for cross-origin checkout proxy
    partitioned: true,  // CHIPS — partitioned 3rd-party cookies
    path: "/",
  })
}
```

**`sameSite: "none"` + `partitioned: true`** — required because the checkout page runs on a different origin (proxied), and the cart cookie needs to be readable cross-site.

### Cart Bootstrap Flow

```typescript
// app/layout.tsx
async function CartBootstrapper() {
  const { cart, cartId } = await getInitialCart()  // reads cookies()
  return <CartBootstrap cart={cart} cartId={cartId} />
}

// app/cart/cart-context.tsx
export function CartBootstrap({ cart, cartId }) {
  const { bootstrap } = useCart()
  useEffect(() => {
    bootstrap(cart, cartId)  // Only sets if no mutation happened yet
  }, [bootstrap, cart, cartId])
  return null
}
```

---

## 7. Server Actions as State Mutations

All state mutations go through Server Actions (never client-side fetch):

| Action | File | What it does |
|---|---|---|
| `getCart()` | `app/cart/actions.ts` | Fetch current cart |
| `addToCart(variantId, qty)` | `app/cart/actions.ts` | Add/increment line item |
| `removeFromCart(variantId)` | `app/cart/actions.ts` | Remove line item |
| `setCartQuantity(variantId, qty)` | `app/cart/actions.ts` | Set absolute quantity |
| `addBundleToCart(bundleId, selections)` | `app/cart/actions.ts` | Add bundle |
| `submitReview(data)` | `app/product/[slug]/review-action.ts` | Post review |
| `subscribeRestock(email, variantId)` | `app/product/[slug]/restock-action.ts` | Restock alert |

### Action Pattern

```typescript
"use server"

export async function myAction(input: InputType): Promise<ActionResult> {
  // 1. Validate input
  if (!input.id) return { success: false, error: "Missing ID" }
  
  // 2. Call API with safe-try
  const [error, result] = await try_(commerce.someMethod(input))
  if (error) return { success: false, error: error.message }
  
  // 3. Side effects (e.g., set cookie)
  if (result.id !== input.cartId) {
    await setCartCookie({ id: result.id })
  }
  
  // 4. Return typed result
  return { success: true, result }
}
```

---

## 8. URL-Based State (Search, Filters, Variant)

Some state lives in the URL — this makes pages shareable and back/forward navigable.

### Product Filters & Sort

```
/products?page=2&sort=price-asc&category=bags&priceMin=10&priceMax=100
```

These `searchParams` are passed to the `ProductList` RSC (not client state). Changing filters triggers a server navigation.

### Search Query

```
/search?q=notebook&sort=newest&page=1
```

### Selected Variant

```
/product/classic-tote-bag?variant=var_01abc123
```

Managed by `app/product/[slug]/use-selected-variant.ts`:

```typescript
// lib/vts.ts — reads searchParams for selected variant
export function useSelectedVariant(variants: Variant[]) {
  const searchParams = useSearchParams()
  const variantId = searchParams.get("variant")
  
  return variants.find(v => v.id === variantId) ?? variants[0]
}
```

Selecting a variant updates the URL — allowing sharing a link to a specific variant.
