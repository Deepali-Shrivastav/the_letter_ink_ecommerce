# The Letter Ink — yournextstore: Project Overview

> **Document:** F01 — Frontend Project Overview  
> **Next.js Version:** 16.3.4 | **React:** 19.2.8

---

## Table of Contents

1. [System Identity](#1-system-identity)
2. [Technology Stack](#2-technology-stack)
3. [Project Structure](#3-project-structure)
4. [Environment Variables](#4-environment-variables)
5. [Scripts Reference](#5-scripts-reference)
6. [Package Dependencies](#6-package-dependencies)

---

## 1. System Identity

| Property | Value |
|---|---|
| **Project Name** | yournextstore (The Letter Ink Storefront) |
| **Framework** | Next.js 16.3.4 (App Router) |
| **Language** | TypeScript 7.x |
| **Runtime** | Bun 1.x |
| **Package Manager** | Bun (bun.lock present) |
| **Linter / Formatter** | Biome 2.5.12 |
| **Test Runner** | Bun test |
| **Styling** | Tailwind CSS v4 + Radix UI |
| **Commerce SDK** | commerce-kit 0.61.0 |
| **Deployment Target** | Vercel (with platform proxy) |

---

## 2. Technology Stack

### Core Framework

| Package | Version | Purpose |
|---|---|---|
| `next` | 16.3.4 | App Router, RSC, Server Actions, image optimization |
| `react` | 19.2.8 | UI library (React 19 with Compiler) |
| `react-dom` | 19.2.8 | DOM rendering |
| `typescript` | ^7.0.2 | Static typing |

### Commerce

| Package | Version | Purpose |
|---|---|---|
| `commerce-kit` | 0.61.0 | Store API client (wraps YNS/Medusa API) |

### UI Components

| Package | Version | Purpose |
|---|---|---|
| `@radix-ui/react-accordion` | 1.2.20 | Accessible accordion |
| `@radix-ui/react-checkbox` | 1.3.11 | Accessible checkbox |
| `@radix-ui/react-dialog` | 1.1.23 | Modal dialogs |
| `@radix-ui/react-dropdown-menu` | 2.1.24 | Dropdown menus |
| `@radix-ui/react-label` | 2.1.15 | Form labels |
| `@radix-ui/react-popover` | 1.1.23 | Popovers |
| `@radix-ui/react-scroll-area` | 1.2.18 | Scrollable containers |
| `@radix-ui/react-select` | 2.3.7 | Select dropdowns |
| `@radix-ui/react-slider` | 1.4.7 | Range sliders (price filter) |
| `@radix-ui/react-slot` | 1.3.3 | Render delegation |
| `@radix-ui/react-tooltip` | 1.2.16 | Tooltips |
| `lucide-react` | 1.42.0 | Icon library |
| `class-variance-authority` | 0.7.1 | Component variant API |
| `clsx` + `tailwind-merge` | 2.1.1 / 3.6.0 | Class merging utilities |
| `sonner` | 2.0.8 | Toast notifications |
| `next-themes` | 0.4.6 | Dark/light mode |

### Rich Text / Content

| Package | Version | Purpose |
|---|---|---|
| `@tiptap/starter-kit` | 3.31.3 | Rich text rendering |
| `@tiptap/extension-image` | 3.31.3 | Image extension |
| `@tiptap/extension-text-align` | 3.31.3 | Text alignment |
| `@tiptap/extension-text-style` | 3.31.3 | Text styling |
| `@tiptap/extension-youtube` | 3.31.3 | YouTube embed |
| `@tiptap/static-renderer` | 3.31.3 | Server-side render of rich text |
| `streamdown` | 2.6.0 | Streaming markdown renderer (AI chat) |

### AI

| Package | Version | Purpose |
|---|---|---|
| `ai` | 7.0.93 | Vercel AI SDK core |
| `@ai-sdk/react` | 4.0.96 | React hooks for AI (useChat) |

### Dev Tools

| Package | Version | Purpose |
|---|---|---|
| `@biomejs/biome` | 2.5.12 | Linting + formatting |
| `@tailwindcss/postcss` | 4.3.3 | PostCSS plugin for Tailwind |
| `@tailwindcss/typography` | ^0.5.20 | Prose typography plugin |
| `tw-animate-css` | 1.4.0 | CSS animations for Tailwind |
| `husky` | 9.1.7 | Git hooks |
| `lint-staged` | 17.5.0 | Pre-commit lint |
| `babel-plugin-react-compiler` | 1.0.0 | React Compiler (auto-memoization) |

### Utilities

| Package | Version | Purpose |
|---|---|---|
| `safe-try` | 0.0.4 | Railway-oriented error handling |

---

## 3. Project Structure

```
yournextstore/
│
├── app/                          ← Next.js App Router root
│   ├── layout.tsx                ← Root layout: header, footer, providers
│   ├── page.tsx                  ← Homepage
│   ├── globals.css               ← Global CSS + Tailwind tokens
│   ├── footer.tsx                ← Footer component
│   ├── navbar.tsx                ← Navigation bar
│   ├── cart-button.tsx           ← Cart button (header)
│   ├── error.tsx                 ← Route error boundary
│   ├── not-found.tsx             ← 404 page
│   ├── global-error.tsx          ← Global error boundary
│   ├── robots.ts                 ← robots.txt generation
│   ├── sitemap.ts                ← XML sitemap generation
│   ├── search-suggest.ts         ← Search suggestion server action
│   │
│   ├── cart/                     ← Cart module (NO page — sidebar only)
│   │   ├── actions.ts            ← Server Actions: addToCart, removeFromCart, setCartQuantity
│   │   ├── cart-context.tsx      ← CartProvider + useCart hook
│   │   ├── cart-item.tsx         ← Individual cart line item
│   │   ├── cart-math.ts          ← Cart totals calculation (pure)
│   │   ├── cart-math.test.ts     ← Unit tests for cart math
│   │   └── cart-sidebar.tsx      ← Slide-out cart drawer
│   │
│   ├── product/
│   │   └── [slug]/               ← Product detail page
│   │       ├── page.tsx          ← Main product page
│   │       ├── add-to-cart-button.tsx  ← ATC with variant selector
│   │       ├── bundle-builder.tsx      ← Bundle product UI
│   │       ├── media-gallery.tsx       ← Image/video gallery
│   │       ├── variant-selector.tsx    ← Variant option picker
│   │       ├── quantity-selector.tsx   ← Quantity increment
│   │       ├── volume-pricing.tsx      ← Volume tier display
│   │       ├── product-reviews.tsx     ← Reviews section
│   │       ├── review-form.tsx         ← Review submission form
│   │       ├── review-action.ts        ← Server Action: submit review
│   │       ├── product-features.tsx    ← Feature badges
│   │       ├── related-products.tsx    ← Related products section
│   │       ├── restock-notify.tsx      ← Out-of-stock notification
│   │       ├── restock-action.ts       ← Server Action: restock alert
│   │       ├── trust-badges.tsx        ← Trust icons
│   │       ├── use-selected-variant.ts ← URL-synced variant hook
│   │       └── opengraph-image.tsx     ← Dynamic OG image
│   │
│   ├── products/                 ← Product listing/browse page
│   │   ├── page.tsx              ← Listing with filters + sort + pagination
│   │   └── products-sort-select.tsx
│   │
│   ├── category/
│   │   └── [slug]/               ← Category filtered listing
│   │       └── page.tsx
│   │
│   ├── collection/
│   │   └── [slug]/               ← Collection filtered listing
│   │       └── page.tsx
│   │
│   ├── search/                   ← Search results page
│   │   ├── page.tsx
│   │   ├── search-controls.tsx
│   │   ├── search-pagination.tsx
│   │   └── sort.ts
│   │
│   ├── blog/                     ← Blog (feature-flagged)
│   │   ├── page.tsx              ← Blog listing
│   │   └── [slug]/
│   │       └── page.tsx          ← Blog post detail
│   │
│   ├── order/
│   │   └── success/
│   │       └── page.tsx          ← Post-checkout order confirmation
│   │
│   ├── about/page.tsx
│   ├── faq/page.tsx
│   ├── contact/page.tsx          ← Feature-flagged contact form
│   ├── newsletter/page.tsx
│   ├── legal/
│   │   └── [slug]/page.tsx       ← Legal pages (privacy, terms, etc.)
│   │
│   ├── api/
│   │   └── auth/
│   │       └── [...all]/route.ts ← Auth passthrough to platform
│   │
│   ├── llms.txt/route.ts         ← llms.txt for AI crawlers
│   ├── manifest.webmanifest/     ← Web App Manifest
│   └── favicon.ico/              ← Dynamic favicon
│
├── components/                   ← Shared components
│   ├── ui/                       ← Shadcn/Radix UI primitives (19 components)
│   ├── sections/                 ← Page sections
│   │   ├── hero.tsx              ← Hero section
│   │   ├── about.tsx             ← About section
│   │   ├── newsletter.tsx        ← Newsletter section
│   │   ├── product-grid.tsx      ← Featured product grid
│   │   └── product-filters.tsx   ← Filter sidebar + mobile sheet
│   ├── search/
│   │   └── search-input.tsx      ← Search input (header)
│   ├── store-chat/               ← AI chat widget
│   │   ├── chat-launcher.tsx     ← FAB launcher
│   │   ├── chat-panel.tsx        ← Chat panel (messages + input)
│   │   ├── chat-product-card.tsx ← Product card in chat response
│   │   ├── chat-markdown.tsx     ← Streaming markdown renderer
│   │   └── store-chat-section.tsx
│   ├── product-card.tsx          ← Product card (listing)
│   ├── quick-add-button.tsx      ← Quick-add for single-variant products
│   ├── listing-pagination.tsx    ← URL-driven pagination
│   ├── newsletter-dialog.tsx     ← Newsletter popup
│   ├── tiptap-renderer.tsx       ← Rich text (Tiptap) renderer
│   ├── cookie-consent-banner.tsx ← GDPR cookie banner
│   ├── cookie-consent.tsx        ← Consent logic
│   ├── theme-toggle.tsx          ← Dark/light mode switch
│   ├── store-config-provider.tsx ← Store config React context
│   └── devtools.tsx              ← Dev-only helpers
│
├── lib/                          ← Utilities and business logic
│   ├── commerce.ts               ← Commerce SDK client + helpers
│   ├── pricing.ts                ← Tax-aware price selection
│   ├── money.ts                  ← Currency formatting (Intl)
│   ├── cookies.ts                ← Cart cookie management
│   ├── store-config.ts           ← Store settings cache
│   ├── constants.ts              ← Default currency + locale
│   ├── facets.ts                 ← Filter facet computation
│   ├── json-ld.tsx               ← Structured data (JSON-LD)
│   ├── track.tsx                 ← Analytics event queue
│   ├── dates.ts                  ← Date formatting
│   ├── vts.ts                    ← Variant-type selector
│   ├── yns-media.tsx             ← Responsive media helper
│   ├── store-tools.ts            ← Feature flag helpers
│   ├── invariant.ts              ← Runtime assertion
│   ├── utils.ts                  ← `cn()` class merger
│   └── contrast.ts               ← WCAG contrast utilities
│
├── public/                       ← Static assets
│   └── logo.svg
│
├── scripts/                      ← CLI helpers
│   ├── api.sh                    ← Call any Store API endpoint
│   ├── publish.sh                ← Production publish
│   ├── check-shell.sh            ← Verify prerendered shell integrity
│   └── audit.sh                  ← Lighthouse audit runner
│
├── proxy.ts                      ← Next.js middleware proxy config
├── instrumentation-client.ts     ← Platform analytics injection (DO NOT EDIT)
├── next.config.ts                ← Next.js configuration
├── biome.json                    ← Lint + format rules
├── tsconfig.json                 ← TypeScript configuration
├── postcss.config.mjs            ← PostCSS config
├── components.json               ← Shadcn component config
└── AGENTS.md                     ← Developer guide (authoritative)
```

---

## 4. Environment Variables

| Variable | Required | Description |
|---|---|---|
| `YNS_API_KEY` | **Required** | Store API key (server-only — never `NEXT_PUBLIC_`) |
| `NEXT_PUBLIC_YNS_API_TENANT` | Optional | Override API base URL (e.g., for dev backends) |
| `YNS_API_URL` | Optional | Override API host URL |
| `NEXT_PUBLIC_URL` | Optional | Canonical URL for SEO (e.g., `https://theletterink.com`) |
| `VERCEL_URL` | Auto (Vercel) | Deployment URL |
| `VERCEL_PROJECT_PRODUCTION_URL` | Auto (Vercel) | Production URL |
| `VERCEL_ENV` | Auto (Vercel) | `development`, `preview`, `production` |

### `.env.local` for The Letter Ink

```env
# Required — server-side API key for commerce-kit
YNS_API_KEY=your_api_token_here

# Optional — set to Medusa backend URL when integrating with Medusa
NEXT_PUBLIC_YNS_API_TENANT=http://localhost:9000

# Canonical URL for SEO
NEXT_PUBLIC_URL=https://theletterink.com
```

---

## 5. Scripts Reference

| Script | Command | Description |
|---|---|---|
| `dev` | `bun next dev` | Dev server on port 3000 |
| `build` | `bun next build && bash scripts/check-shell.sh` | Production build + shell integrity check |
| `start` | `bun next start` | Production server |
| `lint` | `bun run biome check --write --unsafe` | Lint + auto-fix |
| `format` | `bun run biome format --write` | Format all files |
| `test` | `bun test` | Run unit tests |
| `check` | `bun run biome check && bun tsc --noEmit && bun test` | Full quality check |
| `audit` | `bash scripts/audit.sh <url>` | Lighthouse performance audit |
| `api` | `bash scripts/api.sh <METHOD> <path>` | Call Store API |
| `publish:store` | `bash scripts/publish.sh` | Publish to production |

---

## 6. Package Dependencies

### `safe-try` Pattern

All async calls use `safe-try` for railway-oriented error handling:

```typescript
import { try_ } from "safe-try"

const [error, result] = await try_(commerce.productGet({ idOrSlug: slug }))
if (error) {
  // handle error
  return null
}
// result is guaranteed non-null
```

### Key Dependency Rationale

| Dependency | Why |
|---|---|
| `commerce-kit` | Official SDK for YNS/Medusa API — handles auth, types, error normalization |
| `safe-try` | Replaces try/catch with typed tuples — no unhandled rejections |
| `class-variance-authority` | Type-safe component variant API for Shadcn components |
| `clsx` + `tailwind-merge` | Prevents Tailwind class conflicts in `cn()` utility |
| `sonner` | Non-blocking toast notifications for cart feedback |
| `next-themes` | SSR-compatible dark mode without flash |
| `streamdown` | Streaming-compatible markdown for AI chat responses |
| `@tiptap/static-renderer` | Renders rich text on server without client JavaScript |
