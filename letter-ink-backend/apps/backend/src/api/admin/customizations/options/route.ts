import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { CUSTOMIZATIONS_MODULE } from "../../../../modules/customizations"
import { createCustomizationOptionSchema, idParamSchema } from "../../../common/validation"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const logger = req.scope.resolve("logger", { allowUnregistered: true }) as any
  const customizationService = req.scope.resolve(CUSTOMIZATIONS_MODULE)
  const { product_id } = req.query as { product_id?: string }
  
  try {
    const options = await customizationService.listCustomizationOptions(
      product_id ? { product_id } : {},
      { relations: ["values"] }
    )
    
    res.json({ options: options || [] })
  } catch (err: any) {
    logger?.error?.("Failed to list customization options:", err)
    res.status(500).json({ error: "Failed to retrieve options" })
  }
}

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const logger = req.scope.resolve("logger", { allowUnregistered: true }) as any
  const validation = createCustomizationOptionSchema.safeParse(req.body)
  if (!validation.success) {
    return res.status(400).json({
      error: "Invalid option data",
      details: validation.error.flatten().fieldErrors,
    })
  }

  const customizationService = req.scope.resolve(CUSTOMIZATIONS_MODULE)

  try {
    const option = await customizationService.createCustomizationOptions(validation.data as any)
    res.status(201).json({ option })
  } catch (err: any) {
    logger?.error?.("Failed to create customization option:", err)
    res.status(500).json({ error: "Failed to create customization option" })
  }
}

export async function DELETE(req: MedusaRequest, res: MedusaResponse) {
  const logger = req.scope.resolve("logger", { allowUnregistered: true }) as any
  const customizationService = req.scope.resolve(CUSTOMIZATIONS_MODULE)
  const { id } = req.query as { id?: string }
  
  const validation = idParamSchema.safeParse(id)
  if (!validation.success) {
    return res.status(400).json({ error: "Valid Option ID is required" })
  }

  const validId = validation.data

  try {
    // 1. Fetch child values for this option
    const values = await customizationService.listCustomizationOptionValues({ option_id: validId })
    
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
    await customizationService.deleteCustomizationOptions(validId)

    res.json({ success: true, id: validId })
  } catch (error: any) {
    logger?.error?.(`Failed to delete customization option ${validId}:`, error)
    res.status(500).json({ error: "Failed to delete customization option" })
  }
}
