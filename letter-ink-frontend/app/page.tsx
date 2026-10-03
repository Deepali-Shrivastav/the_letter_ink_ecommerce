import type { Metadata } from "next";
import { ContactBanner } from "@/components/sections/contact-banner";
import { CuratedOccasions } from "@/components/sections/curated-occasions";
import { GalleryGrid } from "@/components/sections/gallery-grid";
import { HeroShowcase } from "@/components/sections/hero-showcase";
import { ServicesEditorial } from "@/components/sections/services-editorial";
import { StudioPillars } from "@/components/sections/studio-pillars";

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
			<ContactBanner />
		</>
	);
}
