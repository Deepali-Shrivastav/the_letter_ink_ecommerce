For **The Letter Ink**, I would treat “Campaign” as a **promotion-management system**, not simply a discount-code table.

In an industry-standard ecommerce system, a campaign is the business layer that defines **what promotion exists, who can receive it, when it is active, what products/orders it applies to, what conditions must be satisfied, what benefit is given, whether it can combine with other promotions, and how usage is tracked**.

Modern ecommerce platforms generally separate automatic discounts, code-based discounts, product/order/shipping discount scopes, eligibility conditions, and combination/stacking rules. Shopify, for example, supports automatic and code discounts and product, order, and shipping discount classes. ([Shopify][1])

---

# 1. What exactly is a Campaign?

Think of the system as:

```text
CAMPAIGN
   │
   ├── Campaign Information
   ├── Schedule
   ├── Audience / Eligibility
   ├── Conditions
   ├── Benefits / Discount
   ├── Product Scope
   ├── Coupon / Code
   ├── Usage Limits
   ├── Combination Rules
   ├── Priority
   ├── Messaging
   └── Analytics
```

Example:

### Campaign

**Name:** Diwali Gifting 2026

```text
Campaign Type:
Seasonal Promotion

Status:
Scheduled

Start:
15 Oct 2026 00:00

End:
31 Oct 2026 23:59

Eligibility:
All customers

Products:
Selected Hampers

Condition:
Cart subtotal >= ₹2,000

Benefit:
10% OFF

Maximum Discount:
₹500

Coupon:
DIWALI10

Usage:
1 per customer

Combination:
Cannot combine with another order discount
```

That is much more powerful than:

```text
coupon_code = "DIWALI10"
discount = 10%
```

---

# 2. Campaign vs Coupon vs Discount

This distinction is extremely important.

They should **not** be the same database object.

### Campaign

The business promotion.

> “Run a Diwali promotion from Oct 15–31.”

### Discount

The actual financial benefit.

> “10% off up to ₹500.”

### Coupon / Promotion Code

The mechanism through which the customer activates it.

> `DIWALI10`

### Eligibility Rule

Determines whether the customer/cart qualifies.

> Cart subtotal ≥ ₹2,000.

### Campaign Target

Determines what the campaign applies to.

> Selected hampers.

### Usage

Determines how many times it can be redeemed.

> One use per customer.

A good architecture therefore looks like:

```text
Campaign
   │
   ├── Promotion Rule
   │
   ├── Eligibility Rules
   │
   ├── Targets
   │
   ├── Discount
   │
   ├── Coupon Codes
   │
   ├── Usage Limits
   │
   └── Analytics
```

---

# 3. Campaign lifecycle

A campaign should have explicit states.

```text
DRAFT
   ↓
SCHEDULED
   ↓
ACTIVE
   ↓
PAUSED
   ↓
ACTIVE
   ↓
EXPIRED
```

Potential states:

```text
DRAFT
SCHEDULED
ACTIVE
PAUSED
EXPIRED
ARCHIVED
CANCELLED
```

### Example

```text
DRAFT
```

Admin is configuring the campaign.

↓

```text
SCHEDULED
```

Campaign is saved with:

```text
Start = 15 Oct
End   = 31 Oct
```

↓

At start time:

```text
ACTIVE
```

↓

Admin can temporarily:

```text
PAUSE
```

↓

Campaign can be resumed:

```text
ACTIVE
```

↓

At end time:

```text
EXPIRED
```

Expired campaigns should normally become immutable or have restricted editing.

---

# 4. Campaign types

Your system should support multiple promotion types.

## A. Percentage discount

```text
10% OFF
```

Example:

```text
₹2,000
10% discount
= ₹200
```

---

## B. Fixed amount discount

```text
₹300 OFF
```

Example:

```text
₹2,000
- ₹300
= ₹1,700
```

---

## C. Free shipping

```text
FREE SHIPPING
```

Can have conditions:

```text
Cart >= ₹1,500
```

or:

```text
Selected PIN codes
```

or:

```text
Selected shipping method
```

Industry systems commonly treat shipping discounts as a separate discount scope from product/order discounts. ([Shopify][2])

---

# 5. Product-level discount

Example:

