"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowDown, ArrowUpRight, Download, Calendar, Check, Sparkles, Send } from "lucide-react";

export function GiftingPageClient() {
	// Interactive Concierge State
	const [currentStep, setCurrentStep] = useState<number>(1);
	const [medium, setMedium] = useState<string>("Handmade Deckle Cotton");
	const [script, setScript] = useState<string>("Copperplate Classical");
	const [userText, setUserText] = useState<string>("");
	const [sealColor, setSealColor] = useState<string>("Blush Rose");
	const [botanical, setBotanical] = useState<string>("Dried Wild Eucalyptus");
	const [packaging, setPackaging] = useState<string>("Raw Silk Ribbon Tie");

	const wordCount = userText.trim() === "" ? 0 : userText.trim().split(/\s+/).length;

	return (
		<div className="flex flex-col w-full bg-background min-h-screen text-on-surface">
			{/* Hero Section */}
			<section className="relative w-full bg-paper-tint overflow-hidden border-b border-border-vellum">
				<div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-16 py-12 lg:py-20">
					<div className="flex flex-col lg:flex-row items-center gap-12">
						{/* Left Column */}
						<div className="w-full lg:w-7/12 flex flex-col items-start z-10">
							<nav aria-label="Breadcrumb" className="mb-6">
								<ol className="flex items-center space-x-2 text-xs uppercase tracking-widest text-secondary font-label-sm">
									<li>
										<Link href="/" className="hover:text-primary transition-colors">
											Home
										</Link>
									</li>
									<li className="text-outline-variant">/</li>
									<li aria-current="page" className="text-primary font-semibold">
										Gifting
									</li>
								</ol>
							</nav>
							<span className="inline-block bg-[#fadcd0] text-[#271811] px-4 py-1.5 text-xs font-semibold uppercase tracking-widest rounded-full mb-4">
								Curated Gifting Atelier
							</span>
							<h1 className="font-display-hero text-4xl sm:text-5xl lg:text-6xl text-primary mb-4 tracking-wide font-serif leading-tight">
								Artisanal Gifts for Every Milestone
							</h1>
							<p className="font-body-lg text-base lg:text-lg text-on-surface-variant max-w-xl mb-8 font-light leading-relaxed">
								Meaningful, hand-inscribed treasures crafted with timeless scripts, botanical wax seals, and heirloom framing designed to hold love across generations.
							</p>
							<div className="flex flex-wrap items-center gap-4">
								<a
									href="#concierge"
									className="bg-[#fadcd0] hover:bg-white text-primary px-7 py-3.5 text-xs uppercase tracking-wider font-semibold transition-colors inline-flex items-center gap-2 rounded-sm border border-border-vellum"
								>
									Explore Gift Guide
									<ArrowDown className="w-4 h-4" />
								</a>
								<a
									href="#corporate-consult"
									className="bg-surface-container-lowest hover:bg-[#fadcd0] text-primary px-7 py-3.5 text-xs uppercase tracking-wider font-semibold transition-colors inline-flex items-center gap-2 rounded-sm border border-border-vellum"
								>
									Corporate & Bulk Gifting
									<ArrowUpRight className="w-4 h-4" />
								</a>
							</div>
							{/* Atelier Stat Strip */}
							<div className="grid grid-cols-3 gap-6 pt-10 mt-10 w-full max-w-lg border-t border-border-vellum">
								<div>
									<span className="font-serif text-3xl font-bold text-primary block">100%</span>
									<span className="text-[11px] uppercase tracking-wider text-secondary font-semibold">Pure Cotton Paper</span>
								</div>
								<div>
									<span className="font-serif text-3xl font-bold text-primary block">48 hr</span>
									<span className="text-[11px] uppercase tracking-wider text-secondary font-semibold">Atelier Drafting</span>
								</div>
								<div>
									<span className="font-serif text-3xl font-bold text-primary block">24k</span>
									<span className="text-[11px] uppercase tracking-wider text-secondary font-semibold">Gold Foil Finishes</span>
								</div>
							</div>
						</div>
						{/* Right Column */}
						<div className="w-full lg:w-5/12 relative">
							<div className="relative w-full aspect-[4/5] bg-surface-container-lowest overflow-hidden shadow-sm rounded-sm border border-border-vellum">
								<img
									className="w-full h-full object-cover"
									alt="Handmade deckle edge cotton paper letter inscribed in fine Spencerian calligraphy with rose gold wax seal"
									src="https://lh3.googleusercontent.com/aida-public/AB6AXuBU1M2U6YRXPmpopy_4vY66woUD8yQ6EIKGnPAUpWJ0QYTzSANMzHSkUjyqExbxaYvrRrf5w8sfOlFWiIJMRzlmmsMfAc8DMXOmpLgi9dimvZ3jEmcXr06RRzKe6CicHvMxv3MEvLq5E0kwn6arSvEcXV6o_csnQTqWirojbkwi0Ey8VCRkjKyeYPyfpKR7si77AOOweGCygBffC6hHKwz2q2Y_hy-dgFTElkfZXdP5boS2k7MN-XM"
								/>
								<div className="absolute bottom-4 left-4 right-4 bg-surface-container-lowest/95 backdrop-blur-sm p-4 text-left rounded-sm border border-border-vellum">
									<p className="text-[11px] uppercase tracking-wider text-secondary font-semibold">
										Signature Atelier Presentation
									</p>
									<p className="font-serif text-lg text-primary font-medium">Deckle Parchment & Custom Sealant</p>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Gifting by Occasion Section */}
			<section className="w-full py-16 lg:py-20 bg-background" id="gift-guide">
				<div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-16">
					<div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
						<div>
							<span className="text-xs uppercase tracking-widest text-secondary block mb-1 font-semibold">
								CURATION BY CELEBRATION
							</span>
							<h2 className="font-headline-lg text-3xl lg:text-4xl text-primary font-serif">
								Gifting By Sacred Occasion
							</h2>
						</div>
						<p className="text-sm text-on-surface-variant max-w-md font-light leading-relaxed">
							Every celebration carries its own rhythm. Discover thoughtful pairings tailored for milestones of devotion, lineage, achievement, and gratitude.
						</p>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
						{/* Occasion 1 */}
						<div className="group bg-surface-container-lowest flex flex-col h-full shadow-sm border border-border-vellum rounded-sm transition-transform duration-300">
							<div className="relative aspect-[4/5] overflow-hidden bg-surface-container">
								<img
									className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
									alt="Weddings & Anniversaries Gifting"
									src="https://lh3.googleusercontent.com/aida-public/AB6AXuCmN0585oPlkvTnE6ZZgZ3E_mcmJxmoAl4Lm7gf4ch59NhAbsYEh5Grsnhj6aUmVxlNW92T23VKUhUqmnhndVDNgPL9G2IPS3XM5sWpJFOcMr-MxYD_GQ_3sKsjUxQL3mepkwfcm1RoKq-EGCVy2oIzYj265Ni9nf_gsCE78ntmqE8xgy4GSCThwSpkW94yQFORm7nnU5w4LrzR6YOrgSMz74y7rByMSAMf17NUbaODpkVfaXYr2yo"
								/>
								<span className="absolute top-4 left-4 bg-surface-container-lowest px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary rounded-full">
									Milestone 01
								</span>
							</div>
							<div className="p-6 flex flex-col flex-grow justify-between">
								<div>
									<h3 className="font-headline-sm text-xl text-primary font-serif mb-2">
										Weddings & Anniversaries
									</h3>
									<p className="text-xs text-on-surface-variant font-light mb-4 leading-relaxed">
										Bespoke vows booklets, framed wedding first-dance lyrics, bridal keepsake boxes, and engraved champagne pairs inscribed with fluid ink.
									</p>
								</div>
								<a
									href="#concierge"
									className="inline-flex items-center gap-2 text-xs uppercase tracking-wider text-primary font-semibold hover:underline"
								>
									Commission Keepsake <ArrowUpRight className="w-4 h-4" />
								</a>
							</div>
						</div>

						{/* Occasion 2 */}
						<div className="group bg-surface-container-lowest flex flex-col h-full shadow-sm border border-border-vellum rounded-sm transition-transform duration-300">
							<div className="relative aspect-[4/5] overflow-hidden bg-surface-container">
								<img
									className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
									alt="New Born & Family Lineage Gifting"
									src="https://lh3.googleusercontent.com/aida-public/AB6AXuDVmHSSq2HUEvhuN1t7qu3_BOvTBu13rfwlxeWJTIAYU-lb-5-uPnoRJV2A8GWtlKLYOFeiiEl69pqVJIpF_6ZN5Bg9x21kyD4t_NqMNafA2ic06ClzHWvozQ2JLU7FDQ9GsnfG2XDQeWnRNYMcuJFttRJ-NjtAGi9S0s4axaVKHHXidQqz4XplMWsgl2ZRtLv8pjqV5pkUKWX2DysInsIBP7cCBwr73cdRepmpiv5EJYXQ3bLR_Ng"
								/>
								<span className="absolute top-4 left-4 bg-surface-container-lowest px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary rounded-full">
									Milestone 02
								</span>
							</div>
							<div className="p-6 flex flex-col flex-grow justify-between">
								<div>
									<h3 className="font-headline-sm text-xl text-primary font-serif mb-2">
										New Born & Family Lineage
									</h3>
									<p className="text-xs text-on-surface-variant font-light mb-4 leading-relaxed">
										Heritage family tree scripts, framed birth announcements accented with 24k gold leaf calligraphy, and archival nursery blessings.
									</p>
								</div>
								<a
									href="#concierge"
									className="inline-flex items-center gap-2 text-xs uppercase tracking-wider text-primary font-semibold hover:underline"
								>
									Inscribe Lineage <ArrowUpRight className="w-4 h-4" />
								</a>
							</div>
						</div>

						{/* Occasion 3 */}
						<div className="group bg-surface-container-lowest flex flex-col h-full shadow-sm border border-border-vellum rounded-sm transition-transform duration-300">
							<div className="relative aspect-[4/5] overflow-hidden bg-surface-container">
								<img
									className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
									alt="Corporate & Executive Gifting"
									src="https://lh3.googleusercontent.com/aida-public/AB6AXuBRXdxOcOZPhzCFrSVx-PRPSJbsERWjmdC7x4dLe4yS6NJnIcmcsRKg_9Hk7gx9OMz2yG0NkUpymyDRsvlA1Z355GpqR2d_ZqLfizIhNvwNrCt4Cd2_Vm28Vsd5Fd8GqODZ5STK4ZqDg5zV_D4F5X22lxXGCidHLAce35hMycTbleZ8mXfWUM9QioYep8qD1GIKS0syuj_utCLjz92ATxIuK9G0oLWpvVOYq_weUh_EzirnP91MFig"
								/>
								<span className="absolute top-4 left-4 bg-surface-container-lowest px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary rounded-full">
									Milestone 03
								</span>
							</div>
							<div className="p-6 flex flex-col flex-grow justify-between">
								<div>
									<h3 className="font-headline-sm text-xl text-primary font-serif mb-2">
										Corporate & Executive
									</h3>
									<p className="text-xs text-on-surface-variant font-light mb-4 leading-relaxed">
										Hand-lettered executive thank-you suites, solid brass monogrammed paperweights, and prestige desk sets built for elevated partnerships.
									</p>
								</div>
								<a
									href="#corporate-consult"
									className="inline-flex items-center gap-2 text-xs uppercase tracking-wider text-primary font-semibold hover:underline"
								>
									Corporate Suites <ArrowUpRight className="w-4 h-4" />
								</a>
							</div>
						</div>

						{/* Occasion 4 */}
						<div className="group bg-surface-container-lowest flex flex-col h-full shadow-sm border border-border-vellum rounded-sm transition-transform duration-300">
							<div className="relative aspect-[4/5] overflow-hidden bg-surface-container">
								<img
									className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
									alt="Birthdays & Graduations Gifting"
									src="https://lh3.googleusercontent.com/aida-public/AB6AXuCNR2yWbhXW6aCOS3zOxKqXrsoEgNgLARF7yF69HLyOXNHv8HWud2l9TTnXqSLw0lqCSJS0Pk1k8THkPjvK0TZTAeOUi2TI7dZYyOuAgu12MdygOEWuAvjSDBvF8bgvLK8pt0hT4qqD2tCkWGUHV5AtpZTOg0B5TYyt1VyZhwPtJjI6iNROECvn80nAmCARCjUkHP9ZnfWM-8uAz4hGouISqi5t5_Xhm6vYY7FDYPhXsz6VMhjepC0"
								/>
								<span className="absolute top-4 left-4 bg-surface-container-lowest px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary rounded-full">
									Milestone 04
								</span>
							</div>
							<div className="p-6 flex flex-col flex-grow justify-between">
								<div>
									<h3 className="font-headline-sm text-xl text-primary font-serif mb-2">
										Birthdays & Graduations
									</h3>
									<p className="text-xs text-on-surface-variant font-light mb-4 leading-relaxed">
										Inscribed vintage parchment scrolls, customized poetic verses in floating glass, and commemorative milestone scrolls with personalized sigils.
									</p>
								</div>
								<a
									href="#concierge"
									className="inline-flex items-center gap-2 text-xs uppercase tracking-wider text-primary font-semibold hover:underline"
								>
									Design Scroll <ArrowUpRight className="w-4 h-4" />
								</a>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Interactive Gifting Concierge Customizer */}
			<section className="w-full py-16 lg:py-20 bg-paper-tint border-y border-border-vellum" id="concierge">
				<div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-16">
					<div className="text-center max-w-2xl mx-auto mb-12">
						<span className="text-xs uppercase tracking-widest text-secondary block mb-1 font-semibold">
							THE BESPOKE PROCESS
						</span>
						<h2 className="font-headline-lg text-3xl lg:text-4xl text-primary font-serif mb-2">
							Interactive Gifting Concierge
						</h2>
						<p className="text-sm text-on-surface-variant font-light">
							Compose your custom commission in three tactile stages. Our atelier scribes balance historical dip-pen discipline with modern sentiment.
						</p>
					</div>

					<div className="bg-surface-container-lowest shadow-sm p-6 sm:p-10 lg:p-12 rounded-sm border border-border-vellum">
						<div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
							{/* Left 8 Cols */}
							<div className="lg:col-span-8 flex flex-col justify-between">
								<div>
									{/* Step Bar */}
									<div className="flex items-center gap-4 mb-8 border-b border-border-vellum pb-4">
										<button
											onClick={() => setCurrentStep(1)}
											className={`flex items-center gap-2 text-xs uppercase font-semibold ${
												currentStep === 1 ? "text-primary" : "text-secondary"
											}`}
										>
											<span
												className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold ${
													currentStep === 1
														? "bg-primary text-on-primary"
														: "bg-surface-container-high text-secondary"
												}`}
											>
												1
											</span>
											<span>Medium</span>
										</button>
										<div className="h-px w-8 bg-border-vellum"></div>
										<button
											onClick={() => setCurrentStep(2)}
											className={`flex items-center gap-2 text-xs uppercase font-semibold ${
												currentStep === 2 ? "text-primary" : "text-secondary"
											}`}
										>
											<span
												className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold ${
													currentStep === 2
														? "bg-primary text-on-primary"
														: "bg-surface-container-high text-secondary"
												}`}
											>
												2
											</span>
											<span>Inscribe Words</span>
										</button>
										<div className="h-px w-8 bg-border-vellum"></div>
										<button
											onClick={() => setCurrentStep(3)}
											className={`flex items-center gap-2 text-xs uppercase font-semibold ${
												currentStep === 3 ? "text-primary" : "text-secondary"
											}`}
										>
											<span
												className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold ${
													currentStep === 3
														? "bg-primary text-on-primary"
														: "bg-surface-container-high text-secondary"
												}`}
											>
												3
											</span>
											<span>Finishing</span>
										</button>
									</div>

									{/* Step 1 */}
									{currentStep === 1 && (
										<div className="space-y-6">
											<div>
												<h4 className="font-serif text-xl text-primary mb-1">
													Step 1: Choose Your Keepsake Medium
												</h4>
												<p className="text-xs text-on-surface-variant font-light">
													Select the archival physical vessel that will showcase your words.
												</p>
											</div>
											<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
												{[
													{
														title: "Handmade Deckle Cotton",
														desc: "Organic frayed edges, 100% rag paper crafted via artisanal deckle vat.",
													},
													{
														title: "Victorian Glass Box",
														desc: "Floating double glass pane bordered in hand-soldered antiqued brass.",
													},
													{
														title: "Crystal Flutes (Pair)",
														desc: "Precision micro-drill drill engraving filled with fine leaf dust.",
													},
													{
														title: "Natural Oak Frame",
														desc: "Sustainable raw oak casing with UV-filtering preservation glass.",
													},
												].map((item) => (
													<div
														key={item.title}
														onClick={() => setMedium(item.title)}
														className={`cursor-pointer p-4 rounded-sm border flex flex-col justify-between transition-colors ${
															medium === item.title
																? "bg-[#fadcd0]/30 border-primary"
																: "bg-surface-container-low border-border-vellum hover:bg-[#fadcd0]/20"
														}`}
													>
														<div className="flex items-start justify-between">
															<span className="text-xs uppercase font-semibold text-primary">
																{item.title}
															</span>
															<input
																type="radio"
																name="medium"
																checked={medium === item.title}
																onChange={() => setMedium(item.title)}
																className="accent-primary w-4 h-4"
															/>
														</div>
														<span className="text-xs text-secondary mt-2 font-light">{item.desc}</span>
													</div>
												))}
											</div>
										</div>
									)}

									{/* Step 2 */}
									{currentStep === 2 && (
										<div className="space-y-6">
											<div>
												<h4 className="font-serif text-xl text-primary mb-1">
													Step 2: Script Style & Custom Sentiment
												</h4>
												<p className="text-xs text-on-surface-variant font-light">
													Provide up to 150 words of personal text along with your script preference.
												</p>
											</div>
											<div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
												{[
													{
														name: "Copperplate Classical",
														label: "Copperplate",
														sub: "Formal, rhythmic shaded loops",
													},
													{
														name: "Spencerian Heirloom",
														label: "Spencerian",
														sub: "Delicate, sweeping flourishes",
													},
													{
														name: "Modern Editorial",
														label: "Modern Sans-Serif",
														sub: "Minimalist contemporary brush",
													},
												].map((s) => (
													<button
														key={s.name}
														type="button"
														onClick={() => setScript(s.name)}
														className={`p-3 rounded-sm border text-center transition-colors ${
															script === s.name
																? "bg-primary text-on-primary border-primary"
																: "bg-surface-container-low text-on-surface border-border-vellum hover:bg-[#fadcd0]/30"
														}`}
													>
														<span className="text-xs uppercase font-semibold block">{s.label}</span>
														<span className="text-[11px] opacity-80 mt-1 block">{s.sub}</span>
													</button>
												))}
											</div>
											<div>
												<label className="text-xs uppercase tracking-wider text-secondary font-semibold block mb-1.5">
													Your Personal Passage / Message
												</label>
												<textarea
													value={userText}
													onChange={(e) => setUserText(e.target.value)}
													placeholder="Inscribe wedding vows, milestone quotes, heartfelt appreciation, or dates (Up to 150 words)..."
													rows={4}
													className="w-full bg-surface-container-lowest p-3 text-sm font-light border border-border-vellum rounded-sm focus:outline-none focus:border-primary"
												></textarea>
												<div className="flex justify-between items-center mt-1.5 text-xs text-secondary">
													<span>Our master penman will layout and balance the composition.</span>
													<span className="font-semibold">{wordCount} / 150 words</span>
												</div>
											</div>
										</div>
									)}

									{/* Step 3 */}
									{currentStep === 3 && (
										<div className="space-y-6">
											<div>
												<h4 className="font-serif text-xl text-primary mb-1">
													Step 3: Artisanal Seals & Tactile Presentation
												</h4>
												<p className="text-xs text-on-surface-variant font-light">
													Elevate your commission with hand-pressed wax seals, botanicals, and wrapping.
												</p>
											</div>
											<div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
												<div>
													<label className="text-xs uppercase tracking-wider text-secondary font-semibold block mb-2">
														Wax Seal Color
													</label>
													<div className="flex items-center gap-3">
														{[
															{ name: "Blush Rose", bg: "bg-[#E8C5B8]" },
															{ name: "Midnight Black", bg: "bg-[#1b1b1b]" },
															{ name: "Antique Champagne Gold", bg: "bg-[#D4AF37]" },
															{ name: "Parchment Ivory", bg: "bg-[#F5F2EB]" },
														].map((c) => (
															<button
																key={c.name}
																type="button"
																title={c.name}
																onClick={() => setSealColor(c.name)}
																className={`w-8 h-8 rounded-full ${c.bg} ${
																	sealColor === c.name ? "ring-2 ring-offset-2 ring-primary" : ""
																}`}
															/>
														))}
													</div>
												</div>
												<div>
													<label className="text-xs uppercase tracking-wider text-secondary font-semibold block mb-2">
														Botanical Embellishment
													</label>
													<select
														value={botanical}
														onChange={(e) => setBotanical(e.target.value)}
														className="w-full bg-surface-container-low p-2.5 text-xs text-on-surface border border-border-vellum rounded-sm focus:outline-none"
													>
														<option value="Dried Wild Eucalyptus">Dried Wild Eucalyptus</option>
														<option value="Pressed White Baby's Breath">Pressed White Baby's Breath</option>
														<option value="Fragrant Lavender Sprig">Fragrant Lavender Sprig</option>
														<option value="Minimalist (Pure Seal Only)">Minimalist (Pure Seal Only)</option>
													</select>
												</div>
												<div className="sm:col-span-2">
													<label className="text-xs uppercase tracking-wider text-secondary font-semibold block mb-2">
														Atelier Packaging Style
													</label>
													<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
														{[
															"Raw Silk Ribbon Tie",
															"Velvet Sleeve",
														].map((p) => (
															<label
																key={p}
																onClick={() => setPackaging(p)}
																className={`p-3 rounded-sm border flex items-center justify-between cursor-pointer transition-colors ${
																	packaging === p
																		? "bg-[#fadcd0]/30 border-primary"
																		: "bg-surface-container-low border-border-vellum"
																}`}
															>
																<span className="text-xs text-primary font-medium">{p}</span>
																<input
																	type="radio"
																	name="packaging"
																	checked={packaging === p}
																	onChange={() => setPackaging(p)}
																	className="accent-primary"
																/>
															</label>
														))}
													</div>
												</div>
											</div>
										</div>
									)}
								</div>

								{/* Step Controls */}
								<div className="flex items-center justify-between pt-6 border-t border-border-vellum mt-8">
									<button
										type="button"
										onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
										disabled={currentStep === 1}
										className={`text-xs uppercase tracking-wider font-semibold ${
											currentStep === 1 ? "opacity-40 cursor-not-allowed" : "text-secondary hover:text-primary"
										}`}
									>
										Previous
									</button>
									<button
										type="button"
										onClick={() => setCurrentStep(Math.min(3, currentStep + 1))}
										className="bg-[#fadcd0] hover:bg-primary hover:text-on-primary text-[#271811] px-6 py-2.5 text-xs uppercase tracking-wider font-semibold transition-colors rounded-sm"
									>
										{currentStep === 3 ? "Complete Customizer" : "Next Step"}
									</button>
								</div>
							</div>

							{/* Right 4 Cols Draft Summary */}
							<div className="lg:col-span-4 bg-paper-tint p-6 rounded-sm border border-border-vellum flex flex-col justify-between">
								<div>
									<div className="flex items-center justify-between mb-4">
										<span className="text-xs uppercase tracking-widest text-secondary font-semibold">
											Commission Draft
										</span>
										<span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse"></span>
									</div>
									<h4 className="font-serif text-xl text-primary mb-4">Summary of Selection</h4>
									<dl className="space-y-3 text-xs">
										<div className="flex justify-between border-b border-border-vellum pb-2">
											<dt className="text-secondary">Medium:</dt>
											<dd className="text-primary font-medium text-right">{medium}</dd>
										</div>
										<div className="flex justify-between border-b border-border-vellum pb-2">
											<dt className="text-secondary">Script:</dt>
											<dd className="text-primary font-medium text-right">{script}</dd>
										</div>
										<div className="flex justify-between border-b border-border-vellum pb-2">
											<dt className="text-secondary">Wax Seal:</dt>
											<dd className="text-primary font-medium text-right">{sealColor}</dd>
										</div>
										<div className="flex justify-between border-b border-border-vellum pb-2">
											<dt className="text-secondary">Botanical:</dt>
											<dd className="text-primary font-medium text-right">{botanical}</dd>
										</div>
										<div className="flex justify-between border-b border-border-vellum pb-2">
											<dt className="text-secondary">Packaging:</dt>
											<dd className="text-primary font-medium text-right">{packaging}</dd>
										</div>
									</dl>
									<div className="mt-6 bg-surface-container-lowest p-4 rounded-sm border border-border-vellum/60">
										<p className="text-[11px] uppercase text-secondary font-semibold mb-1">
											Estimated Lead Time
										</p>
										<p className="text-xs text-primary font-medium">3–5 Atelier Studio Days</p>
										<p className="text-[11px] text-secondary mt-1 font-light">
											Proof sent via WhatsApp/Email prior to inking.
										</p>
									</div>
								</div>
								<div className="mt-8 pt-4 border-t border-border-vellum">
									<div className="flex items-baseline justify-between mb-4">
										<span className="text-xs uppercase text-secondary font-semibold">Starting Estimate</span>
										<span className="font-serif text-2xl text-primary font-medium">₹3,850</span>
									</div>
									<Link
										href="/contact"
										className="w-full block text-center bg-primary hover:bg-secondary text-on-primary py-3 text-xs uppercase tracking-wider font-semibold transition-colors rounded-sm"
									>
										Book This Commission
									</Link>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Best-Selling Gifting Sets */}
			<section className="w-full py-16 lg:py-20 bg-background">
				<div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-16">
					<div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
						<div>
							<span className="text-xs uppercase tracking-widest text-secondary block mb-1 font-semibold">
								PREPARED ATELIER SUITES
							</span>
							<h2 className="font-headline-lg text-3xl lg:text-4xl text-primary font-serif">
								Best-Selling Gifting Sets
							</h2>
						</div>
						<Link
							href="/shop"
							className="text-xs uppercase tracking-wider text-primary font-semibold hover:underline mt-2 md:mt-0 inline-flex items-center gap-1"
						>
							View Complete Catalog <ArrowUpRight className="w-4 h-4" />
						</Link>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
						{/* Bundle 1 */}
						<div className="bg-surface-container-lowest border border-border-vellum rounded-sm flex flex-col justify-between shadow-sm group overflow-hidden">
							<div className="relative aspect-square overflow-hidden bg-surface-container">
								<img
									className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
									alt="The Romantic Heirloom Box"
									src="https://lh3.googleusercontent.com/aida-public/AB6AXuARitCH9kBoLcMfeQQ43dzjODtYzBXbDtF00v3EeYuwg9yXfJKMUEoTymO7NRYceq4eahaTo-XEHVdI57_KAnBk31_bOArVgHz6Kj5bWbWruJbqRtLopWIpKlS8-lRMkEKiCQFpNccJeq6Ev4O3FnuN2E4yh7FD_PvcovM7THYu3YGRYbWL6Qht71Yqq3RM0_y9jawbaFVdgFfuARedTkNAxbSqQvHTFgB3dq4y32SZwH8pauxq7lQ"
								/>
								<span className="absolute top-4 left-4 bg-[#fadcd0] text-[#271811] text-xs uppercase font-semibold px-3 py-1 rounded-full">
									Atelier Favorite
								</span>
							</div>
							<div className="p-6 flex flex-col flex-grow justify-between">
								<div>
									<div className="flex items-baseline justify-between mb-2">
										<h3 className="font-headline-sm text-lg text-primary font-serif">The Romantic Heirloom Box</h3>
										<span className="text-xl text-primary font-serif font-medium">₹4,850</span>
									</div>
									<p className="text-xs text-on-surface-variant font-light mb-4 leading-relaxed">
										Deckle-edged archival love scroll + custom monogram wax seal + dried wild florals encased in an engraved wooden slide box.
									</p>
								</div>
								<div className="pt-4 border-t border-border-vellum flex items-center justify-between">
									<span className="text-[11px] uppercase text-secondary font-semibold">Free Gift Wrap Included</span>
									<Link
										href="/contact"
										className="bg-[#fadcd0] hover:bg-primary hover:text-on-primary text-[#271811] px-4 py-2 text-xs uppercase tracking-wider font-semibold transition-colors rounded-sm"
									>
										Order Bundle
									</Link>
								</div>
							</div>
						</div>

						{/* Bundle 2 */}
						<div className="bg-surface-container-lowest border border-border-vellum rounded-sm flex flex-col justify-between shadow-sm group overflow-hidden">
							<div className="relative aspect-square overflow-hidden bg-surface-container">
								<img
									className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
									alt="The Timeless Vow Set"
									src="https://lh3.googleusercontent.com/aida-public/AB6AXuCbPwrH7ohCeXQTtAq-sj-6R6uSkr52oj1nFDzx6qHLjw1_AMB9-0_80GWIhI9OE_z4SHuDsjoShKFXLbyM9cMAqaJCg0h2JADi1OtbdEjK0eJ575-HQUJyzoMwZ0epStHBqOFN3VB6TudYujHdQb-b3GPqCCdwNlYtBS0q3QG6CUps39Za8_BVJoJJtWj1EPNJE8uMWOow8sc1Ss2TzrqVNCXNAVzXcSKiXE0RylVoyYqj4J5ztts"
								/>
								<span className="absolute top-4 left-4 bg-surface-container-lowest text-primary text-xs uppercase font-semibold px-3 py-1 rounded-full shadow-xs">
									Wedding Keepsake
								</span>
							</div>
							<div className="p-6 flex flex-col flex-grow justify-between">
								<div>
									<div className="flex items-baseline justify-between mb-2">
										<h3 className="font-headline-sm text-lg text-primary font-serif">The Timeless Vow Set</h3>
										<span className="text-xl text-primary font-serif font-medium">₹3,950</span>
									</div>
									<p className="text-xs text-on-surface-variant font-light mb-4 leading-relaxed">
										Set of two hand-bound leather vow books with dip-pen calligraphy, archival acid-free deckle sheets, and botanical wax ribbons.
									</p>
								</div>
								<div className="pt-4 border-t border-border-vellum flex items-center justify-between">
									<span className="text-[11px] uppercase text-secondary font-semibold">Choice of 4 Leathers</span>
									<Link
										href="/contact"
										className="bg-[#fadcd0] hover:bg-primary hover:text-on-primary text-[#271811] px-4 py-2 text-xs uppercase tracking-wider font-semibold transition-colors rounded-sm"
									>
										Order Bundle
									</Link>
								</div>
							</div>
						</div>

						{/* Bundle 3 */}
						<div className="bg-surface-container-lowest border border-border-vellum rounded-sm flex flex-col justify-between shadow-sm group overflow-hidden">
							<div className="relative aspect-square overflow-hidden bg-surface-container">
								<img
									className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
									alt="Executive Calligraphy Desk Suite"
									src="https://lh3.googleusercontent.com/aida-public/AB6AXuDZabnPI_5wzJDPgcHI4JJQ5yK5Hf0Y0NQTVLakCSVZr9CMT37qgbRAtnXMe0x0ZzE49YCsglc5cKMwzCBhijQ17I85aqakqfqJIPqghYu7PQaAnOKfvF3pfd45XHF0lvaWMcOZX-EqvXvtHnKYUPfbjeu6h7_-YYXbM3rAir9cd0vgmuP7bsJApp0Jc1a1SpS8BiiayJ4_tdf0ftvypqh5q93PzjmVnU2lPOfJ8cX7QFv3p_htW2I"
								/>
								<span className="absolute top-4 left-4 bg-surface-container-lowest text-primary text-xs uppercase font-semibold px-3 py-1 rounded-full shadow-xs">
									Executive Suite
								</span>
							</div>
							<div className="p-6 flex flex-col flex-grow justify-between">
								<div>
									<div className="flex items-baseline justify-between mb-2">
										<h3 className="font-headline-sm text-lg text-primary font-serif">Executive Calligraphy Desk Suite</h3>
										<span className="text-xl text-primary font-serif font-medium">₹5,200</span>
									</div>
									<p className="text-xs text-on-surface-variant font-light mb-4 leading-relaxed">
										Custom engraved stone paperweight, brass seal die with your initial, and a softbound leather refillable journal with personalized name plate.
									</p>
								</div>
								<div className="pt-4 border-t border-border-vellum flex items-center justify-between">
									<span className="text-[11px] uppercase text-secondary font-semibold">Corporate Invoicing</span>
									<Link
										href="/contact"
										className="bg-[#fadcd0] hover:bg-primary hover:text-on-primary text-[#271811] px-4 py-2 text-xs uppercase tracking-wider font-semibold transition-colors rounded-sm"
									>
										Order Bundle
									</Link>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Corporate & Bulk Orders Consultation Banner */}
			<section className="w-full py-16 lg:py-20 bg-paper-tint border-t border-border-vellum" id="corporate-consult">
				<div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-16">
					<div className="bg-surface-container-lowest p-8 sm:p-12 lg:p-16 shadow-sm border border-border-vellum rounded-sm flex flex-col lg:flex-row items-center justify-between gap-12">
						<div className="w-full lg:w-7/12">
							<span className="text-xs uppercase tracking-widest text-secondary block mb-2 font-semibold">
								Corporate & Large Gatherings
							</span>
							<h2 className="font-headline-lg text-3xl lg:text-4xl text-primary font-serif mb-3">
								Prestige Brand Gifting & Bulk Suites
							</h2>
							<p className="text-sm text-on-surface-variant font-light mb-6 leading-relaxed">
								Elevate luxury brand activations, gala dinner place cards, VIP client holiday hampers, and partner appreciation with authentic dip-pen craftsmanship. We handle volume orders from 25 to 2,500+ customized pieces with seamless project coordination.
							</p>
							<div className="flex flex-wrap gap-4">
								<a
									href="/contact"
									className="bg-[#fadcd0] hover:bg-primary hover:text-on-primary text-[#271811] px-6 py-3 text-xs uppercase tracking-wider font-semibold transition-colors inline-flex items-center gap-2 rounded-sm"
								>
									<Download className="w-4 h-4" />
									Download Gifting Lookbook
								</a>
								<Link
									href="/contact"
									className="bg-surface-container-low hover:bg-surface-container-highest text-primary px-6 py-3 text-xs uppercase tracking-wider font-semibold transition-colors inline-flex items-center gap-2 rounded-sm border border-border-vellum"
								>
									<Calendar className="w-4 h-4" />
									Book Gifting Concierge
								</Link>
							</div>
						</div>
						<div className="w-full lg:w-5/12 bg-paper-tint p-6 rounded-sm border border-border-vellum">
							<h3 className="text-xs uppercase text-primary tracking-widest font-semibold mb-4">
								Direct Atelier Consultation Inquiry
							</h3>
							<form
								onSubmit={(e) => {
									e.preventDefault();
									alert("Thank you! An atelier gifting director will reach out within 24 hours.");
								}}
								className="space-y-3"
							>
								<div>
									<input
										required
										type="text"
										placeholder="Your Full Name / Brand"
										className="w-full bg-surface-container-lowest border border-border-vellum px-4 py-2.5 text-xs text-on-surface focus:outline-none focus:border-primary rounded-sm"
									/>
								</div>
								<div>
									<input
										required
										type="email"
										placeholder="Corporate Email Address"
										className="w-full bg-surface-container-lowest border border-border-vellum px-4 py-2.5 text-xs text-on-surface focus:outline-none focus:border-primary rounded-sm"
									/>
								</div>
								<div>
									<textarea
										rows={3}
										placeholder="Estimated quantity, date, or event details..."
										className="w-full bg-surface-container-lowest border border-border-vellum px-4 py-2.5 text-xs text-on-surface focus:outline-none focus:border-primary rounded-sm"
									></textarea>
								</div>
								<button
									type="submit"
									className="w-full bg-primary hover:bg-secondary text-on-primary py-3 text-xs uppercase tracking-wider font-semibold transition-colors rounded-sm inline-flex items-center justify-center gap-2"
								>
									<Send className="w-3.5 h-3.5" />
									Submit Inquiry
								</button>
							</form>
						</div>
					</div>
				</div>
			</section>
		</div>
	);
}
