# 28 — Security Audit
## letter-ink-backend · Security Analysis

> **Analysis only. Do not fix anything in the codebase.**
> This document records security findings for future remediation during the PRD and implementation phase.

---

## 1. Summary

| Category | Status |
|---|---|
| Authentication framework | Medusa-managed — adequate |
| Authorization framework | Medusa-managed — adequate |
| Custom route validation | **Critical gap** — no input validation |
| Secret management | **Critical** — default secrets in use |
| Cross-module data integrity | Gaps |
| Error handling / leakage | Minor leakage |
| CORS configuration | Dev-only settings in use |
| Admin widget | Runtime error (broken import) |

---

## 2. Critical Findings

### SEC-01: Default JWT and Cookie Secrets

| Field | Value | Source |
|---|---|---|
| **Severity** | CRITICAL | |
| **Location** | `apps/backend/.env:6-7` | |
| **Evidence** | `JWT_SECRET=supersecret`, `COOKIE_SECRET=supersecret` | |
| **Risk** | Any attacker knowing the JWT secret can forge valid admin tokens and customer session tokens. This is a complete authentication bypass. |
| **Recommended direction** | Generate 256-bit random secrets using `openssl rand -base64 32`. Store in a secrets manager (AWS Secrets Manager, HashiCorp Vault) for production. Never commit real secrets to git. |

---

### SEC-02: No Input Validation on Custom API Routes

| Field | Value |
|---|---|
| **Severity** | HIGH |
| **Location** | All files in `src/api/admin/customisation/` and `src/api/store/products/[productId]/customisation/` |
| **Evidence** | `req.body as any` used in every POST/PATCH handler. Example from `groups/route.ts:13`: `const group = await customisationService.createCustomisationGroups(req.body as any)` |
| **Risk** | Arbitrary data can be written to the database. An attacker with admin access can inject malformed data (excessively large strings, unexpected types, unexpected fields) that breaks the module's integrity. Without validation, the ORM's type coercion is the only safety net. |
| **Recommended direction** | Add Zod schema validation to every POST and PATCH handler. Zod is already installed (`zod: 4.2.0` in `package.json`) but not used. |

---

### SEC-03: Admin Widget Broken Import (Runtime Error)

| Field | Value |
|---|---|
| **Severity** | HIGH |
| **Location** | `src/admin/widgets/product-customisation-widget.tsx:4` |
| **Evidence** | `import { sdk } from "../lib/sdk"` — `src/admin/lib/sdk.ts` does not exist |
| **Risk** | The admin dashboard widget will throw a module-not-found error at runtime when viewing any product detail page. This will crash the widget, potentially destabilizing the admin dashboard view. The `sdk` import is declared but never used in the function body, so the widget falls back to `fetch()` — but the import error still occurs at load time. |
| **Recommended direction** | Remove the unused `sdk` import. Use `fetch()` directly (which the widget already does). |

---

## 3. High Severity Findings

### SEC-04: CORS Allows External Development Domains in Non-Dev Environments

| Field | Value |
|---|---|
| **Severity** | MEDIUM |
| **Location** | `apps/backend/.env:2-4` |
| **Evidence** | `STORE_CORS=http://localhost:8000,https://docs.medusajs.com` — `docs.medusajs.com` is in the CORS whitelist |
| **Risk** | `https://docs.medusajs.com` can make cross-origin requests to the API from any user's browser visiting that domain. While this is unlikely to be exploited in practice (Medusa docs don't make authenticated requests), it is not a production-safe pattern. |
| **Recommended direction** | CORS must only allow the actual Letter Ink frontend origin in production. Remove all external development domains. |

---

### SEC-05: No Product ID Validation in Custom Admin Routes

| Field | Value |
|---|---|
| **Severity** | MEDIUM |
| **Location** | `src/api/admin/customisation/products/[productId]/route.ts` |
| **Evidence** | The handler queries `customisationService.listCustomisationProductGroups({ product_id: productId })` without verifying that `productId` corresponds to a real Medusa product |
| **Risk** | An admin can create product-group associations for non-existent product IDs, creating orphaned data. No validation prevents this. |
| **Recommended direction** | Resolve the product from the product module before accepting the association. |

---

### SEC-06: Raw Error Objects Returned in 500 Responses

| Field | Value |
|---|---|
| **Severity** | LOW-MEDIUM |
| **Location** | `src/api/store/products/[productId]/customisation/route.ts:78-81` |
| **Evidence** | `catch (error) { console.error("Error fetching product customisation:", error); res.status(500).json({ error: "Failed to fetch customisation config" }) }` |
| **Risk** | While the client only receives a generic error message, the full error (including stack traces and potentially internal module paths) is written to `console.error`. In a production environment with centralized logging (e.g., CloudWatch), these stack traces could expose internal architecture details. More importantly, the generic error provides no diagnostic information to operators. |
| **Recommended direction** | Log structured errors with a correlation ID. Return the correlation ID in the error response for debugging. |

---

## 4. Medium Severity Findings

### SEC-07: Publishable API Key Scope

| Field | Value |
|---|---|
| **Severity** | MEDIUM |
| **Location** | Medusa store API / seed data |
| **Evidence** | The seed creates a publishable API key linked to the default sales channel |
| **Risk** | The generated publishable API key is committed in the database seeded from source-controlled migration scripts. Any developer who seeds the database gets the same key (it changes each time due to ULID generation, so this is less of a concern — but the seed pattern for key management should be documented). |
| **Recommended direction** | Document how to rotate the publishable API key after initial setup. Ensure the frontend `x-publishable-api-key` header uses the correct key per environment. |

---

### SEC-08: AUTH_MFA_ENCRYPTION_KEY Present but Unused

| Field | Value |
|---|---|
| **Severity** | LOW |
| **Location** | `apps/backend/.env:8` |
| **Evidence** | `AUTH_MFA_ENCRYPTION_KEY=cc85b5db913ceae6e8b63bb4c9d36f2b9681000db283d3bdb72f9e7c88701212` — not referenced in `medusa-config.ts` |
| **Risk** | Unknown purpose — may be required for an MFA feature that was configured and abandoned. If MFA is enabled via Medusa's auth module, this key protects TOTP secrets. Its presence without configuration reference creates confusion about whether MFA is active. |
| **Recommended direction** | Determine if MFA is intended. If not, remove the variable. If yes, verify it is correctly referenced in auth module configuration. |

---

## 5. Medusa Framework Security (Adequate)

The following areas are handled by Medusa's framework and are adequate:

| Area | Implementation |
|---|---|
| Admin route authentication | JWT-based, managed by Medusa auth middleware |
| Store route authentication | Session/JWT for logged-in customers; publishable API key for public endpoints |
| Password hashing | Managed by Medusa auth module (argon2 or bcrypt) |
| SQL injection protection | MikroORM parameterized queries — no raw SQL in custom code |
| Session management | Redis-backed, managed by Medusa |
| Admin CSRF protection | Medusa's cookie-based auth includes CSRF protections |

---

## 6. Security Remediation Priority Order

| Priority | Finding | Action |
|---|---|---|
| 1 | SEC-01: Default secrets | Change before any external-facing deployment |
| 2 | SEC-02: No input validation | Add Zod to all custom routes |
| 3 | SEC-03: Broken widget import | Remove unused import |
| 4 | SEC-04: CORS scope | Configure per-environment CORS |
| 5 | SEC-05: No product ID validation | Validate product exists before association |
| 6 | SEC-06: Error logging | Implement structured logging with correlation IDs |
| 7 | SEC-07: API key management | Document rotation procedure |
| 8 | SEC-08: MFA key | Clarify intent and remove if unused |
