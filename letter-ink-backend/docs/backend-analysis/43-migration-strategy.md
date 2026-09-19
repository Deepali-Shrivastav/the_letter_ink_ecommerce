# 43 — Migration Strategy
## letter-ink-backend → The Letter Ink Production Backend

> **Analysis only. Do not modify the codebase.**
> This document describes the conceptual migration strategy from the current Medusa DTC Starter to The Letter Ink's own production-grade backend.

---

## Migration Principle

> **Extend, don't replace.** Medusa provides a production-grade commerce foundation. The migration strategy builds on top of it, not beside it.

The workflow is:

```
CURRENT REPOSITORY (Medusa DTC Starter + Customisation scaffold)
                    ↓
           DEEP ANALYSIS (this document suite)
                    ↓
      GAP ANALYSIS + BUILD vs. REUSE DECISIONS
                    ↓
           THE LETTER INK PRD
                    ↓
         TECHNICAL ARCHITECTURE DESIGN
                    ↓
              DATABASE DESIGN
                    ↓
               API DESIGN
                    ↓
          IMPLEMENTATION PLAN
                    ↓
             IMPLEMENTATION
                    ↓
               TESTING
                    ↓
             DEPLOYMENT
```

---

## Phase 0 — Repository Understanding ✅

**Status:** Complete (this document suite)

**Objective:** Reverse-engineer the current repository completely.

**Output:** 45 analysis documents covering every aspect of the repository.

**Dependencies:** None.

**Expected output:** A senior backend engineer can understand the system without reading the source code.

---

## Phase 1 — Architecture Definition (Next)

**Status:** Not started.

**Objective:** Define The Letter Ink's architecture decisions based on this analysis.

**Key decisions to make:**
- Q1: Customisation selections in `cart_line_item.metadata` vs. custom table
- Q2: Customization pricing model
- Q3: Preview system approach (client-side CSS vs. server-side render)
- Q4: Payment providers (Razorpay + Stripe)
- Q5: Shipping providers (Shiprocket/Delhivery)
- Q6: Production workflow architecture
- Q7: Complete Letter Ink product catalog definition
- Q8: Email provider choice
- Q9: File storage provider (S3/R2)
- Q10: Deployment target (AWS/GCP/Hetzner)

**Expected output:** Architecture Decision Records (ADRs) resolving all open questions in `44-open-questions.md`.

**Dependencies:** Business requirements sign-off.

---

## Phase 2 — Domain Modeling

**Objective:** Define The Letter Ink's domain model precisely.

**Tasks:**
1. Define all product types (name frames, stationery, envelopes, etc.)
2. Define customisation schema for each product type
3. Define compatibility rule structure
4. Define personalization text constraints
5. Define cart line item metadata schema
6. Define order line item metadata schema
7. Define production order data model
8. Define customer data requirements

**Expected output:** Data model document with exact table schemas.

**Dependencies:** Phase 1 decisions.

**Risks:**
- Business requirements may be unclear on some product types
- Customisation pricing model may be complex

---

## Phase 3 — Backend Foundation

**Objective:** Stabilize and harden the existing Medusa application.

**Tasks (in order):**
1. Fix P0 technical debt: secrets, input validation, broken widget import
2. Configure India region, INR currency, Indian warehouse (replace European seed)
3. Replace generic product seed with Letter Ink product catalog
4. Add Zod validation to all existing custom API routes
5. Fix broken admin widget import
6. Add missing unique constraints via new migrations
7. Restore or document the dropped `group_id` FK decision
8. Configure Razorpay payment provider
9. Configure India GST tax regions and rates
10. Add structured logging

**Expected output:** A hardened, correctly-configured Medusa application that can accept real Indian orders (without customisation yet).

**Dependencies:** Phase 2 domain model.

**Risks:**
- Payment provider integration complexity
- GST compliance requires consultation with a tax expert

---

## Phase 4 — Customisation Engine

**Objective:** Implement the core Letter Ink differentiator — customisation from selection through to order.

**Tasks (in order):**
1. Design and finalize `cart_line_item.metadata` customisation schema
2. Create `validateCustomisationWorkflow` (workflow steps: validate required, validate compatibility, validate text)
3. Create `addToCartWithCustomisationStep` (workflow step: call validateCustomisation, then write metadata)
4. Create or extend the store add-to-cart endpoint to accept and save customisation
5. Create `validateCustomisationAtCheckoutStep`
6. Add server-side `max_chars` validation
7. Fix compatibility rule response format (values, not IDs)
8. Write unit tests for all validation logic
9. Write HTTP integration tests for the new endpoint

**Expected output:** End-to-end customisation flow: customer selects → validates → saved to cart → flows to order.

**Dependencies:** Phase 3 (stable foundation). Phase 2 (agreed metadata schema).

