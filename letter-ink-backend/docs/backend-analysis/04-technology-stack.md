# 04 — Technology Stack (Complete)
## letter-ink-backend · All Dependencies Classified

> **Analysis only. Do not modify the codebase.**
> Source: `apps/backend/package.json`

---

## 1. Framework and Core

| Package | Version | Category | Purpose | Notes |
|---|---|---|---|---|
| `@medusajs/medusa` | 2.21.0 | Framework | Medusa application entry point, core workflows, admin dashboard | **The core dependency** |
| `@medusajs/framework` | 2.21.0 | Framework | HTTP, types, utils, IoC container, workflow SDK | Required by all custom code |
| `@medusajs/cli` | 2.21.0 | Framework | `medusa` CLI: `develop`, `build`, `db:migrate`, `db:generate` | Dev tooling |
| `@medusajs/dashboard` | 2.21.0 | Framework | Pre-built React admin dashboard | Served at `/app` |
| `@medusajs/admin-sdk` | 2.21.0 | Framework | Widget and custom route SDK for admin extensions | Custom widget uses this |
| `@medusajs/draft-order` | 2.21.0 | Module | Draft order module | Listed in dependencies |

---

## 2. Medusa Module Services

| Package | Version | Purpose |
|---|---|---|
| `@medusajs/test-utils` | 2.21.0 | Integration test utilities |
| `@medusajs/utils` | 2.21.0 | Shared utilities (ContainerRegistrationKeys, Modules enum, etc.) |
| `@medusajs/caching` | 2.21.0 | Caching module |

---

## 3. Admin UI Libraries

| Package | Version | Purpose |
|---|---|---|
| `@medusajs/ui` | 4.2.4 | Medusa design system (Container, Heading, Badge, etc.) |
| `@medusajs/icons` | 2.5.1 | Medusa icon set |
| `react` | 19.0.0 | React — admin UI runtime |
| `react-dom` | 19.0.0 | React DOM |
| `react-router-dom` | 7.18.2 | Admin routing |
| `@tanstack/react-query` | 5.64.2 | Admin data fetching |
| `react-i18next` | 13.5.0 | Admin i18n |
| `i18next` | 23.10.1 | i18n core |

---

## 4. Database and Infrastructure

| Package | Version | Purpose |
|---|---|---|
| `pg` | ^8.13.1 | PostgreSQL Node.js driver | Direct dependency (MikroORM uses it) |
| `zod` | 4.2.0 | Schema validation | Installed but NOT USED in any custom route |

---

## 5. Development Dependencies

| Package | Version | Purpose |
|---|---|---|
| `typescript` | ^5.6.2 | TypeScript compiler |
| `jest` | ^29.7.0 | Test runner |
| `@swc/jest` | ^0.2.36 | Fast TS transpilation for tests |
| `@types/node` | ^20.17.1 | Node.js TypeScript types |
| `@medusajs/eslint-plugin` | 2.21.0 | Medusa ESLint conventions |

---

## 6. Root Monorepo Dependencies

| Package | Version | Purpose |
|---|---|---|
| `turbo` | ^2.0.14 | Monorepo task orchestration |
| `typescript` | ^5.6.2 | Root TypeScript |
| `@medusajs/eslint-plugin` | 2.21.0 | Root ESLint config |

---

## 7. Dependency Risk Assessment

| Package | Risk | Notes |
|---|---|---|
| `@medusajs/medusa: 2.21.0` | Low — Medusa is actively maintained | Pin upgrades; test before upgrading |
| `pg: ^8.13.1` | Low | Stable PostgreSQL driver |
| `zod: 4.2.0` | Low | Installed but unused — create value by using it |
| `react: 19.0.0` | Low | Admin only |
| `@tanstack/react-query: 5.64.2` | Low | Stable |
| `react-router-dom: 7.18.2` | Low | Stable |
| `legacy-peer-deps=true` in `.npmrc` | Medium | Suppresses peer dep errors — may hide real incompatibilities |

---

## 8. Notably Absent Dependencies

| Missing | Why it matters |
|---|---|
| `@medusajs/file-s3` or similar | No file storage configured |
| `@medusajs/payment-stripe` | No Stripe integration |
| Any Razorpay package | No Indian payment provider |
| Any email/notification package | No email sending configured |
| Any OpenTelemetry exporter | Observability commented out |
| `dotenv` (standalone) | Not needed — Medusa's `loadEnv` handles this |
| `express` (standalone) | Not needed — Medusa manages Express internally |

---

## 9. npm Scripts

| Script | Command |
|---|---|
| `dev` | `turbo dev --filter=@dtc/backend` |
| `build` | `turbo build` |
| `start` | `turbo start` |
| `test` | `turbo test` |
| `lint` | `turbo lint` |
| `seed` | `turbo seed` |
| `backend:dev` | `npm run dev --workspace=apps/backend` (shorthand used in AGENTS.md) |

**Backend-specific scripts** (run from `apps/backend/`):

| Script | Command |
|---|---|
| `dev` | `medusa develop` |
| `build` | `medusa build` |
| `start` | `medusa start` |
| `seed` | `medusa db:migrate && medusa exec ./src/migration-scripts/initial-data-seed.ts && medusa exec ./src/migration-scripts/seed-customisation.ts` |
| `test` | `jest` |
| `db:generate` | `medusa db:generate` |
| `db:migrate` | `medusa db:migrate` |
| `db:rollback` | `medusa db:rollback` |
