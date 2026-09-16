/**
 * GalleryGridSkeleton
 *
 * Shape-accurate loading skeleton for the homepage Gallery Grid section.
 * The card layout matches GalleryGridClient's product card 1-to-1:
 * - aspect-[4/5] image area
 * - star row strip
 * - title + two-line description
 * - price + shop-now button row
 */

export function GalleryCardSkeleton() {
	return (
		<div className="flex flex-col bg-paper-tint rounded-lg overflow-hidden shadow-sm">
			{/* Image placeholder */}
			<div className="relative aspect-[4/5] bg-surface-container animate-pulse" />

			{/* Card body */}
			<div className="p-5 flex flex-col flex-grow justify-between">
				<div className="space-y-2">
					{/* Stars row */}
					<div className="flex items-center gap-1">
						<div className="h-4 w-24 bg-secondary/30 rounded animate-pulse" />
					</div>
					{/* Product title */}
					<div className="h-5 w-3/4 bg-secondary/40 rounded animate-pulse" />
					{/* Description — two lines */}
					<div className="space-y-1 pt-0.5">
						<div className="h-3.5 w-full bg-secondary/25 rounded animate-pulse" />
						<div className="h-3.5 w-2/3 bg-secondary/25 rounded animate-pulse" />
					</div>
				</div>

				{/* Price + CTA row */}
				<div className="mt-4 pt-3 flex items-center justify-between">
					<div className="h-5 w-16 bg-secondary/35 rounded animate-pulse" />
					<div className="h-8 w-24 bg-tertiary-fixed/50 rounded animate-pulse" />
				</div>
			</div>
		</div>
	);
}

export function GalleryGridSkeleton({ count = 8 }: { count?: number }) {
	return (
		<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
			{Array.from({ length: count }).map((_, i) => (
				// biome-ignore lint/suspicious/noArrayIndexKey: static skeleton, order never changes
				<GalleryCardSkeleton key={`gallery-skeleton-${i}`} />
			))}
		</div>
	);
}
