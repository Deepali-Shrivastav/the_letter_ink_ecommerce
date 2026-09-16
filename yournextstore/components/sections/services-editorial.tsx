import Link from "next/link";

export function ServicesEditorial() {
	return (
		<section className="w-full py-space-xl bg-paper-tint" id="services-atelier">
			<div className="max-w-7xl mx-auto px-margin-mobile md:px-margin">
				<div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
					{/* Sticky / Asymmetrical Editorial Column */}
					<div className="lg:col-span-4 flex flex-col">
						<span className="font-label-sm text-label-sm uppercase tracking-widest text-secondary">
							Atelier Craftsmanship
						</span>
						<h2 className="font-display-hero text-headline-lg md:text-display-hero text-primary tracking-wide leading-tight mt-2">
							Our Bespoke Services
						</h2>
						<div className="w-12 h-0.5 bg-primary my-6" />
						<p className="font-body-lg text-body-lg text-secondary">
							From intimate anniversary vows to high-profile brand activations and private wedding suites, each
							stroke is executed with intention, archival materials, and unhurried patience.
						</p>
						<div className="mt-8 p-6 bg-surface-container-lowest rounded-xl shadow-sm">
							<h4 className="font-label-md text-label-md uppercase tracking-wider text-primary mb-2">
								Commission Consultation
							</h4>
							<p className="font-body-sm text-body-sm text-secondary mb-4">
								Have an unusual surface or personal heirloom to inscribe? We take custom requests across India &
								internationally.
							</p>
							<a
								href="mailto:concierge@theletterink.com"
								className="inline-flex items-center gap-2 text-primary font-label-sm text-label-sm uppercase tracking-widest hover:underline"
							>
								<span>Inquire With Studio</span>
								<span className="material-symbols-outlined text-[16px]">arrow_outward</span>
							</a>
						</div>
					</div>
					{/* 4 Services Detailed Grid */}
					<div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-6">
						{/* Service 1 */}
						<div className="p-8 bg-surface-container-lowest rounded-xl shadow-sm flex flex-col justify-between hover:bg-tertiary-fixed/20 transition-colors">
							<div>
								<div className="flex items-center justify-between mb-4">
									<span className="font-display-hero text-2xl text-secondary">01</span>
									<span className="material-symbols-outlined text-primary text-[28px]">diamond</span>
								</div>
								<h3 className="font-headline-md text-headline-md text-primary mb-2">Engraving</h3>
								<p className="font-body-md text-body-md text-secondary leading-relaxed">
									Hand-engraved perfume bottles, wine bottles, crystal tumblers, and acrylic luxury keepsakes.
									Done using precision micro-drill burs, finished with gold or silver wax leafing.
								</p>
							</div>
							<div className="mt-6 pt-4 flex items-center justify-between">
								<span className="font-label-sm text-label-sm uppercase text-secondary">Glass, Metal, Stone</span>
								<Link href="#services-atelier" className="text-primary font-label-sm text-label-sm uppercase tracking-wider font-bold hover:underline">
									Book Service →
								</Link>
							</div>
						</div>
						{/* Service 2 */}
						<div className="p-8 bg-surface-container-lowest rounded-xl shadow-sm flex flex-col justify-between hover:bg-tertiary-fixed/20 transition-colors">
							<div>
								<div className="flex items-center justify-between mb-4">
									<span className="font-display-hero text-2xl text-secondary">02</span>
									<span className="material-symbols-outlined text-primary text-[28px]">edit_note</span>
								</div>
								<h3 className="font-headline-md text-headline-md text-primary mb-2">Handwritten Letters</h3>
								<p className="font-body-md text-body-md text-secondary leading-relaxed">
									Intimate love letters, wedding morning exchanges, and anniversary notes handwritten with pointed
									pen dip calligraphy on hand-torn cotton deckle-edge paper.
								</p>
							</div>
							<div className="mt-6 pt-4 flex items-center justify-between">
								<span className="font-label-sm text-label-sm uppercase text-secondary">Archival Cotton Stock</span>
								<Link href="#services-atelier" className="text-primary font-label-sm text-label-sm uppercase tracking-wider font-bold hover:underline">
									Book Service →
								</Link>
							</div>
						</div>
						{/* Service 3 */}
						<div className="p-8 bg-surface-container-lowest rounded-xl shadow-sm flex flex-col justify-between hover:bg-tertiary-fixed/20 transition-colors">
							<div>
								<div className="flex items-center justify-between mb-4">
									<span className="font-display-hero text-2xl text-secondary">03</span>
									<span className="material-symbols-outlined text-primary text-[28px]">markunread_mailbox</span>
								</div>
								<h3 className="font-headline-md text-headline-md text-primary mb-2">Envelope Addressing</h3>
								<p className="font-body-md text-body-md text-secondary leading-relaxed">
									Transform invitations into an unforgettable preview. Bespoke guest addressing in copperplate or
									modern script with custom ink color matching and vintage stamp curation.
								</p>
							</div>
							<div className="mt-6 pt-4 flex items-center justify-between">
								<span className="font-label-sm text-label-sm uppercase text-secondary">Full Suite Coordination</span>
								<Link href="#services-atelier" className="text-primary font-label-sm text-label-sm uppercase tracking-wider font-bold hover:underline">
									Book Service →
								</Link>
							</div>
						</div>
						{/* Service 4 */}
						<div className="p-8 bg-surface-container-lowest rounded-xl shadow-sm flex flex-col justify-between hover:bg-tertiary-fixed/20 transition-colors">
							<div>
								<div className="flex items-center justify-between mb-4">
									<span className="font-display-hero text-2xl text-secondary">04</span>
									<span className="material-symbols-outlined text-primary text-[28px]">loyalty</span>
								</div>
								<h3 className="font-headline-md text-headline-md text-primary mb-2">Placecards & Tags</h3>
								<p className="font-body-md text-body-md text-secondary leading-relaxed">
									Elevate your dinner tablescape with individual calligraphed placecards, polished Brazilian agate
									slices, marble tiles, handmade paper ribbons, and gift tags.
								</p>
							</div>
							<div className="mt-6 pt-4 flex items-center justify-between">
								<span className="font-label-sm text-label-sm uppercase text-secondary">Agate, Acrylic, Paper</span>
								<Link href="#services-atelier" className="text-primary font-label-sm text-label-sm uppercase tracking-wider font-bold hover:underline">
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
