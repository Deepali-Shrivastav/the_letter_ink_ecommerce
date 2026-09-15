# The Letter Ink — Medusa Backend: Project Overview

> **Document Series:** Industry-Standard Technical Documentation  
> **Version:** 1.0  
> **Medusa Version:** 2.20.1  
> **Date:** 2026-09-15  
> **Scope:** `medusa/` monorepo — backend only

---

## Table of Contents

1. [System Identity](#1-system-identity)
2. [Business Context](#2-business-context)
3. [Technology Stack](#3-technology-stack)
4. [Monorepo Structure](#4-monorepo-structure)
5. [Document Index](#5-document-index)
6. [Quick-Start Reference](#6-quick-start-reference)

---

## 1. System Identity

| Property | Value |
|---|---|
| **Project Name** | The Letter Ink — E-Commerce Backend |
| **Platform** | Medusa v2 (open-source commerce platform) |
| **Package** | `@medusajs/medusa` v2.20.1 |
| **Runtime** | Node.js `^20.19.0 \|\| >=22.12.0` |
| **Language** | TypeScript (ES2021, Module: Node16) |
| **Repository URL** | https://github.com/medusajs/medusa |
| **License** | SEE LICENSE IN LICENSE (Medusa Enterprise License) |
| **Package Manager** | Yarn 3.2.1 (node-modules linker) |
| **Build System** | Turborepo 1.6.3 |

---

## 2. Business Context

**The Letter Ink** is an e-commerce storefront with a fully decoupled architecture:

- **Backend (this document):** Medusa v2 monorepo — handles all commerce logic, data persistence, payment processing, fulfillment, and administration.
- **Frontend (separate):** `yournextstore` — Next.js storefront that consumes the Medusa Store API.

### Commerce Capabilities

| Domain | Description |
|---|---|
| **Products** | Full product catalog with variants, options, images, types, tags, collections, and categories |
| **Pricing** | Multi-currency, region-specific, price-list, and promotion-based pricing |
| **Cart** | Stateful cart with line items, promotions, tax calculations, and shipping methods |
| **Orders** | Full order lifecycle: creation, fulfillment, shipment, returns, claims, exchanges |
| **Payments** | Abstract payment collection with Stripe provider; multi-session support |
| **Customers** | Registered and guest customers with address books and customer groups |
| **Inventory** | Multi-warehouse stock tracking and reservation system |
| **Fulfillment** | Fulfillment sets, service zones, geo-zones, shipping options, and provider abstraction |
| **Tax** | Region-based tax rates with automatic calculation on cart and order |
| **Promotions** | Coupon codes, automatic promotions, campaign management |
| **Auth** | JWT/session auth for customers and admin users; OAuth (Google, GitHub, OIDC); MFA |
| **Sales Channels** | Multi-channel product availability scoping |
| **Notifications** | Pluggable notification system (SendGrid provider included) |
| **Search** | PostgreSQL full-text search; extensible with external providers |
| **Admin** | Full-featured React dashboard for all commerce operations |

---

## 3. Technology Stack

### Core Runtime

| Technology | Version | Role |
|---|---|---|
| **Node.js** | >=20.19.0 | JavaScript runtime |
| **TypeScript** | ^5.6.2 | Primary language |
| **Express.js** | ^4.21.0 | HTTP framework |
| **PostgreSQL** | 8.16.3 (pg driver) | Primary database |
| **MikroORM** | (via framework) | ORM / data-access layer |
| **Redis** | (via ioredis) | Cache, event bus, workflow engine (optional) |
| **Awilix** | ^8.0.1 | Dependency injection container |
| **JSON Web Token** | ^9.0.2 | Authentication tokens |
| **node-schedule** | ^2.1.1 | Scheduled background jobs |
| **multer** | ^2.2.0 | File upload handling |

### Frontend / Admin Dashboard

| Technology | Version | Role |
|---|---|---|
| **React** | ^18.3.1 | Admin UI framework |
| **React Router** | 7.18.2 | Admin UI routing |
| **Vite** | ^7.3.6 | Admin UI build tool |
| **Vitest** | ^4.1.10 | Admin UI testing |

### Testing

| Technology | Version | Role |
|---|---|---|
| **Jest** | ^29.7.0 | Backend unit & integration tests |
| **SWC** | ^1.7.28 | Fast TypeScript transformation |
| **Supertest** | ^7.1.4 | HTTP integration testing |

### Tooling

| Technology | Role |
|---|---|
| **Turborepo** | Monorepo task orchestration |
| **Changesets** | Versioning and changelog management |
| **ESLint** | Code linting |
| **Prettier** | Code formatting |
| **Rollup** | Package bundling |

---

## 4. Monorepo Structure

```
medusa/                             ← monorepo root
├── packages/
│   ├── medusa/                     ← Main application package (@medusajs/medusa)
│   │   └── src/
│   │       ├── api/                ← HTTP route handlers
│   │       │   ├── admin/          ← 57 admin API route groups
│   │       │   ├── store/          ← 20 store API route groups
│   │       │   ├── auth/           ← Authentication routes
│   │       │   ├── hooks/          ← Webhook routes
│   │       │   └── cloud/          ← Cloud-specific routes
│   │       ├── commands/           ← CLI commands
│   │       ├── feature-flags/      ← Feature flag definitions
│   │       ├── instrumentation/    ← OpenTelemetry setup
│   │       ├── jobs/               ← Scheduled background jobs
│   │       ├── loaders/            ← Application bootstrap loaders
│   │       ├── modules/            ← Local module declarations
│   │       ├── policies/           ← RBAC policy definitions
│   │       ├── subscribers/        ← Domain event subscribers
│   │       ├── types/              ← Local type definitions
│   │       └── utils/              ← Shared utilities
│   │
│   ├── core/                       ← Core framework packages
│   │   ├── framework/              ← Core runtime (HTTP, DI, DB, config)
│   │   ├── core-flows/             ← 37 workflow domain groups (all business logic)
│   │   ├── types/                  ← All shared TypeScript types
│   │   ├── utils/                  ← Shared utility functions
│   │   ├── workflows-sdk/          ← Workflow composition primitives
│   │   ├── modules-sdk/            ← Module development SDK
│   │   ├── js-sdk/                 ← JavaScript client SDK
│   │   ├── query/                  ← Graph query engine
│   │   └── orchestration/          ← Workflow orchestration engine
│   │
│   ├── modules/                    ← 36 commerce feature modules
│   │   ├── product/                ← Product catalog
│   │   ├── order/                  ← Order management
│   │   ├── cart/                   ← Shopping cart
│   │   ├── customer/               ← Customer management
│   │   ├── payment/                ← Payment processing
│   │   ├── fulfillment/            ← Fulfillment & shipping
│   │   ├── inventory/              ← Inventory & stock
│   │   ├── pricing/                ← Price computation
│   │   ├── promotion/              ← Promotions & coupons
│   │   ├── auth/                   ← Authentication module
│   │   ├── region/                 ← Geographic regions
│   │   ├── currency/               ← Currency management
│   │   ├── sales-channel/          ← Sales channels
│   │   ├── tax/                    ← Tax calculation
│   │   ├── notification/           ← Notification system
│   │   ├── user/                   ← Admin user management
│   │   ├── store/                  ← Store configuration
│   │   ├── api-key/                ← API key management
│   │   ├── file/                   ← File storage abstraction
│   │   ├── search/                 ← Search abstraction
│   │   ├── stock-location/         ← Warehouse locations
│   │   ├── link-modules/           ← Cross-module relation links
│   │   ├── index/                  ← Search index module
│   │   ├── rbac/                   ← Role-based access control
│   │   ├── analytics/              ← Analytics module
│   │   ├── cache-inmemory/         ← In-memory caching
│   │   ├── cache-redis/            ← Redis caching
│   │   ├── caching/                ← Caching abstraction
│   │   ├── event-bus-local/        ← Local event bus
│   │   ├── event-bus-redis/        ← Redis event bus
│   │   ├── locking/                ← Distributed locking
│   │   ├── settings/               ← System settings
│   │   ├── translation/            ← i18n translation
│   │   ├── workflow-engine-inmemory/  ← In-process workflows
│   │   └── workflow-engine-redis/  ← Distributed workflows
│   │       └── providers/          ← 16 provider implementations
│   │           ├── auth-emailpass/
│   │           ├── auth-github/
│   │           ├── auth-google/
│   │           ├── auth-oidc/
│   │           ├── payment-stripe/
│   │           ├── file-local/
│   │           ├── file-s3/
│   │           ├── notification-sendgrid/
│   │           ├── notification-local/
│   │           ├── fulfillment-manual/
│   │           ├── search-postgres/
│   │           ├── caching-redis/
│   │           ├── locking-postgres/
│   │           ├── locking-redis/
│   │           ├── analytics-local/
│   │           └── analytics-posthog/
│   │
│   ├── admin/
│   │   └── dashboard/              ← React admin UI (@medusajs/dashboard)
│   │       └── src/
│   │           ├── routes/         ← Admin UI page routes
│   │           ├── components/     ← Shared UI components
│   │           ├── hooks/          ← React hooks
│   │           ├── providers/      ← Context providers
│   │           ├── i18n/           ← Internationalization
│   │           └── lib/            ← Utilities
│   │
│   ├── cli/                        ← CLI tooling
│   │   └── oas/                    ← OpenAPI spec generation
│   └── design-system/              ← UI component library
│
├── integration-tests/              ← End-to-end test suites
│   ├── http/                       ← HTTP API integration tests
│   └── modules/                    ← Module integration tests
│
├── www/                            ← Documentation website
│   └── apps/
│       ├── api-reference/          ← OpenAPI-generated API reference
│       └── resources/              ← Developer documentation
│
├── CLAUDE.md                       ← Developer guide (architecture, conventions)
├── turbo.json                      ← Turborepo task pipeline
└── package.json                    ← Root workspace config
```

---

## 5. Document Index

| # | Document | Description |
|---|---|---|
| 01 | **Project Overview** (this file) | System identity, tech stack, repository map |
| 02 | [Architecture Design Document](./02_architecture.md) | System architecture, patterns, data flow |
| 03 | [Data Model Reference](./03_data_models.md) | All entity schemas and relationships |
| 04 | [API Reference — Store](./04_api_store.md) | All public storefront endpoints |
| 05 | [API Reference — Admin](./05_api_admin.md) | All admin management endpoints |
| 06 | [API Reference — Auth](./06_api_auth.md) | Authentication and authorization endpoints |
| 07 | [Module Catalog](./07_module_catalog.md) | All 36 commerce modules and 16 providers |
| 08 | [Workflow Reference](./08_workflow_reference.md) | All workflows and steps |
| 09 | [Configuration Guide](./09_configuration.md) | Environment setup, medusa-config.ts |
| 10 | [Developer Guide](./10_developer_guide.md) | Local setup, conventions, extending |
| 11 | [Frontend Integration Guide](./11_frontend_integration.md) | Connecting yournextstore to Medusa |
| 12 | [Security & Auth Guide](./12_security_auth.md) | Auth flows, RBAC, API key management |

---

## 6. Quick-Start Reference

### Environment Variables

```bash
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/medusa_db

# Authentication
JWT_SECRET=your_jwt_secret_minimum_32_chars
COOKIE_SECRET=your_cookie_secret_minimum_32_chars

# Admin
MEDUSA_ADMIN_ONBOARDING_TYPE=default   # or "nextjs"

# Redis (optional but recommended for production)
REDIS_URL=redis://localhost:6379
```

### Core Commands

```bash
# Install all dependencies
yarn install

# Build entire monorepo
yarn build

# Build single package
yarn workspace @medusajs/medusa build

# Run all unit tests
yarn test

# Run HTTP integration tests
yarn test:integration:http

# Generate OpenAPI spec
yarn openapi:generate

# Create module migration
cd packages/modules/<module> && yarn migration:create
```

### Worker Modes

| Mode | Description |
|---|---|
| `shared` (default) | API and background processors run in same process |
| `server` | API-only process; no event/workflow processing |
| `worker` | Background processing only; no HTTP API |
