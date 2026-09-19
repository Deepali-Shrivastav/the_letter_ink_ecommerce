import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import CustomisationModuleService from "../../../../../../modules/customisation/service";
import { CUSTOMISATION_MODULE } from "../../../../../../modules/customisation";

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const { id } = req.params;
  const customisationService: CustomisationModuleService = req.scope.resolve(CUSTOMISATION_MODULE);
  const payload = req.body as any;
  payload.group_id = id;
  const option = await customisationService.createCustomisationOptions(payload);
  res.json({ option });
}
