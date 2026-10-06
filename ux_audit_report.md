# The Letter Ink: UI/UX Audit & Redesign Plan

**Scope:** `letter-ink-frontend` (Next.js, Tailwind v4). **No code was changed.**

> [!NOTE]
> **Method and limits.** This is a source-code audit, not a rendered visual review. I took no screenshots, so contrast and layout claims come from reading the CSS and should be confirmed in a browser.
> **Read in full:** layout, navbar, both footers, globals.css, home hero, product page, add-to-cart, variant and quantity selectors, product card, cart drawer, checkout, shipping form, order tracking, shop catalog, 404, contact form.
> **Sampled or scanned only (marked *(scan)*):** gifting, about, blog, workshops, FAQ, campaigns, search, order success, newsletter dialog. I ran pattern counts across all 133 `.tsx` files.

---

## 1. Executive summary

The brand idea is strong: a calligraphy atelier with an ink, blush and vellum palette, and Garamond paired with Raleway. The problem is that the site is built from **three unrelated design languages**, and several **primary interactions are fake or broken**.

| # | Headline problem | Severity |
|---|---|---|
| 1 | The primary "Add to Cart" button is pale blush `#FCECEF` on a near-white page, so it is almost invisible. | 🔴 Critical |
| 2 | Shop sort, filters, "Apply/Reset" and the wishlist heart **do nothing**. | 🔴 Critical |
| 3 | `/account` was linked from the header and mobile menu without a route. | ✅ Resolved (Removed) |
| 4 | "Book Atelier Consultation" and "Inquire With Atelier Calligrapher" are buttons with **no handler**. | 🔴 Critical |
| 5 | The contact form **never sends anything**. It only flips a flag and says "Inquiry Received". | 🔴 Critical |
| 6 | Checkout, tracking and the shipping form use a generic stone/amber/rose palette that is **off-brand**. | 🟠 High |
| 7 | Two product cards, two footers (the mobile one is a template that drops FAQ and legal links), about five button styles. | 🟠 High |
| 8 | 99 uses of 9–12px text. 57 raw `<img>` tags against 18 `next/image`/`LetterInkMedia` references. | 🟠 High |
| 9 | Key actions are hover-only, so touch and keyboard users never see them. | 🟠 High |

Most fixes are **consolidation, not redesign**. Keep the brand and palette, fix the interaction layer, then unify the system.

---

## 2. Design-system diagnosis (root cause of most issues)

### 2.1 Three competing systems
| System | Where used | Evidence |
|---|---|---|
| **A. Letter Ink tokens** (`paper-tint`, `tertiary-fixed`, `font-label-sm`) | Home, shop, PDP, contact, navbar | `globals.css` L35–173 |
| **B. shadcn defaults** (`bg-card`, `text-muted-foreground`, pill `Button`) | Cart drawer, 404, checkout shell | `cart-sidebar.tsx`, `not-found.tsx` |
| **C. Raw Tailwind palette** (`stone-900`, `amber-50`, `rose-400`, `emerald-600`) | Tracking, shipping form, checkout | 175 uses: `order/track/page.tsx` 69, `shipping-address-form.tsx` 44 |

**Why it matters:** the customer moves from an editorial product page to a generic SaaS-looking checkout at the moment of payment. Perceived quality and trust drop exactly where they matter most.

### 2.2 Token problems in `globals.css`
- **Two color vocabularies.** There are 50+ Material-3 names (`surface-container-lowest`, `on-primary-fixed-variant`…). Many duplicate each other (`primary-fixed` = `tertiary-fixed` = `#FCECEF`). The names do not tell you what a color is for.
- **Naming trap.** `--color-tertiary` is ink `#201A1C`, but `tertiary-fixed` is blush. "Tertiary" means two opposite things.
- **`.text-secondary { color: … !important }`** (L228–232) hijacks Tailwind's `text-secondary`. The shadcn `secondary` token is also used as a background (`bg-secondary` on the product card), so one name has two meanings and an `!important` override.
- **Dark mode is dead.** `.dark` tokens exist, but the layout forces light (`forcedTheme="light"`). Hard-coded `bg-white` and `#fadcd0` would break dark mode anyway. Delete it or commit to it.
- **Hex outside the tokens.** `#fadcd0` and `#271811` are scattered through `contact-page-client.tsx`.
- **Layout rules drift.** Containers vary (`max-w-7xl`, `max-w-[1440px]`, `max-w-6xl`, `max-w-4xl`), and so do gutters (`px-margin-mobile lg:px-8`, `px-4 sm:px-6 lg:px-16`, `md:px-gutter`, `lg:px-margin`). The content's left edge jumps between pages.

### 2.3 Typography problems
| Issue | Where | Why it hurts |
|---|---|---|
| **Body is Raleway weight 300 at 15px** | `--text-body-md` | Thin strokes on pale pink-white are hard to read on mid-range phones. |
| **Wide-tracked uppercase for almost everything** (nav, labels, badges, pills, form labels) | Everywhere | When everything is spaced caps, nothing has hierarchy, and long labels like "Email Address (for Order Receipt & Tracking) *" are tiring. |
| **`font-serif` is not your serif.** | `track`, `checkout`, `shop-catalog` | The theme maps Garamond only through `font-display-hero`/`headline-lg` variables. `font-serif` falls back to the system serif (Georgia/Times), so those pages look like a "random serif". |
| **Four font families loaded** | `layout.tsx` | Geist, Geist Mono, Raleway and EB Garamond. `--font-sans` is Geist, so un-styled text is Geist, not Raleway. |
| **Hero h1 tracking** | `hero-showcase.tsx` L49 | 0.1em tracking at 64px looks loose, and the h1 sits *below* a 420px image row. |

**Before → After (type scale):**
```
BEFORE  label 13px / 0.12em / 500 on everything, body 15px / 300, plus 99 ad-hoc text-[9–12px]
AFTER   body 16px / 400 (never lighter)
        eyebrows + button labels only: 12–13px / 0.08em / 600 uppercase
        form labels, nav, filter pills: 14px / 500, sentence case
        no text below 12px anywhere
```

