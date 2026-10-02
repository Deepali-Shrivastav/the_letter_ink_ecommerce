import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { IPromotionModuleService } from "@medusajs/framework/types";
import { Modules } from "@medusajs/framework/utils";

export const GET = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  const promotionModuleService: IPromotionModuleService = req.scope.resolve(Modules.PROMOTION);

  // Fetch only campaigns that are currently active
  const now = new Date();
  
  // Note: For a strictly secure store API, we only return campaigns that are currently active
  const allCampaigns = await promotionModuleService.listCampaigns({});
  
  const activeCampaigns = allCampaigns.filter(c => {
    const start = c.starts_at ? new Date(c.starts_at) : null;
    const end = c.ends_at ? new Date(c.ends_at) : null;
    
    if (start && start > now) return false;
    if (end && end < now) return false;
    return true;
  });

  // Strip sensitive info (like exact promo codes, budget limits) before returning to storefront
  const safeCampaigns = activeCampaigns.map(c => ({
    id: c.id,
    name: c.name,
    description: c.description,
    campaign_identifier: c.campaign_identifier,
    starts_at: c.starts_at,
    ends_at: c.ends_at,
  }));

  res.json({
    campaigns: safeCampaigns,
  });
};
