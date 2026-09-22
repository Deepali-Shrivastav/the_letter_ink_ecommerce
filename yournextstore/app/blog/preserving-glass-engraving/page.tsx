import type { Metadata } from "next";
import { BlogArticleClient } from "@/components/sections/blog-article-client";

export const metadata: Metadata = {
	title: "Preserving Glass Engraving: Caring for Hand-Etched Flutes & Victorian Crystal",
	description:
		"A comprehensive conservatory guide to washing, handling, and buffering personalized glassware etched with micro-drill diamond burs to prevent clouding, thermal shock, and micro-fractures.",
	openGraph: {
		title: "Preserving Glass Engraving: Caring for Hand-Etched Flutes & Victorian Crystal",
		description:
			"A comprehensive conservatory guide to washing, handling, and buffering personalized glassware etched with micro-drill diamond burs.",
		images: [
			{
				url: "https://lh3.googleusercontent.com/aida-public/AB6AXuAFsdymvbrtuYrQ3_aK26tXiZPazl0Gl_sGKpQIZbUfLbA05U-1V1Wqy_oi0hLvfwps3MF5eSegza_KKx9UNq6NINzYP37EUS70BB-uu7lYeK1Re_RwC6aAhzhHCzGAQkhoWkyhzBuMaMxFdQ0lYjndDR97BgljqSMvvsD3UCNpL5nXpkyj6R7GPS_f12jQfOLac_XlgT8yLPdVAQWe-9ZAYG6MOUn8tsj4Uq47QdaKpT7tDn-0f9w",
				alt: "Hand-engraved crystal champagne flutes",
			},
		],
	},
};

export default function PreservingGlassEngravingPage() {
	return <BlogArticleClient />;
}
