# The Letter Ink — theletterink: Component Library

> **Document:** F04 — Component Library Reference

---

## Table of Contents

1. [Component Conventions](#1-component-conventions)
2. [Layout Components](#2-layout-components)
3. [Cart Components](#3-cart-components)
4. [Product Components](#4-product-components)
5. [Listing Components](#5-listing-components)
6. [Search Components](#6-search-components)
7. [AI Chat Components](#7-ai-chat-components)
8. [Section Components](#8-section-components)
9. [UI Primitives](#9-ui-primitives)
10. [Utility Components](#10-utility-components)

---

## 1. Component Conventions

| Marker | Meaning |
|---|---|
| 🖥 RSC | Server Component — runs on server only |
| 💻 CC | Client Component — `"use client"` |
| 🔀 Mixed | Contains both RSC and CC children |

### Import Path

```typescript
// Always use path aliases
import { ProductCard } from "@/components/product-card"
import { Button } from "@/components/ui/button"
```

---

## 2. Layout Components

### `Navbar` — `app/navbar.tsx` 🖥

Navigation bar with active link highlighting.

```typescript
type NavLink = { href: string; label: string }

interface NavbarProps {
  links: NavLink[]
}
```

Uses plain `<a>` tags for nav links (no `usePathname` in RSC). Active state is handled by a small `"use client"` sub-component.

---

### `Footer` — `app/footer.tsx` 🖥

Site footer with store info, legal links, social links, payment icons.

Data: fetched from `meGetCached()` — store name, social links, legal pages.

---

### `CartButton` — `app/cart-button.tsx` 💻

Cart icon in the header with item count badge.

```typescript
// No props — reads from useCart()
function CartButton()
```

Calls `openCart()` on click.

---

## 3. Cart Components

### `CartProvider` — `app/cart/cart-context.tsx` 💻

Root cart state provider. Must wrap all components that use `useCart()`.

```typescript
function CartProvider({ children }: { children: ReactNode })
```

### `CartBootstrap` — `app/cart/cart-context.tsx` 💻

Seeds the cart from the server-read cookie value. Renders nothing.

```typescript
function CartBootstrap({ cart: Cart | null, cartId: string | null })
```

Must be inside `<Suspense>` to avoid blocking the prerendered shell.

### `CartSidebar` — `app/cart/cart-sidebar.tsx` 💻

Slide-out cart drawer (Sheet component).

```typescript
// No props — reads from useCart()
function CartSidebar()
```

Shows:
- Cart items via `CartItem`
- Subtotal (tax-aware)
- Checkout CTA (`<a href="/checkout">` — NOT Link)
- Empty state

### `CartItem` — `app/cart/cart-item.tsx` 💻

Individual line item in the cart sidebar.

```typescript
interface CartItemProps {
  item: CartLineItem
}
```

Features:
- Optimistic quantity adjustment (+/-)
- Remove item (via `removeFromCart` server action)
- Displays variant attributes
- Calls `setCartQuantity` server action

### `useCart()` — Hook

```typescript
const {
  cart,
  items,
  itemCount,
  subtotal,
  isOpen,
  isMutating,
  cartId,
  openCart,
  closeCart,
  dispatch,
  syncCart,
  reconcile,
  bootstrap,
  startMutation,
} = useCart()
```

Throws if used outside `CartProvider`.

---

## 4. Product Components

### `ProductCard` — `components/product-card.tsx` 🔀

Product card for grid/listing display.

```typescript
interface ProductCardProps {
  product: Product
  priority?: boolean    // true for first card (LCP)
}
```

Features:
- Product image with shimmer loading
- Product name + price (tax-aware)
- Sale price display (originalPrice)
- `QuickAddButton` overlay (single-variant products)
- Links to `/product/[slug]`

### `QuickAddButton` — `components/quick-add-button.tsx` 💻

One-click "Add to Cart" overlay on product cards. Only renders for products with a single variant.

```typescript
interface QuickAddButtonProps {
  variant: ProductVariant
  productName: string
  productSlug: string
  productImages: string[]
}
```

### `AddToCartButton` — `app/product/[slug]/add-to-cart-button.tsx` 💻

Full add-to-cart button with variant selector and quantity selector.

```typescript
interface AddToCartButtonProps {
  variants: ProductVariant[]
  product: {
    id: string
    name: string
    slug: string
    images: string[]
  }
  summary?: string | null
  volumePricingTiers?: VolumePricingTier[] | null
  restockNotificationsEnabled: boolean
}
```

Features:
- `VariantSelector` for option picking
- `QuantitySelector` for quantity
- `VolumePricing` display
- Optimistic cart update
- Sold-out state → `RestockNotify`
- Tracks `AddToCart` analytics

### `MediaGallery` — `app/product/[slug]/media-gallery.tsx` 💻

Product image/video gallery.

```typescript
interface MediaGalleryProps {
  images: string[]
  productName: string
  variants: ProductVariant[]
}
```

Features:
- Main image display
- Thumbnail strip
- Reads `useSearchParams()` for variant-selected image
- Sticky on desktop (`lg:sticky lg:top-24`)

### `VariantSelector` — `app/product/[slug]/variant-selector.tsx` 💻

Renders variant option buttons (Color, Size, etc.).

```typescript
interface VariantSelectorProps {
  variants: ProductVariant[]
  selectedVariantId: string
  onSelect: (variantId: string) => void
}
```

Updates URL `?variant=` on selection.

### `QuantitySelector` — `app/product/[slug]/quantity-selector.tsx` 💻

Increment/decrement quantity input.

```typescript
interface QuantitySelectorProps {
  value: number
  min?: number
  max?: number
  onChange: (quantity: number) => void
}
```

### `VolumePricing` — `app/product/[slug]/volume-pricing.tsx` 🖥

Displays volume pricing tiers table.

```typescript
interface VolumePricingProps {
  tiers: VolumePricingTier[]
  selectedQuantity: number
}
```

### `BundleBuilder` — `app/product/[slug]/bundle-builder.tsx` 💻

Bundle product configuration UI. Only rendered for `product.type === "bundle"`.

```typescript
interface BundleBuilderProps {
  bundleId: string
  bundle: BundleConfig
  pricing: BundlePricing
}
```

Validates required selections, calls `addBundleToCart` server action.

### `ProductReviews` — `app/product/[slug]/product-reviews.tsx` 🔀

Reviews section with aggregate summary and review list.

```typescript
interface ProductReviewsProps {
  reviews: ReviewsResponse
  slug: string
}
```

### `ReviewForm` — `app/product/[slug]/review-form.tsx` 💻

Star rating + review text form.

```typescript
interface ReviewFormProps {
  productSlug: string
}
```

Calls `submitReview` server action.

### `RelatedProducts` — `app/product/[slug]/related-products.tsx` 🖥

Horizontal scroll of related products from the same category.

```typescript
interface RelatedProductsProps {
  productId: string
  categorySlug?: string
}
```

### `RestockNotify` — `app/product/[slug]/restock-notify.tsx` 💻

Email notification form for out-of-stock items.

```typescript
interface RestockNotifyProps {
  variantId: string
}
```

### `ProductFeatures` — `app/product/[slug]/product-features.tsx` 🖥

Trust/shipping feature badges (free shipping, returns, etc.).

---

## 5. Listing Components

### `ListingPagination` — `components/listing-pagination.tsx` 💻

URL-driven pagination links.

```typescript
interface ListingPaginationProps {
  basePath: string       // e.g., "/products"
  currentPage: number
  totalPages: number
  filters?: Record<string, string | undefined>   // Preserves existing filters
}
```

Uses `<Link>` for client-side navigation within the same zone.

### `ProductFilters` — `components/sections/product-filters.tsx` 💻

Desktop filter sidebar with checkboxes, price range slider, and variant type selectors.

```typescript
interface ProductFiltersProps {
  facets: FilterFacets
}

type FilterFacets = {
  categories: { slug: string; name: string }[]
  collections: { slug: string; name: string }[]
  brands: string[]
  variantTypes: { type: string; values: string[] }[]
  priceBounds: { min: number; max: number }
}
```

### `ProductFiltersMobile` — `components/sections/product-filters.tsx` 💻

Mobile version of filters in a Sheet (drawer).

### `ProductGridSkeleton` — `components/product-grid-skeleton.tsx` 🖥

Loading skeleton for product grids.

```typescript
interface ProductGridSkeletonProps {
  className?: string   // Grid columns class
}
```

---

## 6. Search Components

### `SearchInput` — `components/search/search-input.tsx` 💻

Search input in the header. Navigates to `/search?q=<query>` on submit.

Uses `useSearchParams()` to pre-fill from URL — must be inside `<Suspense>`.

---

## 7. AI Chat Components

### `StoreChatSection` — `components/store-chat/store-chat-section.tsx` 🔀

Feature-flagged AI chat widget. Renders `ChatLauncher` + `ChatPanel` if enabled.

Checked via `me.store.settings.enabledTools.chat`.

### `ChatLauncher` — `components/store-chat/chat-launcher.tsx` 💻

Floating action button to open/close the chat panel.

### `ChatPanel` — `components/store-chat/chat-panel.tsx` 💻

Full chat UI with:
- Message history
- Streaming responses (Vercel AI SDK `useChat`)
- `ChatProductCard` for inline product recommendations
- Input field

Uses `useChat()` from `@ai-sdk/react`. Chat API endpoint: `/api/chat` (proxied to platform).

### `ChatMarkdown` — `components/store-chat/chat-markdown.tsx` 💻

Streaming markdown renderer using `streamdown` for AI responses.

### `ChatProductCard` — `components/store-chat/chat-product-card.tsx` 💻

Product card rendered inside chat responses. Has "Add to Cart" functionality.

---

## 8. Section Components

### `Hero` — `components/sections/hero.tsx` 🖥

Homepage hero section. Content from store settings.

### `About` — `components/sections/about.tsx` 🖥

Homepage about section. Content from store settings.

### `Newsletter` — `components/sections/newsletter.tsx` 💻

Inline newsletter signup form with email input.

### `ProductGrid` — `components/sections/product-grid.tsx` 🖥

Featured products grid for homepage.

```typescript
interface ProductGridProps {
  title?: string
  limit?: number
  featured?: boolean
}
```

---

## 9. UI Primitives

### Button

```typescript
<Button variant="default" size="default" asChild={false}>
  Click me
</Button>

// Variants: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
// Sizes: "default" | "sm" | "lg" | "icon"
```

### Dialog

```tsx
<Dialog>
  <DialogTrigger asChild>
    <Button>Open</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Title</DialogTitle>
      <DialogDescription>Description</DialogDescription>
    </DialogHeader>
    {/* content */}
  </DialogContent>
</Dialog>
```

### Sheet (Drawer)

```tsx
<Sheet open={isOpen} onOpenChange={setIsOpen}>
  <SheetContent side="right">
    <SheetHeader>
      <SheetTitle>Cart</SheetTitle>
    </SheetHeader>
    {/* content */}
  </SheetContent>
</Sheet>
```

Used for: CartSidebar, ProductFiltersMobile.

### Select

```tsx
<Select value={value} onValueChange={onChange}>
  <SelectTrigger>
    <SelectValue placeholder="Choose..." />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="option1">Option 1</SelectItem>
  </SelectContent>
</Select>
```

### Slider (Price Range)

```tsx
<Slider
  min={0}
  max={500}
  step={1}
  value={[minPrice, maxPrice]}
  onValueChange={([min, max]) => { setMin(min); setMax(max) }}
/>
```

### Skeleton

```tsx
<Skeleton className="h-8 w-48 rounded" />
```

### Sonner Toast

```typescript
import { toast } from "sonner"

toast.success("Added to cart!")
toast.error("Something went wrong")
toast.info("Info message")
```

Configured in layout:
```tsx
<Toaster richColors position="top-center" />
```

---

## 10. Utility Components

### `TiptapRenderer` — `components/tiptap-renderer.tsx` 🖥

Renders Tiptap JSON document as HTML (server-side).

```typescript
interface TiptapRendererProps {
  content: TiptapDocument
}
```

Extensions: Image, YouTube, TextAlign, TextStyle, StarterKit.

### `NewsletterDialog` — `components/newsletter-dialog.tsx` 💻

Popup newsletter signup dialog. Feature-flagged via `enabledTools.newsletterPopup`.

### `CookieConsentBanner` — `components/cookie-consent-banner.tsx` 💻

GDPR cookie consent UI. Must be at the top of `<body>`.

### `ThemeToggle` — `components/theme-toggle.tsx` 💻

Sun/Moon icon button for dark/light mode switching.

### `StoreConfigProvider` — `components/store-config-provider.tsx` 💻

Provides `{ currency, locale, taxBehavior }` to all client components.

### `BlogProductEmbed` — `components/blog-product-embed.tsx` 🖥

Inline product card inside blog post content (Tiptap node).

### `LetterInkMedia` — `lib/the-letter-ink-media.tsx`

Helper for responsive media (images and videos) in product galleries.

### `ReferralBadge` — `components/referral-badge.tsx` 💻

"Made with YNS" badge — shown if feature enabled.

### `RouteError` — `components/route-error.tsx` 💻

Standardized error display for route error boundaries.
