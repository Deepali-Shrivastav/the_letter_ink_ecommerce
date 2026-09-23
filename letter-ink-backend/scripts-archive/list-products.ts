import { ExecArgs } from "@medusajs/framework/types"
import { Modules } from "@medusajs/framework/utils"

export default async function listProducts({ container }: ExecArgs) {
  const productService = container.resolve(Modules.PRODUCT)

  try {
    const products = await productService.listProducts({})
    
    console.log("Found", products.length, "products:");
    for (const p of products) {
      console.log(`- ${p.title} (${p.handle}) [ID: ${p.id}]`)
    }
  } catch (err) {
    console.error("Error listing products:", err)
  }
}
