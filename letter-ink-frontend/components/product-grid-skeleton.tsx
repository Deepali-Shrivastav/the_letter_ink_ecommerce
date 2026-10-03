import { cn } from "@/lib/utils";

export function ProductCardSkeleton() {
	return (
		<div className="flex flex-col bg-surface-container-lowest border border-border-vellum/70 shadow-2xs rounded-xl overflow-hidden">
			<div className="aspect-[4/5] w-full bg-secondary/20 animate-pulse" />
			<div className="p-space-md space-y-3">
				<div className="h-3 w-1/3 bg-secondary/20 rounded animate-pulse" />
				<div className="h-5 w-3/4 bg-secondary/30 rounded animate-pulse" />
				<div className="h-3.5 w-full bg-secondary/15 rounded animate-pulse" />
				<div className="pt-4 border-t border-border-vellum/60 flex items-center justify-between">
					<div className="h-5 w-1/4 bg-secondary/30 rounded animate-pulse" />
					<div className="h-7 w-24 bg-secondary/20 rounded animate-pulse" />
				</div>
			</div>
		</div>
	);
}

export function ProductGridSkeleton({ count = 6, className }: { count?: number; className?: string }) {
	return (
		<div className={cn("grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8", className)}>
			{Array.from({ length: count }).map((_, i) => (
				<ProductCardSkeleton key={`skeleton-${i}`} />
			))}
		</div>
	);
}
