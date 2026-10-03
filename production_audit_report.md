# The Letter Ink — Complete Production Readiness Audit

**Audit Date:** 2026-10-02 | **Auditor:** Senior Software Architect, AppSec, DevOps, SRE
**Scope:** Full repository — backend, frontend, infrastructure, payments, security, scalability

---

## A. Executive Summary

### What the Application Is
**The Letter Ink** is a B2C e-commerce storefront for artisanal calligraphy stationery, workshops, and gifting, selling physical products, custom workshop seats, and personalized stationery online.

### Detected Technology Stack

| Layer | Technology |
|---|---|
| **Frontend** | Next.js 16.3.4 (App Router, React 19, React Compiler) |
| **Backend** | Medusa.js v2 (Node.js, PostgreSQL via MikroORM) |
| **Database** | PostgreSQL 15 (Docker) |
| **Cache / Events** | Redis (Alpine, optional) |
| **Payments** | Razorpay (INR only) |
| **Rate Limiting** | `express-rate-limit` (backend), `@upstash/ratelimit` (frontend edge) |
| **Languages** | TypeScript (both layers) |
| **Monorepo** | Turborepo (backend), standalone Next.js (frontend) |
| **Hosting** | Unspecified; frontend configured for Vercel |
| **Node.js Engine** | >= 20.19 or >= 22.12 (backend) |

### Overall Production-Readiness Assessment

> [!CAUTION]
> **NOT PRODUCTION-READY.** Several critical and high-severity issues must be resolved before the application handles real customer payments. The most urgent: `.env.local` containing live Razorpay test credentials committed to disk (SEC-001), order-tracking endpoints exposing full PII without mandatory authentication (SEC-002), payment amount trust gap (SEC-003), and critical vulnerabilities in transitive dependencies (SEC-008).

**What works well:**
- Server-side price calculation in `create-order` (fetches cart total from Medusa, ignores client-supplied amount)
- HMAC-SHA256 Razorpay signature verification is present and correct
- Cookie-based cart with `httpOnly`, `SameSite=lax`, `Secure` in production
- Security headers in `next.config.ts` (HSTS, X-Frame-Options, X-Content-Type-Options, Referrer-Policy)
- Placeholder-secret guard in `medusa-config.ts` prevents startup with default secrets
- Zod validation on all custom admin endpoints
- Logger redacts sensitive keys in production
- Admin routes protected by Medusa's `authenticate` middleware
- CORS check in `medusa-config.ts` blocks localhost origins in production

**What is not yet production-ready:**
- Live Razorpay credentials in a committed `.env.local`
- Order-tracking API leaks full customer PII to anyone who knows an order ID
- No rate limiting on checkout endpoints (create-order, verify, order-track)
- Simulated payment bypass code present and conditionally enabled
- `typescript: { ignoreBuildErrors: true }` silently hides type errors in production builds
- Missing `Content-Security-Policy` header
- `recentOrdersMap` imported in `api/order/track/route.ts` but not exported from `commerce.ts`
- Unbounded "scan all orders" fallback in order-track endpoint (PERF-001)
- Critical MikroORM SQL-injection CVE in transitive dependencies (SEC-008)
- No backup, health check, or observability configuration in the repository

---

## B. Architecture Overview

```
Browser
  |
  v
Next.js 16 (App Router / RSC)
  +-- /app/api/checkout/razorpay/create-order  -> Medusa cart fetch + Razorpay API
  +-- /app/api/checkout/razorpay/verify        -> HMAC verify + Medusa cart complete
  +-- /app/api/order/track                     -> Medusa tracking proxy
  +-- /app/api/auth/[...all]                   -> Proxy to Medusa auth (rate-limited)
  +-- /app/* (RSC pages)                       -> commerce.ts -> Medusa SDK / fetch
         |
         v
  Medusa v2 Backend (Port 9000)
    +-- /store/* (public, rate-limited 1000/15min)
    |   +-- carts, orders/track, workshops, blogs, campaigns, products
    |   +-- Custom line-item endpoint (/store/carts/:id/line-items/custom)
    +-- /admin/* (JWT/Session authenticated, rate-limited)
    |   +-- workshops, blogs, customizations
    |   +-- All standard Medusa admin routes
    +-- PostgreSQL 15 (MikroORM)
         +-- Medusa core tables (orders, carts, products, ...)
         +-- workshop (custom module)
         +-- blog/post (custom module)
         +-- customization_option, customization_option_value, customization_combination
```