```text
Selected Hampers
↓
20% OFF
```

Only eligible products receive the discount.

Suppose cart:

```text
Hamper A     ₹1,000
Hamper B     ₹800
Notebook     ₹500
```

Campaign applies only to:

```text
Hamper A
Hamper B
```

Then:

```text
₹1,800 × 20%
= ₹360 discount
```

Notebook remains unaffected.

---

# 6. Order-level discount

Entire eligible order gets discounted.

Example:

```text
₹2,000+ order
↓
10% OFF
```

Cart:

```text
Hamper       ₹1,500
Notebook       ₹500
-------------------
Subtotal     ₹2,000

Discount       ₹200
-------------------
Total         ₹1,800
```

---

# 7. Buy X Get Y

Very common ecommerce promotion.

Example:

```text
BUY 2 NOTEBOOKS
GET 1 NOTEBOOK FREE
```

Or:

```text
BUY ₹2,000
GET ₹500 OFF
```

Or:

```text
BUY 2
GET 20% OFF
```

This should be represented as a rule rather than hardcoded campaign logic.

---

# 8. Spend X Get Y

Example:

```text
Spend ₹2,000
↓
Get ₹300 OFF
```

Configuration:

```text
minimum_subtotal = 2000
discount_type = FIXED
discount_value = 300
```

Another:

```text
Spend ₹3,000
↓
Get 15% OFF
```

---

# 9. Tiered campaigns

This is something I strongly recommend supporting.

Example:

| Cart Value | Discount |
| ---------: | -------: |
|     ₹1,000 |       5% |
|     ₹2,000 |      10% |
|     ₹3,000 |      15% |
|     ₹5,000 |      20% |

The promotion engine evaluates the cart and selects the applicable tier.

Example:

```text
Cart = ₹3,400

Applicable tier:
₹3,000 → 15%

Discount:
₹510
```

---

# 10. First-order campaign

Example:

```text
WELCOME10
```

Rule:

```text
Customer must have zero previous completed orders.
```

Important:

**Do not determine this only from frontend state.**

Backend must validate it.

---

# 11. New customer campaign

Similar but potentially different from first-order.

Eligibility could be:

```text
customer.created_at >= campaign.start
```

or whatever business definition you establish.

---

# 12. Customer-specific campaigns

Example:

```text
Customer:
Deepali

Campaign:
VIP20

Discount:
20%
```

Useful for:

* VIP customers
* Customer recovery
* Compensation
* Loyalty programs
* Manual support discounts

---

# 13. Customer-group campaigns

For example:

```text
VIP
Wholesale
Corporate
Returning Customers
New Customers
```

Campaign:

```text
VIP
↓
15% OFF
```

---

# 14. Product targeting

Campaign should be able to target:

### Specific products

```text
Product A
Product B
Product C
```

### Product categories/collections

```text
Hampers
Wedding Collection
Diwali Collection
```

### Product tags

```text
premium
festive
new-arrival
```

### Product variants

If your architecture supports variants:

```text
Product
  ├── Variant A
  ├── Variant B
  └── Variant C
```

Campaign could target specific variants.

---

# 15. Exclusions

This is often missed in basic implementations.

You need:

```text
Included Products
+
Excluded Products
```

Example:

```text
20% OFF all Hampers

EXCLUDE:
Premium Hamper
Limited Edition Hamper
```

So even if the product belongs to the eligible collection:

```text
Eligible? 
→ Collection = YES
→ Excluded product = YES
→ FINAL = NO
```

---

# 16. Minimum order value

Example:

```text
10% OFF
Minimum cart:
₹1,500
```

Cart:

```text
₹1,200
```

→ Not eligible.

Cart:

```text
₹1,800
```

→ Eligible.

---

# 17. Maximum discount amount

Very important for percentage promotions.

Example:

```text
20% OFF
Maximum discount = ₹500
```

Cart:

```text
₹5,000
```

20% = ₹1,000

But:

```text
Maximum = ₹500
```

Final discount:

```text
₹500
```

Without this, percentage campaigns can become financially dangerous.

---

# 18. Minimum quantity

Example:

```text
Buy minimum 3 products
Get 15% OFF
```

Rule:

```text
minimum_quantity = 3
```

---

# 19. Customer eligibility

