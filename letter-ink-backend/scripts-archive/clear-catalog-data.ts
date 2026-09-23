import { ExecArgs } from "@medusajs/framework/types"
import { Modules } from "@medusajs/framework/utils"
import { WORKSHOP_MODULE } from "../modules/workshop"

export default async function clearCatalogData({ container }: ExecArgs) {
  console.log("==========================================")
  console.log("   Starting Medusa Catalog Data Cleanup   ")
  console.log("==========================================")

  // 1. Customizations Module
  try {
    const customizationsService = container.resolve("customizations") as any
    if (customizationsService) {
      console.log("Cleaning customizations...")
      const combinations = await customizationsService.listCustomizationCombinations?.({}).catch(() => [])
      if (combinations?.length) {
        await customizationsService.deleteCustomizationCombinations(combinations.map((c: any) => c.id))
        console.log(`Deleted ${combinations.length} customization combinations.`)
      }
      const values = await customizationsService.listCustomizationOptionValues?.({}).catch(() => [])
      if (values?.length) {
        await customizationsService.deleteCustomizationOptionValues(values.map((v: any) => v.id))
        console.log(`Deleted ${values.length} customization option values.`)
      }
      const options = await customizationsService.listCustomizationOptions?.({}).catch(() => [])
      if (options?.length) {
        await customizationsService.deleteCustomizationOptions(options.map((o: any) => o.id))
        console.log(`Deleted ${options.length} customization options.`)
      }
    }
  } catch (err: any) {
    console.warn("Notice: Customizations cleanup skipped or errored:", err.message)
  }

  // 2. Workshop Module
  try {
    const workshopService = container.resolve(WORKSHOP_MODULE) as any
    if (workshopService) {
      console.log("Cleaning workshops...")
      const workshops = await workshopService.listWorkshops({}).catch(() => [])
      if (workshops?.length) {
        await workshopService.deleteWorkshops(workshops.map((w: any) => w.id))
        console.log(`Deleted ${workshops.length} workshops.`)
      } else {
        console.log("No workshops found.")
      }
    }
  } catch (err: any) {
    console.warn("Notice: Workshop cleanup skipped or errored:", err.message)
  }

  // 3. Products
  const productService = container.resolve(Modules.PRODUCT) as any
  try {
    console.log("Cleaning products...")
    const products = await productService.listProducts({})
    if (products?.length) {
      console.log(`Found ${products.length} products to delete...`)
      for (const p of products) {
        await productService.deleteProducts([p.id])
        console.log(`Deleted product: ${p.title} (${p.id})`)
      }
      console.log(`Successfully deleted all ${products.length} products.`)
    } else {
      console.log("No products found.")
    }
  } catch (err: any) {
    console.error("Error deleting products:", err.message)
  }

  // 4. Product Collections
  try {
    console.log("Cleaning product collections...")
    const collections = await productService.listProductCollections({})
    if (collections?.length) {
      for (const c of collections) {
        await productService.deleteProductCollections([c.id])
        console.log(`Deleted collection: ${c.title} (${c.id})`)
      }
    } else {
      console.log("No collections found.")
    }
  } catch (err: any) {
    console.warn("Notice: Collection cleanup skipped or errored:", err.message)
  }

  // 5. Product Categories
  try {
    console.log("Cleaning product categories...")
    const categories = await productService.listProductCategories({})
    if (categories?.length) {
      for (const cat of categories) {
        await productService.deleteProductCategories([cat.id])
        console.log(`Deleted category: ${cat.name} (${cat.id})`)
      }
    } else {
      console.log("No categories found.")
    }
  } catch (err: any) {
    console.warn("Notice: Category cleanup skipped or errored:", err.message)
  }

  // 6. Product Tags
  try {
    console.log("Cleaning product tags...")
    const tags = await productService.listProductTags({})
    if (tags?.length) {
      for (const tag of tags) {
        await productService.deleteProductTags([tag.id])
        console.log(`Deleted tag: ${tag.value} (${tag.id})`)
      }
    } else {
      console.log("No product tags found.")
    }
  } catch (err: any) {
    console.warn("Notice: Tag cleanup skipped or errored:", err.message)
  }

  // 7. Inventory items
  try {
    const inventoryService = container.resolve(Modules.INVENTORY) as any
    if (inventoryService) {
      console.log("Cleaning inventory items...")
      const [items] = await inventoryService.listInventoryItems({})
      if (items?.length) {
        for (const item of items) {
          await inventoryService.deleteInventoryItems([item.id])
          console.log(`Deleted inventory item: ${item.sku || item.id}`)
        }
      } else {
        console.log("No inventory items found.")
      }
    }
  } catch (err: any) {
    console.warn("Notice: Inventory cleanup skipped or errored:", err.message)
  }

  // 8. Carts
  try {
    const cartService = container.resolve(Modules.CART) as any
    if (cartService) {
      console.log("Cleaning carts...")
      const carts = await cartService.listCarts({})
      if (carts?.length) {
        for (const cart of carts) {
          await cartService.deleteCarts([cart.id])
          console.log(`Deleted cart: ${cart.id}`)
        }
      } else {
        console.log("No carts found.")
      }
    }
  } catch (err: any) {
    console.warn("Notice: Cart cleanup skipped or errored:", err.message)
  }

  console.log("==========================================")
  console.log("Catalog cleanup completed successfully!  ")
  console.log("Admin accounts and API keys preserved.   ")
  console.log("==========================================")
}
