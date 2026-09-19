import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import CustomisationModuleService from "../../../../modules/customisation/service";
import { CUSTOMISATION_MODULE } from "../../../../modules/customisation";

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const customisationService: CustomisationModuleService = req.scope.resolve(CUSTOMISATION_MODULE);
  const groups = await customisationService.listCustomisationGroups({}, { relations: ["options"] });
  res.json({ groups });
}

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const customisationService: CustomisationModuleService = req.scope.resolve(CUSTOMISATION_MODULE);
  const group = await customisationService.createCustomisationGroups(req.body as any);
  res.json({ group });
}
