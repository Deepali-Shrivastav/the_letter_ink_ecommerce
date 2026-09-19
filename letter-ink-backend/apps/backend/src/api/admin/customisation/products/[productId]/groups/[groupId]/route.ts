import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import CustomisationModuleService from "../../../../../../modules/customisation/service";
import { CUSTOMISATION_MODULE } from "../../../../../../modules/customisation";

export async function DELETE(req: MedusaRequest, res: MedusaResponse) {
  const { productId, groupId } = req.params;
  const customisationService: CustomisationModuleService = req.scope.resolve(CUSTOMISATION_MODULE);
  
  const productGroups = await customisationService.listCustomisationProductGroups({ 
    product_id: productId,
    group_id: groupId
  });
  
  for (const pg of productGroups) {
    await customisationService.deleteCustomisationProductGroups(pg.id);
  }
  
  res.status(200).json({ success: true, deleted: true });
}
