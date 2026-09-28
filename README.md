# The Letter Ink - eCommerce Platform

This repository contains the backend and frontend for The Letter Ink eCommerce platform. 
The project is divided into two main parts:
1. **letter-ink-backend**: A Medusa.js backend handling the commerce logic.
2. **The Letter Ink Storefront**: A Next.js frontend storefront (in `yournextstore/`).

## Prerequisites

Before you begin, ensure you have the following installed on your machine:
- [Node.js](https://nodejs.org/) (v20 or higher)
- [Bun](https://bun.sh/) (for the storefront)
- [PostgreSQL](https://www.postgresql.org/) (v15 or higher)

---

## 1. Setting up the Backend (Medusa)

### Install Dependencies
Navigate to the backend directory and install the necessary dependencies using npm:
```bash
cd letter-ink-backend
npm install
```

### Configure Environment Variables
Copy the provided environment template to create your local `.env` file:
```bash
cp apps/backend/.env.template apps/backend/.env
```
Open `apps/backend/.env` and update the `DATABASE_URL` to point to your local PostgreSQL instance. **You must first create an empty database in Postgres** (e.g., named `medusa-backend`).
```env
# Example connection string
DATABASE_URL=postgres://<username>:<password>@localhost:5432/medusa-backend
```

### Run Migrations
Run the Medusa migrations to create the necessary tables in your database:
```bash
cd apps/backend
npx medusa db:migrate
```

### Create Admin User (Optional)
To access the Medusa Admin dashboard, create an admin user by running:
```bash
npx medusa user -e admin@test.com -p supersecret
```

### Start the Backend
Start the Medusa backend from the root of the backend folder:
```bash
cd ../..
npm run backend:dev
```
The backend API will run on `http://localhost:9000` and the admin dashboard will be accessible at `http://localhost:9000/app`.

---

## 2. Setting up the Storefront (Next.js)

### Install Dependencies
Open a **new terminal window**, navigate to the storefront directory, and install dependencies using Bun:
```bash
cd yournextstore
bun install
```

### Configure Environment Variables
Ensure you have a `.env.local` file setup (you can copy the example if there is one, or just create it) and make sure your storefront is pointing to the local backend.
```bash
NEXT_PUBLIC_MEDUSA_BACKEND_URL=http://localhost:9000
NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=pk_...

# Razorpay Configuration (Optional for development / required for live payments)
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_...
RAZORPAY_KEY_SECRET=...
```

### Start the Storefront
Start the Next.js development server:
```bash
bun dev
```
The storefront will now be accessible at `http://localhost:3000` (or whichever port Bun assigns, usually 3000).

---

## 3. Razorpay Checkout Integration

The storefront features an integrated checkout flow with **Razorpay**:
- **Route**: `/checkout` (Delivery address, phone, contact, promotional vouchers, order summary).
- **Payment Gateway**: Powered by Razorpay with support for UPI (Google Pay, PhonePe, Paytm, BHIM), Credit/Debit Cards, NetBanking (50+ banks), and Wallets.
- **API Endpoints**:
  - `POST /api/checkout/razorpay/create-order`: Generates a verified Razorpay order.
  - `POST /api/checkout/razorpay/verify`: Validates HMAC-SHA256 signature, completes the cart in Medusa, clears the cart cookie, and stores the order for the success page.
- **Development/Simulation Mode**: If Razorpay API keys are not yet provided in `.env.local`, a test simulation modal allows testing the complete checkout flow seamlessly.

