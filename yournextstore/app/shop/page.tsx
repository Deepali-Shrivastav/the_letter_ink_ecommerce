import type { Metadata } from "next";
import { ShopPageClient } from "@/components/sections/shop-page-client";

export const metadata: Metadata = {
	title: "Shop - The Letter Ink",
	description: "Handcrafted Stationery & Inscribed Keepsakes",
};

export default function ShopPage() {
	return (
		<div className="bg-background min-h-screen">
			<ShopPageClient />
		</div>
	);
}
