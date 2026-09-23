import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { CUSTOMIZATIONS_MODULE } from "../../../../modules/customizations"
import { createCustomizationValueSchema, idParamSchema } from "../../../common/validation"

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const logger = req.scope.resolve("logger", { allowUnregistered: true }) as any
  const validation = createCustomizationValueSchema.safeParse(req.body)
  if (!validation.success) {
    return res.status(400).json({
      error: "Invalid value data",
      details: validation.error.flatten().fieldErrors,
    })
  }

  const customizationService = req.scope.resolve(CUSTOMIZATIONS_MODULE)

  try {
    const value = await customizationService.createCustomizationOptionValues(validation.data as any)
    res.status(201).json({ value })
  } catch (err: any) {
    logger?.error?.("Failed to create customization value:", err)
    res.status(500).json({ error: "Failed to create customization value" })
  }
}

export async function DELETE(req: MedusaRequest, res: MedusaResponse) {
  const logger = req.scope.resolve("logger", { allowUnregistered: true }) as any
  const customizationService = req.scope.resolve(CUSTOMIZATIONS_MODULE)
  const { id } = req.query as { id?: string }
  
  const validation = idParamSchema.safeParse(id)
  if (!validation.success) {
    return res.status(400).json({ error: "Valid Value ID is required" })
  }

  const validId = validation.data

  try {
    // Check if any combinations become empty after deleting this value
    const allCombinations = await customizationService.listCustomizationCombinations(
      {},
      { relations: ["values"] }
    )
    
    for (const comb of allCombinations) {
      const usesThisValue = (comb.values || []).some((v: any) => v.id === validId)
      if (usesThisValue) {
        const remaining = comb.values.filter((v: any) => v.id !== validId)
        if (remaining.length === 0) {
          await customizationService.deleteCustomizationCombinations(comb.id)
        }
      }
    }

    await customizationService.deleteCustomizationOptionValues(validId)
    res.json({ success: true, id: validId })
  } catch (error: any) {
    logger?.error?.(`Failed to delete customization option value ${validId}:`, error)
    res.status(500).json({ error: "Failed to delete customization value" })
  }
}
