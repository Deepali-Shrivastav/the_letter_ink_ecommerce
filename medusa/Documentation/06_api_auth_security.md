# The Letter Ink — Medusa Backend: Auth API & Security Guide

> **Document:** 06 — Auth API Reference & Security Guide  
> **Medusa Version:** 2.20.1

---

## Table of Contents

1. [Auth System Overview](#1-auth-system-overview)
2. [Auth API Endpoints](#2-auth-api-endpoints)
3. [Customer Auth Flows](#3-customer-auth-flows)
4. [Admin User Auth Flows](#4-admin-user-auth-flows)
5. [OAuth Flows](#5-oauth-flows)
6. [MFA (Multi-Factor Authentication)](#6-mfa-multi-factor-authentication)
7. [Password Reset Flow](#7-password-reset-flow)
8. [Token Refresh](#8-token-refresh)
9. [Session Management](#9-session-management)
10. [API Keys](#10-api-keys)
11. [RBAC (Role-Based Access Control)](#11-rbac-role-based-access-control)
12. [Security Headers & Middleware](#12-security-headers--middleware)

---

## 1. Auth System Overview

Medusa v2 uses a **decoupled auth system** with three actor types:

| Actor Type | Routes | Token Scope |
|---|---|---|
| `customer` | `/store/*` | Storefront operations |
| `user` | `/admin/*` | Admin dashboard operations |
| `*` (any) | `/auth/*` | Auth operations |

### Auth Architecture

```
/auth/:actor_type/:auth_provider      ← login
/auth/:actor_type/:auth_provider/register  ← registration
/auth/session                         ← exchange bearer for session
/auth/token/refresh                   ← refresh JWT
```

Supported providers (all are `auth_provider` values):

| Provider | Value | Description |
|---|---|---|
| Email/Password | `emailpass` | Default credentials |
| Google OAuth | `google` | Google SSO |
| GitHub OAuth | `github` | GitHub SSO |
| OIDC | `oidc` | Custom OpenID Connect |

---

## 2. Auth API Endpoints

### POST `/auth/:actor_type/:auth_provider`

**Login.** Authenticate with credentials.

**Example (customer email/password):**

```
POST /auth/customer/emailpass
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securepassword"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

### POST `/auth/:actor_type/:auth_provider/register`

**Register** a new auth identity (creates auth identity, does NOT create customer/user record).

**Example:**
```
POST /auth/customer/emailpass/register
```

**Request Body:**
```json
{
  "email": "newuser@example.com",
  "password": "securepassword"
}
```

**Response:**
```json
{
  "token": "eyJ..."
}
```

After registration, call `POST /store/customers` with the bearer token to create the customer profile.

---

### GET `/auth/:actor_type/:auth_provider`

Initiate OAuth flow. Returns redirect URL.

**Example:**
```
GET /auth/customer/google
```

**Response:**
```json
{
  "location": "https://accounts.google.com/o/oauth2/auth?..."
}
```

---

### POST `/auth/:actor_type/:auth_provider/callback`

Handle OAuth callback.

**Request Body:**
```json
{
  "code": "oauth_code_from_provider",
  "state": "..."
}
```

**Response:**
```json
{
  "token": "eyJ..."
}
```

---

### POST `/auth/:actor_type/:auth_provider/update`

Update credentials (e.g., change password). Requires an `update_token` from the reset password flow.

**Request Body:**
```json
{
  "password": "newSecurePassword123"
}
```

---

### POST `/auth/session`

Exchange a bearer token for a session cookie.

**Auth:** Bearer token required.

**Response:** Sets `connect.sid` session cookie. `{ "customer": {...} }` or `{ "user": {...} }`

---

### DELETE `/auth/session`

Log out (destroy session).

**Auth:** Session cookie required.

**Response:** `200 OK`

---

### POST `/auth/token/refresh`

Refresh an expiring JWT.

**Auth:** Bearer token or session.

**Response:**
```json
{
  "token": "eyJ..."
}
```

---

### POST `/auth/verification/request`

Request an email verification or phone verification.

**Auth:** Bearer or session (unregistered allowed).

**Request Body:**
```json
{
  "type": "email_verification"   // verification type
}
```

---

### POST `/auth/verification/confirm`

Confirm verification with OTP code.

**Request Body:**
```json
{
  "token": "123456"
}
```

---

### POST `/auth/:actor_type/:auth_provider/reset-password`

Request a password reset email.

**Request Body:**
```json
{
  "identifier": "user@example.com"
}
```

**Response:** `200 OK` (always — no email existence disclosure)

---

### POST `/auth/user/:auth_provider`

Register admin user auth identity. Requires authenticated admin user bearer.

---

## 3. Customer Auth Flows

### Full Registration Flow

```
1. POST /auth/customer/emailpass/register
   Body: { email, password }
   → Returns: { token }

2. POST /store/customers
   Header: Authorization: Bearer <token>
   Body: { email, first_name, last_name, ... }
   → Returns: { customer }

3. Now use Bearer token for all /store/* requests
```

### Login Flow

```
1. POST /auth/customer/emailpass
   Body: { email, password }
   → Returns: { token }

2. Use Bearer token or exchange for session:
   POST /auth/session
   Header: Authorization: Bearer <token>
   → Sets connect.sid cookie
```

### Guest Checkout Flow

```
No auth needed for most /store/* routes.
Cart is identified by cart ID stored client-side.
Customer association is optional:
  POST /store/carts/:id/customer  (with bearer token)
```

---

## 4. Admin User Auth Flows

### Login Flow

```
1. POST /auth/user/emailpass
   Body: { email, password }
   → Returns: { token }

2. Use Bearer token:
   Authorization: Bearer <token>
   for all /admin/* requests

3. OR exchange for session:
   POST /auth/session
   → Sets connect.sid cookie
```

### New Admin Setup (via invite)

```
1. Admin creates invite:
   POST /admin/invites
   Body: { email: "newadmin@example.com" }

2. Invitee clicks link, registers:
   POST /auth/user/emailpass/register
   Body: { email, password }
   → Returns: { token }

3. Invitee accepts invite:
   POST /admin/invites/accept
   Body: { invite_token, auth_token, first_name, last_name }
```

---

## 5. OAuth Flows

### Google OAuth (Customer)

```
1. GET /auth/customer/google
   → Response: { location: "https://accounts.google.com/..." }

2. Browser redirects to Google, user authenticates

3. Google redirects to callback_url:
   POST /auth/customer/google/callback
   Body: { code, state }
   → Returns: { token }

4. If new user: POST /store/customers (register profile)
5. Use token for subsequent requests
```

**Configuration (medusa-config.ts):**

```typescript
modules: {
  [Modules.AUTH]: {
    resolve: "@medusajs/auth",
    options: {
      providers: [
        {
          resolve: "@medusajs/auth-google",
          id: "google",
          options: {
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackUrl: process.env.GOOGLE_CALLBACK_URL,
          }
        }
      ]
    }
  }
}
```

### GitHub OAuth

Same flow; provider id: `github`. Required env:
- `GITHUB_CLIENT_ID`
- `GITHUB_CLIENT_SECRET`
- `GITHUB_CALLBACK_URL`

### OIDC

Provider id: `oidc`. Required env:
- `OIDC_CLIENT_ID`
- `OIDC_CLIENT_SECRET`
- `OIDC_CALLBACK_URL`
- `OIDC_DISCOVERY_URL`

---

## 6. MFA (Multi-Factor Authentication)

Medusa supports MFA with TOTP-based factors.

### GET `/auth/mfa/factors`

**Auth:** Bearer or session (unregistered allowed).

List enrolled MFA factors.

---

### POST `/auth/mfa/factors`

Create (enroll) MFA factor.

**Auth:** Bearer or session.

**Request Body:**
```json
{
  "type": "totp"
}
```

**Response:**
```json
{
  "factor": {
    "id": "mfa_01...",
    "type": "totp",
    "totp_uri": "otpauth://totp/...",
    "secret": "BASE32SECRET"
  }
}
```

---

### POST `/auth/mfa/factors/:id/verify`

Verify and activate factor.

**Request Body:**
```json
{
  "otp": "123456"
}
```

---

### DELETE `/auth/mfa/factors/:id`

Disable/remove factor.

**Request Body:**
```json
{
  "otp": "123456"   // current OTP to confirm removal
}
```

---

### POST `/auth/mfa/challenges/:id/verify`

Verify MFA challenge during login.

**Request Body:**
```json
{
  "otp": "123456"
}
```

**Response:**
```json
{
  "token": "eyJ..."   // full access token
}
```

---

### POST `/auth/mfa/recovery-codes`

Generate backup recovery codes.

**Request Body:**
```json
{
  "otp": "123456"
}
```

**Response:**
```json
{
  "recovery_codes": ["XXXX-XXXX", "YYYY-YYYY", ...]
}
```

---

## 7. Password Reset Flow

```
1. Customer/User requests reset:
   POST /auth/customer/emailpass/reset-password
   Body: { identifier: "user@example.com" }
   → 200 OK (email sent with reset link)

2. User clicks link (contains update_token)

3. User sets new password:
   POST /auth/customer/emailpass/update
   Header: Authorization: Bearer <update_token>
   Body: { password: "newpassword" }
   → 200 OK

4. Login with new password:
   POST /auth/customer/emailpass
```

---

## 8. Token Refresh

JWT tokens have an expiry. Refresh before expiration:

```
POST /auth/token/refresh
Authorization: Bearer <current_token>

→ { token: "new_jwt_token" }
```

---

## 9. Session Management

Medusa supports cookie-based sessions as an alternative to bearer tokens.

| Action | Endpoint |
|---|---|
| Create session from token | `POST /auth/session` |
| Destroy session | `DELETE /auth/session` |

Session cookies are HTTP-only and signed with `COOKIE_SECRET`.

---

## 10. API Keys

### Types

| Type | Prefix | Use Case |
|---|---|---|
| **Publishable** | `pk_...` | Client-side; identifies sales channel scope |
| **Secret** | `sk_...` | Server-side; full API access |

### Publishable API Key

Used by the storefront to scope requests to the correct sales channel:

```
Header: x-publishable-api-key: pk_...
```

Publishable keys are associated with one or more sales channels via:
```
POST /admin/api-keys/:id/sales-channels/batch
```

### Secret API Key

Used for server-to-server requests. Provides the same access level as an authenticated admin session.

```
Header: x-medusa-access-token: sk_...
```

---

## 11. RBAC (Role-Based Access Control)

Medusa v2 includes a built-in RBAC system for admin users.

### Concepts

| Term | Description |
|---|---|
| **Role** | A named set of permissions |
| **Permission** | An `action` + `resource_type` pair |
| **PolicyOperation** | `read`, `create`, `update`, `delete` |

### Policy Declaration (in route middleware)

```typescript
{
  matcher: "/admin/orders",
  policies: [
    {
      resource: "order",           // resource type
      operation: PolicyOperation.read,
    },
  ],
}
```

### Policy Check Flow

```
Request arrives at /admin/orders
  → authenticate() verifies JWT
  → RBAC middleware checks: does actor's role include order:read?
    → Yes: proceed
    → No: 403 Forbidden
```

### Permission Reference

| Route | Required Permission |
|---|---|
| `GET /admin/orders*` | `order:read` |
| `POST /admin/orders/:id` | `order:update` |
| `POST /admin/orders/:id/fulfillments` | `fulfillment:create` |
| `POST /admin/orders/:id/fulfillments/:id/cancel` | `fulfillment:update` |
| `POST /admin/orders/:id/credit-lines` | `credit_line:create` |
| All other admin routes | Role-specific (check RBAC module) |

---

## 12. Security Headers & Middleware

### HTTP Security

Medusa's Express stack includes:

```typescript
// Compression
compression()

// Body parsing
express.json({ limit: "50mb" })
express.urlencoded({ extended: true })

// IP extraction (for rate limiting / logging)
requestIp.getClientIp(req)

// Request ID (for distributed tracing)
req.requestId = req.headers["x-request-id"] ?? uuid()
```

### CORS

Configure CORS in `medusa-config.ts`:

```typescript
projectConfig: {
  http: {
    adminCors: "http://localhost:5173,https://admin.theletterink.com",
    storeCors: "http://localhost:3000,https://theletterink.com",
    authCors: "http://localhost:3000,https://theletterink.com",
    jwtSecret: process.env.JWT_SECRET!,
    cookieSecret: process.env.COOKIE_SECRET!,
  }
}
```

### JWT Configuration

| Setting | Env Variable | Default |
|---|---|---|
| JWT Secret | `JWT_SECRET` | **Required** |
| Cookie Secret | `COOKIE_SECRET` | **Required** |
| JWT Expiry | Configured per module | 7 days |

### Password Security

- Passwords are **never stored in plaintext**
- Hashed using **bcrypt** with a random salt per user
- Stored in `ProviderIdentity.provider_metadata`
- The `salt` field in `ApiKey` table uses bcrypt for token hashing

### Environment Secrets Required

```bash
# Minimum required secrets
JWT_SECRET=<random 64+ char string>
COOKIE_SECRET=<random 64+ char string>
DATABASE_URL=postgresql://user:pass@host:5432/db

# OAuth providers (if used)
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_CALLBACK_URL=
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=
GITHUB_CALLBACK_URL=

# Payment
STRIPE_API_KEY=
STRIPE_WEBHOOK_SECRET=
```