Campaigns can have:

```text
All customers
New customers
Existing customers
Specific customers
Customer groups
```

Potential future:

```text
Loyalty tier
VIP tier
Corporate account
```

---

# 20. Geographic eligibility

For an Indian ecommerce store, this can become useful.

Campaign can target:

```text
Country
State
City
PIN code
Shipping zone
```

Example:

```text
FREE SHIPPING

Eligible:
Maharashtra
```

Or:

```text
Delhi PIN codes
```

This should be backend-driven.

---

# 21. Time-based conditions

Campaign can have:

```text
Start date
End date
Start time
End time
Timezone
```

For example:

```text
Flash Sale

18:00 – 21:00
```

The backend should be the source of truth for campaign activation.

Never rely solely on:

```javascript
if (new Date() > startDate)
```

in the frontend.

---

# 22. Coupon-based campaign

There are two different experiences.

### Automatic

Customer doesn't enter anything.

```text
Cart
 ↓
Eligibility checked
 ↓
Discount automatically applied
```

### Code-based

Customer enters:

```text
DIWALI10
```

Backend validates:

```text
Does code exist?
Is active?
Is campaign active?
Is customer eligible?
Is usage available?
Does cart qualify?
Can it combine?
```

Only then:

```text
APPLY
```

Modern ecommerce platforms explicitly support both automatic and code-based discounts. ([Shopify][1])

---

# 23. Campaign code generation

You may eventually need:

```text
DIWALI10
WELCOME10
FIRSTORDER
VIP20
```

But also bulk/generated codes:

```text
TL-8FJ29A
TL-7KDK82
TL-92KDLA
```

Useful for:

* Influencers
* Corporate customers
* Marketing campaigns
* Email campaigns
* Customer-specific offers

---

# 24. Coupon usage limits

Campaign:

```text
Maximum total uses = 1,000
```

After 1,000 successful redemptions:

```text
EXHAUSTED
```

---

# 25. Per-customer usage limit

Example:

```text
Campaign:
WELCOME10

Total usage:
10,000

Per customer:
1
```

Customer tries again:

```text
WELCOME10
```

Backend:

```text
REJECT
Reason:
Usage limit reached for this customer.
```

---

# 26. Per-order usage

Usually one campaign should only be applied once to a single order.

But the architecture should explicitly model this.

---

# 27. Campaign stacking / combination

This is one of the **most important pieces**.

Suppose:

```text
Campaign A
10% OFF

Campaign B
₹300 OFF

Campaign C
FREE SHIPPING
```

Can all three apply?

You need a policy.

Possible:

```text
A + B = NO
A + C = YES
B + C = YES
```

Modern ecommerce systems explicitly model whether discounts can combine across product, order, and shipping discount classes. ([Shopify][3])

---

# 28. Discount priority

Suppose:

```text
Campaign A = 10%
Campaign B = 20%
```

Both are eligible.

You need a deterministic strategy.

Possible rules:

```text
HIGHEST_VALUE
FIRST_MATCH
PRIORITY
EXCLUSIVE
STACK
```

For example:

```text
A priority = 10
B priority = 20
```

The engine can select according to configured rules.

**Do not let frontend decide this.**

---

# 29. Discount calculation engine

This should be a separate backend service/module.

Conceptually:

```text
Cart
 ↓
Campaign Discovery
 ↓
Eligibility Evaluation
 ↓
Target Evaluation
 ↓
Discount Calculation
 ↓
Combination Resolution
 ↓
Discount Allocation
 ↓
Final Cart
```

For example:

```text
Cart subtotal = ₹3,000

Campaign A
10% off
Eligible = YES
Discount = ₹300

Campaign B
₹500 off
Eligible = YES
Discount = ₹500

Combination:
NOT ALLOWED

Selected:
₹500
```

---

# 30. Never trust frontend discount calculations

Frontend can display:

```text
You save ₹500
```

But backend must calculate the final amount.

The checkout API should effectively say:

```text
Here is the cart.

Calculate applicable promotions.

Return authoritative totals.
```

This prevents manipulation.

---

# 31. Campaign evaluation architecture

A clean architecture:

