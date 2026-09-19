# The Letter Ink — Product Requirements Document (PRD)

---

## 1. Document Control

| Field | Value |
|-------|-------|
| Product Name | The Letter Ink |
| Document Title | Product Requirements Document (PRD) |
| Version | 1.0 |
| Status | Draft — Pending Owner Approval |
| Date | 2025-06-10 |
| Owner | Product Lead / Owner |
| Stakeholders | Product, UI/UX, Frontend, Backend, QA, DevOps, Content, Operations, Business |
| Source of Truth | "Updated - Letter ink Summary.txt" — The Letter Ink — Complete Summary |
| Change History | v1.0 — Initial PRD derived from consolidated planning summary |

**Source Discipline Legend:**

- **[SRC]** — Source-derived fact (explicitly present in the summary).
- **[OBS]** — Existing-site observation (current-state behavior; not automatically an approved requirement).
- **[FUT]** — Future requirement (supported by the source as a requirement to build).
- **[TBD]** — Open Decision / unresolved in the source; must not be guessed.
- **[REC]** — Industry-standard recommendation (clearly marked; not an approved business decision).

---

## 2. Executive Summary

The Letter Ink is a calligraphy-based design studio offering personalized physical products, handwritten letters, engraving and custom lettering services, wedding/event/corporate work, gifting collections, and workshops/masterclasses.

This PRD defines the requirements for a new digital storefront and bespoke-service platform that preserves the brand's handcrafted identity while replacing the current fragmented implementation with canonical content, explicit data models, complete user journeys, and backend-controlled business rules. **[SRC]**

**What is being built:**

- A trustworthy commerce experience for ready and personalized products.
- A first-class product customization system with backend-controlled paper/ink compatibility, font style, custom text, envelope customization, and preview where applicable.
- A dedicated Gifting page with curated, occasion-based, and corporate/bulk gifting.
- A structured Services enquiry system (not a generic contact form).
- A dedicated Workshops system with registration, capacity management, waitlist, and private/corporate enquiries.
- A Blog with an integrated Gallery section below the blog content (no separate Gallery page).
- A production-ready campaign/promotion system with CRUD, lifecycle, coupon codes, eligibility, usage limits, and backend validation.
- Cart, checkout, payment (idempotent), order management, proof approval, CMS/admin, analytics, and policy management.

**Core customer journeys:**

1. Product purchase (standard and personalized).
2. Product purchase with proof approval.
3. Gifting purchase.
4. Corporate/bulk gifting enquiry.
5. Service enquiry and quote/proof workflow.
6. Workshop registration and waitlist.
7. Campaign/coupon purchase.
8. Failed payment recovery.
9. Customer order status.

**Major business goals:** Increase qualified personalized-product purchases; simplify gifting discovery/purchase; improve bespoke enquiry quality; make workshop registration straightforward; prevent personalization loss across the funnel; give operators no-code management; preserve brand identity; improve accessibility, performance, SEO, and trust; provide measurable analytics. **[SRC]**

**High-level scope:** Finalized top-level sitemap (Home, Shop, Gifting, Workshops, Services, Blog, About Us, Contact Us) plus supporting commerce/utility flows. **[SRC]**

---

## 3. Product Vision

Create a trustworthy, visually expressive commerce and enquiry experience where customers can understand the brand and craft; discover products, gifting, services, and workshops; configure and personalize products safely; purchase ready or personalized products; submit structured bespoke requirements; register for workshops; review and approve proofs; pay securely; understand fulfilment, delivery, and support expectations; and track what happens after submission or purchase. **[SRC]**

The new website must preserve the handcrafted identity of The Letter Ink while replacing fragmented content, incomplete routes, and disconnected customer journeys with a clear, data-driven system. **[SRC]**

**Visual direction (behavioral/UX boundary, not visual prescription):** Minimal, elegant, premium, human-designed, editorial/craft-focused, warm and refined. Not flashy, not futuristic, not template-like, not AI-looking. **[SRC]**

---

## 4. Background and Current-State Problems

### A. Existing-Site Observations **[OBS]**

The following are observed behaviors of the existing website. They are **not** automatically approved requirements and must not be treated as final product requirements unless the source explicitly does so.

| ID | Observation |
|----|-------------|
| OBS-01 | Conflicting shop routes and product counts: category shop route showed 14 visible products while legacy `/our-shop/` route exposed 26 records. |
| OBS-02 | Legacy/template content mixed into the shop. |
| OBS-03 | Inconsistent product names, dimensions, descriptions, and pack quantities. |
| OBS-04 | Personalization fields not visibly integrated with cart and order data. |
| OBS-05 | Observed public policies include: India-only shipping; dispatch ~2–5 working days; delivery ~7–10 working days after dispatch; remote locations ~12–15 business days; free shipping above ₹2,499; ₹90 shipping below ₹2,499; no COD; Razorpay payment; no standard return/exchange/refund; damage claims requiring package-opening video; cancellation within 36 hours if not dispatched; refunds ~6–7 business days; workshop cancellation at least 8 days before event may qualify for full refund within ~7 business days. |
| OBS-06 | Payment provider Razorpay is currently referenced. |

**Critical rule:** OBS-05 and OBS-06 are observed/current-state references. They are **subject to owner confirmation** before becoming requirements. See Section 46 (Open Decisions) and Section 22 (Payment).

### B. Confirmed Product Problems **[SRC]**

- Conflicting shop routes and product counts.
- Legacy/template content mixed into the shop.
- Inconsistent product names, dimensions, descriptions, and pack quantities.
- Personalization fields not visibly integrated with cart and order data.
- No complete product customization architecture.
- Generic service enquiries without structured qualification.
- Incomplete workshop and supporting content flows.
- Gallery/portfolio content requires clearer integration into the overall content experience.
- No clear proof-approval experience.
- No clear order-status or production workflow.
- Incomplete campaign/promotion management.
- Incomplete trust, accessibility, SEO, and operational information.
- Unverified checkout, payment, notification, fulfilment, and persistence behavior.

### C. Future-State Requirements **[FUT]**

The new product must not simply reproduce the current website. It must preserve brand identity while replacing the fragmented implementation with canonical content, explicit data models, complete user journeys, and backend-controlled business rules. **[SRC]**

Specifically:

- One authoritative shop route and canonical catalogue (FR-001, BR-001).
- First-class product customization with backend-controlled compatibility (Section 12).
- Structured service enquiries (Section 15).
- Complete workshop system (Sections 16–17).
- Gallery integrated into Blog, not a separate page (Section 18).
- Proof approval workflow (Section 24).
- Production-ready campaign system (Section 19).
- Complete checkout/payment/order/notification behavior (Sections 20–23).

---

## 5. Goals

