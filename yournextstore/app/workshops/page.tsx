import type { Metadata } from "next";
import { WorkshopsClient } from "@/components/sections/workshops-client";
import { commerce } from "@/lib/commerce";

export const metadata: Metadata = {
	title: "Artisanal Calligraphy Masterclasses & Studio Workshops",
	description:
		"Step inside our world of slow lettering. Pointed pen fundamentals, advanced flourishing, wax seal crafting, and glass engraving hosted in Maharashtra and live virtually worldwide.",
};

export default async function WorkshopsPage() {
	const rawWorkshops = await commerce.workshopBrowse().catch(() => []);

	const workshopItems = rawWorkshops.map((w: any) => {
		const formatVal = (w.format || w.metadata?.format as string)?.toLowerCase();
		const format: "studio" | "virtual" = formatVal === "studio" ? "studio" : "virtual";
		const rawPrice = w.price ?? 4500;
		const formattedPrice = typeof rawPrice === "number" ? `₹${rawPrice.toLocaleString("en-IN")}` : String(rawPrice).startsWith("₹") ? rawPrice : `₹${rawPrice}`;

		return {
			id: w.id,
			title: w.title || w.name,
			description: w.description || w.summary || "",
			format,
			badgeText:
				w.badgeText ||
				(w.metadata?.badge as string) ||
				(format === "studio" ? "In-Studio Intensive" : "Virtual Live Interactive"),
			spotsText: w.spots_text || w.spotsText || (w.metadata?.spots_left as string) || "Limited seats",
			date: w.date || (w.metadata?.date as string) || "Upcoming Date TBD",
			time: w.time || (w.metadata?.time as string) || "10:00 AM - 1:00 PM",
			venue: w.venue || (w.metadata?.venue as string) || "The Letter Ink Studio, Indiranagar",
			level: w.level || (w.metadata?.level as string) || "Beginner to Intermediate",
			kitInfo: w.kit_info || w.kitInfo || (w.metadata?.kit_included as string) || "Full calligraphy kit included",
			price: formattedPrice,
			variantId: w.variantId || w.id,
			image: Array.isArray(w.images) ? w.images[0] : w.image || null,
			slug: w.handle || w.slug || "workshop",
		};
	});

	return <WorkshopsClient initialWorkshops={workshopItems} />;
}