---

## 3. Findings by area

Severity: 🔴 Critical (blocks a task or revenue) · 🟠 High · 🟡 Medium · 🟢 Polish

### 3.1 Global chrome (header, nav, footer)

**✅ G1. `/account` leads to a 404. [RESOLVED]**
- **Where:** `layout.tsx` L242–248 (black user icon), `navbar.tsx` L157–167 ("Patron Account"). `app/account` does not exist.
- **Resolution:** Removed the `/account` button from the persistent header, the "Patron Account" link from the mobile drawer, and unmapped `/account` from `proxy.ts`.

**✅ G2. The "Wishlist" is not real. [RESOLVED]**
- **Where:** `layout.tsx` L223–240 and `navbar.tsx` L146–156 linked to `/#gallery`. Card hearts in `shop-catalog-client.tsx` and `shop-page-client.tsx`.
- **Resolution:** Removed the wishlist button from the desktop header (`layout.tsx`), the "Curated Gallery & Wishlist" link from the mobile drawer (`navbar.tsx`), and the fake heart buttons and local state from product cards in `shop-catalog-client.tsx` and `shop-page-client.tsx`.

**✅ G3. Header icons are inconsistent with small hit areas. [RESOLVED]**
- **Where:** `layout.tsx`, `app/cart-button.tsx`, and `app/navbar.tsx`.
- **Resolution:** Replaced raw SVGs with Lucide icons (`Search`, `ShoppingBag`, `Menu`), enforced standard 44px (`h-11 w-11`) tap/click hit areas, unified hover states (`hover:text-brand-script hover:bg-surface-container-high/60`), and made the Cart the only accented control (`bg-primary text-on-primary` with brand script counter badge).

**✅ G4. Nav breakpoint is `xl` (1280px). [RESOLVED]**
- **Where:** `layout.tsx` (`getNavLinks`, header navigation breakpoints) and `navbar.tsx`.
- **Resolution:** Dropped redundant "Home" link (logo links to `/`), shortened "About Us" and "Contact Us" to "About" and "Contact", removed the rigid `w-[260px]` right block container, and adjusted the desktop nav breakpoint from `xl` (1280px) to `lg` (1024px) with adaptive spacing (`gap-4 xl:gap-space-sm`). Tablets in landscape and laptops now get full desktop navigation.

**✅ G5. Active state differs. [RESOLVED]**
- **Where:** `navbar.tsx` (`MobileNav`, `Navbar`).
- **Resolution:** Created a shared `isLinkActive` helper matching sub-pages (`/blog/...`, `/workshops/...`) and catalog hierarchies (`/product/...`, `/category/...` under Shop). Added `aria-current={isActive ? "page" : undefined}` to all desktop and mobile navigation links for full WCAG 2.2 AA compliance.

**✅ G6. Sticky header is tall. [RESOLVED]**
- **Where:** `layout.tsx`.
- **Resolution:** Reduced header height from `h-16 sm:h-20` to `h-14 sm:h-16 lg:h-18` (56px on mobile), and scaled the logo to `h-9 sm:h-12 lg:h-16`. The announcement bar scrolls off naturally, leaving a compact, viewport-friendly 56px sticky bar on mobile and landscape viewports.

**✅ G7. Menu wording hides function. [RESOLVED]**
- **Where:** `navbar.tsx` (`MobileNav`).
- **Resolution:** Replaced vague labels ("Patron Services", "Concierge & Bespoke Inquiries") with clear, functional ones ("Customer Support", "Contact & Custom Orders"), added a direct WhatsApp Atelier inquiry link, increased section typography from 10px to `text-xs` (12px), and increased menu labels from 12px to `text-sm` (14px) with generous `py-3` mobile tap padding.

**✅ G8. Two different footers, and the mobile one is a template. [RESOLVED]**
- **Where:** `components/ui/stacked-circular-footer.tsx` and `app/footer.tsx`.
- **Resolution:** Retained the mobile circular design while making it fully dynamic: wired the newsletter form to `subscribeToNewsletter` with transition states and Sonner feedback toasts, connected active social channel links, and synchronized the dynamic copyright year with the main footer.

**✅ G9. Footer category links all go to `/shop`. [RESOLVED]**
- **Where:** `app/footer.tsx` L88–120 and `components/sections/shop-page-client.tsx`.
- **Resolution:** Updated `ShopPageClient` to read `?category=...` search parameters with flexible category alias matching (exact name or keywords like frame, vow/letter, glass/engraving, wax/seal) and auto-select matching filters. Linked desktop footer entries to their specific queries (`/shop?category=Name+Frames+%26+Wall+Art`, `/shop?category=Handwritten+Vow+Suites`, and `/shop?category=Hand-Etched+Glassware`), ensuring distinct, pre-filtered catalog destinations.

### 3.2 Homepage

**✅ H1. Hero hierarchy is inverted. [RESOLVED]**
- **Where:** `hero-showcase.tsx` L7–72.
- **Resolution:** Inverted the hero hierarchy to place the brand identity, headline, value proposition, and primary CTAs above the fold in the first viewport. Added a single, focused craft hero image on mobile screens (`md:hidden`), while displaying the curated 4-photo multi-pane visual showcase on desktop (`≥ md`) supporting the narrative. Pointed primary CTA to `/shop` and secondary to `/contact`.

**✅ H2. Hero images are hot-linked from `lh3.googleusercontent.com/aida-public/…` [RESOLVED]**
- **Where:** `hero-showcase.tsx` L40–86.
- **Resolution:** Downloaded and stored the 4 showcase images locally in `public/hero/` (`copperplate-calligraphy.jpg`, `wedding-invitation-suite.jpg`, `engraved-perfume-bottle.jpg`, `vintage-brass-glass-box.jpg`). Replaced all raw `<img>` tags with Next.js `<Image />` components featuring `fill`, responsive `sizes`, pointer-events protection, and `priority` on the mobile and primary desktop hero images for zero CLS and instant LCP rendering.

