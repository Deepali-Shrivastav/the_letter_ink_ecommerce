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

function resolveGalleryCategory(p: any): string {
	const explicit = (p as any).galleryCategory || (p as any).metadata?.gallery_category;
	if (explicit) return String(explicit).toLowerCase();

	const text =
		`${p.name || ""} ${p.summary || ""} ${p.category?.name || ""} ${p.category?.slug || ""}`.toLowerCase();
	if (text.includes("frame")) return "frames";
	if (
		text.includes("letter") ||
		text.includes("scroll") ||
		text.includes("ink") ||
		text.includes("nib") ||
		text.includes("pen") ||
		text.includes("paper") ||
		text.includes("ruler")
	) {
		return "letters";
	}
	if (
		text.includes("engrav") ||
		text.includes("crystal") ||
		text.includes("bottle") ||
		text.includes("glass")
	) {
		return "engraving";
	}
	if (text.includes("wedding") || text.includes("vow") || text.includes("suite") || text.includes("hamper")) {
		return "wedding";
	}

	return "all";
}

function resolveProductImage(p: any, category: string): string {
	if (p.images && p.images.length > 0 && p.images[0]) {
		return p.images[0];
	}
	if ((p as any).thumbnail) {
		return (p as any).thumbnail;
	}
	switch (category) {
		case "frames":
			return "https://lh3.googleusercontent.com/aida-public/AB6AXuDSWzo8jBoZwoueq44cZcss8LB_9QWQCqr9uM9elUDQ_3vFWsfstlLd4YHgJUMDhw0L1v3zofENkgVGCuwWHmKFFMLBWmkXx3GUI7186ckF-EbuaPhicuGAVCeciYb1JqrQ_zVf7UHUgwOI2rGLIJDw1B1VXKCIm2oRPDFu5BuxcAflHZ0LdDAqG_q1Es49k7tK5YQnW-3Tr6QOupL8gdWHsEx9iZUpWtHSN-2I5h4aXxN8hv8xrWY";
		case "letters":
			return "https://lh3.googleusercontent.com/aida-public/AB6AXuAxHBwu6IFNroq21t1CfzZdB_AEpuYdtmfOPnlTcuHPvH5K-YOfLAcbphMV8XQDD-nd8lfu7_uu5BcE5fVsukh--De2MxW5GTtA56apkbfKbvuypmUc87yGil46ULihWnY0vNmh_Tu9Gcl-v12cyXm8vpU5z4HCUNwlYNXQ2kpGaxdK4ZdLBBwyRbNPCF8G1M-rHZQyaD-u-IhJ7dC-YJ9VwHkaK1fyWqtj8-HzDtHhwnlTlJ4GVLY";
		case "engraving":
			return "https://lh3.googleusercontent.com/aida-public/AB6AXuBtjIGC5zC1a1-Wp0fqSVdj675IbZ7P8_y0jFAdM7EQZHKdvQyIUfcIqf0HtbWjBOVC5a1zD6ywGCyZDn3m4XOnQPOb9ZCWrtuCCVklqvnNEo00F43aPyH2NIVA8_BhIBoLXG5DMJEFJoIXN5qMsot28P4pqJgw5Zp9mK9ZjvAoUu18d8jPHP6SdoVQFeN7dwuCuWvU8FZkB1XS31IfnaE9A7jsV_OIVHLboDf9AMhajPl8n8BgHdY";
		case "wedding":
			return "https://lh3.googleusercontent.com/aida-public/AB6AXuD5dqj8BbOJb5JF0b-9-BYJwuocmsSzWutBhaa4N4tEC3iun7ZCqP0QR2YIA-pE2EdP36chov5smrGEJkjpKQ_QqBZKLKaX76tDB2LShA1IuYQuqMIIv3K8FvJgKIsiUrht63h8HyVUgBU9tlCIr818ZV9ahUizQODewIQlM4OwkJXg5Zw9bTDEkhAsnzZxSO_wpGqEoasrGvOtoFkx1PIH2SVS2LTe_6eQyIRzS_n951QtFbc43Cc";
		default:
			return "https://images.unsplash.com/photo-1586075010923-2dd4570fb338?auto=format&fit=crop&w=600&q=80";
	}
}

export async function GalleryGridInner() {
	const { data: products } = await commerce.productBrowse({ limit: 50 });

	// Filter out dummy/placeholder "Product" records if any, but keep all genuine store products
	const validProducts = products.filter((p) => p?.id && p.name && p.name.trim().toLowerCase() !== "product");

	const galleryProducts: GalleryProduct[] = validProducts.map((p) => {
		// Pick the cheapest variant to display as the card price.
		const firstVariant = p.variants?.[0];
		const rawAmount = firstVariant?.price ? Number(firstVariant.price) : null;

		const price =
			rawAmount !== null ? formatMoney({ amount: rawAmount, currency: "INR", locale: "en-IN" }) : null;

		// If the product has a compare-at / original price we expose it.
		const rawOriginal = firstVariant?.originalPrice ? Number(firstVariant.originalPrice) : null;
		const originalPrice =
			rawOriginal !== null && rawOriginal !== rawAmount
				? formatMoney({ amount: rawOriginal, currency: "INR", locale: "en-IN" })
				: null;

		const category = resolveGalleryCategory(p);
		const image = resolveProductImage(p, category);

		return {
			id: p.id,
			category,
			name: p.name,
			description: p.summary ?? "",
			price,
			originalPrice,
			reviews: 0, // Medusa v2 has no built-in reviews field
			badge: (p as any).badge ?? null,
			image,
			slug: p.slug,
		};
	});

	return <GalleryGridClient products={galleryProducts} />;
}
