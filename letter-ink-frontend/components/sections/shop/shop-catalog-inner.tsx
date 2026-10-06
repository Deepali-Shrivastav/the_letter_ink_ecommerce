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
		const variants = p.variants ?? [];
		const variantPrices = variants
			.map((v) => (v.price ? Number(v.price) : null))
			.filter((pr): pr is number => pr !== null && !isNaN(pr));
		const rawAmount =
			variantPrices.length > 0
				? Math.min(...variantPrices)
				: p.variants?.[0]?.price
					? Number(p.variants[0].price)
					: null;
		const maxVariantPrice = variantPrices.length > 0 ? Math.max(...variantPrices) : rawAmount;
		const isPriceRange = Boolean(
			variantPrices.length > 1 &&
				rawAmount !== null &&
				maxVariantPrice !== null &&
				rawAmount !== maxVariantPrice,
		);

		const price =
			rawAmount !== null ? formatMoney({ amount: rawAmount, currency: "INR", locale: "en-IN" }) : null;

		const firstVariant = variants[0];
		const rawOriginal = firstVariant?.originalPrice ? Number(firstVariant.originalPrice) : null;
		const isDiscounted = rawOriginal !== null && rawAmount !== null && rawOriginal > rawAmount;
		const originalPrice = isDiscounted
			? formatMoney({ amount: rawOriginal, currency: "INR", locale: "en-IN" })
			: null;
		const discountPercent = isDiscounted ? Math.round(((rawOriginal - rawAmount) / rawOriginal) * 100) : 0;

		const isWorkshop =
			(p as any).galleryCategory === "workshops" ||
			(p as any).productType?.toLowerCase().includes("workshop");
		const leadTime =
			(p as any).leadTime ??
			p.metadata?.lead_time ??
			p.metadata?.leadTime ??
			p.metadata?.turnaround ??
			(isWorkshop ? "Interactive Masterclass" : "Ships in 5–7 days");

		return {
			id: p.id,
			// Set metadata.gallery_category on each product in the Medusa admin to drive
			// the category filter pills. Valid: frames | letters | engraved | wax | wedding
			category: (p as any).galleryCategory ?? "all",
			name: p.name,
			description: p.summary ?? "",
			price,
			rawPrice: rawAmount,
			originalPrice,
			discountPercent,
			rating: 4.9, // Medusa v2 has no native reviews; use a neutral default
			reviews: 0,
			badge: (p as any).badge ?? null,
			image: p.images?.[0] ?? null,
			slug: p.slug,
			// Set metadata.product_type on products in the Medusa admin e.g. "Shadowbox Keepsake"
			type: (p as any).productType ?? "Artisan Piece",
			// Set metadata.addon on products in the Medusa admin e.g. "Free Wax Sealed Box"
			addon: (p as any).addon ?? null,
			isPriceRange,
			leadTime,
		};
	});

	return <ShopCatalogClient products={shopProducts} />;
}
