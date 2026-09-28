import { commerce } from "@/lib/commerce";

export async function AnnouncementBar() {
  let campaigns = [];
  try {
    const res = await commerce.request("/store/campaigns/active");
    if (res.campaigns && res.campaigns.length > 0) {
      campaigns = res.campaigns;
    }
  } catch (error) {
    // Graceful fallback if endpoint is unavailable
  }

  if (campaigns.length === 0) return null;

  // For V1, just display the first active campaign with a promotion
  const campaign = campaigns[0];
  const promo = campaign.promotions?.[0];

  if (!promo || promo.is_automatic) {
    return (
      <div className="bg-primary text-primary-foreground text-center py-2 px-4 text-xs sm:text-sm font-medium">
        {campaign.name}: {campaign.description}
      </div>
    );
  }

  return (
    <div className="bg-primary text-primary-foreground text-center py-2 px-4 text-xs sm:text-sm font-medium">
      {campaign.name}: {campaign.description}. Use code <strong className="bg-primary-foreground/20 px-1 rounded">{promo.code}</strong> at checkout!
    </div>
  );
}
