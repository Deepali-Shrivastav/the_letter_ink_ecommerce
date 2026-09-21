import type { Metadata } from "next";
import { connection } from "next/server";
import { GiftingLandingClient } from "@/components/sections/gifting-landing-client";
import { medusaClient } from "@/lib/medusa";


export const metadata: Metadata = {
	title: "Artisanal Gifting Atelier - Gifts for Every Milestone",
	description:
		"Meaningful, hand-inscribed treasures crafted with timeless scripts, botanical wax seals, and heirloom framing designed to hold love across generations.",
};


export default async function GiftingPage() {
	await connection(); // Opt into dynamic rendering to fetch fresh products from Medusa (Next.js 15 safe)
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
		console.error("Failed to fetch hampers:", e.message || e);
	}

	// Fetch Occasions and their products
	let occasionCategories: any[] = [];
	let occasionsWithProducts: any[] = [];
	try {
		const cats = await medusaClient.productCategories.list({ parent_category_id: "null" } as any); // We'd ideally filter by "occasions" handle first
		const occasionsRoot = cats.product_categories?.find(c => c.handle === "occasions");
		
		if (occasionsRoot) {
			const subCats = await medusaClient.productCategories.list({ parent_category_id: occasionsRoot.id } as any);
			occasionCategories = subCats.product_categories;
			
			// Fetch top products for each category
			for (const cat of occasionCategories) {
				const prods = await medusaClient.products.list({ category_id: [cat.id], limit: 4 } as any);
				occasionsWithProducts.push({
					category: cat,
					products: prods.products
				});
			}
		}
	} catch (e: any) {
		console.error("Failed to fetch occasions:", e.message || e);
	}

	return <GiftingLandingClient hampers={hampers} occasions={occasionsWithProducts} />;
}
