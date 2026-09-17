import type { Metadata } from "next";
import { BlogPageClient } from "@/components/sections/blog-page-client";

export const metadata: Metadata = {
	title: "Ink Musings, Studio Chronicles & The Scribe's Journal",
	description:
		"Explorations into the slow art of pointed pen penmanship, archival ink formulations, wedding stationery etiquette, and dispatches inside our Bhusawal studio.",
};

export default function BlogPage() {
	return <BlogPageClient />;
}
