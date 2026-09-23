import type { Metadata } from "next";
import { Suspense } from "react";
import { BlogPageClient } from "@/components/sections/blog-page-client";
import { commerce } from "@/lib/commerce";

export const metadata: Metadata = {
	title: "Ink Musings, Studio Chronicles & The Scribe's Journal",
	description:
		"Explorations into the slow art of pointed pen penmanship, archival ink formulations, wedding stationery etiquette, and dispatches inside our Bhusawal studio.",
};

function BlogPageSkeleton() {
	return (
		<div className="w-full pt-36 bg-background min-h-screen">
			<div className="max-w-[1440px] mx-auto px-6 space-y-12 animate-pulse">
				<div className="h-8 bg-surface-container w-48 rounded"></div>
				<div className="h-16 bg-surface-container max-w-xl mx-auto rounded"></div>
				<div className="h-96 bg-surface-container rounded-lg"></div>
				<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
					<div className="h-80 bg-surface-container rounded"></div>
					<div className="h-80 bg-surface-container rounded"></div>
					<div className="h-80 bg-surface-container rounded"></div>
				</div>
			</div>
		</div>
	);
}

async function BlogContent() {
	const [postsRes, videosRes] = await Promise.all([
		commerce.postBrowse(),
		commerce.studioVideosBrowse(),
	]);
	const posts = postsRes.data || [];
	const videos = videosRes.data || [];
	return <BlogPageClient posts={posts} initialVideos={videos} />;
}

export default function BlogPage() {
	return (
		<Suspense fallback={<BlogPageSkeleton />}>
			<BlogContent />
		</Suspense>
	);
}