**Risks:**
- Workflow step integration with `addToCartWorkflow` requires careful composition
- Validation must handle edge cases (no rules = all allowed? or all blocked?)

---

## Phase 5 — Commerce Integration

**Objective:** Complete the commerce pipeline for Letter Ink products.

**Tasks:**
1. Configure shipping providers (Shiprocket or chosen provider)
2. Configure file storage for product images
3. Create Letter Ink product catalog in admin
4. Configure email provider and notification templates
5. Add order confirmation email with customisation details
6. Add fulfillment/shipping notification emails
7. Test complete customer journey: browse → customise → cart → checkout → order confirmation

**Expected output:** A working storefront-to-order pipeline for real customers.

**Dependencies:** Phase 4 (customisation). Phase 3 (payments, taxes).

**Risks:**
- Shipping provider API integration complexity
- Email template design may require marketing team input

---

## Phase 6 — Production Management System

**Objective:** Give the production team the tools to manage printing and fulfillment.

**Tasks:**
1. Design production order data model (or use order metadata + status flags)
2. Create production workflow (pending → in_production → qc → packaging → ready_to_ship)
3. Build admin production queue page (`src/admin/routes/production/`)
4. Build production order detail view (showing all customisation data)
5. Add QC checklist functionality
6. Add packaging workflow step
7. Integrate with fulfillment workflow

**Expected output:** Production team can manage their entire workflow from the admin dashboard.

**Dependencies:** Phase 5 (orders with customisation data).

**Risks:**
- Production workflow complexity depends on business process definition
- May require physical process design before technical implementation

---

## Phase 7 — Admin Completion

**Objective:** Give the operations team full control of all Letter Ink-specific features.

**Tasks:**
1. Build complete customisation group management page (admin)
2. Build compatibility rule management UI
3. Build product customisation assignment UI
4. Build text field management UI
5. Replace read-only widget with interactive management widget
6. Add production dashboard and reporting

**Expected output:** No manual database or API calls needed for routine operations.

**Dependencies:** Phase 6 (all features implemented).

---

## Phase 8 — Frontend Integration

**Objective:** Connect `yournextstore` frontend to the Letter Ink backend.

**Tasks:**
1. Configure frontend to call Letter Ink backend (replace YNS platform endpoints)
2. Implement product customisation UI (paper swatch, ink swatch, font chip selectors)
3. Implement compatibility-aware option filtering
4. Implement personalization text field
5. Implement add-to-cart with customisation data
6. Implement cart display of customisation summary
7. Implement order confirmation with customisation display
8. Test complete user journey on frontend

**Expected output:** A working customer-facing Letter Ink storefront.

**Dependencies:** Phase 5 (working backend). Document `F09_frontend_integration.md` (integration guide).

---

## Phase 9 — Testing

**Objective:** Achieve production-confidence test coverage.

**Tasks:**
1. Unit tests for all customisation module service methods
2. Unit tests for validation logic (compatibility rules, required fields, max_chars)
3. Unit tests for cart metadata assembly
4. HTTP integration tests for all custom routes (admin + store)
5. Workflow tests for `validateCustomisationWorkflow`
6. End-to-end test: full customer journey (optional — can be done manually initially)

**Expected output:** Test suite that passes in CI. Regressions caught before deployment.

**Dependencies:** Phase 7 (features stable).

---

## Phase 10 — Deployment

**Objective:** Production deployment infrastructure for The Letter Ink.

**Tasks:**
1. Create Dockerfile for the backend
2. Create docker-compose for local development
3. Set up production PostgreSQL (AWS RDS / Neon / Supabase)
4. Set up production Redis (ElastiCache / Upstash)
5. Set up S3 or R2 for file storage
6. Create GitHub Actions CI/CD pipeline
7. Configure production environment variables
8. Set up domain and CORS for production
9. Run database migrations against production
10. Create admin user for production
11. Seed production data
12. Smoke test production

**Expected output:** The Letter Ink backend running in production, accepting real orders.

**Dependencies:** All phases complete.

**Risks:**
- Database migration strategy must be defined (blue-green? rolling?)
- Rollback plan required for each deployment

---

## Phase Summary

| Phase | Name | Status | Critical |
|---|---|---|---|
| 0 | Repository Understanding | ✅ Complete | — |
| 1 | Architecture Definition | ❌ Not started | Yes — blocks all |
| 2 | Domain Modeling | ❌ Not started | Yes |
| 3 | Backend Foundation | ❌ Not started | Yes |
| 4 | Customisation Engine | ❌ Not started | Yes — core feature |
| 5 | Commerce Integration | ❌ Not started | Yes |
| 6 | Production Management | ❌ Not started | High |
| 7 | Admin Completion | ❌ Not started | Medium |
| 8 | Frontend Integration | ❌ Not started | Yes |
| 9 | Testing | ❌ Not started | High |
| 10 | Deployment | ❌ Not started | Yes — go-live |
