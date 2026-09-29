import { medusaClient } from "@/lib/medusa";

export async function getActiveCampaigns() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL;
    const apiKey = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY;
    
    const res = await fetch(`${baseUrl}/store/campaigns/active`, {
      headers: {
        "x-publishable-api-key": apiKey || "",
      },
      next: { revalidate: 300 } // cache for 5 minutes
    });

    if (!res.ok) return [];
    
    const json = await res.json();
    return json.campaigns || [];
  } catch (e) {
    return [];
  }
}
