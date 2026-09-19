# 00 — Master Analysis: The Letter Ink Backend
## _Reverse-Engineering Report · September 2026_

> **Entry point for the complete backend analysis suite.**
> **DO NOT modify the codebase based on this document.** This is a pure analysis and documentation phase.

---

## 1. What the Repository Actually Is

| Property | Value | Evidence |
|---|---|---|
| **Repository name** | `letter-ink-backend` | `package.json` root name |
| **Type** | Medusa DTC Starter — Turborepo monorepo wrapping a Medusa v2 application | `AGENTS.md` line 5; `@medusajs/medusa: 2.21.0` |
| **Medusa version** | **2.21.0** | `apps/backend/package.json` |
| **Package manager** | **npm 11.19.0** | `packageManager` field in root `package.json` |
| **Build system** | **Turborepo 2.x** | `turbo.json` |
| **Node requirement** | `^20.19.0 \|\| >=22.12.0` | Both `package.json` files |
| **Language** | TypeScript 5.6 | `devDependencies.typescript: ^5.6.2` |
| **Architecture** | Medusa framework application — NOT Medusa's own source code | `@medusajs/medusa` is a dependency, not root |

### What Was Cloned

This is the **Medusa DTC (Direct-to-Consumer) Starter** — the official starter template published by Medusa, initialized as `@dtc/backend`. The repository has been:

1. Cloned/initialized as `letter-ink-backend`
2. A custom `Customisation` module actively developed on top
3. The `storefront` app is referenced in `AGENTS.md` but **does not exist** in `apps/`

### Monorepo Structure

```
letter-ink-backend/
├── apps/
│   └── backend/           ← Only application (@dtc/backend, Medusa 2.21.0)
├── docs/
│   └── backend-analysis/  ← This documentation suite
├── eslint.config.ts       ← @medusajs/eslint-plugin
├── turbo.json             ← Task graph
├── package.json           ← npm workspaces: apps/**
└── AGENTS.md              ← AI agent guide
```

---

## 2. Current Architecture

**Style:** Medusa Modular Architecture — framework-driven modular monolith.

```
Browser/Frontend
       │ HTTP
       ▼
Medusa HTTP Layer (:9000)
       │
  ┌────┴────────────────────────────────────────┐
  │  Auth Middleware (JWT / Session)             │
  │  File-Based Routes (src/api/store|admin)     │
  │  IoC Container (req.scope.resolve)           │
  └────┬─────────────────────────┬──────────────┘
       │                         │
  Core Modules              Custom Module
  (Product, Cart,           (customisation)
   Order, Inventory,              │
   Payment, ...)                  │
       │                         │
       └─────────┬───────────────┘
                 │
              MikroORM
                 │
            PostgreSQL
         medusa-letter-ink-backend
```

---

## 3. Technology Stack

| Layer | Technology | Version |
|---|---|---|
| Runtime | Node.js | ≥20.19 |
| Language | TypeScript | ^5.6.2 |
| Build System | Turborepo | ^2.0.14 |
| Framework | Medusa | **2.21.0** |
| Database | PostgreSQL | ≥15 |
| ORM | MikroORM (via Medusa) | Medusa-managed |
| Cache/Events | Redis | via REDIS_URL |
| Admin UI | @medusajs/dashboard | 2.21.0 |
| Admin Components | @medusajs/ui | 4.2.4 |
| Admin SDK | @medusajs/admin-sdk | 2.21.0 |
| State (Admin) | @tanstack/react-query | 5.64.2 |
| Router (Admin) | react-router-dom | 7.18.2 |
| i18n (Admin) | react-i18next | 13.5.0 |
| Validation | Zod | 4.2.0 |
| Test Runner | Jest | ^29.7.0 |
| Test Transform | @swc/jest | ^0.2.36 |
| Test Utils | @medusajs/test-utils | 2.21.0 |
| Linter | ESLint + @medusajs/eslint-plugin | 2.21.0 |
| Draft Orders | @medusajs/draft-order | 2.21.0 |
| Caching Module | @medusajs/caching | 2.21.0 |

---

## 4. Major Modules

### Medusa Core Modules (18 provided by framework)

Product · Cart · Order · Inventory · StockLocation · Payment · Fulfillment · Customer · Pricing · Promotion · SalesChannel · Tax · Store · Auth · Notification · File · ApiKey · Currency

### Custom Module (application-specific)

| Module | Key | Status |
|---|---|---|
| **Customisation** | `customisation` | **ACTIVE** — `src/modules/customisation/` |

**This is the only custom module in the repository.**

---

## 5. Major Workflows

### Custom Workflows

**None exist.** `src/workflows/` contains only a `README.md`.

