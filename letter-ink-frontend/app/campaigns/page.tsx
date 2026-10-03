import { cacheLife } from "next/cache";
import { Suspense } from "react";

async function getCampaigns() {
	"use cache";
	cacheLife("minutes");
	try {
		const baseUrl = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL;
		const apiKey = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY;

		const res = await fetch(`${baseUrl}/store/campaigns/active`, {
			headers: {
				"x-publishable-api-key": apiKey || "",
			},
		});

		if (!res.ok) {
			return [];
		}

		const json = await res.json();
		return json.campaigns || [];
	} catch (_e) {
		return [];
	}
}

async function CampaignList() {
	const campaigns = await getCampaigns();
	if (campaigns.length === 0) {
		return (
			<p className="text-lg text-muted-foreground">
				There are no active campaigns at the moment. Please check back later!
			</p>
		);
	}
	return (
		<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
			{campaigns.map((campaign: any) => (
				<div key={campaign.id} className="border border-border rounded-xl p-6 bg-card flex flex-col gap-4">
					<h2 className="text-2xl font-semibold">{campaign.name}</h2>
					<div className="text-muted-foreground flex-1">
						<p>{campaign.description || "Special promotional offer."}</p>
					</div>
					<div className="flex flex-col gap-2 mt-4 pt-4 border-t border-border">
						<p className="text-sm font-medium">
							Use code:{" "}
							<span className="bg-primary/10 text-primary px-2 py-1 rounded font-mono uppercase">
								{campaign.promotions?.[0]?.code || "AUTO"}
							</span>
						</p>
						{(campaign.starts_at || campaign.ends_at) && (
							<p className="text-xs text-muted-foreground">
								{campaign.starts_at
									? `Valid from ${new Date(campaign.starts_at).toLocaleDateString()}`
									: "Valid"}
								{campaign.ends_at ? ` to ${new Date(campaign.ends_at).toLocaleDateString()}` : " onwards"}
							</p>
						)}
					</div>
				</div>
			))}
		</div>
	);
}

export default function CampaignsPage() {
	return (
		<div className="max-w-7xl mx-auto px-4 py-16">
			<h1 className="text-4xl font-display-hero text-primary tracking-tight mb-8">
				Current Campaigns & Promotions
			</h1>
			<Suspense fallback={<p className="text-muted-foreground">Loading active promotions...</p>}>
				<CampaignList />
			</Suspense>
		</div>
	);
}
