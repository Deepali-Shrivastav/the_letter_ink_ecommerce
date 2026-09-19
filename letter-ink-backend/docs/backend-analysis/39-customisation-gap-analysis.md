# 39 — Customisation Engine Deep Analysis
## letter-ink-backend · The Letter Ink's Core Differentiator

> **Analysis only. Do not modify the codebase.**

---

## 1. What the Customisation Engine Must Do

The Letter Ink's core business is **personalized stationery**. The customisation engine must:

1. Define which customization options exist for each product
2. Express compatibility rules between options (e.g., "Black Velvet paper only works with Silver Sparkle or Gold ink")
3. Allow customers to make valid selections
4. Validate selections server-side (not just client-side)
5. Store selections with the cart line item
6. Persist selections with the order for production
7. Allow the production team to read exactly what to produce

---

## 2. Current Customisation Pipeline — Stage by Stage

### Stage 1: Product → Customisation Profile

**What exists:**
```
product_id
    ↓
customisation_product_group (junction: product_id + group_id + display_order + is_required)
    ↓
customisation_group (name, type: swatch/chip/text)
    ↓
customisation_option (label, value, color_hex, is_available)
```

**What works:** The data model correctly associates products with groups and groups with options.

**What's missing:**
- No link table between `customisation_option` and the parent group after migration 2 dropped the FK (the `group_id` column exists but has no DB constraint)
- No validation that a `group_id` in `customisation_option` actually points to a real group

**Evidence:**
```sql
-- Migration20260917064102.ts:12-14
ALTER TABLE "customisation_option" DROP CONSTRAINT IF EXISTS "customisation_option_group_id_foreign"
DROP INDEX IF EXISTS "IDX_customisation_option_group_id"
```

---

### Stage 2: Customisation Options → Compatibility Rules

**What exists:**
```
customisation_compatibility_rule
├── source_option_id  (e.g., "black-velvet" paper option ID)
└── target_option_id  (e.g., "silver-sparkle" ink option ID)
```

**Seed data rules:**
```
Black Velvet (paper) → Silver Sparkle (ink)
Black Velvet (paper) → Gold (ink)
Claret (paper) → Gold (ink)
Ecru (paper) → Black (ink)
Ecru (paper) → Gold (ink)
```

**What works:**
- Rules are stored and retrievable
- The store API endpoint assembles them into `compatibility_rules: { optionValue: [targetOptionId, ...] }`

**What's missing:**
- Rules are returned as `{ optionValue: ["id1", "id2"] }` — mixing value (string) and ID (string). The client must resolve IDs to values to do filtering. This should be `{ optionValue: ["target-value1", "target-value2"] }` for consistency
- No "blocked" concept — only "allowed" combinations defined
- If a source option has NO rules, the current endpoint returns `undefined` for that option's rules. The client must interpret this as "no restrictions" vs. "blocks all"
- No server-side enforcement — these rules are information, not constraints

---

### Stage 3: Customer Selection

**What exists:** Nothing. There is no concept of a "customer customisation selection" as a server-side entity.

**What the client must do:** Maintain selection state client-side and pass it when adding to cart.

**What the server does:** Currently nothing — there is no endpoint to submit or validate a selection before or after adding to cart.

---

### Stage 4: Cart Integration

**What exists:** Medusa's `cart_line_item.metadata` — a `jsonb` field that accepts arbitrary data.

**What's missing:** Everything.

```
Expected behavior (NOT IMPLEMENTED):
  POST /store/carts/:id/line-items
    + customisation_data: {
        paper_color: { option_id: "...", value: "black-velvet" },
        ink_color: { option_id: "...", value: "gold" },
        font_style: { option_id: "...", value: "copperplate" },
        personalisation_text: { text: "Jane Smith", field_id: "..." }
      }
    → Validate: all required groups selected?
    → Validate: compatible combinations?
    → Validate: text within max_chars?
    → Write to cart_line_item.metadata
```

---

### Stage 5: Customisation Values → Compatibility Rules → Customer Selection Validation

**What exists:** None.

**Flow that must be built:**

```
Receive customisation_data from client
    ↓
For each group marked is_required:
    Is it present in customisation_data? → Error if not
    ↓
For each selected option:
    Does a customisation_compatibility_rule exist with source_option_id = this option?
        Yes → Check that the paired option (other group's selection) is in target_option_ids
              If not → Incompatible selection error
        No  → No restriction, all pairings allowed
    ↓
For each text field marked is_required:
    Is personalisation_text present and non-empty? → Error if not
    Is personalisation_text.length ≤ max_chars? → Error if not
    ↓
Validation passed → write to line_item.metadata
```

---

### Stage 6: Checkout → Order

**What exists:** Medusa's `completeCartWorkflow` transfers cart data to order, including `cart_line_item.metadata` → `order_line_item.metadata`.

**What's needed:** If customisation data is written to `cart_line_item.metadata` in Stage 4, it will automatically flow to the order. No additional work needed for the transfer itself.

**What's missing:** A checkout validation step that re-validates customisation data before completing the cart (in case cart was modified after initial add-to-cart).

---

### Stage 7: Production

**What exists:** Nothing.

**What must be built:**
- A way for the production team to query orders with their customisation data
- A production status state machine (e.g., pending → in_production → quality_check → packaging → ready_to_ship)
- Admin UI for the production queue
- A production workflow

