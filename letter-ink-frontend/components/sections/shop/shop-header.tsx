import Link from "next/link";

export function ShopHeader() {
	return (
		<div className="flex flex-col w-full relative">
			{/* Subtle top decorative ambient radial */}
			<div className="relative w-full overflow-hidden">
				<div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[850px] h-[340px] bg-tertiary-fixed/35 blur-3xl pointer-events-none rounded-full" />
				{/* Editorial Page Header */}
				<section className="relative max-w-7xl mx-auto px-margin-mobile lg:px-margin pt-space-lg pb-space-md">
					{/* Breadcrumb & Tagline Bar */}
					<div className="flex flex-wrap items-center justify-between gap-space-xs pb-space-sm">
						<nav aria-label="Breadcrumbs" className="flex items-center gap-space-xs text-on-surface-variant font-label-sm text-label-sm uppercase tracking-widest">
							<Link href="/" className="hover:text-primary transition-colors">Home</Link>
							<span className="text-outline">/</span>
							<span className="text-primary font-semibold">Shop</span>
						</nav>
						<span className="font-label-sm text-label-sm uppercase tracking-[0.28em] text-secondary">
							Dispatching from Maharashtra Atelier • Global Transit
						</span>
					</div>
					{/* Main Headline Block */}
					<div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter items-end pt-space-xs pb-space-xs">
						<div className="lg:col-span-8 space-y-space-xs">
							<p className="font-label-md text-label-md uppercase tracking-[0.24em] text-on-secondary-fixed-variant">
								The Artisanal Collection
							</p>
							<h1 className="font-headline-lg text-headline-lg text-primary tracking-tight leading-tight">
								Handcrafted Stationery & Inscribed Keepsakes
							</h1>
						</div>
						<div className="lg:col-span-4 lg:pl-space-sm">
							<p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
								Each piece is hand-lettered on handmade deckle-edge papers, etched on crystal glass, or framed in brass shadowboxes using archival inks and fine dip-pens.
							</p>
						</div>
					</div>
					{/* Atmospheric Atelier Stat Bar */}
					<div className="grid grid-cols-2 sm:grid-cols-4 gap-gutter pt-space-md mt-space-sm bg-surface-container-low px-space-md py-space-sm">
						<div className="flex flex-col">
							<span className="font-display-hero text-[28px] leading-8 text-primary font-serif">100%</span>
							<span className="font-label-sm text-label-sm uppercase text-secondary tracking-wider mt-1">Dip Pen Scripted</span>
						</div>
						<div className="flex flex-col">
							<span className="font-display-hero text-[28px] leading-8 text-primary font-serif">300 GSM</span>
							<span className="font-label-sm text-label-sm uppercase text-secondary tracking-wider mt-1">Cotton Rag Stock</span>
						</div>
						<div className="flex flex-col">
							<span className="font-display-hero text-[28px] leading-8 text-primary font-serif">24 KT</span>
							<span className="font-label-sm text-label-sm uppercase text-secondary tracking-wider mt-1">Pure Gold Leaf Flakes</span>
						</div>
						<div className="flex flex-col">
							<span className="font-display-hero text-[28px] leading-8 text-primary font-serif">7–10 Days</span>
							<span className="font-label-sm text-label-sm uppercase text-secondary tracking-wider mt-1">Atelier Curing & Frame</span>
						</div>
					</div>
				</section>
			</div>
		</div>
	);
}
