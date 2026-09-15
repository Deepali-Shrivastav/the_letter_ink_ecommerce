# The Letter Ink — Medusa Backend: Workflow Reference

> **Document:** 08 — Workflow Reference  
> **Package:** `@medusajs/core-flows` v2.20.1

All business logic in Medusa v2 is expressed as **Workflows** — composable, compensatable sequences of steps. Routes call workflows; workflows call module services.

---

## Table of Contents

1. [Workflow Primitives](#1-workflow-primitives)
2. [Cart Workflows](#2-cart-workflows)
3. [Order Workflows](#3-order-workflows)
4. [Product Workflows](#4-product-workflows)
5. [Customer Workflows](#5-customer-workflows)
6. [Payment Workflows](#6-payment-workflows)
7. [Fulfillment Workflows](#7-fulfillment-workflows)
8. [Inventory Workflows](#8-inventory-workflows)
9. [Pricing Workflows](#9-pricing-workflows)
10. [Promotion Workflows](#10-promotion-workflows)
11. [Auth Workflows](#11-auth-workflows)
12. [Region & Tax Workflows](#12-region--tax-workflows)
13. [Notification Workflows](#13-notification-workflows)
14. [User Workflows](#14-user-workflows)
15. [Store Workflows](#15-store-workflows)
16. [Extending Workflows with Hooks](#16-extending-workflows-with-hooks)

---

## 1. Workflow Primitives

### Core Functions

```typescript
import {
  createStep,       // Define a compensatable step
  createWorkflow,   // Compose steps into a workflow
  StepResponse,     // Step return value (result, compensationData)
  WorkflowResponse, // Workflow return value (result, hooks)
  WorkflowData,     // Typed input
  transform,        // Pure data transformation
  when,             // Conditional execution
  parallelize,      // Concurrent steps
  createHook,       // Extensibility hook
  useQueryGraphStep, // Query data graph
} from "@medusajs/framework/workflows-sdk"
```

### Step Anatomy

```typescript
const myStep = createStep(
  "step-id",                          // Unique step identifier
  async (input: InputType, { container }) => {
    // Main action
    const service = container.resolve(Modules.PRODUCT)
    const result = await service.doSomething(input)
    return new StepResponse(result, input.id)  // (result, compensationData)
  },
  async (compensationData, { container }) => {
    // Rollback — called if a later step fails
    if (!compensationData) return
    const service = container.resolve(Modules.PRODUCT)
    await service.undoSomething(compensationData)
  }
)
```

### Workflow Anatomy

```typescript
const myWorkflow = createWorkflow(
  "my-workflow",
  (input: WorkflowData<{ ids: string[] }>) => {
    const step1Result = step1(input.ids)

    const transformed = transform({ step1Result }, ({ step1Result }) => ({
      processedData: step1Result.map(r => r.id),
    }))

    const step2Result = when({ step1Result }, ({ step1Result }) => {
      return step1Result.length > 0
    }).then(() => step2(transformed.processedData))

    const [a, b] = parallelize(stepA(input.ids), stepB(input.ids))

    const hook = createHook("myEventHook", { ids: input.ids })

    return new WorkflowResponse(step2Result, { hooks: [hook] })
  }
)
```

---

## 2. Cart Workflows

### `createCartsWorkflow` — `"create-carts"`

Creates one or more carts. Runs: create cart → attach customer (if logged in) → attach sales channel → set region → calculate initial prices.

**Input:**
```typescript
{
  regions_id?: string
  email?: string
  currency_code?: string
  shipping_address?: CreateCartAddressDTO
  billing_address?: CreateCartAddressDTO
  metadata?: Record<string, unknown>
  sales_channel_id?: string
  customer_id?: string
  items?: { variant_id: string; quantity: number }[]
}
```

---

### `addToCartWorkflow` — `"add-to-cart"`

Add items to a cart with inventory confirmation and price computation.

**Steps:**
1. `validateVariantInventoryStep` — checks available stock
2. `addLineItemsStep` — creates line items in cart module
3. `updateCartPromotionsStep` — re-applies promotions
4. `refreshCartShippingMethodsStep` — validates shipping is still valid
5. `updateTaxLinesStep` — recalculates tax

---

### `updateCartWorkflow` — `"update-cart"`

Update cart fields (email, address, region, metadata).

**Steps:**
1. `updateCartsStep`
2. `refreshCartItemsStep` — re-prices on region change
3. `updateCartPromotionsStep`
4. `updateTaxLinesStep`

---

### `updateLineItemInCartWorkflow` — `"update-line-item-in-cart"`

Update quantity or metadata of a cart line item.

---

### `addShippingMethodToCartWorkflow` — `"add-shipping-method-to-cart"`

Add a shipping method selection to a cart.

**Steps:**
1. `listShippingOptionsForCartStep` — validates option exists for cart
2. `validateCartShippingOptionsPriceStep`
3. `removeShippingMethodFromCartStep` — removes existing method
4. `addShippingMethodsToCartStep`
5. `refreshCartShippingMethodsStep`
6. `updateTaxLinesStep`

---

### `updateCartPromotionsWorkflow` — `"update-cart-promotions"`

Apply or remove promotion codes from a cart.

---

### `completeCartWorkflow` — `"complete-cart"`

The most complex workflow — converts cart into an order.

**Steps:**
1. `retrieveCartStep` — fetch cart with all relations
2. `confirmVariantInventoryWorkflow` — reserve stock
3. `createOrderFromCartStep` — create order in order module
4. `updateOrderTaxLinesStep`
5. `authorizePaymentSessionStep` (via Stripe/provider)
6. `captureFulfillmentStep` (if immediate capture configured)
7. `completeCartStep` — mark cart as completed
8. Emits `cart.completed` → triggers notifications

---

### `listShippingOptionsForCartWorkflow` — `"list-shipping-options-for-cart"`

Fetch available shipping options for a cart, filtered by geo-zone and service zone.

### `listShippingOptionsForCartWithPricingWorkflow`

Same as above, but also computes prices for each option.

### `transferCartCustomerWorkflow` — `"transfer-cart-customer"`

Associate a logged-in customer with a cart.

### `refreshCartItemsWorkflow`

Re-compute all item prices (called when region changes).

### `refreshCartShippingMethodsWorkflow`

Validate and re-price shipping methods.

---

## 3. Order Workflows

### `createOrderWorkflow` — `"create-order"`

Create an order directly (without cart — for admin/draft orders).

### `updateOrderWorkflow` — `"update-order"`

Update order fields.

**Compensation:** Reverts to previous field values.

---

### `cancelOrderWorkflow` — `"cancel-order"`

Cancel an order and trigger compensating actions.

**Steps:**
1. Validate order can be canceled (status check)
2. `cancelOrderStep`
3. `cancelPaymentStep`
4. `restoreInventoryReservationsStep`
5. Emit `order.canceled`

---

### `archiveOrdersWorkflow` — `"archive-orders"`

Mark completed orders as archived.

---

### `completeOrdersWorkflow` — `"complete-orders"`

Complete an order (all items delivered).

---

### `createOrderFulfillmentWorkflow` — `"create-order-fulfillment"`

Create a fulfillment for order items.

**Steps:**
1. `getFulfillmentItemsStep` — resolve items and quantities
2. `createFulfillmentStep` — fulfillment module
3. `setOrderFulfillmentsStep` — update order
4. `adjustInventoryLevelsStep` — deduct inventory

---

### `cancelOrderFulfillmentWorkflow` — `"cancel-order-fulfillment"`

Cancel a fulfillment and restore inventory.

---

### `createShipmentWorkflow` — `"create-shipment"`

Mark fulfillment as shipped with tracking info.

**Steps:**
1. `shipFulfillmentStep`
2. `setOrderFulfillmentsStep`
3. Emit `order.shipment.created`

---

### `markOrderFulfillmentAsDeliveredWorkflow` — `"mark-order-fulfillment-as-delivered"`

Mark a shipment as delivered.

---

### `createOrderChangeWorkflow` — `"create-order-change"`

Begin an order change (edit, return, exchange, claim).

### `confirmOrderChangeWorkflow` / `cancelOrderChangeWorkflow` / `declineOrderChangeWorkflow`

---

### Return Sub-Workflows

| Workflow | Description |
|---|---|
| `requestOrderReturnWorkflow` | Customer initiates return |
| `receiveReturnWorkflow` | Admin marks items received |
| `cancelReturnWorkflow` | Cancel pending return |
| `closeReturnWorkflow` | Close without full receipt |

### Claim Sub-Workflows

| Workflow | Description |
|---|---|
| `createClaimWorkflow` | Create a claim |
| `addClaimItemsWorkflow` | Add items to claim |
| `confirmClaimRequestWorkflow` | Approve claim |
| `createClaimFulfillmentWorkflow` | Fulfill replacement items |
| `createClaimShipmentWorkflow` | Ship replacement |

### Exchange Sub-Workflows

Similar to claims — `createExchangeWorkflow`, `addExchangeItemsWorkflow`, `confirmExchangeRequestWorkflow`, etc.

### Order Edit Sub-Workflows

| Workflow | Description |
|---|---|
| `beginOrderEditWorkflow` | Start edit |
| `addOrderEditLineItemsWorkflow` | Add items |
| `updateOrderEditItemQuantityWorkflow` | Change quantity |
| `removeOrderEditItemActionWorkflow` | Remove item from edit |
| `confirmOrderEditRequestWorkflow` | Apply changes |
| `cancelOrderEditWorkflow` | Discard changes |

### Transfer Workflows

| Workflow | Description |
|---|---|
| `requestOrderTransferWorkflow` | Customer requests transfer |
| `acceptOrderTransferWorkflow` | New customer accepts |
| `cancelOrderTransferWorkflow` | Cancel transfer request |
| `declineOrderTransferWorkflow` | Decline transfer |

---

## 4. Product Workflows

### `createProductsWorkflow` — `"create-products"`

Create products with variants, options, images, tags, categories.

**Steps:**
1. `createProductsStep`
2. `createProductVariantsStep`
3. `upsertVariantPricesStep`
4. `associateProductsWithSalesChannelsStep`
5. `createProductOptionsStep`

---

### `updateProductsWorkflow` — `"update-products"`

Update product fields and variants.

### `deleteProductsWorkflow` — `"delete-products"`

Soft-delete products, with compensation to restore them.

---

### `createProductVariantsWorkflow` — `"create-product-variants"`

Add variants to existing products.

**Steps:**
1. `createProductVariantsStep`
2. `createInventoryItemsStep` (if manage_inventory)
3. `attachInventoryItemsStep` (link to variant)
4. `upsertVariantPricesStep`

---

### `updateProductVariantsWorkflow` / `deleteProductVariantsWorkflow`

---

### Import / Export

| Workflow | Description |
|---|---|
| `importProductsWorkflow` | Bulk import from CSV |
| `importProductsAsChunksWorkflow` | Large CSV in batches |
| `exportProductsWorkflow` | Export to CSV |

---

### Product Options

`createProductOptionsWorkflow`, `updateProductOptionsWorkflow`, `deleteProductOptionsWorkflow`

### Collections

`createCollectionsWorkflow`, `updateCollectionsWorkflow`, `deleteCollectionsWorkflow`, `batchLinkProductsToCollectionWorkflow`

### Categories

`createProductCategoryWorkflow`, `updateProductCategoryWorkflow`, `deleteProductCategoryWorkflow`, `batchProductsInCategoryWorkflow`

---

## 5. Customer Workflows

| Workflow | Description |
|---|---|
| `createCustomerWorkflow` | Create customer record |
| `updateCustomerWorkflow` | Update customer fields |
| `deleteCustomersWorkflow` | Delete customers |
| `createCustomerAddressesWorkflow` | Add addresses |
| `updateCustomerAddressesWorkflow` | Update addresses |
| `deleteCustomerAddressesWorkflow` | Remove addresses |
| `createCustomerGroupWorkflow` | Create customer group |
| `updateCustomerGroupsWorkflow` | Update groups |
| `deleteCustomerGroupsWorkflow` | Delete groups |
| `linkCustomersToGroupWorkflow` | Add customers to group |
| `removeCustomerFromGroupWorkflow` | Remove from group |

---

## 6. Payment Workflows

| Workflow | Description |
|---|---|
| `createPaymentCollectionWorkflow` | Create payment collection |
| `createPaymentSessionWorkflow` | Init payment with provider |
| `authorizePaymentSessionWorkflow` | Authorize payment |
| `capturePaymentWorkflow` | Capture authorized payment |
| `refundPaymentWorkflow` | Process refund |
| `cancelPaymentWorkflow` | Cancel payment |
| `processPaymentWorkflow` | Handle webhook event from provider |
| `markPaymentCollectionAsPaidWorkflow` | Manual payment marking |

---

## 7. Fulfillment Workflows

| Workflow | Description |
|---|---|
| `createFulfillmentWorkflow` | Create fulfillment record |
| `cancelFulfillmentWorkflow` | Cancel fulfillment |
| `createShipmentWorkflow` | Attach tracking, mark shipped |
| `markFulfillmentAsDeliveredWorkflow` | Mark delivered |
| `createFulfillmentSetWorkflow` | Create fulfillment set |
| `createServiceZonesWorkflow` | Create service zone with geo-zones |
| `updateServiceZonesWorkflow` | Update zone |
| `deleteServiceZonesWorkflow` | Delete zone |
| `createShippingOptionsWorkflow` | Create shipping options |
| `updateShippingOptionsWorkflow` | Update options |
| `deleteShippingOptionsWorkflow` | Delete options |
| `createShippingProfilesWorkflow` | Create shipping profiles |
| `upsertShippingProfilesWorkflow` | Upsert profiles |
| `deleteShippingProfilesWorkflow` | Delete profiles |
| `listShippingOptionsForOrderWorkflow` | Get available options for order |
| `fetchShippingOptionWorkflow` | Get single option with pricing |

---

## 8. Inventory Workflows

| Workflow | Description |
|---|---|
| `createInventoryItemsWorkflow` | Create inventory items |
| `updateInventoryItemsWorkflow` | Update inventory items |
| `deleteInventoryItemsWorkflow` | Delete items |
| `createInventoryLevelsWorkflow` | Set stock levels at location |
| `updateInventoryLevelsWorkflow` | Update stock |
| `deleteInventoryLevelsWorkflow` | Remove level |
| `createReservationsWorkflow` | Create stock reservations |
| `deleteReservationsWorkflow` | Release reservations |
| `updateReservationsWorkflow` | Update reservations |
| `confirmVariantInventoryWorkflow` | Check and reserve for cart completion |

---

## 9. Pricing Workflows

| Workflow | Description |
|---|---|
| `createPriceListsWorkflow` | Create price lists |
| `updatePriceListsWorkflow` | Update price lists |
| `deletePriceListsWorkflow` | Delete price lists |
| `createPriceListPricesWorkflow` | Add prices to list |
| `updatePriceListPricesWorkflow` | Update prices |
| `deletePriceListPricesWorkflow` | Remove prices |
| `upsertVariantPricesWorkflow` | Set/update variant prices |
| `createPricePreferencesWorkflow` | Create price preferences |
| `updatePricePreferencesWorkflow` | Update preferences |
| `deletePricePreferencesWorkflow` | Delete preferences |

---

## 10. Promotion Workflows

| Workflow | Description |
|---|---|
| `createPromotionWorkflow` | Create promotion |
| `updatePromotionWorkflow` | Update promotion |
| `deletePromotionsWorkflow` | Delete promotions |
| `batchPromotionRulesWorkflow` | Add/update/remove rules |
| `addRulesToPromotionsWorkflow` | Add rules |
| `removeRulesFromPromotionWorkflow` | Remove rules |
| `createCampaignWorkflow` | Create campaign |
| `updateCampaignsWorkflow` | Update campaigns |
| `deleteCampaignsWorkflow` | Delete campaigns |

---

## 11. Auth Workflows

| Workflow | Description |
|---|---|
| `generateJwtTokenWorkflow` | Generate JWT for identity |
| `authenticateCustomerWithPasswordWorkflow` | Customer login |
| `authenticateCustomerWithOAuthWorkflow` | Customer OAuth |
| `updateProviderIdentityWorkflow` | Update credentials |
| `createAuthIdentityWorkflow` | Create auth identity |
| `deleteAuthIdentitiesWorkflow` | Delete identities |

---

## 12. Region & Tax Workflows

### Region

`createRegionsWorkflow`, `updateRegionsWorkflow`, `deleteRegionsWorkflow`, `upsertRegionsWorkflow`

### Tax

| Workflow | Description |
|---|---|
| `createTaxRegionsWorkflow` | Create tax regions |
| `deleteTaxRegionsWorkflow` | Delete tax regions |
| `createTaxRatesWorkflow` | Create tax rates |
| `updateTaxRatesWorkflow` | Update tax rates |
| `deleteTaxRatesWorkflow` | Delete tax rates |
| `setTaxRateRulesWorkflow` | Assign rules to rates |
| `deleteTaxRateRulesWorkflow` | Remove rules |

---

## 13. Notification Workflows

| Workflow | Description |
|---|---|
| `sendNotificationsWorkflow` | Send notifications via configured providers |

---

## 14. User Workflows

| Workflow | Description |
|---|---|
| `createUserWorkflow` | Create admin user |
| `updateUsersWorkflow` | Update users |
| `deleteUsersWorkflow` | Delete users |
| `createInviteWorkflow` | Create invitation |
| `refreshInviteTokensWorkflow` | Resend invite with fresh token |
| `deleteInvitesWorkflow` | Delete invites |
| `acceptInviteWorkflow` | Accept invitation and create user |

---

## 15. Store Workflows

| Workflow | Description |
|---|---|
| `createStoresWorkflow` | Create store configuration |
| `updateStoresWorkflow` | Update store settings |
| `deleteStoresWorkflow` | Delete store |
| `createDefaultsWorkflow` | Seed initial data on startup |

---

## 16. Extending Workflows with Hooks

Every workflow that emits a hook can be extended by plugins or custom code:

### Available Hooks (examples)

| Workflow | Hook Name | Data |
|---|---|---|
| `createProductsWorkflow` | `productsCreated` | `{ products }` |
| `updateProductsWorkflow` | `productsUpdated` | `{ products }` |
| `deleteProductsWorkflow` | `productsDeleted` | `{ ids }` |
| `createOrderWorkflow` | `orderCreated` | `{ order }` |
| `createPromotionsWorkflow` | `promotionsCreated` | `{ promotions }` |
| `deletePromotionsWorkflow` | `promotionsDeleted` | `{ ids }` |
| `createCustomerWorkflow` | `customerCreated` | `{ customer }` |

### Registering a Hook Handler

```typescript
// src/workflows/hooks/after-product-created.ts
import { createProductsWorkflow } from "@medusajs/core-flows"

createProductsWorkflow.hooks.productsCreated(
  async ({ products }, { container }) => {
    // Custom logic — e.g., send to external system
    const searchService = container.resolve("searchService")
    await searchService.indexBatch(products.map(p => ({
      id: p.id,
      title: p.title,
      description: p.description,
    })))
  }
)
```

Hook handlers are loaded from `src/workflows/` in your plugin/application directory.

---

## Appendix: Step Reference

Common steps used across multiple workflows:

| Step | Package | Description |
|---|---|---|
| `useQueryGraphStep` | workflows-sdk | Query data across modules |
| `emitEventStep` | core-flows/common | Emit domain event |
| `dismissRemoteLinksStep` | core-flows/common | Remove cross-module links |
| `createRemoteLinksStep` | core-flows/common | Create cross-module links |
| `updateRemoteLinksStep` | core-flows/common | Update cross-module links |
| `setTaxLinesStep` | core-flows/cart | Calculate and set tax lines |
| `setPricingContext` | core-flows | Set region/currency context |
| `refreshCartItemsStep` | core-flows/cart | Re-price cart items |
| `adjustInventoryLevelsStep` | core-flows/inventory | Adjust stock quantities |
| `createReservationItemsStep` | core-flows/inventory | Reserve stock |
| `deleteReservationItemsStep` | core-flows/inventory | Release reservations |
