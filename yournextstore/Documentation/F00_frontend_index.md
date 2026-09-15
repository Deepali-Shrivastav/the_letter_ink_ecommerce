# The Letter Ink — yournextstore Frontend: Documentation Suite

> **Complete Industry-Standard Technical Documentation**  
> **Next.js Version:** 16.3.4 | **React:** 19.2.8 | **Generated:** 2026-09-15  
> **Scope:** `yournextstore/` — full frontend analysis

---

## Document Index

| # | Document | Key Topics |
|---|---|---|
| [F01](./F01_frontend_overview.md) | **Frontend Project Overview** | Tech stack, architecture, environment config |
| [F02](./F02_frontend_architecture.md) | **Frontend Architecture** | App Router, rendering strategy, caching, proxy |
| [F03](./F03_frontend_routes.md) | **Page Routes Reference** | All pages, layouts, metadata, SEO |
| [F04](./F04_frontend_components.md) | **Component Library** | All components, props, patterns |
| [F05](./F05_frontend_state.md) | **State Management** | Cart context, server actions, optimistic UI |
| [F06](./F06_frontend_api_layer.md) | **API Layer & Commerce Kit** | commerce-kit SDK, all methods, patterns |
| [F07](./F07_frontend_design_system.md) | **Design System** | Tokens, Tailwind v4, dark mode, typography |
| [F08](./F08_frontend_performance.md) | **Performance & SEO** | Prerendered shell, Suspense, JSON-LD, sitemap |
| [F09](./F09_frontend_integration.md) | **Medusa Integration Guide** | Connecting to Medusa backend instead of YNS platform |
| [F10](./F10_frontend_developer_guide.md) | **Developer Guide** | Local setup, conventions, testing, deployment |

---

## At a Glance

### Technology Stack

| Technology | Version | Role |
|---|---|---|
| **Next.js** | 16.3.4 | Full-stack React framework (App Router) |
| **React** | 19.2.8 | UI library |
| **TypeScript** | ^7.0.2 | Language |
| **Bun** | 1.x | Package manager & test runner |
| **Tailwind CSS** | 4.3.3 | Styling framework |
| **commerce-kit** | 0.61.0 | Commerce API SDK |
| **Radix UI** | various | Accessible headless components |
| **AI SDK** | 7.0.93 | AI chat (Vercel AI) |
| **Biome** | 2.5.12 | Linter & formatter |

### Page Routes Summary

| Route | Description |
|---|---|
| `/` | Homepage (Hero + Featured Products + About + Newsletter) |
| `/products` | All products with filters, sort, pagination |
| `/product/[slug]` | Product detail with variants, media gallery, reviews |
| `/category/[slug]` | Products by category |
| `/collection/[slug]` | Products by collection |
| `/search` | Full-text product search |
| `/blog` | Blog listing |
| `/blog/[slug]` | Blog post detail |
| `/order/success` | Post-checkout order confirmation |
| `/about` | About page |
| `/faq` | FAQ page |
| `/contact` | Contact form (feature-flagged) |
| `/legal/*` | Legal pages (privacy, terms, etc.) |
| `/newsletter` | Newsletter signup |
| `/cart` | Cart (sidebar — not a page) |
| `/checkout` | Proxied to platform |
| `/account` | Proxied to platform |

### Key Architecture Decisions

- **Prerendered shell:** All chrome (header, footer) is statically prerendered — only the cart cookie read is request-time
- **commerce-kit SDK:** Wraps all API calls — not direct fetch
- **Proxy pattern:** `/checkout` and `/account` are rewrites to the platform backend
- **No auth in app:** Authentication handled entirely by the proxied platform
- **Optimistic cart:** Local dispatch for instant feedback, server sync on resolution
