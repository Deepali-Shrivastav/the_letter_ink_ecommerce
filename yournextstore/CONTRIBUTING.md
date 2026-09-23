# Contributing to The Letter Ink

## Getting Started

```bash
bun install
cp .env.example .env.local
bun dev
```

You need [Bun 1.0+](https://bun.sh/) and the Medusa backend running on `http://localhost:9000`.

## Project Structure

This is a [Next.js App Router](https://nextjs.org/docs) project connecting to a Medusa.js backend.

Key directories and modules:
- **`lib/commerce.ts`** — API adapter connecting to Medusa backend endpoints (`commerce.productBrowse()`, `commerce.cartUpsert()`, etc.)
- **`lib/money.ts`** — `formatMoney()` for all price formatting
- **`components/ui/`** — Accessible UI primitives
- **`app/`** — Next.js 16 App Router pages and layouts

## Coding Conventions

[Biome](https://biomejs.dev/) enforces linting and formatting. Run `bun run lint` before pushing.

- Named exports for reusable components and helpers
- Strong TypeScript typing
- Server Components by default; `"use client"` only for client interactivity
- Responsive design adhering to atelier brand tokens

## Verification Checklist

```bash
bun run check     # Typecheck, lint, and run tests
bun run build     # Production build validation
```
