import { ArrowRight, FileText, Gem, Mail, MessageSquare, Sparkles, Tag } from "lucide-react";
import Link from "next/link";

interface ServiceItem {
	number: string;
	icon: React.ComponentType<{ className?: string }>;
	title: string;
	description: string;
	badgeLabel: string;
	medium: string;
}

const SERVICES: ServiceItem[] = [
	{
		number: "01",
		icon: Gem,
		title: "Glass & Metal Engraving",
		description:
			"Hand-engraved perfume bottles, champagne keepsakes, crystal tumblers, and acrylic treasures. Executed with precision micro-drill burs, finished with gold or silver wax leafing.",
		badgeLabel: "SURFACES",
		medium: "Glass, Metal, Crystal",
	},
	{
		number: "02",
		icon: FileText,
		title: "Handwritten Letters & Vows",
		description:
			"Intimate heirloom letters, wedding morning exchanges, and anniversary vows. Penned with pointed pen dip calligraphy in waterproof archival inks on hand-torn cotton deckle paper.",
		badgeLabel: "STOCK",
		medium: "Archival Cotton Deckle",
	},
	{
		number: "03",
		icon: Mail,
		title: "Bespoke Envelope Addressing",
		description:
			"Transform invitations into an unforgettable preview. Bespoke guest addressing in copperplate or modern flourish with custom ink color matching and vintage stamp curation.",
		badgeLabel: "DISCIPLINE",
		medium: "Copperplate & Custom Inks",
	},
	{
		number: "04",
		icon: Tag,
		title: "Placecards & Tablescape Agate",
		description:
			"Elevate private dinners and wedding tablescapes with individualized calligraphed placecards, polished Brazilian agate slices, marble tiles, and hand-dyed silk ribbons.",
		badgeLabel: "MEDIUMS",
		medium: "Agate, Marble, Silk Ribbon",
	},
];

export function ServicesEditorial() {
	return (
		<section className="relative overflow-hidden w-full py-16 sm:py-20 lg:py-24 bg-primary text-on-primary" id="services-atelier">
			{/* Ambient background glows for depth */}
			<div className="pointer-events-none absolute -top-32 -left-32 w-80 h-80 rounded-full bg-tertiary-fixed/5 blur-3xl" aria-hidden="true" />
			<div className="pointer-events-none absolute -bottom-32 -right-32 w-80 h-80 rounded-full bg-brand-script/5 blur-3xl" aria-hidden="true" />

			<div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
					{/* Editorial Narrative & Consultation Column */}
					<div className="lg:col-span-4 flex flex-col">
						<div className="flex items-center gap-2">
							<span className="w-1.5 h-1.5 rounded-full bg-tertiary-fixed inline-block" />
							<span className="text-xs uppercase tracking-widest text-tertiary-fixed-dim font-medium">
								Atelier Craftsmanship
							</span>
						</div>

						<h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-on-primary font-normal tracking-wide leading-[1.15] mt-3">
							Our Bespoke Services
						</h2>

						<div className="w-12 h-0.5 bg-tertiary-fixed/40 my-5" />

						<p className="text-sm sm:text-base text-on-primary/80 font-light leading-relaxed">
							From intimate anniversary vows to high-profile brand activations and private wedding suites,
							each stroke is executed with intention, archival materials, and unhurried patience.
						</p>

						{/* Elevated Bespoke Consultation Spotlight Card */}
						<div className="mt-8 p-6 sm:p-7 bg-white/[0.05] border border-white/10 rounded-sm hover:border-tertiary-fixed/30 hover:bg-white/[0.08] transition-all duration-300 flex flex-col justify-between group shadow-2xs">
							<div>
								<div className="flex items-center justify-between mb-4">
									<span className="text-xs uppercase tracking-widest text-tertiary-fixed font-medium flex items-center gap-1.5">
										<Sparkles className="w-3.5 h-3.5" />
										Custom Projects
									</span>
									<div className="w-8 h-8 rounded-full bg-white/[0.04] border border-white/10 flex items-center justify-center text-tertiary-fixed group-hover:scale-105 transition-transform">
										<MessageSquare className="w-4 h-4" />
									</div>
								</div>

								<h3 className="font-serif text-xl sm:text-2xl text-on-primary font-normal tracking-wide mb-2">
									Commission Consultation
								</h3>

								<p className="text-xs sm:text-sm text-on-primary/75 font-light leading-relaxed">
									Have an unusual surface, personal heirloom, or bespoke event to inscribe? The studio
									collaborates directly with patrons across India & internationally.
								</p>
							</div>

							<div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
								<span className="text-xs uppercase tracking-wider text-on-primary/60 font-medium">
									Bespoke Dossier
								</span>
								<Link
									href="/contact"
									className="inline-flex items-center gap-1.5 text-xs uppercase tracking-wider font-semibold text-tertiary-fixed hover:text-white transition-colors group/link"
								>
									<span>Inquire with Studio</span>
									<ArrowRight className="w-3.5 h-3.5 group-hover/link:translate-x-1 transition-transform" />
								</Link>
							</div>
						</div>
					</div>

					{/* 4 Curated Craftsmanship Cards */}
					<div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-6">
						{SERVICES.map((service) => (
							<div
								key={service.number}
								className="p-6 sm:p-8 bg-white/[0.05] border border-white/10 rounded-sm hover:border-tertiary-fixed/30 hover:bg-white/[0.08] hover:-translate-y-0.5 transition-all duration-300 flex flex-col justify-between group shadow-2xs"
							>
								<div>
									<div className="flex items-center justify-between mb-5">
										<span className="font-serif text-2xl sm:text-3xl text-tertiary-fixed/40 font-light select-none group-hover:text-tertiary-fixed/70 transition-colors">
											{service.number}
										</span>
										<div className="w-9 h-9 rounded-full bg-white/[0.04] border border-white/10 flex items-center justify-center text-tertiary-fixed group-hover:bg-tertiary-fixed/15 group-hover:scale-105 transition-all duration-300">
											<service.icon className="w-4 h-4" />
										</div>
									</div>

									<h3 className="font-serif text-xl sm:text-2xl text-on-primary font-normal tracking-wide mb-2.5">
										{service.title}
									</h3>

									<p className="text-xs sm:text-sm text-on-primary/75 font-light leading-relaxed">
										{service.description}
									</p>
								</div>

								{/* Craftsmanship Surface & Medium Details (replacing repetitive Book Service button) */}
								<div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-xs">
									<span className="uppercase tracking-widest text-tertiary-fixed-dim font-medium">
										{service.badgeLabel}
									</span>
									<span className="text-on-primary/75 font-light tracking-wide text-right">
										{service.medium}
									</span>
								</div>
							</div>
						))}
					</div>
				</div>
			</div>
		</section>
	);
}
