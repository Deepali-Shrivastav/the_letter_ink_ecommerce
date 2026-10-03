import { NextResponse } from "next/server";
import { getActiveCampaigns } from "@/lib/campaigns";

export async function GET() {
	try {
		const campaigns = await getActiveCampaigns();
		return NextResponse.json({ campaigns: campaigns || [] });
	} catch {
		return NextResponse.json({ campaigns: [] });
	}
}
