import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { IPromotionModuleService } from "@medusajs/framework/types";
import { Modules } from "@medusajs/framework/utils";

export const GET = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  const promotionModuleService: IPromotionModuleService = req.scope.resolve(Modules.PROMOTION);

  // Fetch active campaigns (or all campaigns for now)
  const campaigns = await promotionModuleService.listCampaigns({});

  res.json({
    campaigns,
  });
};