---

## 3. Customisation Data Schema Proposal (for future PRD)

This is what the `customisation_data` object in `cart_line_item.metadata` should look like:

```json
{
  "customisation_version": "1",
  "selections": [
    {
      "group_id": "cgroup_01abc...",
      "group_name": "Paper Color",
      "option_id": "copt_01xyz...",
      "option_value": "black-velvet",
      "option_label": "Black Velvet"
    },
    {
      "group_id": "cgroup_01def...",
      "group_name": "Ink Color",
      "option_id": "copt_01uvw...",
      "option_value": "gold",
      "option_label": "Gold"
    },
    {
      "group_id": "cgroup_01ghi...",
      "group_name": "Font Style",
      "option_id": "copt_01rst...",
      "option_value": "copperplate",
      "option_label": "Copperplate"
    }
  ],
  "text_fields": [
    {
      "field_id": "ctf_01jkl...",
      "field_label": "Custom Name",
      "value": "Jane Smith"
    }
  ]
}
```

This schema captures everything needed for production and allows re-rendering the customisation for order history.

---

## 4. Compatibility Rule Architecture Analysis

### Current Implementation
```
source_option_id → target_option_id
(Black Velvet)   → (Silver Sparkle)
(Black Velvet)   → (Gold)
```

**Interpretation in API response:**
```json
{
  "compatibility_rules": {
    "black-velvet": ["copt_silver_id", "copt_gold_id"],
    "claret":       ["copt_gold_id"],
    "ecru":         ["copt_black_id", "copt_gold_id"]
  }
}
```

**Problems:**
1. Values are mixed: keys are option `value` strings, values are option `id` strings — inconsistent
2. The client must understand that an option NOT present in the keys has "no restriction" — this is an implicit assumption, not explicit
3. There's no validation that `source_option_id` and `target_option_id` belong to different groups — a self-referencing rule within the same group would be stored without error

**Recommended future schema for API response:**
```json
{
  "compatibility": {
    "paper_color": {
      "black-velvet": {
        "allowed_ink_colors": ["silver-sparkle", "gold"]
      },
      "claret": {
        "allowed_ink_colors": ["gold"]
      },
      "ecru": {
        "allowed_ink_colors": ["black", "gold"]
      }
    }
  }
}
```

This is group-aware, uses values (not IDs), and is explicit about which groups constrain which.

---

## 5. What the Customisation Module Gets Right

| Aspect | Assessment |
|---|---|
| Medusa integration pattern | Correct — uses `model.define()`, `MedusaService`, `Module()` |
| Soft deletes | Correct — `deleted_at` on all tables |
| Display ordering | Good — `display_order` on groups and options |
| Availability toggle | Good — `is_available` allows disabling without deletion |
| Type hint for UI | Good — `swatch`/`chip`/`text` on groups |
| Color metadata | Good — `color_hex` + `is_light_color` for contrast-aware rendering |

---

## 6. What the Customisation Module Gets Wrong or Skips

| Issue | Impact |
|---|---|
| No cart integration | Critical — core feature absent |
| No server-side validation | High — client-only validation is not secure |
| Dropped internal FK | Medium — data integrity gap |
| No unique constraints | Medium — duplicate product-group links possible |
| No tests | High — zero confidence in correctness |
| Admin widget import broken | High — production runtime error |
| API response mixes IDs and values | Medium — client inconsistency |
| No way to order-level customisation | Critical — production team can't read selections |

---

## 7. Recommended Future Architecture (for PRD)

```
CustomisationModule (extend current)
├── Models (current + additions)
│   ├── CustomisationGroup        (keep)
│   ├── CustomisationOption       (keep + restore FK)
│   ├── CustomisationTextField    (keep)
│   ├── CustomisationCompatibilityRule  (keep + unique constraint)
│   ├── CustomisationProductGroup (keep + unique constraint)
│   └── [NEW] CartCustomisationSelection (store per-line-item selections)
│       OR use cart_line_item.metadata (simpler — recommended first)
│
├── Service (extend current)
│   ├── Auto-generated CRUD (current)
│   └── [NEW] validateCustomisationSelection(productId, selections)
│
├── Workflows [ALL NEW]
│   ├── validateCustomisationWorkflow
│   ├── addToCartWithCustomisationWorkflow
│   └── validateCustomisationAtCheckoutStep
│
└── Admin Extensions [EXTEND current]
    ├── Full management pages (groups, options, compatibility, product links)
    └── Production queue page
```

---

## 8. Single Most Important Architectural Decision

> **Should customisation selections be stored in `cart_line_item.metadata` (jsonb) or in a new custom table?**

**Option A: `cart_line_item.metadata` (jsonb)**
- Pros: Simpler, zero new tables, flows to order automatically, Medusa-native pattern
- Cons: No relational querying, no validation at DB level, migration harder if schema changes

**Option B: New custom table (`cart_line_item_customisation`)**
- Pros: Structured, queryable, validated
- Cons: Requires custom join logic, does not auto-flow to order, more complex

**Recommendation:** Start with **Option A** (metadata). It is the Medusa-idiomatic approach and sufficient for the business requirements at current scale. Migrate to Option B only if production reporting or analytics requires structured querying of customisation data.

This is the **#1 open question** that must be resolved in the PRD before any implementation begins.
