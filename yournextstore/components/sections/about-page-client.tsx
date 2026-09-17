"use client";

import Link from "next/link";
import {
	PenTool,
	Layers,
	ShieldCheck,
	Diamond,
	Feather,
	Sparkles,
	History,
	ArrowRight,
} from "lucide-react";

export function AboutPageClient() {
	return (
		<div className="flex flex-col w-full bg-background min-h-screen text-on-surface">
			{/* Top Breadcrumb & Editorial Header Band */}
			<section className="w-full bg-paper-tint py-4 px-4 sm:px-6 lg:px-16 border-b border-border-vellum">
				<div className="max-w-[1440px] mx-auto flex flex-wrap items-center justify-between gap-4">
					<nav aria-label="Breadcrumbs" className="flex items-center gap-2 text-xs uppercase tracking-widest text-secondary font-label-sm">
						<Link href="/" className="hover:text-primary transition-colors">
							Home
						</Link>
						<span className="text-outline-variant">/</span>
						<span className="text-primary font-semibold">About Us</span>
					</nav>
					<div className="inline-flex items-center gap-2 px-3 py-1 bg-[#fadcd0] rounded-full">
						<span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
						<span className="text-xs uppercase tracking-widest text-[#271811] font-bold">
							Our Story & Craft
						</span>
					</div>
				</div>
			</section>

			{/* Hero / Vision Narrative Section */}
			<section className="w-full py-16 lg:py-20 px-4 sm:px-6 lg:px-16">
				<div className="max-w-[1440px] mx-auto">
					<div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
						{/* Left Column: Title and Large Quote */}
						<div className="lg:col-span-7 flex flex-col gap-8">
							<div className="space-y-2">
								<span className="text-xs uppercase tracking-widest text-secondary block font-semibold">
									Atelier Genesis • Bhusawal, Maharashtra
								</span>
								<h1 className="font-display-hero text-4xl sm:text-5xl lg:text-6xl text-primary tracking-tight leading-tight font-serif">
									The Story of The Letter Ink — The Art of Hand-Penned Devotion
								</h1>
							</div>

							{/* Highlighted Quote Card */}
							<div className="bg-paper-tint p-8 shadow-sm border border-border-vellum relative overflow-hidden rounded-sm">
								<p className="font-serif text-2xl lg:text-3xl italic text-primary leading-relaxed">
									“The Letter Ink is a calligraphy based design studio which strives to bring back the treasure and love of hand rendered scripts. Give us your words and we frame them into reality.”
								</p>
								<div className="mt-6 pt-4 border-t border-border-vellum/60 flex items-center gap-3">
									<span className="h-[1px] w-8 bg-primary"></span>
									<span className="text-xs uppercase tracking-wider text-primary font-semibold">
										The Studio Creed
									</span>
								</div>
							</div>
						</div>

						{/* Right Column: Atelier Bio & Slow Living Narrative */}
						<div className="lg:col-span-5 flex flex-col gap-6 pt-2">
							<p className="font-body-lg text-base lg:text-lg text-on-surface leading-relaxed font-light">
								In an era defined by ephemeral pixels, automated typefaces, and rushed correspondence, The Letter Ink was born from a singular, sacred impulse: to preserve the physical heartbeat of slow penmanship.
							</p>
							<p className="text-sm text-on-surface-variant leading-relaxed font-light">
								Founded in Bhusawal, Maharashtra, our studio honors the ancient discipline of the pointed nib and fluid carbon inks. Every curve is pulled with breath and patience; every flourish carries the subtle, irreplaceable tremors of human devotion. We believe words meant to endure deserve tangible, archival weight.
							</p>
							<p className="text-sm text-on-surface-variant leading-relaxed font-light">
								From heirloom wedding vow suites in floating glass frames to custom family crests, monogrammed seals, and artisanal correspondence, we transform private sentiments into lasting relics that bridge memory, paper, and hand.
							</p>
							<div className="pt-2">
								<div className="bg-surface-container-low p-5 rounded-sm border border-border-vellum flex items-center justify-between">
									<div>
										<span className="text-xs uppercase tracking-wider text-secondary block font-semibold">
											Origin Atelier
										</span>
										<span className="font-serif text-xl text-primary font-medium">Bhusawal, India</span>
									</div>
									<PenTool className="w-8 h-8 text-primary" />
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Visual Feature Split: Studio Desk & Scribe in Focus */}
			<section className="w-full bg-paper-tint py-16 lg:py-20 px-4 sm:px-6 lg:px-16 border-y border-border-vellum">
				<div className="max-w-[1440px] mx-auto">
					<div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
						{/* Image Panel */}
						<div className="lg:col-span-6 relative">
							<div className="aspect-[4/5] w-full overflow-hidden bg-surface-container shadow-md rounded-sm border border-border-vellum">
								<img
									className="w-full h-full object-cover"
									alt="Brass pointed dip-pen with black ink on deckle edge cotton paper"
									src="https://lh3.googleusercontent.com/aida-public/AB6AXuAr4tt7WPUDR8WIxHslWXBxyvHf9DIFDiUJ5KjHAerqO0CEP6IB5jkoVEksDTJXAOZDsmYYt02gzehW5l7_-ZKBFas7PhX76_80cJWZiZrOj4BjfD8Ve8i63dctJwikOeuR4ozJFO1rS683-P6v6RHRFweKfZE3h6Kp3uf8yqx7EOZUyzvHYUs3Kzk7Y2puMM8Afm7FRe4AzDQTuNPD3qSIZArnh9jgUSUg7oK7hxDazkJr6SCreSs"
								/>
							</div>
							{/* Floating Tag */}
							<div className="absolute -bottom-6 right-6 bg-surface p-5 shadow-md hidden sm:block max-w-xs rounded-sm border border-border-vellum">
								<span className="text-xs uppercase tracking-wider text-secondary block mb-1 font-semibold">
									Tools of the Guild
								</span>
								<p className="text-xs text-primary font-medium">
									Vintage Hunt 101 nibs, walnut crystals, and genuine 24k Japanese gold leaf.
								</p>
							</div>
						</div>

						{/* Narrative & Craft Details */}
						<div className="lg:col-span-6 flex flex-col gap-6 lg:pl-6">
							<div>
								<span className="text-xs uppercase tracking-widest text-secondary block mb-2 font-semibold">
									THE SCRIBE'S SANCTUARY
								</span>
								<h2 className="font-display-hero text-3xl lg:text-4xl text-primary font-serif tracking-tight leading-snug">
									Every stroke is an unhurried meditation on human connection.
								</h2>
							</div>
							<p className="text-sm text-on-surface-variant leading-relaxed font-light">
								Our atelier table holds no mechanical presses, no mass toner cartridges, and zero synthesized prints. Each creation begins with water-ground carbon inks, custom-blended gouache, and nibs balanced to measure the calligrapher's exact pressure against heavyweight rag cotton.
							</p>
							<div className="space-y-4">
								<div className="flex items-start gap-4 p-4 bg-surface shadow-sm rounded-sm border border-border-vellum/60">
									<Feather className="w-5 h-5 text-primary mt-1 shrink-0" />
									<div>
										<h4 className="text-xs uppercase tracking-wider text-primary font-semibold">
											Pointed Pen Discipline
										</h4>
										<p className="text-xs text-on-surface-variant font-light mt-0.5">
											Mastery of classical Spencerian and Copperplate hands requiring hours of rhythmic muscular focus.
										</p>
									</div>
								</div>
								<div className="flex items-start gap-4 p-4 bg-surface shadow-sm rounded-sm border border-border-vellum/60">
									<ShieldCheck className="w-5 h-5 text-primary mt-1 shrink-0" />
									<div>
										<h4 className="text-xs uppercase tracking-wider text-primary font-semibold">
											Archival Permanence
										</h4>
										<p className="text-xs text-on-surface-variant font-light mt-0.5">
											Acid-free 300 GSM cotton rag, UV-resistant pigments, and heirloom double-glass floating frames.
										</p>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Three Pillars of The Atelier */}
			<section className="w-full py-20 px-4 sm:px-6 lg:px-16">
				<div className="max-w-[1440px] mx-auto">
					<div className="text-center max-w-2xl mx-auto mb-16">
						<span className="text-xs uppercase tracking-widest text-secondary block mb-2 font-semibold">
							FOUNDATIONAL COMMITMENTS
						</span>
						<h2 className="font-headline-lg text-3xl lg:text-4xl text-primary font-serif tracking-tight">
							The Three Pillars of The Atelier
						</h2>
						<div className="w-12 h-[1px] bg-primary mx-auto mt-3"></div>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
						{/* Pillar 1 */}
						<div className="bg-surface p-8 shadow-sm border border-border-vellum rounded-sm flex flex-col justify-between hover:shadow-md transition-shadow">
							<div>
								<div className="w-12 h-12 bg-[#fadcd0] flex items-center justify-center text-primary mb-6 rounded-sm">
									<Layers className="w-6 h-6" />
								</div>
								<h3 className="text-sm uppercase text-primary tracking-wider font-semibold mb-3">
									Archival Integrity
								</h3>
								<p className="text-xs text-on-surface-variant leading-relaxed font-light mb-6">
									We exclusively commission hand-milled 100% pure cotton rag paper (300 GSM) with raw deckled edges, genuine black Sumi soot inks, 24k leaf gilding, and heavyweight brass-stamped botanical wax seals.
								</p>
							</div>
							<div className="pt-3 border-t border-border-vellum/60">
								<span className="text-[11px] uppercase tracking-widest text-secondary font-semibold">
									Zero Machine Print
								</span>
							</div>
						</div>

						{/* Pillar 2 */}
						<div className="bg-surface p-8 shadow-sm border border-border-vellum rounded-sm flex flex-col justify-between hover:shadow-md transition-shadow">
							<div>
								<div className="w-12 h-12 bg-[#fadcd0] flex items-center justify-center text-primary mb-6 rounded-sm">
									<PenTool className="w-6 h-6" />
								</div>
								<h3 className="text-sm uppercase text-primary tracking-wider font-semibold mb-3">
									Pointed Pen Mastery
								</h3>
								<p className="text-xs text-on-surface-variant leading-relaxed font-light mb-6">
									Every curve honors centuries of tradition. From delicate Spencerian letterforms to strict Classical Copperplate balance and contemporary Roman capitals, every script is drafted freehand without stencils.
								</p>
							</div>
							<div className="pt-3 border-t border-border-vellum/60">
								<span className="text-[11px] uppercase tracking-widest text-secondary font-semibold">
									Freehand Handcrafted
								</span>
							</div>
						</div>

						{/* Pillar 3 */}
						<div className="bg-surface p-8 shadow-sm border border-border-vellum rounded-sm flex flex-col justify-between hover:shadow-md transition-shadow">
							<div>
								<div className="w-12 h-12 bg-[#fadcd0] flex items-center justify-center text-primary mb-6 rounded-sm">
									<Diamond className="w-6 h-6" />
								</div>
								<h3 className="text-sm uppercase text-primary tracking-wider font-semibold mb-3">
									Bespoke Lineage
								</h3>
								<p className="text-xs text-on-surface-variant leading-relaxed font-light mb-6">
									Each commission is treated as a future family heirloom. We assemble custom brass double-glass floating displays to immortalize wedding vows, birth announcements, and intimate correspondence.
								</p>
							</div>
							<div className="pt-3 border-t border-border-vellum/60">
								<span className="text-[11px] uppercase tracking-widest text-secondary font-semibold">
									Heirloom Keepsakes
								</span>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Numerical Atelier Milestones */}
			<section className="w-full bg-paper-tint py-12 px-4 sm:px-6 lg:px-16 border-y border-border-vellum">
				<div className="max-w-[1440px] mx-auto">
					<div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
						<div className="flex flex-col items-center justify-center p-4">
							<span className="font-serif text-4xl lg:text-5xl text-primary font-bold">2019</span>
							<span className="text-xs uppercase tracking-widest text-secondary mt-2 font-semibold">
								Atelier Established
							</span>
						</div>
						<div className="flex flex-col items-center justify-center p-4">
							<span className="font-serif text-4xl lg:text-5xl text-primary font-bold">3,400+</span>
							<span className="text-xs uppercase tracking-widest text-secondary mt-2 font-semibold">
								Keepsakes Penned
							</span>
						</div>
						<div className="flex flex-col items-center justify-center p-4">
							<span className="font-serif text-4xl lg:text-5xl text-primary font-bold">25+</span>
							<span className="text-xs uppercase tracking-widest text-secondary mt-2 font-semibold">
								Masterclasses Held
							</span>
						</div>
						<div className="flex flex-col items-center justify-center p-4">
							<span className="font-serif text-4xl lg:text-5xl text-primary font-bold">100%</span>
							<span className="text-xs uppercase tracking-widest text-secondary mt-2 font-semibold">
								Pure Dip-Pen Script
							</span>
						</div>
					</div>
				</div>
			</section>

			{/* Process & Sequence Breakdown */}
			<section className="w-full py-20 px-4 sm:px-6 lg:px-16">
				<div className="max-w-[1440px] mx-auto">
					<div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
						<div className="lg:col-span-5 flex flex-col gap-6">
							<span className="text-xs uppercase tracking-widest text-secondary font-semibold">
								THE ATELIER SEQUENCE
							</span>
							<h2 className="font-display-hero text-3xl lg:text-4xl text-primary font-serif leading-snug">
								From unwritten silence to framed permanence.
							</h2>
							<p className="text-sm text-on-surface-variant leading-relaxed font-light">
								We follow a sacred ritual for every single custom order. Whether it is a single poem or a comprehensive sixty-piece wedding invitation suite, our hand remains deliberate at each juncture.
							</p>
							<div className="space-y-6 mt-2">
								<div className="flex items-start gap-4">
									<span className="font-serif text-2xl text-primary font-bold">01.</span>
									<div>
										<h4 className="text-xs uppercase tracking-wider text-primary font-semibold">
											Scripting & Alignment
										</h4>
										<p className="text-xs text-on-surface-variant font-light mt-0.5">
											Harmonizing words to exact proportion, choosing between traditional oblique dip-pens or straight Roman holders.
										</p>
									</div>
								</div>
								<div className="flex items-start gap-4">
									<span className="font-serif text-2xl text-primary font-bold">02.</span>
									<div>
										<h4 className="text-xs uppercase tracking-wider text-primary font-semibold">
											Ink Chemistry & Gilding
										</h4>
										<p className="text-xs text-on-surface-variant font-light mt-0.5">
											Selecting Sumi carbon density, walnut hue warmth, or genuine 24 karat sizing for radiant metallic accents.
										</p>
									</div>
								</div>
								<div className="flex items-start gap-4">
									<span className="font-serif text-2xl text-primary font-bold">03.</span>
									<div>
										<h4 className="text-xs uppercase tracking-wider text-primary font-semibold">
											Float Framing & Sealing
										</h4>
										<p className="text-xs text-on-surface-variant font-light mt-0.5">
											Archival framing in dual glass panes, accented with hand-pressed botanical wax seals poured at 180°C.
										</p>
									</div>
								</div>
							</div>
						</div>

						<div className="lg:col-span-7 grid grid-cols-2 gap-6">
							<div className="aspect-[3/4] overflow-hidden bg-surface-container shadow-sm rounded-sm border border-border-vellum">
								<img
									className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
									alt="Hand-penned wedding vows framed in double glass"
									src="https://lh3.googleusercontent.com/aida-public/AB6AXuCFJSs-1EccehTUPrtcxai8bEB9hbA6ZkiPCRKuA875zPjVJAAdHxVqv5sGYdekUsQwdTkspmmcQxLEm6NYLf_RgADtcGSGVhbjMnGpj9YMGHBb1r7SyrD69zHQp58s2YfT5dmxjEfHrMzIXE1VYDU-Vre89fH84HQ5CIWNdL-U1rzR5z4X4oFwr5pkYhgigfy1sfQlBEnWobRjZ8EICtB0A0tZH8ogaIt9_juBGlWvWWEHd0RR1to"
								/>
							</div>
							<div className="aspect-[3/4] overflow-hidden bg-surface-container shadow-sm rounded-sm border border-border-vellum mt-8">
								<img
									className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
									alt="Crimson botanical wax seals stamped with custom monogram"
									src="https://lh3.googleusercontent.com/aida-public/AB6AXuD86NXzTXQXqshgohX0uBk2i5GK5lhK_0d6GNYyydSS_0n_eGACOCJLd7dp0GAY4A1Qqa2hfSmrCs678t5g-pyE50zZ81mYHg906z-aLqbxYxfSgzglzETDkGbeNnMLTRL2IKmS9Lvo8TupcG5l3N4vONNFisFhxe7IYMfd1oZx-tROwK8Ncr5R6Kbp34kHvWqvDQy1liD396eHS1hfTUzVkSgpM8zcPKbJPTmuVYfPejkJBCbGUlM"
								/>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Bottom Action CTA */}
			<section className="w-full bg-paper-tint py-12 border-t border-border-vellum">
				<div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-16 text-center">
					<div className="max-w-2xl mx-auto">
						<h3 className="font-headline-md text-2xl text-primary font-serif mb-2">
							Ready to Commission a Bespoke Keepsake?
						</h3>
						<p className="text-sm text-on-surface-variant mb-6 font-light">
							Explore our curated gifting concierge or consult directly with our Bhusawal atelier.
						</p>
						<div className="flex flex-wrap justify-center items-center gap-4">
							<Link
								href="/gifting"
								className="bg-[#fadcd0] hover:bg-primary hover:text-on-primary text-[#271811] text-xs uppercase tracking-wider px-8 py-3.5 transition-colors rounded-sm font-semibold"
							>
								Explore Gifting Concierge
							</Link>
							<Link
								href="/contact"
								className="bg-primary hover:bg-secondary text-on-primary text-xs uppercase tracking-wider px-8 py-3.5 transition-colors rounded-sm font-semibold inline-flex items-center gap-2"
							>
								Initiate Inquiry <ArrowRight className="w-4 h-4" />
							</Link>
						</div>
					</div>
				</div>
			</section>
		</div>
	);
}