```text
                    ┌───────────────┐
                    │    Campaign   │
                    │    Manager    │
                    └───────┬───────┘
                            │
                            ▼
                  ┌───────────────────┐
                  │ Campaign Engine   │
                  └─────────┬─────────┘
                            │
             ┌──────────────┼───────────────┐
             ▼              ▼               ▼
       Eligibility       Targeting       Discount
         Engine           Engine          Engine
             │              │               │
             └──────────────┼───────────────┘
                            ▼
                  ┌───────────────────┐
                  │ Combination Engine│
                  └─────────┬─────────┘
                            ▼
                  ┌───────────────────┐
                  │ Final Cart Total  │
                  └───────────────────┘
```

---

# 32. Recommended backend entities

At a conceptual level, I'd separate these.

```text
Campaign
CampaignCondition
CampaignTarget
CampaignBenefit
CampaignCoupon
CampaignCustomerEligibility
CampaignUsage
CampaignRedemption
CampaignCombinationRule
CampaignSchedule
```

Depending on your existing Medusa architecture, some of these can be combined or represented through existing promotion structures rather than creating unnecessary tables.

That distinction should be decided **after inspecting your actual backend**.

---

# 33. Campaign entity

Something conceptually like:

```text
Campaign

id
name
description
status
campaign_type
starts_at
ends_at
timezone

priority

is_automatic
requires_coupon

usage_limit
usage_limit_per_customer

created_at
updated_at
```

---

# 34. Benefit entity

Instead of hardcoding:

```text
discount_percentage
```

you can model:

```text
Benefit

type:
PERCENTAGE
FIXED_AMOUNT
FREE_SHIPPING
BUY_X_GET_Y
SPEND_X_GET_Y

value
currency
maximum_discount
```

This allows future expansion.

---

# 35. Conditions

A flexible rule structure could support:

```text
MIN_CART_VALUE
MIN_QUANTITY
PRODUCT
CATEGORY
COLLECTION
CUSTOMER_GROUP
CUSTOMER
COUNTRY
STATE
PINCODE
FIRST_ORDER
NEW_CUSTOMER
DATE_RANGE
```

Potential future:

```text
PAYMENT_METHOD
SHIPPING_METHOD
DEVICE
MARKETING_SOURCE
```

But don't implement everything immediately.

---

# 36. AND / OR conditions

Another feature often missed.

Example:

```text
Cart >= ₹2,000
AND
Customer = New
```

Or:

```text
Customer = VIP
OR
Customer = Corporate
```

Therefore, eventually you want a rule structure capable of:

```text
AND
 ├── condition
 ├── condition

OR
 ├── condition
 └── condition
```

This is much more scalable than having columns such as:

```text
minimum_amount
minimum_quantity
customer_type
```

everywhere.

---

# 37. Campaign targeting

Example:

```text
TARGET

Collections:
Hampers

Products:
Product A
Product B

Excluded:
Premium Hamper
```

The engine determines:

```text
Eligible line items
```

before calculating the discount.

---

# 38. Campaign application workflow

The complete flow should look like:

```text
Customer opens product
        ↓
Adds product to cart
        ↓
Cart recalculated
        ↓
Campaign engine triggered
        ↓
Find active campaigns
        ↓
Check campaign schedule
        ↓
Check customer eligibility
        ↓
Check product eligibility
        ↓
Check cart conditions
        ↓
Calculate discounts
        ↓
Resolve conflicts
        ↓
Apply discount
        ↓
Return updated cart
```

---

# 39. Coupon application workflow

When customer enters:

```text
DIWALI10
```

Frontend sends:

```text
POST /cart/.../promotions
```

or whatever API structure your actual ecommerce backend uses.

Backend:

```text
Find campaign
      ↓
Code valid?
      ↓
Campaign active?
      ↓
Customer eligible?
      ↓
Usage available?
      ↓
Cart eligible?
      ↓
Products eligible?
      ↓
Combination allowed?
      ↓
Calculate discount
      ↓
Apply
```

Response:

```json
{
  "success": true,
  "code": "DIWALI10",
  "discount": 300,
  "message": "10% discount applied"
}
```

---

# 40. Invalid coupon behavior

Do not return generic:

```text
Invalid coupon
```

if you can safely provide a useful reason.

Possible reasons:

