# Complete Codebase Audit — The Letter Ink E‑Commerce

**Production Readiness, Security, Scalability & Reliability**

**Audit mode:** Read‑only. No application code, config, dependencies, schemas, or deployment files were modified. Only safe read‑only inspection and non‑destructive build/lint/test commands were run.

**Scope covered:** Repository root; `letter-ink-backend` (Medusa v2 monorepo app: config, modules, API routes, migrations/seed, scripts, admin extensions, tests, integration-tests); `letter-ink-frontend` (Next.js 16 App Router: app routes, API routes, lib, cart/checkout/payment flows, tests, config); docker-compose; git status/history; package manifests and lockfiles; `.env` files (variable names only — values not reproduced); dependency audits.

**Not covered / deferred:** Live database inspection, load testing, runtime behavior against a running stack, production hosting dashboards, Razorpay dashboard state, third‑party service behavior. These are listed in Section K.

---

## A. Executive Summary

### What the application is

A single‑merchant Indian e‑commerce storefront ("The Letter Ink" — artisanal calligraphy & bespoke stationery, INR) consisting of two apps:

| Component | Technology |
|---|---|
| Backend | **Medusa v2.21.0** (`@medusajs/medusa`), Node 20/22+, PostgreSQL 15, TypeScript, file‑based API routes, custom modules (`workshop`, `customizations`, `blog`), Jest |
| Frontend | **Next.js 16.3.4** (App Router, `cacheComponents`, React 19, React Compiler, Turbopack), React Query, Radix/Tailwind 4, Biome, bun:test + Playwright |
| Payments | **Razorpay** (Order API + Checkout.js + HMAC signature verification), no webhook handler |
| Infra | `docker-compose.yml` (Postgres + Redis only), no CI/CD workflows, no app containerization |
| Auth | Medusa admin auth (JWT/session/bearer/api‑key via middleware); **no shopper accounts in this app** (guest checkout; `/account` proxied to platform) |

### Overall production‑readiness assessment

**Not ready for production.** This is not a judgment call about code style — the application **cannot currently build or pass its own tests on either side**, and the payment + order‑tracking paths contain serious integrity and data‑exposure defects.

Verified blockers (commands and outputs in Section H):

1. **Frontend production build fails** — stale import breaks compilation.
2. **Backend production build fails** — TypeScript errors.
3. **Backend unit suite fails; multiple frontend tests fail.**
4. **No CI exists** to catch any of the above (no `.github/workflows` in the repo).

Most important risks (detail in Section C):

- **Customer order + PII disclosure** through the order‑tracking endpoints (contact verification is optional, `display_id` is sequential, and one fallback path scans the whole orders table).
- **Payment integrity gaps**: verification fails open if the secret is missing; no webhook/reconciliation; a payment that succeeds but fails cart‑completion silently produces a **fabricated order ID that exists nowhere**.
- **A critical Next.js advisory affects the installed version**, and `next/og` is actively used.
- Rate limiting is per‑instance/in‑memory and skipped on localhost‑resolving IPs; horizontal scaling would weaken it further.

Key architectural constraints:

- Business logic sits in route handlers rather than workflows (74 Medusa lint warnings, many `no-service-mutations-in-api-route`).
- Order‑tracking logic is **duplicated** across backend and frontend with divergent behavior.
- Custom module tables lack indexes, unique constraints, and foreign keys.
- Workshops have **no seat/capacity enforcement** (`spots_text` is display text only) — overselling is possible.
- No Redis wiring for Medusa despite `REDIS_URL` (build logs *"redisUrl not found. A fake redis instance will be used."*).

**Verified vs unknown:** Everything in Sections C–H is backed by code citations or command output. Deployment/monitoring/backups/PCI/consistency items that cannot be proven from the repository are explicitly marked *(verify)* or moved to Section K. No percentage readiness score is given — there is no defined, evidence‑backed methodology for one.

---

## B. Architecture Overview

### Main components

```
Browser
  │
  ▼
letter-ink-frontend (Next.js 16, port 3000)
  ├─ app/**            Server components + "use cache" pages
  ├─ app/api/checkout/razorpay/{create-order,verify}   ← payment BFF routes
  ├─ app/api/order/track                                ← order lookup proxy
  ├─ app/api/auth/[...all]                              ← auth passthrough (rate-limited)
  ├─ lib/commerce.ts    Commerce API client (medusaClient + raw fetch)
  ├─ lib/rate-limit.ts  Upstash (if configured) else in-memory Map
  └─ proxy.ts           Rewrites /account, /api/chat, /api/feed/*, /_public/* to platform apex
  │
  ▼  (x-publishable-api-key header)
letter-ink-backend (Medusa v2, port 9000)
  ├─ src/api/middlewares.ts   rate limiters + authenticate() on /admin/*
  ├─ src/api/store/*          custom public endpoints (workshops, blogs, campaigns,
  │                           carts/line-items/custom, orders/track)
  ├─ src/api/admin/*          CRUD for workshops/blogs/videos/customizations
  ├─ src/modules/{workshop,customizations,blog}   custom modules (model+service)
  ├─ src/migration-scripts/initial-data-seed.ts   region/shipping/products seed
  └─ src/scripts/*            ad-hoc seeds/utilities (not production paths)
  │
  ▼
PostgreSQL 15 (docker-compose, 127.0.0.1:5433)   Redis (defined, not wired to Medusa)
External: Razorpay API (api.razorpay.com), Razorpay Checkout.js (CDN),
          Google/Unsplash/Pexels/Vercel-blob images, platform apex services (analytics/account)
```

### Important request/data flows

**Purchase lifecycle (the critical path):**

1. `AddToCartButton.handleSubmit` → server action `addToCart` → `commerce.cartUpsert` → Medusa `/store/carts` (or `/store/carts/:id/line-items/custom` for workshops/custom‑priced items).
2. `/checkout` → `handleLaunchRazorpay` → `POST /api/checkout/razorpay/create-order` — **server fetches the cart and derives the amount from `cart.total`** (good: client amount is not trusted for charging).
3. Razorpay Checkout.js `handler` → `POST /api/checkout/razorpay/verify` — HMAC‑SHA256 over `order_id|payment_id` **if** `RAZORPAY_KEY_SECRET` is set; then updates cart, adds shipping method, creates payment collection/session (`pp_system_default`), calls `/store/carts/:id/complete`, returns an order ID, clears the cart cookie.
4. Order lookup via `/api/order/track` → backend `/store/orders/track`.

