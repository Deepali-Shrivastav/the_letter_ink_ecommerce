import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { ExecArgs } from "@medusajs/framework/types"

export default async function myScript({ container }: ExecArgs) {
  const productModule = container.resolve("product")
  const customizationService = container.resolve("customizations")

  // Find a product to attach customization to
  const products = await productModule.listProducts({}, { take: 1 })
  if (products.length === 0) {
    console.log("No products found to attach customizations to")
    return
  }
  const product = products[0]

  console.log(`Creating customization for product ${product.id}`)

  // Create option
  const option = await customizationService.createCustomizationOptions({
    product_id: product.id,
    title: "Ink Color",
  })
  
  console.log("Created option", option.id)

  // Create values
  const val1 = await customizationService.createCustomizationOptionValues({
    option_id: option.id,
    value: "Black",
  })
  const val2 = await customizationService.createCustomizationOptionValues({
    option_id: option.id,
    value: "Gold",
  })

  console.log("Created values", val1.id, val2.id)

  // Create combination with values
  const comb = await customizationService.createCustomizationCombinations({
    product_id: product.id,
    price_adjustment: 500, // $5.00
    status: "active",
    values: [val1.id, val2.id]
  })

  console.log("Created combination", comb.id)
  
  const fetched = await customizationService.listCustomizationCombinations(
    { id: comb.id },
    { relations: ["values"] }
  )
  console.log("Fetched combination values:", fetched[0]?.values)
}