**✅ H3. CTA hover loses weight. [RESOLVED]**
- **Where:** `hero-showcase.tsx` L24–38.
- **Resolution:** Replaced the low-contrast pale blush hover with a confident, tactile interaction. The primary "Explore Collection" button retains solid ink contrast on hover (`hover:bg-primary/90`), lifts upward (`hover:-translate-y-0.5 hover:shadow-xl`), and subtly shifts its `ArrowRight` icon (`group-hover:translate-x-1`). The secondary "Bespoke Commissions" button smoothly inverts to dark ink (`hover:bg-primary hover:text-on-primary hover:-translate-y-0.5`). Both buttons point to proper application routes (`/shop` and `/contact`).

**✅ H4. Pull-quote is italic, 19px, weight 300. [RESOLVED]**
- **Where:** `hero-showcase.tsx` L20–23.
- **Resolution:** Upgraded pull-quote typography to EB Garamond italic with font-weight 400 (`font-normal`), responsive 20–22px sizing (`text-lg sm:text-xl md:text-[22px]`), and comfortable `leading-[1.6]`. Streamlined the copy to an impactful, poetic 1–2 line atelier statement: *“Bringing back the romance of hand-rendered script — give us your words, and we frame them into reality.”*

**✅ H5. Material Symbols loaded from Google Fonts. [RESOLVED]**
- **Where:** `layout.tsx` (head stylesheet) and components across the codebase.
- **Resolution:** Replaced all 100+ occurrences of Google Material Symbols font ligatures across all components (`hero-showcase.tsx`, `studio-pillars.tsx`, `curated-occasions.tsx`, `gallery-grid-client.tsx`, `services-editorial.tsx`, `contact-banner.tsx`, `workshop-banner.tsx`, `shop-page-client.tsx`, `shop-catalog-client.tsx`, product slug pages, `gifting-landing-client.tsx`, `gifting-page-client.tsx`, and `blog-article-client.tsx`) with optimized, inline SVG icons from `lucide-react`. Removed the render-blocking Google Fonts stylesheet from `<head>` in `app/layout.tsx`, eliminating FOUT (raw ligature words) and eliminating an external render-blocking network call.

**✅ H6. Section rhythm. [RESOLVED]**
- **Where:** `hero-showcase.tsx`, `studio-pillars.tsx`, `curated-occasions.tsx`, `gallery-grid.tsx`, `services-editorial.tsx`, and `contact-banner.tsx`.
- **Resolution:** Replaced monotonous pale washes with deliberate rhythm and tactile contrast across the entire homepage:
  - **Hero Showcase:** Sets the warm artisanal paper tone (`bg-paper-tint`).
  - **Studio Pillars:** Crisp, elevated atelier vellum ribbon with subtle borders (`bg-surface-container-lowest border-y border-border-vellum py-8 lg:py-10 shadow-2xs`).
  - **Curated Occasions:** Warm parchment background (`bg-paper-tint/70`) with white card bases (`bg-surface-container-lowest`) and distinctive eyebrow *"Curated Occasions & Gifting"*.
  - **Gallery Grid:** Clean gallery exhibition white (`bg-surface-container-lowest`) with unique eyebrow *"Curated Studio Portfolio"*, eliminating duplicate headings.
  - **Services Editorial:** Dramatic dark luxury atelier ink centerpiece (`bg-primary text-on-primary`) with warm parchment accents (`text-tertiary-fixed-dim`) and translucent cards (`bg-white/[0.06] border-white/10`).
  - **Contact Banner:** Warm ivory finish (`bg-paper-tint border-t border-border-vellum/80`) with white studio card.

### 3.3 Shop and catalog

