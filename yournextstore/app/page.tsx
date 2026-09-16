import type { Metadata } from "next";
import { HeroShowcase } from "@/components/sections/hero-showcase";
import { StudioPillars } from "@/components/sections/studio-pillars";
import { CuratedOccasions } from "@/components/sections/curated-occasions";
import { GalleryGrid } from "@/components/sections/gallery-grid";
import { ServicesEditorial } from "@/components/sections/services-editorial";
import { WorkshopBanner } from "@/components/sections/workshop-banner";
import { ClientReviews } from "@/components/sections/client-reviews";
import { ContactBanner } from "@/components/sections/contact-banner";

export const metadata: Metadata = {
	alternates: { canonical: "/" },
};

export default function Home() {
	return (
		<>
			<HeroShowcase />
			<StudioPillars />
			<CuratedOccasions />
			<GalleryGrid />
			<ServicesEditorial />
			<WorkshopBanner />
			<ClientReviews />
			<ContactBanner />
		</>
	);
}