```text
COUPON_NOT_FOUND

CAMPAIGN_NOT_ACTIVE

CAMPAIGN_EXPIRED

MINIMUM_CART_VALUE_NOT_MET

CUSTOMER_NOT_ELIGIBLE

PRODUCT_NOT_ELIGIBLE

USAGE_LIMIT_REACHED

CUSTOMER_USAGE_LIMIT_REACHED

COUPON_ALREADY_USED

COUPON_NOT_COMBINABLE

REGION_NOT_ELIGIBLE
```

This gives the frontend predictable behavior.

---

# 41. Cart representation

The cart should show something like:

```text
Subtotal                  ₹3,000

Diwali 10% OFF            -₹300

Shipping                   ₹100

--------------------------------

Total                     ₹2,800
```

And potentially:

```text
✓ DIWALI10 applied
```

---

# 42. Discount allocation

For product-level discounts, don't simply store:

```text
cart.discount = ₹300
```

You should know **where that ₹300 came from**.

Example:

```text
Product A
₹1,000
Discount ₹100

Product B
₹2,000
Discount ₹200
```

This matters for:

* Returns
* Refunds
* Tax
* Analytics
* Order history
* Partial cancellations

Modern ecommerce systems explicitly represent discount allocations at line/cart/order levels. ([Shopify][4])

---

# 43. Order snapshot

When the order is placed, don't depend on the campaign remaining unchanged.

The order should preserve the promotion information used at purchase.

Example:

```text
Order
 ├── Campaign ID
 ├── Campaign name
 ├── Coupon code
 ├── Discount type
 ├── Discount value
 ├── Discount amount
 ├── Applied conditions
 └── Discount allocations
```

Why?

Suppose tomorrow admin edits:

```text
DIWALI10
```

The previous order must still say:

```text
10% discount
₹300
```

not recalculate using the new campaign configuration.

---

# 44. Redemption records

Create a redemption/usage record after successful order completion.

Conceptually:

```text
CampaignRedemption

id
campaign_id
coupon_id
customer_id
order_id

discount_amount
currency

redeemed_at
```

This powers:

```text
How many times used?
Who used it?
Which orders?
Revenue generated?
```

---

# 45. Don't consume usage at coupon entry

Important.

Customer enters:

```text
WELCOME10
```

but doesn't purchase.

You should generally **not permanently consume the campaign usage** just because they entered the code.

Instead:

```text
Code validation
    ↓
Temporary/application state
    ↓
Order completed
    ↓
Redemption recorded
```

Otherwise abandoned carts can artificially exhaust campaigns.

---

# 46. Race conditions

Suppose:

```text
Campaign usage limit = 100
```

Customer 100 and 101 checkout simultaneously.

You need transactional protection so you don't end up with:

```text
101 redemptions
```

instead of:

```text
100
```

This is a backend/database concern.

---

# 47. Campaign caching

Campaign evaluation can become expensive.

You may eventually cache:

```text
Active campaigns
Campaign configuration
Coupon lookup
Product targeting
```

But cache invalidation must happen when:

```text
Campaign updated
Campaign activated
Campaign paused
Campaign expired
Target changed
Coupon changed
```

Don't prematurely optimize this before the actual architecture is understood.

---

# 48. Campaign admin panel

Your backend/admin system should eventually provide:

### Campaign list

```text
Campaign       Status      Start       End       Usage
-------------------------------------------------------
Diwali 2026    Scheduled   15 Oct      31 Oct   0/5000
Welcome 10     Active      —           —        832/∞
Summer Sale    Expired     —           —        420
```

---

# 49. Create campaign wizard

A professional admin UX could be:

### Step 1 — Basic Information

```text
Campaign Name
Description
Campaign Type
```

### Step 2 — Schedule

```text
Start date
Start time
End date
End time
Timezone
```

### Step 3 — Audience

```text
Everyone
New customers
Existing customers
Specific customers
Customer group
```

### Step 4 — Products

```text
All products
Collections
Products
Variants
Exclude products
```

### Step 5 — Conditions

```text
Minimum order value
Minimum quantity
Customer conditions
Geographic conditions
```

### Step 6 — Benefit

```text
10%
₹500
Free shipping
Buy X Get Y
```

### Step 7 — Coupon

