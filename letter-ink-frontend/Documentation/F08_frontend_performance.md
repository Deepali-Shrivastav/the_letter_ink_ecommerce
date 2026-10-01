# The Letter Ink — theletterink: Performance & SEO Guide

> **Document:** F08 — Performance & SEO  
> **Next.js Version:** 16.3.4

---

## Table of Contents

1. [Performance Architecture](#1-performance-architecture)
2. [Core Web Vitals Targets](#2-core-web-vitals-targets)
3. [Prerendered Shell Integrity](#3-prerendered-shell-integrity)
4. [Image Optimization](#4-image-optimization)
5. [Font Strategy](#5-font-strategy)
6. [SEO Architecture](#6-seo-architecture)
7. [Structured Data (JSON-LD)](#7-structured-data-json-ld)
8. [Metadata System](#8-metadata-system)
9. [Sitemap & Robots](#9-sitemap--robots)
10. [Analytics](#10-analytics)

---

## 1. Performance Architecture

### Key Performance Features

| Feature | Configuration | Impact |
|---|---|---|
| **Prerendered Shell** | `cacheComponents: true` | Header/footer paint instantly |
| **Streaming RSC** | Suspense boundaries | Page content streams progressively |
| **Partial Prefetching** | `partialPrefetching: true` | Instant soft navigations |
| **React Compiler** | `reactCompiler: true` | Auto-memoization — no manual memo |
| **Package Import Optimization** | `optimizePackageImports: [...]` | Tree-shakes Radix/Lucide |
| **Next.js Image** | `next/image` | WebP/AVIF, lazy load, sizes |
| **Self-hosted fonts** | `next/font/google` | Zero network request, no CLS |
| **Tailwind v4** | Lightning CSS | Minimal CSS bundle |

### Rendering Decision Tree

```
Is the content static across all users?
  └─ Yes → Prerendered shell ("use cache" + cacheLife("hours"))
  
Does it change per merchant but not per user?
  └─ Yes → Cached RSC ("use cache" + cacheLife("minutes"))
  
Does it depend on the request (cookies, headers, searchParams)?
  └─ Yes → Dynamic RSC inside <Suspense> boundary
  
Is it interactive (onClick, useState)?
  └─ Yes → Client Component ("use client")
```

---

## 2. Core Web Vitals Targets

The project targets Lighthouse scores established by real store audits:

| Metric | Target |
|---|---|
| **LCP** (Largest Contentful Paint) | < 2.5s |
| **INP** (Interaction to Next Paint) | < 200ms |
| **CLS** (Cumulative Layout Shift) | < 0.1 |
| **FCP** (First Contentful Paint) | < 1.8s |
| **TTFB** (Time to First Byte) | < 800ms |

### Running Lighthouse

```bash
# Requires a running server
bun run audit http://localhost:3000
bun run audit https://theletterink.com
bun run audit https://theletterink.com --desktop
```

---

## 3. Prerendered Shell Integrity

### What It Checks

After `next build`, `scripts/check-shell.sh` scans every `.html` file in `.next/server/app/` and verifies:

1. **`<header>` exists** — the chrome was rendered
2. **`<header>` byte offset < first `<div hidden id="S:…">` offset** — the header appeared before any streamed content

### Why This Matters

React writes deferred Suspense content into the same HTML file as `<div hidden id="S:…">` segments, revealed by inline `$RC` scripts. If the header is inside a Suspense boundary, it shows up as a hidden segment — meaning the page paints blank until that segment resolves.

### Checking Manually

```bash
# Byte offset of the <header> element
grep -b -o -m1 '<header' .next/server/app/index.html | cut -d: -f1

# Byte offset of the first hidden Suspense segment
grep -b -o -m1 '<div hidden id="S:' .next/server/app/index.html | cut -d: -f1

# ✅ Pass: header_offset < segment_offset (or no segment exists)
# ❌ Fail: header_offset > segment_offset, or header not found
```

### On Live Site

```bash
bash scripts/check-shell.sh https://theletterink.com/
```

---

## 4. Image Optimization

### `next/image` Configuration

```typescript
// next.config.ts
images: {
  remotePatterns: [
    { protocol: "https", hostname: "*.public.blob.vercel-storage.com" },
    { protocol: "https", hostname: "yns.store" },
    { protocol: "https", hostname: "**.yns.store" },
    { protocol: "https", hostname: "yns.cx" },
    { protocol: "https", hostname: "**.yns.cx" },
  ],
}
```

> When integrating with Medusa: add your S3 bucket hostname to `remotePatterns`.

### Image Usage Pattern

```tsx
import Image from "next/image"

// Product images — fill container
<div className="relative aspect-square">
  <Image
    src={imageUrl}
    alt={productName}
    fill
    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
    className="object-cover"
    priority={isFirstImage}  // LCP candidate → eager load
  />
</div>
```

### Image Loading Strategy

| Image | Load Strategy | Why |
|---|---|---|
| Hero image | `priority={true}` | LCP candidate |
| First product card | `priority={true}` | LCP candidate |
| Other product cards | Default (lazy) | Below fold |
| Gallery images | Lazy | Not visible on load |

### Shimmer Placeholder

```css
/* app/globals.css */
.yns-image-shimmer {
  background: linear-gradient(90deg, oklch(0.9 0 0) 0%, oklch(1 0 0) 50%, oklch(0.9 0 0) 100%);
  background-size: 200% 100%;
  animation: yns-image-shimmer 1.2s ease-in-out infinite;
}
```

---

## 5. Font Strategy

```typescript
// app/layout.tsx

// Sans — preloaded, used everywhere
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

// Mono — NOT preloaded, used only in chat and code
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  preload: false,  // Loads on first use, not on every page
})
```

**Benefits:**
- Both fonts served from same origin (no 3rd-party DNS lookup)
- Zero CLS — `next/font` reserves exact space
- Mono font deferred until needed — saves ~20KB on initial load

---

## 6. SEO Architecture

### Title Template

```typescript
// app/layout.tsx
title: {
  default: storeName,              // "The Letter Ink"
  template: `%s — ${storeName}`,  // "Product Name — The Letter Ink"
}
```

### Canonical URLs

Each page sets its own canonical. The root layout intentionally does NOT set a canonical to avoid all pages being declared as duplicates of the homepage:

```typescript
// ✅ Homepage sets its own canonical
export const metadata: Metadata = {
  alternates: { canonical: "/" },
}

// ✅ Product page sets canonical
return {
  alternates: { canonical: product.seo?.canonical || `/product/${product.slug}` },
}

// ✅ Paginated listing
const canonical = pageNum > 1 ? `/products?page=${pageNum}` : "/products"
```

### Robots Directives

```typescript
// Homepage, products, categories
robots: {
  index: true, follow: true,
  googleBot: {
    index: true, follow: true,
    "max-image-preview": "large",
    "max-snippet": -1,
    "max-video-preview": -1,
  },
}

// Missing product pages
robots: { index: false, follow: true }
```

---

## 7. Structured Data (JSON-LD)

`lib/json-ld.tsx` generates structured data for rich search results.

### Product Schema

Injected on every product page:

```json
{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "Classic Tote Bag",
  "description": "...",
  "image": ["https://..."],
  "sku": "TOTE-001",
  "brand": { "@type": "Brand", "name": "The Letter Ink" },
  "offers": {
    "@type": "Offer",
    "price": "29.99",
    "priceCurrency": "USD",
    "availability": "https://schema.org/InStock",
    "url": "https://theletterink.com/product/classic-tote-bag"
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.5",
    "reviewCount": "23"
  }
}
```

### BreadcrumbList Schema

```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://theletterink.com/" },
    { "@type": "ListItem", "position": 2, "name": "Products", "item": "https://theletterink.com/products" },
    { "@type": "ListItem", "position": 3, "name": "Bags", "item": "https://theletterink.com/category/bags" },
    { "@type": "ListItem", "position": 4, "name": "Classic Tote Bag" }
  ]
}
```

### Store Schema

```json
{
  "@context": "https://schema.org",
  "@type": "Store",
  "name": "The Letter Ink",
  "url": "https://theletterink.com",
  "image": "https://...",
  "description": "..."
}
```

### Rendering JSON-LD

```tsx
// lib/json-ld.tsx
export function JsonLdScript({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}
```

---

## 8. Metadata System

### Per-Page Metadata Pattern

```typescript
// generateMetadata (dynamic, cached)
export async function generateMetadata({ params }): Promise<Metadata> {
  "use cache"
  cacheLife("minutes")
  
  const product = await getProduct(params.slug)
  
  return {
    title: product.name,
    description: product.summary,
    alternates: { canonical: `/product/${product.slug}` },
    openGraph: {
      type: "website",
      title: product.name,
      description: product.summary,
      images: [{ url: product.images[0], alt: product.name }],
    },
    twitter: {
      card: "summary_large_image",
      title: product.name,
      images: [product.images[0]],
    },
  }
}
```

### Dynamic OG Images

Product pages generate OG images dynamically:

```typescript
// app/product/[slug]/opengraph-image.tsx
export default async function Image({ params }) {
  const product = await getProduct(params.slug)
  return new ImageResponse(
    <div style={{ display: "flex", ... }}>
      <img src={product.images[0]} />
      <div>{product.name}</div>
    </div>,
    { width: 1200, height: 630, fonts: [{ name: "Geist", data: fontData }] }
  )
}
```

---

## 9. Sitemap & Robots

### Sitemap Coverage

Auto-generated at `/sitemap.xml`:
- All product pages (paginated in batches of 100)
- All collection pages
- All legal pages
- All blog posts (if enabled)
- Static pages (home, products, about, faq, contact)

Includes `images` array for product pages — enables Google Image Search inclusion.

### Robots Configuration

```typescript
// app/robots.ts
export default function robots(): MetadataRoute.Robots {
  const baseUrl = getCanonicalUrl()
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
```

### LLMs.txt

`/llms.txt` provides an AI-readable manifest describing the store for LLM-powered search (Perplexity, ChatGPT Browse, etc.).

---

## 10. Analytics

### Event Contract

All tracking goes through `window.ynsTrackQueue`:

```typescript
// lib/track.tsx

// ViewContent — fired once per product page visit
TrackProductView({ variant, name })

// AddToCart — fired on successful cart add
trackAddToCart(variant, name, quantity)

// ConsentChanged — fired when GDPR consent changes
notifyConsentChanged()
```

### Cookie Consent (GDPR)

The cookie consent banner in `components/cookie-consent-banner.tsx`:
- Loads before any tracking code
- Must remain at the top of `<body>` (required for GTM Consent Mode v2)
- Calls `notifyConsentChanged()` when user accepts/rejects

### No Direct Tracker Calls

The project never calls `fbq()`, `gtag()`, `dataLayer.push()` directly. All trackers are configured in the platform dashboard and injected via `/_public/kit.js`.