**External Services:** Razorpay (payments), Google Fonts, Upstash Redis (optional rate limiting), Vercel (implied hosting)

**Architectural strengths:**
- Clean separation between custom modules and Medusa core
- Zod-validated admin endpoints
- Server-side price authority for payments

**Architectural constraints:**
- Custom checkout flow bypasses Medusa's official payment provider integration, requiring manual multi-step cart completion
- In-memory state (`recentOrdersMap`) cannot survive serverless restarts or multi-instance deployments
- `"use cache"` on `cartGet` risks serving stale cart data

---

## C. Critical and High-Severity Findings

### SEC-001 — Live Razorpay Test Credentials Committed to Disk
- **Severity:** Critical | **Confidence:** High | **Category:** Security
- **Location:** [`letter-ink-frontend/.env.local`](file:///d:/Simplesphere/Projects/the_letter_ink_ecommerce/letter-ink-frontend/.env.local) lines 4–5
- **Evidence:** File contains `NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_Tge6ES0nAYgfLm` and `RAZORPAY_KEY_SECRET=[REDACTED]`. The `.env.local` file is not in `.gitignore` and appears in `git status` as a **modified tracked file**, meaning it was previously committed.
- **Impact:** Anyone with repository access can issue Razorpay test orders. Key secret exposure permits HMAC forgery — an attacker can fabricate a valid payment signature without actually paying, potentially placing free orders in production.
- **Reproduction:** `git show HEAD:letter-ink-frontend/.env.local` — if key present in history, rotation is mandatory.
- **Recommended Fix:** (1) Immediately rotate both Razorpay keys from the dashboard. (2) Add `.env.local` to `letter-ink-frontend/.gitignore`. (3) Check git history: `git log --all --full-history -- "letter-ink-frontend/.env.local"`. (4) If found, purge with `git filter-repo` or BFG.
- **Effort:** Small (rotation + gitignore = minutes; history purge = Medium)

---

### SEC-007 — Backend `.env` Contains Production-Grade Secrets (Tracked by Git)
- **Severity:** High | **Confidence:** High | **Category:** Security
- **Location:** [`letter-ink-backend/apps/backend/.env`](file:///d:/Simplesphere/Projects/the_letter_ink_ecommerce/letter-ink-backend/apps/backend/.env) lines 6–8
- **Evidence:** The `.env` file (not `.env.example`) contains actual `JWT_SECRET`, `COOKIE_SECRET`, and `AUTH_MFA_ENCRYPTION_KEY` hex values — high-entropy, real secrets. This file appears in `git status` as modified (tracked), not untracked.
- **Impact:** Repository access = full session token forgery, cookie spoofing, and MFA bypass.
- **Recommended Fix:** (1) Add `.env` to `letter-ink-backend/apps/backend/.gitignore`. (2) Check history: `git log --all -- ".env"`. (3) If in history, rotate all three secrets and purge.
- **Effort:** Small

---

### SEC-002 — Order-Tracking Endpoint Leaks Full PII Without Mandatory Authentication
- **Severity:** High | **Confidence:** High | **Category:** Security / Privacy
- **Location:** [`letter-ink-backend/apps/backend/src/api/store/orders/track/route.ts`](file:///d:/Simplesphere/Projects/the_letter_ink_ecommerce/letter-ink-backend/apps/backend/src/api/store/orders/track/route.ts) lines 112–138
- **Evidence:** The `contact` verification block (lines 112–138) only fires when `contact` is non-empty. Callers who omit the field bypass verification entirely and receive the full order object including `customer.*`, `shipping_address.*`, `billing_address.*`, `email`, and all `items.*`. Display IDs are sequential integers — trivial to enumerate.
- **Impact:** BOLA/IDOR: any unauthenticated caller who guesses an order reference (e.g., display_id=1,2,3...) receives the customer's full name, email, phone, home address, and purchased items.
- **Reproduction:** `curl -X POST https://<store>/store/orders/track -H "Content-Type: application/json" -d '{"reference":"1"}'`
- **Recommended Fix:** (1) Make `contact` field mandatory. (2) Return only a safe subset: status, display_id, item count, masked address (city + postal code). (3) Tighten rate limit to 10 requests/15 minutes for this endpoint.
- **Effort:** Small

---

### SEC-003 — Payment Amount Not Re-Verified at Confirmation Time
- **Severity:** High | **Confidence:** Medium | **Category:** Security / E-commerce
- **Location:** [`letter-ink-frontend/app/api/checkout/razorpay/verify/route.ts`](file:///d:/Simplesphere/Projects/the_letter_ink_ecommerce/letter-ink-frontend/app/api/checkout/razorpay/verify/route.ts) lines 225–226
- **Evidence (positive):** `create-order` fetches cart total server-side — correct. **Gap:** `verify` uses `amount || 0` from the request body (client-supplied) to populate `formattedOrder.subtotal` and `formattedOrder.total`. The endpoint does not re-fetch the Razorpay order to confirm the charged amount matches what was created.
- **Impact:** Success page may display a manipulated total. In race conditions (cart modified between `create-order` and `verify`), the charged amount and the recorded order amount can diverge silently.
- **Recommended Fix:** In `verify`, after HMAC check, call `GET https://api.razorpay.com/v1/orders/{razorpay_order_id}` to retrieve the authoritative amount and use it for `formattedOrder`.
- **Effort:** Small

---

### SEC-004 — Simulated Payment Bypass Present in Production Code
- **Severity:** High | **Confidence:** High | **Category:** Security / E-commerce
- **Location:** `verify/route.ts` lines 29–45; `create-order/route.ts` lines 115–124
- **Evidence:** `create-order` returns `order_sim_...` IDs when live keys are absent. `verify` completes real Medusa orders for simulated payments when `ENABLE_PAYMENT_SIMULATION=true`. Guard exists, but is a single env-flag — a misconfiguration in production would enable free orders.
- **Recommended Fix:** Remove simulation code entirely from production, or add `process.env.NODE_ENV !== "production"` as an additional gate.
- **Effort:** Small

---

### SEC-005 — Missing Content-Security-Policy Header
- **Severity:** High | **Confidence:** High | **Category:** Security
- **Location:** [`letter-ink-frontend/next.config.ts`](file:///d:/Simplesphere/Projects/the_letter_ink_ecommerce/letter-ink-frontend/next.config.ts) lines 59–91
- **Evidence:** `securityHeaders` array has no `Content-Security-Policy`. Razorpay SDK is injected dynamically via `document.createElement("script")`. Google Fonts loaded via `<link>` in layout.
- **Impact:** No CSP means XSS has no secondary mitigation. The deprecated `X-XSS-Protection` header provides no real protection in modern browsers.
- **Recommended Fix:** Add `Content-Security-Policy: default-src 'self'; script-src 'self' https://checkout.razorpay.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; ...`
- **Effort:** Medium

---

### SEC-006 — No Rate Limiting on Checkout API Routes
- **Severity:** High | **Confidence:** High | **Category:** Security
- **Location:** `frontend/app/api/checkout/razorpay/create-order/route.ts`, `frontend/app/api/checkout/razorpay/verify/route.ts`
- **Evidence:** The auth proxy has `rateLimit(ip, 20, 60000)`. The Razorpay `create-order` and `verify` endpoints have zero rate limiting.
- **Impact:** Attacker can flood `create-order` to exhaust Razorpay API quotas, or enumerate orders via `track` at full network speed.
- **Recommended Fix:** Apply `rateLimit` helper: 10 req/minute on `create-order`, 5 req/minute on `verify`.
- **Effort:** Small

---

### SEC-008 — Critical MikroORM SQL Injection CVE in Transitive Dependencies
- **Severity:** Critical | **Confidence:** High | **Category:** Dependencies
- **Location:** `frontend/node_modules/@mikro-orm/core` (transitive via `@medusajs/medusa-js`)
- **Evidence:** `npm audit` result: `@mikro-orm/core <=6.6.10-dev.1` — Critical — "MikroORM is vulnerable to SQL Injection via specially crafted object" (GHSA-gwhv-j974-6fxm). Also: MikroORM Prototype Pollution (GHSA-qpfv-44f3-qqx6). No fix available from npm as of audit date.
- **Impact:** The frontend SDK calls the Medusa REST API (not ORM directly), limiting direct exploitability from the frontend. However, the backend also uses MikroORM for all database queries. If user-controlled input reaches ORM filter objects on the backend, SQL injection is possible.
- **Recommended Fix:** Update `@medusajs/medusa-js` and all `@medusajs/*` backend packages to latest released versions. Track Medusa security advisories. Treat as P0 until resolved.
- **Effort:** Medium

---

### DEP-001 — `@grpc/grpc-js` High-Severity Vulnerabilities (Backend)
- **Severity:** High | **Confidence:** High | **Category:** Dependencies
- **Location:** `letter-ink-backend/node_modules/@grpc/grpc-js`
- **Evidence:** `npm audit` backend: `@grpc/grpc-js 1.14.0-1.14.4` — High — unauthorized certificate authentication (GHSA-m9gg-hp2v-232j) and server error message leakage to clients (GHSA-f596-whhp-79r4). **Fix available.**
- **Recommended Fix:** `npm audit fix` in `letter-ink-backend`.
- **Effort:** Small

---

### PERF-001 — Unbounded Full-Table Order Scan in Order-Tracking Fallback
- **Severity:** High | **Confidence:** High | **Category:** Scalability
- **Location:** [`letter-ink-backend/apps/backend/src/api/store/orders/track/route.ts`](file:///d:/Simplesphere/Projects/the_letter_ink_ecommerce/letter-ink-backend/apps/backend/src/api/store/orders/track/route.ts) lines 79–101
- **Evidence:** "Strategy C" calls `query.graph({ entity: "order", fields: queryFields })` with **no filters and no limit**, fetching all orders with full joins. This path is reached for any non-numeric, non-`order_` order reference.
- **Impact:** 10,000 orders = guaranteed timeout; 100,000 orders = OOM/crash. This is a DoS vector — any request with a malformed order ID triggers it.
- **Recommended Fix:** Remove Strategy C entirely. Strategies A and B cover all valid real IDs. Add a dedicated indexed `short_code` column if suffix matching is genuinely needed.
- **Effort:** Small

---

### REL-001 — Medusa Cart Completion Failure Silently Swallowed
- **Severity:** High | **Confidence:** High | **Category:** Reliability
- **Location:** `verify/route.ts` lines 175–180
- **Evidence:** When `completeRes.ok` is false (lines 169–177), the code logs a warning and continues, returning `{ success: true, orderId: completedOrderId }` where `completedOrderId = "order_${Date.now()}"` — a fake ID. The customer gets a "success" response but no real Medusa order is created.
- **Impact:** Customer believes payment was accepted; no order appears in the Medusa admin; revenue is collected but untracked. This is a silent lost-order bug.
- **Recommended Fix:** Return a 500 error if `complete` returns non-OK; surface this to the customer with a retry instruction or support contact. Log the full cart state for reconciliation.
- **Effort:** Small

---

## D. Complete Findings Register

| ID | Severity | Category | Location | Summary |
|---|---|---|---|---|
| SEC-001 | Critical | Security/Secrets | `frontend/.env.local` | Razorpay keys committed to disk |
| SEC-007 | High | Security/Secrets | `backend/apps/backend/.env` | Backend JWT/cookie secrets tracked by git |
| SEC-002 | High | Security/Privacy | `backend/.../orders/track/route.ts` | Order-track returns full PII without mandatory contact |
| SEC-003 | High | E-commerce | `frontend/.../razorpay/verify/route.ts:225` | Payment amount not re-verified at confirmation |
| SEC-004 | High | Security | `frontend/.../razorpay/verify/route.ts:29` | Simulated payment bypass present |
| SEC-005 | High | Security | `frontend/next.config.ts:59` | Missing Content-Security-Policy |
| SEC-006 | High | Security | `frontend/app/api/checkout/razorpay/` | No rate limiting on checkout routes |
| SEC-008 | Critical | Dependencies | `frontend` transitive deps | MikroORM SQL injection CVE (no fix available) |
| DEP-001 | High | Dependencies | `backend` `@grpc/grpc-js` | Certificate auth bypass CVE (fix available) |
| DEP-002 | Medium | Dependencies | Backend transitive `lodash` | Code injection CVE (no fix) |
| DEP-003 | Medium | Dependencies | Frontend `@medusajs/medusa-js` | MikroORM prototype pollution |
| PERF-001 | High | Scalability | `backend/.../orders/track/route.ts:79` | Full-table order scan, no limit |
| PERF-002 | Medium | Scalability | `frontend/lib/commerce.ts:422` | productFilters fetches up to 100 products |
| PERF-003 | Medium | Scalability | `frontend/lib/rate-limit.ts` | In-memory rate limit resets on restart |
| ARCH-001 | Medium | Architecture | `frontend/next.config.ts:23` | `ignoreBuildErrors: true` hides type errors |
| ARCH-002 | Medium | Architecture | `frontend/app/api/order/track/route.ts:2` | `recentOrdersMap` import not exported by commerce.ts |
| ARCH-003 | Medium | Architecture | `frontend/lib/commerce.ts:530` | `cartGet` marked `"use cache"` risks stale cart |
| ARCH-004 | Info | Architecture | `frontend/app/checkout/checkout-form.tsx:35` | Client-side total for display only (not payment authority) |
| DB-001 | Medium | Database | Workshop migration | Missing unique index on `workshop.handle` |
| DB-002 | Medium | Database | CustomizationOption model | No index on `customization_option.product_id` |
| DB-003 | Medium | Database | All custom modules | No backup/PITR strategy documented |
| REL-001 | High | Reliability | `frontend/.../razorpay/verify/route.ts:175` | Cart completion failure silently swallowed |
| REL-002 | Medium | Reliability | Checkout flow | No idempotency key — duplicate cart completion risk |
| REL-003 | Info | Reliability | Checkout flow | No Razorpay webhook for async payment reconciliation |
| TEST-001 | Medium | Testing | Repo-wide | No payment/webhook unit or integration tests |
| TEST-002 | Medium | Testing | Repo-wide | No database transaction/concurrency tests |
| TEST-003 | Info | Testing | `frontend/e2e/checkout.spec.ts` | E2E only exercises simulation mode |
| OBS-001 | Medium | Observability | Repo-wide | No structured request IDs / correlation IDs |
| OBS-002 | Medium | Observability | Repo-wide | No error monitoring (Sentry or equivalent) |
| OBS-003 | Medium | Observability | Repo-wide | No health endpoint on Medusa backend |
| DEPLOY-001 | Medium | Deployment | `docker-compose.yml` | Redis has no volume — data lost on restart |
| DEPLOY-002 | Medium | Deployment | Repo-wide | No CI/CD pipeline |
| PRIV-001 | Medium | Privacy | `backend/.../orders/track/route.ts` | Full PII returned to unauthenticated callers |

---

## E. Scalability Assessment

### Bottlenecks

**PERF-001 (Critical):** The "Strategy C" full-table order scan in `/store/orders/track` is a single-query application-level DoS. Any order reference that doesn't match Strategies A/B triggers a full database dump. Remove it.

**PERF-002 (Medium):** `productFilters` fetches up to 100 products to compute the min/max price range. This cap silently produces incorrect bounds as the catalog grows and is expensive. Move to a SQL `MIN()/MAX()` aggregate.

**PERF-003 (Medium):** The in-memory `fallbackRateLimitMap` in `rate-limit.ts` is per-process. On Vercel (serverless), each cold-start resets counters. On multi-instance deployments, each instance has an independent counter. Upstash Redis is the intended solution but is currently optional.

### Scaling Posture
- Frontend scales horizontally on Vercel without code changes.
- Backend can scale horizontally if Redis is configured (event bus, locks). Without Redis, running multiple backend instances risks double-processing events.
- PostgreSQL connection pooling is not configured in the repo — default MikroORM settings apply. Tune via `DATABASE_URL` pool parameters for production.

---

## F. Security Assessment

### Confirmed Vulnerabilities
| Risk | Evidence |
|---|---|
| Secrets committed to repo | SEC-001, SEC-007 — directly observed in files |
| BOLA on order-track | SEC-002 — `contact` optional; PII returned without it |
| Simulated payment bypass | SEC-004 — code path verified in `verify/route.ts` |
| Missing CSP | SEC-005 — header not in `securityHeaders` array |
| No checkout rate limiting | SEC-006 — no `rateLimit` call in create-order or verify |
| MikroORM SQL injection CVE | SEC-008 — npm audit output confirms critical advisory |

### Conditional Risks
- **Payment amount manipulation (SEC-003):** Low monetary risk today (Razorpay charges the server-side amount), but introduces reconciliation gaps in race conditions.
- **Prototype pollution (DEP-003):** Exploitable only if user-controlled input reaches MikroORM filter objects — not confirmed in current code paths.

### Positive Security Controls
- ✅ HMAC-SHA256 Razorpay signature verification
- ✅ Server-side cart total used for Razorpay order amount
- ✅ `httpOnly`, `SameSite=lax`, `Secure` cart cookie
- ✅ Placeholder-secret guard at startup
- ✅ Production logger redacts sensitive keys
- ✅ Zod validation on all custom admin endpoints
- ✅ Medusa `authenticate()` middleware on all `/admin/*` routes
- ✅ CORS blocks localhost origins in production
- ✅ HSTS, X-Frame-Options, X-Content-Type-Options headers

---

## G. Database and Data Integrity Assessment

### Schema Quality

| Concern | Status |
|---|---|
| Primary keys | OK — CUID with module prefix (`wk_`, etc.) |
| Soft delete | OK — `deleted_at` column with partial index |
| Nullable fields | OK — optional fields marked `.nullable()` |
| Unique index on `workshop.handle` | MISSING — duplicate handles possible |
| FK on `customization_option.product_id` | MISSING — orphaned options on product delete |
| `blog/post.handle` unique index | Not verified (post model migration not inspected) |

### Transaction Safety
Cart completion in `verify/route.ts` performs 4 sequential HTTP calls to Medusa:
1. Update cart (customer + address)
2. Add shipping method
3. Create payment collection + session
4. Complete cart

Each is a separate HTTP request with no overarching transaction. A crash between steps 3 and 4 leaves the cart with a payment session but no completed order. Medusa's workflow engine handles step 4 atomically, but steps 1–3 are not atomic with step 4.

### Backup
No backup solution is configured in the repository. The `docker-compose.yml` uses a named Docker volume (`medusa-db-data`) for data persistence — this is not a backup. A single `docker volume rm` or host failure loses all data permanently.

---

## H. Testing and Build Results

| Check | Command | Result |
|---|---|---|
| Frontend npm audit | `npm audit --audit-level=high` | Critical: MikroORM SQL injection (GHSA-gwhv-j974-6fxm), no fix; Multiple highs |
| Backend npm audit | `npm audit --audit-level=high` | High: @grpc/grpc-js (fix available); High: lodash (no fix) |
| Frontend unit tests | Not run | Not executed (dev server running) |
| Backend integration tests | Not run | Not executed |
| E2E tests | Not run | Not executed (require live services) |
| TypeScript build | Blocked — `ignoreBuildErrors: true` | Type errors unverifiable |
| Biome lint | Not run | Not executed |

**Note on E2E tests:** `checkout.spec.ts` only exercises simulation mode ("Simulate Success" button) and does not test real Razorpay payment flows, webhook delivery, or failure scenarios.

---

## I. Production Deployment Checklist

### Security (P0/P1)
- [ ] Rotate all Razorpay API keys immediately (SEC-001)
- [ ] Rotate backend JWT_SECRET, COOKIE_SECRET, AUTH_MFA_ENCRYPTION_KEY (SEC-007)
- [ ] Remove `.env` and `.env.local` from git history (BFG/git-filter-repo)
- [ ] Add `.env` and `.env.local` to respective `.gitignore` files
- [ ] Add `Content-Security-Policy` header (SEC-005)
- [ ] Make order-tracking `contact` field mandatory (SEC-002)
- [ ] Apply rate limiting to checkout API routes (SEC-006)
- [ ] Set `ENABLE_PAYMENT_SIMULATION` to `false` or unset in production (SEC-004)
- [ ] Configure HTTPS/TLS on all production endpoints
- [ ] Set `NEXT_PUBLIC_URL` to the production domain

### Infrastructure
- [ ] Set `REDIS_URL` to a persistent, authenticated Redis instance
- [ ] Add Redis volume to `docker-compose.yml` (DEPLOY-001)
- [ ] Configure Upstash Redis for frontend rate limiting (PERF-003)
- [ ] Set up automated PostgreSQL backups with PITR (DB-003)
- [ ] Configure PostgreSQL connection pooling
- [ ] Set `NODE_ENV=production`

### Payment
- [ ] Switch to Razorpay live keys
- [ ] Configure Razorpay webhook endpoint; implement server-side signature verification
- [ ] Test payment success, failure, and timeout in staging
- [ ] Fix REL-001: Return error when Medusa cart completion fails
- [ ] Fix SEC-003: Re-fetch Razorpay order amount in verify endpoint

### Database
- [ ] Run all migrations on production PostgreSQL
- [ ] Add unique index on `workshop.handle` (DB-001)
- [ ] Verify hardcoded shipping option ID exists in production database

### Code
- [ ] Remove `typescript: { ignoreBuildErrors: true }` (ARCH-001)
- [ ] Fix `recentOrdersMap` export/import mismatch (ARCH-002)
- [ ] Remove PERF-001 all-orders scan fallback (Strategy C)
- [ ] Run `npm audit fix` in backend (fixes gRPC CVE — DEP-001)

### Observability
- [ ] Integrate Sentry (or equivalent) on frontend and backend (OBS-002)
- [ ] Add `/health` endpoint to Medusa backend (OBS-003)
- [ ] Add request correlation IDs to API responses (OBS-001)
- [ ] Set up alerts for payment failures and 5xx error spikes

---

## J. Prioritized Remediation Roadmap

### P0 — Immediate Blockers

| Finding IDs | Action | Effort |
|---|---|---|
| SEC-001, SEC-007 | Rotate all exposed credentials; purge from git history; update gitignore | Small |
| SEC-008, DEP-001 | `npm audit fix` backend; update all `@medusajs/*` packages | Medium |
| PERF-001 | Remove Strategy C (full-order scan) from order-track endpoint | Small |
| REL-001 | Return 500 (not 200) when Medusa cart completion fails | Small |

### P1 — Before Going Live with Real Payments

| Finding IDs | Action | Effort |
|---|---|---|
| SEC-002 | Mandatory contact field; restrict PII returned | Small |
| SEC-003 | Re-fetch Razorpay order for amount reconciliation | Small |
| SEC-004 | Remove simulation code or add `NODE_ENV` guard | Small |
| SEC-005 | Add Content-Security-Policy header | Medium |
| SEC-006 | Rate limit checkout API routes | Small |
| ARCH-001 | Remove `ignoreBuildErrors: true` | Medium |
| ARCH-002 | Fix `recentOrdersMap` export mismatch | Small |
| DEPLOY-001 | Persistent Redis volume + Upstash for rate limiting | Small |

### P2 — Near-Term Improvements

| Finding IDs | Action | Effort |
|---|---|---|
| DB-001, DB-002 | Unique index on `workshop.handle`; index on `product_id` | Small |
| DB-003 | Automated PostgreSQL backup + restore testing | Medium |
| REL-003 | Implement Razorpay webhook receiver | Medium |
| OBS-001, OBS-002 | Correlation IDs; Sentry integration | Medium |
| OBS-003 | Add `/health` endpoint to backend | Small |
| ARCH-003 | Remove `"use cache"` from `cartGet` | Small |
| TEST-001 | Add payment HMAC and cart operation unit tests | Medium |

### P3 — Ongoing

| Finding IDs | Action | Effort |
|---|---|---|
| PERF-002 | SQL aggregate for price range | Medium |
| DEP-002 | Track/replace lodash when fix available | Large |
| DEPLOY-002 | Add CI/CD pipeline with lint/test/build gates | Medium |
| PRIV-001 | DPDP Act compliance: consent management, data deletion | Large |

---

## K. Questions and Unverified Assumptions

1. **Git history for secrets:** Whether `.env` and `.env.local` appear in any past commit requires `git log --all -- ".env"` locally.
2. **Razorpay key type:** The committed key starts with `rzp_test_`. Confirm no live `rzp_live_` keys are anywhere in the repo.
3. **Medusa exact version:** Not visible in backend `package.json`. Confirm installed `@medusajs/medusa` version to scope CVE impact.
4. **Redis in production:** Whether Upstash or a managed Redis is planned — in-memory rate limiting is ineffective on serverless.
5. **Razorpay webhook configuration:** No webhook receiver exists in the codebase. Confirm whether a webhook is configured in the Razorpay dashboard.
6. **Hosting platform:** Backend hosting is unspecified; deployment process is unknown.
7. **Database backup:** Whether any backup solution (pg_dump cron, managed DB PITR) exists outside the repository.
8. **DPDP Act compliance:** Operating in India requires a user data deletion endpoint — not present in the codebase.
9. **Hardcoded shipping option ID:** `verify/route.ts` falls back to `so_01M3415J8WVJ6WQK0J1856EEZS` if no shipping option is found. This ID must exist in the production database or cart completion will fail silently.
10. **CSP + Razorpay script compatibility:** Adding a CSP may break the dynamically injected Razorpay checkout.js. Nonce or hash-based allowlisting will be required.
