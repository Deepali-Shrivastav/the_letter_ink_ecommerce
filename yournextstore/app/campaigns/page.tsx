import { medusaClient } from "@/lib/medusa";
import { Suspense } from "react";
import { formatMoney } from "@/lib/money";
import { StoreConfigProvider } from "@/components/store-config-provider";

async function getCampaigns() {
  try {
    // We fetch from our custom /store/campaigns endpoint
    // medusaClient doesn't have campaigns bound, so we use its underlying request method or fetch
    const baseUrl = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL;
    const apiKey = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY;
    
    const res = await fetch(`${baseUrl}/store/campaigns/active`, {
      headers: {
        "x-publishable-api-key": apiKey || "",
      },
      cache: "no-store"
    });

    if (!res.ok) {
      console.error("Failed to fetch campaigns", await res.text());
      return [];
    }
    
    const json = await res.json();
    return json.campaigns || [];
  } catch (e) {
    console.error("Error fetching campaigns:", e);
    return [];
  }
}

export default async function CampaignsPage() {
  const campaigns = await getCampaigns();

  return (
    <StoreConfigProvider>
      <div className="max-w-7xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-display-hero text-primary tracking-tight mb-8">
          Current Campaigns & Promotions
        </h1>
        
        {campaigns.length === 0 ? (
          <p className="text-lg text-muted-foreground">There are no active campaigns at the moment. Please check back later!</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {campaigns.map((campaign: any) => (
              <div key={campaign.id} className="border border-border rounded-xl p-6 bg-card flex flex-col gap-4">
                <h2 className="text-2xl font-semibold">{campaign.name}</h2>
                <div className="text-muted-foreground flex-1">
                  <p>{campaign.description || "Special promotional offer."}</p>
                </div>
                <div className="flex flex-col gap-2 mt-4 pt-4 border-t border-border">
                  <p className="text-sm font-medium">
                    Use code: <span className="bg-primary/10 text-primary px-2 py-1 rounded font-mono uppercase">{campaign.promotions?.[0]?.code || "AUTO"}</span>
                  </p>
                  {(campaign.starts_at || campaign.ends_at) && (
                    <p className="text-xs text-muted-foreground">
                      {campaign.starts_at ? `Valid from ${new Date(campaign.starts_at).toLocaleDateString()}` : "Valid"} 
                      {campaign.ends_at ? ` to ${new Date(campaign.ends_at).toLocaleDateString()}` : " onwards"}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </StoreConfigProvider>
  );
}
