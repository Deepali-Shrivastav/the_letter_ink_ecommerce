# 32 — Configuration Reference
## letter-ink-backend · Environment Variables

> **Analysis only. Do not modify the codebase.**
> Actual secret values are NOT exposed in this document.

---

## 1. Environment File Locations

| File | Purpose |
|---|---|
| `apps/backend/.env` | Active development configuration (gitignored) |
| `apps/backend/.env.template` | Template for new developers (committed) |

---

## 2. Complete Environment Variable Reference

| Variable | Required | Default (template) | Sensitive | Environment | Purpose | Notes |
|---|---|---|---|---|---|---|
| `DATABASE_URL` | **Yes** | *(empty)* | Yes | All | PostgreSQL connection string | Format: `postgres://user:pass@host:5432/dbname` |
| `DB_NAME` | No | `medusa-backend` | No | Dev | Database name reference | Used in dev scripts; `DATABASE_URL` takes precedence |
| `REDIS_URL` | **Yes** | `redis://localhost:6379` | No | All | Redis connection string | Used for event bus and caching |
| `JWT_SECRET` | **Yes** | `supersecret` | **Yes — CRITICAL** | All | Signs JWT tokens for auth | Must be 256-bit random in production |
| `COOKIE_SECRET` | **Yes** | `supersecret` | **Yes — CRITICAL** | All | Signs session cookies | Must be 256-bit random in production |
| `STORE_CORS` | **Yes** | `http://localhost:8000,https://docs.medusajs.com` | No | All | Allowed origins for `/store/*` routes | Must be frontend domain only in production |
| `ADMIN_CORS` | **Yes** | `http://localhost:5173,http://localhost:9000,https://docs.medusajs.com` | No | All | Allowed origins for `/admin/*` routes | Must be admin domain only in production |
| `AUTH_CORS` | **Yes** | `http://localhost:5173,http://localhost:9000,http://localhost:8000,https://docs.medusajs.com` | No | All | Allowed origins for `/auth/*` routes | Must be exact domains in production |
| `MEDUSA_ADMIN_ONBOARDING_TYPE` | No | `default` | No | Dev | Controls admin onboarding UI | Remove in production |
| `AUTH_MFA_ENCRYPTION_KEY` | Unknown | *(only in .env)* | Yes | Unknown | MFA encryption key | Present in `.env` but not in `medusa-config.ts` — purpose unclear |

---

## 3. Variables Present in `.env` but NOT in `.env.template`

| Variable | Value (masked) | Status |
|---|---|---|
| `MEDUSA_ADMIN_ONBOARDING_TYPE` | `default` | Should be in template with explanation |
| `AUTH_MFA_ENCRYPTION_KEY` | `[hex string]` | Unknown if intentionally omitted from template |
| `REDIS_URL` | Appears twice in `.env` | Duplicate — second occurrence overrides first |

---

## 4. Variables Needed but NOT Yet Present

These variables will be needed as The Letter Ink backend grows:

| Variable | Purpose | Required When |
|---|---|---|
| `STRIPE_API_KEY` | Stripe payment provider | Adding Stripe payments |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook verification | Adding Stripe webhooks |
| `RAZORPAY_KEY_ID` | Razorpay payment provider | Adding Razorpay payments |
| `RAZORPAY_KEY_SECRET` | Razorpay auth | Adding Razorpay |
| `SENDGRID_API_KEY` | Email notifications | Adding email provider |
| `S3_BUCKET` | File storage bucket name | Adding S3 file storage |
| `S3_ACCESS_KEY_ID` | S3 auth | Adding S3 |
| `S3_SECRET_ACCESS_KEY` | S3 auth | Adding S3 |
| `S3_REGION` | AWS region | Adding S3 |
| `FRONTEND_URL` | Letter Ink storefront URL | CORS, email links |
| `ADMIN_URL` | Letter Ink admin URL | CORS |
| `NODE_ENV` | `production` / `development` | All environments |

---

## 5. `medusa-config.ts` Reference

```typescript
// apps/backend/medusa-config.ts — current configuration

import { loadEnv, defineConfig } from '@medusajs/framework/utils'

loadEnv(process.env.NODE_ENV || 'development', process.cwd())

module.exports = defineConfig({
  projectConfig: {
    databaseUrl: process.env.DATABASE_URL,    // Maps to DATABASE_URL
    http: {
      storeCors: process.env.STORE_CORS!,    // Maps to STORE_CORS
      adminCors: process.env.ADMIN_CORS!,    // Maps to ADMIN_CORS
      authCors: process.env.AUTH_CORS!,      // Maps to AUTH_CORS
      jwtSecret: process.env.JWT_SECRET,     // Maps to JWT_SECRET
      cookieSecret: process.env.COOKIE_SECRET, // Maps to COOKIE_SECRET
    }
  },
  modules: [
    {
      resolve: "./src/modules/customisation", // Custom module
    },
  ]
})
```

**What is NOT configured in `medusa-config.ts`:**
- No Redis configuration (Medusa picks it up from `REDIS_URL` env var directly)
- No payment providers
- No file storage provider
- No notification provider
- No additional Medusa modules beyond the custom `customisation` module

---

## 6. `.npmrc` Configuration

```
# apps/backend/.npmrc (root level)
legacy-peer-deps=true
```

This disables strict peer dependency resolution in npm. This is a common workaround for dependency conflicts in complex React admin setups. It means some peer dependencies may be incompatible — should be audited when upgrading packages.

---

## 7. Medusa Module Defaults

Medusa automatically activates these core modules without configuration:
- Product, Cart, Order, Inventory, Stock Location
- Payment, Fulfillment, Customer, Pricing
- Promotion, Tax, Store, Auth, Notification, File
- API Key, Sales Channel, Currency, Draft Order

These modules work with their default configuration. Provider-specific configuration (e.g., Stripe) requires adding entries to `medusa-config.ts`.

---

## 8. Security Recommendations for Configuration

| Action | Priority |
|---|---|
| Replace `JWT_SECRET` with 256-bit random value for production | Critical |
| Replace `COOKIE_SECRET` with 256-bit random value for production | Critical |
| Use environment-specific `.env` files (`.env.production`, `.env.staging`) | High |
| Store production secrets in AWS Secrets Manager or Vault | High |
| Update `.env.template` with all current variable names | Medium |
| Remove `MEDUSA_ADMIN_ONBOARDING_TYPE` from production | Low |
| Fix the duplicate `REDIS_URL` in `.env` | Low |
