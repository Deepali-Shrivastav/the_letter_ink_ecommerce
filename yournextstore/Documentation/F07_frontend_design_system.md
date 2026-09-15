# The Letter Ink — yournextstore: Design System

> **Document:** F07 — Design System  
> **Tailwind CSS:** v4.3.3 | **Shadcn-style components**

---

## Table of Contents

1. [Design Tokens](#1-design-tokens)
2. [Color System](#2-color-system)
3. [Typography](#3-typography)
4. [Spacing & Layout](#4-spacing--layout)
5. [Border Radius](#5-border-radius)
6. [Dark Mode](#6-dark-mode)
7. [Component Library](#7-component-library)
8. [CSS Utilities](#8-css-utilities)
9. [Animation](#9-animation)

---

## 1. Design Tokens

All tokens are defined as CSS custom properties in `app/globals.css` using the `@theme inline` block (Tailwind v4 syntax):

```css
@theme inline {
  --font-sans: var(--font-geist-sans);
  --font-mono: var(--font-geist-mono);
  
  --radius-sm: calc(var(--radius) - 4px);
  --radius-md: calc(var(--radius) - 2px);
  --radius-lg: var(--radius);
  --radius-xl: calc(var(--radius) + 4px);
  
  --color-background:         var(--background);
  --color-foreground:         var(--foreground);
  --color-card:               var(--card);
  --color-card-foreground:    var(--card-foreground);
  --color-popover:            var(--popover);
  --color-popover-foreground: var(--popover-foreground);
  --color-primary:            var(--primary);
  --color-primary-foreground: var(--primary-foreground);
  --color-secondary:          var(--secondary);
  --color-secondary-foreground: var(--secondary-foreground);
  --color-muted:              var(--muted);
  --color-muted-foreground:   var(--muted-foreground);
  --color-accent:             var(--accent);
  --color-accent-foreground:  var(--accent-foreground);
  --color-destructive:        var(--destructive);
  --color-border:             var(--border);
  --color-input:              var(--input);
  --color-ring:               var(--ring);
}
```

---

## 2. Color System

The project uses **OKLCH color space** — perceptually uniform, great for dark mode inversions.

### Light Mode (`:root`)

| Token | Value | Role |
|---|---|---|
| `--background` | `oklch(1 0 0)` | White — page background |
| `--foreground` | `oklch(0.145 0 0)` | Near-black — text |
| `--card` | `oklch(1 0 0)` | White — card background |
| `--card-foreground` | `oklch(0.145 0 0)` | Card text |
| `--popover` | `oklch(1 0 0)` | White — popover bg |
| `--popover-foreground` | `oklch(0.145 0 0)` | Popover text |
| `--primary` | `oklch(0.205 0 0)` | Dark gray — buttons, active |
| `--primary-foreground` | `oklch(0.985 0 0)` | Near-white on primary |
| `--secondary` | `oklch(0.97 0 0)` | Light gray — secondary buttons |
| `--secondary-foreground` | `oklch(0.205 0 0)` | Text on secondary |
| `--muted` | `oklch(0.97 0 0)` | Light gray — disabled/subtle |
| `--muted-foreground` | `oklch(0.52 0 0)` | Gray text — captions |
| `--accent` | `oklch(0.97 0 0)` | Light gray — hover states |
| `--accent-foreground` | `oklch(0.205 0 0)` | Text on accent |
| `--destructive` | `oklch(0.577 0.245 27.325)` | Red — errors, destructive |
| `--border` | `oklch(0.922 0 0)` | Light gray — borders |
| `--input` | `oklch(0.922 0 0)` | Input field borders |
| `--ring` | `oklch(0.708 0 0)` | Focus ring |

### Dark Mode (`.dark`)

| Token | Value | Role |
|---|---|---|
| `--background` | `oklch(0.145 0 0)` | Near-black |
| `--foreground` | `oklch(0.985 0 0)` | Near-white text |
| `--card` | `oklch(0.205 0 0)` | Dark card |
| `--primary` | `oklch(0.922 0 0)` | Light gray — primary in dark |
| `--primary-foreground` | `oklch(0.205 0 0)` | Dark text on primary |
| `--secondary` | `oklch(0.269 0 0)` | Dark secondary |
| `--muted` | `oklch(0.269 0 0)` | Dark muted |
| `--muted-foreground` | `oklch(0.708 0 0)` | Medium gray text |
| `--destructive` | `oklch(0.704 0.191 22.216)` | Lighter red for dark |
| `--border` | `oklch(1 0 0 / 10%)` | 10% white borders |
| `--input` | `oklch(1 0 0 / 15%)` | 15% white inputs |
| `--ring` | `oklch(0.556 0 0)` | Focus ring |

---

## 3. Typography

### Fonts

| Font | Variable | Usage |
|---|---|---|
| **Geist Sans** | `--font-geist-sans` | Body, UI, headings |
| **Geist Mono** | `--font-geist-mono` | Code, chat messages (preload: false) |

Both loaded via `next/font/google` — self-hosted, zero layout shift.

### Type Scale (Tailwind defaults)

| Class | Size | Weight | Usage |
|---|---|---|---|
| `text-4xl font-medium tracking-tight` | 2.25rem | 500 | Product page h1 |
| `text-3xl font-medium` | 1.875rem | 500 | Section headings |
| `text-2xl font-medium` | 1.5rem | 500 | Sub-section headings |
| `text-xl font-bold` | 1.25rem | 700 | Nav logo |
| `text-sm text-muted-foreground` | 0.875rem | 400 | Captions, meta |

### Prose (Rich Text)

Configured via `@tailwindcss/typography`:

```css
.prose {
  --tw-prose-body:     var(--muted-foreground);
  --tw-prose-headings: var(--foreground);
  --tw-prose-links:    var(--foreground);
  --tw-prose-bold:     var(--foreground);
  --tw-prose-bullets:  var(--muted-foreground);
  --tw-prose-counters: var(--muted-foreground);
}
```

Used on product detail content and blog posts.

---

## 4. Spacing & Layout

### Max Width

```css
max-w-7xl mx-auto px-4 sm:px-6 lg:px-8
/* = max-width: 80rem, centered, responsive horizontal padding */
```

Used consistently on ALL page containers.

### Grid Layouts

| Usage | Classes |
|---|---|
| Product grid (listing) | `grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8` |
| Product grid (featured) | `lg:grid-cols-3` |
| Product page | `lg:grid-cols-2 lg:gap-16` |
| Filter + listing | `lg:grid-cols-[16rem_minmax(0,1fr)] lg:gap-10` |
| Header | `flex items-center justify-between h-16` |

### Section Padding

```
py-16 sm:py-24   — Homepage sections
py-12 sm:py-16   — Product listing
py-8             — Product detail
```

---

## 5. Border Radius

| Token | Value | Usage |
|---|---|---|
| `--radius` | `0.625rem` (10px) | Base radius |
| `--radius-sm` | `0.375rem` (6px) | Badges, chips |
| `--radius-md` | `0.5rem` (8px) | Buttons, inputs |
| `--radius-lg` | `0.625rem` (10px) | Cards |
| `--radius-xl` | `0.875rem` (14px) | Modals, sheets |

Tailwind v4 maps: `rounded-sm`, `rounded-md`, `rounded-lg`, `rounded-xl`.

---

## 6. Dark Mode

### Provider

```tsx
// app/layout.tsx
<ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
```

- Theme stored as `class="dark"` on `<html>`
- Respects OS preference by default
- No CSS transition on change (prevents flash)
- `suppressHydrationWarning` on `<html>` to silence mismatch

### Toggle

```tsx
// components/theme-toggle.tsx
// Uses next-themes useTheme() hook
// Renders Sun/Moon icon button
```

### Dark Variant

Tailwind v4 dark variant:
```css
@custom-variant dark (&:is(.dark *));
```

Usage: `dark:text-white`, `dark:bg-gray-900`, etc.

---

## 7. Component Library

### Shadcn/Radix UI Components (`components/ui/`)

| Component | File | Radix Primitive |
|---|---|---|
| `Accordion` | `accordion.tsx` | `@radix-ui/react-accordion` |
| `Badge` | `badge.tsx` | — (CVA variants) |
| `Breadcrumb` | `breadcrumb.tsx` | — (semantic HTML) |
| `Button` | `button.tsx` | `@radix-ui/react-slot` |
| `Card` | `card.tsx` | — |
| `Checkbox` | `checkbox.tsx` | `@radix-ui/react-checkbox` |
| `Dialog` | `dialog.tsx` | `@radix-ui/react-dialog` |
| `DropdownMenu` | `dropdown-menu.tsx` | `@radix-ui/react-dropdown-menu` |
| `Input` | `input.tsx` | — |
| `Label` | `label.tsx` | `@radix-ui/react-label` |
| `Pagination` | `pagination.tsx` | — |
| `Popover` | `popover.tsx` | `@radix-ui/react-popover` |
| `ScrollArea` | `scroll-area.tsx` | `@radix-ui/react-scroll-area` |
| `Select` | `select.tsx` | `@radix-ui/react-select` |
| `Sheet` | `sheet.tsx` | `@radix-ui/react-dialog` |
| `Skeleton` | `skeleton.tsx` | — |
| `Slider` | `slider.tsx` | `@radix-ui/react-slider` |
| `Sonner` (Toast) | `sonner.tsx` | `sonner` package |
| `Tooltip` | `tooltip.tsx` | `@radix-ui/react-tooltip` |

### Adding New Components

```bash
bunx shadcn add <component-name>
# Example:
bunx shadcn add tabs
```

Configuration in `components.json`.

### Button Variants (CVA)

```typescript
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-colors ...",
  {
    variants: {
      variant: {
        default:     "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:     "border border-input bg-background hover:bg-accent",
        secondary:   "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost:       "hover:bg-accent hover:text-accent-foreground",
        link:        "underline-offset-4 hover:underline text-primary",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm:      "h-9 rounded-md px-3",
        lg:      "h-11 rounded-md px-8",
        icon:    "h-10 w-10",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  }
)
```

### Business Components (shared)

| Component | Location | Description |
|---|---|---|
| `ProductCard` | `components/product-card.tsx` | Product card for grid/listing |
| `QuickAddButton` | `components/quick-add-button.tsx` | One-click add (single-variant) |
| `ListingPagination` | `components/listing-pagination.tsx` | URL-driven pagination links |
| `ProductFilters` | `components/sections/product-filters.tsx` | Filter sidebar (desktop + mobile) |
| `ProductGrid` | `components/sections/product-grid.tsx` | Featured products grid |
| `TiptapRenderer` | `components/tiptap-renderer.tsx` | Rich text renderer |
| `NewsletterDialog` | `components/newsletter-dialog.tsx` | Popup newsletter capture |
| `CookieConsentBanner` | `components/cookie-consent-banner.tsx` | GDPR consent UI |
| `StoreChatSection` | `components/store-chat/store-chat-section.tsx` | AI chat widget |
| `ThemeToggle` | `components/theme-toggle.tsx` | Dark/light mode toggle |
| `ReferralBadge` | `components/referral-badge.tsx` | "Made with YNS" badge |

---

## 8. CSS Utilities

### `cn()` — Class Merger

```typescript
// lib/utils.ts
import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

Usage:
```typescript
<div className={cn("base-class", isActive && "active-class", className)} />
```

### Image Shimmer

Loading state for product images:

```css
.yns-image-shimmer {
  background: linear-gradient(90deg, 
    oklch(0.9 0 0) 0%, oklch(0.95 0 0) 40%, oklch(1 0 0) 50%,
    oklch(0.95 0 0) 60%, oklch(0.9 0 0) 100%
  );
  background-size: 200% 100%;
  animation: yns-image-shimmer 1.2s ease-in-out infinite;
}
```

### Chat Markdown

Scoped styles for AI assistant message rendering:

```css
.chat-markdown { @apply min-w-0 space-y-2 text-sm; }
.chat-markdown [data-streamdown^="heading-"] { @apply mb-1 mt-2 text-sm font-semibold; }
.chat-markdown [data-streamdown="inline-code"] { @apply rounded-sm border bg-muted px-1 py-0.5 font-mono; }
```

---

## 9. Animation

### Tailwind Animations

Imported via `tw-animate-css`:
```css
@import "tw-animate-css";
```

Common animations:
- `animate-pulse` — skeleton loading
- `animate-spin` — spinners

### Custom

```css
@keyframes yns-image-shimmer {
  0%   { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
```

### Dialog / Sheet

Radix UI components use built-in CSS animations for enter/exit — configured in `dialog.tsx` and `sheet.tsx` via `data-[state=open]` and `data-[state=closed]` selectors.
