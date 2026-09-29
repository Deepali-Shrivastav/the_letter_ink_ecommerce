import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { Modules } from "@medusajs/framework/utils";

export const GET = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  try {
    const promotionModuleService = req.scope.resolve(Modules.PROMOTION);
    const now = new Date();

    const campaigns = await promotionModuleService.listCampaigns({}, {
      relations: ["promotions"]
    });

    const activeCampaigns = campaigns.filter(c => {
      if (c.starts_at && new Date(c.starts_at) > now) return false;
      if (c.ends_at && new Date(c.ends_at) < now) return false;
      if (!c.promotions || c.promotions.length === 0) return false;
      return true;
    });

    res.json({
      campaigns: activeCampaigns.map(c => ({
        id: c.id,
        name: c.name,
        description: c.description,
        starts_at: c.starts_at,
        ends_at: c.ends_at,
        promotions: c.promotions?.filter(p => p.status === "active" || !p.status).map(p => ({
          id: p.id,
          code: p.code,
          type: p.type,
          is_automatic: p.is_automatic
        }))
      }))
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch campaigns" });
  }
};
