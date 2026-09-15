# The Letter Ink — Medusa Backend: Documentation Suite

> **Complete Industry-Standard Technical Documentation**  
> **Medusa Version:** 2.20.1 | **Generated:** 2026-09-15  
> **Scope:** `medusa/` monorepo — complete backend analysis

---

## Document Index

| # | Document | Key Topics |
|---|---|---|
| [01](./01_project_overview.md) | **Project Overview** | System identity, tech stack, monorepo map, quick-start |
| [02](./02_architecture.md) | **Architecture Design** | System patterns, DI container, workflow engine, data flow |
| [03](./03_data_models.md) | **Data Model Reference** | All entity schemas, fields, relations, indexes |
| [04](./04_api_store.md) | **Store API Reference** | All `/store/*` endpoints with req/res shapes |
| [05](./05_api_admin.md) | **Admin API Reference** | All `/admin/*` endpoints, RBAC policies |
| [06](./06_api_auth_security.md) | **Auth & Security Guide** | Auth flows, OAuth, MFA, RBAC, API keys |
| [07](./07_module_catalog.md) | **Module Catalog** | All 36 modules, 16 providers, configuration |
| [08](./08_workflow_reference.md) | **Workflow Reference** | All 200+ workflows across 37 domains |
| [10](./10_developer_guide.md) | **Developer Guide** | Local setup, conventions, extending Medusa |
| [11](./11_frontend_integration.md) | **Frontend Integration** | Connecting `yournextstore` to Medusa |

---

## At a Glance

### The System

**The Letter Ink** is a fully decoupled e-commerce platform:

```
┌─────────────────────┐     Store API      ┌──────────────────────────┐
│   yournextstore     │ ──────────────────▶ │  Medusa v2 Backend       │
│   (Next.js)         │     /store/*        │  @medusajs/medusa 2.20.1 │
│                     │ ──────────────────▶ │                          │
│   Admin Dashboard   │     Admin API       │  36 Commerce Modules     │
│   (React + Vite)    │     /admin/*        │  16 Provider Plugins     │
│                     │                     │  200+ Workflows          │
└─────────────────────┘                     └──────────────┬───────────┘
                                                           │
                                                    PostgreSQL + Redis
```

---

### API Surface Summary

| API Group | Base Path | Count | Auth |
|---|---|---|---|
| Store | `/store/*` | 20 route groups | Publishable API Key |
| Admin | `/admin/*` | 57 route groups | Admin JWT |
| Auth | `/auth/*` | 10+ endpoints | Various |

---

### Module Summary

| Category | Count | Examples |
|---|---|---|
| Commerce Modules | 23 | product, order, cart, payment, customer |
| Infrastructure Modules | 13 | event-bus, cache, workflow-engine |
| Auth Providers | 4 | emailpass, google, github, oidc |
| Payment Providers | 1 | stripe |
| File Providers | 2 | local, s3 |
| Notification Providers | 2 | local, sendgrid |
| Fulfillment Providers | 1 | manual |
| Search Providers | 1 | postgres |

---

### Key Endpoints for Frontend

```
GET  /store/products                    List products
GET  /store/products/:handle            Product detail
GET  /store/product-categories          Categories
GET  /store/product-collections         Collections
GET  /store/regions                     Regions/currencies
GET  /store/shipping-options?cart_id=  Shipping options
POST /store/carts                       Create cart
POST /store/carts/:id/line-items        Add to cart
POST /store/carts/:id/complete          Place order
POST /auth/customer/emailpass           Customer login
POST /auth/customer/emailpass/register  Customer register
GET  /store/customers/me                Customer profile
GET  /store/orders                      Customer orders
```

---

### Environment Variables Required

```bash
# Absolutely Required
DATABASE_URL=postgresql://user:pass@host:5432/db
JWT_SECRET=<64+ char random string>
COOKIE_SECRET=<64+ char random string>

# CORS (update for production domains)
ADMIN_CORS=http://localhost:5173
STORE_CORS=http://localhost:3000
AUTH_CORS=http://localhost:3000

# For production (recommended)
REDIS_URL=redis://localhost:6379

# Payment (if using Stripe)
STRIPE_API_KEY=sk_...
STRIPE_WEBHOOK_SECRET=whsec_...

# File storage (if using S3)
S3_BUCKET=...  S3_REGION=...  S3_ACCESS_KEY_ID=...  S3_SECRET_ACCESS_KEY=...

# Email (if using SendGrid)
SENDGRID_API_KEY=SG...
SENDGRID_FROM_EMAIL=noreply@theletterink.com
```

---

### Frontend Setup Checklist

1. - [ ] Backend running at `localhost:9000`
2. - [ ] PostgreSQL DB created and migrated
3. - [ ] Admin account created (`/app` onboarding)
4. - [ ] Sales Channel created ("Online Store")
5. - [ ] Publishable API Key created and associated with sales channel
6. - [ ] Region created (US / INR)
7. - [ ] Shipping configured (fulfillment set → service zone → shipping options)
8. - [ ] Payment provider configured (Stripe)
9. - [ ] Products created and associated with sales channel
10. - [ ] Frontend `.env.local` configured with publishable key and backend URL
