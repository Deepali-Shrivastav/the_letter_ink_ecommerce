# The Letter Ink — Bespoke eCommerce Platform

<p align="center">
  <img src="letter-ink-frontend/public/Latest-logo.png" height="90" alt="The Letter Ink">
</p>

<p align="center">
  <strong>Fine Art Calligraphy, Bespoke Stationery & Artisanal Keepsakes</strong><br>
  A modern, production-grade decoupled eCommerce platform built with <strong>Next.js 16</strong>, <strong>Medusa.js v2</strong>, <strong>PostgreSQL</strong>, and <strong>Razorpay</strong>.
</p>

---

## 📑 Table of Contents

- [Architectural Overview](#architectural-overview)
- [Key Features](#key-features)
  - [Artisanal Product Configurator](#artisanal-product-configurator)
  - [Complete Razorpay Checkout Flow](#complete-razorpay-checkout-flow)
  - [Dynamic Real-Time Order Tracking](#dynamic-real-time-order-tracking)
  - [Medusa v2 Commerce Core](#medusa-v2-commerce-core)
- [Repository Structure](#repository-structure)
- [Prerequisites](#prerequisites)
- [Step-by-Step Installation (2 Options)](#step-by-step-installation-2-options)
  - [Option 1: Local Installation (Local PostgreSQL — No Docker)](#option-1-local-installation-local-postgresql--no-docker)
  - [Option 2: Docker Installation (PostgreSQL via Docker Compose)](#option-2-docker-installation-postgresql-via-docker-compose)
  - [Frontend Storefront Setup (Next.js 16)](#frontend-storefront-setup-nextjs-16)
- [Environment Variables Reference](#environment-variables-reference)
- [Order Lifecycle & Admin Operations](#order-lifecycle--admin-operations)
- [Testing & Quality Verification](#testing--quality-verification)
- [Troubleshooting & Windows Development](#troubleshooting--windows-development)
- [License](#license)

---

## Architectural Overview

```
+-------------------------------------------------------------+
|                  The Letter Ink Storefront                  |
|                 (Next.js 16 / React 19 RSC)                 |
|   Tailwind CSS  *  Radix UI  *  Framer Motion  *  Biome     |
+------------------------------+------------------------------+
                               |
                   REST APIs & GraphQL / SDK
                               |
+------------------------------v------------------------------+
|                   Medusa.js v2 Backend                      |
|                  (Headless Commerce Engine)                 |
|     Carts  *  Orders  *  Pricing  *  Fulfillments  *  Auth   |
+------------------------------+------------------------------+
                               |
            +------------------+------------------+
            |                                     |
+-----------v-----------+             +-----------v-----------+
|  PostgreSQL Database  |             |  Razorpay Integration |
|  Orders, Carts, Admin |             |  UPI, Cards, Netbank  |
+-----------------------+             +-----------------------+
```

---

## Key Features

### 🖋️ Artisanal Product Configurator
- Custom lettering and personalization input on bespoke products.
- Real-time price calculation for artisan add-ons (e.g., custom wax seal tints, gold leaf framing, calligraphy paper trims).
- Metadata preserved transparently across line items, cart synchronization, orders, and fulfillment waybills.

### 💳 Complete Razorpay Checkout Flow
- Seamless **`/checkout`** page designed for high-conversion luxury shopping.
- Native integration with **Razorpay**:
  - Full support for **UPI** (Google Pay, PhonePe, Paytm, BHIM, QR code).
  - Credit & Debit Cards (Visa, Mastercard, RuPay, Amex).
  - NetBanking across 50+ Indian commercial banks.
  - Digital Wallets.
- Cryptographic HMAC-SHA256 signature verification on `POST /api/checkout/razorpay/verify`.
- Automated assignment of valid shipping methods (`Standard Delivery (India)`) ensuring carts always successfully promote into official Medusa database orders.
- Developer simulation fallback: allows testing complete checkout workflows even before production payment credentials are configured.

### 🚚 Dynamic Real-Time Order Tracking
- Dedicated public tracking portal at **`/order/track`** (accessible from header and footer navigation).
- Secure dual-factor lookup: requires both **Order ID or Brand Reference** (e.g., `#TLI-919691` or `order_...`) and **Customer Email or 10-digit Mobile Number**.
- **Live 5-stage fulfillment progress bar**:
  1. **Order Placed & Confirmed** (Payment captured)
  2. **In Atelier — Bespoke Crafting** (Custom lettering, wax packaging)
  3. **Dispatched with Courier** (Shipped via domestic express partner)
  4. **Out for Delivery** (Delivery executive en route)
  5. **Delivered** (Package received)
- Dynamic synchronization: changes made in the Medusa Admin dashboard (`localhost:9000/app/orders`) immediately update the tracking page status.
- Live GPS / AWB waybill preview and direct atelier concierge assistance link.

### ⚙️ Medusa v2 Commerce Core
- Multi-currency product pricing (INR `₹` as primary currency).
- Medusa Admin dashboard (`http://localhost:9000/app`) for catalog management, pricing rules, inventory controls, order tracking, and fulfillments.

---

## Repository Structure

```
the_letter_ink_ecommerce/
├── letter-ink-backend/               # Medusa.js v2 Commerce Engine
│   ├── apps/backend/
│   │   ├── src/
│   │   │   ├── api/                  # Custom API routes & store endpoints
│   │   │   ├── scripts/              # Migration, seeding, and check scripts
│   │   │   └── workflows/            # Custom order & cart workflows
│   │   ├── medusa-config.ts          # Medusa configuration & plugin registrations
│   │   └── .env                      # Backend environment variables
│   └── package.json
│
├── letter-ink-frontend/              # Next.js 16 Frontend Storefront
│   ├── app/
│   │   ├── checkout/                 # Luxury multi-step checkout
│   │   ├── order/
│   │   │   ├── track/                # Dynamic order tracking portal
│   │   │   └── success/[id]/         # Post-purchase confirmation page
│   │   ├── api/
│   │   │   ├── checkout/razorpay/    # Order creation, verify & callback APIs
│   │   │   └── order/track/          # Secure order lookup & tracking API
│   │   ├── cart/                     # Slide-over cart drawer & persistent state
│   │   └── product/[slug]/           # Bespoke product pages with configurator
│   ├── components/                   # UI components, layout, sections & modals
│   ├── lib/                          # Commerce SDK, cart cookies, and utilities
│   ├── scripts/
│   │   └── test-order-flow.mjs       # Automated end-to-end checkout & tracking tester
│   └── .env.local                    # Storefront environment variables
│
├── docker-compose.yml                # Optional local PostgreSQL service (Docker not required)
└── README.md                         # Monorepo documentation
```

---

## Prerequisites

Before setting up the project locally, verify that you have:
- **Node.js**: v20 or higher (`node -v`)
- **Package Managers**: `npm` v10+ or `bun` v1.1+
- **PostgreSQL**: v15 or higher (`psql --version`) — running natively, in the cloud, or via Docker
- **Git**

> **Note**: **Docker is completely optional.** Both the Next.js storefront and the Medusa backend run directly on Node.js. Docker is only provided as an optional convenience to spin up PostgreSQL without installing it locally.

---

## Step-by-Step Installation (2 Options)

Choose whichever option suits your local development setup:
- **Option 1**: You have PostgreSQL installed locally on your machine or want to use a free cloud database (e.g. Neon/Supabase). **No Docker required.**
- **Option 2**: You prefer using Docker so you don't need to install or manage PostgreSQL on your machine.

---

### Option 1: Local Installation (Local PostgreSQL — No Docker)

> **Use this if**: You already have PostgreSQL installed on Windows, macOS, or Linux, or are using a cloud-hosted PostgreSQL instance.

#### 1. Create the Database
In your local `psql` terminal or pgAdmin:
```sql
CREATE DATABASE "medusa-backend";
```
*(Default local PostgreSQL usually listens on port `5432`).*

#### 2. Configure Backend Environment
Navigate to `letter-ink-backend` and install dependencies:
```bash
cd letter-ink-backend
npm install
cp apps/backend/.env.template apps/backend/.env
```
Open `apps/backend/.env` and set your local PostgreSQL connection string (typically port `5432`):
```env
DATABASE_URL=postgres://<postgres_username>:<postgres_password>@localhost:5432/medusa-backend
JWT_SECRET=supersecret-jwt-key-for-dev
COOKIE_SECRET=supersecret-cookie-key-for-dev
MEDUSA_BACKEND_URL=http://localhost:9000
STORE_CORS=http://localhost:3000,http://127.0.0.1:3000
ADMIN_CORS=http://localhost:9000,http://localhost:5173
```
*(If using a cloud database like Neon or Supabase, paste their provided connection URI into `DATABASE_URL` instead).*

#### 3. Run Migrations & Create Admin User
```bash
cd apps/backend
npx medusa db:migrate
npx medusa user -e admin@theletterink.com -p AdminPassword123!
```

#### 4. Start the Medusa Backend
```bash
cd ../..
npm run backend:dev
```
- **Backend API**: `http://localhost:9000`
- **Medusa Admin Dashboard**: `http://localhost:9000/app`

---

### Option 2: Docker Installation (PostgreSQL via Docker Compose)

> **Use this if**: You have Docker / Docker Desktop installed and want to start the database with a single command without installing PostgreSQL natively.

#### 1. Start Database Container
From the repository root:
```bash
docker compose up -d postgres
```
*This starts a PostgreSQL 15 container mapped to port `5433` (to avoid conflicting with any system PostgreSQL on 5432) and automatically provisions the `medusa-backend` database.*

#### 2. Configure Backend Environment
Navigate to `letter-ink-backend` and install dependencies:
```bash
cd letter-ink-backend
npm install
cp apps/backend/.env.template apps/backend/.env
```
Open `apps/backend/.env` and configure the Docker database connection (port `5433`):
```env
DATABASE_URL=postgres://postgres:password@localhost:5433/medusa-backend
JWT_SECRET=supersecret-jwt-key-for-dev
COOKIE_SECRET=supersecret-cookie-key-for-dev
MEDUSA_BACKEND_URL=http://localhost:9000
STORE_CORS=http://localhost:3000,http://127.0.0.1:3000
ADMIN_CORS=http://localhost:9000,http://localhost:5173
```

#### 3. Run Migrations & Create Admin User
```bash
cd apps/backend
npx medusa db:migrate
npx medusa user -e admin@theletterink.com -p AdminPassword123!
```

#### 4. Start the Medusa Backend
```bash
cd ../..
npm run backend:dev
```
- **Backend API**: `http://localhost:9000`
- **Medusa Admin Dashboard**: `http://localhost:9000/app`

---

### Frontend Storefront Setup (Next.js 16)

1. Open a new terminal and navigate to the storefront directory:
   ```bash
   cd letter-ink-frontend
   bun install   # or: npm install
   ```

2. Configure `.env.local` in `letter-ink-frontend/`:
   ```env
   NEXT_PUBLIC_MEDUSA_BACKEND_URL=http://localhost:9000
   NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=pk_your_medusa_publishable_key
   NEXT_PUBLIC_URL=http://localhost:3000

   # Razorpay credentials (Optional for local simulated dev, required for real payments)
   NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_YourKeyIdHere
   RAZORPAY_KEY_SECRET=YourRazorpaySecretHere
   ```
   *(Retrieve your Publishable API key from the Medusa Admin under **Settings > Publishable API Keys**).*

3. Start the storefront development server:
   ```bash
   bun dev       # or: npm run dev
   ```
   - **Storefront URL**: `http://localhost:3000`

---

## Environment Variables Reference

### Storefront (`letter-ink-frontend/.env.local`)

| Variable | Required | Description |
|:---|:---:|:---|
| `NEXT_PUBLIC_MEDUSA_BACKEND_URL` | **Yes** | URL of the Medusa backend (e.g. `http://localhost:9000`). |
| `NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY` | **Yes** | Publishable key used to access store APIs. |
| `NEXT_PUBLIC_URL` | **Yes** | Canonical frontend origin (`http://localhost:3000`). |
| `NEXT_PUBLIC_RAZORPAY_KEY_ID` | Optional | Razorpay key ID for real or test payments. |
| `RAZORPAY_KEY_SECRET` | Optional | Razorpay key secret for signature verification. |

### Backend (`letter-ink-backend/apps/backend/.env`)

| Variable | Required | Description |
|:---|:---:|:---|
| `DATABASE_URL` | **Yes** | PostgreSQL connection URI. |
| `JWT_SECRET` | **Yes** | Encryption secret for user authentication tokens. |
| `COOKIE_SECRET` | **Yes** | Secret for session cookies. |
| `STORE_CORS` | **Yes** | Allowed CORS origins for the storefront. |
| `ADMIN_CORS` | **Yes** | Allowed CORS origins for the admin panel. |

---

## Order Lifecycle & Admin Operations

1. **Placing an Order**:
   - The patron configures custom lettering on a product and adds it to the cart.
   - At `/checkout`, the customer inputs delivery details, selects a payment option, and pays via Razorpay.
   - The backend validates the payment, attaches the India delivery shipping method, and completes the cart into an official Medusa `order`.

2. **Managing in Medusa Admin (`http://localhost:9000/app/orders`)**:
   - **Fulfillment**: Click on an order &rarr; Create Fulfillment &rarr; Select items &rarr; Add tracking number / courier waybill.
   - **Delivery**: When the parcel is dispatched or marked delivered in Admin, the status updates to `shipped` or `delivered`.

3. **Customer Tracking (`/order/track`)**:
   - The patron visits `/order/track` and enters their **Brand Reference** (e.g. `#TLI-919691` or `order_...`) along with their **Email or Phone Number**.
   - The order timeline updates dynamically in real-time as the team progresses from atelier crafting to courier delivery.

---

## Testing & Quality Verification

### Automated Checkout & Tracking Test
An automated end-to-end script is available to test cart creation, shipping method assignment, payment verification, and tracking lookup in one step:

```bash
cd letter-ink-frontend
node scripts/test-order-flow.mjs
```

### Manual Checkout Verification
1. Open `http://localhost:3000` and add any product to your bag.
2. Proceed to `/checkout`, fill in your name, address, and mobile number.
3. Click **Proceed to Payment**.
4. In simulation mode (or Razorpay test mode), approve the payment.
5. You will be redirected to the order success page showing your `#TLI-XXXXXX` reference.
6. Click **Track Order** to view your order live on the tracking timeline.
7. Open `http://localhost:9000/app/orders` to confirm the order appears in Medusa Admin.

---

## Troubleshooting & Windows Development

### 1. "Order not appearing in Medusa Admin"
- **Cause**: Medusa requires an explicit shipping method attached to every cart before it can be converted into an order.
- **Solution**: The checkout verification route (`/api/checkout/razorpay/verify`) automatically links the standard shipping option (`Standard Delivery (India)`) prior to calling `/complete`. If creating custom cart workflows, ensure `POST /store/carts/:id/shipping-methods` is called before `/store/carts/:id/complete`.

### 2. Node.js IPv6 Resolution Drops (`ECONNREFUSED ::1:9000`)
- On Windows, `fetch("http://localhost:9000")` intermittently resolves to IPv6 `::1`, which fails if the server only binds to IPv4 `127.0.0.1`.
- **Solution**: The codebase explicitly normalizes `localhost` to `127.0.0.1` for backend communication inside server-side route handlers.

### 3. Port Conflicts
- If PostgreSQL or Medusa fails to launch, check for existing processes on ports `5432`, `5433`, or `9000`:
  ```powershell
  Get-NetTCPConnection -LocalPort 9000 -ErrorAction SilentlyContinue
  ```

---

## License

Private & Confidential — © The Letter Ink. All rights reserved.
