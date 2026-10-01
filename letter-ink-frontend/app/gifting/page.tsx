import type { Metadata } from "next";
import { cacheLife } from "next/cache";
import { Suspense } from "react";
import { GiftingLandingClient } from "@/components/sections/gifting-landing-client";
import { medusaClient } from "@/lib/medusa";
import { logger } from "@/lib/logger";

export const metadata: Metadata = {
	title: "Artisanal Gifting Atelier - Gifts for Every Milestone",
	description:
		"Meaningful, hand-inscribed treasures crafted with timeless scripts, botanical wax seals, and heirloom framing designed to hold love across generations.",
};

async function getGiftingData() {
	"use cache";
	cacheLife("minutes");

	// Fetch Hampers
	let hampers: any[] = [];
	try {
		const cols = await medusaClient.collections.list({ handle: ["hampers"] } as any);
		if (cols.collections && cols.collections.length > 0 && cols.collections[0]) {
			const hamperColId = cols.collections[0].id;
			const prods = await medusaClient.products.list({ collection_id: [hamperColId] } as any);
			hampers = prods.products;
		}
	} catch (e: any) {
		logger.error("Failed to fetch hampers:", e);
	}

	// Fetch Occasions and their products
	let occasionsWithProducts: any[] = [];
	try {
		const cats = await medusaClient.productCategories.list({ parent_category_id: "null" } as any);
		const occasionsRoot = cats.product_categories?.find((c) => c.handle === "occasions");

		if (occasionsRoot) {
			const subCats = await medusaClient.productCategories.list({ parent_category_id: occasionsRoot.id } as any);
			const occasionCategories = subCats.product_categories || [];

			// Fetch top products for each category
			for (const cat of occasionCategories) {
				const prods = await medusaClient.products.list({ category_id: [cat.id], limit: 4 } as any);
				occasionsWithProducts.push({
					category: cat,
					products: prods.products,
				});
			}
		}
	} catch (e: any) {
		logger.error("Failed to fetch occasions:", e);
	}

	return { hampers, occasionsWithProducts };
}

async function GiftingContent() {
	const { hampers, occasionsWithProducts } = await getGiftingData();
	return <GiftingLandingClient hampers={hampers} occasions={occasionsWithProducts} />;
}

export default function GiftingPage() {
	return (
		<Suspense
			fallback={
				<div className="min-h-screen bg-background py-20 animate-pulse">
					<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
						<div className="h-10 bg-muted/60 rounded w-1/3 mb-4 mx-auto" />
						<div className="h-4 bg-muted/40 rounded w-1/2 mb-16 mx-auto" />
						<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
							{Array.from({ length: 3 }).map((_, i) => (
								<div key={i} className="h-96 bg-muted/30 rounded-2xl" />
							))}
						</div>
					</div>
				</div>
			}
		>
			<GiftingContent />
		</Suspense>
	);
}

