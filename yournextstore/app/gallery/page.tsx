import type { Metadata } from "next";
import { GalleryPageClient } from "@/components/sections/gallery-page-client";

export const metadata: Metadata = {
	title: "Gallery - A Visual Chronicle of Hand-Rendered Artistry",
	description:
		"An expansive showcase of past bespoke commissions, luxury wedding suites, glass engravings, custom name frames, and studio experiments crafted with unhurried devotion by The Letter Ink.",
};

export default function GalleryPage() {
	return <GalleryPageClient />;
}
