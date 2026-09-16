/**
 * GalleryGridInner — async Server Component
 *
 * Fetches the first 8 active products from the Medusa backend and
 * passes them to GalleryGridClient as a serialisable prop array.
 * This component is always rendered inside a <Suspense> boundary
 * in gallery-grid.tsx, so the skeleton shows while this awaits.
 */
import { commerce } from "@/lib/commerce";
import { formatMoney } from "@/lib/money";
import type { GalleryProduct } from "./gallery-grid-client";
import { GalleryGridClient } from "./gallery-grid-client";

export async function GalleryGridInner() {
	const { data: products } = await commerce.productBrowse({ limit: 8 });

	const galleryProducts: GalleryProduct[] = products.map((p) => {
		// Pick the cheapest variant to display as the card price.
		// Medusa stores amounts in minor units (e.g. 380000 = ₹3,800).
		const firstVariant = p.variants?.[0];
		const rawAmount = firstVariant?.price ? Number(firstVariant.price) : null;

		const price =
			rawAmount !== null
				? formatMoney({ amount: rawAmount, currency: "INR", locale: "en-IN" })
				: null;

		// If the product has a compare-at / original price we expose it.
		const rawOriginal = firstVariant?.originalPrice
			? Number(firstVariant.originalPrice)
			: null;
		const originalPrice =
			rawOriginal !== null && rawOriginal !== rawAmount
				? formatMoney({ amount: rawOriginal, currency: "INR", locale: "en-IN" })
				: null;

		return {
			id: p.id,
			// gallery_category metadata tag drives which filter tab shows this product.
			// Set this in the Medusa admin under product metadata.
			// Valid values: "frames" | "letters" | "engraving" | "wedding"
			// Products without a tag appear only under "All Pieces".
			category: (p as any).galleryCategory ?? "all",
			name: p.name,
			description: p.summary ?? "",
			price,
			originalPrice,
			reviews: 0, // Medusa v2 has no built-in reviews field
			badge: (p as any).badge ?? null,
			image: p.images?.[0] ?? null,
			slug: p.slug,
		};
	});

	return <GalleryGridClient products={galleryProducts} />;
}
