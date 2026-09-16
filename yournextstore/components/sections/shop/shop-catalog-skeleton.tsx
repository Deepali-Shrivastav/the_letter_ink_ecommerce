/**
 * ShopCatalogSkeleton
 *
 * Shape-accurate loading skeleton for the Shop Catalog product grid.
 * Matches the ShopCatalog article card layout exactly:
 * - aspect-[4/5] image area
 * - type label + star rating row
 * - title + two-line description
 * - price + addon row
 */

export function ShopProductCardSkeleton() {
	return (
		<div className="flex flex-col bg-surface-container-lowest shadow-sm rounded-xl overflow-hidden">
			{/* Image */}
			<div className="relative w-full aspect-[4/5] bg-surface-container animate-pulse" />

			{/* Body */}
			<div className="p-space-md flex flex-col flex-grow justify-between space-y-space-xs">
				<div>
					{/* Type label + rating row */}
					<div className="flex items-center justify-between gap-2 mb-1">
						<div className="h-3 w-28 bg-secondary/30 rounded animate-pulse" />
						<div className="h-3 w-14 bg-secondary/25 rounded animate-pulse" />
					</div>
					{/* Title */}
					<div className="h-5 w-3/4 bg-secondary/40 rounded animate-pulse mt-2" />
					{/* Description — two lines */}
					<div className="space-y-1 mt-2">
						<div className="h-3.5 w-full bg-secondary/25 rounded animate-pulse" />
						<div className="h-3.5 w-2/3 bg-secondary/25 rounded animate-pulse" />
					</div>
				</div>

				{/* Price + addon row */}
				<div className="pt-4 mt-4 border-t border-border-vellum flex items-center justify-between">
					<div className="h-6 w-20 bg-secondary/35 rounded animate-pulse" />
					<div className="h-3.5 w-24 bg-secondary/20 rounded animate-pulse" />
				</div>
			</div>
		</div>
	);
}

export function ShopCatalogSkeleton({ count = 8 }: { count?: number }) {
	return (
		<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter">
			{Array.from({ length: count }).map((_, i) => (
				// biome-ignore lint/suspicious/noArrayIndexKey: static skeleton, order never changes
				<ShopProductCardSkeleton key={`shop-skeleton-${i}`} />
			))}
		</div>
	);
}
