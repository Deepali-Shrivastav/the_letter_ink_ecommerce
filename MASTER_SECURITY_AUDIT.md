# 🔐 MASTER PRODUCTION SECURITY AUDIT
### The Letter Ink — Artisanal E-Commerce Platform

---

| Field | Details |
|---|---|
| **Audit Date** | 2026-10-01 |
| **Audit Type** | Read-Only Static Analysis + Architecture Review |
| **Application Status** | Under Active Development (Pre-Production) |
| **Total Findings** | 27 (3 Critical · 6 High · 8 Medium · 5 Low · 7 Informational) |
| **Confirmed Production Blockers** | 8 |

> **IMPORTANT:** No source code, configuration, database, or dependencies were modified during this audit.

---

## 📋 TABLE OF CONTENTS

1. [Executive Summary](#1-executive-summary)
2. [Architecture Overview](#2-architecture-overview)
3. [Payment Flow Diagram](#3-payment-flow-diagram)
4. [Production Blockers — Must Fix First](#4-production-blockers--must-fix-first)
5. [Security Findings — Critical](#5-security-findings--critical)
6. [Security Findings — High](#6-security-findings--high)
7. [Security Findings — Medium](#7-security-findings--medium)
8. [Security Findings — Low](#8-security-findings--low)
9. [Security Findings — Informational](#9-security-findings--informational)
10. [Complete Audit Checklist](#10-complete-audit-checklist)
11. [What Was & Was Not Tested](#11-what-was--was-not-tested)
12. [Remediation Plan](#12-remediation-plan)
13. [Secret Rotation Guide](#13-secret-rotation-guide)
14. [Final Verification Checklist](#14-final-verification-checklist)

---

## 1. EXECUTIVE SUMMARY

### 🏪 Application
The Letter Ink is a bespoke calligraphy and stationery e-commerce store built on the **MedusaJS v2** headless commerce platform with a **Next.js 16** storefront and **Razorpay** payments.

### 📊 Findings at a Glance

| Severity | Count | Status |
|---|---|---|
| 🔴 **CRITICAL** | 3 | Blocks any deployment |
| 🟠 **HIGH** | 6 | Fix before going live |
| 🟡 **MEDIUM** | 8 | Fix before public launch |
| 🔵 **LOW** | 5 | Post-launch hardening |
| ⚪ **INFORMATIONAL** | 7 | Observations / Feature gaps |
| **TOTAL** | **27** | |

### ⛔ Top 3 Most Dangerous Findings (Fix Today)

| # | Finding | Impact |
|---|---|---|
| 1 | **Real Razorpay keys in `.env`** | Financial fraud / unauthorized payment API access |
| 2 | **Payment simulation bypass in production code** | Anyone can get free orders without paying |
| 3 | **Placeholder JWT/Cookie secrets in active backend** | Admin session forgery possible |

### ✅ Things Done Well
- Zod validation used consistently on backend API inputs
- Cart cookie properly configured (`httpOnly`, `Secure` in production, `SameSite: lax`)
- Logger sanitizes sensitive keys before outputting to console
- Stack traces suppressed in production error responses
- Auth proxy rate-limited at 20 req/min
- Generic error messages returned to clients (no internal details leaked)
- `AbortSignal.timeout(8000)` used on outgoing fetch calls

---

## 2. ARCHITECTURE OVERVIEW

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT BROWSER                          │
└─────────────────────┬───────────────────────────────────────────┘
                      │ HTTPS
                      ▼
┌─────────────────────────────────────────────────────────────────┐
│              NEXT.JS 16.3.4 FRONTEND (yournextstore/)           │
│                                                                 │
│  App Router Pages          API Routes                           │
│  /shop, /checkout          /api/auth/[...all]  → Medusa proxy  │
│  /cart, /order             /api/checkout/razorpay/*            │
│  /blog, /workshops         /api/chat  ← MISSING ROUTE          │
└─────────────────────┬───────────────────────────────────────────┘
                      │ Internal HTTP
                      ▼
┌─────────────────────────────────────────────────────────────────┐
│       MEDUSAJS v2.21 BACKEND (letter-ink-backend/)              │
│                                                                 │
│  Built-in Routes           Custom API Routes                    │
│  /store/*, /admin/*        /api/admin/blogs                     │
│  /auth/*                   /api/admin/workshops                 │
│                             /api/admin/customizations/*         │
│                             /api/store/campaigns                │
│                             /api/store/products/:id/custom...   │
│                             /api/store/carts/:id/line-items/... │
│                                                                 │
│  Middleware: express-rate-limit on /auth/*, /store/*, /admin/*  │
│  Auth: MedusaJS JWT + Cookie (built-in)                         │
└──────────┬──────────────────────────────────────────────────────┘
           │                         │
           ▼                         ▼
┌──────────────────┐       ┌──────────────────────┐
│   PostgreSQL 15  │       │   Redis (no auth)     │
│  (Docker)        │       │   Port 6379 exposed   │
│  Default pw risk │       │   No password set     │
└──────────────────┘       └──────────────────────┘
```

### Technology Stack

| Layer | Technology | Version | Notes |
|---|---|---|---|
| Frontend | Next.js | 16.3.4 | App Router, React 19 |
| Backend | MedusaJS | 2.21.0 | Custom modules: blog, workshop, customizations |
| Database | PostgreSQL | 15 | Dockerized |
| Cache | Redis | alpine | No auth configured |
| Payment | Razorpay | SDK v1 | Test keys in use |
| Validation | Zod | 4.2.0 | Used on backend inputs |
| Rate Limiting | express-rate-limit | ^8.7.0 | Backend; in-memory on frontend |
| AI Chat | Vercel AI SDK | 7.0.93 | `/api/chat` route not found |

---

## 3. PAYMENT FLOW DIAGRAM

```
CUSTOMER                  NEXT.JS                  RAZORPAY API           MEDUSA BACKEND
   │                         │                           │                      │
   │──── clicks "Pay" ──────▶│                           │                      │
   │                         │                           │                      │
   │                         │──POST /api/checkout/      │                      │
   │                         │   razorpay/create-order──▶│                      │
   │                         │  ┌─────────────────────────────────────────────┐ │
   │                         │  │ ⚠️ SEC-008: Falls back to client amount     │ │
   │                         │  │ if Medusa cart fetch fails                  │ │
   │                         │  └─────────────────────────────────────────────┘ │
   │                         │                           │                      │
   │◀── Razorpay popup ──────│◀── orderId, keyId ────────│                      │
   │                         │                           │                      │
   │──── pays in popup ─────▶│                           │                      │
   │                         │                           │                      │
   │                         │──POST /api/checkout/      │                      │
   │                         │   razorpay/verify ────────│                      │
   │                         │  ┌─────────────────────────────────────────────┐ │
   │                         │  │ 🔴 SEC-003: if order_id starts with         │ │
   │                         │  │ "order_sim_" → BYPASSES ALL VERIFICATION    │ │
   │                         │  └─────────────────────────────────────────────┘ │
   │                         │                           │──▶ completes cart───▶│
   │◀── redirect to success ─│◀──────────── orderId ─────│                      │
```

---

## 4. PRODUCTION BLOCKERS — MUST FIX FIRST

> These 8 issues **MUST be resolved before any production deployment**. The application should not go live until all are addressed.

| # | Blocker | Severity | File | Impact |
|---|---|---|---|---|
| 1 | Real Razorpay keys in `.env` | 🔴 CRITICAL | `yournextstore/.env:15-16` | Financial fraud |
| 2 | Hardcoded publishable API keys in test scripts | 🔴 CRITICAL | `test-promo-api.js:3` etc. | Backend enumeration |
| 3 | Payment simulation bypass (`order_sim_*`) | 🔴 CRITICAL | `verify/route.ts:28-30` | Free orders without payment |
| 4 | Placeholder JWT/Cookie secrets | 🟠 HIGH | `backend/.env:17-18` | Admin session forgery |
| 5 | Razorpay callback — no signature verification | 🟠 HIGH | `callback/route.ts:29` | Free order completion |
| 6 | Client amount trusted if Medusa fetch fails | 🟠 HIGH | `create-order/route.ts:38` | Price manipulation |
| 7 | Custom price endpoint on public store path | 🟠 HIGH | `line-items/custom/route.ts` | Any product for ₹1 |
| 8 | No security headers in production | 🟡 MEDIUM | `next.config.ts:61` | XSS, clickjacking |

---

## 5. SECURITY FINDINGS — CRITICAL

---

### 🔴 SEC-001 — Real Razorpay Credentials in `.env`

| Field | Value |
|---|---|
| **Category** | API Keys & Secrets |
| **Severity** | 🔴 CRITICAL |
| **Location** | `yournextstore/.env:15-16` |

**What was found:**
```
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_Tge6ES0nAYgfLm
RAZORPAY_KEY_SECRET=hTtOIqN***REDACTED***
```
Real Razorpay test API credentials (not placeholders) are committed directly in the `.env` file.

**Why it's dangerous:**
The `.env` file sits at the project root alongside the git repository. If the repo is ever pushed to a public host (GitHub, GitLab), or if `.gitignore` ever misconfigures, these credentials are permanently exposed in git history and can never truly be removed.

**Attack Scenario:**
Attacker finds keys in a public/leaked repo → logs into Razorpay Dashboard → creates fraudulent payment orders or claims refunds.

**Fix:**
1. **Immediately rotate** both keys in the Razorpay dashboard
2. Replace `.env` values with placeholders: `rzp_test_your_key_here`
3. Store real values only in `.env.local` (which is already git-ignored)
4. In production, use a secrets manager (AWS Secrets Manager / Doppler / Vault)

**Verify Fix:** `grep -r "rzp_test_Tge6ES0nAYgfLm" .` should return no results.

---

### 🔴 SEC-002 — Publishable API Keys Hardcoded in Test Scripts

| Field | Value |
|---|---|
| **Category** | API Keys & Secrets |
| **Severity** | 🔴 CRITICAL |
| **Locations** | `yournextstore/test-promo-api.js:3` · `test-frontend-apply.js:6` · `letter-ink-backend/scratch_test.ts:4` |

**What was found:**
All three files contain this hardcoded key:
```
pk_63a72c5bee39e67a8be438c3dabd0b63dcf83417c2ecd9180d0d6105b068303b
```

**Why it's dangerous:**
While publishable keys are designed to be used client-side, having them hardcoded in repository scripts exposes internal test logic, product handles (`handwritten-letters`), and lets anyone directly interact with your Medusa API to enumerate products, create carts, and attempt promotions.

**Fix:**
- Remove hardcoded keys from all three scripts
- Replace with `process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY`
- Move these test scripts to a `tests/` directory or remove from repo

**Verify Fix:** `grep -r "pk_63a72c5bee" .` returns no results.

---

### 🔴 SEC-003 — Payment Simulation Bypass in Production Code

| Field | Value |
|---|---|
| **Category** | Payments & Webhooks |
| **Severity** | 🔴 CRITICAL |
| **Locations** | `yournextstore/app/checkout/checkout-form.tsx:188-233` · `app/api/checkout/razorpay/verify/route.ts:25-48` |

**What was found:**
The checkout form has a `handleSimulateSuccess()` function that sends fake payment IDs to the verify endpoint:
```js
razorpay_order_id: `order_sim_${Date.now()}`,
razorpay_payment_id: `pay_sim_${Date.now()}`,
razorpay_signature: "simulated_signature",
```

The server-side verify route detects simulation by checking if the order ID starts with `"order_sim_"`:
```ts
const isLiveConfigured = Boolean(
  keySecret &&
  !keySecret.includes("placeholder") &&
  razorpay_signature &&
  !razorpay_order_id.startsWith("order_sim_")  // ← bypass condition
)
```
If `isLiveConfigured` is false, **all HMAC signature verification is skipped** and the order completes in Medusa for free.

**Attack Scenario:**
Any user who reads the source code (open network tab, view-source) can directly call:
```bash
curl -X POST https://yourdomain.com/api/checkout/razorpay/verify \
  -H "Content-Type: application/json" \
  -d '{
    "razorpay_order_id": "order_sim_free",
    "razorpay_payment_id": "pay_sim_free",
    "razorpay_signature": "anything",
    "cartId": "<real_cart_id>",
    "amount": 5000
  }'
```
→ Order completes in Medusa without any real payment.

**Fix:**
1. **Remove `handleSimulateSuccess`** from the checkout form entirely
2. **Remove the `order_sim_*` bypass** from the verify route
3. **Always verify HMAC signature** — no exceptions in production
4. Gate simulation behind a dev-only environment variable: `if (process.env.ENABLE_PAYMENT_SIMULATION !== 'true')`

**Verify Fix:** POST with `order_sim_*` to verify endpoint → must return HTTP 400.

---

## 6. SECURITY FINDINGS — HIGH

---

### 🟠 SEC-004 — Placeholder JWT and Cookie Secrets

| Field | Value |
|---|---|
| **Category** | Authentication |
| **Severity** | 🟠 HIGH |
| **Location** | `letter-ink-backend/apps/backend/.env:17-19` |

**What was found:**
The active runtime `.env` file (not just the example) contains:
```
JWT_SECRET=replace_with_secure_random_jwt_secret_min_32_chars
COOKIE_SECRET=replace_with_secure_random_cookie_secret_min_32_chars
AUTH_MFA_ENCRYPTION_KEY=replace_with_32_byte_hex_encryption_key
```

**Why it's dangerous:**
MedusaJS signs all admin session JWTs with `JWT_SECRET`. If the secret is a known/guessable string, an attacker can craft a valid admin JWT token and gain full admin access without credentials.

**Fix:**
```bash
# Generate JWT secret
openssl rand -base64 48

# Generate cookie secret
openssl rand -base64 48

# Generate MFA encryption key
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```
Replace values in `.env` with the output. Add startup validation that rejects placeholder values.

**Verify Fix:** JWT/Cookie secrets must have > 256 bits of entropy.

---

### 🟠 SEC-005 — Custom Admin API Route Authentication Not Explicitly Verified

| Field | Value |
|---|---|
| **Category** | Admin Route Protection |
| **Severity** | 🟠 HIGH |
| **Locations** | `src/api/admin/workshops/route.ts` · `src/api/admin/blogs/route.ts` · `src/api/admin/customizations/*` |

**What was found:**
The middleware config applies only a rate limiter to `/admin/*`, with no explicit authentication middleware:
```ts
// middlewares.ts
{ matcher: "/admin/*", middlewares: [defaultLimiter] }
```
No `requireAuth` or `isAuthenticated` middleware is applied to custom admin routes. MedusaJS v2 may automatically protect `/api/admin/*` paths, but this could **not be dynamically verified**.

**Risk:**
If the framework does not automatically enforce auth on custom routes under `/api/admin/`, unauthenticated users can create/delete blogs, workshops, and product customization options.

**Fix:**
1. Dynamically test: `curl -X GET http://localhost:9000/api/admin/workshops` without auth cookie → must return 401
2. If not 401, explicitly add MedusaJS authentication middleware to custom admin routes

**Verify Fix:** Unauthenticated request to any `/api/admin/*` custom route returns HTTP 401.

---

### 🟠 SEC-006 — In-Memory Rate Limiting (Ineffective in Production)

| Field | Value |
|---|---|
| **Category** | API Rate Limiting |
| **Severity** | 🟠 HIGH |
| **Location** | `yournextstore/lib/rate-limit.ts:1` |

**What was found:**
```ts
const rateLimitMap = new Map<string, { count: number; lastReset: number }>();
```
This module-level singleton is lost every time the Node.js process restarts. In serverless deployments (Vercel, AWS Lambda), each invocation can be a fresh process.

**Why it's dangerous:**
The 20-requests-per-minute auth limit is completely ineffective if:
- The server restarts between requests
- Multiple server instances are running (horizontal scaling)
- Serverless functions spin up fresh instances

**Fix:**
Replace with Redis-backed rate limiting:
```ts
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(20, "1 m"),
});
```

**Verify Fix:** Rate limit counter persists across server restarts.

---

### 🟠 SEC-007 — Razorpay Callback GET Endpoint — No Signature Verification

| Field | Value |
|---|---|
| **Category** | Payments & Webhooks |
| **Severity** | 🟠 HIGH |
| **Location** | `yournextstore/app/api/checkout/razorpay/callback/route.ts:9-83` |

**What was found:**
The callback GET handler accepts URL parameters and directly completes the Medusa cart:
```ts
const razorpay_payment_id = url.searchParams.get("razorpay_payment_id");
const cartId = url.searchParams.get("cartId");
// ...directly calls /store/carts/${cartId}/complete — NO SIGNATURE CHECK
```

**Attack Scenario:**
```
GET /api/checkout/razorpay/callback?razorpay_payment_id=fake&cartId=<real_cart_id>&razorpay_payment_link_status=paid
```
→ Cart completes in Medusa, user gets order confirmation, no payment made.

**Fix:**
Option A: Add HMAC verification using Razorpay webhook secret and `x-razorpay-signature` header.
Option B: Remove the GET callback entirely and rely only on the POST verify flow (which at least has the bypass issue documented in SEC-003 as a separate fix).

**Verify Fix:** GET callback with fake params → HTTP 400 or redirect to failure page.

---

### 🟠 SEC-008 — Client-Supplied Payment Amount Trusted as Fallback

| Field | Value |
|---|---|
| **Category** | Business Logic / Payments |
| **Severity** | 🟠 HIGH |
| **Location** | `yournextstore/app/api/checkout/razorpay/create-order/route.ts:10-40` |

**What was found:**
```ts
const { cartId, amount, customer, notes } = body;
let amountInPaise = Math.round(Number(amount || 0) * 100); // ← client value
if (cartId && PUBLISHABLE_KEY) {
  // Tries to fetch from Medusa — if this fails, uses client amount
  const cartRes = await fetch(...)
  if (cartRes.ok && cartJson.cart?.total) {
    amountInPaise = Math.round(cartJson.cart.total * 100); // ← server value
  }
}
if (amountInPaise <= 0) amountInPaise = 100; // minimum ₹1
```
If Medusa is down, slow, or the request times out, **the client-supplied amount is used**. Minimum of ₹1 is meaningless for a store with ₹1850–₹4999 products.

**Attack Scenario:**
Attacker sends `amount: 1` in the request body, Medusa fetch fails due to induced timeout → Razorpay order created for ₹1.

**Fix:**
1. **Require `cartId`** — reject request if not provided
2. **Reject if Medusa fetch fails** — do not fall back to client amount
3. **Never use `amount` from request body** — always derive from server-side cart

**Verify Fix:** POST to create-order with `amount: 1` and no valid `cartId` → HTTP 400.

---

### 🟠 SEC-011 — Custom Line-Item Price Endpoint on Public Store Path

| Field | Value |
|---|---|
| **Category** | Business Logic / Price Manipulation |
| **Severity** | 🟠 HIGH |
| **Location** | `letter-ink-backend/apps/backend/src/api/store/carts/[id]/line-items/custom/route.ts:9` |

**What was found:**
```ts
const { variant_id, quantity, unit_price, metadata } = req.body as any;
// ↑ unit_price accepted directly from client — no validation, no bounds check
```
This endpoint is at `/store/carts/:id/line-items/custom` — accessible to any storefront user, not admin-gated.

**Attack Scenario:**
```bash
curl -X POST /store/carts/<cart_id>/line-items/custom \
  -d '{"variant_id": "variant_real_id", "quantity": 1, "unit_price": 1}'
```
→ ₹3800 Name Frame added to cart at ₹1. Checkout proceeds normally.

**Fix:**
Option A: Move endpoint to `/api/admin/carts/:id/line-items/custom` (admin-only)
Option B: Server-side validate that `unit_price` matches the variant's actual price from Medusa product catalog

**Verify Fix:** Store customer calling this endpoint with arbitrary `unit_price` returns 403 or uses actual product price.

---

## 7. SECURITY FINDINGS — MEDIUM

---

### 🟡 SEC-009 — CORS Configured with Localhost Origins

| Field | Value |
|---|---|
| **Category** | CORS Configuration |
| **Severity** | 🟡 MEDIUM |
| **Location** | `letter-ink-backend/apps/backend/.env:8-10` |

**What was found:**
```
STORE_CORS=http://localhost:3000,http://127.0.0.1:3000
ADMIN_CORS=http://localhost:5173,http://localhost:9000,...
AUTH_CORS=http://localhost:5173,http://localhost:9000,http://localhost:3000,...
```

**Risk:** If these values are copied verbatim to production, localhost origins remain allowed. Any local HTTP service running on those ports on a user's machine could make credentialed cross-origin requests.

**Fix:** Set CORS variables to production domain(s) only before deployment.

**Verify Fix:** Production CORS preflight from `http://localhost:3000` returns 403.

---

### 🟡 SEC-010 — No Security Headers in Production (Next.js)

| Field | Value |
|---|---|
| **Category** | Security Headers |
| **Severity** | 🟡 MEDIUM |
| **Location** | `yournextstore/next.config.ts:60-74` |

**What was found:**
```ts
async headers() {
  if (isProd) return [];  // ← Empty! No headers in production!
  // Dev-only headers below...
}
```

**What's missing in production:**

| Header | Purpose | Risk if Missing |
|---|---|---|
| `X-Frame-Options: DENY` | Prevents clickjacking | Malicious iframe embeds |
| `X-Content-Type-Options: nosniff` | Prevents MIME sniffing | Script injection via uploads |
| `Strict-Transport-Security` (HSTS) | Forces HTTPS | MITM attacks |
| `Content-Security-Policy` | Restricts resource loading | XSS attacks |
| `Referrer-Policy` | Controls referrer info | Data leakage |

**Fix:** Replace `if (isProd) return []` with a proper production headers block.

**Verify Fix:** `curl -I https://yourdomain.com` shows all listed headers.

---

### 🟡 SEC-012 — Customization `price_adjustment` Has No Bounds

| Field | Value |
|---|---|
| **Category** | Input Validation |
| **Severity** | 🟡 MEDIUM |
| **Location** | `letter-ink-backend/apps/backend/src/api/common/validation.ts:62` |

**What was found:**
```ts
price_adjustment: z.number().optional()
// No .min() or .max() — accepts -999999999 to +999999999
```

**Risk:** Admin user (or attacker with admin access) sets `price_adjustment: -999999` on a combination, causing negative checkout totals or free products.

**Fix:** `price_adjustment: z.number().min(-100000).max(100000).optional()`

**Verify Fix:** POST `price_adjustment: -999999` → validation error returned.

---

### 🟡 SEC-013 — Rate Limiting Fully Disabled if NODE_ENV ≠ "production"

| Field | Value |
|---|---|
| **Category** | API Rate Limiting |
| **Severity** | 🟡 MEDIUM |
| **Location** | `letter-ink-backend/apps/backend/src/api/middlewares.ts:18,27` |

**What was found:**
```ts
skip: (req) => isDev || isLocalhost(req.ip)
// isDev = process.env.NODE_ENV !== "production"
```

**Risk:** If `NODE_ENV` is not set to `"production"` in the deployment environment, all rate limiting is skipped for every request, not just localhost.

**Fix:** Ensure `NODE_ENV=production` in all production deployment configs (Docker, `.env`, CI/CD).

**Verify Fix:** In production, 31st auth request within 15 minutes returns HTTP 429.

---

### 🟡 SEC-014 — Order Data Stored In-Memory (Lost on Restart)

| Field | Value |
|---|---|
| **Category** | Reliability |
| **Severity** | 🟡 MEDIUM |
| **Location** | `yournextstore/lib/commerce.ts:119-124` |

**What was found:**
```ts
const recentOrdersMap = new Map<string, any>();
// No TTL, no max size, no persistence
```

**Two problems:**
1. **Memory leak:** Map grows unboundedly on high-traffic deployments
2. **Data loss:** If server restarts after payment but before the customer views the success page → order success page fails (blank/error)

**Fix:** Replace with Redis-backed store with a 1-hour TTL:
```ts
await redis.setex(`order:${order.id}`, 3600, JSON.stringify(order));
```

**Verify Fix:** Complete payment → restart server → order success page still loads correctly.

---

### 🟡 SEC-015 — Campaign Promo Codes Leaked via `?all=true`

| Field | Value |
|---|---|
| **Category** | Information Disclosure |
| **Severity** | 🟡 MEDIUM |
| **Location** | `letter-ink-backend/apps/backend/src/api/store/campaigns/route.ts:19-22` |

**What was found:**
```ts
if (all === "true") {
  res.json({ campaigns }); // Returns ALL campaigns, including future ones
  return;
}
```
Any public user can call `GET /store/campaigns?all=true` and receive every campaign, including future, unpublished, and expired ones — along with their promotion codes.

**Attack Scenario:**
`curl /store/campaigns?all=true` → attacker gets next month's promotional codes before the campaign starts.

**Fix:** Remove the `all=true` parameter entirely, or restrict it to authenticated admin requests.

**Verify Fix:** `GET /store/campaigns?all=true` returns 403 or only active campaigns.

---

### 🟡 SEC-018 — Wildcard Image Remote Pattern Enables SSRF

| Field | Value |
|---|---|
| **Category** | SSRF Risk |
| **Severity** | 🟡 MEDIUM |
| **Location** | `yournextstore/next.config.ts:55` |

**What was found:**
```ts
remotePatterns: [
  { protocol: "https", hostname: "**" },   // ← allows ANY hostname
  { protocol: "http", hostname: "localhost" },
]
```
The wildcard `**` lets the Next.js Image Optimizer act as a proxy to **any HTTPS URL in the world**.

**Risk:** If product image URLs come from user-controlled input (e.g., admin entering an image URL), an attacker could point to internal cloud metadata endpoints. On AWS, `http://169.254.169.254/latest/meta-data/` returns instance credentials.

**Fix:** Replace `"**"` with explicit allowed hostnames:
```ts
{ protocol: "https", hostname: "lh3.googleusercontent.com" },
{ protocol: "https", hostname: "images.unsplash.com" },
{ protocol: "https", hostname: "*.public.blob.vercel-storage.com" },
```

**Verify Fix:** Image Optimizer refuses to proxy `https://169.254.169.254/`.

---

### 🟡 SEC-019 — Default PostgreSQL Password in Docker Compose

| Field | Value |
|---|---|
| **Category** | Database Security |
| **Severity** | 🟡 MEDIUM |
| **Location** | `docker-compose.yml:7` |

**What was found:**
```yaml
POSTGRES_PASSWORD: ${POSTGRES_PASSWORD:-password}
```
If `POSTGRES_PASSWORD` env var is not set, the database password is literally `"password"`.

**Fix:** Remove `:-password` fallback. Require explicit env variable. Ensure port 5433 is NOT externally exposed in production.

**Verify Fix:** Starting docker-compose without `POSTGRES_PASSWORD` set causes a startup error (not silent fallback).

---

## 8. SECURITY FINDINGS — LOW

---

### 🔵 SEC-016 — Test Scripts with Hardcoded Data at Project Root

| Field | Value |
|---|---|
| **Category** | Development Artifacts |
| **Severity** | 🔵 LOW |
| **Locations** | `yournextstore/test-promo-api.js` · `test-frontend-apply.js` · `test-cart.ts` |

Three test scripts at the frontend root contain hardcoded API keys (addressed in SEC-002), localhost URLs, and internal product handles (`handwritten-letters`). These should not be deployed to production servers.

**Fix:** Move to a `tests/` or `scripts/` directory. Add to `.dockerignore` / deployment exclusions.

---

### 🔵 SEC-017 — Destructive Database Scripts in Repository

| Field | Value |
|---|---|
| **Category** | Database Safety |
| **Severity** | 🔵 LOW |
| **Location** | `letter-ink-backend/scripts-archive/` |

Scripts like `clean-all-products.ts`, `clear-catalog-data.ts`, and `delete-product1.ts` delete all data from whatever `DATABASE_URL` is configured. Accidental execution against production would destroy all product catalog data.

**Fix:**
```ts
// Add at top of each destructive script:
if (process.env.NODE_ENV === 'production') {
  throw new Error('Refusing to run destructive script in production!');
}
```

---

### 🔵 SEC-020 — Redis Deployed Without Authentication or Network Isolation

| Field | Value |
|---|---|
| **Category** | Infrastructure Security |
| **Severity** | 🔵 LOW |
| **Location** | `docker-compose.yml:14-17` |

Redis runs without any password and exposes port 6379 on all interfaces. Any process that can reach this port can read and write all cache data, potentially poisoning session-adjacent data.

**Fix:**
```yaml
redis:
  image: redis:alpine
  command: redis-server --requirepass ${REDIS_PASSWORD}
  ports:
    - "127.0.0.1:6379:6379"  # Bind to localhost only
```

---

### 🔵 SEC-026 — Blog `content` Field Has No Maximum Length

| Field | Value |
|---|---|
| **Category** | Input Validation |
| **Severity** | 🔵 LOW |
| **Location** | `letter-ink-backend/apps/backend/src/api/common/validation.ts:28` |

```ts
content: z.string().optional().nullable()  // No .max()
```
Very large blog posts (megabytes of content) could cause memory pressure or slow database writes.

**Fix:** `content: z.string().max(500000).optional().nullable()`

---

### 🔵 SEC-025 — DevTools Iframe Reporter Active in Production

| Field | Value |
|---|---|
| **Category** | Development Artifacts |
| **Severity** | 🔵 LOW |
| **Location** | `yournextstore/components/devtools.tsx` |

`NavigationReporter` injects JavaScript to relay navigation events to trusted parent frames (vercel.run, localhost). Origin validation is implemented, but this is a development/builder feature that adds unnecessary script execution in production.

**Fix:** Gate `<NavigationReporter />` behind `process.env.NODE_ENV === 'development'` in the layout.

---

## 9. SECURITY FINDINGS — INFORMATIONAL

These findings represent feature gaps, minor observations, or code quality notes. They do not pose direct security risks.

---

### ⚪ SEC-021 — Newsletter and Contact Form Silently Drop Submissions

| Location | `yournextstore/lib/commerce.ts:606-611` |
|---|---|

```ts
subscriberCreate: async (_data) => { return { success: true }; },
contactMessageCreate: async (_data) => { return { success: true }; },
```
Both functions return success without actually storing data or sending emails. Users believe their messages were sent, but they are silently dropped. This is a **feature gap**, not a security risk.

**Recommendation:** Implement email delivery (Resend, SendGrid, Nodemailer) or store to database.

---

### ⚪ SEC-022 — `console.warn` in Medusa Client (Development Only)

| Location | `yournextstore/lib/medusa.ts:40` |
|---|---|

```ts
if (!PUBLISHABLE_KEY && process.env.NODE_ENV === "development") {
  console.warn("NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY is not set...");
}
```
Properly gated to development. ✅ No action needed.

---

### ⚪ SEC-023 — Error Digest Shown in Global Error Page

| Location | `yournextstore/app/global-error.tsx:29` |
|---|---|

```tsx
The store failed to load{error.digest ? ` (${error.digest})` : ""}.
```
`error.digest` is a cryptographic hash (not a stack trace) — safe to display. Useful for support. ✅ No action needed.

---

### ⚪ SEC-024 — Razorpay SDK Loaded on All Pages

| Location | `yournextstore/app/layout.tsx:259` |
|---|---|

```tsx
<Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />
```
The `lazyOnload` strategy is used (loads after user interaction), which is acceptable. However, loading on every page instead of only `/checkout` is a minor performance concern.

**Recommendation:** Move this `<Script>` tag into the checkout page layout for optimal performance.

---

### ⚪ SEC-027 — `/api/chat` Route Referenced but Not Found

| Location | `yournextstore/components/store-chat/chat-panel.tsx:43` |
|---|---|

```ts
const transport = useMemo(() => new DefaultChatTransport({ api: "/api/chat" }), []);
```
The AI chat widget references `/api/chat` but no such route was found in the codebase. The chat feature appears non-functional or the route is outside the audited scope.

**Recommendation:** Investigate and either implement the route or remove the chat UI.

---

### ⚪ SEC-028 — `auth_mfa_encryption_key` Missing from `medusa-config.ts`

The `AUTH_MFA_ENCRYPTION_KEY` variable is set in `.env` but not referenced in `medusa-config.ts`. It may be picked up automatically by the MedusaJS framework, but this could not be confirmed statically.

---

## 10. COMPLETE AUDIT CHECKLIST

| # | Audit Area | Status | Severity | Key Finding | Location |
|---|---|---|---|---|---|
| 1 | **Test Data & Seed Scripts** | ⚠️ PARTIAL | LOW | Seed script is intentional; test scripts contain hardcoded keys | `initial-data-seed.ts`, `test-*.js` |
| 2 | **API Keys & Secrets** | ❌ FAIL | 🔴 CRITICAL | Real Razorpay keys in `.env`; publishable key in 3 test scripts | `.env:15-16`, test scripts |
| 3 | **Admin Route Protection** | ⚠️ UNVERIFIED | 🟠 HIGH | No explicit auth middleware on custom admin routes | `/api/admin/*` |
| 4 | **Authentication (Login/Logout)** | ⚠️ PARTIAL | 🟠 HIGH | JWT secrets are placeholders; Medusa built-in auth otherwise ok | `.env:17-18` |
| 5 | **Authorization (Permissions)** | ⚠️ PARTIAL | 🟠 HIGH | Custom admin routes unverified; line-item price endpoint unprotected | SEC-005, SEC-011 |
| 6 | **Database Security** | ⚠️ PARTIAL | 🟡 MEDIUM | ORM used (no raw SQL found); default Docker passwords | `docker-compose.yml` |
| 7 | **Input Validation** | ⚠️ PARTIAL | 🟡 MEDIUM | Zod used on most routes; price_adjustment unbounded; blog content unlimited | `validation.ts` |
| 8 | **API Rate Limiting** | ⚠️ PARTIAL | 🟠 HIGH | Implemented but in-memory only; skipped if NODE_ENV wrong | `middlewares.ts`, `rate-limit.ts` |
| 9 | **File Uploads** | ✅ N/A | N/A | No file upload endpoints found; media stored as URLs only | — |
| 10 | **API Error Handling** | ✅ PASS | INFO | Generic errors returned; no stack traces or internal paths exposed | All routes |
| 11 | **Debug Logs** | ✅ PASS | INFO | `console.log` only in test/archive scripts; production logger sanitizes data | `logger.ts` |
| 12 | **Sensitive Info Disclosure** | ✅ PASS | INFO | No stack traces, DB errors, or credentials in API responses | All routes |
| 13 | **Mobile / Responsive UI** | ❌ UNABLE TO VERIFY | N/A | No browser available for visual/responsive testing | — |
| 14 | **Slow Internet / Network Failures** | ⚠️ PARTIAL | 🟡 MEDIUM | Timeouts implemented; in-memory orders lost on restart (SEC-014) | `commerce.ts` |
| 15 | **Payments & Webhooks** | ❌ FAIL | 🔴 CRITICAL | Simulation bypass; callback unverified; client amount trusted | Multiple files |
| 16 | **Business Logic Abuse** | ❌ FAIL | 🟠 HIGH | Custom price endpoint exploitable; campaign codes leakable | SEC-011, SEC-015 |
| 17 | **Security Headers** | ❌ FAIL | 🟡 MEDIUM | No security headers in production Next.js config | `next.config.ts:61` |
| 18 | **CORS Configuration** | ⚠️ PARTIAL | 🟡 MEDIUM | Localhost origins in active `.env` | `.env:8-10` |
| 19 | **CSRF Protection** | ✅ PASS | N/A | Next.js App Router + `SameSite: lax` cookies; CSRF not required for this pattern | `cookies.ts` |
| 20 | **Session & Cookie Security** | ✅ PASS | N/A | Cart cookie: `httpOnly`, `Secure` in production, `SameSite: lax` | `cookies.ts` |
| 21 | **Dependency Security** | ⚠️ UNVERIFIED | INFO | Dependencies appear current; `npm audit` not run | `package.json` |
| 22 | **Environment Config** | ❌ FAIL | 🔴 CRITICAL | Placeholder secrets in runtime `.env` | `.env:17-18` |
| 23 | **Docker / Deployment Config** | ⚠️ PARTIAL | 🟡 MEDIUM | Default DB password; Redis unauthenticated | `docker-compose.yml` |
| 24 | **Git / Repository Hygiene** | ❌ FAIL | 🔴 CRITICAL | Real keys in `.env`; publishable key in test scripts | `.env`, test files |
| 25 | **Newsletter / Contact Forms** | ⚠️ PARTIAL | INFO | Functions return success but drop all data silently | `commerce.ts:606` |
| 26 | **AI Chat Feature** | ❌ BROKEN | INFO | `/api/chat` route referenced but missing | `chat-panel.tsx:43` |

---

## 11. WHAT WAS & WAS NOT TESTED

### ✅ Statically Inspected (Confirmed)
- All custom backend API routes (`/api/admin/*`, `/api/store/*`)
- Middleware and rate limiting configuration
- Zod validation schemas for all custom routes
- Frontend checkout flow end-to-end (code path analysis)
- Razorpay payment integration (create-order, verify, callback)
- Environment variable files (`.env`, `.env.example`, `.env.template`)
- Docker Compose infrastructure configuration
- Frontend Next.js configuration (`next.config.ts`)
- Cookie handling and session management (`cookies.ts`)
- Logger sanitization behavior (`logger.ts`)
- Error handling patterns across all routes
- Seed and migration scripts
- Dependency versions (by manifest review)
- Repository hygiene (`.gitignore`, test scripts, scratch files)

### ❌ Could Not Be Verified (Dynamic Testing Required)

| Area | Why Not Tested |
|---|---|
| Admin route auth enforcement on custom routes | Requires live backend + browser session |
| Actual rate limiting effectiveness | Requires HTTP tooling with session control |
| Razorpay HMAC verification with real webhook | Requires Razorpay account and signed request |
| Mobile responsive behavior | No browser available |
| SQL injection via ORM | MedusaJS ORM assumed to parametrize; not confirmed dynamically |
| `/api/chat` route behavior | Route does not exist in codebase |
| Production security header delivery | No production URL available |
| Database network exposure | No access to production infrastructure |
| Redis authentication bypass | No access to Redis instance |
| Full `npm audit` results | Not run (read-only constraint) |

---

## 12. REMEDIATION PLAN

### 🔴 Phase 1 — Before ANY Deployment (Do These NOW)

- [ ] **Rotate Razorpay API keys** (test + live) in Razorpay dashboard
- [ ] Replace `.env` Razorpay values with placeholders; use `.env.local` for real values
- [ ] **Remove `handleSimulateSuccess`** from `checkout-form.tsx`
- [ ] **Remove `order_sim_*` bypass** from `verify/route.ts` — always verify signature
- [ ] **Replace JWT/Cookie secrets** in backend `.env` with `openssl rand -base64 48` values
- [ ] **Remove hardcoded API keys** from `test-promo-api.js`, `test-frontend-apply.js`, `scratch_test.ts`
- [ ] **Add signature verification** to Razorpay callback GET endpoint (or remove it)
- [ ] **Require `cartId`** in create-order; reject if Medusa amount cannot be fetched
- [ ] **Move or protect** `/store/carts/:id/line-items/custom` endpoint

### 🟠 Phase 2 — Before Going Live

- [ ] Replace in-memory `rateLimitMap` with Redis-backed rate limiter
- [ ] **Add production security headers** to `next.config.ts` (X-Frame-Options, NOSNIFF, HSTS, Referrer-Policy)
- [ ] **Remove `?all=true` parameter** from public campaigns endpoint
- [ ] Update CORS variables to production domains only (no localhost)
- [ ] **Verify custom admin routes require authentication** (dynamic test: unauthenticated request → 401)
- [ ] Ensure `NODE_ENV=production` is set in all production processes
- [ ] Add bounds validation to `price_adjustment`: `.min(-100000).max(100000)`
- [ ] Add max length to blog `content` field: `.max(500000)`

### 🟡 Phase 3 — Before Public Launch

- [ ] **Replace wildcard `**`** in Next.js image remote patterns with explicit hostnames
- [ ] **Remove default `:-password` fallback** from PostgreSQL in docker-compose
- [ ] **Add Redis authentication** and bind to internal network only
- [ ] Replace `recentOrdersMap` with Redis-backed order store + 1-hour TTL
- [ ] Move test scripts to `tests/` directory or remove from repo
- [ ] Add `NODE_ENV !== 'production'` guard to all scripts in `scripts-archive/`
- [ ] Run `npm audit` / `bun audit` on all packages and remediate HIGH+ vulnerabilities

### 🔵 Phase 4 — Post-Launch Hardening

- [ ] Implement newsletter subscription email delivery
- [ ] Implement contact form message storage/delivery
- [ ] Investigate and implement (or remove) `/api/chat` route
- [ ] Move Razorpay `<Script>` to checkout page only
- [ ] Gate `<NavigationReporter>` behind `NODE_ENV === 'development'`
- [ ] Add health check endpoints for production monitoring
- [ ] Set up centralized structured logging (not console-based)
- [ ] Set up production error tracking (Sentry / Datadog)

---

## 13. SECRET ROTATION GUIDE

### Step 1 — Rotate Razorpay Keys
1. Log in to [Razorpay Dashboard](https://dashboard.razorpay.com) → Settings → API Keys
2. Click **Regenerate Test Key** (and Live Key when ready)
3. Update `.env.local` with new values (never `.env`)

### Step 2 — Generate Strong Backend Secrets
```bash
# JWT Secret (48 bytes → 64 char base64)
openssl rand -base64 48
# → Example: 4K/FeKjZxCvqQ... (use this in JWT_SECRET)

# Cookie Secret
openssl rand -base64 48
# → Example: mRt3Lp8XqZnQ... (use this in COOKIE_SECRET)

# Auth MFA Encryption Key (32 bytes → 64 char hex)
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
# → Example: a3f7c2d1... (use this in AUTH_MFA_ENCRYPTION_KEY)
```

### Step 3 — Update Backend `.env`
```env
# ✅ Replace these placeholder values:
JWT_SECRET=<output from openssl rand above>
COOKIE_SECRET=<output from openssl rand above>
AUTH_MFA_ENCRYPTION_KEY=<output from node command above>
```

### Step 4 — Verify Secrets Are Not Committed
```bash
# Should return zero results:
grep -r "replace_with_secure" . --include="*.env"
grep -r "rzp_test_Tge6ES0nAYgfLm" . --include="*.js" --include="*.ts"
grep -r "hTtOIqNww9M159kSzL9294s0" . --include="*.js" --include="*.ts"
```

---

## 14. FINAL VERIFICATION CHECKLIST

After all fixes are implemented, use this checklist to confirm each issue is resolved:

### Critical Issues
- [ ] `grep -r "rzp_test_Tge6ES0nAYgfLm" .` → no results
- [ ] `grep -r "pk_63a72c5bee39e67a8be438c3dabd0b63dcf83417c2ecd9180d0d6105b068303b" .` → no results
- [ ] `grep -r "replace_with_secure" . --include="*.env"` → no results
- [ ] POST `/api/checkout/razorpay/verify` with `razorpay_order_id: "order_sim_test"` → HTTP 400
- [ ] GET `/api/checkout/razorpay/callback?cartId=X&razorpay_payment_id=fake` → non-200 response
- [ ] `echo -n "$JWT_SECRET" | wc -c` → greater than 44 characters

### High Issues
- [ ] `curl -X GET http://your-backend/api/admin/workshops` (no auth) → HTTP 401
- [ ] POST `/api/checkout/razorpay/create-order` without `cartId` → HTTP 400
- [ ] POST `/store/carts/X/line-items/custom` with `unit_price: 1` from customer → 403 or actual price used
- [ ] Send 31 requests to `/api/auth/*` within 15 minutes → HTTP 429 persists after server restart

### Medium Issues
- [ ] `curl -I https://yourdomain.com` shows: `X-Frame-Options`, `X-Content-Type-Options`, `Strict-Transport-Security`
- [ ] `curl https://yourdomain.com/store/campaigns?all=true` → 403 or only active campaigns
- [ ] CORS preflight from `http://localhost:3000` to production backend → 403
- [ ] POST `price_adjustment: -999999` to customization create endpoint → validation error
- [ ] Complete payment, restart server, load `/order/success/[id]` → page loads correctly

### Low Issues
- [ ] `ls yournextstore/test-promo-api.js yournextstore/test-frontend-apply.js` → files removed/moved
- [ ] Running destructive scripts in production environment → error thrown before executing
- [ ] Redis in production has `requirepass` set and port not externally accessible
- [ ] `curl -I https://yourdomain.com/api/checkout/razorpay/create-order` → response does not proxy internal URLs

---

*Audit conducted: 2026-10-01 | Read-only | No modifications made to any project file*
