import { ExecArgs } from "@medusajs/framework/types"

export default async function inspectVariant({ container }: ExecArgs) {
  const query = container.resolve("query")

  const { data: products } = await query.graph({
    entity: "product",
    fields: ["id", "title", "handle", "variants.*"],
    filters: { handle: "name-frame-royal-large" },
  })

  console.log("Working product variant:", JSON.stringify(products[0]?.variants?.[0], null, 2))

  const { data: testProducts } = await query.graph({
    entity: "product",
    fields: ["id", "title", "handle", "variants.*"],
    filters: { handle: "grand-royal-illuminated-monogram-float-frame" },
  })

  console.log("Our test product variant:", JSON.stringify(testProducts[0]?.variants?.[0], null, 2))

  const { data: stockLocations } = await query.graph({
    entity: "stock_location",
    fields: ["id", "name", "sales_channels.*"],
  })
  console.log("Stock locations:", JSON.stringify(stockLocations, null, 2))
}
