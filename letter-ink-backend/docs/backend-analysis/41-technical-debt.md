# 41 — Technical Debt
## letter-ink-backend · Debt Inventory

> **Analysis only. Do not modify the codebase.**

---

## 1. Overview

Technical debt is categorized by priority:
- **P0** — Blocks production deployment
- **P1** — Must be resolved before first real order
- **P2** — Must be resolved within first month
- **P3** — Should be resolved within first quarter

---

## 2. Debt Inventory

### DEBT-01: No Input Validation on Any Custom Route

| Field | Value |
|---|---|
| **Priority** | P0 |
| **Evidence** | Every custom route handler uses `req.body as any`. Example: `createCustomisationGroups(req.body as any)` |
| **Impact** | Malformed data accepted into database; potential type coercion failures; security risk |
| **Zod is installed** | Yes — `zod: 4.2.0` in `package.json` — but unused |
| **Future consideration** | Add Zod schema for every POST/PATCH body before any external access |

---

### DEBT-02: Default Secrets

| Field | Value |
|---|---|
| **Priority** | P0 |
| **Evidence** | `JWT_SECRET=supersecret`, `COOKIE_SECRET=supersecret` in `.env` |
| **Impact** | Authentication bypass risk |
| **Future consideration** | Generate proper secrets using `openssl rand -base64 32` |

---

### DEBT-03: Cart Customisation Integration Missing

| Field | Value |
|---|---|
| **Priority** | P0 |
| **Evidence** | No code writes customisation selections to `cart_line_item.metadata` |
| **Impact** | Customers cannot actually save their customisation choices — the entire product differentiator is non-functional end-to-end |
| **Future consideration** | Implement custom `addToCartWithCustomisation` workflow |

---

### DEBT-04: Broken Admin Widget Import

| Field | Value |
|---|---|
| **Priority** | P1 |
| **Evidence** | `import { sdk } from "../lib/sdk"` in `product-customisation-widget.tsx:4` — `src/admin/lib/sdk.ts` does not exist |
| **Impact** | Admin dashboard widget throws module-not-found error. Widget falls back (sdk is unused) but import error impacts load |
| **Future consideration** | Remove the unused import |

---

### DEBT-05: Internal FK Dropped Without Replacement

| Field | Value |
|---|---|
| **Priority** | P1 |
| **Evidence** | `Migration20260917064102.ts:12-14` drops the FK and index from `customisation_option.group_id` |
| **Impact** | Options can be created with non-existent `group_id` values — orphaned options |
| **Future consideration** | Restore FK in new migration OR add application-level validation |

---

### DEBT-06: Zero Test Coverage on Custom Code

| Field | Value |
|---|---|
| **Priority** | P1 |
| **Evidence** | `integration-tests/` contains only `setup.js`. `src/modules/customisation/` has no `__tests__/` directory |
| **Impact** | No confidence in correctness of any custom code; regressions undetected |
| **Future consideration** | Add unit tests for each service method; add HTTP integration tests for all custom routes |

---

### DEBT-07: Business Logic in Route Handlers (Not Workflows)

| Field | Value |
|---|---|
| **Priority** | P1 |
| **Evidence** | The complex assembly logic in `store/products/[productId]/customisation/route.ts` (84 lines of multi-query assembly) lives directly in a route handler |
| **Impact** | Logic is not reusable from other contexts (subscribers, cron jobs); logic is not compensatable/transactional; violates Medusa's architecture convention |
| **Future consideration** | Move to a workflow step. AGENTS.md explicitly states: "Business logic belongs in workflows, not in route handlers." |

---

### DEBT-08: No Unique Constraints on Junction Tables

| Field | Value |
|---|---|
| **Priority** | P2 |
| **Evidence** | `customisation_product_group` has no unique constraint on `(product_id, group_id)`. `customisation_compatibility_rule` has no unique constraint on `(source_option_id, target_option_id)` |
| **Impact** | Duplicate product-group links and duplicate compatibility rules can be inserted |
| **Future consideration** | Add new migration with `UNIQUE (product_id, group_id)` and `UNIQUE (source_option_id, target_option_id)` |

---

### DEBT-09: Seed Data Is Wrong Business Domain

| Field | Value |
|---|---|
| **Priority** | P2 |
| **Evidence** | `initial-data-seed.ts` seeds Medusa T-shirts, Sweatshirts, Sweatpants, Shorts — not Letter Ink products |
| **Impact** | Cannot test the actual product catalog without manual data creation; misleading for development |
| **Future consideration** | Replace seed data with Letter Ink product catalog (name frames, stationery, etc.) |

