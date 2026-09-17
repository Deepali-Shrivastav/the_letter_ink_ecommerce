import type { Metadata } from "next";
import { GiftingPageClient } from "@/components/sections/gifting-page-client";

export const metadata: Metadata = {
	title: "Artisanal Gifting Atelier - Gifts for Every Milestone",
	description:
		"Meaningful, hand-inscribed treasures crafted with timeless scripts, botanical wax seals, and heirloom framing designed to hold love across generations.",
};

export default function GiftingPage() {
	return <GiftingPageClient />;
}
