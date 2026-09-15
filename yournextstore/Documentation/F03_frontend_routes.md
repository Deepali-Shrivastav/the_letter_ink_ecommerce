# The Letter Ink — yournextstore: Page Routes Reference

> **Document:** F03 — Page Routes Reference

---

## Table of Contents

1. [Route Map](#1-route-map)
2. [Homepage — `/`](#2-homepage--)
3. [Products Listing — `/products`](#3-products-listing--products)
4. [Product Detail — `/product/[slug]`](#4-product-detail--productslug)
5. [Category — `/category/[slug]`](#5-category--categoryslug)
6. [Collection — `/collection/[slug]`](#6-collection--collectionslug)
7. [Search — `/search`](#7-search--search)
8. [Blog — `/blog`](#8-blog--blog)
9. [Blog Post — `/blog/[slug]`](#9-blog-post--blogslug)
10. [Order Success — `/order/success`](#10-order-success--ordersuccess)
11. [About — `/about`](#11-about--about)
12. [FAQ — `/faq`](#12-faq--faq)
13. [Contact — `/contact`](#13-contact--contact)
14. [Newsletter — `/newsletter`](#14-newsletter--newsletter)
15. [Legal — `/legal/[slug]`](#15-legal--legalslug)
16. [Generated Routes — Robots, Sitemap, Manifest](#16-generated-routes--robots-sitemap-manifest)
17. [API Routes](#17-api-routes)
18. [Proxied Routes](#18-proxied-routes)

---

## 1. Route Map

```
/                          Homepage
/products                  All products (filter + sort + paginate)
/product/[slug]            Product detail page
/category/[slug]           Category listing
/collection/[slug]         Collection listing
/search                    Full-text search results
/blog                      Blog listing (feature-flagged)
/blog/[slug]               Blog post detail
/order/success             Post-checkout confirmation
/about                     About page
/faq                       FAQ page
/contact                   Contact form (feature-flagged)
/newsletter                Newsletter signup page
/legal/[slug]              Legal pages (privacy, terms, cookies, etc.)
/checkout/*                Proxied → Platform (not a Next.js page)
/account/*                 Proxied → Platform (not a Next.js page)
/api/auth/[...all]         Auth passthrough API route
/api/feed/gmc              Google Merchant Center feed (proxied)
/api/feed/meta             Meta/Facebook feed (proxied)
/api/chat/*                AI chat API (proxied)
/_public/*                 Platform assets (proxied)
/robots.txt                Auto-generated
/sitemap.xml               Auto-generated
/manifest.webmanifest      Auto-generated
/llms.txt                  AI crawler manifest
```

---

## 2. Homepage — `/`

**File:** `app/page.tsx`  
**Rendering:** RSC + Suspense streaming  
**Metadata:** Static canonical `"/"`

### Page Sections (in order)

| Section | Component | Data Source |
|---|---|---|
| Hero | `Hero` | Hardcoded / store settings |
| Featured Products | `ProductGrid` | `commerce.productBrowse({ limit: 6 })` |
| About | `About` | Hardcoded / store settings |
| Newsletter | `Newsletter` | Hardcoded |

### ProductGrid on Homepage

```typescript
<Suspense fallback={<FeaturedProductsSkeleton />}>
  <ProductGrid title="Featured Products" limit={6} />
</Suspense>
```

`ProductGrid` fetches products using `commerce.productBrowse()` with `featured: true` or defaults. The Suspense boundary ensures the hero section renders without waiting for products.

---

## 3. Products Listing — `/products`

**File:** `app/products/page.tsx`  
**Rendering:** Static shell + Suspense streaming  
**Metadata:** Dynamic — page number in title

### URL Query Parameters

| Parameter | Type | Description |
|---|---|---|
| `page` | `integer` | Page number (default: 1) |
| `sort` | `string` | Sort option: `newest`, `price-asc`, `price-desc`, `name` |
| `category` | `string` | Filter by category slug |
| `collection` | `string` | Filter by collection slug |
| `brand` | `string` | Filter by brand |
| `priceMin` | `number` | Minimum price filter |
| `priceMax` | `number` | Maximum price filter |
| `vts` | `string` | Variant type selector (e.g., `color:red`) |

### Sort Options

| Value | Label | orderBy | orderDirection |
|---|---|---|---|
| `newest` (default) | Newest | `createdAt` | `desc` |
| `price-asc` | Price: Low to High | `price` | `asc` |
| `price-desc` | Price: High to Low | `price` | `desc` |
| `name` | Name: A–Z | `name` | `asc` |

### Page Structure

```
/products
├── <h1> "All Products"            ← Prerendered (no Suspense)
└── <Suspense fallback={skeleton}>
    ├── ProductFilters (sidebar)   ← Desktop
    ├── ProductFiltersMobile       ← Mobile (Sheet)
    ├── SortLinks / SortSelect
    └── ProductList                ← "use cache" keyed on filters
        ├── ProductCard × N
        └── ListingPagination
```

### Items Per Page

`PRODUCTS_PER_PAGE = 12` (hardcoded constant)

### Metadata

```typescript
// Canonical: /products (page 1), /products?page=N (page N)
// Title: "All Products" or "All Products — Page N"
```

---

## 4. Product Detail — `/product/[slug]`

**File:** `app/product/[slug]/page.tsx`  
**Rendering:** RSC + Suspense (gallery + purchase panel stream separately)  
**Metadata:** Dynamic per-product SEO data

### URL Pattern

```
/product/<product-slug>
```

Query parameters (client-managed):
- `?variant=<variant_id>` — selected variant (synced to URL)

### Page Structure

```
/product/[slug]
├── <JsonLdScript> (Product + BreadcrumbList)
├── <TrackProductView>             ← Fires ViewContent analytics
├── <Breadcrumb> (Home > Products > Category > Product Name)
├── <Suspense> [gallery skeleton]
│   └── <MediaGallery>            ← Reads useSearchParams for selected variant
├── Product Info column
│   ├── <h1> product name
│   ├── Review summary (rating + count)
│   └── Bundle or Standard purchase panel:
│       ├── If bundle: <BundleBuilder>
│       └── Else: <Suspense> <AddToCartButton>
│           ├── <VariantSelector>
│           ├── <VolumePricing>
│           ├── <QuantitySelector>
│           └── <RestockNotify> (if out of stock)
├── Product content (Tiptap rich text)
├── <ProductReviews> (if reviews enabled)
├── <ProductFeatures>
└── <RelatedProducts>
```

### Sub-Components

| Component | Description |
|---|---|
| `MediaGallery` | Image/video gallery with thumbnail strip + zoom |
| `VariantSelector` | Option buttons (Color, Size, etc.) |
| `AddToCartButton` | ATC with quantity, price display, sold-out state |
| `BundleBuilder` | Group-based bundle product configuration |
| `VolumePricing` | Quantity tier price table |
| `QuantitySelector` | Increment/decrement |
| `ProductReviews` | Star ratings + review list |
| `ReviewForm` | Submit a review (Server Action) |
| `RelatedProducts` | Same category suggestions |
| `RestockNotify` | Email notification for OOS items |
| `ProductFeatures` | Trust/shipping badges |

### Metadata Generation

```typescript
export async function generateMetadata({ params }): Promise<Metadata> {
  "use cache"
  cacheLife("minutes")
  const product = await safeProductGet(slug)
  return {
    title: product.seo?.title || product.name,
    description: product.seo?.description || product.summary,
    alternates: { canonical: product.seo?.canonical || `/product/${product.slug}` },
    openGraph: { images: [{ url: product.images[0], alt: product.name }] },
    twitter: { card: "summary_large_image" },
  }
}
```

### Dynamic OG Image

`app/product/[slug]/opengraph-image.tsx` — generates a `og:image` using Next.js Image Response with the Geist font.

---

## 5. Category — `/category/[slug]`

**File:** `app/category/[slug]/page.tsx`  
**Data:** `commerce.productBrowse({ category: slug })`

Same layout as `/products` — filters + sort + grid + pagination. Scoped to the category.

---

## 6. Collection — `/collection/[slug]`

**File:** `app/collection/[slug]/page.tsx`  
**Data:** `commerce.productBrowse({ collection: slug })`

Same layout as `/products` — scoped to the collection.

---

## 7. Search — `/search`

**File:** `app/search/page.tsx`  
**Rendering:** RSC + Suspense

### URL Parameters

| Parameter | Description |
|---|---|
| `q` | Search query |
| `sort` | Sort option |
| `page` | Page number |

### Page Structure

```
/search
├── <h1> "Search"
├── <Suspense>
│   ├── <SearchControls>   ← Search input + sort
│   ├── Product results grid
│   └── <SearchPagination>
```

The search input in the header (`components/search/search-input.tsx`) navigates to `/search?q=<query>` on submit.

---

## 8. Blog — `/blog`

**File:** `app/blog/page.tsx`  
**Feature-Flagged:** Only visible when `me.store.settings.enabledTools.blog === true`  
**Data:** `commerce.postBrowse({ active: true })`

---

## 9. Blog Post — `/blog/[slug]`

**File:** `app/blog/[slug]/page.tsx`  
**Data:** `commerce.postGet({ idOrSlug: slug })`

Renders blog post content via `TiptapRenderer` with `BlogProductEmbed` for inline product cards.

---

## 10. Order Success — `/order/success`

**File:** `app/order/success/page.tsx`

Post-checkout confirmation page. Typically reached after completing the proxied `/checkout` flow. Displays order confirmation and clears cart cookie.

---

## 11. About — `/about`

**File:** `app/about/page.tsx`  
**Rendering:** Static  
**Data:** Store-configured "About" content

---

## 12. FAQ — `/faq`

**File:** `app/faq/page.tsx`  
**Rendering:** Static / cached  
**Data:** `commerce.faqBrowse()`  
**Component:** Accordion

---

## 13. Contact — `/contact`

**File:** `app/contact/page.tsx`  
**Feature-Flagged:** `me.store.settings.enabledTools.contactForm === true`  
**Form:** Server Action submission via `commerce.contactFormSubmit()`

---

## 14. Newsletter — `/newsletter`

**File:** `app/newsletter/page.tsx`  
**Purpose:** Dedicated newsletter signup page (vs. the inline section on homepage)

---

## 15. Legal — `/legal/[slug]`

**File:** `app/legal/[slug]/page.tsx`  
**Data:** `commerce.legalPageGet({ slug })`

Legal pages include privacy policy, terms of service, return policy, cookie policy, etc. Content rendered via TiptapRenderer.

---

## 16. Generated Routes — Robots, Sitemap, Manifest

### `robots.txt` — `app/robots.ts`

```typescript
// Allows all bots by default, disallows admin paths
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${getCanonicalUrl()}/sitemap.xml`,
  }
}
```

### `sitemap.xml` — `app/sitemap.ts`

Automatically generates XML sitemap with:

| Route Type | Priority | Change Frequency |
|---|---|---|
| Homepage `/` | 1.0 | Daily |
| `/products` | 0.9 | Daily |
| `/product/[slug]` | 0.8 | Weekly |
| `/collection/[slug]` | 0.7 | Weekly |
| `/blog` | 0.6 | Weekly |
| `/about`, `/faq`, `/contact` | 0.5 | Monthly |
| `/blog/[slug]` | 0.5 | Monthly |
| `/legal/*` | 0.3 | Yearly |

Supports image sitemaps for product pages.

### `manifest.webmanifest`

Auto-generated PWA manifest using store name, icons, and theme color from store settings.

### `llms.txt`

LLM crawler manifest at `/llms.txt` describing the store for AI-powered search engines.

---

## 17. API Routes

| Route | Method | Description |
|---|---|---|
| `/api/auth/[...all]` | ALL | Passthrough to platform auth API |

---

## 18. Proxied Routes

These are NOT Next.js pages — they are rewrites to the platform backend via `proxy.ts`:

| Route Pattern | Destination | Notes |
|---|---|---|
| `/checkout/*` | `${publicUrl}/${subdomain}/checkout/*` | Full checkout experience |
| `/account` | `${publicUrl}/${subdomain}/account` | Shopper account dashboard |
| `/account/*` | `${publicUrl}/${subdomain}/account/*` | Account sub-pages |
| `/api/chat` | Platform AI chat endpoint | |
| `/api/chat/*` | Platform AI chat | |
| `/api/feed/gmc` | Google Merchant Center feed | Product feed for Google Shopping |
| `/api/feed/meta` | Meta/Facebook product feed | |
| `/api/feed/openai` | OpenAI plugin feed | |
| `/_public/*` | Platform CDN assets | per-store analytics kit |

> **Critical:** All links to `/checkout` and `/account` must use plain `<a>` HTML tags. Using Next.js `<Link>` causes a 500 error due to cross-zone navigation.