**Notable flows outside the core:** blog/studio‑video content (custom module, admin CRUD), workshops (custom module sold as pseudo line items with server‑set `unit_price`), product customizations (custom module linked by plain `product_id` text), campaigns/promotions (Medusa Promotion module).

### External services & integrations

Razorpay (payments), Medusa core modules (cart/order/promotion/fulfillment/inventory/tax), platform apex (account/auth/analytics per `proxy.ts` and `instrumentation-client.ts`), image hosts, Upstash (optional, apparently unconfigured).

### Strengths

- Appropriate stack for current scale (modular monolith; **no microservices needed**).
- Real security guards in `medusa-config.ts:5–24`: placeholder‑secret rejection and production localhost‑CORS rejection.
- Admin routes globally guarded by `authenticate("user", ["session","bearer","api-key"])` (`src/api/middlewares.ts:44–45`) — this must be re‑verified per route only if routes are added outside `/admin/*`.
- Cart cookie is `httpOnly`, `secure` in production, `sameSite=lax` (`lib/cookies.ts:9–14`).
- Payment amount is recomputed server‑side from the cart (`create-order/route.ts:31–54`).
- Zod validation on several custom endpoints (`src/api/common/validation.ts`).
- Good documented conventions (`AGENTS.md` both apps), render‑shell and WCAG contrast test gates.

### Constraints / weaknesses

See Sections C–G. Summary: logic in handlers not workflows, duplication, stub "fake success" APIs, missing pagination/indexing, no CI, broken builds.

---

## C. Critical and High‑Severity Findings

### SEC‑001 — Order tracking discloses full order + customer PII without verification

**Severity:** Critical · **Confidence:** High · **Category:** Security (Broken access control / BOLA / OWASP API1, API2) · **Effort:** Small–Medium

**Location:**

- `letter-ink-backend/apps/backend/src/api/store/orders/track/route.ts:54–139`
- `letter-ink-frontend/app/api/order/track/route.ts:41–169`

**Evidence:**

- Contact verification runs **only when the caller supplies a contact** (`orders/track/route.ts:111–139` → `if (contact && contact.trim())`; frontend `route.ts:153` → `if (trimmedContact && hasOrderContact)`). Send no contact → no check → response.
- The response returns the matched order with fields including `email`, `customer.*`, `shipping_address.*`, `billing_address.*`, `items.*`, `fulfillments.labels.*` (`queryFields`, lines 27–49), i.e. full name/address/phone/email, line items and totals.
- Lookup accepts `display_id` (lines 54–63), which is **sequential and low‑entropy** (1, 2, 3 …). Strategy C (lines 78–101) additionally matches on the **last 6 characters of the order ID** and case‑insensitive ID equality — a much smaller keyspace than the full ULID.
- The frontend proxy repeats the same optional‑contact logic and adds a fallback `GET /store/orders/:id` (frontend `route.ts:80–98`).

**Impact:** Anyone can enumerate order references (e.g., `1`, `2`, `3` … or 6‑character ID suffixes) and retrieve every customer's email, phone, address, items and payment status. This is direct‑object‑reference exposure of PII at scale — for an Indian e‑commerce operation it also implicates the DPDP Act 2023 reasonable‑security expectation (legal review required; not a compliance verdict).

**Reproduction (safe):** `POST /store/orders/track` with body `{"reference":"1"}` and **no** `contact`, against a seeded database. Observe a 200 with a full order payload. Repeat with `2`, `3`, ….

**Recommended fix:** Make verification mandatory (email **or** phone required and matched) for any order payload; restrict returned fields to what the UI needs; replace Strategy C with an exact indexed lookup; rate‑limit this endpoint per IP; consider a signed one‑time link emailed to the customer.

