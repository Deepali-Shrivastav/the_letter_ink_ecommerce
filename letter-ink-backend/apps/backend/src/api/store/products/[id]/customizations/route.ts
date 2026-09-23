import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { CUSTOMIZATIONS_MODULE } from "../../../../../modules/customizations"
import { idParamSchema } from "../../../../common/validation"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const logger = req.scope.resolve("logger", { allowUnregistered: true }) as any
  const validation = idParamSchema.safeParse(req.params.id)
  if (!validation.success) {
    return res.status(400).json({ message: "Invalid product identifier" })
  }

  const product_id = validation.data
  const customizationService = req.scope.resolve(CUSTOMIZATIONS_MODULE)
  
  try {
    const options = await customizationService.listCustomizationOptions(
      { product_id },
      { relations: ["values"] }
    )

    const combinations = await customizationService.listCustomizationCombinations(
      { product_id, status: "active" },
      { relations: ["values"] }
    )
    
    res.json({ options: options || [], combinations: combinations || [] })
  } catch (err: any) {
    logger?.error?.(`Failed to retrieve customizations for product ${product_id}:`, err)
    res.status(500).json({ message: "Failed to retrieve product customizations" })
  }
}
