import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { CUSTOMIZATIONS_MODULE } from "../../../../modules/customizations"
import { createCustomizationCombinationSchema, idParamSchema } from "../../../common/validation"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const logger = req.scope.resolve("logger", { allowUnregistered: true }) as any
  const customizationService = req.scope.resolve(CUSTOMIZATIONS_MODULE)
  const { product_id } = req.query as { product_id?: string }
  
  try {
    const combinations = await customizationService.listCustomizationCombinations(
      product_id ? { product_id } : {},
      { relations: ["values", "values.option"] }
    )
    
    res.json({ combinations: combinations || [] })
  } catch (err: any) {
    logger?.error?.("Failed to list customization combinations:", err)
    res.status(500).json({ error: "Failed to retrieve combinations" })
  }
}

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const logger = req.scope.resolve("logger", { allowUnregistered: true }) as any
  const validation = createCustomizationCombinationSchema.safeParse(req.body)
  if (!validation.success) {
    return res.status(400).json({
      error: "Invalid combination data",
      details: validation.error.flatten().fieldErrors,
    })
  }

  const customizationService = req.scope.resolve(CUSTOMIZATIONS_MODULE)

  try {
    const combination = await customizationService.createCustomizationCombinations(validation.data as any)
    res.status(201).json({ combination })
  } catch (err: any) {
    logger?.error?.("Failed to create customization combination:", err)
    res.status(500).json({ error: "Failed to create combination" })
  }
}

export async function DELETE(req: MedusaRequest, res: MedusaResponse) {
  const logger = req.scope.resolve("logger", { allowUnregistered: true }) as any
  const customizationService = req.scope.resolve(CUSTOMIZATIONS_MODULE)
  const { id } = req.query as { id?: string }
  
  const validation = idParamSchema.safeParse(id)
  if (!validation.success) {
    return res.status(400).json({ error: "Valid combination ID is required" })
  }

  const validId = validation.data

  try {
    await customizationService.deleteCustomizationCombinations(validId)
    res.json({ success: true, id: validId })
  } catch (error: any) {
    logger?.error?.(`Failed to delete customization combination ${validId}:`, error)
    res.status(500).json({ error: "Failed to delete combination" })
  }
}