**Dependencies:** Pairs with PERF‑001 (same route's full‑table scan) and PRIV‑001.

---

### BLD‑001 — Frontend production build fails

**Severity:** High · **Confidence:** High · **Category:** Reliability/Deployment · **Effort:** Small

**Location:** `letter-ink-frontend/app/api/order/track/route.ts:2`

**Evidence:** `npx next build` fails:

```
Error: Export recentOrdersMap doesn't exist in target module
./app/api/order/track/route.ts:2:1  import { mapMedusaOrderToStorefront, recentOrdersMap } from "@/lib/commerce";
Did you mean to import storeRecentOrder?
```

`lib/commerce.ts:123–127` replaced the cache with a documented no‑op (`storeRecentOrder`), but `recentOrdersMap` is still imported and used at `route.ts:105–127`.

**Impact:** No deployable frontend build. (The stale in‑memory order cache was itself removed for good reasons — see SEC‑003 — so the fix is to delete the `recentOrdersMap` code paths, not restore the map.)

**Reproduction:** `cd letter-ink-frontend && npx next build`.

---

### BLD‑002 — Backend production build fails

**Severity:** High · **Confidence:** High · **Category:** Reliability/Deployment · **Effort:** Small

**Location:** `letter-ink-backend/apps/backend/src/scripts/seed-promotions.ts:23–42, 62–82`

**Evidence:** `npm run build` → `warn: Backend build completed with errors (9.08s)`; TS2769 errors: `createPromotions(...)` requires `status` in `CreatePromotionDTO` (Medusa 2.21 types) — property missing in both promotion payloads.

**Impact:** The backend cannot be built/deployed as-is.

**Reproduction:** `cd letter-ink-backend/apps/backend && npm run build`.

---

### SEC‑002 — Payment verification fails open when `RAZORPAY_KEY_SECRET` is missing

**Severity:** High · **Confidence:** High · **Category:** Security (Authentication of payment callback) · **Effort:** Small

**Location:** `letter-ink-frontend/app/api/checkout/razorpay/verify/route.ts:44–67`

**Evidence:**

```ts
const isLiveConfigured = Boolean(keySecret && !keySecret.includes("placeholder") && razorpay_signature && !isSimulated);
if (isLiveConfigured) { /* HMAC check */ }
// ← no else: verification is skipped entirely
```

If `RAZORPAY_KEY_SECRET` is unset/placeholder in the deployment environment, the handler proceeds straight to completing the order — with **no signature check and no Razorpay API confirmation**.

**Impact:** In that configuration, an unauthenticated caller can POST fabricated `razorpay_*` fields and drive `POST /store/carts/:id/complete`, creating real orders without payment.

**Conditional** on environment configuration — but the code's default is unsafe (fail‑open), and env verification is in Section K.

**Recommended fix:** Fail closed — if the secret is absent, return 500. Never treat "not configured" as "trusted."

---

### SEC‑003 — Payment can succeed while order creation silently fails, with fabricated order IDs and no recovery

**Severity:** High · **Confidence:** High · **Category:** Reliability/Financial integrity · **Effort:** Medium

**Location:** `letter-ink-frontend/app/api/checkout/razorpay/verify/route.ts:69, 168–184, 227–272`

**Evidence:**

- `let completedOrderId = \`order_${Date.now()}\`` (line 69) — a **fake ID** used if Medusa completion fails.
- Cart completion is wrapped in `try/catch` that only `logger.warn`s (lines 182–184) and logs a non‑OK response (line 180), then continues.
- The response to the browser (lines 268–272) still returns `success: true` with that fabricated ID; the "order success" page is rendered from a client‑supplied payload (`storeRecentOrder(formattedOrder)` is a **no‑op**, `lib/commerce.ts:125–127`), so `/order/success/<fake-id>` cannot be reloaded from the backend afterward.
- No idempotency key: a repeated `verify` POST re‑runs cart completion.

**Impact:** Customer is charged by Razorpay but no (or a duplicate/stale) order exists in Medusa; no inventory movement, no fulfillment, no record to reconcile against; the success page reference is dead on refresh. Silent financial/data‑integrity failure.

**Recommended fix:** On payment success + completion failure: persist a durable "paid, order-pending" record keyed by `razorpay_payment_id`, retry completion, alert operations; return the real order ID or an explicit pending state; make `verify` idempotent per `razorpay_payment_id`.

---

### SEC‑004 — No Razorpay webhook; the browser callback is the sole order trigger

**Severity:** High · **Confidence:** High · **Category:** Security/Reliability (payment integration) · **Effort:** Medium

**Location:** entire repo — no webhook route exists (grep for webhook/razorpay handlers returns only `create-order` and `verify` routes).

**Evidence:** Order creation happens only inside the client‑initiated `verify` route. There is no server‑to‑server `payment.captured` handler, no signature check of webhook payloads, no replay protection, and no reconciliation job between Razorpay transactions and Medusa orders.

**Impact:** Lost orders on browser close/network failure after payment; no independent detection of paid‑but‑unfulfilled orders; no defense against out‑of‑order/duplicate events because none are consumed. This fails the audit requirement that the system must not rely on client redirects for transaction confirmation — the *amount* is server‑derived (good) but *order finalization* is entirely client‑triggered.

**Recommended fix:** Implement `/api/webhooks/razorpay` (HMAC verification + `x-razorpay-signature`, idempotent store keyed by payment ID), and a daily reconciliation job.

---

### SEC‑005 — Installed Next.js version matches a critical RCE advisory; `next/og` is in use

**Severity:** High · **Confidence:** Medium · **Category:** Security/Supply chain · **Effort:** Small (upgrade) + regression testing

**Evidence:** `npm audit --omit=dev` (frontend):

```
next  16.2.0 - 16.3.5   Severity: critical
Next.js: Remote Code Execution in next/og ImageResponse
https://github.com/advisories/GHSA-vcvr-r3jv-pc5j
fix available via `npm audit fix --force` → next@16.3.8
21 vulnerabilities (5 moderate, 14 high, 2 critical)
```

Installed: `next@16.3.4` (inside the vulnerable range). `app/product/[slug]/opengraph-image.tsx:5` imports `ImageResponse` from `next/og` — the affected component is on an active code path (product OG images).

**Impact:** Known critical vulnerability in a served code path. **Exploitability depends on how user‑controlled input reaches `ImageResponse`** — not demonstrated here, hence Medium confidence.

**Recommended fix:** Upgrade to ≥16.3.8 after running the build/test/shell checks; re‑run `npm audit`.

---

### PERF‑001 — Order tracking scans the entire orders table with all relations per request

**Severity:** High · **Confidence:** High · **Category:** Scalability/Performance · **Effort:** Medium

**Location:** `letter-ink-backend/apps/backend/src/api/store/orders/track/route.ts:78–101`

**Evidence:** Strategy C executes `query.graph({ entity: "order", fields: [...] })` with **no filters and no pagination**, loading every order (with `customer.*`, `shipping_address.*`, `items.*`, `fulfillments.*`, `variant.product.*`) into memory, then loops in JS matching 6‑char suffixes.

**Impact:** As orders grow to tens of thousands, every unmatched tracking lookup becomes a multi‑MB, multi‑second query — easily triggered repeatedly by an anonymous caller (also a DoS amplifier; combined with SEC‑001 it makes enumeration cheap).

**Fix:** Delete Strategy C; exact match on `display_id`/`id` only, both of which are indexed in Medusa core.

---

### TEST‑001 — No CI/CD at all

**Severity:** High · **Confidence:** High · **Category:** Testing/Deployment · **Effort:** Medium

**Evidence:** No `.github/workflows` anywhere in the repo (searched, only `node_modules` matches). Frontend relies solely on a husky `pre-commit` → lint‑staged hook (per `AGENTS.md`); that hook runs only when TypeScript files are staged. Backend has no hooks. The broken builds above (BLD‑001/002) and failing tests passed through this repo untouched; `git log` shows recent commits "Security bugs", "bugs fix".

**Impact:** Broken artifacts and failing suites reach the mainline undetected — the exact state observed today.

**Fix:** Add a CI workflow: backend `lint + test:unit + build`; frontend `biome check + tsc --noEmit + bun test + next build`; fail the pipeline on any of them.

---

### DEP‑001 — No application deployment configuration

**Severity:** High · **Confidence:** High · **Category:** Deployment · **Effort:** Medium

**Location:** `docker-compose.yml`

**Evidence:** Compose defines only `postgres` and `redis`. No app service, no Dockerfile for either app in the compose context (backend has a `.dockerignore` only), no healthcheck, no restart policy, no resource limits.

**Impact:** There is no reproducible way to run/deploy the application as infrastructure‑as‑code from this repository; restart behavior, resource exhaustion, and zero‑downtime are all undefined.

**Fix:** Add app images/services, healthchecks, restart policies, resource limits; document the chosen hosting path.

---

## D. Complete Findings Register

| ID | Sev | Category | Location | Summary |
|---|---|---|---|---|
| SEC‑001 | **Critical** | Security | `backend .../store/orders/track/route.ts:54–139`; `frontend app/api/order/track/route.ts:41–169` | Order+PII disclosure; contact check optional; enumerable `display_id`; full‑table scan fallback |
| BLD‑001 | High | Reliability | `frontend app/api/order/track/route.ts:2` | Production build fails: `recentOrdersMap` import no longer exists |
| BLD‑002 | High | Reliability | `backend src/scripts/seed-promotions.ts:23,62` | Production build fails: TS errors (missing `status`) |
| SEC‑002 | High | Security | `frontend .../razorpay/verify/route.ts:44–67` | Signature verification fails open when secret absent |
| SEC‑003 | High | Reliability | `frontend .../razorpay/verify/route.ts:69,168–184` | Paid‑but‑unfulfilled orders; fabricated order IDs; no idempotency |
| SEC‑004 | High | Security/Reliability | repo‑wide (no webhook route) | No Razorpay webhook/reconciliation; client‑triggered finalization |
| SEC‑005 | High | Security | `letter-ink-frontend/package.json` + `opengraph-image.tsx:5` | `next@16.3.4` in critical RCE advisory range; `next/og` used |
| PERF‑001 | High | Scalability | `backend .../orders/track/route.ts:78–101` | Unbounded full‑order scan with all relations per request |
| TEST‑001 | High | Testing | repo‑root | No CI workflows; failing builds/tests undetected |
| DEP‑001 | High | Deployment | `docker-compose.yml` | Only Postgres+Redis; no app service, healthcheck, restart policy, or image |
| TEST‑002 | High | Testing | `backend integration-tests/` | Integration suites declared in `package.json` but only `setup.js` exists — no spec files |
| PRIV‑001 | High | Privacy | (see SEC‑001) | Order PII readable without verification |
| SEC‑006 | Medium | Security | `backend src/api/middlewares.ts:15–31` | Rate limiters skipped for localhost‑resolving IPs; in‑memory store; trust‑proxy unverified |
| SEC‑007 | Medium | Security | `frontend .../create-order/route.ts:70–130` | Falls back to simulated order ID with `success:true` when Razorpay API fails/unconfigured |
| SEC‑008 | Medium | Security | `frontend lib/rate-limit.ts:8–20,37–52` | In‑memory fallback Map (Upstash unconfigured in env examples); unbounded growth, per‑instance, lost on restart |
| SEC‑009 | Medium | Security | `backend .../store/campaigns/active/route.ts:30–35` | Active promo **codes** returned to unauthenticated clients (sibling route deliberately strips them) |
| SEC‑010 | Medium | Security | `frontend .../verify/route.ts:188–260`; `lib/commerce.ts:94,516–520` | Client‑supplied `amount`/`custom_unit_price` accepted for displayed totals (charge is server‑derived — display integrity only) |
| SEC‑011 | Medium | Security | `backend .../store/carts/[id]/line-items/custom/route.ts:9` | `req.body as any` — no server‑side validation of `quantity`/`metadata` shape |
| ARC‑001 | Medium | Architecture | backend + frontend track routes | Order tracking duplicated (~150 lines) with divergent logic |
| ARC‑002 | Medium | Architecture | 74 Medusa lint warnings (`no-service-mutations-in-api-route`, etc.) | Mutations in route handlers instead of workflows; magic strings |
| ARC‑003 | Medium | Architecture | `lib/commerce.ts:277–279,728–739` | Stub APIs (`subscriberCreate`, `contactMessageCreate`, `productReviewCreate`, reviews) return fake success |
| ARC‑004 | Medium | Reliability | `app/contact/action.ts:28–34` → `commerce.ts:731–733` | Contact/newsletter submissions silently discarded after showing success |
| PERF‑002 | Medium | Scalability | `store/blogs`, `store/blog-videos`, `store/campaigns`, `store/workshops` | No pagination/`take` on any custom list endpoint |
| PERF‑003 | Medium | Scalability/Correctness | `lib/commerce.ts:295–311` | Workshop filtering after fetch → wrong `meta.count`, broken paging |
| PERF‑004 | Medium | Scalability | `medusa-config.ts` (no Redis config); build log "fake redis instance" | No shared cache; express‑rate‑limit memory store; not replica‑safe |
| PERF‑005 | Medium | Reliability | `lib/commerce.ts:481–493` | `cartGet` marked `"use cache"` — stale cart/price risk |
| DB‑001 | Medium | Database | `modules/*/models/*.ts` | No indexes on `product_id`, `handle`, `status` lookup columns |
| DB‑002 | Medium | Database | `modules/*/models/*.ts` | No unique constraints (duplicate `handle`/`product_id` allowed) |
| DB‑003 | Medium | Database | `customizations/models/customization.ts:5,19`; `workshop.ts:6` | Plain text `product_id` with no FK → orphans on product deletion |
| DB‑004 | Medium | Database | `workshop/models/workshop.ts:12–13` | Money as float `number`; `spots_text` display‑only → **no seat capacity, overselling possible** |
| DB‑005 | Medium | Database | `admin/.../customizations/options/route.ts:56–83` | Multi‑step delete without a transaction → partial failure leaves orphans |
| DB‑006 | Medium | Database | `docker-compose.yml` | No backup/restore job or documented procedure *(verify infra)* |
| DEP‑002 | Medium | Deployment | `medusa-config.ts:25–35` | Only placeholder/CORS env guards; `DATABASE_URL`/CORS presence unchecked at startup |
| DEP‑003 | Medium | Deployment | repo | No health/readiness endpoint (custom), no graceful‑shutdown/zero‑downtime docs *(verify)* |
| DEP‑004 | Medium | Deployment | repo | No metrics/alerts/log aggregation/error monitoring in repo *(verify platform)* |
| TEST‑003 | Medium | Testing | `frontend e2e/checkout.spec.ts:66–71` | Critical payment assertions wrapped in `if (visible)` — pass vacuously |
| TEST‑004 | Medium | Testing | `backend .../custom/__tests__/route.unit.spec.ts` | Mocks the entire workflow; currently **stale/failing** (expects `unit_price` no longer sent) |
| TEST‑005 | Medium | Testing | `frontend` `bun test` results | DOM tests run without jsdom (`document is not defined`); Playwright spec executed by bun runner; `describe` undefined in theme test |
| PRIV‑002 | Medium | Privacy | `frontend app/` routes | No privacy/terms/refund/shipping policy pages detected in app routes — required for an Indian consumer store *(legal review)* |
| PRIV‑003 | Medium | Privacy | repo | No user data export/deletion mechanism (no shopper accounts locally; platform account zone is external) *(verify)* |
| ARC‑005 | Low | Architecture | `test-cart.ts`, `scripts-archive/`, root `*.log`, `camp.md` | Dead/dev artifacts in tree; log files at repo root |
| ARC‑006 | Low | Architecture | `frontend next.config.ts:22–24` | `typescript.ignoreBuildErrors: true` disables type gating |
| PERF‑006 | Low | Scalability | `lib/commerce.ts:372–410` | Price‑histogram computed from up to 100 full products per request |
| SEC‑012 | Low | Security | `MASTER_SECURITY_AUDIT.md:189` (tracked) | Prior audit doc committed the Razorpay test key ID it instructs removing; `.env*` files correctly gitignored (verified) |
| SEC‑013 | Low | Security | `backend .../orders/track/route.ts:147–150`; cart route `:47–49` | Internal `error.message` returned to API clients |
| DEP‑005 | Low | Deployment | repo | No migration step in any deploy pipeline; migrations manual (`medusa db:migrate`) |
| TEST‑006 | Low | Testing | `frontend biome.json:2` vs CLI 2.5.12 | Config/CLI schema mismatch; 2,590 errors + 1,258 warnings reported |
| POS‑001 | Info | Architecture | `medusa-config.ts:5–24`, `middlewares.ts:44–45`, `lib/cookies.ts` | Positive controls verified: secret guards, CORS guard, admin auth, httpOnly cart cookie, server‑derived charge amount |

---

## E. Scalability Assessment

**Current bottlenecks (in impact order):**

1. **Order tracking (PERF‑001 + SEC‑001)** — a single anonymous endpoint loads all orders with all relations when exact lookup misses. O(N) memory and latency per request, trivially repeatable. This fails first as order count grows.
2. **No pagination on custom list endpoints (PERF‑002)** — `listPosts({status:"published"})`, `listCampaigns({})` (twice: `store/campaigns` then JS date filtering; `store/campaigns/active` additionally loads `promotions` for every campaign), `listAndCountWorkshops`. Responses grow linearly forever; blogs/videos load **all** posts to filter in JS (`isStudioVideo`).
3. **Frontend list flows fetch‑then‑filter (PERF‑003)** — `productBrowse` pulls `limit:20`, drops workshops client‑side, and reports `meta.count = physicalProducts.length` (the filtered page size), so paging math is wrong; `workshopBrowse` fallback pulls `limit:100`; `productFilters` recomputes price histograms from up to 100 products with all variant prices on each request.
4. **No shared state for multi‑instance operation (PERF‑004, SEC‑006, SEC‑008)** — Medusa runs with a fake in‑memory Redis (`redisUrl not found` build log) despite `REDIS_URL` in `.env`; `express-rate-limit` uses its process‑local store; frontend rate limiter falls back to a `Map`. Running 2+ replicas **divides** every rate limit by replica count and makes cache/rate state inconsistent. JWTs are stateless (good), cart cookie is client‑side (good) — those parts do scale horizontally.
5. **`cartGet` caching (PERF‑005)** — `"use cache"` without visible `cacheLife` risks serving stale totals/prices; stale price data then flows to the checkout display.
6. **Blocking third‑party work in request paths** — Razorpay order creation and multiple sequential Medusa calls inside `verify` (cart update → shipping options → shipping method → payment collection → payment session → complete = up to **6 sequential HTTP hops**, each without an explicit timeout in this code — `AbortSignal.timeout` is used elsewhere in `commerce.ts` but not in the verify route).

**What would be needed as usage grows:**

- Replace the track scan with indexed exact lookups; add pagination (`take`/`offset`) with caps to all list endpoints; move filtering server‑side (count with the same filter).
- Wire real Redis to Medusa + Upstash/Redis for both rate limiters; set `trust proxy` correctly behind the load balancer.
- Introduce the webhook (SEC‑004) so payment processing is not coupled to browser sessions, plus a queue for retries.
- Add DB indexes (Section G), then measure. **No throughput claims are made: there is no load‑test evidence in the repo.**

**Multiple instances:** safe only for the stateless parts today; rate limiting and any in‑memory map (including the vestigial `recentOrdersMap` code still in `order/track`) are per‑instance.

---

## F. Security Assessment

### Confirmed defects (exploitable as written)

- **SEC‑001** order/PII disclosure (Critical) — traced end‑to‑end; no upstream middleware compensates: `/store/*` only has a rate limiter (`middlewares.ts:39–42`), no authentication.
- **SEC‑003/004** payment finalization integrity (High).
- **BLD‑001/002** release blockers.

### Conditional risks (depend on config/deployment)

- **SEC‑002** fail‑open verification if `RAZORPAY_KEY_SECRET` missing/placeholder.
- **SEC‑007** `create-order` returns `success:true` with `order_sim_*` whenever the live Razorpay call fails or keys are placeholders. Guarded downstream by `ENABLE_PAYMENT_SIMULATION` (verify returns 400 unless `=== 'true'` — `verify/route.ts:29–37`), which is **not set** in the observed env files. Risk = one env var away from free checkout.
- **SEC‑006** rate‑limit bypass when `req.ip` resolves to loopback (proxy misconfiguration) — `skip: (req) => isLocalhost(req.ip)` applies in production too. Also confirm `X-Forwarded-For` handling/trust‑proxy behind your reverse proxy.
- **SEC‑008** frontend limiter effective only if `UPSTASH_REDIS_REST_URL/TOKEN` are set — they are absent from `.env.example`/`.env.local`.
- **SEC‑005** Next.js RCE — actual exploitability unproven.

### Hardening opportunities

- **SEC‑009** unauthenticated promotion‑code harvesting (`/store/campaigns/active`) — decide if intentional marketing; sibling route `store/campaigns:26–34` explicitly strips codes, so the two disagree.
- **SEC‑010** displayed totals derive from client‑mutable metadata (`custom_unit_price` at `commerce.ts:94`; `amount` echoed in verify payload). Charging amount is server‑derived (verified) — integrity risk is display/dispute, not charge.
- **SEC‑011** `POST /store/carts/:id/line-items/custom` has no body schema (quantity bounds, metadata size) — defense relies entirely on `addToCartWorkflow`.
- **SEC‑013** raw `error.message` leakage on API errors.
- Missing security headers for the **backend** (frontend sets HSTS/XFO/nosniff/referrer in `next.config.ts:59–91`; no equivalent verified for Medusa responses — deploy‑level, Section K).
- CSRF: state‑changing store calls use a custom header (`x-publishable-api-key`) → preflight; cart/session cookies are frontend‑only and `sameSite=lax`. Residual CSRF risk is low for backend routes; `proxy.ts:26–41` documents an origin‑forwarding fix already applied for the platform zone.

### Verified good controls

Placeholder secret rejection; production localhost‑CORS rejection; global admin authentication; httpOnly/Secure/SameSite cart cookie; server‑derived payment amount; zod param validation; `.env*` gitignored (verified via `git check-ignore` — the only "secret" found tracked is the **test** key ID inside `MASTER_SECURITY_AUDIT.md:189`, SEC‑012). **No secret values are reproduced in this report.**

### Dependency audit (verified)

- **Frontend:** 21 vulns (5 moderate, 14 high, **2 critical**) — includes `next` critical (SEC‑005) and `uuid <11.1.1` (moderate, no fix via `--omit=dev` path).
- **Backend:** 75 vulns (6 moderate, 69 high) — Medusa transitive graph (`@medusajs/utils`‑dependent packages, `@graphql-codegen/*`) and `bullmq→uuid` (no fix available). **Not verified as exploitable in this app's usage** — treat as upgrade backlog pinned to Medusa releases; do not blind‑`audit fix` a framework monorepo.

### Abuse scenarios

- Order enumeration bot (SEC‑001) + Strategy C → cheap scraping of all customer data.
- Verify‑endpoint spam → 6 sequential backend calls each (SEC‑003 amplification), no idempotency, no rate limit on `/api/checkout/*`.
- Contact/newsletter forms are stubs (ARC‑004) — abuse is moot because nothing is stored (itself a defect).

---

## G. Database and Data Integrity Assessment

**Schema (custom modules)**

- `workshop`: `id(wk*)`, title/handle/description/date/time/venue/level/`price: model.number()`/`spots_text`/`images: json`/`status`. Issues: **money as float** (DB‑004), `date`/`time` as free text, `spots_text` display‑only with **no capacity column** → workshop overselling is unprevented (cart accepts arbitrary quantity ≤99 client‑enforced for `wk_` items; `custom/route.ts:20–32` sets `unit_price` from the workshop record but never checks seats).
- `customization_*`: `product_id: model.text()` (DB‑003 no FK), `price_adjustment: model.number()` nullable (also float money), `status` enum default active.
- `blog.post`: `handle` text with no unique constraint (DB‑002), `images: json`.
- **No `index()` declared anywhere** in these models (DB‑001) — `product_id`/`handle` lookups are sequential scans as tables grow. (Medusa indexes `id` automatically; nothing else is guaranteed.)
- Referential integrity: link tables via `hasMany/belongsTo` inside the custom modules exist, but cross‑module `product_id` is free text — deleting a product orphans customization rows (store route `GET /store/products/[id]/customizations` would then silently return stale options).

**Transactions & atomicity**

- `admin/.../customizations/options/route.ts:56–88` performs: list values → list all combinations → loop deletes → delete values → delete option, each a separate awaited call with **no transaction** (DB‑005). A mid‑sequence failure leaves orphaned combinations/values. `listCustomizationCombinations({})` also loads **all** combinations to filter in JS.
- Order creation itself rides Medusa's `cart complete` workflow (transactional within Medusa) — good — but the surrounding payment steps in `verify/route.ts:79–185` are **not** atomic across systems (cart update, shipping, payment collection, completion are separate HTTP calls; any step can fail non‑atomically → SEC‑003).
- Concurrency: two users buying the last unit — physical products use Medusa inventory (seeded to 1000 each, `initial-data-seed.ts:486–496`); `isOutOfStock = false` is hard‑coded in `add-to-cart-button.tsx:89`, so the UI never blocks overselling — enforcement then depends on Medusa's stock check at add/complete time (**unverified at runtime**). Workshops have no inventory at all.

**Migrations:** module migrations exist under `src/modules/*/migrations` (per AGENTS.md convention); no migration step in any pipeline (DEP‑005); rollback strategy undocumented (Section K).

**Backups:** `docker-compose` mounts a named volume only — no backup service, no PITR config, no restore test evidence (DB‑006, verify).

**PII storage:** customer email/phone/addresses live in Medusa core order tables (expected), but read access is what SEC‑001 exposes. No retention/deletion policy found (PRIV‑003). Audit trail: no custom audit logging of admin mutations (workshop/blog/customization CRUD has no before/after record).

**Money handling:** `lib/money.ts:57` treats INR as zero‑decimal (whole rupees) consistently with seed amounts (3800, 2499…), but the Medusa lint flags those seed prices as likely minor units (`prices-in-major-units`) — i.e., there is an **unresolved ambiguity about major vs minor units** between seed scripts, `money.ts`, and `workshop.price`. Needs one authoritative convention documented and tested; otherwise 100× price errors are possible when conventions collide.

---

## H. Testing and Build Results

Commands executed (read‑only / non‑destructive; no DB, no production services):

| # | Command | Result |
|---|---|---|
| 1 | `letter-ink-backend: npm run lint` (`medusa lint`) | **Passed with 74 warnings, 0 errors** (magic logger strings, `no-service-mutations-in-api-route`, `prices-in-major-units` on seed scripts) |
| 2 | `letter-ink-backend: npm run test:unit` (Jest) | **FAILED — 1 of 2 tests.** `route.unit.spec.ts` "should successfully add a custom line item" expects `unit_price: 1500` in workflow input; the route intentionally no longer sends it and adds `custom_variant_id`. Suite: `Tests: 1 failed, 1 passed` |
| 3 | `letter-ink-backend: npm run build` (`medusa build`) | **FAILED** — `warn: Backend build completed with errors (9.08s)`; TS2769 in `src/scripts/seed-promotions.ts` (missing `status`); frontend build portion reported OK |
| 4 | `letter-ink-frontend: npx @biomejs/biome check --write --unsafe` | **FAILED** — `Found 2590 errors, 1258 warnings` across 191 files; config schema 2.5.11 vs CLI 2.5.12 mismatch; also auto‑fixed 1 file (side effect of the repo's own lint script — see note) |
| 5 | `letter-ink-frontend: npx next build` | **FAILED** — `Export recentOrdersMap doesn't exist in target module` (`app/api/order/track/route.ts:2`) |
| 6 | `letter-ink-frontend: npx bun test` | **FAILED** — observed: `proxy.test.ts` 1 fail (rewrite URL expectation); `quick-add-button.test.tsx` 3 fails (`document is not defined` — no DOM env); `theme-toggle.test.tsx` (`describe is not defined`); `e2e/checkout.spec.ts` executed by bun runner → "Unhandled error between tests" (Playwright spec). Full summary line not captured in truncated output |
| 7 | `backend: npm audit --omit=dev` | 75 vulnerabilities (6 moderate, 69 high) |
| 8 | `frontend: npm audit --omit=dev` | 21 vulnerabilities (5 moderate, 14 high, **2 critical**, incl. `next` GHSA‑vcvr‑r3jv‑pc5j) |
| 9 | `git status` / `git log` / `git check-ignore` | Large uncommitted working tree (dozens of modified frontend files); recent commits "Security bugs", "security audit guide"; `.env*` files correctly ignored |

**Not run:** `test:integration:http` / `test:integration:modules` (require a reachable PostgreSQL; also no spec files exist — TEST‑002), Playwright e2e (requires live stack + seed data), `bun run build` full shell check (blocked by #5), load tests (none exist), dynamic security scans (out of scope).

**Note on side effects:** command #4 used the repo's own `lint` script which includes `--write`; it auto‑formatted 1 file in the working tree. This was an unintended write during an audit‑only task — please `git diff` that change and revert it if unwanted. No other writes were made.

**Tests that were not run vs failed:** failed = #2, #4, #5, #6. Not run = integration suites, e2e, build shell gate.

---

## I. Production Deployment Checklist

### Code

- [ ] Frontend and backend `build` succeed from a clean checkout (BLD‑001/002)
- [ ] `test:unit`, `bun test`, `tsc --noEmit`, both linters pass with zero errors
- [ ] Remove `typescript.ignoreBuildErrors: true` (ARC‑006) or file tracked debt
- [ ] Fix failing/stale tests; make payment e2e assertions non‑conditional (TEST‑003/004/005)
- [ ] Wire stub APIs to real storage or disable the UI (ARC‑003/004)

### Security

- [ ] SEC‑001 order‑tracking verification made mandatory; enumeration closed
- [ ] SEC‑002 fail‑closed signature verification; `RAZORPAY_KEY_SECRET` confirmed set in prod
- [ ] `ENABLE_PAYMENT_SIMULATION` unset/`!== 'true'` in every environment
- [ ] Razorpay webhook live + idempotent (SEC‑004) and paid‑order reconciliation job (SEC‑003)
- [ ] `next` upgraded ≥16.3.8 (SEC‑005); dependency audit reviewed
- [ ] Rotate/confirm `JWT_SECRET`, `COOKIE_SECRET`, `AUTH_MFA_ENCRYPTION_KEY` (guards exist in `medusa-config.ts`), publishable key, Razorpay **live** keys (out of repo)
- [ ] Rate limits: verify `X-Forwarded-For`/trust‑proxy; confirm localhost skip can't trigger behind prod proxy (SEC‑006); Upstash configured (SEC‑008)
- [ ] Decide on promo‑code exposure (SEC‑009)
- [ ] Secrets scan of tracked files; remove test key ID from `MASTER_SECURITY_AUDIT.md` (SEC‑012)
- [ ] Backend security headers/TLS termination verified at proxy (Section K)

### Infrastructure

- [ ] App container image + healthcheck + restart policy + resource limits (DEP‑001/003)
- [ ] Env validation at startup for `DATABASE_URL`, CORS origins, `REDIS_URL` (DEP‑002)
- [ ] Redis actually wired to Medusa; confirmed by build log no longer saying "fake redis" (PERF‑004)
- [ ] Postgres backups enabled + **restore tested**; documented RTO/RPO (DB‑006)
- [ ] Migration step sequenced before traffic switch (`medusa db:migrate`) with rollback plan (DEP‑005)
- [ ] Staging environment with production‑like CORS/keys

### Monitoring & operations

- [ ] Structured logs + request/correlation IDs (currently ad‑hoc strings)
- [ ] Error monitoring (Sentry or equivalent), metrics (latency/5xx/queue), alerts on payment failures and failed webhooks (DEP‑004)
- [ ] Business dashboards: orders, payments, refunds, failed verifies
- [ ] Runbook: payment‑succeeded‑order‑failed, webhook replay, DB restore, rollback

### Payments

- [ ] Razorpay dashboard: webhook URL registered, secret set, signature verification on
- [ ] Test‑mode → live key cutover procedure; PCI scope confirmation (Checkout.js = SAQ‑A pattern; verify)
- [ ] Refund authorization path defined (admin‑only; none found in this repo — verify where refunds live)

### Release

- [ ] CI pipeline (TEST‑001) gating lint+types+tests+build
- [ ] Prerendered‑shell gate (`scripts/check-shell.sh`) green on the release build
- [ ] Rollback procedure rehearsed (previous image/tag), zero‑downtime strategy defined
- [ ] Legal pages live: privacy, terms, refund, shipping (PRIV‑002)

---

## J. Prioritized Remediation Roadmap

### P0 — Immediate blockers

| Finding | Action | Benefit | Effort | Prereqs |
|---|---|---|---|---|
| SEC‑001 | Require and enforce contact match in both track routes; strip Strategy C; minimal response fields; per‑IP limit | Stops mass PII/order disclosure | S–M | none |
| BLD‑001 | Remove `recentOrdersMap` import/usage from `app/api/order/track/route.ts` (keep backend as source of truth) | Deployable frontend | S | none |
| BLD‑002 | Add `status` to `createPromotions` payloads (correct enum value) | Deployable backend | S | confirm Medusa 2.21 promo status values |
| SEC‑002 | Fail closed when `RAZORPAY_KEY_SECRET` missing; never skip HMAC | Blocks free‑order path | S | none |
| SEC‑003/004 | Durable paid‑order record + Razorpay webhook with HMAC + idempotency + retry | No lost paid orders; reconciliation | M–L | Razorpay dashboard webhook setup |
| SEC‑005 | Upgrade `next` ≥16.3.8, rerun build/tests/audit | Removes critical advisory | M | shell/test gates green |

### P1 — Before production

| Finding | Action | Benefit | Effort | Prereqs |
|---|---|---|---|---|
| TEST‑001 | Add CI (lint, types, tests, both builds) | Prevents recurrence of P0 | M | fix P0 first |
| TEST‑002/003/004/005 | Repair test envs (jsdom config), un‑condition payment assertions, fix/replace stale spec, add webhook/verify tests | Trustworthy gates | M | P0 |
| PERF‑001 | Indexed exact lookup only in track route | Removes O(N) DoS/data path | S | SEC‑001 |
| DEP‑001/002/003 | Containerize apps, healthchecks, env validation, restart policy | Operable deployment | M | platform choice |
| SEC‑007 | Remove simulated‑order fallback in prod builds; hard‑fail if Razorpay errors | No accidental simulation mode | S | none |
| ARC‑004/003 | Wire or remove fake‑success contact/newsletter/review endpoints | Users' messages aren't lost | S–M | provider decision |
| DB‑004 | Seats/capacity column + reservation check for workshops; integer money types | No overselling; exact money | M | migration |
| SEC‑006/008 | Real Redis/Upstash for both limiters; proxy/trust config | Limits effective in prod & multi‑instance | M | Redis provisioned |

### P2 — Near‑term improvements

| Finding | Action | Benefit | Effort |
|---|---|---|---|
| PERF‑002/003 | Pagination + server‑side filtering/count everywhere | Stable latency & correct paging | M |
| DB‑001/002/003 | Indexes, unique constraints, FK/enforce cleanup on `product_id`/`handle` | Query speed, integrity | M (migration) |
| DB‑005 | Transactional admin deletes | No partial orphan state | S |
| SEC‑009/010/011/013 | Promo‑code policy; validate display amounts; body schema on custom cart route; sanitize error messages | Hardening | S–M each |
| ARC‑001/002 | Unify tracking logic; move mutations into workflows (clears Medusa lint warnings) | Less drift, framework‑correct | M |
| PERF‑004/005 | Wire Redis; audit `cartGet` caching strategy (`cacheLife`, invalidation) | Multi‑instance safety, fresh prices | M |
| DEP‑004/005, DB‑006 | Monitoring/alerting, migration in pipeline, backups + restore drill | Detectable/recoverable incidents | M |
| PRIV‑002/003 | Legal pages + data export/deletion path (with counsel) | Regulatory readiness | M |

### P3 — Ongoing

- Remove dead artifacts (`test-cart.ts`, `scripts-archive/`, root `*.log`, `camp.md`) — ARC‑005.
- Biome config/CLI sync and error burn‑down — TEST‑006.
- Dependency update strategy pinned to Medusa releases; triage 75/21 audit findings — track transitive reachability.
- Money‑unit convention documented end‑end (major/minor, INR zero‑decimal) with tests.
- Consolidate duplicated mappers; reduce `any`; type the BFF payloads.
- Accessibility/perf Lighthouse runs per `bun run audit`; bundle/code‑split review.
- Add integration HTTP specs for every store route (authz, validation, limits).

---

## K. Questions and Unverified Assumptions

1. **Razorpay configuration:** Is `RAZORPAY_KEY_SECRET` present in the production environment (SEC‑002 is fail‑open if not)? Is `ENABLE_PAYMENT_SIMULATION` set anywhere? Is a webhook registered in the Razorpay dashboard (none in code)?
2. **`/store/orders/:id` fallback** (`frontend order/track:82`) — does Medusa 2.21 allow unauthenticated retrieve with only a publishable key? Not verified at runtime; if yes, opaque‑ID guessing is the only barrier.
3. **Deployment platform:** Vercel indicators exist (`VERCEL_*`, blob storage, platform proxy) but no vercel.json/workflows. Where and how are apps hosted, with what headers, TLS, WAF, `trust proxy`? Backend security headers unverified.
4. **Redis:** `REDIS_URL` is set but Medusa logs "fake redis" at build — is Redis ever connected in the running environment? Is Upstash configured in production (SEC‑008)?
5. **Backups/DR:** Any provider‑side Postgres backup/restore testing? Unknown.
6. **Monitoring:** Sentry/observability/analytics configuration lives outside the repo? Unknown. Nothing in‑repo.
7. **Refunds/cancellations/fulfillment:** No refund or cancel endpoints in this repo (admin Medusa routes or platform zone may handle them). Where do refunds and order admin live? Unverified — the audit's refund/idempotency requirements could not be traced.
8. **Inventory enforcement:** Whether Medusa blocks add/complete when stock is exhausted (UI is hard‑coded to allow, `isOutOfStock = false`). Requires runtime test.
9. **Shopper auth/account:** `/account` is platform‑proxied; its authorization behavior is external. The `app/api/auth/*` passthrough targets an apex URL derived from `getSubdomainPublicUrl()` (currently returns localhost/`NEXT_PUBLIC_URL`) — confirm production target.
10. **Major/minor price units** — confirm intended convention (see G) to rule out 100× errors.
11. **Publishable key & live Razorpay key rotation** — current `.env.local` uses test keys; verify live cutover and that no live secrets exist in any tracked file (only a **test** key ID was found tracked).
12. **Load characteristics:** no traffic data or load tests exist — no throughput claims are made anywhere in this report.
13. **Compliance:** DPDP Act 2023 obligations, PCI‑DSS scope (Checkout.js suggests SAQ‑A), and consumer‑protection disclosures require legal/operational review — this audit makes **no compliance verdict**.
14. **Working tree:** dozens of uncommitted modifications exist; this audit reflects the working tree, not a commit. One lint command auto‑formatted a file (Section H note).

---

## Bottom line

The architecture is right‑sized and several security controls are genuinely well done (secret guards, admin auth, httpOnly cookies, server‑derived charge amounts). But the application **does not build, does not pass its tests, has no CI, and exposes customer order/PII through its tracking API while relying on a browser callback without a webhook for payment finalization.** Treat P0 + P1 as the gate to any production launch.

*This audit made no code changes. Remediation should begin only after explicit authorization, starting with the P0 list: SEC‑001, BLD‑001/002, SEC‑002, SEC‑003/004.*
