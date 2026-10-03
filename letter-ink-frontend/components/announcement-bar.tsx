import { getActiveCampaigns } from "@/lib/campaigns";
import { CampaignBanner } from "./campaign-banner";

export async function AnnouncementBar() {
	try {
		const campaigns = await getActiveCampaigns();
		if (!campaigns || campaigns.length === 0) return null;

		const campaign = campaigns[0];
		return <CampaignBanner campaign={campaign} />;
	} catch {
		return null;
	}
}
