# 09 — Authentication and Authorization
## letter-ink-backend · Security Layer Analysis

> **Analysis only. Do not modify the codebase.**

---

## 1. Authentication Architecture

Medusa v2 uses a modular auth system with these components:

| Component | Description |
|---|---|
| **Auth Module** | `Modules.AUTH` — manages auth identities, identity providers, tokens |
| **Auth Providers** | Strategy implementations (email+password, Google OAuth, etc.) |
| **JWT** | Stateless tokens for API calls |
| **Session** | Cookie-based sessions (backed by Redis) for admin dashboard |
| **Publishable API Keys** | Non-secret keys that scope store API access to sales channels |

---

## 2. Auth Configuration

From `medusa-config.ts`:

```typescript
http: {
  jwtSecret: process.env.JWT_SECRET,       // Signs all JWTs — "supersecret" in dev
  cookieSecret: process.env.COOKIE_SECRET, // Signs session cookies — "supersecret" in dev
}
```

From `.env`:

```
AUTH_CORS=http://localhost:5173,http://localhost:9000,http://localhost:8000,https://docs.medusajs.com
```

---

## 3. Actor Types

Medusa supports three actor types, each with different auth requirements:

| Actor | Type | Auth endpoint | Token usage |
|---|---|---|---|
| Admin user | `user` | `POST /auth/user/emailpass` | `Authorization: Bearer <admin_jwt>` |
| Customer | `customer` | `POST /auth/customer/emailpass` | `Authorization: Bearer <customer_jwt>` |
| API (store) | N/A | N/A | `x-publishable-api-key: pk_...` |

---

## 4. Store API Authentication

### Public Endpoints (no auth required)

Examples:
- `GET /store/products` — list products
- `GET /store/products/:id` — product detail
- `GET /store/regions` — regions
- `GET /store/products/:id/customisation` — Letter Ink customisation endpoint (custom)

**Requirement:** All store requests must include `x-publishable-api-key` header. Without it, Medusa returns 401.

### Authenticated Customer Endpoints

Examples:
- `GET /store/customers/me` — requires customer JWT
- `GET /store/orders` — requires customer JWT

**Flow:**
```
1. Customer registers: POST /store/customers
2. Customer logs in: POST /auth/customer/emailpass → { token: "eyJ..." }
3. Subsequent requests: Authorization: Bearer eyJ...
4. Medusa validates JWT → sets req.auth_context.actor_id
```

---

## 5. Admin API Authentication

All `/admin/*` endpoints (except the auth endpoints themselves) require a valid admin JWT.

**Flow:**
```
1. Admin user is created (via CLI or existing admin)
2. Admin logs in: POST /auth/user/emailpass → { token: "eyJ..." }
3. All admin requests: Authorization: Bearer eyJ...
4. Medusa validates token → confirms actor_type === "user" → grants access
```

**Admin session alternative:** The admin dashboard uses cookie-based sessions instead of per-request bearer tokens, managed automatically by the browser.

---

## 6. Custom Route Authentication

### Custom Admin Routes

The custom admin routes (`src/api/admin/customisation/**`) are protected by Medusa's admin middleware automatically because they live under `/admin/`. **No additional auth code was written** — Medusa's middleware chain handles it.

Evidence from `groups/route.ts`:
```typescript
export async function GET(req: MedusaRequest, res: MedusaResponse) {
  // No auth check here — Medusa middleware already verified admin JWT
  const customisationService: CustomisationModuleService = req.scope.resolve(CUSTOMISATION_MODULE)
  // ...
}
```

### Custom Store Routes

The store customisation endpoint (`GET /store/products/:productId/customisation`) is:
- **Public** — no customer auth required
- Accessed with the publishable API key

This is correct for a product configuration endpoint that should be accessible to any visitor.

---

## 7. Security Finding Summary

| # | Finding | Impact |
|---|---|---|
| SEC-01 | `JWT_SECRET=supersecret` — trivially forgeable admin tokens | Critical |
| SEC-02 | `COOKIE_SECRET=supersecret` — trivially forgeable admin sessions | Critical |
| SEC-03 | Custom admin routes inherit Medusa's auth — **correct** | None |
| SEC-04 | Store customisation endpoint is public — **correct** | None |
| SEC-05 | No rate limiting on custom routes | Medium (DoS risk) |
| SEC-06 | Admin user creation only via CLI or existing admin — **correct** | None |
| SEC-07 | Publishable API key not rotated after seeding — potential dev key in prod | Medium |

---

## 8. JWT Token Structure

Medusa-issued JWTs contain:

```json
{
  "actor_id": "user_01...",        // Admin user ID or customer ID
  "actor_type": "user",            // "user" | "customer"
  "auth_identity_id": "authid_...",
  "iat": 1234567890,
  "exp": 1234567890                // Default expiry: 24 hours
}
```

The `actor_type` field is used by Medusa's middleware to gate admin vs. customer endpoints.

---

## 9. Password Security

Medusa's auth module handles password hashing using **argon2** (or bcrypt depending on configuration). No custom password handling code exists in this repository — this is entirely managed by `@medusajs/medusa`'s auth module.

---

## 10. CORS Configuration

```
STORE_CORS=http://localhost:8000,https://docs.medusajs.com
ADMIN_CORS=http://localhost:5173,http://localhost:9000,https://docs.medusajs.com
AUTH_CORS=http://localhost:5173,http://localhost:9000,http://localhost:8000,https://docs.medusajs.com
```

**Issues:**
- `https://docs.medusajs.com` included — the Medusa documentation site is in the CORS whitelist. This is a development leftover and is not appropriate for production.
- Port `5173` is Vite's default dev port — development only.
- Port `8000` is likely the YNS storefront dev port.
- Port `9000` is Medusa itself (for admin dashboard running in browser).

**Production requirement:** CORS must be updated to The Letter Ink's actual domain(s) only.
