# The Letter Ink — Medusa Backend: Developer Guide

> **Document:** 10 — Developer Guide  
> **Medusa Version:** 2.20.1

---

## Table of Contents

1. [Prerequisites](#1-prerequisites)
2. [Local Setup](#2-local-setup)
3. [Project Configuration](#3-project-configuration)
4. [Code Conventions](#4-code-conventions)
5. [Adding Custom API Routes](#5-adding-custom-api-routes)
6. [Adding Custom Modules](#6-adding-custom-modules)
7. [Adding Subscribers](#7-adding-subscribers)
8. [Adding Scheduled Jobs](#8-adding-scheduled-jobs)
9. [Adding Custom Workflows](#9-adding-custom-workflows)
10. [Database Migrations](#10-database-migrations)
11. [Testing](#11-testing)
12. [Build System](#12-build-system)
13. [Troubleshooting](#13-troubleshooting)

---

## 1. Prerequisites

| Requirement | Version |
|---|---|
| Node.js | `^20.19.0` or `>=22.12.0` |
| Yarn | `3.2.1` (managed via `.yarnrc.yml`) |
| PostgreSQL | `>=14` |
| Redis | `>=6` (optional — required for production) |
| Git | Any recent version |

---

## 2. Local Setup

### Step 1: Clone and install

```bash
git clone <your-repo-url>
cd the_letter_ink_ecommerce/medusa
yarn install
```

### Step 2: Environment variables

Create `.env` in the `medusa/` root (or project root of your Medusa app):

```env
# Database (required)
DATABASE_URL=postgresql://postgres:password@localhost:5432/the_letter_ink_dev

# Auth secrets (required — minimum 32 characters)
JWT_SECRET=super_secret_jwt_key_at_least_32_characters
COOKIE_SECRET=super_secret_cookie_key_at_least_32_characters

# CORS
ADMIN_CORS=http://localhost:5173
STORE_CORS=http://localhost:3000
AUTH_CORS=http://localhost:3000,http://localhost:5173

# Redis (optional for dev, required for production)
REDIS_URL=redis://localhost:6379

# File storage (local for dev)
# S3_BUCKET=my-bucket
# S3_URL=https://s3.amazonaws.com/my-bucket
# S3_REGION=us-east-1
# S3_ACCESS_KEY_ID=
# S3_SECRET_ACCESS_KEY=

# Stripe (optional for dev)
# STRIPE_API_KEY=sk_test_...
# STRIPE_WEBHOOK_SECRET=whsec_...

# SendGrid (optional)
# SENDGRID_API_KEY=SG....
# SENDGRID_FROM_EMAIL=noreply@theletterink.com

# Worker mode: shared (default), server, or worker
MEDUSA_WORKER_MODE=shared
```

### Step 3: Build the monorepo

```bash
yarn build
```

### Step 4: Run database migrations

From your Medusa application directory (the directory with `medusa-config.ts`):

```bash
npx medusa db:migrate
```

### Step 5: Seed data (optional)

```bash
npx medusa db:seed
```

### Step 6: Start the server

```bash
# Development (with watch mode)
yarn dev

# Or production build
npx medusa start
```

Server starts at `http://localhost:9000`.

### Step 7: Access admin dashboard

Open `http://localhost:9000/app`. On first run, create your admin account at the onboarding screen.

---

## 3. Project Configuration

Your Medusa application configuration lives in `medusa-config.ts`:

```typescript
import { defineConfig, Modules } from "@medusajs/framework/utils"

export default defineConfig({
  projectConfig: {
    databaseUrl: process.env.DATABASE_URL,
    http: {
      adminCors: process.env.ADMIN_CORS!,
      storeCors: process.env.STORE_CORS!,
      authCors: process.env.AUTH_CORS!,
      jwtSecret: process.env.JWT_SECRET!,
      cookieSecret: process.env.COOKIE_SECRET!,
    },
    workerMode: (process.env.MEDUSA_WORKER_MODE || "shared") as any,
    redisUrl: process.env.REDIS_URL,
  },

  // Override module implementations here
  modules: {
    [Modules.FILE]: {
      resolve: "@medusajs/file",
      options: {
        providers: [
          {
            resolve: "@medusajs/file-local",
            id: "local",
          },
        ],
      },
    },
  },

  // Register plugins
  plugins: [],
})
```

---

## 4. Code Conventions

### Naming

| Element | Convention | Example |
|---|---|---|
| Files | kebab-case | `create-order.ts` |
| Classes | PascalCase | `OrderModuleService` |
| Functions | camelCase | `createOrder()` |
| Variables | camelCase | `orderItems` |
| Constants | SCREAMING_SNAKE_CASE | `MAX_QUANTITY` |
| Database columns | snake_case | `created_at`, `customer_id` |
| Environment vars | SCREAMING_SNAKE_CASE | `DATABASE_URL` |

### Formatting (Prettier)

```json
{
  "semi": false,
  "singleQuote": false,
  "trailingComma": "es5",
  "tabWidth": 2,
  "arrowParens": "always"
}
```

Run: `yarn prettier --write "src/**/*.ts"`

### TypeScript

- Target: ES2021
- Module: Node16
- Strict null checks: enabled
- Experimental decorators: enabled
- Path aliases: `@models`, `@types`, `@services`, `@repositories`, `@utils`

### Branch Naming

| Type | Pattern | Example |
|---|---|---|
| Feature | `feat/description` | `feat/add-gift-wrapping` |
| Bug fix | `fix/description` | `fix/cart-total-rounding` |
| Chore | `chore/description` | `chore/update-dependencies` |
| Docs | `docs/description` | `docs/api-reference-update` |

---

## 5. Adding Custom API Routes

Create files in `src/api/` following the file-system router convention.

### Route File

```typescript
// src/api/store/custom-feature/route.ts
import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { HttpTypes } from "@medusajs/framework/types"

export const GET = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  const customService = req.scope.resolve("customModuleService")
  const data = await customService.list()
  res.json({ data })
}

export const POST = async (
  req: MedusaRequest<{ name: string }>,
  res: MedusaResponse
) => {
  const { name } = req.validatedBody
  // ... handle creation
  res.status(201).json({ message: "Created" })
}
```

### Middleware File (optional)

```typescript
// src/api/store/custom-feature/middlewares.ts
import { MiddlewareRoute } from "@medusajs/framework/http"
import { validateAndTransformBody, validateAndTransformQuery } from "@medusajs/framework"
import { CreateCustomFeatureSchema } from "./validators"
import * as QueryConfig from "./query-config"

export const customFeatureMiddlewares: MiddlewareRoute[] = [
  {
    method: ["POST"],
    matcher: "/store/custom-feature",
    middlewares: [
      validateAndTransformBody(CreateCustomFeatureSchema),
    ],
  },
]
```

### Validator File

```typescript
// src/api/store/custom-feature/validators.ts
import { z } from "zod"

export const CreateCustomFeatureSchema = z.object({
  name: z.string().min(1).max(255),
  description: z.string().optional(),
})

export type CreateCustomFeatureDTO = z.infer<typeof CreateCustomFeatureSchema>
```

### Register middleware in main middlewares.ts

```typescript
// src/api/middlewares.ts
import { customFeatureMiddlewares } from "./store/custom-feature/middlewares"

export default defineMiddlewares([
  // ... existing middlewares
  ...customFeatureMiddlewares,
])
```

---

## 6. Adding Custom Modules

### Module Structure

```
src/modules/custom-feature/
├── index.ts              ← module entry point
├── models/
│   └── custom-entity.ts  ← DML model definition
├── services/
│   └── custom-feature-module-service.ts
├── migrations/           ← auto-generated
└── types/
    └── index.ts          ← DTOs
```

### Module Entry Point

```typescript
// src/modules/custom-feature/index.ts
import { Module } from "@medusajs/framework/utils"
import CustomFeatureModuleService from "./services/custom-feature-module-service"

export const CUSTOM_FEATURE_MODULE = "customFeatureModuleService"

export default Module(CUSTOM_FEATURE_MODULE, {
  service: CustomFeatureModuleService,
})
```

### Model Definition

```typescript
// src/modules/custom-feature/models/custom-entity.ts
import { model } from "@medusajs/framework/utils"

const CustomEntity = model.define("CustomEntity", {
  id: model.id({ prefix: "ce" }).primaryKey(),
  name: model.text(),
  description: model.text().nullable(),
  metadata: model.json().nullable(),
})

export default CustomEntity
```

### Service

```typescript
// src/modules/custom-feature/services/custom-feature-module-service.ts
import { MedusaService } from "@medusajs/framework/utils"
import CustomEntity from "../models/custom-entity"

class CustomFeatureModuleService extends MedusaService({
  CustomEntity,
}) {}

export default CustomFeatureModuleService
```

### Register in medusa-config.ts

```typescript
import CustomFeatureModule, { CUSTOM_FEATURE_MODULE } from "./src/modules/custom-feature"

export default defineConfig({
  modules: {
    [CUSTOM_FEATURE_MODULE]: {
      resolve: "./src/modules/custom-feature",
    },
  },
})
```

### Generate Migration

```bash
npx medusa db:generate --module customFeatureModuleService
```

---

## 7. Adding Subscribers

Subscribers handle domain events emitted by modules.

```typescript
// src/subscribers/order-placed.ts
import { SubscriberArgs, SubscriberConfig } from "@medusajs/framework"
import { Modules } from "@medusajs/framework/utils"

export default async function orderPlacedHandler({
  event: { data },
  container,
}: SubscriberArgs<{ id: string }>) {
  const notificationModule = container.resolve(Modules.NOTIFICATION)
  const orderModule = container.resolve(Modules.ORDER)

  const order = await orderModule.retrieveOrder(data.id, {
    relations: ["items", "customer"],
  })

  await notificationModule.createNotifications({
    to: order.email!,
    channel: "email",
    template: "order-confirmation",
    data: { order },
  })
}

export const config: SubscriberConfig = {
  event: "order.placed",
  context: {
    subscriberId: "order-placed-handler",
  },
}
```

---

## 8. Adding Scheduled Jobs

Scheduled jobs run on a cron schedule.

```typescript
// src/jobs/sync-inventory.ts
import { MedusaContainer } from "@medusajs/framework/types"
import { Modules } from "@medusajs/framework/utils"

export default async function syncInventoryJob(container: MedusaContainer) {
  const inventoryModule = container.resolve(Modules.INVENTORY)
  // ... sync logic
  console.log("Inventory synced:", new Date().toISOString())
}

export const config = {
  name: "sync-inventory",
  schedule: "0 2 * * *",   // daily at 2 AM
}
```

---

## 9. Adding Custom Workflows

### Custom Step

```typescript
// src/workflows/steps/send-welcome-email.ts
import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk"
import { Modules } from "@medusajs/framework/utils"

export const sendWelcomeEmailStep = createStep(
  "send-welcome-email",
  async (input: { email: string; name: string }, { container }) => {
    const notificationModule = container.resolve(Modules.NOTIFICATION)

    await notificationModule.createNotifications([{
      to: input.email,
      channel: "email",
      template: "welcome",
      data: { name: input.name },
    }])

    return new StepResponse({ sent: true })
  }
)
```

### Custom Workflow

```typescript
// src/workflows/customer-registered.ts
import {
  createWorkflow,
  WorkflowData,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk"
import { sendWelcomeEmailStep } from "./steps/send-welcome-email"

type Input = {
  email: string
  name: string
}

export const customerRegisteredWorkflow = createWorkflow(
  "customer-registered",
  (input: WorkflowData<Input>) => {
    const result = sendWelcomeEmailStep(input)
    return new WorkflowResponse(result)
  }
)
```

### Hook into existing workflows

```typescript
// src/workflows/hooks/product-created.ts
import { createProductsWorkflow } from "@medusajs/core-flows"

createProductsWorkflow.hooks.productCreated(
  async ({ products }, { container }) => {
    // Custom logic after product creation
    console.log("Product created:", products.map(p => p.id))
  }
)
```

---

## 10. Database Migrations

### Generate migration (after model changes)

```bash
# From monorepo:
cd packages/modules/<module> && yarn migration:create

# From application:
npx medusa db:generate --module <moduleKey>
```

**Never edit migration files by hand.** Re-run the script if the model changes again.

### Run pending migrations

```bash
npx medusa db:migrate
```

### Check migration status

```bash
npx medusa db:migrate --status
```

### Rollback (use with caution)

```bash
npx medusa db:rollback
```

---

## 11. Testing

### Unit Tests

```bash
# All unit tests
yarn test

# Single package
yarn workspace @medusajs/product test

# Watch mode
yarn workspace @medusajs/product test --watch
```

**Test file conventions:**
- Extension: `.spec.ts` or `.test.ts`
- Location: `__tests__/` adjacent to source
- Framework: Jest 29

### Integration Tests

```bash
# HTTP API integration tests (requires running DB)
yarn test:integration:http

# Module integration tests
yarn test:integration:modules

# Specific package integration tests
yarn test:integration:packages
```

### Writing a Unit Test

```typescript
// src/__tests__/create-product.spec.ts
import { describe, it, expect, beforeEach } from "vitest"   // or jest

describe("createProduct", () => {
  let service: ProductModuleService

  beforeEach(async () => {
    service = new ProductModuleService(/* mock deps */)
  })

  it("should create a product with variants", async () => {
    const result = await service.createProducts([{
      title: "Test Product",
      variants: [{ title: "Default", prices: [{ currency_code: "usd", amount: 1000 }] }]
    }])

    expect(result).toHaveLength(1)
    expect(result[0].title).toBe("Test Product")
  })
})
```

---

## 12. Build System

### Turborepo Pipeline

```json
// turbo.json
{
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**"]
    },
    "test": {
      "cache": false
    }
  }
}
```

### Build single package

```bash
yarn workspace @medusajs/medusa build
```

### Watch mode (for development)

```bash
# From within a package directory
yarn watch

# Or with tsc
tsc --build --watch
```

### Build all (CI)

```bash
yarn build
```

---

## 13. Troubleshooting

### Common Issues

**Database connection refused:**
```bash
# Check PostgreSQL is running
pg_ctl status
# Verify DATABASE_URL format
postgresql://user:password@localhost:5432/dbname
```

**Migration fails:**
```bash
# Ensure DB exists
createdb the_letter_ink_dev
# Verify connection
psql $DATABASE_URL -c "SELECT 1"
```

**Yarn install fails:**
```bash
# Clear cache
yarn cache clean
# Delete node_modules
rm -rf node_modules
yarn install
```

**TypeScript build errors:**
```bash
# Clean build artifacts
yarn workspace @medusajs/medusa build
# Or from root
yarn build
```

**Port 9000 already in use:**
```bash
# Find process
lsof -i :9000
# Set different port
PORT=9001 npx medusa start
```

**Admin dashboard not loading:**
- Ensure `ADMIN_CORS` includes the dashboard URL
- Check browser console for CORS errors
- Verify the admin bundle was built

**Stripe webhook not working in dev:**
```bash
# Use Stripe CLI to forward webhooks
stripe listen --forward-to localhost:9000/hooks/payment/stripe_stripe
```
