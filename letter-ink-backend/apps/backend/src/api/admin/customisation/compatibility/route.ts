import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import CustomisationModuleService from "../../../../modules/customisation/service";
import { CUSTOMISATION_MODULE } from "../../../../modules/customisation";

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const customisationService: CustomisationModuleService = req.scope.resolve(CUSTOMISATION_MODULE);
  const rules = await customisationService.listCustomisationCompatibilityRules();
  res.json({ rules });
}

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const customisationService: CustomisationModuleService = req.scope.resolve(CUSTOMISATION_MODULE);
  const rule = await customisationService.createCustomisationCompatibilityRules(req.body as any);
  res.json({ rule });
}