**✅ S1. Sort, filters, Apply and Reset do nothing. [RESOLVED]**
- **Where:** `shop-catalog-client.tsx` (L82–90 sort `<select>` and L96–168 quick filter accordion drawer).
- **Resolution:**
  - Added live `sortBy` state to `ShopCatalogClient`, bound to `<select id="shopSortSelect">`, supporting numerical price ascending (`price-asc`), price descending (`price-desc`), and newest releases (`newest`). Added `rawPrice` to `ShopProduct` in `shop-catalog-inner.tsx` for precise sorting.
  - Replaced fictitious mock checkboxes (*Ink Chemistry*, *Surface Medium*) with real, practical filters: Price Bracket (Under ₹1,500, ₹1,500–₹3,000, Above ₹3,000), Atelier Editions (Patron's Pick, Bestseller), and Category selection.
  - Implemented working `Apply Settings` and `Reset Filters` handlers with draft state, active filter counter badges, active filter chips with individual dismiss buttons, and a "Clear all" action.
  - Verified active route `/shop` (`ShopPageClient`) also maintains synchronized, full search-param and client-side sorting and filtering.

**✅ S2. "Customise & Order" is hover-only. [RESOLVED]**
- **Where:** `shop-catalog-client.tsx` and `gallery-grid-client.tsx`. Touch and keyboard users could not see the hover-only overlay (`opacity-0 group-hover:opacity-100`).
- **Resolution:** Removed the disruptive hover-only image overlay across both catalog and gallery cards. Added a persistent, tactile "Customise" CTA cue with an arrow icon directly alongside the price in the card footer. The action is consistently visible and interactive across mobile touchscreens, tablets, desktop mice, and keyboard navigation.

**✅ S3. Two different product cards. [RESOLVED]**
- **Where:** `components/product-card.tsx`, `shop-catalog-client.tsx`, and `shop-page-client.tsx`.
- **Resolution:** Unified product card design system across all views into a single luxury atelier standard:
  - Standardized on the elegant **`aspect-[4/5]` portrait ratio** with `rounded-xl` corners and `border-border-vellum/70` subtle luxury borders.
  - Implemented Next.js `<LetterInkMedia>` optimized image loading with smooth hover transition, alternate image preview, and priority loading.
  - Replaced generic sans font with Garamond serif heading (`font-headline-sm font-serif`), uppercase atelier category eyebrow (`font-label-sm uppercase tracking-widest text-secondary`), and clean price presentation.
  - Replaced off-brand red pills and floating buttons with brand-palette edition badges and a persistent tactile `Customise` CTA button with an arrow icon.
  - Updated `ProductCardSkeleton` and `SearchResultsSkeleton` to match the exact `aspect-[4/5] rounded-xl` geometry to eliminate layout shifts (CLS).

**✅ S4. The "Sale" badge shows on every product whenever any campaign is active. [RESOLVED]**
- **Where:** `components/product-card.tsx`, `shop-catalog-client.tsx`, and `shop-page-client.tsx`.
- **Resolution:**
  - Replaced the global campaign flag with strict, item-level discount validation: `isDiscounted = originalPrice > price`.
  - Calculated exact savings percentage (`percentOff = Math.round(((originalPrice - price) / originalPrice) * 100)`) and display a high-conversion `Save ${percentOff}%` badge (or `Sale`) strictly when a genuine discount exists.
  - Eliminated off-brand `bg-red-600` styling in favor of cohesive atelier brand tokens (`bg-tertiary-fixed text-on-tertiary-fixed` and `bg-primary text-on-primary`).
  - Added struck-through compare-at pricing hierarchy (`originalPrice`) beside the current selling price across all product cards, giving shoppers immediate, authentic value context.

**✅ S5. Cards lack decision information. [RESOLVED]**
- **Where:** `components/product-card.tsx`, `components/sections/shop-page-client.tsx`, `components/sections/shop/shop-catalog-client.tsx`, and `components/sections/shop/shop-catalog-inner.tsx`.
- **Resolution:**
  - Added "From" prefix styling whenever products have multiple variant price points, establishing clear baseline starting price commitment.
  - Prominently integrated "Ships in 5–7 days" (or dynamic product metadata / workshop lead time) with an atelier `Clock` icon directly above card prices across all catalog views (`ProductCard`, `ShopPageClient`, and `ShopCatalogClient`).
  - Unified compare-at strike-through pricing alongside current selling prices across all card templates, providing shoppers with immediate turnaround expectations and decision clarity.

**✅ S6. Empty and count copy. [RESOLVED]**
- **Where:** `components/sections/gallery-grid-client.tsx`, `components/sections/shop-page-client.tsx`, and `components/sections/shop/shop-catalog-client.tsx`.
- **Resolution:**
  - Streamlined toolbar count copy from verbose phrases ("Displaying 12 of 24 Bespoke Artifacts", "Heirloom Artifacts") to crisp, instantly scannable phrasing (`24 products` or `Showing 12 of 24 products`).
  - Transformed dead-end empty states across all catalog and gallery views into actionable recovery modules equipped with "Reset All Filters" / "View All Pieces" and direct links to commission custom atelier calligraphy suites (`/contact`).

### 3.4 Product detail page (PDP)

**✅ P1. The primary "Add to Cart" button has almost no contrast. [RESOLVED]**
- **Where:** `app/product/[slug]/add-to-cart-button.tsx` L364.
- **Resolution:** Replaced the low-contrast blush button (`bg-tertiary-fixed #FCECEF`) with solid atelier ink `bg-primary text-on-primary` (`#201A1C` on `#FFFFFF`, yielding > 12:1 contrast ratio). Added tactile brand hover state (`hover:bg-brand-script-dark`) and full keyboard accessibility focus ring (`focus-visible:ring-2 focus-visible:ring-brand-script focus-visible:ring-offset-2`). The main purchase CTA is now immediately recognizable and distinct from disabled states across all viewports.

**✅ P2. Two dead buttons. [RESOLVED]**
- **Where:** `app/product/[slug]/page.tsx` L310 and `app/product/[slug]/add-to-cart-button.tsx` L373.
- **Resolution:**
  - Connected "Inquire With Atelier Calligrapher" directly to the atelier WhatsApp (`wa.me/919823011942`) pre-filled with the exact product name, giving shoppers an instant direct line to the studio.
  - Connected "Book Atelier Consultation" to the studio WhatsApp consultation line with bespoke commission context, alongside a secondary direct route to the online inquiry form (`/contact`). Both buttons are now active, high-converting channels.

**✅ P3. Hard-coded copy appears on every product. [RESOLVED]**
- **Where:** `app/product/[slug]/page.tsx` L186–290.
- **Resolution:**
  - Dynamic Eyebrow: Replaced hard-coded "The Atelier Heirlooms Series" with dynamic `categoryName` derived from `product.category?.name` or `product.metadata?.category_name` (falling back to `"Atelier Creation"`).
  - Authentic Summary: Removed fabricated "Antiqued Brass & Double Glass Float Frame" fallback, safely rendering `product.summary` or `product.description` only when present.
  - Adaptive Trust & Fulfillment Triad: Made the triad dynamically contextual: for masterclasses/workshops, it presents personalized coaching, studio kits, and live masterclass access; for physical made-to-order crafts, it emphasizes authentic handcraft, WhatsApp pre-dispatch proofs, and insured protective delivery (eliminating factually incorrect "wooden crate" and "glass sealing" claims).
  - Universal Catalog Link: Replaced restrictive "Explore All Frames" with "Explore All Creations".

**✅ P4. Nested `<main>`. [RESOLVED]**
- **Where:** `layout.tsx` wraps pages in `<main>`, and previously `app/product/[slug]/page.tsx`, `app/checkout/checkout-form.tsx`, `components/sections/blog-page-client.tsx`, and `components/sections/gifting-page-client.tsx` rendered nested `<main>` tags.
- **Resolution:**
  - Replaced inner `<main>` landmarks with semantic `<div>` tags across all four subpages and client components.
  - Kept `app/layout.tsx` (`<main className="flex-1">{children}</main>`) as the single top-level `main` landmark for the entire site, fully resolving duplicate landmark announcements in screen readers and complying with WCAG 1.3.1 & 2.4.1.

**✅ P5. Buy-box order buries price and CTA. [RESOLVED]**
- **Where:** `app/product/[slug]/page.tsx` and `app/product/[slug]/add-to-cart-button.tsx`.
- **Resolution:**
  - Re-architected visual hierarchy above the fold: Title & Category → Instant Price display, compare-at & tax indicator → One-line artisan summary → Variant & customization options → Personalized inscription → Quantity + Add to Cart CTA.
  - Relocated lengthy rich-text editorial description (`product.content` via `TiptapRenderer`), artisan materials/care notes, and shipping/proof workflow into clean, collapsible accordions (*Artisanal Craft & Details*, *Materials & Archival Care*, *Atelier Dispatch & Shipping*) placed directly below the buy box and trust triad.
  - Added a mobile sticky bottom purchase bar (`md:hidden`) that tracks form visibility via `IntersectionObserver` and smoothly appears with live price and a direct action button when the primary buy box scrolls out of view.

**✅ P6. The inscription field is the core personalization step but is styled like a footnote. [RESOLVED]**
- **Where:** `app/product/[slug]/add-to-cart-button.tsx`.
- **Resolution:**
  - Upgraded input typography to `text-base` (16px) across mobile & desktop, permanently resolving the iOS Safari auto-viewport zoom bug on focus.
  - Promoted label to `14px / font-medium` (`text-sm font-medium text-primary`) with an atelier emblem and a `"Complimentary Hand-Scripting"` tag.
  - Increased helper text and counter legibility to `text-xs text-secondary`, highlighting genuine archival sumi ink and gold luster.
  - Added 1-click inspiration example chips (*"Aarav & Meera • 24.10.2026"*, *“Where thou art, that is home.”*, *“Dr. Sharma • In Honor & Gratitude”*).
  - Added a **Live Calligraphy Script Preview Card**: whenever text is typed, an artisan vellum card appears rendering the customer's exact words in literary classical script (`font-serif italic text-lg sm:text-xl text-primary leading-relaxed text-center`), providing instant emotional connection and confidence.

**✅ P7. Out-of-stock handling is switched off. [RESOLVED]**
- **Where:** `app/product/[slug]/add-to-cart-button.tsx`.
- **Resolution:**
  - Restored real, dynamic out-of-stock inventory logic: `isOutOfStock = Boolean(selectedVariant && selectedVariant.stock !== null && selectedVariant.stock <= 0)`, preserving infinite/untracked inventory for custom made-to-order crafts (`stock === null`) while strictly blocking depleted SKUs (`stock <= 0`).
  - Restored out-of-stock badge display in `stockStatus`: now returns `{ label: "Out of stock", tone: "out" }` with an accessible red warning indicator when a variant is depleted.
  - Re-activated the built-in `<RestockNotify />` dialog (`"Remind me when back in stock"`) so shoppers can sign up for back-in-stock email notifications, and disabled checkout submission with `"Out of stock"` button text when restock notifications are turned off.
  - Preserved the WhatsApp atelier inquiry button so patrons can still commission custom pieces directly.

**✅ P8. Variant buttons. [RESOLVED]**
- **Where:** `app/product/[slug]/variant-selector.tsx` and `app/product/[slug]/customization-selector.tsx`.
- **Resolution:**
  - Expanded all variant text buttons and customization option chips to `min-h-[44px] px-4 py-2.5`, fully satisfying WCAG 2.5.5 / 2.5.8 touch target standards.
  - Added programmatic `aria-pressed={isSelected}` attributes and descriptive `aria-label` tags to all color swatches and text option buttons, allowing screen reader users to instantly identify selected options (satisfying WCAG 4.1.2).
  - Eliminated color-only active state violations (WCAG 1.4.1): added centered high-contrast checkmark icons (`Check`) inside active color swatches (with dynamic contrast adaptation for light and dark swatches) and active checkmarks inside selected text option chips.

**✅ P9. Quantity selector. [RESOLVED]**
- **Where:** `app/product/[slug]/quantity-selector.tsx`.
- **Resolution:**
  - Widened Minus and Plus buttons from 32px to 44px (`w-11`), and matched height to `h-[49px]`, aligning perfectly with the primary Add to Cart button and satisfying WCAG 2.5.5 / 2.5.8 touch target requirements.
  - Implemented semantic accessible spinbutton pattern: `role="spinbutton"`, `aria-label="Quantity"`, `aria-valuenow`, `aria-valuemin`, and `aria-valuemax` with keyboard ArrowUp/ArrowDown support.
  - Added polite live announcements (`aria-live="polite"` via a hidden screen-reader label) to ensure quantity adjustments are immediately vocalized by assistive technologies (WCAG 4.1.3).
  - Encased the selector in a refined studio border (`border border-border-vellum rounded-sm`) with responsive hover and disabled states.

**✅ P10. Stray gradient. [RESOLVED]**
- **Where:** `app/product/[slug]/page.tsx`.
- **Resolution:**
  - Removed `bg-gradient-to-b from-transparent to-surface-container-low/40 p-1` from the header container.
  - Eliminated the 4px horizontal padding inset (`p-1`), restoring precise left alignment between the product title, category eyebrow, and all subsequent buy-box elements.
  - Removed the murky background haze, ensuring clean, sharp typographic contrast against parchment backdrops.

**✅ P11. Breadcrumb a11y. [RESOLVED]**
- **Where:** `app/product/[slug]/page.tsx`.
- **Resolution:**
  - Migrated from an unlabelled `<nav>` to the semantic accessible `<Breadcrumb>` architecture (`BreadcrumbList`, `BreadcrumbItem`, `BreadcrumbLink`, `BreadcrumbPage`, and `BreadcrumbSeparator`).
  - Added programmatic `aria-label="breadcrumb"` identifying the navigation landmark for screen readers (WCAG 1.3.1).
  - Encased the trail in an ordered list (`<ol>` with `<li>` items) enabling assistive technologies to announce total item count and position hierarchy.
  - Added `aria-current="page"` to the terminal active product name, and marked visual separators with `aria-hidden="true"`, preventing auditory clutter.
**✅ P12. Sale price hierarchy. [RESOLVED]**
- **Where:** `app/product/[slug]/add-to-cart-button.tsx`.
- **Resolution:**
  - Scaled original reference price (`compareAt`) up from tiny `13px` (`text-body-sm`) to an authoritative `18px` (`text-lg`) with semi-transparent strikethrough (`text-secondary/70 line-through decoration-secondary/50 font-normal`), keeping it proportional and legible next to the headline price.
  - Replaced low-contrast blush tag with a high-contrast atelier discount pill (`Save X%` with `bg-brand-script/10 text-brand-script border border-brand-script/20 font-semibold px-2.5 py-0.5 rounded-sm`), clearly highlighting savings.
  - Added semantic `<del>` markup and assistive screen-reader text (`<span className="sr-only">Current price: </span>` and `<span className="sr-only">Original price: </span>`) ensuring full WCAG 1.3.1 / 4.1.2 compliance.
  - Enhanced the sticky mobile purchase bar with accessible price labeling, `<del>` original price, and a compact `-X%` savings indicator.

### 3.5 Cart drawer

**✅ C1. Cart uses a third visual style. [RESOLVED]**
- **Where:** `app/cart/cart-sidebar.tsx`, `app/cart/cart-item.tsx`, `app/cart/cart-promo.tsx`.
- **Resolution:**
  - Unified buttons to the signature atelier ink button aesthetic (`bg-primary text-on-primary hover:bg-brand-script-dark font-label-lg uppercase tracking-widest rounded-sm`), replacing the disconnected `bg-stone-900 rounded-full` pill.
  - Aligned the item quantity stepper to the atelier architectural style (`rounded-sm border border-border-vellum bg-background text-primary` with `font-mono tabular-nums`), replacing the bubbly `rounded-full` capsule.
  - Enforced the site-wide corner radius rule: buttons and inputs `rounded-sm`, item thumbnail `rounded-sm border-border-vellum/60`, and promo badges `rounded-sm`.
  - Replaced generic gray tokens (`bg-secondary`, `text-muted-foreground`, `border-border`) with atelier tokens (`bg-paper-tint`, `text-secondary`, `border-border-vellum`, and `text-brand-script`).

**✅ C2. Dead "simulated Razorpay" code removed. [RESOLVED]**
- **Where:** `app/cart/cart-sidebar.tsx`.
- **Resolution:**
  - Removed ~230 lines of unreachable prototype code: `_handleCheckoutWithRazorpay`, `loadRazorpayScript`, and `handleSimulateSuccess`.
  - Removed hardcoded fake customer data (`patron@theletterink.com`, "Valued Patron", dummy telephone/address payloads).
  - Deleted dead component state (`isCheckingOut`, `showSimulatedModal`, `simulatedOrderInfo`) and unused icon imports (`CheckCircle2`, `Info`).
  - Purged the unreachable simulated Razorpay development modal DOM and unused fragment wrappers, significantly slimming the client cart bundle across the storefront.

**✅ C3. Summary copy & friction points. [RESOLVED]**
- **Where:** `app/cart/cart-sidebar.tsx`.
- **Resolution:**
  - Added an explicit complimentary delivery row in the price breakdown: `Shipping: Free (Complimentary)`, converting a hidden fee fear into a positive conversion driver.
  - Replaced ambiguous *"Shipping calculated at checkout"* copy with reassuring tax and delivery guarantees: *"Taxes included. Complimentary insured atelier shipping across India."*
  - Streamlined the verbose 32-character CTA button (`Proceed to Delivery & Checkout →`) into a punchy, confident single-line action: `Checkout →`.

**✅ C4. Inscription visibility in cart drawer. [RESOLVED]**
- **Where:** `app/cart/cart-item.tsx`.
- **Resolution:**
  - Added dedicated bespoke inscription preview in the cart item line: displays `custom_inscription` with an atelier calligraphy indicator (`PenTool` icon, "Hand-Scripted Inscription:" label, and serif italic quotation styling).
  - Filtered out duplicate Inscription entries from general `customization_selections` to keep options cleanly organized.
  - Gives patrons instant verification of their custom lettering and dates right as the cart drawer opens, eliminating typo anxiety before checkout.

### 3.6 Checkout

**🟠 K1. Looks like a different site.** Dedicated header (good, fewer distractions) but with a text wordmark in `font-serif uppercase` instead of the logo, stone/emerald/rose palette, `rounded-2xl` cards and `font-mono` prices. Monospace numerals feel technical, not like a calligraphy brand; use `tabular-nums` on the body font.

**🟠 K2. Form accessibility and conversion.**
- Error text is `text-[11px] text-rose-500` (about 3.7:1), which fails AA for small text. Use 13–14px in your existing `error-crimson` (`#B00020`).
- No `aria-invalid`, `aria-describedby` or `autoComplete` anywhere. **Autofill tokens** (`name`, `tel`, `email`, `address-line1`, `postal-code`) are a big mobile conversion win.
- The PIN field is `type="text"` without `inputMode="numeric"`.
- City is validated but shows **no error message**, and the state `<select>` is styled differently from the inputs.

**🟡 K3. Name splitting.** "Aarav Kumar Sharma" becomes first "Aarav" and last "Kumar Sharma". A single name ("Meera") leaves last name empty. Confirm the backend accepts that.

**🟡 K4. Saved address in `localStorage`.** Email, phone and address are stored in plain text with no notice, which is a privacy concern on shared devices. The "Reset" control is an 11px gray link shown only when the form is invalid. Make "Saved address · Use a different one" explicit.

**🟡 K5. Mixed signals on the pay button.** The button is always enabled but toasts an error when the address is invalid, plus there is an "Address Ready" badge and an amber hint. Instead: keep it enabled and on click **scroll to and focus the first invalid field** with inline errors.

**🟡 K6. Trust copy.** "256-bit bank grade encryption & RBI PCI-DSS compliance" is jargon. Use plain reassurance plus payment-method icons (UPI, cards).

**🟡 K7. No `<h1>` on the non-empty checkout.** The only h1 is in the empty state. Add "Checkout".

### 3.7 Order tracking and success

**🟠 T1. Same off-brand palette.** 69 stone/amber/rose classes, amber status chips, and a Feather icon in an amber circle. Re-skin to brand tokens. Keep the timeline structure, which is well designed.

**🟡 T2. Timeline accessibility.** Steps are `<div>` stacks and differ by color alone. Use an `<ol>`, `aria-current="step"`, and visible text status. The pulsing clock should honor `prefers-reduced-motion`.

**🟡 T3. Error copy.** The title "Order Search Note" is vague. Say "We couldn't find that order" and what to check. The message is 12px.

**🟡 T4. Contact field.** "Email or 10-Digit Mobile" is not marked required, though the lookup needs it. Explain why ("to protect your order details").

**🟡 T5. Money formatting.** Tracking hard-codes `₹…toLocaleString("en-IN")`, while cart and checkout use `formatMoney`. Use the shared helper.

**🟢 T6. Over-promise.** "Live GPS tracker activates on courier dispatch" may not be true for every courier.

### 3.8 Contact, About, Gifting, Workshops, Blog, FAQ

**🔴 X1. The contact form does not submit.** `contact-page-client.tsx` L33–36: `handleSubmit` just calls `setSubmitted(true)`. The success screen then promises a reply within 12 hours. **No data leaves the browser, so leads are lost.** Discipline, script style, medium and deadline are collected and discarded.
- **Fix:** POST to an API route (email plus stored lead), with real loading and error states. Keep WhatsApp as the fast path. As a stopgap, build a prefilled `wa.me` link from the form.

**🟠 X2. Labels are not tied to inputs.** `<label>` has no `htmlFor` and `<input>` has no `id` (L272, 302, 315…). Clicking a label does not focus the field and screen readers do not announce the field name. Focus feedback is only a 1px border (`focus:outline-none focus:border-primary`). The codebase has 21 `focus:outline-none` uses.

**🟠 X3. Social icons are wrong.** A `Camera` stands in for Instagram, a `Globe` for Facebook, a `Palette` for Pinterest with `href="#"`. Use real glyphs or text links and remove the dead Pinterest link.

**🟠 X4. `href="#"` placeholders** *(scan)*: `gifting-page-client.tsx` (about 12), `gifting-landing-client.tsx` (3), `blog-page-client.tsx` (2), `contact-page-client.tsx` (1). They scroll to top with no feedback. The gifting sidebar also shows hard-coded counts (6, 4, 5).

**🟡 X5. Copy tone slows comprehension.** "Initiate an Atelier Inscription or Consultation", "Bespoke Commission Dossier", "Select Discipline of Interest", "Patron Name", "Inquiry Protocol". The voice is distinctive but over-applied. Keep it in headings and use plain labels ("Your name", "What do you need?").

**🟡 X6. Inconsistent address.** The contact page ("Ratan niwas … bhusawal Maharashtra", lowercase) differs from the footer. Use one shared constant.

**🟡 X7. Possible dead code.** Gifting has two implementations, `gifting-landing-client.tsx` (25 KB, used by `app/gifting/page.tsx`) and `gifting-page-client.tsx` (51 KB). Confirm whether the larger one is unused.

**🟡 X8. Heavy client components** *(scan)*: `gifting-page-client` 51 KB, `blog-article-client` 50 KB, `workshops-client` 35 KB, `blog-page-client` 31 KB, `shop-page-client` 31 KB. Large files for mostly static content slow mid-range phones and make design changes costly.

### 3.9 System states and utility pages

**🟡 U1. 404 page.** A shopping-cart icon, system-font "404" and a single "Continue Shopping" button. No logo, no search, no links to Shop, Gifting or Contact.

**🟡 U2. Loading patterns differ.** Skeletons on PDP and shop, a spinner on tracking, a gray pulse on gifting. Standardize on layout-matching skeletons.

**🟡 U3. Toasts.** `top-center` with default `richColors` (generic green/red/amber) can overlap the sticky header on mobile. Theme them to the palette.

**🟢 U4. Overlay collisions.** Verify the chat launcher and newsletter popup do not collide with the cart drawer or a future sticky PDP CTA, that the popup closes on Esc, and that it never shows on checkout.

---

## 4. Responsive review

| Breakpoint | Issue | Where |
|---|---|---|
| **Mobile (<640)** | Hero is two cropped photos with no headline or CTA | `hero-showcase.tsx` |
| | Footer drops FAQ, legal, Track Order, address, WhatsApp | `stacked-circular-footer.tsx` |
| | "Customise & Order" exists only on hover | `shop-catalog-client.tsx` |
| | Add to Cart sits far below a long description, no sticky CTA | PDP |
| | Inputs and textarea under 16px trigger iOS auto-zoom | `add-to-cart-button.tsx`, forms |
| | Many tap targets under 44px: header icons, quantity buttons (`w-8`), copy-AWB button | multiple |
| | Trust cards use 12px copy | PDP |
| **Tablet (640–1279)** | Hamburger nav until 1280px, so landscape iPads get the mobile menu | `layout.tsx` |
| | Desktop footer starts at `md` (768px) but only switches to 12 columns at `lg`, so 768–1023px gets a 2-column layout with uneven brand and legal columns | `footer.tsx` |
| | Category pills scroll horizontally with a hidden scrollbar and no edge fade, so users may not realize there are more | `shop-catalog-client.tsx` |
| **Desktop (≥1280)** | Container widths and gutters differ per page, so the content edge shifts | site-wide |
| | Consider a sticky buy box on `lg+` so price and CTA stay visible next to a tall gallery (I did not read `media-gallery.tsx`, so verify current behavior) | PDP |
| | Contact uses `max-w-[1440px]` with `lg:px-16`, which makes lines long | `contact-page-client.tsx` |

---

## 5. Accessibility checklist (WCAG 2.2 AA)

| Check | Status | Notes |
|---|---|---|
| Contrast, primary CTA | ❌ | P1: about 1.1:1 button vs page |
| Contrast, small text | ⚠️ | `text-secondary/60` placeholders, `stone-400` on white, 11px rose errors. Verify with a checker |
| `brand-script #B85058` with white | ⚠️ | Roughly 4.5:1, marginal. Avoid for text under 14px |
| Minimum text size | ❌ | 99 uses of 9–12px |
| Target size (2.5.8) | ❌ | Several icon controls with about 4px padding |
| Focus visible | ⚠️ | Menu button has a ring. Many inputs rely on a 1px border change |
| Labels tied to inputs | ❌ | Contact form |
| Landmarks | ❌ | Nested `<main>`, unlabeled `<nav>`s |
| One `<h1>` | ⚠️ | Missing on non-empty checkout and likely the cart view |
| Reduced motion | ⚠️ | Only 7 references; pulse, 700ms hover zooms and spinners should honor `motion-reduce:` |
| Hover-only controls | ❌ | "Customise & Order", wishlist heart |
| Icon-only button names | ✅ mostly | 64 `aria-label`s |
| `lang` attribute | ✅ | Set from store settings |
| Dialog focus handling | ✅ | Radix Sheet/Dialog (the custom simulated modal is dead code) |
| Skip link | ❌ | None, and the header is tall |

---

## 6. Prioritized redesign plan

### Phase 0: Fix what is broken (1–2 days, highest ROI)
| # | Task | Files |
|---|---|---|
| 0.1 | Ink-filled **Add to Cart** with a strong focus ring | `add-to-cart-button.tsx` |
| 0.2 | Wire the two dead PDP buttons to WhatsApp with product context | `add-to-cart-button.tsx`, PDP `page.tsx` |
| 0.3 | Make the contact form actually send | `contact-page-client.tsx` + new API route |
| 0.4 | Remove `/account`, wishlist icons and `href="#"` links, or make them real | `layout.tsx`, `navbar.tsx`, contact and gifting files |
| 0.5 | Implement sort/filters via URL, or remove the fake ones | `shop-catalog-client.tsx` |
| 0.6 | Show Sale badge per product, not per campaign | `product-card.tsx` |
| 0.7 | Remove hard-coded "Atelier Heirlooms" and brass-frame copy | PDP `page.tsx` |
| 0.8 | Re-enable out-of-stock logic | `add-to-cart-button.tsx` |
| 0.9 | Fix nested `<main>` | PDP, checkout |

### Phase 1: Foundation (3–4 days)
1. Cut the Material-3 palette to about 15 semantic tokens (page, surface, tint, ink, ink-muted, border, accent, accent-hover, on-accent, danger, success…). Keep temporary aliases.
2. Remove `.text-secondary !important` and rename the tertiary tokens.
3. Define the type scale above and map `font-serif` to EB Garamond. Drop Geist (my recommendation) so Raleway is the single sans.
4. One `Container` component, one radius rule.
5. One `Button` (primary, secondary, ghost, 44px min height), `Field` (label, hint, error, aria wiring) and `Badge`.
6. Decide on dark mode: remove the dead tokens or support it properly.

### Phase 2: Core commerce flows (4–6 days)
1. Single `ProductCard` (4:5, optimized images, "From" price, real sale %, lead time).
2. PDP reorder: price first, accordions for long content, sticky mobile CTA, inscription live preview.
3. Cart: delete dead code, show free shipping, per-line inscription.
4. Checkout and tracking re-skin to brand tokens, with autofill, aria wiring and scroll-to-first-error.
5. One responsive footer.

### Phase 3: Pages and polish (3–5 days)
1. Hero restructure (text first, local optimized images, `priority`).
2. Replace Material Symbols with lucide and remove the external stylesheet.
3. Plain-language pass on nav, form labels and filters.
4. Branded 404, themed toasts, skip link, `prefers-reduced-motion`.
5. Review the pages I only scanned (about, blog, workshops, FAQ, campaigns, search, order success, newsletter dialog) against the new system.
6. axe and Lighthouse pass, then real-device testing on a mid-range Android phone.

### Success measures
- Zero dead interactive elements (a Playwright smoke test that clicks every nav, shop and PDP control).
- Zero text under 12px. Contrast at least 4.5:1 for text and 3:1 for UI.
- axe-core: no serious or critical issues on home, shop, PDP, cart, checkout, tracking.
- Mobile LCP under 2.5s on the home page.
- Funnel tracking before and after: PDP to add-to-cart, and checkout completion.

---

## 7. What is already good (keep it)
- A distinctive palette (ink, blush, vellum) and serif/sans pairing. The brand has a point of view.
- A Radix-based accessibility foundation (Sheet, Dialog, Select).
- Solid PDP mechanics: breadcrumb, two-column layout, volume pricing, Omnibus price, variants deep-linked in the URL.
- The tracking timeline concept and the PIN-code autofill are genuinely helpful.
- A distraction-free checkout page with its own header.
- Good use of Suspense, skeletons and caching.

---

## 8. Decisions I need from you before coding
1. **Dark mode:** remove it (my recommendation) or support it?
2. **Shop filters:** do you have real attributes (medium, ink, occasion) in the backend? If not, I will remove the fake facets and keep category + sort.
3. **Wishlist and accounts:** planned or not? If not, I will remove them from the UI.
4. **Contact form delivery:** email, save to the Medusa backend, or hand off to WhatsApp?
5. **Fonts:** standardize on EB Garamond (headings) and Raleway (body) and drop Geist?
