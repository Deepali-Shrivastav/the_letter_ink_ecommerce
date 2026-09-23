import { ExecArgs } from "@medusajs/framework/types"
import { Modules } from "@medusajs/framework/utils"

export default async function cleanLegacyWorkshopProduct({ container }: ExecArgs) {
  const productService = container.resolve(Modules.PRODUCT)

  try {
    const products = await productService.listProducts({
      handle: ["workshop-calligraphy-masterclass", "bespoke-calligraphy-masterclass"]
    })

    for (const p of products) {
      await productService.deleteProducts([p.id])
      console.log(`Deleted legacy product from standard Products module: ${p.title} (${p.id})`)
    }
  } catch (err) {
    console.error("Error cleaning legacy workshop product:", err)
  }
}
