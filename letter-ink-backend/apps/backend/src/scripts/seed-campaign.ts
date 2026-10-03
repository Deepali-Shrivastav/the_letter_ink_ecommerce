import { ExecArgs } from "@medusajs/framework/types";
import { Modules } from "@medusajs/framework/utils";

export default async function seedCampaign({ container }: ExecArgs) {
  const promotionModuleService = container.resolve(Modules.PROMOTION);
  const logger = container.resolve("logger");

  try {
    // Check if campaign already exists
    const existing = await promotionModuleService.listCampaigns({
      campaign_identifier: ["INKMAGIC"]
    });

    if (existing.length === 0) {
      logger.info("Creating default INKMAGIC campaign...");
      
      const campaign = await promotionModuleService.createCampaigns({
        name: "Complimentary Artisanal Gift Packaging",
        campaign_identifier: "INKMAGIC",
        description: "Get complimentary artisanal gift packaging and wax sealing on your order.",
        starts_at: new Date(),
        ends_at: new Date(new Date().setFullYear(new Date().getFullYear() + 1)), // 1 year from now
      });

      logger.info(`Campaign created: ${campaign.id}`);

      // Create a promotion linked to the campaign
      const promotion = await promotionModuleService.createPromotions({
        code: "INKMAGIC",
        type: "standard",
        is_automatic: false,
        status: "active",
        campaign_id: campaign.id,
        application_method: {
          type: "fixed",
          target_type: "order",
          value: 0, // This represents free gift packaging. In a real scenario, it could be a percentage or specific fixed value.
          currency_code: "inr"
        }
      });

      logger.info(`Promotion created: ${promotion.id}`);
    } else {
      logger.info("INKMAGIC campaign already exists!");
    }
  } catch (e) {
    logger.error("Error creating campaign:", e);
  }
}
