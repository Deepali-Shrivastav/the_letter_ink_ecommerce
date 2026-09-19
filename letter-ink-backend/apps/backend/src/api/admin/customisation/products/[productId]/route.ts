import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import CustomisationModuleService from "../../../../../modules/customisation/service";
import { CUSTOMISATION_MODULE } from "../../../../../modules/customisation";

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const { productId } = req.params;
  const customisationService: CustomisationModuleService = req.scope.resolve(CUSTOMISATION_MODULE);
  
  const productGroups = await customisationService.listCustomisationProductGroups({ product_id: productId });
  res.json({ product_groups: productGroups });
}

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const { productId } = req.params;
  const customisationService: CustomisationModuleService = req.scope.resolve(CUSTOMISATION_MODULE);
  const payload = req.body as any;
  payload.product_id = productId;
  
  const productGroup = await customisationService.createCustomisationProductGroups(payload);
  res.json({ product_group: productGroup });
}
