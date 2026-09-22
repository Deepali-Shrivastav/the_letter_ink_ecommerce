import type { Metadata } from "next";
import { BlogPageClient } from "@/components/sections/blog-page-client";
import { commerce } from "@/lib/commerce";

export const metadata: Metadata = {
	title: "Ink Musings, Studio Chronicles & The Scribe's Journal",
	description:
		"Explorations into the slow art of pointed pen penmanship, archival ink formulations, wedding stationery etiquette, and dispatches inside our Bhusawal studio.",
};

export default async function BlogPage() {
	const postsRes = await commerce.postBrowse();
	const posts = postsRes.data || [];
	return <BlogPageClient posts={posts} />;
}