### Core Workflows Used (in seed script)

`createProductsWorkflow`, `createRegionsWorkflow`, `createInventoryLevelsWorkflow`, `createShippingOptionsWorkflow`, and 12 others — all standard Medusa workflows.

**All cart/checkout/order flows use Medusa's built-in core workflows unchanged.**

---

## 6. Database Architecture

### Database

`medusa-letter-ink-backend` (PostgreSQL, `localhost:5432`)

### Custom Tables (5 tables in customisation module)

| Table | Purpose |
|---|---|
| `customisation_group` | Groups of options (e.g., "Paper Color", "Ink Color", "Font Style") |
| `customisation_option` | Individual options within a group (e.g., "Black Velvet", "Gold") |
| `customisation_text_field` | Free-text personalization field per product |
| `customisation_compatibility_rule` | Which ink options are compatible with which paper options |
| `customisation_product_group` | Junction: which groups are assigned to which products |

All tables have: `id` (text PK), `created_at`, `updated_at`, `deleted_at` (soft delete), partial index on `deleted_at`.

### Module Link

`src/links/product-customisation.ts` → `Product ←→ CustomisationGroup (1-to-many)`

### Critical Finding: FK Architecture

Cross-module references (`product_id`, `group_id`) are stored as plain text — **no SQL FK constraints** across module boundaries. This is correct Medusa pattern — cross-module integrity is managed by the link system, not SQL FKs.

**However:** In `Migration20260917064102.ts`, the internal FK from `customisation_option.group_id` → `customisation_group.id` was **explicitly dropped**, leaving `group_id` as an unvalidated text column. This creates a data integrity gap within the customisation module itself.

---

## 7. API Architecture

### Custom API Routes (application-built)

| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/store/products/:productId/customisation` | Public | Full assembled customisation config for a product |
| GET | `/admin/customisation/groups` | Admin | List all groups (with options) |
| POST | `/admin/customisation/groups` | Admin | Create group |
| PATCH | `/admin/customisation/groups/:id` | Admin | Update group |
| DELETE | `/admin/customisation/groups/:id` | Admin | Delete group |
| GET | `/admin/customisation/compatibility` | Admin | List all compatibility rules |
| POST | `/admin/customisation/compatibility` | Admin | Create compatibility rule |
| DELETE | `/admin/customisation/compatibility/:id` | Admin | Delete rule |
| GET | `/admin/customisation/products/:productId` | Admin | Get product-group links |
| POST | `/admin/customisation/products/:productId` | Admin | Link group to product |
| GET | `/store/custom` | Public | Placeholder — 200 OK |
| GET | `/admin/custom` | Admin | Placeholder — 200 OK |

### Medusa Core APIs

Hundreds of standard REST endpoints provided automatically by the framework:
- Store: `/store/products`, `/store/carts`, `/store/orders`, `/store/customers`, `/store/regions`, `/store/shipping-options`, `/store/payment-collections`
- Admin: Full CRUD for all entities

---

## 8. External Integrations

### Active

| Integration | Type |
|---|---|
| PostgreSQL | Primary database |
| Redis | Cache + event bus |
| Medusa Admin Dashboard | Served at `:9000/app` |

### NOT Configured (development defaults only)

- No Stripe / Razorpay
- No S3 / file storage
- No email provider (SMTP, SendGrid, etc.)
- No OpenTelemetry (present but commented out)
- System-default payment provider (dev only)
- Manual fulfillment provider (dev only)

---

## 9. Security Overview

| # | Severity | Issue | Location |
|---|---|---|---|
| 1 | **CRITICAL** | `JWT_SECRET=supersecret` | `.env` line 6 |
| 2 | **CRITICAL** | `COOKIE_SECRET=supersecret` | `.env` line 7 |
| 3 | **HIGH** | No input validation — all custom routes use `req.body as any` | All custom route handlers |
| 4 | **HIGH** | Admin widget imports non-existent `../lib/sdk` — runtime error | `product-customisation-widget.tsx:4` |
| 5 | **MEDIUM** | CORS includes `https://docs.medusajs.com` — not production-safe | `.env` lines 2-4 |
| 6 | **MEDIUM** | Zod installed but unused in custom routes | `package.json` vs route handlers |
| 7 | **MEDIUM** | No existence check before querying by `product_id` | Admin product customisation routes |
| 8 | **LOW** | Raw error objects logged and returned in 500 responses | `store/.../customisation/route.ts:79` |

---

## 10. Deployment Architecture

### Current State: Development Only

- ❌ No Dockerfile
- ❌ No docker-compose
- ❌ No CI/CD configuration
- ❌ No Nginx / reverse proxy
- ❌ No production environment file
- ✅ Local dev at `http://localhost:9000`

