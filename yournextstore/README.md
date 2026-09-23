<p align="center">
  <img src="public/Latest-logo.png" height="100" alt="The Letter Ink">
</p>

<h1 align="center">The Letter Ink — Storefront</h1>

<p align="center">
  <strong>Artisanal Calligraphy Studio & Bespoke Wedding Stationery Atelier</strong>
</p>

## Overview

The Letter Ink storefront is a high-performance Next.js ecommerce web application designed for bespoke stationery, custom calligraphy, wax seals, and atelier workshops. It integrates directly with the Medusa v2 backend.

## Tech Stack

- **Next.js 16** — App Router, React Server Components, React Compiler
- **Medusa.js v2** — Headless backend API integration
- **Tailwind CSS v4** — Design tokens and bespoke typography
- **Shadcn UI** — Accessible components built on Radix UI
- **TypeScript** — Strict type-safe development
- **Biome** — Fast linter and code formatting

## Prerequisites

- [Node.js 20+](https://nodejs.org/)
- [Bun 1.0+](https://bun.sh/)
- Running Medusa backend instance (on `http://localhost:9000`)

## Getting Started

1. **Install dependencies**:
   ```bash
   bun install
   ```

2. **Configure environment variables**:
   Ensure `.env.local` contains:
   ```env
   NEXT_PUBLIC_MEDUSA_BACKEND_URL=http://localhost:9000
   NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=your_publishable_api_key_here
   NEXT_PUBLIC_URL=http://localhost:3000
   ```

3. **Run development server**:
   ```bash
   bun dev
   ```
   Open [http://localhost:3000](http://localhost:3000) to view the atelier storefront.

## Key Features

- **Artisanal Collections**: Fine art stationery, wax seals, calligraphy tools, and workshop seats.
- **Custom Product Configurator**: Real-time previews for ink color, calligraphy styles, paper edges, and wax seals.
- **Bespoke Policies**: Tailored client commission agreements and privacy protection modals.
- **Atelier Journal**: Workshop updates and calligraphy guides.

## License

Private & Confidential — The Letter Ink. All rights reserved.