```text
Automatic
Coupon code
Generate codes
```

### Step 8 — Usage

```text
Total limit
Per customer limit
```

### Step 9 — Combination

```text
Allow product discounts
Allow order discounts
Allow shipping discounts
```

### Step 10 — Review

```text
Campaign summary
```

Then:

```text
Save Draft
Schedule
Activate
```

---

# 50. Campaign dashboard

Later you can show:

```text
Campaign Performance

Views
Coupon uses
Orders
Conversion rate
Revenue
Discount given
Average order value
Customers acquired
```

Example:

```text
Campaign Revenue      ₹4,82,000

Orders                 312

Discount Cost          ₹48,200

Average Order Value    ₹1,545

Redemptions            287
```

---

# 51. Campaign analytics

Useful metrics:

### Operational

```text
Active campaigns
Expired campaigns
Scheduled campaigns
Coupon usage
```

### Financial

```text
Gross sales
Discount amount
Net sales
Average order value
```

### Customer

```text
New customers
Returning customers
Unique redeemers
Repeat purchases
```

### Campaign

```text
Redemption rate
Conversion rate
Revenue attributed
Discount cost
```

---

# 52. Campaign attribution

You should distinguish:

```text
Campaign viewed
Campaign clicked
Coupon entered
Coupon applied
Order completed
```

This lets you eventually understand:

```text
1000 customers saw campaign
↓
300 clicked
↓
180 entered coupon
↓
150 successfully applied
↓
120 purchased
```

---

# 53. Campaign banners vs Campaign engine

Another important distinction.

You might have a website banner:

> **Diwali Sale — Up to 20% Off**

That is a **marketing/content component**.

The actual campaign engine determines:

```text
Who qualifies?
What products?
How much discount?
When?
Usage?
```

Don't tightly couple your CMS/banner system to the discount calculation engine.

---

# 54. Campaign scheduling

A campaign should be schedulable:

```text
Now
Tomorrow
Specific date
Specific time
```

Example:

```text
Start:
2026-10-15 00:00 IST

End:
2026-10-31 23:59 IST
```

Always make timezone explicit.

For your India-based store:

```text
Asia/Kolkata
```

should be handled consistently.

---

# 55. Campaign pause

Suppose a promotion is causing unexpected losses.

Admin:

```text
PAUSE
```

Immediately:

```text
Campaign no longer applies
```

Existing completed orders remain unaffected.

---

# 56. Campaign editing rules

You need to decide what can be edited after activation.

For example:

### Safe:

```text
Description
Marketing title
Banner
```

### Potentially dangerous:

```text
Discount value
Eligibility
Usage limit
End date
```

Changing these can affect financial behavior.

A production system should maintain an audit trail.

---

# 57. Audit logs

Record:

```text
Who created campaign?
Who changed it?
What changed?
When?
Old value?
New value?
```

Example:

```text
Admin:
Deepali

Changed:
Discount

Old:
10%

New:
15%

Time:
2026-09-23 12:40 IST
```

This becomes very important for ecommerce operations.

---

# 58. Permissions

Campaign management should not be available to every admin user.

Potential roles:

```text
Super Admin
Marketing Manager
Store Manager
Support
Finance
```

Example:

```text
Marketing Manager
→ Create campaign
→ Edit campaign

Support
→ View campaign
→ Cannot change discount

Finance
→ View campaign analytics
```

---

# 59. Security

The client must never be able to decide:

```text
discount = 90%
```

or:

```text
campaign_id = XYZ
```

and expect the backend to trust it.

Frontend sends intent:

```text
Apply code DIWALI10
```

Backend independently validates everything.

---

# 60. Tax interaction

This is another thing often forgotten.

You need a defined order of operations.

For example:

```text
Product subtotal
       ↓
Discount
       ↓
Tax
       ↓
Shipping
       ↓
Shipping discount
       ↓
Final total
```

But the exact tax/discount sequence must match your tax/accounting requirements and the capabilities of your commerce engine.

This should be explicitly documented rather than assumed.

---

# 61. Shipping interaction

Campaigns may affect:

```text
Product price
Order subtotal
Shipping
```

Example:

```text
₹2,000 order
+
₹100 shipping

FREE SHIPPING

Final:
₹2,000
```

---

