/**
 * GalleryGrid — Server Component shell
 *
 * Renders a static header instantly, then wraps the data-fetching
 * layer (GalleryGridInner) in a Suspense boundary so the skeleton
 * shows while Medusa responds.
 *
 * Component tree:
 *   GalleryGrid (Server)
 *     └─ section + header (static, renders at build / on first request)
 *     └─ <Suspense fallback={<GalleryGridSkeleton />}>
 *          └─ <GalleryGridInner /> (async Server, fetches from Medusa)
 *               └─ <GalleryGridClient products={…} /> (Client, filter state)
 */
import { Suspense } from "react";
import { GalleryGridInner } from "./gallery-grid-inner";
import { GalleryGridSkeleton } from "./gallery-grid-skeleton";

export function GalleryGrid() {
	return (
		<section className="w-full py-space-xl bg-surface-container-lowest" id="shop-gallery">
			<div className="max-w-7xl mx-auto px-margin-mobile md:px-margin">
				{/* ── Static header — renders immediately, never blocked ── */}
				<div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-4">
					<div>
						<span className="font-label-sm text-label-sm uppercase tracking-widest text-secondary">
							Explore Our Favourites
						</span>
						<h2 className="font-headline-lg text-headline-lg text-primary tracking-wide mt-1">
							Handcrafted Pieces Loved by Our Patrons
						</h2>
					</div>
					<p className="font-body-sm text-body-sm text-secondary max-w-md mt-2 md:mt-0">
						Every piece is meticulously rendered by hand in our studio. Personalized with bespoke
						words, archival inks, and heirloom framing.
					</p>
				</div>
				{/*
				 * ── Suspense boundary ──
				 * GalleryGridSkeleton is shown while GalleryGridInner awaits
				 * the Medusa API response. count=8 matches the default fetch limit.
				 */}
				<Suspense fallback={<GalleryGridSkeleton count={8} />}>
					<GalleryGridInner />
				</Suspense>
			</div>
		</section>
	);
}
