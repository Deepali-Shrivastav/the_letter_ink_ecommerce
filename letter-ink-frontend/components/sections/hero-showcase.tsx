import { ArrowRight, PenTool } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export function HeroShowcase() {
	return (
		<section className="relative w-full overflow-hidden bg-paper-tint">
			{/* Hero Content (Above the Fold) */}
			<div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 sm:pt-14 md:pt-16 pb-8 sm:pb-10 text-center flex flex-col items-center">
				<div className="inline-flex items-center gap-2 mb-4 sm:mb-5 bg-tertiary-fixed text-on-tertiary-fixed px-3.5 py-1.5 rounded-full shadow-2xs">
					<PenTool className="w-3.5 h-3.5 text-primary shrink-0" />
					<span className="font-label-sm text-xs uppercase tracking-widest font-medium">
						Artisanal Calligraphy Atelier
					</span>
				</div>
				<h1 className="font-display-hero text-3xl sm:text-4xl md:text-5xl lg:text-6xl tracking-wide text-primary max-w-4xl text-center leading-[1.15]">
					Thoughtful Script &amp; Handcrafted Calligraphy
				</h1>
				<div className="w-12 h-0.5 bg-primary/20 my-4 sm:my-6" />
				<p className="font-display-hero text-lg sm:text-xl md:text-[22px] font-normal text-secondary max-w-2xl text-center italic leading-[1.6]">
					“Bringing back the romance of hand-rendered script — give us your words, and we frame them into
					reality.”
				</p>
				<div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mt-6 sm:mt-8 w-full sm:w-auto">
					<Link
						href="/shop"
						className="group w-full sm:w-auto px-8 py-3.5 bg-primary text-on-primary font-label-lg text-sm tracking-widest shadow-md hover:shadow-xl hover:bg-primary/90 hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-2 rounded-xs"
					>
						<span>Explore Collection</span>
						<ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
					</Link>
					<Link
						href="/contact"
						className="w-full sm:w-auto px-8 py-3.5 border border-primary text-primary font-label-lg text-sm tracking-widest hover:bg-primary hover:text-on-primary hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 text-center rounded-xs"
					>
						Bespoke Commissions
					</Link>
				</div>
			</div>

			{/* Mobile Single Hero Showcase (< md) */}
			<div className="md:hidden px-4 pb-10">
				<div className="relative h-64 sm:h-72 w-full overflow-hidden rounded-xl shadow-md group">
					<Image
						src="/hero/copperplate-calligraphy.jpg"
						alt="Close up of exquisite copperplate calligraphy"
						fill
						priority
						sizes="(max-width: 768px) 100vw, 400px"
						className="object-cover group-hover:scale-105 transition-transform duration-700"
					/>
					<div className="absolute inset-0 bg-gradient-to-t from-primary/30 via-transparent to-transparent pointer-events-none" />
				</div>
			</div>

			{/* Desktop Multi-pane Visual Showcase (≥ md) */}
			<div className="hidden md:grid md:grid-cols-4 gap-3 lg:gap-4 px-6 lg:px-8 pb-14 lg:pb-18">
				<div className="relative h-72 lg:h-[380px] overflow-hidden rounded-lg group">
					<Image
						src="/hero/copperplate-calligraphy.jpg"
						alt="Close up of exquisite copperplate calligraphy"
						fill
						priority
						sizes="(max-width: 1024px) 25vw, 300px"
						className="object-cover group-hover:scale-105 transition-transform duration-700"
					/>
					<div className="absolute inset-0 bg-primary/20 group-hover:bg-primary/10 transition-colors pointer-events-none" />
				</div>
				<div className="relative h-72 lg:h-[380px] overflow-hidden rounded-lg group">
					<Image
						src="/hero/wedding-invitation-suite.jpg"
						alt="Custom luxury wedding invitation suite"
						fill
						sizes="(max-width: 1024px) 25vw, 300px"
						className="object-cover group-hover:scale-105 transition-transform duration-700"
					/>
					<div className="absolute inset-0 bg-primary/20 group-hover:bg-primary/10 transition-colors pointer-events-none" />
				</div>
				<div className="relative h-72 lg:h-[380px] overflow-hidden rounded-lg group">
					<Image
						src="/hero/engraved-perfume-bottle.jpg"
						alt="Artisanal hand-engraved crystal perfume bottle"
						fill
						sizes="(max-width: 1024px) 25vw, 300px"
						className="object-cover group-hover:scale-105 transition-transform duration-700"
					/>
					<div className="absolute inset-0 bg-primary/20 group-hover:bg-primary/10 transition-colors pointer-events-none" />
				</div>
				<div className="relative h-72 lg:h-[380px] overflow-hidden rounded-lg group">
					<Image
						src="/hero/vintage-brass-glass-box.jpg"
						alt="Ornate vintage golden brass glass keepsake box"
						fill
						sizes="(max-width: 1024px) 25vw, 300px"
						className="object-cover group-hover:scale-105 transition-transform duration-700"
					/>
					<div className="absolute inset-0 bg-primary/20 group-hover:bg-primary/10 transition-colors pointer-events-none" />
				</div>
			</div>
		</section>
	);
}