---

## 11. What Medusa Gives Us

| Capability | Quality |
|---|---|
| Product catalog (products, variants, options, categories, images) | Production-grade |
| Cart lifecycle (creation, items, discounts, shipping, taxes) | Production-grade |
| Checkout flow (address → shipping → payment → order) | Production-grade |
| Order lifecycle (returns, refunds, cancellations) | Production-grade |
| Inventory (items, levels, locations, reservations) | Production-grade |
| Fulfillment/Shipping (providers, options, profiles) | Production-grade |
| Payments (abstract provider, sessions, capture, refund) | Production-grade |
| Customer accounts (auth, addresses, orders) | Production-grade |
| Pricing engine (price sets, currencies, regions, rules) | Production-grade |
| Promotions (campaigns, discounts, coupons) | Production-grade |
| Tax system (regions, rates, calculation) | Production-grade |
| Admin dashboard (full React dashboard) | Production-grade |
| Auth system (JWT, sessions, identity providers) | Production-grade |
| Workflow engine (transactional, compensatable) | Production-grade |
| Event system (Redis-backed, subscribers) | Production-grade |
| File storage (abstract provider) | Production-grade |
| Notifications (abstract provider) | Production-grade |
| Multi-channel / API keys | Production-grade |
| Multi-currency / multi-region | Production-grade |

---

## 12. What The Letter Ink Needs

| Need | Priority | Medusa Support |
|---|---|---|
| Customization (Paper/Ink/Font) | Critical | Partial — module exists |
| Compatibility rules (ink ↔ paper) | Critical | Partial — table exists, no validation |
| Text field personalization | Critical | Partial — table exists, not validated |
| Cart-level customization storage | Critical | None — must extend |
| Order-level customization data | Critical | None — must extend |
| Customization-aware pricing | High | None — must build |
| Product preview system | High | None — must build |
| Production workflow | High | None — must build |
| India region + INR currency | High | Partial — add via config |
| Letter Ink catalog | High | Partial — seed data is wrong |
| Quality control stage | Medium | None — must build |
| Packaging workflow | Medium | None — must build |
| Admin customization management | Medium | Partial — skeleton exists |
| Email notification templates | Medium | None — must configure provider |
| Razorpay/Stripe integration | High | Partial — abstract layer exists |

---

## 13. What Can Be Reused

| Component | Confidence |
|---|---|
| Medusa core commerce infrastructure | High |
| Product / Cart / Order / Inventory / Auth modules | High |
| Payment abstract layer (add Stripe/Razorpay) | High |
| Fulfillment abstract layer | High |
| Tax module (configure India GST) | High |
| Pricing engine | High |
| Admin dashboard (extend) | Medium |
| Workflow engine (build custom workflows on top) | High |
| Customisation module — foundation | Medium |
| Module link system | High |

---

## 14. What Must Be Customized

| Component | Change Needed |
|---|---|
| Cart line items | Add metadata for customization selections |
| Order line items | Persist customization data per line |
| Customisation module | Add cart-item-level selection storage |
| Product catalog | Replace Medusa apparel with stationery products |
| Region/currency | Add India + INR |
| Admin dashboard | Add full customisation management pages |
| Shipping | India providers and rates |
| Tax | India GST |
| Payment | Razorpay / Stripe |
| CORS | Production domains |
| Secrets | Production JWT/cookie secrets |

---

## 15. What Should Be Replaced

| Component | Reason |
|---|---|
| Default secrets | Security — `supersecret` |
| System default payment provider | Dev only — not for production |
| Manual fulfillment provider | Dev only — not for production |
| Seed data (Medusa T-shirts) | Wrong business domain |
| European region/warehouse seed | Wrong geography |

---

## 16. What Must Be Built

| Capability | Complexity |
|---|---|
| Cart customisation storage (metadata extension + workflow) | High |
| Customisation validation workflow | High |
| Customization-aware pricing | High |
| Preview generation API | Very High |
| Production management workflow | High |
| Production admin dashboard | High |
| Quality control stage | Medium |
| Packaging workflow | Medium |
| Full admin customisation UI | Medium |
| Email notification templates | Medium |
| Letter Ink product catalog (seed + management) | Medium |
| Text-field server-side validation (max_chars enforcement) | Low |

---

## 17. Major Architectural Risks

