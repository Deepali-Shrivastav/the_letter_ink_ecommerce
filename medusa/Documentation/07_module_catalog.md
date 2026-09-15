# The Letter Ink — Medusa Backend: Module Catalog

> **Document:** 07 — Module Catalog  
> **Medusa Version:** 2.20.1

---

## Table of Contents

1. [Commerce Modules](#commerce-modules)
2. [Infrastructure Modules](#infrastructure-modules)
3. [Provider Implementations](#provider-implementations)
4. [Module Configuration Reference](#module-configuration-reference)

---

## Commerce Modules

### 1. Product Module — `@medusajs/product`

**Registration Key:** `Modules.PRODUCT`  
**Interface:** `IProductModuleService`

Manages the entire product catalog.

**Key Service Methods:**

| Method | Description |
|---|---|
| `createProducts(data[])` | Create products with variants, options, images |
| `updateProducts(data[])` | Update product fields |
| `deleteProducts(ids[])` | Soft-delete products |
| `restoreProducts(ids[])` | Restore soft-deleted products |
| `listProducts(filters, config)` | List/filter products |
| `retrieveProduct(id, config)` | Get single product |
| `createProductVariants(data[])` | Create variants |
| `updateProductVariants(data[])` | Update variants |
| `deleteProductVariants(ids[])` | Delete variants |
| `createProductOptions(data[])` | Create options |
| `createProductCategories(data[])` | Create categories |
| `createProductCollections(data[])` | Create collections |
| `createProductTags(data[])` | Create tags |
| `createProductTypes(data[])` | Create types |
| `softDeleteProducts(ids[])` | Soft-delete (compensation) |

**Models:** Product, ProductVariant, ProductOption, ProductOptionValue, ProductCategory, ProductCollection, ProductTag, ProductType, ProductImage

---

### 2. Order Module — `@medusajs/order`

**Registration Key:** `Modules.ORDER`  
**Interface:** `IOrderModuleService`

Full order lifecycle management including returns, claims, exchanges, and order changes.

**Key Service Methods:**

| Method | Description |
|---|---|
| `createOrders(data[])` | Create orders from cart data |
| `updateOrders(data[])` | Update order fields |
| `cancelOrder(id)` | Cancel an order |
| `completeOrders(ids[])` | Mark orders complete |
| `archiveOrders(ids[])` | Archive orders |
| `createOrderItems(data[])` | Add items to order |
| `createOrderChange(data)` | Create an order change |
| `confirmOrderChange(id)` | Confirm pending change |
| `cancelOrderChange(id)` | Cancel pending change |
| `createReturn(data)` | Create return |
| `receiveReturn(id, items)` | Mark return received |
| `createClaim(data)` | Create claim |
| `createExchange(data)` | Create exchange |
| `createOrderShippingMethods(data[])` | Add shipping methods |
| `createOrderLineItems(data[])` | Add line items |
| `createOrderTransaction(data)` | Record transaction |
| `addOrderTransactions(data[])` | Add transactions |
| `getOrderDetailWorkflow()` | Get order detail with computed data |

**Models:** Order, OrderItem, OrderChange, OrderChangeAction, OrderShipping, OrderTransaction, Return, ReturnItem, Claim, ClaimItem, Exchange, ExchangeItem, OrderSummary, OrderAddress, CreditLine

---

### 3. Cart Module — `@medusajs/cart`

**Registration Key:** `Modules.CART`  
**Interface:** `ICartModuleService`

Shopping cart state management.

**Key Service Methods:**

| Method | Description |
|---|---|
| `createCarts(data[])` | Create carts |
| `updateCarts(data[])` | Update cart fields |
| `deleteCarts(ids[])` | Delete carts |
| `addLineItems(data[])` | Add items to cart |
| `updateLineItems(data[])` | Update line item quantities |
| `deleteLineItems(ids[])` | Remove items |
| `addShippingMethods(data[])` | Add shipping methods |
| `removeShippingMethods(ids[])` | Remove shipping methods |
| `setLineItemAdjustments(cartId, adjustments[])` | Apply promotions/adjustments |
| `setLineItemTaxLines(cartId, taxLines[])` | Set tax lines |
| `setShippingMethodAdjustments(cartId, adjustments[])` | Shipping adjustments |
| `setShippingMethodTaxLines(cartId, taxLines[])` | Shipping tax lines |
| `retrieveCart(id, config)` | Get cart with computed totals |

**Models:** Cart, LineItem, LineItemAdjustment, LineItemTaxLine, ShippingMethod, ShippingMethodAdjustment, ShippingMethodTaxLine, CartAddress, CreditLine

---

### 4. Customer Module — `@medusajs/customer`

**Registration Key:** `Modules.CUSTOMER`  
**Interface:** `ICustomerModuleService`

Customer account management.

**Key Service Methods:**

| Method | Description |
|---|---|
| `createCustomers(data[])` | Create customer records |
| `updateCustomers(data[])` | Update customer fields |
| `deleteCustomers(ids[])` | Delete customers |
| `listCustomers(filters, config)` | List customers |
| `createAddresses(data[])` | Create customer addresses |
| `updateAddresses(data[])` | Update addresses |
| `deleteAddresses(ids[])` | Delete addresses |
| `createCustomerGroups(data[])` | Create groups |
| `addCustomerToGroup(data)` | Add customer to group |
| `removeCustomerFromGroup(data)` | Remove from group |

---

### 5. Payment Module — `@medusajs/payment`

**Registration Key:** `Modules.PAYMENT`  
**Interface:** `IPaymentModuleService`

Payment collection, session, and provider management.

**Key Service Methods:**

| Method | Description |
|---|---|
| `createPaymentCollections(data[])` | Create payment collection |
| `updatePaymentCollections(data[])` | Update collection |
| `deletePaymentCollections(ids[])` | Delete collection |
| `createPaymentSession(collectionId, data)` | Init payment session |
| `authorizePaymentSession(id, context)` | Authorize payment |
| `capturePayment(id, amount)` | Capture authorized payment |
| `refundPayment(id, amount)` | Refund payment |
| `cancelPayment(id)` | Cancel payment |
| `processEvent(provider, data)` | Handle provider webhook |
| `listPaymentProviders(filters)` | Available providers |

---

### 6. Fulfillment Module — `@medusajs/fulfillment`

**Registration Key:** `Modules.FULFILLMENT`  
**Interface:** `IFulfillmentModuleService`

Shipping infrastructure and fulfillment management.

**Key Service Methods:**

| Method | Description |
|---|---|
| `createFulfillmentSets(data[])` | Create fulfillment sets |
| `createServiceZones(data[])` | Create service zones |
| `createShippingOptions(data[])` | Create shipping options |
| `createShippingProfiles(data[])` | Create shipping profiles |
| `createFulfillment(data)` | Create fulfillment record |
| `cancelFulfillment(id)` | Cancel fulfillment |
| `createShipment(id, labels[])` | Mark as shipped with labels |
| `markFulfillmentAsDelivered(id)` | Mark delivered |
| `listShippingOptions(filters)` | List available options |
| `calculateShippingOptionPrice(id, data)` | Get calculated price |
| `listFulfillmentProviders(filters)` | List providers |

---

### 7. Inventory Module — `@medusajs/inventory`

**Registration Key:** `Modules.INVENTORY`  
**Interface:** `IInventoryModuleService`

Multi-location inventory tracking and reservations.

**Key Service Methods:**

| Method | Description |
|---|---|
| `createInventoryItems(data[])` | Create inventory items |
| `updateInventoryItems(data[])` | Update item details |
| `deleteInventoryItems(ids[])` | Delete items |
| `createInventoryLevels(data[])` | Create stock levels |
| `updateInventoryLevels(data[])` | Update stock quantities |
| `deleteInventoryLevels(ids[])` | Remove stock levels |
| `createReservationItems(data[])` | Reserve stock |
| `deleteReservationItems(ids[])` | Release reservations |
| `retrieveAvailableQuantity(itemId, locationIds[])` | Check available stock |
| `adjustInventory(itemId, locationId, delta)` | Adjust stock |
| `confirmInventory(itemId, locationIds[], quantity)` | Confirm availability |

---

### 8. Pricing Module — `@medusajs/pricing`

**Registration Key:** `Modules.PRICING`  
**Interface:** `IPricingModuleService`

Price computation with currency, quantity tier, and rule support.

**Key Service Methods:**

| Method | Description |
|---|---|
| `createPriceSets(data[])` | Create price sets |
| `addPrices(data[])` | Add prices to price set |
| `removePrices(ids[])` | Remove prices |
| `createPriceLists(data[])` | Create price lists |
| `updatePriceLists(data[])` | Update price lists |
| `deletePriceLists(ids[])` | Delete price lists |
| `calculatePrices(priceSets, context)` | Compute best price for context |

---

### 9. Promotion Module — `@medusajs/promotion`

**Registration Key:** `Modules.PROMOTION`  
**Interface:** `IPromotionModuleService`

Coupon codes, automatic promotions, and campaign management.

**Key Service Methods:**

| Method | Description |
|---|---|
| `createPromotions(data[])` | Create promotions |
| `updatePromotions(data[])` | Update promotions |
| `deletePromotions(ids[])` | Delete promotions |
| `computeActions(promotionCodes[], context)` | Calculate discount actions |
| `createCampaigns(data[])` | Create campaigns |
| `registerUsage(codes[])` | Track promotion usage |

---

### 10. Auth Module — `@medusajs/auth`

**Registration Key:** `Modules.AUTH`  
**Interface:** `IAuthModuleService`

Authentication identity management.

**Key Service Methods:**

| Method | Description |
|---|---|
| `authenticate(provider, data)` | Authenticate with provider |
| `validateCallback(provider, data)` | Validate OAuth callback |
| `register(provider, data)` | Register new identity |
| `update(provider, data)` | Update credentials |
| `createAuthIdentities(data[])` | Create auth identity |
| `deleteAuthIdentities(ids[])` | Delete identities |
| `generateJwtToken(data, config)` | Generate JWT |
| `validateToken(token, config)` | Validate JWT |

---

### 11. Region Module — `@medusajs/region`

**Registration Key:** `Modules.REGION`  
**Interface:** `IRegionModuleService`

Geographic region and country configuration.

**Key Service Methods:**

`createRegions`, `updateRegions`, `deleteRegions`, `listRegions`, `retrieveRegion`, `addCountries`, `removeCountries`

---

### 12. Tax Module — `@medusajs/tax`

**Registration Key:** `Modules.TAX`  
**Interface:** `ITaxModuleService`

Tax region and rate management with provider support.

**Key Service Methods:**

`createTaxRegions`, `updateTaxRegions`, `deleteTaxRegions`, `createTaxRates`, `updateTaxRates`, `deleteTaxRates`, `getTaxLines(lineItems, context)`

---

### 13. Currency Module — `@medusajs/currency`

**Registration Key:** `Modules.CURRENCY`  
**Interface:** `ICurrencyModuleService`

Currency definitions.

---

### 14. Sales Channel Module — `@medusajs/sales-channel`

**Registration Key:** `Modules.SALES_CHANNEL`  
**Interface:** `ISalesChannelModuleService`

Multi-channel product scoping.

**Key Service Methods:**

`createSalesChannels`, `updateSalesChannels`, `deleteSalesChannels`, `listSalesChannels`, `retrieveSalesChannel`

---

### 15. Store Module — `@medusajs/store`

**Registration Key:** `Modules.STORE`  
**Interface:** `IStoreModuleService`

Store-level configuration (currencies, defaults).

---

### 16. User Module — `@medusajs/user`

**Registration Key:** `Modules.USER`  
**Interface:** `IUserModuleService`

Admin user management.

**Key Service Methods:**

`createUsers`, `updateUsers`, `deleteUsers`, `retrieveUser`, `listUsers`, `createInvites`, `retrieveInvite`, `validateInviteToken`, `deleteInvites`

---

### 17. API Key Module — `@medusajs/api-key`

**Registration Key:** `Modules.API_KEY`  
**Interface:** `IApiKeyModuleService`

Publishable and secret key management.

**Key Service Methods:**

`createApiKeys`, `updateApiKeys`, `revokeApiKeys`, `authenticate(token)`, `listApiKeys`

---

### 18. Notification Module — `@medusajs/notification`

**Registration Key:** `Modules.NOTIFICATION`  
**Interface:** `INotificationModuleService`

**Key Service Methods:**

`createNotifications(data[])`, `listNotifications(filters)`, `retrieveNotification(id)`

---

### 19. File Module — `@medusajs/file`

**Registration Key:** `Modules.FILE`  
**Interface:** `IFileModuleService`

Storage abstraction for uploads.

**Key Service Methods:**

`upload(files[])`, `delete(files[])`, `getUploadStreamUrl(data)`, `getPresignedDownloadUrl(data)`

---

### 20. Search Module — `@medusajs/search`

**Registration Key:** `Modules.SEARCH`  
**Interface:** `ISearchModuleService`

Search index and query abstraction.

---

### 21. Stock Location Module — `@medusajs/stock-location`

**Registration Key:** `Modules.STOCK_LOCATION`  
**Interface:** `IStockLocationModuleService`

Warehouse/location management.

---

### 22. RBAC Module — `@medusajs/rbac`

**Registration Key:** `Modules.RBAC`  
**Interface:** `IRBACModuleService`

Role and permission management for admin users.

---

### 23. Analytics Module — `@medusajs/analytics`

**Registration Key:** `Modules.ANALYTICS`  
**Interface:** `IAnalyticsModuleService`

Event tracking and analytics.

---

### 24-36. Infrastructure Modules

| Module | Key | Description |
|---|---|---|
| `@medusajs/cache-inmemory` | `CACHE` | In-memory cache |
| `@medusajs/cache-redis` | `CACHE` | Redis cache |
| `@medusajs/caching` | `CACHING` | Caching abstraction |
| `@medusajs/event-bus-local` | `EVENT_BUS` | Local event bus |
| `@medusajs/event-bus-redis` | `EVENT_BUS` | Redis event bus |
| `@medusajs/locking` | `LOCKING` | Distributed locking |
| `@medusajs/settings` | — | System settings |
| `@medusajs/translation` | — | i18n translations |
| `@medusajs/index` | — | Search index |
| `@medusajs/workflow-engine-inmemory` | `WORKFLOW_ENGINE` | In-process workflows |
| `@medusajs/workflow-engine-redis` | `WORKFLOW_ENGINE` | Redis-backed workflows |
| `@medusajs/link-modules` | — | Cross-module pivots |

---

## Provider Implementations

### Auth Providers

| Package | Provider ID | Description |
|---|---|---|
| `@medusajs/auth-emailpass` | `emailpass` | Email + password (bcrypt) |
| `@medusajs/auth-google` | `google` | Google OAuth 2.0 |
| `@medusajs/auth-github` | `github` | GitHub OAuth |
| `@medusajs/auth-oidc` | `oidc` | OpenID Connect |

### Payment Providers

| Package | Provider ID | Description |
|---|---|---|
| `@medusajs/payment-stripe` | `pp_stripe_stripe` | Stripe (cards, wallets) |

### File Providers

| Package | Description |
|---|---|
| `@medusajs/file-local` | Local filesystem storage |
| `@medusajs/file-s3` | AWS S3 / S3-compatible |

### Notification Providers

| Package | Description |
|---|---|
| `@medusajs/notification-local` | Console logger (dev) |
| `@medusajs/notification-sendgrid` | SendGrid email |

### Fulfillment Providers

| Package | Provider ID | Description |
|---|---|---|
| `@medusajs/fulfillment-manual` | `manual` | Manual (no automation) |

### Search Providers

| Package | Description |
|---|---|
| `@medusajs/search-postgres` | PostgreSQL FTS |

### Caching Providers

| Package | Description |
|---|---|
| `@medusajs/caching-redis` | Redis cache provider |

### Locking Providers

| Package | Description |
|---|---|
| `@medusajs/locking-postgres` | PostgreSQL advisory locks |
| `@medusajs/locking-redis` | Redis-based distributed lock |

### Analytics Providers

| Package | Description |
|---|---|
| `@medusajs/analytics-local` | No-op / console logger |
| `@medusajs/analytics-posthog` | PostHog analytics |

---

## Module Configuration Reference

### Complete `medusa-config.ts` with All Modules

```typescript
import { defineConfig, Modules } from "@medusajs/framework/utils"

export default defineConfig({
  projectConfig: {
    databaseUrl: process.env.DATABASE_URL,
    http: {
      adminCors: process.env.ADMIN_CORS!,
      storeCors: process.env.STORE_CORS!,
      authCors: process.env.AUTH_CORS!,
      jwtSecret: process.env.JWT_SECRET!,
      cookieSecret: process.env.COOKIE_SECRET!,
    },
    workerMode: process.env.MEDUSA_WORKER_MODE as "shared" | "server" | "worker",
    redisUrl: process.env.REDIS_URL,
  },

  modules: {
    // Payment
    [Modules.PAYMENT]: {
      resolve: "@medusajs/payment",
      options: {
        providers: [
          {
            resolve: "@medusajs/payment-stripe",
            id: "stripe",
            options: {
              apiKey: process.env.STRIPE_API_KEY!,
              webhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
            },
          },
        ],
      },
    },

    // Auth
    [Modules.AUTH]: {
      resolve: "@medusajs/auth",
      options: {
        providers: [
          { resolve: "@medusajs/auth-emailpass", id: "emailpass" },
          {
            resolve: "@medusajs/auth-google",
            id: "google",
            options: {
              clientId: process.env.GOOGLE_CLIENT_ID!,
              clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
              callbackUrl: process.env.GOOGLE_CALLBACK_URL!,
            },
          },
        ],
      },
    },

    // File Storage
    [Modules.FILE]: {
      resolve: "@medusajs/file",
      options: {
        providers: [
          process.env.S3_BUCKET
            ? {
                resolve: "@medusajs/file-s3",
                id: "s3",
                options: {
                  fileUrl: process.env.S3_URL!,
                  accessKeyId: process.env.S3_ACCESS_KEY_ID!,
                  secretAccessKey: process.env.S3_SECRET_ACCESS_KEY!,
                  region: process.env.S3_REGION!,
                  bucket: process.env.S3_BUCKET!,
                },
              }
            : {
                resolve: "@medusajs/file-local",
                id: "local",
                options: { upload_dir: "uploads" },
              },
        ],
      },
    },

    // Email Notifications
    [Modules.NOTIFICATION]: {
      resolve: "@medusajs/notification",
      options: {
        providers: [
          {
            resolve: "@medusajs/notification-sendgrid",
            id: "sendgrid",
            options: {
              channels: ["email"],
              api_key: process.env.SENDGRID_API_KEY!,
              from: process.env.SENDGRID_FROM_EMAIL!,
            },
          },
        ],
      },
    },

    // Event Bus (Redis for production)
    [Modules.EVENT_BUS]: {
      resolve: "@medusajs/event-bus-redis",
      options: { redisUrl: process.env.REDIS_URL! },
    },

    // Workflow Engine (Redis for production)
    [Modules.WORKFLOW_ENGINE]: {
      resolve: "@medusajs/workflow-engine-redis",
      options: { redis: { url: process.env.REDIS_URL! } },
    },

    // Cache
    [Modules.CACHE]: {
      resolve: "@medusajs/cache-redis",
      options: { redisUrl: process.env.REDIS_URL! },
    },
  },
})
```
