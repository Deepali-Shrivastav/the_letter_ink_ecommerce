import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { CUSTOMIZATIONS_MODULE } from "../../../../modules/customizations"

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const customizationService = req.scope.resolve(CUSTOMIZATIONS_MODULE)
  const value = await customizationService.createCustomizationOptionValues(req.body as any)
  res.json({ value })
}

export async function DELETE(req: MedusaRequest, res: MedusaResponse) {
  const customizationService = req.scope.resolve(CUSTOMIZATIONS_MODULE)
  const { id } = req.query as { id?: string }
  
  if (!id) {
    return res.status(400).json({ error: "Value ID is required" })
  }

  try {
    // Check if any combinations become empty after deleting this value
    const allCombinations = await customizationService.listCustomizationCombinations(
      {},
      { relations: ["values"] }
    )
    
    for (const comb of allCombinations) {
      const usesThisValue = (comb.values || []).some((v: any) => v.id === id)
      if (usesThisValue) {
        const remaining = comb.values.filter((v: any) => v.id !== id)
        if (remaining.length === 0) {
          await customizationService.deleteCustomizationCombinations(comb.id)
        }
      }
    }

    await customizationService.deleteCustomizationOptionValues(id)
    res.json({ success: true })
  } catch (error: any) {
    console.error("Failed to delete customization option value:", error)
    res.status(500).json({ error: error.message || "Failed to delete customization value" })
  }
}