---

### DEBT-10: Wrong Region/Geography Configuration

| Field | Value |
|---|---|
| **Priority** | P1 |
| **Evidence** | Seed creates "European Warehouse" in Copenhagen, "Europe" region with GB/DE/DK/SE/FR/ES/IT countries, EUR as default currency |
| **Impact** | Entirely wrong geography for The Letter Ink (India-based business) |
| **Future consideration** | Replace with India region, INR currency, Indian warehouse, relevant countries |

---

### DEBT-11: No Deployment Infrastructure

| Field | Value |
|---|---|
| **Priority** | P0 for launch |
| **Evidence** | No Dockerfile, no docker-compose, no CI/CD, no production env template |
| **Impact** | Cannot deploy to production |
| **Future consideration** | Create Dockerfile, docker-compose, GitHub Actions CI/CD |

---

### DEBT-12: No Observability

| Field | Value |
|---|---|
| **Priority** | P2 |
| **Evidence** | `instrumentation.ts` — entirely commented out. No structured logging in custom code (`console.error` only) |
| **Impact** | Cannot diagnose production issues; no metrics; no tracing |
| **Future consideration** | Uncomment OpenTelemetry; configure exporter; add structured logging |

---

### DEBT-13: `name-frame-royal-large` Product Not Seeded

| Field | Value |
|---|---|
| **Priority** | P2 |
| **Evidence** | `seed-customisation.ts:72-91` tries to link customisation data to a product with `handle: "name-frame-royal-large"` but this product is not created by `initial-data-seed.ts` |
| **Impact** | Customisation seed always logs "Product 'name-frame-royal-large' not found. Skipping." — the customisation groups exist but are not linked to any product |
| **Future consideration** | Add the name-frame product to the initial data seed, or seed them together |

---

### DEBT-14: Duplicate REDIS_URL in `.env`

| Field | Value |
|---|---|
| **Priority** | P3 |
| **Evidence** | `REDIS_URL=redis://localhost:6379` appears twice in `.env` (lines 5 and 11) |
| **Impact** | Second occurrence overrides first — not currently different, but could cause confusion |
| **Future consideration** | Remove duplicate |

---

### DEBT-15: `is_required` Ambiguity — Group-Level vs. Product-Group Level

| Field | Value |
|---|---|
| **Priority** | P2 |
| **Evidence** | `customisation_group.is_required` AND `customisation_product_group.is_required` both exist |
| **Impact** | Unclear which takes precedence when both are set differently. The store API endpoint only uses `pg.is_required` from the product-group join — the group-level flag is returned but not acted upon |
| **Future consideration** | Define clear semantics in the PRD: product-group `is_required` overrides group-level, or document which wins |

---

### DEBT-16: Compatibility Rule Response Mixes ID and Value

| Field | Value |
|---|---|
| **Priority** | P2 |
| **Evidence** | Store endpoint returns `compatibility_rules: { optionValue: [targetOptionId, ...] }` — keys are `value` strings but array items are `id` strings |
| **Impact** | Frontend must resolve IDs to values to perform filtering — error-prone |
| **Future consideration** | Return `{ optionValue: [targetOptionValue, ...] }` consistently |

---

## 3. Debt Summary by Priority

| Priority | Count | Items |
|---|---|---|
| **P0** (Blocks deployment) | 4 | DEBT-01, DEBT-02, DEBT-03, DEBT-11 |
| **P1** (Before first order) | 5 | DEBT-04, DEBT-05, DEBT-06, DEBT-07, DEBT-10 |
| **P2** (Within first month) | 5 | DEBT-08, DEBT-09, DEBT-12, DEBT-13, DEBT-15, DEBT-16 |
| **P3** (First quarter) | 1 | DEBT-14 |

---

## 4. "Do Not Touch" Medusa Foundation

The following components should NOT be modified unnecessarily — they form the stable foundation:

| Component | Reason |
|---|---|
| `apps/backend/.medusa/` | Build output — auto-regenerated |
| Any file in `node_modules/` | Package manager managed |
| `package-lock.json` | Package manager managed |
| Medusa core module schemas | Managed by Medusa migrations; modifying breaks upgrades |
| `medusa-config.ts` | Change only when adding providers or modules |
| Existing migration files in `src/modules/customisation/migrations/` | Already applied; create new migrations instead |
