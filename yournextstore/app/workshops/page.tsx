import type { Metadata } from "next";
import { cacheLife } from "next/cache";
import { Suspense } from "react";
import { WorkshopsClient } from "@/components/sections/workshops-client";
import { commerce } from "@/lib/commerce";

export const metadata: Metadata = {
	title: "Artisanal Calligraphy Masterclasses & Studio Workshops",
	description:
		"Step inside our world of slow lettering. Pointed pen fundamentals, advanced flourishing, wax seal crafting, and glass engraving hosted in Maharashtra and live virtually worldwide.",
};

async function getWorkshopsData() {
	"use cache";
	cacheLife("minutes");

	const rawWorkshops = await commerce.workshopBrowse().catch(() => []);

	return rawWorkshops.map((w: any) => {
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
}

async function WorkshopsContent() {
	const workshopItems = await getWorkshopsData();
	return <WorkshopsClient initialWorkshops={workshopItems} />;
}

export default function WorkshopsPage() {
	return (
		<Suspense
			fallback={
				<div className="min-h-screen bg-background py-20 animate-pulse">
					<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
						<div className="h-10 bg-muted/60 rounded w-1/3 mb-4 mx-auto" />
						<div className="h-4 bg-muted/40 rounded w-1/2 mb-16 mx-auto" />
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
							{Array.from({ length: 3 }).map((_, i) => (
								<div key={i} className="h-96 bg-muted/30 rounded-2xl" />
							))}
						</div>
					</div>
				</div>
			}
		>
			<WorkshopsContent />
		</Suspense>
	);
}

