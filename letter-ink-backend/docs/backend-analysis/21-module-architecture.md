# 21 — Module Architecture: Customisation Module (Deep Analysis)
## letter-ink-backend · application-specific module

> **Analysis only. Do not modify the codebase.**

---

## 1. Module Identity

| Property | Value | Evidence |
|---|---|---|
| Module key | `customisation` | `src/modules/customisation/index.ts:4` |
| Registration | `medusa-config.ts:16-19` | `resolve: "./src/modules/customisation"` |
| Service class | `CustomisationModuleService` | `service.ts` |
| Base class | `MedusaService(...)` | Medusa framework utility |
| Models | 5 | See section 2 |
| Migrations | 2 | `Migration20260916121529`, `Migration20260917064102` |
| Custom workflows | 0 | None |
| Custom subscribers | 0 | None |
| Module link | 1 | `product ↔ customisationGroup` |

---

## 2. Data Models

### Model 1: `CustomisationGroup`

**Purpose:** A logical grouping of related options (e.g., "Paper Color", "Ink Color", "Font Style").

```typescript
// src/modules/customisation/models/customisation-group.ts
const CustomisationGroup = model.define("customisation_group", {
  id:            model.id().primaryKey(),       // Medusa-generated ULID/nanoid
  name:          model.text(),                  // Display name (e.g., "Paper Color")
  type:          model.enum(["swatch", "chip", "text"]), // UI rendering hint
  display_order: model.number().default(0),      // Sort order in UI
  is_required:   model.boolean().default(false), // Whether this group is mandatory
})
```

**DB Table:** `customisation_group`

**UI type meanings:**
- `swatch` → Color circles (paper, ink)
- `chip` → Text chips (font styles)
- `text` → (Currently unused — free-text grouping)

---

### Model 2: `CustomisationOption`

**Purpose:** An individual option within a group (e.g., "Black Velvet" paper, "Gold" ink, "Copperplate" font).

```typescript
// src/modules/customisation/models/customisation-option.ts
const CustomisationOption = model.define("customisation_option", {
  id:            model.id().primaryKey(),
  label:         model.text(),                  // Human-readable name
  value:         model.text(),                  // Machine value (e.g., "black-velvet")
  color_hex:     model.text().nullable(),       // Hex code for swatch rendering
  is_light_color: model.boolean().default(false), // Affects contrast of overlay text
  display_order: model.number().default(0),
  is_available:  model.boolean().default(true), // Can be toggled off without deletion
  group_id:      model.text(),                  // Reference to CustomisationGroup
})
```

**DB Table:** `customisation_option`

**Critical Note:** `group_id` had a database-level FK constraint to `customisation_group.id` in Migration 1 (`customisation_option_group_id_foreign`), but **this constraint was explicitly dropped in Migration 2** along with its index. After Migration 2, `group_id` is an unvalidated text column — a data integrity regression.

---

### Model 3: `CustomisationTextField`

**Purpose:** A free-text input field attached to a specific product for personalization (e.g., "Enter name to be scripted").

```typescript
// src/modules/customisation/models/customisation-text-field.ts
const CustomisationTextField = model.define("customisation_text_field", {
  id:          model.id().primaryKey(),
  product_id:  model.text(),              // Cross-module ref to Medusa product
  label:       model.text(),              // Field label shown to customer
  placeholder: model.text(),             // Placeholder text in the input
  max_chars:   model.number().default(120), // Character limit
  is_required: model.boolean().default(false),
})
```

**DB Table:** `customisation_text_field`

**Limitation:** `max_chars` is only a data field — there is no server-side enforcement of this limit in any route handler or workflow.

---

### Model 4: `CustomisationCompatibilityRule`

**Purpose:** Defines which ink option is compatible with which paper option (directional rule: source → target).

```typescript
// src/modules/customisation/models/customisation-compatibility-rule.ts
const CustomisationCompatibilityRule = model.define("customisation_compatibility_rule", {
  id:               model.id().primaryKey(),
  source_option_id: model.text(),   // The "trigger" option (e.g., "black-velvet" paper)
  target_option_id: model.text(),   // The "allowed" option (e.g., "silver-sparkle" ink)
})
```

**DB Table:** `customisation_compatibility_rule`

**Semantics from seed data:**
```
Black Velvet paper → Silver Sparkle ink  (allowed)
Black Velvet paper → Gold ink           (allowed)
Claret paper       → Gold ink           (allowed)
Ecru paper         → Black ink          (allowed)
Ecru paper         → Gold ink           (allowed)
```

**Important:** Rules are **unidirectional**. If A→B is a rule, the system does NOT automatically imply B→A. The rule says "if source is selected, target is compatible."

**Missing:** There are no rules for the reverse direction, and no rule for "blocked" combinations — the system only knows "allowed" combinations, not "blocked" ones.

---