| Goal ID | Goal | Measurable Objective (where possible) |
|---------|------|----------------------------------------|
| G-01 | Increase qualified purchases of personalized products | Track `add_to_cart` → `payment_succeeded` for personalized SKUs; baseline TBD |
| G-02 | Make gifting discovery and purchasing simple | Track `view_gifting` → `add_to_cart` → purchase; baseline TBD |
| G-03 | Increase quality/completeness of bespoke enquiries | % of enquiries with all required fields completed; baseline TBD |
| G-04 | Make workshop discovery/registration straightforward | `view_workshop` → `register_workshop` conversion; baseline TBD |
| G-05 | Reduce uncertainty around pricing, personalization, delivery, next steps | Reduce `personalization_error` and checkout abandonment; baseline TBD |
| G-06 | Prevent personalization loss across product→cart→checkout→production | Zero-tolerance: exact customization payload present at order; verified in staging |
| G-07 | Give operators no-code management | Owner can update products, customization, campaigns, gifting, workshops, blog without developer intervention (DoD #19) |
| G-08 | Preserve handcrafted visual identity | UX review sign-off against visual direction |
| G-09 | Improve accessibility, mobile usability, performance, SEO, trust | WCAG 2.2 AA practices; LCP < 2.5s mobile; metadata/canonical/OG present |
| G-10 | Provide measurable conversion and operational analytics | Analytics events implemented per Section 36 |
| G-11 | Support clear MVP followed by growth capabilities | P0/P1/P2/P3 boundaries preserved |

---

## 6. Non-Goals

Explicit MVP non-goals from the source: **[SRC]**

- Full manufacturing or production planning.
- Warehouse/raw-material inventory management.
- Multi-country tax and shipping.
- Marketplace or multi-vendor functionality.
- AI-generated calligraphy or automatic design generation.
- Replacement of the owner's creative approval process.
- Complex CRM functionality unless explicitly selected as the system of record.
- Advanced enterprise-level marketing automation.

**Over-engineering prohibition [SRC]:** Do not add unnecessary microservices, AI features, advanced CRM, complex loyalty systems, multi-vendor systems, enterprise marketing automation, advanced warehouse management, complex recommendation engines, unnecessary dashboards, roles, or integrations.

---

## 7. Users and Personas

### 7.1 Gift Buyer **[SRC]**

- **Role:** Purchases meaningful personalized gifts.
- **Goal:** Find a personalized gift, understand customization, see price/delivery, purchase without messaging.
- **Main needs:** Clear options, pricing, delivery window, confidence in final spelling/style/material.
- **Pain points:** Uncertainty about personalization, delivery, and next steps.
- **Relevant journeys:** Standard purchase, personalized purchase, gifting purchase, campaign/coupon purchase.

### 7.2 Wedding or Event Buyer **[SRC]**

- **Role:** Needs personalized items or on-site lettering for events.
- **Goal:** Reliable partner with clear examples, capacity, quotation steps, deadlines.
- **Main needs:** Portfolio, lead times, capacity guidance, structured enquiry.
- **Pain points:** Generic enquiries, unclear capacity/deadlines.
- **Relevant journeys:** Service enquiry, service quote/proof workflow, corporate/bulk enquiry.

### 7.3 Corporate or Brand Buyer **[SRC]**

- **Role:** Larger commission (brand gifting, activations, corporate work).
- **Goal:** Understand capability, required info, approval, delivery.
- **Main needs:** Bulk/corporate enquiry, catalogue download, quantity/budget/date/branding capture.
- **Pain points:** No structured qualification.
- **Relevant journeys:** Corporate/bulk gifting enquiry, service enquiry.

### 7.4 Recipient or Gift Planner **[SRC]**

- **Role:** Ensures final spelling, style, material, personalization, packaging match intent.
- **Goal:** Confidence in final output.
- **Main needs:** Preview, proof approval, clear spelling responsibility.
- **Pain points:** Personalization loss; unclear proof process.
- **Relevant journeys:** Personalized purchase, product with proof approval.

### 7.5 Workshop Participant **[SRC]**

- **Role:** Discovers and registers for workshops.
- **Goal:** See real upcoming workshops; understand date, location, fee, skill level, materials; reserve or waitlist.
- **Main needs:** Accurate dates/time zones, seats remaining, waitlist, confirmation.
- **Pain points:** Incomplete workshop flows.
- **Relevant journeys:** Workshop registration, workshop waitlist.

### 7.6 Studio Operator **[SRC]**

- **Role:** Maintains products, customization, prices, promotions, proofs, orders, enquiries, workshops, content.
- **Goal:** Manage without editing page code.
- **Main needs:** Admin/CMS, order pipeline, proof workflow, enquiry pipeline.
- **Pain points:** Fragmented tooling.
- **Relevant journeys:** All operational flows.

### 7.7 Content Editor **[SRC]**

- **Role:** Publishes accurate product, service, workshop, blog, gallery, policy content.
- **Goal:** Publish with appropriate metadata and media.
- **Main needs:** CMS, media management, SEO fields, publication workflow.
- **Pain points:** Incomplete content management.
- **Relevant journeys:** Content management.

### 7.8 Fulfilment User **[SRC]**

- **Role:** Sees what needs to be produced, approved personalization, proof status, shipping, dispatch.
- **Goal:** Fulfil without accessing unrelated customer/payment data.
- **Main needs:** Production queue, approved personalization, proof status, dispatch fields, tracking.
- **Pain points:** Unclear production state.
- **Relevant journeys:** Order management, proof approval, fulfilment.

---

## 8. Information Architecture / Sitemap

### 8.1 Finalized Top-Level Sitemap **[SRC]**

- **Home**
- **Shop**
  - All products
  - Product categories
  - Product listing
  - Product details
  - Product customization
- **Gifting**
  - Gifting collections
  - Personalized gifts
  - Gift sets
  - Gifts by occasion
  - Gifts by recipient
  - Gift recommendations
  - Custom gifting enquiry
- **Workshops**
  - Upcoming workshops
  - Workshop categories
  - Workshop details
  - Registration
  - Registration confirmation
  - Waitlist
  - Past workshops
- **Services**
  - Engraving
  - Handwritten letters
  - Envelope addressing
  - Place cards and tags
  - Weddings and events
  - Corporate and brand work
  - Custom/personalized work
  - On-site calligraphy
  - Service details
  - Service enquiry
- **Blog**
  - All articles
  - Calligraphy and lettering
  - Gifting ideas
  - Wedding and event inspiration
  - Behind the scenes
  - Brand stories
  - Tips and guides
  - Blog details
  - **Gallery section below the blog content**
    - All work
    - Product showcase
    - Handwritten work
    - Calligraphy work
    - Wedding and event work
    - Custom projects
    - Corporate/brand projects
    - Gallery item details where applicable
- **About Us**
  - Brand story
  - Our philosophy
  - Our process
  - Founder/artist introduction
  - Our work and approach
  - Values
  - Studio/brand journey
- **Contact Us**
  - Contact information
  - Contact form
  - Business enquiries
  - Service enquiries
  - Workshop enquiries
  - Custom order enquiries
  - Social links
  - Location/studio information

### 8.2 Supporting Commerce and Utility Flows **[SRC]**

- Cart
- Checkout
- Order confirmation
- Product customization flow
- Customer enquiry confirmation
- Workshop registration confirmation
- Optional account area
- FAQ
- Shipping and delivery information
- Returns/cancellation policy
- Privacy policy
- Terms and conditions

### 8.3 Important Sitemap Rule **[SRC]**

> **Gallery is NOT a separate top-level page. Gallery is a section within the Blog page, appearing below the blog content.**

No additional primary navigation items shall be introduced.

### 8.4 Shop Route Conflict Resolution **[SRC]**

The PRD requires:

- One authoritative shop route (FR-001).
- One canonical catalogue.
- Redirect or retirement of the legacy route.
- Reconciliation of product counts.
- Canonical URL, SEO, inventory, pricing, and product ownership.
- No duplicated or conflicting records.

---

## 9. Product Scope

### 9.1 Homepage

- **Purpose:** Brand introduction and navigation hub.
- **Users:** All visitors.
- **Scope:** Brand story, featured products/collections, entry points to Shop, Gifting, Workshops, Services, Blog.
- **Core functionality:** Navigation, featured content, CTAs.
- **Dependencies:** CMS, catalogue, campaign content.
- **Business rules:** No placeholder/demo content at launch (Launch Checklist).

### 9.2 Shop

- **Purpose:** Product discovery and purchase entry.
- **Users:** Gift buyer, wedding/event buyer, corporate buyer.
- **Scope:** All products, categories, listing, details, customization.
- **Core functionality:** Browse, filter (category, product family, occasion, price, personalization type, availability, material/approved attributes), sort, pagination/progressive loading, product cards with image, name, price, currency, personalization indicator, availability, lead-time/delivery signal, category/product family, options, CTA.
- **Dependencies:** Catalogue, media, customization config, pricing.
- **Business rules:** One canonical catalogue; no duplicate records (BR-001).

### 9.3 Product Details

- **Purpose:** Present full product information and enable configuration.
- **Users:** All buyers.
- **Scope:** Per Section 9 requirements list (title, family, images/alt text, price/currency, availability, variant/pack, materials, dimensions, included items, care, customization options, character limits, examples/placeholders, spelling responsibility, proof requirement, lead time, delivery window, shipping charge/threshold, cancellation/refund summary, FAQ, related products, reviews/testimonials where approved, add-to-cart CTA, configuration summary).
- **Core functionality:** Display, configure, validate, add to cart.
- **Dependencies:** Catalogue, customization, pricing, media.
- **Business rules:** See Section 28.

### 9.4 Product Customization

- **Purpose:** First-class commerce capability for personalization.
- **Users:** Buyers, operators.
- **Scope:** Paper color, ink color, font style, custom text, envelope customization where applicable, preview where applicable, pricing, persistence, versioning.
- **Core functionality:** Backend-managed configuration, compatibility rules, validation, pricing, persistence, snapshots.
- **Dependencies:** Customization config, personalization schema, pricing rules.
- **Business rules:** Backend is source of truth (BR-002); compatibility backend-controlled (BR-003); customization persists through cart→checkout→order→production (BR-004); historical order customization immutable (BR-005).

### 9.5 Gifting

- **Purpose:** Dedicated gifting experience.
- **Users:** Gift buyer, corporate buyer.
- **Scope:** Hero → Curated Gifting → Occasion-based Gifting → Corporate/Bulk Gifting → Testimonials/Social Proof → CTA.
- **Core functionality:** Curated collections, gift sets, hampers, occasion gifting, recipient-based gifting, corporate/bulk enquiry, catalogue download where applicable, testimonials.
- **Dependencies:** Catalogue, CMS, enquiry system.
- **Business rules:** Occasions backend-configurable, not hardcoded (BR-006); gifting content backend-driven (BR-007).

### 9.6 Services

- **Purpose:** Present bespoke services and capture structured enquiries.
- **Users:** Wedding/event buyer, corporate buyer, custom buyer.
- **Scope:** Engraving, handwritten letters, envelope addressing, place cards/tags, weddings/events, corporate/brand, custom/personalized, on-site calligraphy.
- **Core functionality:** Service detail, use cases, portfolio, deliverables, lead time, capacity, pricing model, enquiry CTA.
- **Dependencies:** CMS, enquiry system, gallery.
- **Business rules:** Structured enquiry, not one generic contact form (BR-008).

### 9.7 Service Enquiries

- **Purpose:** Capture qualified bespoke requirements.
- **Users:** Buyers, operators.
- **Scope:** Dynamic/service-specific fields, file uploads, validation, confirmation, enquiry ID, status lifecycle, assignment, internal notes, quote, deposit, proof, completion.
- **Core functionality:** Form submission, acknowledgement, pipeline management.
- **Dependencies:** Enquiry system, notifications.
- **Business rules:** See Section 15 and Section 28.

### 9.8 Workshops

- **Purpose:** Dedicated workshops system.
- **Users:** Workshop participant, corporate buyer, operator.
- **Scope:** Hero → Upcoming Workshops → Workshop Cards → Studio Starter Kit → Private Atelier/Corporate Brand Activations → Testimonials → FAQ → Final CTA.
- **Core functionality:** Listing, details, upcoming/past, date/time/time zone, venue/mode, instructor, capacity, seats remaining, registration, waitlist, starter kit, materials, skill level, accessibility, private workshops, corporate activations, FAQ, testimonials.
- **Dependencies:** CMS, registration system, payment (where enabled), notifications.
- **Business rules:** Overbooking must be prevented (BR-009).

### 9.9 Workshop Registration/Waitlist

- **Purpose:** Enable seat reservation and waitlist.
- **Users:** Participants, operators.
- **Scope:** Seat reservation, atomic capacity handling, payment where applicable, confirmation, cancellation, transfer, refund, waitlist, reminder, attendance.
- **Core functionality:** Atomic reservation, state management, notifications.
- **Dependencies:** Registration system, payment, notifications.
- **Business rules:** Atomic capacity; no overbooking (BR-009); sold-out/cancelled/waitlisted states defined (BR-010).

### 9.10 Blog

- **Purpose:** Content and brand storytelling.
- **Users:** All visitors.
- **Scope:** All articles, categories (calligraphy/lettering, gifting ideas, wedding/event inspiration, behind the scenes, brand stories, tips/guides), detail pages, SEO metadata.
- **Core functionality:** Article listing, categories, detail pages.
- **Dependencies:** CMS, media.
- **Business rules:** Content workflow (Section 29).

### 9.11 Integrated Gallery

- **Purpose:** Portfolio/showcase within Blog.
- **Users:** All visitors.
- **Scope:** Gallery section below blog content; categories (all work, product showcase, handwritten, calligraphy, wedding/event, custom projects, corporate/brand projects); item details where applicable; reusable across product/service/workshop/gifting pages.
- **Core functionality:** Backend-managed gallery items, categories, images, client permissions, tags, related services/products, publishing.
- **Dependencies:** CMS, media, permissions.
- **Business rules:** No separate Gallery page (BR-011); client permission required before publication (BR-012).

### 9.12 Campaigns/Promotions

- **Purpose:** Production-ready commerce promotion system.
- **Users:** Owner, operator.
- **Scope:** Campaign CRUD, lifecycle, discount types, coupon codes, auto-apply, scheduling, eligibility, targeting, usage limits, per-customer limits, minimum order value, maximum discount, priority, stacking, media upload, promotional messaging, usage analytics.
- **Core functionality:** Admin management, backend validation, redemption tracking.
- **Dependencies:** Commerce engine, catalogue, media.
- **Business rules:** Campaigns must not directly manipulate product base prices (BR-013); promotion validation backend-controlled (BR-014); see Section 19.

### 9.13 Cart

- **Purpose:** Persist intended purchases.
- **Users:** Buyers.
- **Scope:** Add, edit, quantity, remove, customization, promotion, shipping, availability, persistence, recovery after failure, duplicate-line behavior.
- **Core functionality:** Line management, persistence, promotion application.
- **Dependencies:** Catalogue, customization, pricing, promotions.
- **Business rules:** See Section 20 and Section 28.

### 9.14 Checkout

- **Purpose:** Complete purchase.
- **Users:** Buyers.
- **Scope:** Guest checkout, optional account, contact, shipping, billing, pincode, shipping calculation, tax, promotions, personalization summary, policy acceptance, payment, error recovery.
- **Core functionality:** Data capture, calculation, review, payment handoff.
- **Dependencies:** Cart, pricing, payment, policies.
- **Business rules:** See Section 21 and Section 28.

### 9.15 Payment

- **Purpose:** Secure payment processing.
- **Users:** Buyers.
- **Scope:** Initiation, success, failure, cancellation, timeout, retry, callback verification, idempotency, duplicate prevention, refund state, reconciliation.
- **Core functionality:** Payment integration, callback handling, state management.
- **Dependencies:** Payment provider (Razorpay referenced but subject to confirmation), order system.
- **Business rules:** Idempotent callbacks (BR-015); duplicate-payment prevention (BR-016); see Section 22.

### 9.16 Orders

- **Purpose:** Order lifecycle management.
- **Users:** Buyers, operators, fulfilment.
- **Scope:** Order creation, states, line snapshots, personalization snapshots, promotion snapshots, payment state, fulfilment state, shipping, tracking, cancellation, refund, completion.
- **Core functionality:** State machine, snapshots, notifications.
- **Dependencies:** Payment, catalogue, customization, fulfilment.
- **Business rules:** See Section 23 and Section 28.

### 9.17 Proof Approval

- **Purpose:** Customer approval of personalized content before production.
- **Users:** Buyers, operators.
- **Scope:** Proof creation, versioning, sending, approval, revision request, comments, approval timestamp, production blocking, superseded proofs.
- **Core functionality:** Proof workflow, versioning, approval state.
- **Dependencies:** Order system, notifications.
- **Business rules:** Production blocked until approval (BR-017); no silent overwrite of approved content (BR-018).

### 9.18 Customer Account (Optional)

- **Purpose:** Optional account area.
- **Users:** Buyers.
- **Scope:** Login, registration, password recovery, order history, order details, saved customer information where appropriate.
- **Core functionality:** Authentication, account management.
- **Dependencies:** Auth system, order system.
- **Business rules:** Guest checkout remains supported unless business requirements later make accounts mandatory (BR-019).

### 9.19 CMS/Content Management

- **Purpose:** No-code content management.
- **Users:** Content editor, owner.
- **Scope:** Products, customization, campaigns, gifting, services, workshops, blog, gallery, media, policies, SEO.
- **Core functionality:** CRUD, publication workflow, media management, SEO fields.
- **Dependencies:** All content modules.
- **Business rules:** Content workflow (Section 29); policy workflow (Section 29).

### 9.20 Admin/Operations

- **Purpose:** Operational management.
- **Users:** Owner, operator, content editor, fulfilment user.
- **Scope:** Products, prices, customization, campaigns, orders, policies, users, integrations, refunds, final approvals; enquiries, orders, proofs, customer communication, workshop attendance, fulfilment status; content; fulfilment view.
- **Core functionality:** Role-based admin, pipelines, queues.
- **Dependencies:** All modules.
- **Business rules:** Roles and permissions (Section 26); security rules (Section 28).

### 9.21 Policies

- **Purpose:** Publish approved policies.
- **Users:** Owner, content editor.
- **Scope:** Shipping/delivery, returns/cancellation, privacy, terms, personalization, workshop policies.
- **Core functionality:** Policy workflow (draft→review→approved→published→archived), versioning, effective date.
- **Dependencies:** CMS, legal review.
- **Business rules:** Policy version snapshotted into orders where applicable (BR-020).

### 9.22 Analytics

- **Purpose:** Measurement and operational visibility.
- **Users:** Product, business, operations.
- **Scope:** Events per Section 36.
- **Core functionality:** Event tracking, funnel analysis.
- **Dependencies:** Analytics integration.
- **Business rules:** No raw personalization text; no unnecessary PII (BR-021).

---

## 10. Detailed Functional Requirements

Requirements use unique IDs FR-001, FR-002, etc. Each contains: Requirement ID, Name, Description, Actor, Preconditions, Main Behavior, Business Rules, Validation, Error/Edge Cases, Postconditions, Priority.

---

### FR-001 — Navigation and Routing **[SRC]**

- **Description:** The site shall provide complete navigation for Home, Shop, Gifting, Workshops, Services, Blog, About, Contact. Gallery shall not be a separate primary route.
- **Actor:** Visitor.
- **Preconditions:** Site deployed.
- **Main Behavior:** Primary navigation renders finalized top-level items; Gallery accessible only within Blog page below blog content.
- **Business Rules:** BR-011 (no separate Gallery page).
- **Validation:** All primary destinations resolve; legacy shop route redirects to authoritative route.
- **Error/Edge Cases:** Unknown routes return 404; legacy `/our-shop/` redirects (301) to canonical shop route.
- **Postconditions:** User can reach all primary destinations.
- **Priority:** P0.

---

### FR-002 — Catalogue Discovery **[SRC]**

- **Description:** Customers can browse/filter products by category, product family, occasion, price, personalization type, availability, material/approved attributes.
- **Actor:** Customer.
- **Preconditions:** Catalogue populated.
- **Main Behavior:** Listing displays product cards (image, name, price, currency, personalization indicator, availability, lead-time/delivery signal, category/product family, options, CTA); filters and sorting available; pagination or progressive loading.
- **Business Rules:** One canonical catalogue (BR-001).
- **Validation:** Filters return correct subsets; sorting works; pagination correct.
- **Error/Edge Cases:** No results → clear empty state; unavailable products handled.
- **Postconditions:** Customer can navigate to product detail.
- **Priority:** P0.

---

### FR-003 — Product Configuration **[SRC]**

- **Description:** Each product/variant defines options, price, availability, customization, validation rules, lead time, shipping behavior.
- **Actor:** Operator (config), Customer (select).
- **Preconditions:** Product exists.
- **Main Behavior:** Customer selects variant/options; system displays price, availability, lead time.
- **Business Rules:** Backend is source of truth for configuration (BR-002).
- **Validation:** Variant/option selection valid; price recalculated.
- **Error/Edge Cases:** Variant unavailable → disable and message.
- **Postconditions:** Configuration ready for customization.
- **Priority:** P0.

---

### FR-004 — Customization Integrity **[SRC]**

- **Description:** Exact customization must persist through product page, cart, quantity update, refresh, checkout, payment failure, retry, order, production.
- **Actor:** System.
- **Preconditions:** Customization configured.
- **Main Behavior:** Customization payload attached to cart line; preserved through all states; snapshotted on order.
- **Business Rules:** BR-004 (persistence), BR-005 (immutability after approval).
- **Validation:** Payload matches selection at each stage.
- **Error/Edge Cases:** Payment failure → customization retained on retry; refresh → retained.
- **Postconditions:** Order contains exact customization.
- **Priority:** P0.

---

### FR-005 — Customization Compatibility **[SRC]**

- **Description:** Backend shall validate paper/ink compatibility, product-specific customization availability, valid combinations, pricing rules, required fields.
- **Actor:** System.
- **Preconditions:** Compatibility rules defined.
- **Main Behavior:** Frontend shows/enables compatible options; backend validates server-side.
- **Business Rules:** BR-003 (backend-controlled compatibility); no hardcoding in frontend.
- **Validation:** Incompatible combinations hidden/disabled; server rejects invalid payloads.
- **Error/Edge Cases:** Dark paper selected → incompatible dark inks not selectable; server rejects tampered payloads.
- **Postconditions:** Only valid combinations can be added to cart.
- **Priority:** P0.

---

### FR-006 — Proof Approval **[SRC]**

- **Description:** Operator can send proof, version proof, receive approval, receive revision request, add comments, block production until approval.
- **Actor:** Operator, Customer.
- **Preconditions:** Order requires proof.
- **Main Behavior:** Proof sent → customer approves or requests revision → operator versions → production blocked until approval.
- **Business Rules:** BR-017 (production blocking), BR-018 (no silent overwrite).
- **Validation:** Approval recorded with actor/timestamp; superseded proofs marked.
- **Error/Edge Cases:** Customer unresponsive → order state `customer_unresponsive`; revision requested → new proof version.
- **Postconditions:** Approved proof enables production.
- **Priority:** P1.

---

### FR-007 — Campaign and Promotion **[SRC]**

- **Description:** Admin can create, configure, schedule, activate, pause, monitor, deactivate, archive campaigns. System validates discount and eligibility rules server-side.
- **Actor:** Owner/Operator.
- **Preconditions:** Campaign system available.
- **Main Behavior:** CRUD, lifecycle management, coupon codes, auto-apply, targeting, usage limits, priority, stacking.
- **Business Rules:** BR-013 (no base price manipulation), BR-014 (backend validation).
- **Validation:** Duplicate codes prevented; discount values validated; date validation.
- **Error/Edge Cases:** Expired coupon, not-yet-active, usage limit reached, customer limit reached, minimum cart not met, product not eligible, conflicting promotions, duplicate codes, invalid discount values.
- **Postconditions:** Campaign active/inactive per schedule; redemptions tracked.
- **Priority:** P0.

---

### FR-008 — Pricing and Shipping **[SRC]**

- **Description:** System calculates product price, variant price, customization price, discounts, shipping, tax where applicable, final amount.
- **Actor:** System.
- **Preconditions:** Pricing rules defined.
- **Main Behavior:** Calculation at cart/checkout; display in currency.
- **Business Rules:** Money stored as integer minor units with currency code (BR-022); no calculation from display-formatted strings.
- **Validation:** Totals reconcile; discounts applied correctly.
- **Error/Edge Cases:** Shipping threshold boundary (₹2,499) — subject to confirmation.
- **Postconditions:** Final amount presented for payment.
- **Priority:** P0.

---

### FR-009 — Checkout and Payment **[SRC]**

- **Description:** Support guest checkout, contact information, shipping, order review, policy acceptance, payment, idempotent confirmation, recoverable failures.
- **Actor:** Customer.
- **Preconditions:** Cart populated.
- **Main Behavior:** Capture details → review → accept policies → pay → confirmation.
- **Business Rules:** BR-015 (idempotent callbacks), BR-016 (duplicate prevention), BR-019 (guest checkout).
- **Validation:** Pincode, address, policy acceptance.
- **Error/Edge Cases:** Payment failure/timeout/cancellation → recoverable; duplicate callback → no duplicate order.
- **Postconditions:** Order created only after verified payment.
- **Priority:** P0.

---

### FR-010 — Order Communication **[SRC]**

- **Description:** Customers receive confirmation, payment status, proof status, production status where appropriate, dispatch/tracking status, cancellation/refund outcome.
- **Actor:** System.
- **Preconditions:** Order exists.
- **Main Behavior:** Transactional notifications triggered by state transitions.
- **Business Rules:** Required transactional vs optional marketing notifications distinguished (BR-023).
- **Validation:** Notification delivery monitored.
- **Error/Edge Cases:** Notification failure → retry/monitoring.
- **Postconditions:** Customer informed of order state.
- **Priority:** P1.

---

### FR-011 — Service Enquiry **[SRC]**

- **Description:** Customers can submit a complete service brief.
- **Actor:** Customer.
- **Preconditions:** Service page exists.
- **Main Behavior:** Structured, service-specific fields; file uploads; validation; confirmation with enquiry ID.
- **Business Rules:** BR-008 (structured enquiry).
- **Validation:** Required fields; file type/size; consent.
- **Error/Edge Cases:** Incomplete enquiry, upload failure, invalid file type.
- **Postconditions:** Enquiry in pipeline with reference ID.
- **Priority:** P1.

---

### FR-012 — Workshop Registration **[SRC]**

- **Description:** System shall prevent overbooking, show seat state, accept participant details, take payment if enabled, support waitlist, handle configured cancellation rules.
- **Actor:** Customer, Operator.
- **Preconditions:** Workshop exists.
- **Main Behavior:** Atomic seat reservation; confirmation; waitlist if sold out.
- **Business Rules:** BR-009 (no overbooking), BR-010 (states).
- **Validation:** Capacity check atomic; participant details.
- **Error/Edge Cases:** Sold out, waitlist full, workshop cancellation.
- **Postconditions:** Seat reserved or waitlisted.
- **Priority:** P2.

---

### FR-013 — Gifting **[SRC]**

- **Description:** Customers shall be able to browse gifting collections, browse occasions, view curated gift options, access personalized gifts, submit bulk/corporate gifting enquiries.
- **Actor:** Customer.
- **Preconditions:** Gifting page published.
- **Main Behavior:** Dynamic collections; occasion sections backend-configurable; corporate enquiry.
- **Business Rules:** BR-006 (occasions configurable), BR-007 (backend-driven content).
- **Validation:** Product links correct; enquiry fields.
- **Error/Edge Cases:** No collections → clear state.
- **Postconditions:** Customer can purchase or submit enquiry.
- **Priority:** P1.

---

### FR-014 — Content Management **[SRC]**

- **Description:** Editors can manage products, customization, campaigns, gifting content, services, workshops, blog, gallery, media, SEO, pages.
- **Actor:** Content Editor.
- **Preconditions:** CMS available.
- **Main Behavior:** CRUD operations; publication workflow; media management.
- **Business Rules:** Content workflow (Section 29).
- **Validation:** Required fields; SEO metadata; media validation.
- **Error/Edge Cases:** Draft/published state conflicts; media upload failure.
- **Postconditions:** Content published or updated.
- **Priority:** P0.

---

### FR-015 — Search, SEO and Sharing **[SRC]**

- **Description:** Every indexable page should have unique title, meta description, canonical URL, Open Graph image, meaningful heading hierarchy, structured data where applicable, shareable URLs.
- **Actor:** System.
- **Preconditions:** Page exists.
- **Main Behavior:** Metadata rendered; structured data where applicable.
- **Business Rules:** Section 33.
- **Validation:** Metadata present; canonical correct; OG image present.
- **Error/Edge Cases:** Missing metadata → default fallback.
- **Postconditions:** Page indexable and shareable.
- **Priority:** P1.

---

### FR-016 — Accessibility **[SRC]**

- **Description:** Target WCAG 2.2 AA practices: keyboard operation, visible focus, correct labels, accessible errors, semantic headings, meaningful alt text, screen-reader-compatible menus, sufficient contrast, reduced-motion support.
- **Actor:** System.
- **Preconditions:** UI implemented.
- **Main Behavior:** Accessible interactions.
- **Business Rules:** Section 34.
- **Validation:** Automated + manual accessibility checks.
- **Error/Edge Cases:** Focus trap, missing labels, contrast failures.
- **Postconditions:** Accessible experience.
- **Priority:** P1.

---

### FR-017 — Privacy and Consent **[SRC]**

- **Description:** System shall collect only necessary data; separate marketing consent from service/order processing; support unsubscribe; protect uploads; link to approved policy versions; support retention/deletion/access processes.
- **Actor:** System.
- **Preconditions:** Consent framework defined.
- **Main Behavior:** Consent capture, storage, enforcement.
- **Business Rules:** Section 35.
- **Validation:** Consent flags recorded; unsubscribe works.
- **Error/Edge Cases:** Missing consent → block marketing; deletion request handling.
- **Postconditions:** Privacy-compliant data handling.
- **Priority:** P1.

---

## 11. Product Catalogue Requirements

Covering product creation, editing, publishing/unpublishing, categories, product families, variants, SKUs, pricing, availability, media, dimensions, materials, pack counts, lead times, related products, SEO metadata. **[SRC]**

| ID | Requirement | Priority |
|----|-------------|----------|
| PC-01 | Operators can create products with all fields defined in the Product domain model (Section 27). | P0 |
| PC-02 | Operators can edit products; edits do not alter historical order snapshots. | P0 |
| PC-03 | Operators can publish/unpublish products; unpublished products unavailable for new orders but historical orders preserved. | P0 |
| PC-04 | Products can belong to categories and product families. | P0 |
| PC-05 | Products can have variants with option values, SKU, price delta/absolute price, availability, dimensions, material, pack count, production lead-time override, personalization schema reference. | P0 |
| PC-06 | Pricing supports base price, currency, tax behavior, sale price where applicable. | P0 |
| PC-07 | Availability states supported (in stock, out of stock, made to order, etc. — exact states TBD). | P0 |
| PC-08 | Media supports primary image, gallery, alt text. | P0 |
| PC-09 | Dimensions, materials, included items, care instructions captured. | P0 |
| PC-10 | Pack counts supported. | P0 |
| PC-11 | Lead-time ranges captured. | P0 |
| PC-12 | Related products configurable. | P1 |
| PC-13 | SEO title, description, canonical URL, social image captured. | P1 |
| PC-14 | Product families and categories reconciled into one canonical catalogue. | P0 |
| PC-15 | Legacy route `/our-shop/` retired or redirected. | P0 |
| PC-16 | Product counts reconciled between routes. | P0 |

---

## 12. Product Customization Requirements

This section is detailed because customization is a first-class commerce capability. **[SRC]**

### 12.1 Paper Color

- Available paper colors. **[SRC]**
- Product-specific availability. **[SRC]**
- Dynamic selection. **[SRC]**

### 12.2 Ink Color

- Available ink colors. **[SRC]**
- Product-specific availability. **[SRC]**
- Compatibility with selected paper. **[SRC]**

### 12.3 Paper/Ink Compatibility

- Compatibility must be backend-controlled. **[SRC]**
- Example: Dark paper selected → compatible light/visible inks should be shown or enabled. **[SRC]**
- Incompatible combinations should be hidden or disabled. **[SRC]**
- Compatibility rules must **not** be hardcoded in the frontend. **[SRC]**
- Backend validates all combinations server-side. **[SRC]**

### 12.4 Font Style

- Available lettering/font styles. **[SRC]**
- Product-specific configuration. **[SRC]**
- Preview where applicable. **[SRC]**

### 12.5 Custom Text / Personalization

- Customer-entered text. **[SRC]**
- Required/optional configuration. **[SRC]**
- Character limits. **[SRC]**
- Allowed characters. **[SRC]**
- Line-break rules. **[SRC]**
- Help text. **[SRC]**
- Placeholder/example. **[SRC]**
- Production value preservation. **[SRC]**
- Spelling responsibility statement. **[SRC]**

### 12.6 Envelope Customization

Where applicable: **[SRC]**

- Envelope style.
- Addressing.
- Ink/style selection.
- Custom text.
- Related pricing.

### 12.7 Preview

Where applicable, customers should receive an appropriate preview of: **[SRC]**

- Selected options.
- Custom text.
- Style.
- Paper/ink combination.

The preview should **not** be treated as the final production proof unless explicitly approved. **[SRC]**

### 12.8 Customization Architecture

Relationship: **Product → Customization Configuration → Options → Compatibility Rules → Pricing Rules** **[SRC]**

Backend is source of truth for: customization options, product-specific configuration, paper options, ink options, ink/paper compatibility, font options, envelope options, validation, pricing, persistence, production information. **[SRC]**

Frontend is responsible for: UI, user interaction, conditional display, selection state, preview, sending configuration to backend. **[SRC]**

Customization must be: per-product, dynamic, CRUD-manageable, versioned where necessary, validated server-side, DRY, preserved through cart and checkout, associated with the final order. **[SRC]**

### 12.9 Personalization Schema

Each product or variant should define a versioned personalization schema containing: **[SRC]**

- Field ID.
- Field label.
- Machine-readable key.
- Input type.
- Required/optional status.
- Maximum length.
- Allowed characters.
- Whether line breaks are allowed.
- Help text.
- Placeholder.
- Example.
- Reference-file support.
- Proof requirement.
- Operator review requirement.

Examples: Name on frame, name for acrylic, initial for acrylic, letter text, ink colour, paper colour, background colour, shape/size, envelope addressing, reference artwork. **[SRC]**

The system must: **[SRC]**

- Validate required fields before add-to-cart.
- Preserve values after validation errors.
- Show a summary before purchase.
- Attach the exact payload to the cart line item.
- Preserve personalization after quantity changes.
- Preserve personalization across refresh and checkout failure.
- Snapshot the personalization schema version on the order.
- Preserve historical personalization even after the product configuration changes.
- Prevent an order from entering production when required proof approval is incomplete.
- Maintain proof versions and revision history.
- Never silently overwrite approved content.

### 12.10 Customization Pricing

- Rules defined per product/config. **[SRC]**
- Validation server-side. **[SRC]**
- Backend calculation. **[SRC]**

### 12.11 Persistence

Ensure customization survives: **[SRC]**

- Product page.
- Cart.
- Refresh.
- Quantity changes.
- Checkout.
- Payment failure.
- Retry.
- Order.
- Production.

### 12.12 Versioning

Historical customization schemas and order snapshots are preserved. **[SRC]**

- Personalization schema version frozen on order.
- Historical order customization immutable after approval.
- Product configuration changes do not alter historical orders.

---

## 13. Gifting Requirements

Gifting is a dedicated top-level page, separate from Shop. **[SRC]**

Reference structure: **Hero → Curated Gifting → Occasion-based Gifting → Corporate/Bulk Gifting → Testimonials/Social Proof → CTA** **[SRC]**

### 13.1 Hero

- Brand/gifting introduction. **[SRC]**
- Primary CTA. **[SRC]**
- Supporting visual. **[SRC]**

### 13.2 Curated Gifting

Support: **[SRC]**

- Curated gift collections.
- Gift hampers.
- Personalized gifts.
- Gift sets.
- Product/collection cards.
- Images.
- Title.
- Description.
- Price/starting price.
- Tags/badges.
- Customization indicator.
- CTA.

### 13.3 Occasion Gifting

- Occasions such as Wedding, Anniversary, Birthday, other future occasions. **[SRC]**
- Occasions must be backend-configurable rather than hardcoded. **[SRC]**

### 13.4 Corporate/Bulk Gifting

Support: **[SRC]**

- Corporate gifting information.
- Bulk order information.
- Brand gifting.
- Catalogue download where applicable.
- Bulk gifting enquiry.
- Quantity requirements.
- Budget.
- Delivery date.
- Branding/customization requirements.

### 13.5 Testimonials

Support approved: **[SRC]**

- Customer testimonials.
- Corporate testimonials.
- Workshop/customer feedback where relevant.

### 13.6 Gifting Enquiry

Should capture enough information to qualify a bulk/custom gifting requirement. **[SRC]**

### 13.7 Backend-Driven Content

Gifting content is backend-driven. **[SRC]**

---

## 14. Services Requirements

Document every service: **[SRC]**

| Service | Detail |
|---------|--------|
| Engraving | Service detail, use cases, portfolio, deliverables, lead time, capacity, pricing model, enquiry CTA |
| Handwritten letters | Same |
| Envelope addressing | Same |
| Place cards and tags | Same |
| Weddings and events | Same |
| Corporate and brand work | Same |
| Custom/personalized work | Same |
| On-site calligraphy | Same |

Each service page should contain: **[SRC]**

- Service promise.
- Ideal use cases.
- Portfolio examples.
- Deliverables.
- Materials/formats.
- Minimum quantity where applicable.
- Service area.
- Lead-time range.
- Capacity guidance.
- Starting price or quote-required indicator.
- Required customer inputs.
- FAQ.
- Enquiry CTA.
- Expected response time.
- Relevant policy.

---

## 15. Service Enquiry Requirements

Define: dynamic/service-specific fields, file uploads, validation, confirmation, enquiry ID, status lifecycle, assignment, internal notes, quote, deposit, proof, completion. **[SRC]**

### 15.1 Fields

May include: **[SRC]**

- Selected service.
- Event/use case.
- Event date.
- Quantity.
- Guest count.
- Venue/location.
- City.
- Budget range.
- Personalization requirements.
- Brand/artwork details.
- Reference files.
- Desired deadline.
- Customer name.
- Email.
- Phone.
- Message.
- Consent for enquiry processing.
- Separate marketing consent.

### 15.2 After Submission

- Confirmation message. **[SRC]**
- Enquiry reference ID. **[SRC]**
- Expected response time. **[SRC]**
- Support contact. **[SRC]**
- Clear next step. **[SRC]**

### 15.3 Service Pipeline States

Recommended: **[SRC]**

- New.
- Reviewing.
- Needs information.
- Quoted.
- Quote approved.
- Deposit/invoice pending.
- Approved.
- In production.
- Completed.
- Declined.
- Cancelled.

### 15.4 Operator Capabilities

Operators should be able to: **[SRC]**

- Assign owner.
- Add internal notes.
- Request more information.
- Upload/send quote.
- Record budget and price.
- Request approval.
- Track deposit/invoice.
- Send proof.
- Record revisions.
- Mark complete.
- Convert enquiry into order/work item.
- Obtain permission before publishing work in Gallery.

---

## 16. Workshop Requirements

Workshops is a dedicated top-level page. **[SRC]**

Reference structure: **Hero → Upcoming Workshops → Workshop Cards → Studio Starter Kit → Private Atelier & Corporate Activations → Testimonials → FAQ → Final CTA** **[SRC]**

### 16.1 Hero

- Workshop introduction. **[SRC]**
- Supporting content. **[SRC]**
- Primary CTA. **[SRC]**

### 16.2 Upcoming Workshops

Workshop cards should support: **[SRC]**

- Title.
- Category/type.
- Image.
- Date.
- Time.
- Time zone.
- Venue/online mode.
- Short description.
- Inclusions.
- Price.
- Availability.
- Seats remaining.
- Status.
- Registration CTA.
- Waitlist CTA where applicable.

### 16.3 Workshop Details

Should include: **[SRC]**

- Workshop title.
- Description.
- Instructor.
- Date.
- Time.
- Duration.
- Venue/online mode.
- Location/joining instructions.
- Fee.
- Materials.
- Starter kit.
- Skill level.
- Accessibility information.
- Capacity.
- Registration opening/closing.
- Cancellation policy.

### 16.4 Studio Starter Kit

Content should be configurable and support: **[SRC]**

- Included materials.
- Images.
- Descriptions.
- Workshop-specific kit information.

### 16.5 Private Atelier and Corporate Brand Activations

Support: **[SRC]**

- Private workshops.
- Corporate workshops.
- Brand activations.
- Structured enquiry.

### 16.6 Testimonials

Support: **[SRC]**

- Student/customer testimonials.
- Ratings where appropriate.
- Approved images.

### 16.7 FAQ

Workshop-specific questions and answers. **[SRC]**

---

## 17. Workshop Registration Requirements

The workshop system must support: **[SRC]**

- Upcoming workshops.
- Past workshops.
- Registration.
- Capacity management.
- Atomic seat reservation.
- Prevention of overbooking.
- Participant information.
- Payment where enabled.
- Confirmation.
- Waitlist.
- Cancellation.
- Transfer where applicable.
- Refund.
- Reminder notifications.
- Attendance management.
- Export.
- Sold-out state.
- Cancelled state.

Private/corporate workshops should use an enquiry flow rather than normal public registration where appropriate. **[SRC]**

### 17.1 Explicit States

- **Sold-out:** No seats available; registration disabled; waitlist CTA shown if enabled. **[SRC]**
- **Cancelled:** Workshop cancelled; registrants notified; refund per policy. **[SRC]**
- **Waitlisted:** Workshop full; participant added to waitlist; notified if seat becomes available. **[SRC]**

### 17.2 Overbooking Prevention

- Atomic seat reservation required. **[SRC]**
- Capacity check must be atomic to prevent race conditions. **[SRC]**

---

## 18. Blog and Gallery Requirements

Blog is a top-level page. **[SRC]**

Page structure: **Blog content → Gallery section** **[SRC]**

### 18.1 Blog Section

Support: **[SRC]**

- All articles.
- Calligraphy and lettering.
- Gifting ideas.
- Wedding/event inspiration.
- Behind the scenes.
- Brand stories.
- Tips and guides.
- Blog detail pages.
- SEO metadata.

### 18.2 Gallery Section

There is **no separate Gallery page**. **[SRC]**

The Gallery section appears below the blog content and should support: **[SRC]**

- All work.
- Product showcase.
- Handwritten work.
- Calligraphy work.
- Wedding/event work.
- Custom projects.
- Corporate/brand projects.
- Gallery item details where applicable.

Gallery content should be backend-managed and reusable in: **[SRC]**

- Blog/Gallery section.
- Product pages.
- Service pages.
- Workshop pages.
- Gifting pages where relevant.

### 18.3 Gallery Item Requirements

- Title. **[SRC]**
- Client. **[SRC]**
- Permission status. **[SRC]**
- Project type. **[SRC]**
- Description. **[SRC]**
- Gallery/media. **[SRC]**
- Testimonial. **[SRC]**
- Related service. **[SRC]**
- Publish date. **[SRC]**
- Tags/categories. **[SRC]**

### 18.4 Client Permissions

- Client permission required before Gallery publication. **[SRC]**
- Permission status tracked on media asset/gallery item. **[SRC]**

---

## 19. Campaign / Promotion Requirements

The campaign system should be a **basic production-ready commerce promotion system**, not merely a coupon table. **[SRC]**

### 19.1 Campaign Lifecycle

**Campaign List → Create → Configure → Preview/Review → Schedule/Publish → Active → Monitor → Pause/Deactivate → Expire/Archive** **[SRC]**

States: Draft, Scheduled/Upcoming, Active, Paused/Inactive, Expired, Archived. **[SRC]**

### 19.2 Campaign Information

Support: **[SRC]**

- Campaign name.
- Internal description/notes.
- Campaign type.
- Status.
- Start date/time.
- End date/time.
- Campaign image/banner.
- Promotional messaging.
- Created/updated timestamps.
- Created by.
- Updated by.

### 19.3 Discount Types

At minimum: **[SRC]**

- Percentage discount.
- Fixed amount discount.
- Optional free-shipping promotion.

### 19.4 Coupon Configuration

Support: **[SRC]**

- Coupon code.
- Auto-applied promotion.
- Overall usage limit.
- Per-customer usage limit.
- Minimum cart/order value.
- Maximum discount cap for percentage discounts.

### 19.5 Campaign Targeting

Support: **[SRC]**

- Entire store/catalog.
- Specific products.
- Product categories.
- Product collections.
- Customer eligibility/segments where supported.

### 19.6 Promotion Rules

The system should support: **[SRC]**

- Campaign priority.
- Promotion stacking rules.
- Conflict prevention.
- Date validation.
- Duplicate-code prevention.
- Discount validation.
- Eligibility validation.

### 19.7 Campaign Media

Campaigns should support: **[SRC]**

- Banner/image upload.
- Media validation.
- Storage.
- Campaign-specific display image.
- Alt text where applicable.

### 19.8 Campaign Tracking

Admin should be able to view basic: **[SRC]**

- Usage count.
- Remaining usage limit.
- Redemption data.
- Applicable orders.
- Revenue/discount information where supported.

### 19.9 Important Rule

Campaigns must not directly manipulate product base prices. **[SRC]**

They should operate through the approved commerce/promotion mechanism. **[SRC]**

Discount eligibility and calculation must be validated by the backend/commerce engine. **[SRC]**

### 19.10 Edge Cases

- Expired coupon. **[SRC]**
- Not-yet-active campaign. **[SRC]**
- Usage limit reached. **[SRC]**
- Customer limit reached. **[SRC]**
- Minimum cart value not met. **[SRC]**
- Product not eligible. **[SRC]**
- Conflicting promotions. **[SRC]**
- Duplicate codes. **[SRC]**
- Invalid discount values. **[SRC]**

---

## 20. Cart Requirements

Cart lines must store: **[SRC]**

- Product ID.
- Variant ID.
- Product snapshot.
- Variant snapshot.
- Quantity.
- Unit price.
- Currency.
- Customization payload.
- Personalization schema version.
- Proof status.
- Availability.
- Shipping class.
- Price snapshot.
- Applied promotion/discount information.

Cart requirements: **[SRC]**

- Survive refresh.
- Preserve customization.
- Preserve quantity updates.
- Handle unavailable products.
- Show shipping estimate.
- Apply valid campaigns/coupons.
- Recover after payment failure.
- Avoid duplicate lines unless personalization differs.
- Allow editing personalization.

---

## 21. Checkout Requirements

Checkout should support: **[SRC]**

- Guest checkout.
- Optional account creation.
- Contact details.
- Shipping address.
- Billing address where required.
- Pincode validation.
- Shipping calculation.
- Tax display if applicable.
- Campaign/coupon handling.
- Final order review.
- Personalization summary.
- Policy acceptance.
- Payment.
- Error recovery.
- Confirmation.

---

## 22. Payment Requirements

The currently referenced payment provider is Razorpay, but it **must be confirmed before implementation**. **[SRC]**

The system must support: **[SRC]**

- Authenticated payment callbacks.
- Idempotent callbacks.
- Payment success.
- Payment failure.
- Payment cancellation.
- Payment timeout.
- Retry.
- Duplicate-payment prevention.
- Provider reference storage.
- Refund state.
- Payment/order reconciliation.

**Note:** Razorpay is "currently referenced/subject to confirmation" unless the source explicitly marks it as finalized. **[SRC]**

---

## 23. Order Management

Document order creation, order states, order line snapshots, personalization snapshots, promotion snapshots, payment state, fulfilment state, shipping, tracking, cancellation, refund, completion. **[SRC]**

### 23.1 Recommended Order States

Primary order flow: **[SRC]**

```
pending_payment
→ paid
→ needs_review
→ awaiting_customer_proof
→ proof_revision_requested
→ approved_for_production
→ in_production
→ dispatched
→ delivered
→ completed
```

Alternative states: **[SRC]**

```
payment_failed
cancelled
refunded
on_hold
declined
customer_unresponsive
```

Every transition should record: **[SRC]**

- Actor.
- Timestamp.
- Reason/comment.
- Customer notification state.
- Tracking number where relevant.
- Proof version where relevant.
- Payment/refund evidence where relevant.

### 23.2 Order Line

- Order ID. **[SRC]**
- Product ID. **[SRC]**
- Variant snapshot. **[SRC]**
- Quantity. **[SRC]**
- Unit price. **[SRC]**
- Customization payload snapshot. **[SRC]**
- Schema version. **[SRC]**
- Proof requirement. **[SRC]**
- Proof status. **[SRC]**
- Approved content. **[SRC]**
- Production notes. **[SRC]**
- Fulfilment status. **[SRC]**

---

## 24. Proof and Approval Workflow

Document proof creation, proof versioning, sending proof, customer approval, revision request, comments, approval timestamp, production blocking, superseded proofs. **[SRC]**

### 24.1 Proof Version States

- Sent. **[SRC]**
- Approved. **[SRC]**
- Revision requested. **[SRC]**
- Superseded. **[SRC]**
- Cancelled. **[SRC]**

### 24.2 Proof Version Fields

- Proof ID. **[SRC]**
- Order/enquiry reference. **[SRC]**
- Version number. **[SRC]**
- Rendered preview/asset. **[SRC]**
- Customer comment. **[SRC]**
- Operator comment. **[SRC]**
- State. **[SRC]**
- Approval actor. **[SRC]**
- Approval timestamp. **[SRC]**

### 24.3 Production Blocking

- Production blocked until required proof approval is complete. **[SRC]**
- No silent overwrite of approved content. **[SRC]**

---

## 25. CMS and Admin Requirements

Define admin capabilities for: products, customization, campaigns, gifting, services, workshops, blog, gallery, media, policies, SEO. **[SRC]**

Use admin roles from source: Owner, Operator, Content Editor, Fulfilment View. **[SRC]**

---

## 26. Roles and Permissions

Document: Owner, Operator, Content Editor, Fulfilment User. **[SRC]**

### 26.1 Permission Matrix

| Capability | Owner | Operator | Content Editor | Fulfilment View |
|------------|-------|----------|----------------|-----------------|
| Products | ✓ | — | ✓ | — |
| Prices | ✓ | — | — | — |
| Customization | ✓ | — | — | — |
| Campaigns | ✓ | — | — | — |
| Orders | ✓ | ✓ | — | — |
| Policies | ✓ | — | — | — |
| Users | ✓ | — | — | — |
| Integrations | ✓ | — | — | — |
| Refunds | ✓ | — | — | — |
| Final approvals | ✓ | — | — | — |
| Enquiries | ✓ | ✓ | — | — |
| Proofs | ✓ | ✓ | — | — |
| Customer communication | ✓ | ✓ | — | — |
| Workshop attendance | ✓ | ✓ | — | — |
| Fulfilment status | ✓ | ✓ | — | — |
| Media | ✓ | — | ✓ | — |
| Pages | ✓ | — | ✓ | — |
| SEO | ✓ | — | ✓ | — |
| Services | ✓ | — | ✓ | — |
| Workshops (content) | ✓ | — | ✓ | — |
| Blog | ✓ | — | ✓ | — |
| Gallery | ✓ | — | ✓ | — |
| Gifting content | ✓ | — | ✓ | — |
| Production queue | — | — | — | ✓ |
| Approved personalization | — | — | — | ✓ |
| Proof status (view) | — | — | — | ✓ |
| Dispatch fields | — | — | — | ✓ |
| Tracking information | — | — | — | ✓ |

**Note:** No payment or policy publication without appropriate approval. **[SRC]**

No additional roles invented unless clearly justified and marked as proposed.

---

## 27. Data Model

Conceptual domain model. **[SRC]**

### 27.1 Product

- **Purpose:** Canonical product record.
- **Key Fields:** ID, slug, name, short description, long description, product family, category, occasion/use case, tags, status, base price, currency, tax behavior, sale price where applicable, availability, lead-time range, shipping class, dimensions, materials, included items, care instructions, primary image, gallery, alt text, SEO title, SEO description, canonical URL, social image, related products, FAQs, reviews/testimonials.
- **Relationships:** Has variants, customization configuration, personalization schema, media, categories.
- **Constraints:** Soft archive for products referenced by historical orders.

### 27.2 Product Variant

- **Purpose:** Specific purchasable variation.
- **Key Fields:** Variant ID, product ID, variant name, option values, SKU, price delta/absolute price, availability, dimensions, material, pack count, production lead-time override, personalization schema reference.
- **Relationships:** Belongs to product; referenced by cart/order lines.
- **Constraints:** Price snapshot on order.

### 27.3 Customization Configuration

- **Purpose:** Backend-managed configuration for product customization.
- **Key Fields:** Configuration ID, product ID, version, available customization options, option types, paper options, ink options, font options, envelope options, compatibility rules, pricing rules, validation rules, preview configuration, active/inactive status.
- **Relationships:** Belongs to product; referenced by personalization schema.
- **Constraints:** Versioned; compatibility rules server-side only.

### 27.4 Personalization Schema

- **Purpose:** Versioned schema for customer personalization fields.
- **Key Fields:** Schema ID, schema name, version, fields, required state, input type, allowed characters, maximum length, help text, placeholder, proof requirement, reference artwork support, version freeze on orders.
- **Relationships:** Referenced by product/variant; snapshotted on order line.
- **Constraints:** Version frozen on order; historical schema preserved.

### 27.5 Campaign

- **Purpose:** Promotion record.
- **Key Fields:** Campaign ID, name, internal description, campaign type, status, start date/time, end date/time, discount type, discount value, coupon code, auto-apply state, usage limit, per-customer limit, minimum order value, maximum discount, target products/categories/collections, eligibility rules, priority, stacking rules, campaign image, display messaging, created by, updated by, created/updated timestamps.
- **Relationships:** Targets products/categories/collections; referenced by cart/order promotions.
- **Constraints:** Does not manipulate base prices; backend validation only.

### 27.6 Media Asset

- **Purpose:** Managed media file.
- **Key Fields:** File, asset type, focal point, alt text, caption, permission status, usage rights, original/optimized versions, dimensions, linked entity.
- **Relationships:** Linked to products, services, workshops, blog, gallery, campaigns.
- **Constraints:** Permission status tracked; scans and access control for uploads.

### 27.7 Service

- **Purpose:** Bespoke service record.
- **Key Fields:** ID, slug, name, description, use cases, service area, minimum quantity, starting price/quote-required flag, lead-time range, gallery, FAQs, enquiry schema, owner, status.
- **Relationships:** Has enquiry schema; linked to gallery items.
- **Constraints:** Enquiry schema defines required fields.

### 27.8 Service Enquiry

- **Purpose:** Structured bespoke enquiry.
- **Key Fields:** ID, service ID, status, source/campaign data, customer information, event/use case, event date, quantity, location, budget, personalization brief, attachments, consent flags, internal notes, quoted amount, response SLA, assigned owner, status history, timestamps.
- **Relationships:** Belongs to service; may convert to order/work item.
- **Constraints:** Consent separate for enquiry processing and marketing; internal notes private.

### 27.9 Workshop

- **Purpose:** Workshop record.
- **Key Fields:** ID, slug, title, description, instructor, date/time/time zone, venue/online URL, capacity, seats remaining, waitlist setting, fee, currency, materials, starter kit, skill level, accessibility information, registration opening/closing, cancellation policy, status.
- **Relationships:** Has registrations, waitlist, testimonials, FAQ.
- **Constraints:** Atomic capacity; no overbooking.

### 27.10 Customer

- **Purpose:** Customer record.
- **Key Fields:** ID, name, email, phone, marketing consent, communication preferences, saved addresses where enabled, orders, enquiries, workshop registrations.
- **Relationships:** Has orders, enquiries, registrations.
- **Constraints:** Consent stored separately; data retention/deletion processes supported.

### 27.11 Cart and Order

- **Key Fields:** Cart/session ID, customer reference, order number, currency, line items, totals, discounts, shipping, tax, payment state, payment provider reference, shipping address, billing address, tracking reference, order status, status history, accepted policy versions.
- **Relationships:** Has order lines, proofs, payments.
- **Constraints:** Money as integer minor units with currency code; snapshots preserved.

### 27.12 Order Line

- **Key Fields:** Order ID, product ID, variant snapshot, quantity, unit price, customization payload snapshot, schema version, proof requirement, proof status, approved content, production notes, fulfilment status.
- **Relationships:** Belongs to order; has proof versions.
- **Constraints:** Historical customization immutable after approval.

### 27.13 Proof Version

- **Key Fields:** Proof ID, order/enquiry reference, version number, rendered preview/asset, customer comment, operator comment, state, approval actor, approval timestamp.
- **Relationships:** Belongs to order/enquiry.
- **Constraints:** States: Sent, Approved, Revision requested, Superseded, Cancelled.

### 27.14 Portfolio/Gallery Item

- **Key Fields:** Title, client, permission status, project type, description, gallery/media, testimonial, related service, publish date, tags/categories.
- **Relationships:** Linked to services, products, workshops, blog.
- **Constraints:** Client permission required before publication.

### 27.15 Policy

- **Key Fields:** Version, effective date, owner approval, legal review where applicable, publication date, archive date.
- **Relationships:** Referenced by orders (accepted policy versions).
- **Constraints:** Workflow: Draft → Review → Approved → Published → Archived.

---

## 28. Business Rules

Centralized business rules with unique IDs. **[SRC]**

| ID | Rule | Source |
|----|------|--------|
| BR-001 | One authoritative shop route; one canonical catalogue; no duplicated or conflicting records. | Shop route conflict |
| BR-002 | Backend is source of truth for customization options, product-specific configuration, compatibility rules, validation, pricing, persistence, production information. | Customization architecture |
| BR-003 | Paper/ink compatibility is backend-controlled; incompatible combinations hidden or disabled; not hardcoded in frontend. | Customization compatibility |
| BR-004 | Customization must persist through product page, cart, quantity update, refresh, checkout, payment failure, retry, order, production. | Customization persistence |
| BR-005 | Historical order customization must remain immutable after approval. | Data/security rules |
| BR-006 | Gifting occasions must be backend-configurable rather than hardcoded. | Gifting |
| BR-007 | Gifting content is backend-driven. | Gifting |
| BR-008 | Services use a structured enquiry flow, not one generic contact form. | Services |
| BR-009 | Overbooking must be prevented; atomic seat reservation. | Workshop registration |
| BR-010 | Sold-out, cancelled, and waitlisted states must be defined and handled. | Workshop registration |
| BR-011 | Gallery is NOT a separate top-level page; Gallery is a section within the Blog page, appearing below the blog content. | Sitemap rule |
| BR-012 | Client permission required before Gallery publication. | Gallery/portfolio |
| BR-013 | Campaigns must NOT directly manipulate product base prices. | Campaigns |
| BR-014 | Promotion validation must happen on backend/commerce engine. | Campaigns |
| BR-015 | Payment callbacks must be idempotent. | Payment |
| BR-016 | Duplicate-payment prevention required. | Payment |
| BR-017 | Production blocked until required proof approval is complete. | Proof workflow |
| BR-018 | No silent overwrite of approved content. | Proof workflow |
| BR-019 | Guest checkout remains supported unless business requirements later make accounts mandatory. | Checkout |
| BR-020 | Policy versions snapshotted into orders where applicable. | Policies |
| BR-021 | No raw personalization text to analytics; no unnecessary personal data to third-party analytics. | Analytics |
| BR-022 | Store money as integer minor units with currency code; do not calculate from display-formatted price strings. | Data/security rules |
| BR-023 | Required transactional notifications distinguished from optional marketing notifications. | Notifications |
| BR-024 | Snapshot product, variant, price, customization schema, personalization, promotion, and policy versions into orders where applicable. | Data/security rules |
| BR-025 | Preserve historic order data when products are unpublished or edited. | Data/security rules |
| BR-026 | Use soft archive for products referenced by historical orders. | Data/security rules |
| BR-027 | Treat personalization and uploads as customer-controlled content. | Data/security rules |
| BR-028 | Scan and restrict uploaded files. | Data/security rules |
| BR-029 | Keep internal notes private. | Data/security rules |
| BR-030 | Do not expose private attachments through guessable URLs. | Data/security rules |
| BR-031 | Keep order/status history reconstructable. | Data/security rules |
| BR-032 | Make cart operations idempotent. | Data/security rules |
| BR-033 | Make payment callbacks idempotent. | Data/security rules |
| BR-034 | Do not move proof-required orders into production before approval. | Data/security rules |
| BR-035 | Store consent separately for enquiry processing and marketing. | Data/security rules |
| BR-036 | Support unsubscribe. | Data/security rules |
| BR-037 | Log sensitive operator changes. | Data/security rules |
| BR-038 | Provide backups and tested restore procedures. | Data/security rules |
| BR-039 | Restrict operator actions by role. | Data/security rules |
| BR-040 | Promotion eligibility must always be server-validated. | Data/security rules |
| BR-041 | Campaigns must not be trusted from frontend calculations. | Data/security rules |
| BR-042 | Customization compatibility must always be validated server-side. | Data/security rules |
| BR-043 | Historical order customization must remain immutable after approval. | Data/security rules |
| BR-044 | Campaigns have lifecycle: Draft → Scheduled → Active → Paused → Expired → Archived. | Campaigns |
| BR-045 | Duplicate coupon codes prevented. | Campaigns |
| BR-046 | Discount values validated. | Campaigns |
| BR-047 | Date validation for campaigns. | Campaigns |
| BR-048 | Eligibility validation for campaigns. | Campaigns |
| BR-049 | Campaign priority supported. | Campaigns |
| BR-050 | Promotion stacking rules supported; conflict prevention. | Campaigns |

---

## 29. State Machines

### 29.1 Order States **[SRC]**

```
pending_payment → paid → needs_review → awaiting_customer_proof
→ proof_revision_requested → approved_for_production → in_production
→ dispatched → delivered → completed
```

Alternative: `payment_failed`, `cancelled`, `refunded`, `on_hold`, `declined`, `customer_unresponsive`

| State | Allowed Transition | Actor | Condition |
|-------|-------------------|-------|-----------|
| pending_payment | paid | System | Payment verified |
| pending_payment | payment_failed | System | Payment failed |
| pending_payment | cancelled | Customer/System | Timeout/cancel |
| paid | needs_review | Operator | Order requires review |
| needs_review | awaiting_customer_proof | Operator | Proof required |
| needs_review | approved_for_production | Operator | No proof required |
| awaiting_customer_proof | proof_revision_requested | Customer | Revision requested |
| awaiting_customer_proof | approved_for_production | Customer | Proof approved |
| proof_revision_requested | awaiting_customer_proof | Operator | New proof sent |
| approved_for_production | in_production | Operator | Production started |
| in_production | dispatched | Operator | Dispatched |
| dispatched | delivered | System/Operator | Delivered |
| delivered | completed | System/Operator | Complete |
| any | on_hold | Operator | Hold |
| any | cancelled | Operator | Cancel |
| any | refunded | Operator | Refund |
| any | declined | Operator | Decline |
| awaiting_customer_proof | customer_unresponsive | Operator | No response |

### 29.2 Payment States

- Initiated → Success / Failure / Cancellation / Timeout.
- Success → Refunded (where applicable).
- Failure → Retry → Success.

### 29.3 Proof States **[SRC]**

- Sent → Approved / Revision requested / Superseded / Cancelled.

### 29.4 Service Enquiry States **[SRC]**

- New → Reviewing → Needs information → Quoted → Quote approved → Deposit/invoice pending → Approved → In production → Completed → Declined / Cancelled.

### 29.5 Workshop States **[SRC]**

- Upcoming → Sold-out / Cancelled / Waitlisted.
- Registration: Confirmed → Cancelled / Transferred / Refunded.

### 29.6 Campaign States **[SRC]**

- Draft → Scheduled → Active → Paused → Expired → Archived.

### 29.7 Content States **[SRC]**

- General: Draft → Review → Scheduled → Published → Archived.
- Policy: Draft → Review → Approved → Published → Archived.

---

## 30. User Journeys

### 30.1 Standard Product Purchase **[SRC]**

1. Customer lands on Home, Shop, Gifting, Search, or campaign link.
2. Customer browses products.
3. Customer opens a product.
4. Customer reviews product information.
5. Customer selects variant/options.
6. Customer adds to cart.
7. Customer reviews cart.
8. Customer enters contact/shipping details.
9. Customer applies promotion/coupon where applicable.
10. Customer reviews final amount.
11. Customer accepts required policies.
12. Customer pays.
13. Customer receives order confirmation.
14. Order dispatched.
15. Customer receives tracking/status updates.
16. Order completed.

### 30.2 Personalized Product Purchase **[SRC]**

1. Customer lands on product page.
2. Customer reviews product information.
3. Customer selects variant/options.
4. Customer configures personalization (paper, ink, font, text, envelope).
5. System validates customization.
6. Customer reviews configuration.
7. Customer adds to cart.
8. Customer reviews cart (customization preserved).
9. Customer enters contact/shipping details.
10. Customer applies promotion/coupon where applicable.
11. Customer reviews final amount and personalization summary.
12. Customer accepts required policies.
13. Customer pays.
14. Customer receives order confirmation with exact personalization.
15. Operator reviews order.
16. Order dispatched.
17. Order completed.

### 30.3 Product with Proof Approval **[SRC]**

1. Customer purchases personalized product requiring proof.
2. Order enters `awaiting_customer_proof`.
3. Operator creates and sends proof.
4. Customer reviews proof.
5. Customer approves or requests revision.
6. If revision: operator versions proof; repeat.
7. If approved: order enters `approved_for_production`.
8. Production proceeds.
9. Dispatch → delivery → completion.

### 30.4 Gifting Purchase **[SRC]**

1. Customer lands on Gifting page.
2. Customer browses curated/occasion/recipient collections.
3. Customer opens gift product/collection.
4. Customer configures personalization where applicable.
5. Customer adds to cart.
6. Customer proceeds through checkout (as 30.1/30.2).

### 30.5 Corporate/Bulk Gifting Enquiry **[SRC]**

1. Customer lands on Gifting page.
2. Customer navigates to Corporate/Bulk Gifting.
3. Customer reviews information and catalogue download where applicable.
4. Customer submits bulk gifting enquiry (quantity, budget, delivery date, branding).
5. System confirms with enquiry ID and expected response time.
6. Operator reviews and responds.

### 30.6 Service Enquiry **[SRC]**

1. Customer discovers service.
2. Customer reviews service detail (promise, use cases, portfolio, deliverables, lead time, capacity, pricing model).
3. Customer submits structured brief.
4. System validates and confirms with enquiry ID, expected response time, support contact, next step.
5. Operator reviews, assigns owner, may request more info, quotes, tracks deposit/invoice, sends proof, records revisions, marks complete.

### 30.7 Service Quote/Proof Workflow **[SRC]**

1. Enquiry received → Reviewing.
2. Operator requests more info if needed → Needs information.
3. Operator sends quote → Quoted.
4. Customer approves quote → Quote approved.
5. Deposit/invoice pending → Approved.
6. Proof sent → Customer approves/requests revision.
7. In production → Completed.

### 30.8 Workshop Registration **[SRC]**

1. Customer lands on Workshops page.
2. Customer browses upcoming workshops.
3. Customer opens workshop details.
4. Customer reviews date, time, time zone, venue, fee, capacity, skill level, materials.
5. Customer checks availability.
6. Customer registers (participant details).
7. Payment where applicable.
8. Confirmation.
9. Reminder.
10. Attend.
11. Post-workshop follow-up.

### 30.9 Workshop Waitlist **[SRC]**

1. Customer views sold-out workshop.
2. Customer joins waitlist.
3. System confirms waitlist position.
4. Seat becomes available → system notifies waitlisted customer.
5. Customer registers within configured window (TBD).
6. If no response, seat offered to next waitlisted customer.

### 30.10 Campaign/Coupon Purchase **[SRC]**

1. Customer views campaign/coupon.
2. Customer adds eligible items to cart.
3. Customer applies coupon code (or auto-apply).
4. Backend validates eligibility, usage limits, minimum order value, maximum discount.
5. Discount applied to cart.
6. Customer proceeds through checkout.
7. Backend re-validates promotion at checkout.
8. Order created with promotion snapshot.

### 30.11 Failed Payment Recovery **[SRC]**

1. Customer initiates payment.
2. Payment fails/timeouts/cancelled.
3. Order remains in `pending_payment` or `payment_failed`.
4. Customization and cart preserved.
5. Customer retries payment.
6. On success, order proceeds.

### 30.12 Customer Order Status **[SRC]**

1. Customer accesses order status (via account or order confirmation link).
2. Customer views order number, products, variants, personalization, quantity, price, discounts, shipping, tax, total, shipping address, estimated dispatch/delivery, proof next step, support contact, cancellation/refund summary, payment state.
3. Customer receives status updates via notifications.

---

## 31. Edge Cases and Failure Scenarios

| ID | Scenario | Expected Behavior |
|----|----------|-------------------|
| EC-01 | Product unavailable | Cannot add to cart; clear message |
| EC-02 | Variant unavailable | Option disabled; clear message |
| EC-03 | Invalid customization | Server rejects; client shows error; values preserved |
| EC-04 | Paper/ink incompatibility | Incompatible options hidden/disabled; server rejects tampered payloads |
| EC-05 | Character limit exceeded | Validation error; values preserved |
| EC-06 | Invalid coupon | Promotion not applied; clear error |
| EC-07 | Expired campaign | Promotion not applied; clear error |
| EC-08 | Usage limit exceeded | Promotion not applied; clear error |
| EC-09 | Minimum cart value not met | Promotion not applied; clear error |
| EC-10 | Promotion conflict | Per stacking rules; clear messaging |
| EC-11 | Payment failure | Order `payment_failed`; cart/customization preserved; retry available |
| EC-12 | Payment timeout | Order `pending_payment`; retry available |
| EC-13 | Duplicate payment callback | Idempotent; no duplicate order |
| EC-14 | Checkout refresh | Cart/customization preserved |
| EC-15 | Proof revision | New proof version; previous superseded |
| EC-16 | Customer not responding | Order `customer_unresponsive`; operator action |
| EC-17 | Workshop sold out | Registration disabled; waitlist CTA if enabled |
| EC-18 | Waitlist full | Waitlist closed; clear message |
| EC-19 | Workshop cancellation | Registrants notified; refund per policy |
| EC-20 | Service enquiry incomplete | Validation errors; values preserved |
| EC-21 | Upload failure | Error message; retry |
| EC-22 | Invalid file type | Rejected with clear error |
| EC-23 | Customer cancellation | Per cancellation policy (subject to confirmation) |
| EC-24 | Refund failure | Logged; operator intervention; reconciliation |

---

## 32. Notifications

### 32.1 Required Transactional Notifications **[SRC]**

- Order confirmation.
- Payment failure.
- Proof sent.
- Proof approved.
- Revision requested.
- Production started where applicable.
- Dispatch.
- Delivery.
- Service enquiry acknowledgement.
- Quote.
- Workshop registration.
- Workshop reminder.
- Waitlist availability.
- Cancellation/refund outcome.

### 32.2 Optional Marketing Notifications **[SRC]**

- Campaign communication where applicable.
- Newsletter signup.
- Abandoned-cart follow-up (P2).

**Rule:** Required transactional notifications vs optional marketing notifications must be clearly distinguished. **[SRC]**

---

## 33. SEO Requirements

Define: metadata, canonicals, structured data, product SEO, article SEO, service SEO, workshop SEO, Open Graph, sitemap, robots, URL structure, redirects. **[SRC]**

| ID | Requirement | Priority |
|----|-------------|----------|
| SEO-01 | Every indexable page has unique title. | P1 |
| SEO-02 | Every indexable page has meta description. | P1 |
| SEO-03 | Every indexable page has canonical URL. | P1 |
| SEO-04 | Every indexable page has Open Graph image. | P1 |
| SEO-05 | Meaningful heading hierarchy. | P1 |
| SEO-06 | Structured data where applicable. | P1 |
| SEO-07 | Shareable URLs. | P1 |
| SEO-08 | Sitemap generated. | P1 |
| SEO-09 | Robots.txt configured. | P1 |
| SEO-10 | URL structure defined. | P1 |
| SEO-11 | Redirects for legacy routes (e.g., `/our-shop/`). | P0 |

---

## 34. Accessibility Requirements

Target WCAG 2.2 AA practices. **[SRC]**

Cover:

- Keyboard operation.
- Visible focus.
- Correct labels.
- Accessible errors.
- Semantic headings.
- Meaningful alt text.
- Screen-reader-compatible menus.
- Sufficient contrast.
- Reduced-motion support.
- Responsive behavior from 360px mobile to desktop.

---

## 35. Security and Privacy Requirements

Cover: **[SRC]**

- Authentication.
- Authorization.
- Role-based access.
- File security.
- Customer data.
- Personalization data.
- Payment data.
- Internal notes.
- Audit logs.
- Consent.
- Marketing preferences.
- Data retention.
- Data deletion/access.

**Rule:** Do not invent legal obligations not supported by source; identify them as items requiring legal review. **[SRC]**

### 35.1 Key Security Invariants

1. Store money as integer minor units with currency code. **[SRC]**
2. Do not calculate from display-formatted price strings. **[SRC]**
3. Snapshot product, variant, price, customization schema, personalization, promotion, and policy versions into orders where applicable. **[SRC]**
4. Preserve historic order data when products are unpublished or edited. **[SRC]**
5. Use soft archive for products referenced by historical orders. **[SRC]**
6. Treat personalization and uploads as customer-controlled content. **[SRC]**
7. Scan and restrict uploaded files. **[SRC]**
8. Keep internal notes private. **[SRC]**
9. Do not expose private attachments through guessable URLs. **[SRC]**
10. Keep order/status history reconstructable. **[SRC]**
11. Make cart operations idempotent. **[SRC]**
12. Make payment callbacks idempotent. **[SRC]**
13. Do not move proof-required orders into production before approval. **[SRC]**
14. Do not send raw personalization text to analytics. **[SRC]**
15. Do not send unnecessary personal data to third-party analytics. **[SRC]**
16. Store consent separately for enquiry processing and marketing. **[SRC]**
17. Support unsubscribe. **[SRC]**
18. Log sensitive operator changes. **[SRC]**
19. Provide backups and tested restore procedures. **[SRC]**
20. Restrict operator actions by role. **[SRC]**
21. Promotion eligibility must always be server-validated. **[SRC]**
22. Campaigns must not be trusted from frontend calculations. **[SRC]**
23. Customization compatibility must always be validated server-side. **[SRC]**
24. Historical order customization must remain immutable after approval. **[SRC]**

---

## 36. Analytics and Measurement

Use analytics events from source. **[SRC]**

| Event Name | Trigger | Purpose | Safe Properties | Must NOT Collect |
|------------|---------|---------|-----------------|------------------|
| `view_home` | Home page view | Track homepage engagement | Device class | PII |
| `view_product_list` | Product listing view | Track listing engagement | Category, filters | PII |
| `view_product` | Product detail view | Track product interest | Product ID, variant ID, category | PII |
| `start_personalization` | Customization started | Track customization funnel | Product ID, variant ID | Raw personalization text |
| `personalization_error` | Customization validation error | Track friction | Product ID, error type | Raw personalization text |
| `add_to_cart` | Add to cart | Track conversion | Product ID, variant ID, category, campaign/source | Raw personalization text |
| `view_cart` | Cart view | Track cart engagement | Cart value, item count | PII |
| `begin_checkout` | Checkout started | Track checkout funnel | Cart value, item count | PII |
| `payment_started` | Payment initiated | Track payment funnel | Order value, currency | Payment details |
| `payment_succeeded` | Payment success | Track conversion | Order value, currency, campaign/source | Payment details |
| `payment_failed` | Payment failure | Track friction | Error type | Payment details |
| `submit_service_enquiry` | Service enquiry submitted | Track enquiry conversion | Service ID | Raw brief text |
| `view_gifting` | Gifting page view | Track gifting engagement | Device class | PII |
| `view_workshop` | Workshop detail view | Track workshop interest | Workshop ID | PII |
| `register_workshop` | Workshop registration | Track workshop conversion | Workshop ID | PII |
| `join_waitlist` | Waitlist joined | Track waitlist demand | Workshop ID | PII |
| `approve_proof` | Proof approved | Track proof funnel | Order ID | Proof content |
| `request_revision` | Revision requested | Track proof friction | Order ID | Proof content |
| `campaign_view` | Campaign viewed | Track campaign reach | Campaign ID | PII |
| `coupon_applied` | Coupon applied | Track promotion usage | Campaign ID, discount type | PII |
| `coupon_failed` | Coupon failed | Track promotion friction | Campaign ID, error type | PII |
| `search` | Search performed | Track search behavior | Query length, result count | Raw query if PII |
| `newsletter_signup` | Newsletter signup | Track marketing opt-in | Source | PII |

Analytics should include: Product ID, Variant ID, Category, Campaign/source, Device class, Funnel metadata. **[SRC]**

Analytics should not include: Raw personalization text, Unnecessary customer PII, Private uploaded artwork. **[SRC]**

---

## 37. Non-Functional Requirements

| ID | Requirement | Target |
|----|-------------|--------|
| NFR-01 | Responsive from 360px mobile to desktop. | 360px, 390px, tablet, desktop |
| NFR-02 | Optimized for image-heavy visual content. | Image optimization |
| NFR-03 | Usable on mid-range mobile networks. | Performance budget |
| NFR-04 | LCP below 2.5 seconds on representative mobile profile. | LCP < 2.5s |
| NFR-05 | Secure in transit and at rest. | TLS, encryption |
| NFR-06 | Idempotent for cart/payment operations. | Idempotency keys |
| NFR-07 | Auditable for sensitive operator changes. | Audit logs |
| NFR-08 | Backed up daily. | Daily backup |
| NFR-09 | Restorable through tested recovery procedures. | Tested restore |
| NFR-10 | Monitored for checkout errors. | Monitoring |
| NFR-11 | Monitored for payment failures. | Monitoring |
| NFR-12 | Monitored for form delivery failures. | Monitoring |
| NFR-13 | Monitored for broken links and critical routes. | Monitoring |

---

## 38. Integrations

Document known/possible integrations separately. **[SRC]**

| Integration | Status | Notes |
|-------------|--------|-------|
| Payment provider | Razorpay currently referenced — **subject to confirmation** | Do not assume finalized |
| Shipping/tracking | TBD | Carrier/tracking integration not finalized |
| Email | TBD | Email tool not finalized |
| WhatsApp | TBD — if approved | Not finalized |
| Analytics | TBD | Tool not finalized |
| Storage/media | TBD | Not finalized |
| CRM | TBD — if selected | Not finalized |

**Rule:** Do NOT assume an integration is finalized when the source says it is still under decision. **[SRC]**

---

## 39. MVP Scope

### P0 — Launch Blockers **[SRC]**

- P0-01 Canonical Content Inventory (reconcile products: keep, merge, revise, retire, future).
- P0-02 Policy and Operational Approval (shipping, cancellation, refunds, privacy, terms, personalization, workshop policies).
- P0-03 CMS and Page Templates (products, services, workshops, blog, gallery, policies, FAQ).
- P0-04 Product Listing.
- P0-05 Product Detail.
- P0-06 Variants and Packs.
- P0-07 Product Customization (paper color, ink color, font style, custom text, envelope where applicable, compatibility rules, validation, pricing, preview where applicable).
- P0-08 Cart Persistence.
- P0-09 Shipping Rules.
- P0-10 Checkout and Payment.
- P0-11 Order Confirmation.
- P0-12 Campaign/Promotion Foundation (CRUD, discount types, coupon codes, scheduling, eligibility, usage limits, image upload, activation/deactivation).

### P1 — MVP **[SRC]**

- P1-13 Customer order status.
- P1-14 Service directory/detail pages.
- P1-15 Structured service enquiry.
- P1-16 Enquiry pipeline.
- P1-17 Proof/revision workflow.
- P1-18 Gifting page and dynamic gifting collections.
- P1-19 Corporate/bulk gifting enquiry.
- P1-20 Blog.
- P1-21 Integrated Gallery section.
- P1-22 Reviews/testimonials.
- P1-23 SEO and analytics.
- P1-24 Accessibility and responsive QA.

### P2 — Post-MVP Growth **[SRC]**

- P2-25 Workshop listing/detail/registration/waitlist.
- P2-26 Workshop reminders/cancellation handling.
- P2-27 Portfolio/Gallery enhancements.
- P2-28 Abandoned-cart and enquiry follow-up.
- P2-29 Advanced campaign analytics.
- P2-30 Customer account enhancements.

### P3 — Later **[SRC]**

- International shipping.
- Advanced customer segmentation.
- Advanced marketing automation.
- Advanced CRM integration.
- Additional commerce integrations.

**Rule:** Do not move features between phases unless there is a strong reason; if you recommend a change, put it in an "Architecture/Product Recommendation" section rather than silently changing scope. **[SRC]**

---

## 40. Release Phases

### Phase 0 — Content and Policy Readiness **[SRC]**

Complete: canonical catalogue, approved images and alt text, prices, variants, customization matrices, shipping rules, legal review, service definitions, workshop definitions, ownership, operational SLAs.

### Phase 1 — Trustworthy Storefront MVP **[SRC]**

Build: Homepage, Shop, Product pages, Product customization, Gifting, Cart, Checkout, Payment, Confirmation, Policies, Contact, Analytics, Catalogue admin, Campaign foundation.

### Phase 2 — Bespoke Work and Operations **[SRC]**

Build: Service pages, Structured enquiries, Enquiry pipeline, Proof approval, Attachments, Quotes/invoices, Order status, Customer communication.

### Phase 3 — Workshops and Content Growth **[SRC]**

Build: Workshop booking, Waitlist, Workshop reminders, Blog, Integrated Gallery, Reviews, Enhanced campaigns, Abandoned-cart recovery.

---

## 41. Acceptance Criteria

Every major feature must have testable acceptance criteria. Use Given/When/Then where useful.

### 41.1 Customization

- **Given** a product has dark paper selected, **When** the customer opens ink options, **Then** incompatible dark inks must not be selectable. **[SRC]**
- **Given** a customer has configured personalization, **When** they refresh the page, **Then** the exact configuration must be preserved. **[SRC]**
- **Given** a customer has added a personalized item to cart, **When** they change quantity, **Then** personalization must be preserved. **[SRC]**
- **Given** a customer has completed payment, **When** the order is created, **Then** the exact personalization payload must be attached to the order line. **[SRC]**
- **Given** a product requires proof approval, **When** the order is paid, **Then** production must be blocked until proof is approved. **[SRC]**

### 41.2 Campaigns

- **Given** a campaign has reached its usage limit, **When** a customer attempts to apply the coupon, **Then** the promotion must not be applied and the customer must receive a clear error. **[SRC]**
- **Given** a campaign is not yet active, **When** a customer attempts to apply the coupon, **Then** the promotion must not be applied. **[SRC]**
- **Given** a cart does not meet the minimum order value, **When** a customer attempts to apply the coupon, **Then** the promotion must not be applied. **[SRC]**
- **Given** a customer has reached their per-customer limit, **When** they attempt to apply the coupon, **Then** the promotion must not be applied. **[SRC]**
- **Given** a promotion is valid, **When** applied, **Then** the backend must validate eligibility and calculate the discount. **[SRC]**

### 41.3 Checkout and Payment

- **Given** a customer completes checkout, **When** payment succeeds, **Then** an order must be created exactly once. **[SRC]**
- **Given** a duplicate payment callback is received, **When** processed, **Then** no duplicate order must be created. **[SRC]**
- **Given** payment fails, **When** the customer retries, **Then** cart and customization must be preserved. **[SRC]**
- **Given** a customer refreshes checkout, **When** the page reloads, **Then** cart, customization, and entered data must be preserved where possible. **[SRC]**

### 41.4 Workshops

- **Given** a workshop has 1 seat remaining, **When** two customers attempt to register simultaneously, **Then** only one registration must succeed. **[SRC]**
- **Given** a workshop is sold out, **When** a customer views it, **Then** registration must be disabled and waitlist CTA shown if enabled. **[SRC]**
- **Given** a workshop is cancelled, **When** registrants are notified, **Then** refund must be processed per policy. **[SRC]**

### 41.5 Gifting

- **Given** a gifting occasion is configured in backend, **When** the gifting page loads, **Then** the occasion must appear dynamically. **[SRC]**
- **Given** a corporate/bulk enquiry is submitted, **When** validated, **Then** it must include quantity, budget, delivery date, and branding requirements. **[SRC]**

### 41.6 Blog and Gallery

- **Given** a user visits the Blog page, **When** the page loads, **Then** blog content must appear first and Gallery section must appear below it. **[SRC]**
- **Given** Gallery is not a separate top-level page, **When** navigation is rendered, **Then** no Gallery primary nav item must exist. **[SRC]**

### 41.7 Services

- **Given** a customer submits a service enquiry, **When** validated, **Then** it must contain service-specific fields and produce an enquiry ID. **[SRC]**
- **Given** an enquiry is submitted, **When** confirmed, **Then** the customer must receive expected response time and next step. **[SRC]**

---

## 42. Definition of Ready

Engineering estimation should begin only after: **[SRC]**

- Canonical product catalogue is approved.
- Product names/prices/variants/dimensions/pack counts are final.
- Customization schemas are defined by product family.
- Paper/ink compatibility rules are defined.
- Proof/revision rules are approved.
- Campaign rules are defined.
- Shipping/tax/cancellation/refund policies are confirmed.
- Payment gateway and methods are selected.
- Order/enquiry system of record is selected.
- Service owners and SLAs are named.
- Workshop scope is decided.
- Gifting content/collections are defined.
- Blog/Gallery content ownership is defined.
- Customer communication channels are approved.
- Legal/privacy review is complete.

---

## 43. Definition of Done

The MVP is complete when: **[SRC]**

1. A synthetic personalized order can be created in staging.
2. Product customization works end-to-end.
3. Paper/ink compatibility is correctly enforced.
4. Campaign/discount rules work correctly.
5. Payment can be completed using a test payment method.
6. Payment callbacks are verified and idempotent.
7. Order appears in the operator view.
8. Exact personalization survives from product page to order.
9. Proof approval blocks production when required.
10. Customer confirmation is generated correctly.
11. Service enquiries contain enough information to act/quote.
12. Gifting journey works.
13. Primary routes are complete.
14. Blog and integrated Gallery work correctly.
15. Workshop flow works if included in the MVP release.
16. Mobile and keyboard flows pass.
17. Accessibility and privacy checks pass.
18. Monitoring and recovery procedures exist.
19. Owner can update products, customization, campaigns, gifting, workshops, blog, and content without developer intervention.

---

## 44. Launch Checklist

### Content and Navigation **[SRC]**

- All primary navigation destinations are complete.
- No placeholder/demo content.
- Product information is canonical.
- All images have appropriate alt text.
- Blog content works.
- Gallery appears correctly below Blog content.
- Gifting page works.
- Workshop page works.
- Service pages work.
- Metadata/canonical URLs/social previews are present.

### Product and Customization **[SRC]**

- Every customizable product has an approved customization schema.
- Paper options work.
- Ink options work.
- Paper/ink compatibility works.
- Font options work.
- Custom text validation works.
- Envelope customization works where applicable.
- Pricing updates correctly.
- Customization survives refresh/cart/checkout.
- Exact customization appears in the order.
- Proof workflow works.
- Production is blocked when required approval is missing.

### Campaigns **[SRC]**

- Campaign CRUD works.
- Discount types work.
- Coupon codes work.
- Auto-apply works where enabled.
- Usage limits work.
- Per-customer limits work.
- Minimum order values work.
- Maximum discount works.
- Product/category targeting works.
- Start/end dates work.
- Campaign status works.
- Duplicate/conflicting campaigns are handled.
- Backend validates every promotion.

### Gifting **[SRC]**

- Curated collections load dynamically.
- Occasion sections work.
- Product links are correct.
- Corporate/bulk enquiry works.
- Catalogue download works where enabled.
- Testimonials display correctly.

### Workshops **[SRC]**

- Workshop details are complete.
- Dates/time zones are correct.
- Capacity works.
- No overbooking.
- Registration works.
- Waitlist works.
- Confirmation works.
- Cancellation/refund behavior works.
- Private/corporate enquiry works.

### Checkout and Payment **[SRC]**

- Guest checkout works.
- Prices, discounts, shipping, tax and totals are correct.
- Payment success/failure/timeout/retry work.
- Duplicate callbacks do not create duplicate orders.
- Confirmation occurs only after verified payment.

### Accessibility and Responsive Behavior **[SRC]**

- 360px, 390px, tablet and desktop layouts work.
- Keyboard navigation works.
- Focus states remain visible.
- Forms have accessible labels/errors.
- Contrast is acceptable.
- Reduced-motion preference is respected.

### Security, Privacy and Operations **[SRC]**

- Customer/customization data is protected.
- Uploads are scanned and access-controlled.
- Operator permissions are restricted.
- Sensitive actions are logged.
- Consent/unsubscribe works.
- Backups and restore are tested.
- Monitoring exists for payment, checkout and form failures.

---

## 45. Success Metrics

Use source success metrics. **[SRC]**

- Conversion rate for personalized products.
- Gifting discovery-to-purchase conversion.
- Bespoke enquiry completeness rate.
- Workshop discovery-to-registration conversion.
- Reduction in personalization errors.
- Reduction in checkout abandonment.
- Personalization persistence accuracy (zero loss).
- Operator no-code management capability.
- Accessibility compliance (WCAG 2.2 AA practices).
- LCP < 2.5s on mobile.
- Analytics event coverage.
- MVP delivery against P0/P1 scope.

Baselines TBD where not defined in source.

---

## 46. Open Decisions / TBD

| ID | Decision | Why Required | Owner | Status | Deadline |
|----|----------|--------------|-------|--------|----------|
| TBD-01 | Which revenue path is priority for next 6–12 months? | Business prioritization | Owner | Open | TBD |
| TBD-02 | Which services are active, paused, or invitation-only? | Service scope | Owner | Open | TBD |
| TBD-03 | What geography and language are supported? | Shipping/content | Owner | Open | TBD |
| TBD-04 | What support hours apply? | Operations | Owner | Open | TBD |
| TBD-05 | Which existing products are active? | Catalogue | Owner | Open | TBD |
| TBD-06 | Which products should be retired or merged? | Catalogue | Owner | Open | TBD |
| TBD-07 | Are bundles variants or separate products? | Catalogue model | Owner | Open | TBD |
| TBD-08 | What are canonical product names? | Catalogue | Owner | Open | TBD |
| TBD-09 | What fields are required for each product? | Catalogue | Owner | Open | TBD |
| TBD-10 | What are the character limits? | Customization | Owner | Open | TBD |
| TBD-11 | Are special symbols and line breaks allowed? | Customization | Owner | Open | TBD |
| TBD-12 | Who is responsible for spelling errors? | Policy | Owner/Legal | Open | TBD |
| TBD-13 | Which products require proof? | Proof workflow | Owner | Open | TBD |
| TBD-14 | Can customers upload artwork? | Customization | Owner | Open | TBD |
| TBD-15 | How many revisions are allowed? | Proof workflow | Owner | Open | TBD |
| TBD-16 | What happens when a customer does not respond? | Proof workflow | Owner | Open | TBD |
| TBD-17 | What is production capacity per product family? | Operations | Owner | Open | TBD |
| TBD-18 | Which products support paper/ink customization? | Customization | Owner | Open | TBD |
| TBD-19 | Which products support envelope customization? | Customization | Owner | Open | TBD |
| TBD-20 | Which customization options affect price? | Pricing | Owner | Open | TBD |
| TBD-21 | Are current prices correct? | Pricing | Owner | Open | TBD |
| TBD-22 | Is the ₹2,499 shipping threshold correct? | Shipping | Owner | Open | TBD |
| TBD-23 | Are taxes included? | Tax | Owner | Open | TBD |
| TBD-24 | Are GST invoices required? | Tax | Owner | Open | TBD |
| TBD-25 | Is Razorpay approved? | Payment | Owner | Open | TBD |
| TBD-26 | Which payment methods are enabled? | Payment | Owner | Open | TBD |
| TBD-27 | Which carrier/tracking integration will be used? | Shipping | Owner | Open | TBD |
| TBD-28 | Which campaign discount types should be active at launch? | Campaigns | Owner | Open | TBD |
| TBD-29 | Should campaigns stack? | Campaigns | Owner | Open | TBD |
| TBD-30 | What is the campaign priority rule? | Campaigns | Owner | Open | TBD |
| TBD-31 | Should auto-applied promotions be supported? | Campaigns | Owner | Open | TBD |
| TBD-32 | Which products/categories can be targeted by campaigns? | Campaigns | Owner | Open | TBD |
| TBD-33 | Do service enquiries create quotes, deposits, calendar bookings, or manual conversations? | Services | Owner | Open | TBD |
| TBD-34 | What is the response SLA? | Services | Owner | Open | TBD |
| TBD-35 | Which service fields are mandatory? | Services | Owner | Open | TBD |
| TBD-36 | What attachment types/file sizes are allowed? | Services | Owner | Open | TBD |
| TBD-37 | Who owns service enquiries? | Services | Owner | Open | TBD |
| TBD-38 | Are workshops paid online or externally? | Workshops | Owner | Open | TBD |
| TBD-39 | What are workshop cancellation, transfer, refund and waitlist rules? | Workshops | Owner | Open | TBD |
| TBD-40 | What workshop capacity rules apply? | Workshops | Owner | Open | TBD |
| TBD-41 | Which gifting occasions launch initially? | Gifting | Owner | Open | TBD |
| TBD-42 | Which gifting collections are active? | Gifting | Owner | Open | TBD |
| TBD-43 | Is corporate catalogue download required? | Gifting | Owner | Open | TBD |
| TBD-44 | Who manages gifting content? | Content | Owner | Open | TBD |
| TBD-45 | Who manages Blog content? | Content | Owner | Open | TBD |
| TBD-46 | Which Gallery items can be publicly displayed? | Gallery | Owner | Open | TBD |
| TBD-47 | Is client permission required before Gallery publication? | Gallery | Owner/Legal | Open | TBD |
| TBD-48 | Where do orders currently live? | Operations | Owner | Open | TBD |
| TBD-49 | Where do enquiries currently live? | Operations | Owner | Open | TBD |
| TBD-50 | Where do fulfilment updates live? | Operations | Owner | Open | TBD |
| TBD-51 | Which email, WhatsApp, CRM, shipping and payment tools are approved? | Integrations | Owner | Open | TBD |
| TBD-52 | Who owns catalogue updates? | Operations | Owner | Open | TBD |
| TBD-53 | Who owns proof approval? | Operations | Owner | Open | TBD |
| TBD-54 | Who owns support and refunds? | Operations | Owner | Open | TBD |
| TBD-55 | Who owns workshop operations? | Operations | Owner | Open | TBD |
| TBD-56 | Who owns policy publication? | Operations | Owner | Open | TBD |
| TBD-57 | How long are uploaded files retained? | Data retention | Owner/Legal | Open | TBD |
| TBD-58 | What customer-data deletion/access process is required? | Privacy | Owner/Legal | Open | TBD |

---

## 47. Risks and Dependencies

| ID | Risk | Impact | Probability | Mitigation | Owner |
|----|------|--------|-------------|------------|-------|
| R-01 | Canonical catalogue not approved | Blocks P0 | High | Owner decision workshop | Owner |
| R-02 | Policies not approved | Blocks launch | High | Legal review, owner approval | Owner/Legal |
| R-03 | Payment provider not confirmed | Blocks checkout | High | Confirm Razorpay or alternative | Owner |
| R-04 | Customization rules undefined | Blocks customization | High | Define per product family | Owner |
| R-05 | Paper/ink compatibility undefined | Blocks customization | High | Define compatibility matrix | Owner |
| R-06 | Proof/revision rules undefined | Blocks proof workflow | Medium | Define rules | Owner |
| R-07 | Campaign rules undefined | Blocks campaigns | Medium | Define rules | Owner |
| R-08 | Workshop scope undecided | Blocks workshops | Medium | Decide scope | Owner |
| R-09 | Gifting content undefined | Blocks gifting | Medium | Define collections/occasions | Owner |
| R-10 | Blog/Gallery ownership undefined | Blocks content | Medium | Assign ownership | Owner |
| R-11 | Integrations not finalized | Blocks operations | Medium | Select tools | Owner |
| R-12 | Data migration from existing site | Risk of data loss | Medium | Reconciliation plan | Owner |
| R-13 | Overbooking race condition | Customer dissatisfaction | Low | Atomic reservation | Engineering |
| R-14 | Payment callback duplication | Duplicate orders | Low | Idempotency keys | Engineering |
| R-15 | Personalization loss | Customer dissatisfaction | Low | Persistence tests | Engineering/QA |
| R-16 | Proof approval bypass | Production error | Low | Production blocking | Engineering |
| R-17 | Campaign base-price manipulation | Pricing errors | Low | Backend-only validation | Engineering |
| R-18 | Accessibility non-compliance | Legal/reputational | Medium | WCAG 2.2 AA QA | QA |
| R-19 | LCP target missed | SEO/UX | Medium | Performance budget | Engineering |
| R-20 | Upload security breach | Data loss | Low | File scanning, access control | Engineering |

---

## 48. Traceability Matrix

| Requirement | Source Section | Module | User Journey | Acceptance Criteria | Priority |
|-------------|---------------|--------|--------------|---------------------|----------|
| FR-001 | 7.1 Sitemap | Navigation | All | 41.6 | P0 |
| FR-002 | 7.3 | Shop | 30.1 | 41.1 | P0 |
| FR-003 | 9, 10 | Product Details | 30.1, 30.2 | 41.1 | P0 |
| FR-004 | 10, 11, 12 | Customization | 30.2 | 41.1 | P0 |
| FR-005 | 10, 11 | Customization | 30.2 | 41.1 | P0 |
| FR-006 | 12, 24 | Proof | 30.3 | 41.1 | P1 |
| FR-007 | 14, 19 | Campaigns | 30.10 | 41.2 | P0 |
| FR-008 | 21 | Pricing | 30.1 | 41.3 | P0 |
| FR-009 | 21, 22, 23 | Checkout | 30.1, 30.11 | 41.3 | P0 |
| FR-010 | 32 | Notifications | All | — | P1 |
| FR-011 | 15, 16 | Services | 30.6 | 41.7 | P1 |
| FR-012 | 17, 19 | Workshops | 30.8, 30.9 | 41.4 | P2 |
| FR-013 | 8, 13 | Gifting | 30.4, 30.5 | 41.5 | P1 |
| FR-014 | 25 | CMS | — | — | P0 |
| FR-015 | 33 | SEO | — | — | P1 |
| FR-016 | 34 | Accessibility | — | — | P1 |
| FR-017 | 35 | Privacy | — | — | P1 |

---

## 49. Engineering Handoff Summary

### Core Modules

1. Homepage.
2. Shop (listing, details, variants).
3. Product Customization (paper, ink, compatibility, font, text, envelope, preview, pricing, persistence, versioning).
4. Gifting.
5. Services + Structured Enquiries.
6. Workshops + Registration/Waitlist.
7. Blog + Integrated Gallery.
8. Campaigns/Promotions.
9. Cart.
10. Checkout.
11. Payment.
12. Orders.
13. Proof Approval.
14. Customer Account (optional).
15. CMS/Admin.
16. Policies.
17. Analytics.

### Major Dependencies

- Canonical catalogue approval.
- Policy approval.
- Customization rules definition.
- Paper/ink compatibility definition.
- Campaign rules definition.
- Payment provider confirmation.
- Integration selection.

### Critical Business Rules

- BR-002: Backend is source of truth for customization.
- BR-003: Paper/ink compatibility backend-controlled.
- BR-004: Customization persists through cart→checkout→order→production.
- BR-005: Historical order customization immutable.
- BR-009: No overbooking.
- BR-011: Gallery is not a separate page.
- BR-013: Campaigns do not manipulate base prices.
- BR-014: Promotion validation backend-controlled.
- BR-015: Idempotent payment callbacks.
- BR-017: Production blocked until proof approval.
- BR-022: Money as integer minor units.
- BR-024: Snapshot versions into orders.

### Important Data Entities

- Product, Product Variant, Customization Configuration, Personalization Schema, Campaign, Media Asset, Service, Service Enquiry, Workshop, Customer, Cart, Order, Order Line, Proof Version, Portfolio/Gallery Item, Policy.

### Critical Integrations

- Payment provider (Razorpay referenced — subject to confirmation).
- Shipping/tracking (TBD).
- Email (TBD).
- WhatsApp (TBD — if approved).
- Analytics (TBD).
- Storage/media (TBD).
- CRM (TBD — if selected).

### P0 Blockers

- P0-01 Canonical Content Inventory.
- P0-02 Policy and Operational Approval.
- P0-03 CMS and Page Templates.
- P0-04 Product Listing.
- P0-05 Product Detail.
- P0-06 Variants and Packs.
- P0-07 Product Customization.
- P0-08 Cart Persistence.
- P0-09 Shipping Rules.
- P0-10 Checkout and Payment.
- P0-11 Order Confirmation.
- P0-12 Campaign/Promotion Foundation.

### Open Decisions

See Section 46 — 58 open decisions requiring owner input before engineering estimation.

### Recommended Implementation Sequence **[SRC]**

1. Run the owner decision workshop.
2. Reconcile the canonical product catalogue.
3. Approve policies and fulfilment rules.
4. Define customization matrices by product family.
5. Define paper/ink compatibility rules.
6. Define campaign/promotion rules.
7. Choose system of record and integrations.
8. Finalize sitemap and content templates.
9. Implement catalogue/product pages.
10. Implement product customization.
11. Implement cart persistence.
12. Implement campaign/promotion integration.
13. Implement checkout, payment and confirmation.
14. Implement Gifting.
15. Implement service enquiries and operator pipeline.
16. Implement proofs and order status.
17. Implement Workshops.
18. Implement Blog and integrated Gallery.
19. Complete accessibility, SEO, analytics, security and mobile QA.
20. Perform staging transaction tests.
21. Launch only after the complete validation checklist passes.
22. Add advanced campaigns, automation, CRM, international shipping and other growth capabilities later.

---

## Document Summary

This PRD converts "The Letter Ink — Complete Summary" into an implementation-ready product specification. It preserves the finalized sitemap (including the rule that Gallery is a section within Blog, not a separate page), the first-class product customization system with backend-controlled paper/ink compatibility, the dedicated Gifting and Workshops pages, structured service enquiries, the production-ready campaign/promotion system, and the full cart/checkout/payment/order/proof workflow. All unresolved decisions remain explicitly marked as TBD. No unnecessary features have been invented. Existing-site observations are distinguished from approved requirements. Industry-standard recommendations are clearly marked where used.

**Status:** Draft — Pending Owner Approval.

---

## Open Decisions

See Section 46 — 58 open decisions. No unresolved question has been answered in this PRD.

---

## P0/P1/P2/P3 Scope

- **P0 — Launch Blockers:** P0-01 through P0-12.
- **P1 — MVP:** P1-13 through P1-24.
- **P2 — Post-MVP Growth:** P2-25 through P2-30.
- **P3 — Later:** International shipping, advanced segmentation, advanced marketing automation, advanced CRM, additional commerce integrations.

---

## Definition of Ready

See Section 42.

---

## Definition of Done

See Section 43.

---

## Engineering Handoff Summary

See Section 49.

---

## Traceability Matrix

See Section 48.

---

*End of PRD*