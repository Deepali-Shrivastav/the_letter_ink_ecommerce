import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { CUSTOMIZATIONS_MODULE } from "../../../../../modules/customizations"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const customizationService = req.scope.resolve(CUSTOMIZATIONS_MODULE)
  const product_id = req.params.id
  
  const options = await customizationService.listCustomizationOptions(
    { product_id },
    { relations: ["values"] }
  )

  const combinations = await customizationService.listCustomizationCombinations(
    { product_id, status: "active" },
    { relations: ["values"] }
  )
  
  res.json({ options, combinations })
}
