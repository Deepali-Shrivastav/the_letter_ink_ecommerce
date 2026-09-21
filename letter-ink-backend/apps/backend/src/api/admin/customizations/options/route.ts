import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { CUSTOMIZATIONS_MODULE } from "../../../../modules/customizations"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const customizationService = req.scope.resolve(CUSTOMIZATIONS_MODULE)
  const { product_id } = req.query as { product_id?: string }
  
  const options = await customizationService.listCustomizationOptions(
    product_id ? { product_id } : {},
    { relations: ["values"] }
  )
  
  res.json({ options })
}

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const customizationService = req.scope.resolve(CUSTOMIZATIONS_MODULE)
  const option = await customizationService.createCustomizationOptions(req.body as any)
  res.json({ option })
}

export async function DELETE(req: MedusaRequest, res: MedusaResponse) {
  const customizationService = req.scope.resolve(CUSTOMIZATIONS_MODULE)
  const { id } = req.query as { id?: string }
  
  if (!id) {
    return res.status(400).json({ error: "Option ID is required" })
  }

  try {
    // 1. Fetch child values for this option
    const values = await customizationService.listCustomizationOptionValues({ option_id: id })
    
    if (values && values.length > 0) {
      const valueIds = values.map((v: any) => v.id)
      
      // 2. Clean up any combinations that only consist of these values
      const allCombinations = await customizationService.listCustomizationCombinations(
        {},
        { relations: ["values"] }
      )
      
      for (const comb of allCombinations) {
        const remainingValues = (comb.values || []).filter((v: any) => !valueIds.includes(v.id))
        if (remainingValues.length === 0) {
          await customizationService.deleteCustomizationCombinations(comb.id)
        }
      }
      
      // 3. Delete the option values (this cascades to the pivot table)
      await customizationService.deleteCustomizationOptionValues(valueIds)
    }

    // 4. Now safe to delete the option itself
    await customizationService.deleteCustomizationOptions(id)

    res.json({ success: true })
  } catch (error: any) {
    console.error("Failed to delete customization option:", error)
    res.status(500).json({ error: error.message || "Failed to delete customization option" })
  }
}

