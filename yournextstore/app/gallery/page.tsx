import type { Metadata } from "next";
import { GalleryPageClient } from "@/components/sections/gallery-page-client";
import { commerce } from "@/lib/commerce";

export const metadata: Metadata = {
	title: "Gallery - A Visual Chronicle of Hand-Rendered Artistry",
	description:
		"An expansive showcase of past bespoke commissions, luxury wedding suites, glass engravings, custom name frames, and studio experiments crafted with unhurried devotion by The Letter Ink.",
};

export default async function GalleryPage() {
	const { data: products } = await commerce.productBrowse({ limit: 50 }).catch(() => ({ data: [] }));

	const dynamicItems = products.map((p, idx) => {
		const cat = (p as any).galleryCategory || p.category?.slug || "editorial";
		return {
			id: p.id,
			ref: `AT-${String(idx + 41).padStart(3, "0")}`,
			title: p.name,
			category: cat as any,
			categoryLabel: p.category?.name || "Atelier Piece",
			image: p.images[0] || "https://lh3.googleusercontent.com/aida-public/AB6AXuBDVPb2IKCn_GWDC7fWE6hyAYbI1p8b-5zKFpf6dLhjs-qXzJqsN6YLmutZJCWni9FQv50l4HtxWp8q3bD_Z8KvWfImVkbs5swgHHBDJTuZOIxk626j-RTVOP9WDMfn7dP2VGUEfhfRYbQiILkIRZWr0KPHymNtLJBu6LV9p2LHF_bby1qLtw1Hj1_397U2SzDaJFXAryyc6bnOJxJkpTph22-v0bdhK_ig0zKbvyDDph-ab7LnHBM",
			alt: p.name,
			description: p.summary || p.content || "",
			specs: p.variants?.[0]?.name ? `Variant: ${p.variants[0].name}` : "Handmade Ink & Paper",
			medium: "Bespoke Calligraphy",
			year: "Commission",
			colSpan: idx % 3 === 0 ? "lg:col-span-7" : idx % 3 === 1 ? "lg:col-span-5" : "lg:col-span-4",
		};
	});

	return <GalleryPageClient initialItems={dynamicItems.length > 0 ? dynamicItems : undefined} />;
}
