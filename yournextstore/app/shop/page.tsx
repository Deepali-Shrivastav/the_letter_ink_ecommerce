import type { Metadata } from "next";
import { cacheLife } from "next/cache";
import { Suspense } from "react";
import { ShopPageClient } from "@/components/sections/shop-page-client";
import { commerce } from "@/lib/commerce";

export const metadata: Metadata = {
	title: "Shop - The Letter Ink",
	description: "Handcrafted Stationery & Inscribed Keepsakes",
};

async function getShopProducts() {
	"use cache";
	cacheLife("minutes");
	return commerce.productBrowse({ limit: 100 });
}

async function ShopContent() {
	const productsResult = await getShopProducts();

	return <ShopPageClient initialProducts={productsResult.data} />;
}

export default function ShopPage() {
	return (
		<div className="bg-background min-h-screen">
			<Suspense
				fallback={
					<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 animate-pulse">
						<div className="h-10 bg-muted/60 rounded w-1/4 mb-4" />
						<div className="h-4 bg-muted/40 rounded w-1/2 mb-12" />
						<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
							{Array.from({ length: 6 }).map((_, i) => (
								<div key={i} className="h-80 bg-muted/30 rounded-xl" />
							))}
						</div>
					</div>
				}
			>
				<ShopContent />
			</Suspense>
		</div>
	);
}

