import { ExecArgs } from "@medusajs/framework/types"
import { Modules } from "@medusajs/framework/utils"

export default async function diagnoseStoreCurrency({ container }: ExecArgs) {
  const storeService = container.resolve(Modules.STORE)
  const regionService = container.resolve(Modules.REGION)
  const query = container.resolve("query")

  const [stores] = await storeService.listAndCountStores({})
  console.log("Stores:", JSON.stringify(stores, null, 2))

  const [regions] = await regionService.listAndCountRegions({})
  console.log("Regions:", JSON.stringify(regions, null, 2))

  const { data: variants } = await query.graph({
    entity: "product_variant",
    fields: ["id", "title", "product_id", "price_set.prices.*"]
  })
  console.log("Variants and prices count:", variants.length)
  for (const v of variants) {
    console.log(`Variant: ${v.id} (${v.title}) Product: ${v.product_id}`)
    console.log("Prices:", v.price_set?.prices)
  }
}
