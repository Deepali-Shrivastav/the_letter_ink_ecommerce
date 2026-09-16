import type { Metadata } from "next";
import { ShopHeader } from "@/components/sections/shop/shop-header";
import { ShopCatalog } from "@/components/sections/shop/shop-catalog";

export const metadata: Metadata = {
	title: "Shop - The Letter Ink",
	description: "Handcrafted Stationery & Inscribed Keepsakes",
};

export default function ShopPage() {
	return (
		<div className="bg-background min-h-screen">
			<ShopHeader />
			<ShopCatalog />
		</div>
	);
}