### Model 5: `CustomisationProductGroup`

**Purpose:** Junction table linking a product to a customisation group, with ordering and required status.

```typescript
// src/modules/customisation/models/customisation-product-group.ts
const CustomisationProductGroup = model.define("customisation_product_group", {
  id:            model.id().primaryKey(),
  product_id:    model.text(),   // Cross-module ref to Medusa product
  group_id:      model.text(),   // Cross-module ref to CustomisationGroup
  display_order: model.number().default(0),
  is_required:   model.boolean().default(false),
})
```

**DB Table:** `customisation_product_group`

**Note:** This provides override-level `is_required` per product-group assignment, in addition to the group-level `is_required`. The semantics of both being present is ambiguous — it's unclear which takes precedence.

---

## 3. Service Architecture

```typescript
// src/modules/customisation/service.ts
class CustomisationModuleService extends MedusaService({
  CustomisationGroup,
  CustomisationOption,
  CustomisationTextField,
  CustomisationProductGroup,
  CustomisationCompatibilityRule,
}) {}
```

`MedusaService` is a framework factory that auto-generates CRUD methods for each registered model:

| Generated Method | Description |
|---|---|
| `listCustomisationGroups(filters?, options?)` | List groups with optional filters and relations |
| `createCustomisationGroups(data)` | Create one or many groups |
| `updateCustomisationGroups(data)` | Update by id or filters |
| `deleteCustomisationGroups(ids)` | Soft delete |
| `retrieveCustomisationGroup(id, options?)` | Get single by id |
| _(Same pattern for all 5 models)_ | |

**No custom methods exist.** All business logic (assembly, validation) is in the API route handlers.

---

## 4. Module Link

```typescript
// src/links/product-customisation.ts
export default defineLink(
  ProductModule.linkable.product,
  {
    linkable: CustomisationModule.linkable.customisationGroup,
    isList: true,  // one product → many groups
  }
)
```

**Creates:** A Medusa-managed pivot table in the database linking `product.id` to `customisation_group.id`.

**Status:** The link is defined but the `CustomisationModule.linkable.customisationGroup` property may not be correctly exposed given that `customisationGroup` is not a `linkable` designation specified in the module's `index.ts`. This could cause the link to not resolve at runtime — needs verification.

---

## 5. API Endpoints

### Admin Endpoints

| Method | Path | Handler | What it calls |
|---|---|---|---|
| GET | `/admin/customisation/groups` | `groups/route.ts` | `listCustomisationGroups({}, { relations: ["options"] })` |
| POST | `/admin/customisation/groups` | `groups/route.ts` | `createCustomisationGroups(req.body)` |
| PATCH | `/admin/customisation/groups/:id` | `groups/[id]/route.ts` | `updateCustomisationGroups({ id, ...req.body })` |
| DELETE | `/admin/customisation/groups/:id` | `groups/[id]/route.ts` | `deleteCustomisationGroups(id)` |
| GET | `/admin/customisation/compatibility` | `compatibility/route.ts` | `listCustomisationCompatibilityRules()` |
| POST | `/admin/customisation/compatibility` | `compatibility/route.ts` | `createCustomisationCompatibilityRules(req.body)` |
| DELETE | `/admin/customisation/compatibility/:id` | `compatibility/[id]/route.ts` | `deleteCustomisationCompatibilityRules(id)` |
| GET | `/admin/customisation/products/:productId` | `products/[productId]/route.ts` | `listCustomisationProductGroups({ product_id })` |
| POST | `/admin/customisation/products/:productId` | `products/[productId]/route.ts` | `createCustomisationProductGroups(payload)` |

### Store Endpoints

| Method | Path | Handler | What it does |
|---|---|---|---|
| GET | `/store/products/:productId/customisation` | `store/products/[productId]/customisation/route.ts` | **Assembles full config**: product groups → groups → options → compatibility rules → text field |

---

## 6. Store Endpoint — Deep Analysis

The most complex custom code in the repository. Source: `src/api/store/products/[productId]/customisation/route.ts`

```
Request: GET /store/products/:productId/customisation

Step 1: listCustomisationProductGroups({ product_id: productId }, { order: { display_order: "ASC" } })
         → If empty → return { groups: [], text_field: null }

Step 2: listCustomisationGroups({ id: groupIds })

Step 3: listCustomisationOptions({ group_id: groupIds, is_available: true }, { order: { display_order: "ASC" } })

Step 4: listCustomisationCompatibilityRules({ source_option_id: optionIds })
         → Only fetches rules where source is in this product's options

Step 5: listCustomisationTextFields({ product_id: productId })
         → Takes first result only

Assembly:
  For each productGroup:
    Find the group
    Find options belonging to that group
    For each option, find compatibility rules where it is source
    Build compRulesByValue: { optionValue: [targetOptionId, ...] }
    Return { ...group, display_order, is_required, options, compatibility_rules }

Response: { groups: assembledGroups, text_field }
```

