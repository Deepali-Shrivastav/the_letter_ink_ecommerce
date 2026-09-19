# 40 — Build vs. Reuse Analysis
## letter-ink-backend · Decision Matrix

> **Analysis only. Do not modify the codebase.**

---

## Decision Key

| Decision | Meaning |
|---|---|
| **REUSE** | Use Medusa's implementation as-is, zero changes |
| **CONFIGURE** | Use Medusa's implementation, change configuration/env only |
| **EXTEND** | Use Medusa's implementation, add application-specific behavior on top |
| **REPLACE** | Remove current implementation, substitute a different one |
| **BUILD** | Create new from scratch — Medusa provides no support |

---

## Complete Build vs. Reuse Matrix

| Capability | Current Implementation | Ownership | Decision | Reason |
|---|---|---|---|---|
| **Product catalog (CRUD)** | Medusa Product module | Medusa core | **REUSE** | Complete, production-grade |
| **Product variants** | Medusa variant model | Medusa core | **REUSE** | Works as-is |
| **Product options** | Medusa option model | Medusa core | **REUSE** | Handles Size/Color; Letter Ink customization is separate |
| **Product categories** | Medusa category module | Medusa core | **REUSE** | Works as-is |
| **Product images** | Medusa image model | Medusa core | **EXTEND** | Add S3 provider for storage |
| **Product seed data** | Generic Medusa apparel (T-shirts, sweatpants, etc.) | Application | **REPLACE** | Wrong business domain — must seed Letter Ink products |
| **Cart creation** | Medusa cart workflow | Medusa core | **REUSE** | Complete |
| **Add to cart** | Medusa addToCartWorkflow | Medusa core | **EXTEND** | Must add customisation metadata writing alongside |
| **Cart pricing** | Medusa pricing engine | Medusa core | **EXTEND** | May need customisation price modifiers |
| **Cart validation (customisation)** | None | None | **BUILD** | Required selections, compatibility check, max_chars |
| **Checkout flow** | Medusa checkout workflows | Medusa core | **REUSE** | Complete — address, shipping, payment, order |
| **Customisation at checkout** | None | None | **EXTEND** | Validate customisation data before completing cart |
| **Order creation** | Medusa completeCartWorkflow | Medusa core | **REUSE** | Complete |
| **Order management (admin)** | Medusa admin dashboard | Medusa core | **EXTEND** | Add production management overlay |
| **Order metadata (customisation)** | Medusa order line item metadata | Medusa core | **EXTEND** | Write customisation to metadata (jsonb already exists) |
| **Inventory management** | Medusa inventory module | Medusa core | **REUSE** | Complete — items, levels, reservations |
| **Stock locations** | Medusa stock location module | Medusa core | **CONFIGURE** | Replace European warehouse with Indian warehouse |
| **Fulfillment framework** | Medusa fulfillment module | Medusa core | **REUSE** | Complete abstract layer |
| **Fulfillment provider** | Manual provider (dev) | Medusa + app | **REPLACE** | Need Shiprocket/Delhivery/similar for India |
| **Shipping options** | Manual provider, 2 options seeded | Application | **REPLACE** | Replace with India shipping rates |
| **Payment framework** | Medusa payment module | Medusa core | **REUSE** | Complete abstract layer |
| **Payment provider** | System default (dev) | Medusa | **REPLACE** | Need Razorpay (India) + Stripe (international) |
| **Customer accounts** | Medusa customer module | Medusa core | **REUSE** | Complete |
| **Customer authentication** | Medusa auth module (JWT) | Medusa core | **REUSE** | Complete |
| **Pricing engine** | Medusa pricing module | Medusa core | **EXTEND** | Add customisation price modifiers |
| **Promotions/coupons** | Medusa promotion module | Medusa core | **REUSE** | Complete |
| **Tax system** | Medusa tax module | Medusa core | **CONFIGURE** | Configure India GST rates and regions |
| **Region configuration** | Europe only (seeded) | Application | **REPLACE** | Replace with India + international regions |
| **Currency** | EUR + USD (seeded) | Application | **EXTEND** | Add INR as default currency |
| **Admin dashboard** | @medusajs/dashboard | Medusa | **EXTEND** | Add Letter Ink customisation management pages |
| **Admin widgets** | 1 product customisation widget (read-only, broken) | Application | **REPLACE** | Rewrite with working import and full management |
| **Sales channels** | Default sales channel (seeded) | Application | **CONFIGURE** | Configure Letter Ink channels |
| **API keys** | Default publishable key (seeded) | Application | **CONFIGURE** | Regenerate for production |
| **Events / subscribers** | Empty — no custom subscribers | Application | **BUILD** | Add order.placed, order.fulfilled subscribers |
| **Scheduled jobs** | Empty — no custom jobs | Application | **BUILD** | Add any recurring tasks needed |
| **Custom workflows** | Empty | Application | **BUILD** | customisationValidation, addToCartWithCustomisation, production workflows |
| **Customisation module** | 5 models, auto-generated service | Application | **EXTEND** | Foundation is good — add cart integration, validation |
| **Compatibility engine (server)** | Rules stored, returned via API | Application | **EXTEND** | Add server-side enforcement at cart add time |
| **Text field validation** | max_chars stored, not enforced | Application | **EXTEND** | Add server-side max_chars validation |
| **Cart customisation storage** | None | None | **BUILD** | New workflow step to write to line_item.metadata |
| **Production management** | None | None | **BUILD** | New module, admin pages, production workflow |
| **Production admin dashboard** | None | None | **BUILD** | Custom admin pages |
| **QC workflow** | None | None | **BUILD** | New workflow step |
| **Packaging workflow** | None | None | **BUILD** | New workflow step |
| **Preview system** | None | None | **BUILD** | Client-side initially; server-side for email later |
| **Customisation pricing** | None | None | **BUILD** | price_modifier on option or custom pricing step |
| **Email provider** | None configured | None | **BUILD** | Install + configure email provider |
| **Email templates** | None | None | **BUILD** | Letter Ink branded templates with customisation data |
| **File storage provider** | None configured | None | **BUILD** | Install S3/R2 provider |
| **JWT secrets** | `supersecret` | Application | **REPLACE** | Must be production-grade secrets |
| **Cookie secrets** | `supersecret` | Application | **REPLACE** | Must be production-grade secrets |
| **CORS configuration** | Dev URLs only | Application | **REPLACE** | Production domains |
| **Input validation (custom routes)** | None (`req.body as any`) | Application | **BUILD** | Add Zod validation to all custom routes |
| **OpenTelemetry** | Present, commented out | Application | **BUILD** | Uncomment + configure for production observability |
| **Deployment (Docker)** | None | None | **BUILD** | Dockerfile + docker-compose |
| **Deployment (CI/CD)** | None | None | **BUILD** | GitHub Actions pipeline |
| **Testing (custom module)** | None | None | **BUILD** | Unit + integration tests for customisation module |
| **Testing (custom routes)** | None | None | **BUILD** | HTTP integration tests |

