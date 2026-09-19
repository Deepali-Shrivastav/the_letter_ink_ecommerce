# 27 — External Integrations
## letter-ink-backend · Integration Map

> **Analysis only. Do not modify the codebase.**

---

## 1. Currently Configured Integrations

### PostgreSQL

| Property | Value |
|---|---|
| Purpose | Primary data store |
| Configuration | `DATABASE_URL=postgres://postgres:postgres@localhost:5432/medusa-letter-ink-backend` |
| Provider | Local development — `localhost:5432` |
| Status | **Active — required** |
| Production path | Managed PG (Neon / AWS RDS / Supabase / Railway) |

---

### Redis

| Property | Value |
|---|---|
| Purpose | Medusa event bus + caching layer |
| Configuration | `REDIS_URL=redis://localhost:6379` |
| Provider | Local development |
| Status | **Active — required** |
| Production path | Managed Redis (Upstash / AWS ElastiCache / Railway) |
| Note | `REDIS_URL` appears twice in `.env` — duplicate, second occurrence wins |

---

### Medusa Admin Dashboard

| Property | Value |
|---|---|
| Purpose | Operations team interface |
| Package | `@medusajs/dashboard: 2.21.0` |
| URL | `http://localhost:9000/app` |
| Status | **Active — served by same process** |
| Production path | Served at production domain `/app` |

---

## 2. Development-Only Integrations (Must Be Replaced)

### System Default Payment Provider

| Property | Value |
|---|---|
| Provider ID | `pp_system_default` |
| Purpose | Simulates payment capture in development — no real money movement |
| Configured in | Seed data: `payment_providers: ["pp_system_default"]` |
| Status | Development only — **must be replaced** |
| Production replacement | Razorpay (India) and/or Stripe (international) |

---

### Manual Fulfillment Provider

| Property | Value |
|---|---|
| Provider ID | `manual_manual` |
| Purpose | Manual fulfillment tracking — no carrier integration |
| Configured in | Seed data: link between stock location and `manual_manual` provider |
| Status | Development only — **acceptable short-term, must be replaced for scale** |
| Production replacement | Shiprocket, Delhivery, EcomExpress, or similar |

---

### System Tax Provider

| Property | Value |
|---|---|
| Provider ID | `tp_system` |
| Purpose | No-op tax calculation (uses configured rates directly) |
| Configured in | Seed data: `createTaxRegionsWorkflow` with `tp_system` |
| Status | Acceptable — Medusa's system tax provider computes based on configured rates |
| Production action | Configure actual India GST rates — the provider is fine, the rates need updating |

---

## 3. Planned Integrations (Not Yet Implemented)

### Razorpay (Payment — India)

| Property | Value |
|---|---|
| Purpose | Accept INR payments from Indian customers |
| Package needed | `@medusajs/payment-razorpay` or custom provider |
| Configuration needed | `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET` in `.env` |
| `medusa-config.ts` change | Add to `modules.payment.providers` |
| Webhook | `POST /hooks/payment/razorpay` |

---

### Stripe (Payment — International)

| Property | Value |
|---|---|
| Purpose | Accept international payments (USD, EUR, etc.) |
| Package needed | `@medusajs/payment-stripe` |
| Configuration needed | `STRIPE_API_KEY`, `STRIPE_WEBHOOK_SECRET` |
| `medusa-config.ts` change | Add to `modules.payment.providers` |
| Webhook | `POST /hooks/payment/stripe` |

---

### AWS S3 / Cloudflare R2 (File Storage)

| Property | Value |
|---|---|
| Purpose | Store product images, uploaded files |
| Package needed | `@medusajs/file-s3` |
| Configuration needed | `S3_BUCKET`, `S3_ACCESS_KEY_ID`, `S3_SECRET_ACCESS_KEY`, `S3_REGION` |
| `medusa-config.ts` change | Add file module configuration |

---

### Email Provider (SendGrid / Resend / AWS SES)

| Property | Value |
|---|---|
| Purpose | Transactional emails — order confirmation, shipping, etc. |
| Package needed | `@medusajs/notification-sendgrid` or similar |
| Configuration needed | `SENDGRID_API_KEY` (or provider-specific key) |
| `medusa-config.ts` change | Add notification module configuration |
| Events to handle | `order.placed`, `order.shipped`, `order.cancelled`, `customer.password_reset` |

---

### Indian Shipping Provider (Shiprocket / Delhivery)

| Property | Value |
|---|---|
| Purpose | Shipping rate calculation, order pickup, tracking |
| Package needed | Custom fulfillment provider implementing `AbstractFulfillmentProviderService` |
| Configuration needed | Provider API key, API endpoint |
| `medusa-config.ts` change | Register fulfillment provider |

---

### OpenTelemetry (Observability)

| Property | Value |
|---|---|
| Purpose | Distributed tracing, metrics, performance monitoring |
| File | `apps/backend/instrumentation.ts` — fully commented out |
| Package installed | `registerOtel` from `@medusajs/medusa` — available but not active |
| Exporter referenced | Zipkin (in commented code) |
| Production path | Uncomment and configure with Datadog, Grafana, or Jaeger exporter |

---

## 4. Integration Architecture Diagram

```mermaid
flowchart LR
    Backend["Medusa Backend\n:9000"]

    subgraph "Currently Active"
        PG[("PostgreSQL\n:5432")]
        Redis[("Redis\n:6379")]
        Admin["Admin Dashboard\n/app"]
    end

    subgraph "Development Only (Replace)"
        DevPay["System Payment\npp_system_default"]
        DevFul["Manual Fulfillment\nmanual_manual"]
    end

    subgraph "To Be Integrated"
        Razorpay["Razorpay\n(India payments)"]
        Stripe["Stripe\n(International)"]
        S3["S3/R2\n(File storage)"]
        Email["SendGrid/SES\n(Email)"]
        Shipping["Shiprocket\n(India shipping)"]
        Otel["OpenTelemetry\n(Observability)"]
    end

    Backend --- PG
    Backend --- Redis
    Backend --- Admin
    Backend -.-> DevPay
    Backend -.-> DevFul
    Backend -->|"Phase 3"| Razorpay
    Backend -->|"Phase 3"| Stripe
    Backend -->|"Phase 5"| S3
    Backend -->|"Phase 5"| Email
    Backend -->|"Phase 5"| Shipping
    Backend -->|"Phase 10"| Otel
```

---

## 5. Integration Priority

| Integration | Priority | Phase | Blocking |
|---|---|---|---|
| PostgreSQL (production) | Critical | Phase 10 | Deployment |
| Redis (production) | Critical | Phase 10 | Deployment |
| Razorpay | Critical | Phase 3 | First real order |
| India GST tax rates | Critical | Phase 3 | Legal compliance |
| AWS S3 / file storage | High | Phase 5 | Product images |
| Email provider | High | Phase 5 | Customer communication |
| Indian shipping provider | High | Phase 5 | Order fulfillment |
| Stripe (international) | Medium | Phase 3 | International orders |
| OpenTelemetry | Medium | Phase 10 | Production observability |