| # | Severity | Risk |
|---|---|---|
| R1 | High | No input validation on custom routes (`req.body as any`) |
| R2 | Medium | No cross-module FK constraints — `product_id` references unverified |
| R3 | High | Broken admin widget import (`../lib/sdk` does not exist) |
| R4 | Medium | Internal FK dropped in migration 2 — `group_id` unvalidated |
| R5 | High | Zero test coverage for all custom code |
| R6 | Critical | `JWT_SECRET=supersecret` in `.env` |
| R7 | Critical | Cart-level customisation storage not implemented |
| R8 | High | No custom workflows — business logic directly in route handlers |
| R9 | Medium | Seed data is generic Medusa apparel, not Letter Ink products |
| R10 | High | No deployment infrastructure (no Docker, no CI/CD) |

---

## 18. Open Questions

| # | Question |
|---|---|
| Q1 | Customisation selections: cart line item `metadata` or separate module? |
| Q2 | Customization pricing model: fixed? per option? additive? |
| Q3 | Product preview: server-side or client-side? |
| Q4 | Payment providers: Razorpay (India) + Stripe (international)? |
| Q5 | Shipping providers: Shiprocket, Delhivery, etc.? |
| Q6 | Production/printing: internal workflow or external print vendor API? |
| Q7 | Exact product types: name frames, cards, envelopes — full catalog definition? |
| Q8 | Should customisation selection history be stored? |
| Q9 | Is INR the only currency or is international planned? |
| Q10 | Admin customisation: full custom page or extended widget? |
| Q11 | Exact compatibility rules across all paper/ink combinations? |
| Q12 | GST implications: 18% standard or reduced rate for stationery? |

---

## 19. Recommended Next Step

> **The next phase should be the creation of the The Letter Ink Backend PRD based on this analysis.**

The PRD must resolve open questions Q1–Q12 and specify:
- Domain model (product types, customisation schema, order information)
- API specification for custom endpoints
- Workflow design for customisation, checkout, production, and fulfillment
- Extended database schema
- Admin UX for customisation management and production
- Integration map (payment, shipping, email, tax for India)
- Security requirements (auth, validation, secrets)
- Testing strategy
- Deployment architecture (Docker, CI/CD, production)

---

## 20. Document Index

| Doc | Title |
|---|---|
| `00-master-analysis.md` | This document — executive overview |
| `01-executive-summary.md` | Non-technical executive summary |
| `02-repository-overview.md` | Repository identity and type |
| `03-repository-structure.md` | Complete directory tree |
| `04-technology-stack.md` | All dependencies classified |
| `05-dependency-analysis.md` | Deep dependency audit |
| `06-system-architecture.md` | Full architecture + Mermaid diagrams |
| `07-request-lifecycle.md` | Request tracing |
| `08-api-architecture.md` | Complete API inventory |
| `09-authentication-authorization.md` | Auth and security |
| `10-catalog-architecture.md` | Product catalog |
| `11-cart-architecture.md` | Cart system |
| `12-checkout-architecture.md` | Checkout flow |
| `13-payment-architecture.md` | Payment system |
| `14-order-architecture.md` | Order lifecycle |
| `15-inventory-architecture.md` | Inventory |
| `16-fulfillment-shipping.md` | Fulfillment and shipping |
| `17-customer-architecture.md` | Customer system |
| `18-pricing-promotions.md` | Pricing and promotions |
| `19-tax-architecture.md` | Tax system |
| `20-workflow-architecture.md` | Workflow engine |
| `21-module-architecture.md` | Module system — deep analysis |
| `22-database-architecture.md` | Database with ER diagrams |
| `23-event-architecture.md` | Events and subscribers |
| `24-background-jobs.md` | Scheduled jobs |
| `25-file-storage.md` | File storage |
| `26-admin-architecture.md` | Admin dashboard |
| `27-integrations.md` | External integrations |
| `28-security-audit.md` | Security audit |
| `29-error-handling.md` | Error handling |
| `30-observability.md` | Logging and monitoring |
| `31-testing-architecture.md` | Testing analysis |
| `32-configuration.md` | Environment variables |
| `33-deployment-architecture.md` | Deployment analysis |
| `34-performance-analysis.md` | Performance observations |
| `35-scalability-analysis.md` | Scalability evaluation |
| `36-coupling-analysis.md` | Coupling analysis |
| `37-medusa-dependency-map.md` | Keep/Customize/Replace/Build |
| `38-letter-ink-gap-analysis.md` | Gap analysis for Letter Ink |
| `39-customisation-gap-analysis.md` | Customisation engine analysis |
| `40-build-vs-reuse-analysis.md` | Build vs Reuse decision matrix |
| `41-technical-debt.md` | Technical debt |
| `42-future-architecture.md` | Future architecture boundaries |
| `43-migration-strategy.md` | Phase-by-phase migration plan |
| `44-open-questions.md` | All open questions |
| `45-glossary.md` | Domain and technical glossary |
