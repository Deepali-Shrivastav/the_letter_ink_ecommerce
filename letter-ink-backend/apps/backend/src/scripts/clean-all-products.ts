import { ExecArgs } from "@medusajs/framework/types"
import { Modules } from "@medusajs/framework/utils"

export default async function cleanAllProducts({ container }: ExecArgs) {
  const productService = container.resolve(Modules.PRODUCT)

  try {
    const products = await productService.listProducts({})
    
    if (products.length === 0) {
      console.log("No products found to delete.")
      return;
    }
    
    console.log(`Found ${products.length} products. Deleting all of them...`);
    
    for (const p of products) {
      await productService.deleteProducts([p.id])
      console.log(`Deleted product: ${p.title} (${p.id})`)
    }
    
    console.log("All products cleaned up successfully!");
  } catch (err) {
    console.error("Error cleaning products:", err)
  }
}
