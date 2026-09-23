# The Letter Ink — theletterink: Developer Guide

> **Document:** F10 — Frontend Developer Guide

---

## Table of Contents

1. [Prerequisites](#1-prerequisites)
2. [Local Setup](#2-local-setup)
3. [Code Conventions](#3-code-conventions)
4. [Adding New Pages](#4-adding-new-pages)
5. [Adding New Components](#5-adding-new-components)
6. [Adding New API Integrations](#6-adding-new-api-integrations)
7. [Testing](#7-testing)
8. [Deployment](#8-deployment)
9. [Critical Rules / Gotchas](#9-critical-rules--gotchas)
10. [Troubleshooting](#10-troubleshooting)

---

## 1. Prerequisites

| Requirement | Version |
|---|---|
| **Bun** | `1.x` (install: `curl -fsSL https://bun.sh/install | bash`) |
| **Node.js** | `>=20` (Bun uses its own runtime, but needed for some tools) |
| **Git** | Any recent version |

---

## 2. Local Setup

### Step 1: Install dependencies

```bash
cd theletterink
bun install
```

### Step 2: Configure environment

```bash
cp .env.example .env.local
# Edit .env.local:
# YNS_API_KEY=your_api_key_here
# NEXT_PUBLIC_URL=http://localhost:3000
```

### Step 3: Start dev server

```bash
bun dev
```

App runs at `http://localhost:3000`.

### Step 4: Verify

```bash
# Full quality check (lint + types + tests)
bun run check
```

---

## 3. Code Conventions

### Language

- **No `any` types** — use `unknown` with type narrowing
- **Minimal return type annotations** — rely on TypeScript inference
- **Functional array methods** — `map`, `filter`, `reduce` over loops
- **No loops** — `for`, `while` are avoided in favor of functional style

### Error Handling

Always use `safe-try`:
```typescript
import { try_ } from "safe-try"

const [error, result] = await try_(asyncOperation())
if (error) {
  // handle error
  return null
}
// result is non-null here
```

Never use bare `try/catch` for API calls.

### Price Formatting

Always use `formatMoney` from `lib/money.ts`:
```typescript
import { formatMoney } from "@/lib/money"
import { useStoreConfig } from "@/components/store-config-provider"

const { currency, locale } = useStoreConfig()
const formatted = formatMoney({ amount: price, currency, locale })
```

Never format prices manually.

### Price Display (Tax Behavior)

Always use `displayPrice` from `lib/pricing.ts`:
```typescript
import { displayPrice } from "@/lib/pricing"
import { useStoreConfig } from "@/components/store-config-provider"

const { taxBehavior } = useStoreConfig()
const price = displayPrice(variant, taxBehavior)         // net or gross
const original = displayPrice(variant, taxBehavior, "originalPrice")
```

### Class Names

Always use `cn()` from `lib/utils.ts`:
```typescript
import { cn } from "@/lib/utils"

<div className={cn("base-class", condition && "conditional-class", className)} />
```

### Imports

Use path aliases:
```typescript
import { commerce } from "@/lib/commerce"   // ✅
import { commerce } from "../../lib/commerce" // ❌
```

Configured in `tsconfig.json`:
```json
{ "paths": { "@/*": ["./*"] } }
```

### Naming Conventions

| Element | Convention | Example |
|---|---|---|
| Files | `kebab-case.tsx` | `product-card.tsx` |
| React Components | `PascalCase` | `ProductCard` |
| Hooks | `camelCase` with `use` prefix | `useSelectedVariant` |
| Server Actions | `camelCase` | `addToCart` |
| Constants | `SCREAMING_SNAKE_CASE` | `PRODUCTS_PER_PAGE` |
| Types / Interfaces | `PascalCase` | `CartLineItem` |

---

## 4. Adding New Pages

### Step 1: Create the page file

```typescript
// app/my-page/page.tsx
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "My Page",
  alternates: { canonical: "/my-page" },
}

export default async function MyPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-medium">My Page</h1>
    </div>
  )
}
```

### Step 2: Add to sitemap (if public)

```typescript
// app/sitemap.ts — add to staticRoutes:
{ url: `${baseUrl}/my-page`, lastModified: now, changeFrequency: "monthly", priority: 0.5 }
```

### Step 3: Add to nav (if needed)

```typescript
// app/layout.tsx — getNavLinks():
{ href: "/my-page", label: "My Page" }
```

### Prerendered Shell Rule

If your page needs data, follow this pattern:

```typescript
// ✅ Correct: cached data in page, searchParams in Suspense
export default async function MyPage({ searchParams }) {
  const cachedData = await getCachedData()  // "use cache" function

  return (
    <div>
      <h1>My Page</h1>  {/* Prerendered */}
      <Suspense fallback={<Skeleton />}>
        <DynamicContent searchParams={searchParams} />  {/* Streams in */}
      </Suspense>
    </div>
  )
}
```

---

## 5. Adding New Components

### Pure UI Component

```typescript
// components/ui/my-component.tsx
import { cn } from "@/lib/utils"

interface MyComponentProps {
  className?: string
  children: React.ReactNode
}

export function MyComponent({ className, children }: MyComponentProps) {
  return (
    <div className={cn("base-class", className)}>
      {children}
    </div>
  )
}
```

### Client Component (Interactive)

```typescript
// components/my-interactive.tsx
"use client"

import { useState } from "react"

export function MyInteractive({ initialValue }: { initialValue: string }) {
  const [value, setValue] = useState(initialValue)

  return (
    <button onClick={() => setValue("changed")}>
      {value}
    </button>
  )
}
```

### Adding Shadcn Component

```bash
bunx shadcn add <component-name>
# e.g., bunx shadcn add tabs
# This adds the component to components/ui/
```

---

## 6. Adding New API Integrations

### New Data Fetch (RSC)

```typescript
// lib/my-feature.ts
import { commerce } from "@/lib/commerce"
import { cacheLife } from "next/cache"
import { try_ } from "safe-try"

export async function getMyData() {
  "use cache"
  cacheLife("minutes")
  
  const [error, data] = await try_(commerce.someMethod())
  if (error) return null
  return data
}
```

### New Server Action (Mutation)

```typescript
// app/my-feature/actions.ts
"use server"

import { commerce } from "@/lib/commerce"
import { try_ } from "safe-try"

export async function doSomething(input: string) {
  const [error, result] = await try_(commerce.someAction({ input }))
  if (error) return { success: false as const, error: error.message }
  return { success: true as const, result }
}
```

### Call from Client

```typescript
// components/my-button.tsx
"use client"

import { doSomething } from "@/app/my-feature/actions"
import { toast } from "sonner"

export function MyButton() {
  const handleClick = async () => {
    const { success, error } = await doSomething("value")
    if (success) toast.success("Done!")
    else toast.error(error ?? "Something went wrong")
  }
  
  return <button onClick={handleClick}>Do it</button>
}
```

---

## 7. Testing

### Test Runner

```bash
bun test            # Run all tests
bun test --watch    # Watch mode
bun test lib/       # Test specific directory
```

### Test File Convention

- Extension: `.test.ts` or `.test.tsx`
- Location: Adjacent to the file under test (or in `__tests__/`)

### Writing Tests

```typescript
// lib/money.test.ts
import { describe, it, expect } from "bun:test"
import { formatMoney } from "./money"

describe("formatMoney", () => {
  it("formats USD correctly", () => {
    expect(formatMoney({ amount: 1999, currency: "USD", locale: "en-US" }))
      .toBe("$19.99")
  })
  
  it("handles zero-decimal currencies (JPY)", () => {
    expect(formatMoney({ amount: 500, currency: "JPY", locale: "ja-JP" }))
      .toBe("¥500")
  })
})
```

### Existing Tests

| File | What it tests |
|---|---|
| `app/cart/cart-math.test.ts` | Cart totals, cartReducer, line item math |
| `lib/money.test.ts` | Currency formatting, edge-case currencies |
| `lib/pricing.test.ts` | Tax-aware price selection, priceRange |
| `lib/cookies.test.ts` | Cookie parsing |
| `lib/contrast.test.ts` | WCAG contrast utilities |
| `lib/vts.test.ts` | Variant type selector |
| `app/palette.test.ts` | Color palette utilities |
| `proxy.test.ts` | Proxy URL construction |
| `lib/commerce.test.ts` | Commerce client initialization |

### Full Quality Check

```bash
bun run check
# Runs: biome check + tsc --noEmit + bun test
# All must pass before committing
```

---

## 8. Deployment

### Vercel (Recommended)

```bash
# Deploy to production
bun run publish:store
# This runs scripts/publish.sh
```

### Manual Build Verification

```bash
# 1. Build
bun run build

# 2. This automatically runs:
#    - next build
#    - scripts/check-shell.sh (verifies prerendered shell integrity)

# 3. Start production server
bun start
```

### Build Flags

| Env Variable | Values | Effect |
|---|---|---|
| `YNS_SHELL_CHECK` | `warn` | Print shell failures, exit 0 (don't block deploy) |
| `YNS_SHELL_CHECK` | `off` | Skip shell check entirely |
| `NODE_ENV` | `production` | Enables security headers, disables dev helpers |

### Performance Audit

```bash
# After deploying or with a running server:
bun run audit http://localhost:3000
bun run audit https://theletterink.com --desktop
```

Runs Lighthouse for Performance + Accessibility.

---

## 9. Critical Rules / Gotchas

### 🚨 NEVER use `<Link>` for `/checkout` or `/account`

```tsx
// ❌ WRONG — soft navigation into a proxied zone causes 500
<Link href="/checkout">Checkout</Link>

// ✅ CORRECT — hard navigation respects the proxy rewrite
<a href="/checkout">Checkout</a>
```

### 🚨 NEVER add tracker snippets to template code

```tsx
// ❌ WRONG — never add fbq, gtag, GTM, pixels here
<script>fbq('track', 'AddToCart', ...)</script>

// ✅ CORRECT — use the track() contract from lib/track.tsx
import { trackAddToCart } from "@/lib/track"
trackAddToCart(variant, productName, quantity)
```

### 🚨 NEVER await request-time data above the chrome

```tsx
// ❌ WRONG — pulls the header out of the prerendered shell
async function Layout({ children }) {
  const cart = await getCart()  // cookies() call = request-time
  return (
    <header>...</header>         // No longer in prerendered shell!
    ...
  )
}

// ✅ CORRECT — cart reads inside Suspense below the chrome
async function Layout({ children }) {
  return (
    <>
      <header>...</header>       // In prerendered shell ✅
      <Suspense>
        <CartBootstrap />        // Reads cookies() here, after header
      </Suspense>
    </>
  )
}
```

### 🚨 DO NOT MODIFY platform-managed files

These files are restored by platform releases:
- `instrumentation-client.ts`
- `lib/track.tsx`
- `proxy.ts`

### DO NOT add `/login` or `/signup` pages

(Unless migrating to Medusa auth — see F09 Integration Guide)

---

## 10. Troubleshooting

### `YNS_API_KEY` missing error at startup

```
Missing YNS_API_KEY environment variable
```

**Fix:** Create `.env.local` with `YNS_API_KEY=your_key_here`

### Build fails: "shell check failed"

```
Shell check failed: header not found before first suspended segment
```

**Fix:** A component in the layout is now awaiting request-time data above the chrome. Use `bun run build` locally to identify which component. Wrap it in `<Suspense>` below the header.

### Products not loading in dev

**Check:**
1. Is `YNS_API_KEY` correct?
2. Is the Medusa backend running (if using custom backend)?
3. Check network tab for API errors

### TypeScript errors after adding a new feature

```bash
bun tsc --noEmit  # Run type check
```

Common issues:
- Missing `"use client"` on a component using hooks
- Missing `"use server"` on a Server Action
- Async component missing `async` keyword

### Cart shows wrong subtotal

The cart subtotal uses `getCartDisplaySubtotal()` from `lib/pricing.ts`. Verify:
- `taxBehavior` in `StoreConfigProvider` is correct (`"inclusive"` or `"exclusive"`)
- `cart.subtotalGross` / `cart.subtotalNet` are populated from the backend

### Page renders blank in production

Run the shell check manually:
```bash
grep -b -o -m1 '<header' .next/server/app/index.html | cut -d: -f1
grep -b -o -m1 '<div hidden id="S:' .next/server/app/index.html | cut -d: -f1
```
Header byte offset must be LESS than the first suspended segment offset.
