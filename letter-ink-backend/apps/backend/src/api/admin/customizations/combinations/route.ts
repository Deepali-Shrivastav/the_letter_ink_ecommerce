import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { CUSTOMIZATIONS_MODULE } from "../../../../modules/customizations"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const customizationService = req.scope.resolve(CUSTOMIZATIONS_MODULE)
  const { product_id } = req.query as { product_id?: string }
  
  const combinations = await customizationService.listCustomizationCombinations(
    product_id ? { product_id } : {},
    { relations: ["values", "values.option"] }
  )
  
  res.json({ combinations })
}

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const customizationService = req.scope.resolve(CUSTOMIZATIONS_MODULE)
  const combination = await customizationService.createCustomizationCombinations(req.body as any)
  res.json({ combination })
}

export async function DELETE(req: MedusaRequest, res: MedusaResponse) {
  const customizationService = req.scope.resolve(CUSTOMIZATIONS_MODULE)
  const { id } = req.query as { id?: string }
  
  if (!id) {
    return res.status(400).json({ error: "Combination ID is required" })
  }

  try {
    await customizationService.deleteCustomizationCombinations(id)
    res.json({ success: true })
  } catch (error: any) {
    console.error("Failed to delete customization combination:", error)
    res.status(500).json({ error: error.message || "Failed to delete combination" })
  }
}

