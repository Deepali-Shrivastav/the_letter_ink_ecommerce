<p align="center">
  <img src="public/Latest-logo.png" height="100" alt="The Letter Ink">
</p>

<h1 align="center">The Letter Ink — Storefront</h1>

<p align="center">
  <strong>Artisanal Calligraphy Studio, Bespoke Stationery & Fine Art Atelier</strong><br>
  Built with Next.js 16, React 19 RSC, Tailwind CSS v4, Shadcn UI, and Medusa.js v2.
</p>

---

## Overview

The Letter Ink storefront is a luxury eCommerce application designed for handcrafted calligraphy stationery, wedding suites, wax seal sets, and bespoke commissions. It connects directly to the Medusa v2 headless commerce engine and includes real-time order tracking and Indian payment gateways.

---

## Tech Stack

- **Framework**: Next.js 16 (App Router, React Server Components)
- **Language**: TypeScript (Strict mode)
- **Styling**: Tailwind CSS v4 & custom atelier serif typography
- **Components**: Shadcn UI built on Radix UI primitives & Lucide Icons
- **Animation**: Framer Motion
- **Commerce Backend**: Medusa.js v2 Headless API
- **Payments**: Razorpay (UPI, NetBanking, Cards, Wallets)
- **Code Standards**: Biome linter and formatter

---

## Key Modules & Routes

| Route | Description |
|:---|:---|
| `/` | Atelier hero, bespoke signature collections, reviews, journal highlights |
| `/product/[slug]` | Product details with live custom lettering configurator & wax seal selector |
| `/cart` | Slide-over cart drawer with real-time totals and customized item metadata |
| `/checkout` | Luxury single-page checkout supporting Indian addresses and Razorpay payment |
| `/order/success/[id]` | Post-purchase confirmation page with direct tracking link |
| `/order/track` | Real-time dual-factor order tracking by Email/Mobile and Brand Reference |
| `/api/checkout/razorpay/*` | Razorpay order generation, HMAC verification, and cart completion |
| `/api/order/track` | Dynamic order status and timeline retrieval API |

---

## Getting Started

### 1. Prerequisites
- [Node.js 20+](https://nodejs.org/)
- [Bun](https://bun.sh/) (or `npm`)
- Running Medusa backend on `http://localhost:9000`

### 2. Install Dependencies
```bash
bun install
# or
npm install
```

### 3. Environment Variables
Ensure `.env.local` is present in the `yournextstore` folder:
```env
NEXT_PUBLIC_MEDUSA_BACKEND_URL=http://localhost:9000
NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=pk_your_publishable_api_key_here
NEXT_PUBLIC_URL=http://localhost:3000

# Razorpay Configuration (Optional for development / required for live payments)
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_...
RAZORPAY_KEY_SECRET=...
```

### 4. Run Development Server
```bash
bun dev
# or
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) in your browser.

---

## Testing Order Flows

Run the automated checkout and tracking validation script:
```bash
node scripts/test-order-flow.mjs
```

---

## License

Private & Confidential — © The Letter Ink. All rights reserved.
