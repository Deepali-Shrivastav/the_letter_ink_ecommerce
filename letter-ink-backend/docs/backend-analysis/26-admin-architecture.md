# 26 — Admin Architecture
## letter-ink-backend · Admin Dashboard Analysis

> **Analysis only. Do not modify the codebase.**

---

## 1. Admin Dashboard Overview

| Property | Value |
|---|---|
| **Package** | `@medusajs/dashboard: 2.21.0` |
| **Technology** | React 19, React Router, @tanstack/react-query, @medusajs/ui |
| **URL** | `http://localhost:9000/app` |
| **Served by** | Medusa backend (same process, same port) |
| **Auth** | Session cookie + JWT via Medusa auth module |
| **Extension mechanism** | Admin SDK (`@medusajs/admin-sdk`) — widgets and custom routes |

---

## 2. What the Medusa Admin Dashboard Provides Out-of-the-Box

| Section | URL | Features |
|---|---|---|
| Products | `/app/products` | Full product CRUD, variants, options, images, categories, collections |
| Orders | `/app/orders` | Order list, detail, fulfillment, returns, refunds |
| Customers | `/app/customers` | Customer list, detail, orders |
| Inventory | `/app/inventory` | Inventory items, stock levels, reservations |
| Promotions | `/app/promotions` | Promotion CRUD, conditions, campaigns |
| Pricing | `/app/pricing` | Price lists |
| Regions | `/app/regions` | Region management, shipping |
| Tax Regions | `/app/tax-regions` | Tax configuration |
| Shipping | `/app/shipping` | Shipping options, profiles, fulfillment sets |
| Users | `/app/settings/users` | Admin user management |
| Teams | `/app/settings/teams` | User groups |
| Sales Channels | `/app/settings/sales-channels` | Multi-channel config |
| API Keys | `/app/settings/api-keys` | Publishable + secret keys |
| Store | `/app/settings/store` | Store settings, currencies |

---

## 3. Custom Admin Extensions

### Extension Points in Medusa Admin

| Type | How to create | Use case |
|---|---|---|
| **Widget** | `src/admin/widgets/` — `export const config = defineWidgetConfig({ zone })` | Inject UI into existing admin pages |
| **Route (custom page)** | `src/admin/routes/` — `export default function Page()` | Add entirely new admin pages |
| **Menu link** | In route file — `export const handle = { label, icon }` | Add link in sidebar navigation |

---

### Existing Custom Extension: Product Customisation Widget

**File:** `src/admin/widgets/product-customisation-widget.tsx`

| Property | Value |
|---|---|
| **Zone** | `product.details.after` |
| **Title** | "Product Customisation (Atelier)" |
| **Behaviour** | Fetches and displays linked customisation group IDs for the current product |
| **Edit capability** | None — read-only display |

**Widget Flow:**
```
User opens /app/products/:id
  ↓
product.details.after zone renders
  ↓
ProductCustomisationWidget mounts with { product }
  ↓
fetch(`/admin/customisation/products/${product.id}`)
  ↓
Display list of group IDs (if any)
```

**Bugs:**
1. `import { sdk } from "../lib/sdk"` — file does not exist. Runtime import error.
2. Displays raw group IDs, not group names — low usability for operations team.

---

### Available Widget Zones (Medusa 2.x)

| Zone | Location |
|---|---|
| `product.details.before` | Before product details section |
| `product.details.after` | After product details section ← current widget |
| `order.details.before` | Before order details |
| `order.details.after` | After order details |
| `customer.details.before` | Before customer details |
| `customer.details.after` | After customer details |

---

## 4. Missing Admin Capabilities for The Letter Ink

| Capability | Priority | Type |
|---|---|---|
| Full customisation group management (create, edit, delete, view options) | High | Custom route/page |
| Option management per group (add, edit, delete, toggle availability) | High | Custom route/page |
| Compatibility rule management UI (visual matrix or list) | High | Custom route/page |
| Product-to-group assignment UI | Medium | Widget (extended) |
| Text field management per product | Medium | Widget |
| Production order queue | High | Custom route/page |
| Production order detail (showing customisation data) | High | Custom route/page |
| Production status management | High | Custom route/page |
| QC and packaging status | Medium | Custom route/page |

---

## 5. Admin Extension Architecture Plan

```
src/admin/
├── widgets/
│   └── product-customisation-widget.tsx      ← exists (broken import, read-only)
│
├── routes/                                    ← does NOT exist yet
│   ├── customisation/
│   │   ├── page.tsx                           ← Customisation management home
│   │   ├── groups/
│   │   │   ├── page.tsx                       ← List all groups
│   │   │   └── [id]/
│   │   │       └── page.tsx                   ← Group detail + options
│   │   └── compatibility/
│   │       └── page.tsx                       ← Compatibility rules matrix
│   └── production/
│       ├── page.tsx                           ← Production queue
│       └── [orderId]/
│           └── page.tsx                       ← Production order detail
│
└── components/                                ← Shared admin components
    ├── customisation-group-form.tsx
    ├── option-swatch.tsx
    └── compatibility-matrix.tsx
```

---

## 6. Admin i18n

**Directory:** `src/admin/i18n/`

The admin i18n directory exists (confirmed in directory listing) but content not analyzed — likely follows Medusa's `react-i18next` convention. Custom admin text will need to be added in the i18n translation files.

---

## 7. Admin SDK Pattern

```typescript
// How to create a custom admin widget
import { defineWidgetConfig } from "@medusajs/admin-sdk"
import { Container, Heading } from "@medusajs/ui"

export const config = defineWidgetConfig({
  zone: "product.details.after",
})

const MyWidget = ({ product }: { product: any }) => {
  return (
    <Container>
      <Heading>My Widget</Heading>
    </Container>
  )
}

export default MyWidget
```

```typescript
// How to create a custom admin page
import { defineRouteConfig } from "@medusajs/admin-sdk"
import { CustomIcon } from "@medusajs/icons"

export const config = defineRouteConfig({
  label: "Customisation",
  icon: CustomIcon,
})

const CustomisationPage = () => {
  return <div>Customisation Management</div>
}

export default CustomisationPage
```

---

## 8. Admin Data Fetching Pattern

The admin dashboard uses `@tanstack/react-query`. Custom pages should follow the same pattern:

```typescript
// Fetch from custom admin API
const { data, isLoading } = useQuery({
  queryKey: ["customisation-groups"],
  queryFn: () =>
    fetch("/admin/customisation/groups", {
      credentials: "include", // uses session cookie
    }).then(r => r.json()),
})
```

---

## 9. Summary

| Aspect | Status |
|---|---|
| Medusa admin dashboard | Active and complete for core commerce |
| Custom widget | 1 widget — read-only, broken import |
| Custom admin pages | None implemented |
| Custom sidebar navigation | None |
| Production management | Not implemented |
| Customisation management UI | Minimal (API routes exist, no UI) |
