import type { Metadata } from "next";
import { ShopPageClient } from "@/components/sections/shop-page-client";
import { commerce } from "@/lib/commerce";

export const metadata: Metadata = {
	title: "Shop - The Letter Ink",
	description: "Handcrafted Stationery & Inscribed Keepsakes",
};

export default async function ShopPage() {
	const productsResult = await commerce.productBrowse({ limit: 100 });

	return (
		<div className="bg-background min-h-screen">
			<ShopPageClient initialProducts={productsResult.data} />
		</div>
	);
}