**Problems identified:**
1. `try/catch` returns a 500 with `{ error: "Failed to fetch customisation config" }` — swallows the actual error
2. Raw error is `console.error`'d — leaks to server logs but not to client
3. No authentication — this is public. Any `productId` can be queried
4. `compatibility_rules` is indexed by **option value** (string) but returns **target_option_id** (ID). The client would need to resolve IDs back to values — inconsistent
5. Compatibility rules are only fetched for `source_option_id` in the current product's options — cross-product rules would be missed

---

## 7. Admin Widget

**File:** `src/admin/widgets/product-customisation-widget.tsx`

**Zone:** `product.details.after` — renders after product details in the admin dashboard

**Critical Bug:**
```typescript
import { sdk } from "../lib/sdk"; // This file does NOT exist
```
`src/admin/lib/sdk.ts` does not exist in the repository. The import will cause a runtime error when the widget loads. However, `sdk` is declared but never actually used in the widget body — the widget falls back to `fetch()`.

**What it shows:**
- Fetches `GET /admin/customisation/products/${product.id}`
- Displays linked group IDs and display orders
- Shows "No customisation groups linked" if empty
- No ability to add/remove/edit from the widget — read-only

---

## 8. Seed Data (from `seed-customisation.ts`)

The seed script creates the following data:

**Groups:**
| Group | Type | Required |
|---|---|---|
| Paper Color | swatch | true |
| Ink Color | swatch | true |
| Font Style | chip | true |

**Paper Options:**
| Label | Value | Color Hex | Light? |
|---|---|---|---|
| Black Velvet | black-velvet | #1a1a1a | false |
| Claret | claret | #722F37 | false |
| Ecru | ecru | #C2B280 | true |

**Ink Options:**
| Label | Value | Color Hex | Light? |
|---|---|---|---|
| Silver Sparkle | silver-sparkle | #C0C0C0 | true |
| Gold | gold | #FFD700 | true |
| Black | black | #000000 | false |

**Font Options:**
| Label | Value |
|---|---|
| Copperplate | copperplate |
| Spencerian | spencerian |

**Compatibility Rules:**
| Paper → Ink |
|---|
| Black Velvet → Silver Sparkle |
| Black Velvet → Gold |
| Claret → Gold |
| Ecru → Black |
| Ecru → Gold |

**Product link:** The seed tries to link to a product with `handle: "name-frame-royal-large"`. This product is **NOT seeded by `initial-data-seed.ts`** (which only seeds generic Medusa apparel). The link would only succeed if that product was created separately. Without it, the seed logs "Product 'name-frame-royal-large' not found. Skipping product link."

---

## 9. Gaps and Missing Capabilities

| Gap | Impact |
|---|---|
| **No cart-level customisation storage** | Customers can select customizations but they cannot be saved to a cart line item | Critical |
| **No order-level customisation storage** | Production team cannot see customizations on orders | Critical |
| **No server-side validation** | `max_chars`, required fields, compatibility — none enforced server-side | High |
| **No customisation pricing** | No price modifier for customization selections | High |
| **No validation workflow** | No workflow step to validate selected options against rules | High |
| **Internal FK dropped** | `group_id` on option is unvalidated after migration 2 | Medium |
| **No tests** | Zero unit or integration tests for any custom module code | High |
| **Widget import broken** | Admin widget imports non-existent file | High |
| **No `[seed]` option in admin** | Options cannot be managed from admin UI yet | Medium |
| **Compatibility rule direction** | Only unidirectional rules — no "blocked" concept | Medium |
| **Name-frame product absent** | The product the seed targets doesn't exist in seed data | Medium |
| **No font-to-compatibility rules** | Fonts have no compatibility constraints — intentional or gap? | Low |

---

## 10. Migration History

### Migration 1 — `20260916121529` (Initial schema)
- Created `customisation_group`
- Created `customisation_option` with FK to `customisation_group`
- Created `customisation_text_field`

### Migration 2 — `20260917064102` (Expansion)
- Created `customisation_compatibility_rule`
- Created `customisation_product_group`
- **Dropped** the FK and index from `customisation_option.group_id`

**Interpretation:** The decision to drop the FK appears intentional — possibly to prepare for cross-module group references or to simplify the schema. However, it creates a data integrity gap. A new migration should either restore the FK or explicitly document why it was dropped.

---

## 11. Classification

| Attribute | Value |
|---|---|
| Ownership | Application-specific (The Letter Ink) |
| Medusa dependency | `@medusajs/framework/utils` (model, MedusaService, Module) |
| Can be extracted to package? | Yes — it has no hard dependencies on Medusa data |
| Production-ready? | **No** — missing validation, cart integration, tests |
| Replaceable? | No — this is core Letter Ink business logic |
| Removable? | No — central to the product |
