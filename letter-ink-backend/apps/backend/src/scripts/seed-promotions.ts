import { ExecArgs } from "@medusajs/framework/types";
import { Modules } from "@medusajs/framework/utils";

export default async function seedPromotionsScript({ container }: ExecArgs) {
  const promotionModuleService = container.resolve(Modules.PROMOTION);

  console.log("Seeding campaigns and promotions...");

  // 1. Welcome Campaign
  const existingWelcome = await promotionModuleService.listPromotions({ code: ["WELCOME10"] });
  if (existingWelcome.length === 0) {
    const welcomeCampaign = await promotionModuleService.createCampaigns({
      name: "Welcome Offer",
      description: "10% off for new shoppers (First Order)",
      campaign_identifier: "WELCOME_2026",
      starts_at: new Date(),
      budget: {
        type: "usage",
        limit: 1000,
      }
    });

    await promotionModuleService.createPromotions({
      code: "WELCOME10",
      type: "standard",
      is_automatic: false,
      status: "active",
      campaign_id: welcomeCampaign.id,
      application_method: {
        type: "percentage",
        target_type: "order",
        value: 10,
        allocation: "across",
        target_rules: []
      },
      rules: [
        {
          attribute: "subtotal",
          operator: "gte",
          values: ["500"]
        }
      ]
    });
    console.log("WELCOME10 promotion created.");
  } else {
    console.log("WELCOME10 promotion already exists.");
  }

  // 2. Artisanal Hamper Promotion (₹500 off)
  const existingHamper = await promotionModuleService.listPromotions({ code: ["GIFTFEST"] });
  if (existingHamper.length === 0) {
    const hamperCampaign = await promotionModuleService.createCampaigns({
      name: "Gifting Festival",
      description: "₹500 off on hampers",
      campaign_identifier: "GIFTFEST_2026",
      starts_at: new Date(),
      budget: {
        type: "usage",
        limit: 500,
      }
    });

    await promotionModuleService.createPromotions({
      code: "GIFTFEST",
      type: "standard",
      is_automatic: false,
      status: "active",
      campaign_id: hamperCampaign.id,
      application_method: {
        type: "fixed",
        target_type: "order", 
        value: 500,
        currency_code: "inr",
        allocation: "across",
        target_rules: []
      },
      rules: [
        {
          attribute: "subtotal",
          operator: "gte",
          values: ["3000"]
        }
      ]
    });
    console.log("GIFTFEST promotion created.");
  } else {
    console.log("GIFTFEST promotion already exists.");
  }

  console.log("Seed complete.");
}