---

## Summary by Decision

| Decision | Count | % |
|---|---|---|
| **REUSE** | 14 | 27% |
| **CONFIGURE** | 5 | 10% |
| **EXTEND** | 14 | 27% |
| **REPLACE** | 9 | 17% |
| **BUILD** | 10 | 19% |

**Total assessed:** 52 capabilities

---

## High-Priority Build Decisions (Critical Path)

These must be built before The Letter Ink can process real orders:

1. **Cart customisation storage** — write selections to `cart_line_item.metadata`
2. **Customisation validation workflow** — enforce rules at add-to-cart and checkout
3. **Razorpay payment provider** — accept Indian payments
4. **India region + INR currency** — correct geography and currency
5. **India GST tax configuration** — legal compliance
6. **Input validation (Zod)** on all custom API routes
7. **Production-grade secrets** — replace `supersecret`
8. **Deployment infrastructure** — Docker + CI/CD

---

## Things That Should NOT Be Replaced Unnecessarily

| Component | Reason |
|---|---|
| Medusa core modules | Provide years of battle-tested commerce infrastructure |
| Medusa workflow engine | Transactional, compensatable workflows are valuable |
| Medusa admin dashboard | Fully functional; extend, don't rebuild |
| Medusa auth system | Complete JWT/session management |
| Medusa pricing engine | Complex multi-currency, region, rule-based pricing |
| Medusa inventory | Location-based inventory with reservations |
| PostgreSQL | Excellent fit; no reason to change |
| Redis | Required by Medusa for events/cache |
| MikroORM | Managed by Medusa; do not bypass |

---

## Recommended Architecture Approach

> **Modular Monolith** — extend the current Medusa application architecture, do not create microservices.

**Rationale:**
- Medusa's module system already provides proper domain boundaries
- Microservices would add operational complexity with no current benefit
- The codebase is a single-team project at early stage
- Medusa's workflow engine handles the distributed transaction use case
- Scale to microservices only if specific bottlenecks are proven

**Future service separation candidates** (only if proven necessary):
- Preview generation service (image rendering is CPU-intensive)
- Notification/email service (may benefit from queue isolation)
