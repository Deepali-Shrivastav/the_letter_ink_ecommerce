# 03 — Repository Structure
## letter-ink-backend · Complete Directory Tree with Annotations

> **Analysis only. Do not modify the codebase.**

---

## Root Level

```
letter-ink-backend/                         ← Root of Turborepo monorepo
├── apps/                                   ← Application workspace
│   └── backend/                            ← Only application (see below)
├── docs/                                   ← Generated analysis output
│   └── backend-analysis/                   ← THIS DOCUMENTATION SUITE
├── AGENTS.md                               ← AI agent guide (conventions + constraints)
├── CLAUDE.md                               ← Minimal project description
├── eslint.config.ts                        ← Root ESLint: @medusajs/eslint-plugin
├── turbo.json                              ← Turborepo task graph
├── package.json                            ← Root: npm workspaces definition
└── package-lock.json                       ← Lockfile
```

**`turbo.json` tasks:** `dev`, `build`, `start`, `lint`, `test`, `seed`

---

## `apps/backend/` — The Medusa Application

```
apps/backend/                               ← @dtc/backend — the Medusa v2 application
│
├── .medusa/                                ← Build output (git-ignored)
│   ├── cache/
│   ├── client/
│   └── types/
│
├── integration-tests/                      ← Integration test infrastructure
│   └── setup.js                           ← Test environment setup (102 bytes, minimal)
│
├── src/                                    ← ALL application source code
│   │
│   ├── admin/                              ← Admin dashboard extensions
│   │   ├── README.md                       ← Extension docs
│   │   ├── i18n/                           ← i18n translation files
│   │   ├── tsconfig.json
│   │   ├── vite-env.d.ts
│   │   └── widgets/                        ← Admin widgets (inject into existing pages)
│   │       └── product-customisation-widget.tsx  ← ONLY widget; zone: product.details.after
│   │
│   ├── api/                                ← HTTP route handlers
│   │   ├── README.md                       ← Route documentation
│   │   ├── admin/                          ← Admin API routes (/admin/*)
│   │   │   ├── custom/
│   │   │   │   └── route.ts               ← GET /admin/custom → 200 (placeholder)
│   │   │   └── customisation/             ← Custom admin APIs
│   │   │       ├── compatibility/
│   │   │       │   ├── route.ts           ← GET (list), POST (create)
│   │   │       │   └── [id]/
│   │   │       │       └── route.ts       ← DELETE
│   │   │       ├── groups/
│   │   │       │   ├── route.ts           ← GET (list with options), POST (create)
│   │   │       │   └── [id]/
│   │   │       │       ├── route.ts       ← PATCH, DELETE
│   │   │       │       └── options/       ← (directory exists, content not verified)
│   │   │       ├── options/
│   │   │       │   └── [id]/
│   │   │       │       └── route.ts       ← PATCH, DELETE option
│   │   │       └── products/
│   │   │           └── [productId]/
│   │   │               ├── route.ts       ← GET/POST product-group links
│   │   │               ├── groups/        ← group management
│   │   │               └── text-field/    ← text field crud
│   │   └── store/                          ← Store API routes (/store/*)
│   │       ├── custom/
│   │       │   └── route.ts               ← GET /store/custom → 200 (placeholder)
│   │       └── products/
│   │           └── [productId]/
│   │               └── customisation/
│   │                   └── route.ts       ← GET assembled customisation config (84 lines)
│   │
│   ├── jobs/                               ← Scheduled jobs
│   │   └── README.md                      ← Scheduled job docs (no actual jobs)
│   │
│   ├── links/                              ← Module link definitions
│   │   ├── README.md                       ← Link docs
│   │   └── product-customisation.ts       ← Product ↔ CustomisationGroup link
│   │
│   ├── migration-scripts/                  ← Data migration/seed scripts
│   │   ├── initial-data-seed.ts           ← 840 lines — generic Medusa demo data
│   │   └── seed-customisation.ts          ← 95 lines — Letter Ink customisation seed
│   │
│   ├── modules/                            ← Custom Medusa modules
│   │   ├── README.md                       ← Module creation docs
│   │   └── customisation/                 ← THE ONLY CUSTOM MODULE
│   │       ├── index.ts                   ← Module definition: CUSTOMISATION_MODULE
│   │       ├── service.ts                 ← CustomisationModuleService (MedusaService factory)
│   │       ├── models/                    ← Data models (5 models)
│   │       │   ├── customisation-group.ts
│   │       │   ├── customisation-option.ts
│   │       │   ├── customisation-text-field.ts
│   │       │   ├── customisation-compatibility-rule.ts
│   │       │   └── customisation-product-group.ts
│   │       └── migrations/               ← Database migration history
│   │           ├── Migration20260916121529.ts  ← Initial schema (3 tables)
│   │           ├── Migration20260917064102.ts  ← Expansion (2 tables, FK dropped)
│   │           └── .snapshot-customisation.json ← MikroORM schema snapshot (836 lines)
│   │
│   ├── subscribers/                        ← Event subscribers
│   │   └── README.md                      ← Subscriber docs (no actual subscribers)
│   │
│   └── workflows/                          ← Custom workflows
│       └── README.md                      ← Workflow docs (no actual workflows)
│
├── .env                                    ← Active development environment (12 lines)
├── .env.template                           ← Template for new developers
├── .gitignore                             ← Excludes: .medusa/, .env, node_modules/, dist/
├── .npmrc                                  ← legacy-peer-deps=true
├── instrumentation.ts                      ← OpenTelemetry (fully commented out)
├── jest.config.js                          ← Jest: 3 test types (unit/http/modules)
├── medusa-config.ts                        ← Medusa configuration: DB, CORS, custom module
├── package.json                            ← Scripts, dependencies
└── tsconfig.json                           ← TypeScript config
```

---

## Key File Sizes (Indicators of Complexity)

| File | Lines | Bytes | Significance |
|---|---|---|---|
| `initial-data-seed.ts` | 840 | 22,378 | Comprehensive seed script — generic Medusa demo data |
| `.snapshot-customisation.json` | 836 | 23,525 | DB snapshot — all 5 tables fully described |
| `store/products/[productId]/customisation/route.ts` | 83 | 2,941 | Most complex custom route — multi-query assembly |
| `seed-customisation.ts` | 95 | 4,991 | Letter Ink customisation seed |
| `product-customisation-widget.tsx` | 56 | 1,998 | Admin widget |
| `medusa-config.ts` | ~25 | small | Minimal configuration |
| `service.ts` | ~7 | small | Auto-generated service wrapper |
| Each migration | ~50 | small | Schema change scripts |

---

## Absent Directories (Expected but Missing)

| Expected Path | Why Expected | Status |
|---|---|---|
| `apps/storefront/` | Referenced in `AGENTS.md` | **ABSENT** |
| `src/admin/routes/` | Admin custom pages | **ABSENT** |
| `src/admin/lib/sdk.ts` | Imported by widget | **ABSENT** (broken import) |
| `src/modules/customisation/__tests__/` | Module tests | **ABSENT** |
| `integration-tests/http/` | HTTP tests | **ABSENT** |
| `src/workflows/*.ts` (real) | Business logic workflows | **ABSENT** |
| `src/subscribers/*.ts` (real) | Event handlers | **ABSENT** |
| `src/jobs/*.ts` (real) | Scheduled jobs | **ABSENT** |
| `Dockerfile` | Container definition | **ABSENT** |
| `docker-compose.yml` | Local dev infrastructure | **ABSENT** |
| `.github/workflows/` | CI/CD | **ABSENT** |
