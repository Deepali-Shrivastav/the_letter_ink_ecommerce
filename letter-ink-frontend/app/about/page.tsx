import type { Metadata } from "next";
import { AboutPageClient } from "@/components/sections/about-page-client";

export const metadata: Metadata = {
	title: "About Us - The Story of The Letter Ink",
	description:
		"Learn about The Letter Ink calligraphy studio in Bhusawal, Maharashtra. Founded to preserve the sacred art of hand-rendered scripts, pure dip-pen discipline, and archival deckle-edge papers.",
};

export default function AboutPage() {
	return <AboutPageClient />;
}
