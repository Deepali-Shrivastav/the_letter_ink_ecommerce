/**
 * ShopCatalogInner — async Server Component
 *
 * Fetches all products from Medusa, maps them to ShopProduct shape,
 * and passes a serialisable array to ShopCatalogClient.
 * Always rendered inside a <Suspense> in shop-catalog.tsx.
 */
import { commerce } from "@/lib/commerce";
import { formatMoney } from "@/lib/money";
import type { ShopProduct } from "./shop-catalog-client";
import { ShopCatalogClient } from "./shop-catalog-client";

export async function ShopCatalogInner() {
	const { data: products } = await commerce.productBrowse({ limit: 100 });

	const shopProducts: ShopProduct[] = products.map((p) => {
		const firstVariant = p.variants?.[0];
		const rawAmount = firstVariant?.price ? Number(firstVariant.price) : null;

		const price =
			rawAmount !== null
				? formatMoney({ amount: rawAmount, currency: "INR", locale: "en-IN" })
				: null;

		const rawOriginal = firstVariant?.originalPrice
			? Number(firstVariant.originalPrice)
			: null;
		const originalPrice =
			rawOriginal !== null && rawOriginal !== rawAmount
				? formatMoney({ amount: rawOriginal, currency: "INR", locale: "en-IN" })
				: null;

		return {
			id: p.id,
			// Set metadata.gallery_category on each product in the Medusa admin to drive
			// the category filter pills. Valid: frames | letters | engraved | wax | wedding
			category: (p as any).galleryCategory ?? "all",
			name: p.name,
			description: p.summary ?? "",
			price,
			originalPrice,
			rating: 4.9,   // Medusa v2 has no native reviews; use a neutral default
			reviews: 0,
			badge: (p as any).badge ?? null,
			image: p.images?.[0] ?? null,
			slug: p.slug,
			// Set metadata.product_type on products in the Medusa admin e.g. "Shadowbox Keepsake"
			type: (p as any).productType ?? "Artisan Piece",
			// Set metadata.addon on products in the Medusa admin e.g. "Free Wax Sealed Box"
			addon: (p as any).addon ?? null,
		};
	});

	return <ShopCatalogClient products={shopProducts} />;
}
