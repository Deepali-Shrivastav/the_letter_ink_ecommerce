import { ExecArgs } from "@medusajs/framework/types"
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils"
import {
  createRegionsWorkflow,
  createTaxRegionsWorkflow,
  updateStoresWorkflow,
  updateProductVariantsWorkflow,
  createShippingOptionsWorkflow,
} from "@medusajs/medusa/core-flows"

export default async function setupIndiaRegionAndPrices({ container }: ExecArgs) {
  const query = container.resolve(ContainerRegistrationKeys.QUERY)
  const regionService = container.resolve(Modules.REGION)
  const storeService = container.resolve(Modules.STORE)
  const fulfillmentModuleService = container.resolve(Modules.FULFILLMENT)
  const link = container.resolve(ContainerRegistrationKeys.LINK)

  console.log("1. Checking regions...")
  const [existingRegions] = await regionService.listAndCountRegions({ currency_code: "inr" })
  let indiaRegion = existingRegions[0]

  if (!indiaRegion) {
    console.log("Creating India region...")
    const { result: regionResult } = await createRegionsWorkflow(container).run({
      input: {
        regions: [
          {
            name: "India",
            currency_code: "inr",
            countries: ["in"],
            payment_providers: ["pp_system_default"],
          },
        ],
      },
    })
    indiaRegion = regionResult[0]
    console.log("India region created:", indiaRegion.id)

    console.log("Creating tax region for India...")
    try {
      await createTaxRegionsWorkflow(container).run({
        input: [
          {
            country_code: "in",
            provider_id: "tp_system",
          },
        ],
      })
      console.log("Tax region created.")
    } catch (e: any) {
      console.log("Tax region note:", e.message)
    }
  } else {
    console.log("India region already exists:", indiaRegion.id)
  }

  console.log("2. Updating store supported currencies and default region...")
  const [stores] = await storeService.listAndCountStores({})
  const store = stores[0]
  if (store) {
    await updateStoresWorkflow(container).run({
      input: {
        selector: { id: store.id },
        update: {
          supported_currencies: [
            { currency_code: "inr", is_default: true },
            { currency_code: "eur", is_default: false },
            { currency_code: "usd", is_default: false },
          ],
          default_region_id: indiaRegion.id,
        },
      },
    })
    console.log("Store updated with INR as default currency and default region:", indiaRegion.id)
  }

  console.log("3. Checking fulfillment service zones for India shipping...")
  try {
    const fulfillmentSets = await fulfillmentModuleService.listFulfillmentSets(
      {},
      { relations: ["service_zones", "service_zones.geo_zones"] }
    )
    let addedZone = false
    for (const fs of fulfillmentSets) {
      const hasIndia = fs.service_zones?.some((sz: any) =>
        sz.geo_zones?.some((gz: any) => gz.country_code?.toLowerCase() === "in")
      )
      if (!hasIndia && fs.service_zones?.length) {
        console.log(`Adding India geo_zone to fulfillment set ${fs.name} zone ${fs.service_zones[0].name}...`)
        await fulfillmentModuleService.createGeoZones({
          country_code: "in",
          type: "country",
          service_zone_id: fs.service_zones[0].id,
        })
        addedZone = true
      }
    }
    if (addedZone) {
      console.log("India added to service zone.")
    }

    // Shipping options
    const { data: shippingProfiles } = await query.graph({
      entity: "shipping_profile",
      fields: ["id"],
    })
    const shippingProfile = shippingProfiles[0]

    if (shippingProfile && fulfillmentSets[0]?.service_zones?.[0]) {
      const { data: existingOptions } = await query.graph({
        entity: "shipping_option",
        fields: ["id", "name", "prices.*"],
      })
      const hasIndiaShipping = existingOptions.some((opt: any) =>
        opt.prices?.some((p: any) => p.region_id === indiaRegion.id || p.currency_code === "inr")
      )

      if (!hasIndiaShipping) {
        console.log("Creating Standard Shipping for India...")
        await createShippingOptionsWorkflow(container).run({
          input: [
            {
              name: "Standard Delivery (India)",
              price_type: "flat",
              provider_id: "manual_manual",
              service_zone_id: fulfillmentSets[0].service_zones[0].id,
              shipping_profile_id: shippingProfile.id,
              type: {
                label: "Standard",
                description: "Delivered in 3-5 business days.",
                code: "standard_in",
              },
              prices: [
                {
                  currency_code: "inr",
                  amount: 0,
                },
                {
                  region_id: indiaRegion.id,
                  amount: 0,
                },
              ],
              rules: [
                {
                  attribute: "enabled_in_store",
                  value: "true",
                  operator: "eq",
                },
                {
                  attribute: "is_return",
                  value: "false",
                  operator: "eq",
                },
              ],
            },
          ],
        })
        console.log("Shipping option for India created.")
      }
    }
  } catch (err: any) {
    console.error("Fulfillment setup note:", err.message)
  }

  console.log("4. Updating Handwritten Letters variant price...")
  const { data: products } = await query.graph({
    entity: "product",
    fields: ["id", "title", "handle", "variants.id", "variants.title"],
    filters: { handle: "handwritten-letters" },
  })

  if (products.length && products[0].variants?.length) {
    const variant = products[0].variants[0]
    console.log(`Found variant ${variant.id} for Handwritten Letters. Adding INR 1500 price...`)
    
    await updateProductVariantsWorkflow(container).run({
      input: {
        product_variants: [
          {
            id: variant.id,
            prices: [
              {
                currency_code: "inr",
                amount: 1500,
              },
            ],
          },
        ],
      },
    })
    console.log("Handwritten Letters variant price updated to 1500 INR successfully!")
  } else {
    console.warn("Handwritten Letters product/variant not found!")
  }

  console.log("Setup completed successfully!")
}