# 62. Payment-method campaigns

Potential future:

```text
10% OFF when paying via X
```

But this requires integration with the payment provider/payment-session flow.

I would treat this as a future capability rather than building it into V1 unless your business specifically requires it.

---

# 63. Gift / hamper campaigns

For The Letter Ink, this can become particularly useful.

Example:

```text
Buy Wedding Hamper
+
₹3,000 cart
↓
Free Greeting Card
```

This is not necessarily a monetary discount.

So your benefit engine may eventually support:

```text
MONETARY_DISCOUNT
FREE_SHIPPING
FREE_PRODUCT
BUY_X_GET_Y
```

---

# 64. Campaign with free product

Example:

```text
Spend ₹3,000
↓
Get complimentary card
```

The engine needs to add/allocate a promotional line item.

This introduces additional complexity around:

* Inventory
* Tax
* Returns
* Order cancellation
* Product availability

Therefore it should be a separate capability.

---

# 65. Product customisation + campaigns

This is particularly relevant to your current work.

Suppose:

```text
Product:
Personalised Wedding Invitation

Base:
₹1,500
```

Customer selects:

```text
Paper: Ivory
Ink: Gold
Font: Elegant
```

Campaign:

```text
10% OFF personalised products
```

The promotion engine must determine what constitutes the discountable price.

You need to define whether:

```text
Base product price
+
customisation surcharge
```

is discounted.

Example:

```text
Base price       ₹1,500
Customisation      ₹300
------------------------
Subtotal          ₹1,800

10% discount       ₹180
```

or:

```text
Only base product:
₹1,500 × 10%
= ₹150
```

This rule should be explicit.

---

# 66. Campaign + customisation architecture

Don't make customisation code know about campaigns.

Instead:

```text
Product Customisation Engine
        ↓
Final Line Price
        ↓
Promotion Engine
        ↓
Discount
```

This maintains separation of concerns.

---

# 67. Recommended overall architecture

For your project, conceptually:

```text
                    FRONTEND
                       │
                       ▼
                Product / Cart UI
                       │
                       ▼
                Commerce API
                       │
          ┌────────────┴────────────┐
          │                         │
          ▼                         ▼
 Product/Variant Engine       Promotion Engine
          │                         │
          │               ┌─────────┼──────────┐
          │               │         │          │
          │               ▼         ▼          ▼
          │          Eligibility  Targeting  Benefit
          │               │         │          │
          │               └─────────┼──────────┘
          │                         ▼
          │                 Combination Rules
          │                         │
          └──────────────┬──────────┘
                         ▼
                    Cart Engine
                         │
                         ▼
                    Checkout
                         │
                         ▼
                       Order
                         │
                         ▼
                Campaign Redemption
                         │
                         ▼
                    Analytics
```

---

# 68. Database relationship

Conceptually:

```text
Campaign
   │
   ├──────── CampaignSchedule
   │
   ├──────── CampaignCondition
   │
   ├──────── CampaignTarget
   │              │
   │              ├── Product
   │              ├── Collection
   │              └── Variant
   │
   ├──────── CampaignBenefit
   │
   ├──────── Coupon
   │
   ├──────── CombinationRule
   │
   └──────── Redemption
                  │
                  ├── Customer
                  └── Order
```

But because you are already working with **Medusa**, don't automatically create all these tables yourself. Medusa already has promotion concepts, and the correct approach is to inspect your current Medusa version and existing backend extensions first, then extend the native architecture where appropriate.

---

# 69. Promotion engine vs campaign management

I would keep these conceptually separate.

### Campaign Management

Responsible for:

```text
Create
Edit
Delete
Schedule
Pause
Activate
Audience
Marketing information
Analytics
```

### Promotion Engine

Responsible for:

```text
Evaluate
Validate
Calculate
Apply
Combine
Reject
Allocate
```

This separation is extremely important.

---

# 70. The complete lifecycle

Putting everything together:

