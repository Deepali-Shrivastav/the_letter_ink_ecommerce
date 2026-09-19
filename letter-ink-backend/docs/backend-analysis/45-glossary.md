# 45 — Glossary
## letter-ink-backend · Domain and Technical Terms

> Reference for all terms used across the backend analysis documentation suite.

---

## Domain Terms (The Letter Ink)

| Term | Definition |
|---|---|
| **Atelier** | Internal term for the product customisation system — referenced in the admin widget title "Product Customisation (Atelier)" |
| **Black Velvet** | A dark paper color option (`#1a1a1a`). One of the seeded paper options. |
| **Claret** | A deep red paper color option (`#722F37`). |
| **Compatibility Rule** | A directional rule stating that if option A is selected, option B is a valid companion selection (e.g., "Black Velvet paper → Gold ink is allowed"). |
| **Copperplate** | A formal calligraphy font style available as a customisation option. |
| **Customisation Group** | A logical grouping of related options (e.g., "Paper Color", "Ink Color"). Has a type hint (`swatch`, `chip`, `text`). |
| **Customisation Option** | An individual selection within a group (e.g., "Black Velvet"). Has a machine value, display label, and optional color hex. |
| **Customisation Profile** | The complete set of groups, options, compatibility rules, and text fields assigned to a product. |
| **Ecru** | A warm off-white/cream paper color (`#C2B280`). A light color requiring dark ink. |
| **Font Style** | A customisation group (`type=chip`) offering typography choices (Copperplate, Spencerian, etc.). |
| **Ink Color** | A customisation group (`type=swatch`) offering metallic/matte ink color choices. |
| **is_light_color** | Boolean flag on a `customisation_option` indicating whether the color is light (true = light background, needs dark text overlay). |
| **Name Frame** | A product type — a decorative frame with a custom name printed in the selected ink/font. The canonical Letter Ink product. |
| **Paper Color** | A customisation group (`type=swatch`) offering base paper colors. |
| **Personalisation Text** | Free-form text entered by the customer (e.g., their name), validated against `max_chars`. Stored in `customisation_text_field`. |
| **Spencerian** | A flowing, script calligraphy font style. |

---

## Medusa Framework Terms

| Term | Definition |
|---|---|
| **@medusajs/framework** | The core Medusa SDK — provides HTTP, IoC container, workflow SDK, model utilities, type definitions |
| **@medusajs/medusa** | The Medusa commerce application — bundles all core modules and workflows |
| **Admin SDK** | `@medusajs/admin-sdk` — SDK for creating admin widgets and custom routes |
| **completeCartWorkflow** | Medusa's workflow that converts a cart with completed payment into an order |
| **compensate** | In a workflow step, the `compensate` function runs if a later step fails, allowing the step to undo its changes (rollback) |
| **ContainerRegistrationKeys** | Constants like `LOGGER`, `LINK`, `QUERY` for resolving core services from the IoC container |
| **defineConfig** | `@medusajs/framework/utils` utility for creating `medusa-config.ts` |
| **defineLink** | `@medusajs/framework/utils` utility for creating cross-module association definitions |
| **defineWidgetConfig** | `@medusajs/admin-sdk` utility for configuring admin widget injection zone |
| **DTC Starter** | "Direct to Consumer Starter" — the official Medusa starter template this repository was initialized from |
| **IoC Container** | Inversion of Control container — Medusa's dependency injection system. Accessed via `req.scope.resolve(MODULE_KEY)` |
| **Link** | A Medusa framework concept for cross-module data associations. Defines a relationship between models in different modules without SQL foreign keys. |
| **Link System** | The Medusa infrastructure that manages module links — creates pivot tables and resolves cross-module queries |
| **MedusaService** | A factory function in `@medusajs/framework/utils` that auto-generates CRUD methods for a set of data models |
| **medusa-config.ts** | The main configuration file for a Medusa application — defines database, CORS, module registrations |
| **MikroORM** | The ORM Medusa uses internally — developers interact with it through Medusa's model DSL and service abstraction |
| **Module** | A self-contained package of data models, service, and migrations registered with the Medusa framework |
| **Module Link** | See "Link" |
| **model.define()** | Medusa's DSL for defining database entities (instead of raw MikroORM decorators) |
| **Modules enum** | `@medusajs/framework/utils.Modules` — constants for all core module keys (PRODUCT, CART, ORDER, etc.) |
| **publishable API key** | A key sent in the `x-publishable-api-key` header on store API requests — scopes requests to a sales channel |
| **req.scope** | The Medusa IoC container available on every HTTP request — use `req.scope.resolve(KEY)` to get services |
| **Sales Channel** | A channel through which products are sold (e.g., "Default Sales Channel"). Products and API keys are linked to channels. |
| **Stock Location** | A physical warehouse location. Inventory levels are tracked per location. |
| **Turborepo** | A monorepo build system managing task pipelines across workspaces |
| **Widget zone** | A named injection point in the admin dashboard where custom React components can be rendered |
| **Workflow** | A series of compensatable steps orchestrated by Medusa's workflow engine. Should contain all business logic. |
| **WorkflowResponse** | Wrapper for a workflow's return value |
| **StepResponse** | Wrapper for a workflow step's return value, optionally including rollback data |

---

## Technical Architecture Terms

| Term | Definition |
|---|---|
| **DAG** | Directed Acyclic Graph — the structure of a Medusa workflow |
| **FK** | Foreign Key — a database constraint that enforces referential integrity |
| **JSONB** | PostgreSQL's binary JSON column type — supports arbitrary nested data with good query performance |
| **Migration** | A versioned database schema change script. Medusa uses MikroORM migrations. |
| **Modular Monolith** | An architecture where a single deployable unit (monolith) is internally organized into well-bounded modules — what Medusa implements |
| **Partial Index** | A PostgreSQL index with a WHERE clause — e.g., `WHERE deleted_at IS NULL` to only index non-deleted rows |
| **Soft Delete** | A deletion pattern where records are marked with a `deleted_at` timestamp instead of being physically removed. All Medusa tables use this. |
| **ULID** | Universally Unique Lexicographically Sortable Identifier — the ID format Medusa uses for all entity IDs |

---

## File Reference

| Abbreviation | Full path |
|---|---|
| `medusa-config.ts` | `apps/backend/medusa-config.ts` |
| `customisation/index.ts` | `apps/backend/src/modules/customisation/index.ts` |
| `customisation/service.ts` | `apps/backend/src/modules/customisation/service.ts` |
| `Migration1` | `apps/backend/src/modules/customisation/migrations/Migration20260916121529.ts` |
| `Migration2` | `apps/backend/src/modules/customisation/migrations/Migration20260917064102.ts` |
| `store customisation route` | `apps/backend/src/api/store/products/[productId]/customisation/route.ts` |
| `product-customisation link` | `apps/backend/src/links/product-customisation.ts` |
| `admin widget` | `apps/backend/src/admin/widgets/product-customisation-widget.tsx` |
| `initial seed` | `apps/backend/src/migration-scripts/initial-data-seed.ts` |
| `customisation seed` | `apps/backend/src/migration-scripts/seed-customisation.ts` |
