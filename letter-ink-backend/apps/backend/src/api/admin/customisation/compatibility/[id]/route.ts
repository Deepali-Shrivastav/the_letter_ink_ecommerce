import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import CustomisationModuleService from "../../../../../modules/customisation/service";
import { CUSTOMISATION_MODULE } from "../../../../../modules/customisation";

export async function DELETE(req: MedusaRequest, res: MedusaResponse) {
  const { id } = req.params;
  const customisationService: CustomisationModuleService = req.scope.resolve(CUSTOMISATION_MODULE);
  await customisationService.deleteCustomisationCompatibilityRules(id);
  res.status(200).json({ id, object: "customisation_compatibility_rule", deleted: true });
}