```text
ADMIN
 │
 │ Create Campaign
 ▼
CAMPAIGN
 │
 ├── Define schedule
 ├── Define audience
 ├── Define products
 ├── Define conditions
 ├── Define benefit
 ├── Define coupon
 ├── Define usage limits
 └── Define combination rules
 │
 ▼
SCHEDULED
 │
 ▼
ACTIVE
 │
 ▼
CUSTOMER
 │
 ├── Visits product
 ├── Adds product
 └── Opens cart
 │
 ▼
PROMOTION ENGINE
 │
 ├── Find active campaigns
 ├── Evaluate eligibility
 ├── Evaluate targets
 ├── Evaluate conditions
 ├── Validate coupon
 ├── Calculate benefit
 ├── Resolve conflicts
 └── Allocate discount
 │
 ▼
CART
 │
 ▼
CHECKOUT
 │
 ▼
ORDER CREATED
 │
 ▼
REDEMPTION
 │
 ▼
ANALYTICS
```

---

# 71. What I would consider the V1 scope for The Letter Ink

Don't build every possible ecommerce promotion immediately.

I would make the first production version support:

### Campaign

* Create
* Edit
* Activate
* Pause
* Schedule
* Expire
* Archive

### Discount types

* Percentage
* Fixed amount
* Free shipping

### Targeting

* All products
* Specific products
* Collections
* Product exclusions

### Conditions

* Minimum cart value
* Minimum quantity
* Customer eligibility
* First order

### Coupons

* Automatic promotion
* Single coupon code
* Multiple generated codes

### Usage

* Total usage limit
* Per-customer usage limit

### Combination

* Exclusive campaign
* Combinable campaign
* Product/order/shipping combination rules

### Checkout

* Apply
* Remove
* Recalculate
* Persist to order

### Admin

* Campaign CRUD
* Campaign status
* Usage
* Basic analytics
* Audit log

That gives you a **real promotion engine**, rather than a simple coupon feature.

---

# 72. V2 capabilities

Later:

```text
Buy X Get Y
Spend X Get Y
Tiered discounts
Customer groups
VIP campaigns
Geographic campaigns
Scheduled flash sales
Free gifts
Bulk coupon generation
Influencer codes
Referral campaigns
Payment-method campaigns
Shipping-zone campaigns
Campaign banners
Campaign analytics
A/B testing
Campaign attribution
```

---

# 73. Most important architectural rule

I would structure your implementation around this principle:

> **Campaign configuration should be data; promotion behavior should be engine logic; frontend should only consume the resulting state.**

So **do not** do this:

```javascript
if (coupon === "DIWALI10") {
   discount = 10;
}
```

Instead:

```text
Frontend
   ↓
API
   ↓
Promotion Engine
   ↓
Campaign configuration
   ↓
Rule evaluation
   ↓
Discount calculation
   ↓
Authoritative cart
```

That gives you the dynamic system you're asking for and prevents the frontend from becoming full of campaign-specific conditions.

For Shopify specifically, the current architecture illustrates this separation well: discount configuration is managed separately from the runtime discount function, while checkout evaluates product/order/shipping discount candidates and combination rules. ([Shopify][2])

### For your Letter Ink project

Given that you're already using **Medusa + Next.js and are making product customisation fully backend-controlled**, I would **not start implementing a campaign database from this conceptual model yet**. The next step should be to inspect your actual `letter-ink-backend`/Medusa version and determine:

1. What Medusa promotion functionality you already have.
2. What your current product/variant/cart/order architecture looks like.
3. Which native Medusa promotion functionality can be reused.
4. What The Letter Ink specifically needs beyond Medusa.
5. Whether campaign management should be a Medusa module, custom module, or extension.
6. Exactly where customisation pricing enters the promotion calculation.
7. How campaign data should flow from Admin → Backend → Cart → Checkout → Order.

That will prevent you from duplicating functionality that Medusa already provides and will give you an **industry-standard architecture tailored to your actual codebase**, rather than a generic campaign system.

[1]: https://shopify.dev/docs/apps/build/discounts?utm_source=chatgpt.com "About discounts"
[2]: https://shopify.dev/docs/api/functions/2026-01/discount?utm_source=chatgpt.com "Discount Function API"
[3]: https://shopify.dev/docs/api/admin-graphql/latest/objects/DiscountCombinesWith?utm_source=chatgpt.com "DiscountCombinesWith - GraphQL Admin"
[4]: https://shopify.dev/docs/storefronts/themes/pricing-payments/discounts?utm_source=chatgpt.com "Discounts"