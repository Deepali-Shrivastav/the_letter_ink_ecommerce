import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { CUSTOMISATION_MODULE } from "../../../../../../modules/customisation";
import CustomisationModuleService from "../../../../../../modules/customisation/service";

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const customisationService: CustomisationModuleService = req.scope.resolve(CUSTOMISATION_MODULE);
  const existing = await customisationService.listCustomisationTextFields({ product_id: req.params.productId });
  res.json({ text_field: existing[0] || null });
}

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const customisationService: CustomisationModuleService = req.scope.resolve(CUSTOMISATION_MODULE);
  const body = req.body as any;
  body.product_id = req.params.productId;
  
  const existing = await customisationService.listCustomisationTextFields({ product_id: req.params.productId });
  if (existing.length > 0) {
    const textField = await customisationService.updateCustomisationTextFields(existing[0].id, body);
    res.json({ text_field: textField });
  } else {
    const textField = await customisationService.createCustomisationTextFields(body);
    res.json({ text_field: textField });
  }
}
