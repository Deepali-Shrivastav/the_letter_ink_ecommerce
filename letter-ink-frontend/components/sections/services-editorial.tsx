import { FileText, Gem, Mail, MessageSquare, Tag } from "lucide-react";
import Link from "next/link";

export function ServicesEditorial() {
	return (
		<section className="w-full py-space-xl bg-primary text-on-primary" id="services-atelier">
			<div className="max-w-7xl mx-auto px-margin-mobile md:px-margin">
				<div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
					{/* Sticky / Asymmetrical Editorial Column */}
					<div className="lg:col-span-4 flex flex-col">
						<span className="font-label-sm text-label-sm uppercase tracking-widest text-tertiary-fixed-dim">
							Atelier Craftsmanship
						</span>
						<h2 className="font-display-hero text-headline-lg md:text-display-hero text-on-primary tracking-wide leading-tight mt-2">
							Our Bespoke Services
						</h2>
						<div className="w-12 h-0.5 bg-tertiary-fixed-dim my-6" />
						<p className="font-body-lg text-body-lg text-on-primary/80">
							From intimate anniversary vows to high-profile brand activations and private wedding suites,
							each stroke is executed with intention, archival materials, and unhurried patience.
						</p>
						<div className="mt-8 p-8 bg-white/[0.06] border border-white/10 rounded-xl shadow-sm flex flex-col justify-between hover:bg-white/[0.1] hover:border-tertiary-fixed-dim/40 transition-colors">
							<div>
								<div className="flex items-center justify-between mb-4">
									<span className="font-display-hero text-2xl text-tertiary-fixed-dim/70">00</span>
									<MessageSquare className="w-6 h-6 text-tertiary-fixed-dim" />
								</div>
								<h3 className="font-headline-md text-headline-md text-on-primary mb-2">
									Commission Consultation
								</h3>
								<p className="font-body-md text-body-md text-on-primary/75 leading-relaxed">
									Have an unusual surface or personal heirloom to inscribe? We take custom requests across
									India & internationally.
								</p>
							</div>
							<div className="mt-6 pt-4 flex items-center justify-between border-t border-white/10">
								<span className="font-label-sm text-label-sm uppercase text-on-primary/60">Bespoke Projects</span>
								<a
									href="mailto:concierge@theletterink.com"
									className="text-tertiary-fixed-dim hover:text-white font-label-sm text-label-sm uppercase tracking-wider font-bold hover:underline"
								>
									Inquire With Studio →
								</a>
							</div>
						</div>
					</div>
					{/* 4 Services Detailed Grid */}
					<div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-6">
						{/* Service 1 */}
						<div className="p-8 bg-white/[0.06] border border-white/10 rounded-xl shadow-sm flex flex-col justify-between hover:bg-white/[0.1] hover:border-tertiary-fixed-dim/40 transition-colors">
							<div>
								<div className="flex items-center justify-between mb-4">
									<span className="font-display-hero text-2xl text-tertiary-fixed-dim/70">01</span>
									<Gem className="w-6 h-6 text-tertiary-fixed-dim" />
								</div>
								<h3 className="font-headline-md text-headline-md text-on-primary mb-2">Engraving</h3>
								<p className="font-body-md text-body-md text-on-primary/75 leading-relaxed">
									Hand-engraved perfume bottles, wine bottles, crystal tumblers, and acrylic luxury keepsakes.
									Done using precision micro-drill burs, finished with gold or silver wax leafing.
								</p>
							</div>
							<div className="mt-6 pt-4 flex items-center justify-between border-t border-white/10">
								<span className="font-label-sm text-label-sm uppercase text-on-primary/60">
									Glass, Metal, Stone
								</span>
								<Link
									href="/contact"
									className="text-tertiary-fixed-dim hover:text-white font-label-sm text-label-sm uppercase tracking-wider font-bold hover:underline"
								>
									Book Service →
								</Link>
							</div>
						</div>
						{/* Service 2 */}
						<div className="p-8 bg-white/[0.06] border border-white/10 rounded-xl shadow-sm flex flex-col justify-between hover:bg-white/[0.1] hover:border-tertiary-fixed-dim/40 transition-colors">
							<div>
								<div className="flex items-center justify-between mb-4">
									<span className="font-display-hero text-2xl text-tertiary-fixed-dim/70">02</span>
									<FileText className="w-6 h-6 text-tertiary-fixed-dim" />
								</div>
								<h3 className="font-headline-md text-headline-md text-on-primary mb-2">Handwritten Letters</h3>
								<p className="font-body-md text-body-md text-on-primary/75 leading-relaxed">
									Intimate love letters, wedding morning exchanges, and anniversary notes handwritten with
									pointed pen dip calligraphy on hand-torn cotton deckle-edge paper.
								</p>
							</div>
							<div className="mt-6 pt-4 flex items-center justify-between border-t border-white/10">
								<span className="font-label-sm text-label-sm uppercase text-on-primary/60">
									Archival Cotton Stock
								</span>
								<Link
									href="/contact"
									className="text-tertiary-fixed-dim hover:text-white font-label-sm text-label-sm uppercase tracking-wider font-bold hover:underline"
								>
									Book Service →
								</Link>
							</div>
						</div>
						{/* Service 3 */}
						<div className="p-8 bg-white/[0.06] border border-white/10 rounded-xl shadow-sm flex flex-col justify-between hover:bg-white/[0.1] hover:border-tertiary-fixed-dim/40 transition-colors">
							<div>
								<div className="flex items-center justify-between mb-4">
									<span className="font-display-hero text-2xl text-tertiary-fixed-dim/70">03</span>
									<Mail className="w-6 h-6 text-tertiary-fixed-dim" />
								</div>
								<h3 className="font-headline-md text-headline-md text-on-primary mb-2">Envelope Addressing</h3>
								<p className="font-body-md text-body-md text-on-primary/75 leading-relaxed">
									Transform invitations into an unforgettable preview. Bespoke guest addressing in copperplate
									or modern script with custom ink color matching and vintage stamp curation.
								</p>
							</div>
							<div className="mt-6 pt-4 flex items-center justify-between border-t border-white/10">
								<span className="font-label-sm text-label-sm uppercase text-on-primary/60">
									Full Suite Coordination
								</span>
								<Link
									href="/contact"
									className="text-tertiary-fixed-dim hover:text-white font-label-sm text-label-sm uppercase tracking-wider font-bold hover:underline"
								>
									Book Service →
								</Link>
							</div>
						</div>
						{/* Service 4 */}
						<div className="p-8 bg-white/[0.06] border border-white/10 rounded-xl shadow-sm flex flex-col justify-between hover:bg-white/[0.1] hover:border-tertiary-fixed-dim/40 transition-colors">
							<div>
								<div className="flex items-center justify-between mb-4">
									<span className="font-display-hero text-2xl text-tertiary-fixed-dim/70">04</span>
									<Tag className="w-6 h-6 text-tertiary-fixed-dim" />
								</div>
								<h3 className="font-headline-md text-headline-md text-on-primary mb-2">Placecards & Tags</h3>
								<p className="font-body-md text-body-md text-on-primary/75 leading-relaxed">
									Elevate your dinner tablescape with individual calligraphed placecards, polished Brazilian
									agate slices, marble tiles, handmade paper ribbons, and gift tags.
								</p>
							</div>
							<div className="mt-6 pt-4 flex items-center justify-between border-t border-white/10">
								<span className="font-label-sm text-label-sm uppercase text-on-primary/60">
									Agate, Acrylic, Paper
								</span>
								<Link
									href="/contact"
									className="text-tertiary-fixed-dim hover:text-white font-label-sm text-label-sm uppercase tracking-wider font-bold hover:underline"
								>
									Book Service →
								</Link>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
