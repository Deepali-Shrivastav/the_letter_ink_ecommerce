import { ExecArgs } from "@medusajs/framework/types"
import { Modules } from "@medusajs/framework/utils"

export default async function deleteProduct1({ container }: ExecArgs) {
  const productService = container.resolve(Modules.PRODUCT)
  try {
    const products = await productService.listProducts({ handle: "product-1" })
    if (products.length > 0) {
      await productService.deleteProducts([products[0].id])
      console.log("Deleted product-1 successfully!")
    } else {
      console.log("product-1 not found.")
    }
  } catch (err) {
    console.error("Error deleting product-1:", err)
  }
}
