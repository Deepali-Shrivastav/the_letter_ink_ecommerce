"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export function BlogArticleClient() {
	const [readingProgress, setReadingProgress] = useState(0);
	const [openFaq, setOpenFaq] = useState<number | null>(null);
	const [bookmarked, setBookmarked] = useState(false);
	const [copied, setCopied] = useState(false);

	// Reflection Form state
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [inquiry, setInquiry] = useState("");
	const [comments, setComments] = useState([
		{
			author: "Ananya R. — Pune",
			date: "Oct 14, 2024",
			text: "We received our monogrammed flutes for our Sangeet ceremony last December. I had noticed slight water spotting after the monsoon here and was terrified to rub them. The distilled water and warm linen technique worked wonders! They sparkle just like the day they arrived from Bhusawal.",
		},
		{
			author: "Dev & Nicole — London / Goa",
			date: "Oct 12, 2024",
			text: "The note on silica inserts for coastal homes is essential advice. Thank you Maitri for detailing the difference between laser cutting and diamond burs—it explains why the texture feels so delightfully carved under hand.",
		},
	]);

	useEffect(() => {
		const handleScroll = () => {
			const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
			const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
			if (height > 0) {
				const scrolled = (winScroll / height) * 100;
				setReadingProgress(Math.min(100, Math.max(0, scrolled)));
			}
		};

		window.addEventListener("scroll", handleScroll, { passive: true });
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	const handleCopyLink = () => {
		if (typeof window !== "undefined") {
			navigator.clipboard?.writeText(window.location.href);
			setCopied(true);
			toast.success("Article link copied to clipboard");
			setTimeout(() => setCopied(false), 2000);
		}
	};

	const handleShare = (platform: "whatsapp" | "pinterest" | "email") => {
		if (typeof window === "undefined") return;
		const url = encodeURIComponent(window.location.href);
		const title = encodeURIComponent(
			"Preserving Glass Engraving: Caring for Hand-Etched Flutes & Victorian Crystal"
		);

		switch (platform) {
			case "whatsapp":
				window.open(`https://api.whatsapp.com/send?text=${title}%20${url}`, "_blank");
				break;
			case "pinterest":
				window.open(`https://pinterest.com/pin/create/button/?url=${url}&description=${title}`, "_blank");
				break;
			case "email":
				window.location.href = `mailto:?subject=${title}&body=Read this conservatory guide: ${url}`;
				break;
		}
	};

	const handleBookmarkToggle = () => {
		setBookmarked(!bookmarked);
		if (!bookmarked) {
			toast.success("Saved to your Atelier Folio");
		} else {
			toast("Removed from your Atelier Folio");
		}
	};

	const handleReflectionSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (!name.trim() || !email.trim() || !inquiry.trim()) return;

		setComments((prev) => [
			{
				author: `${name.trim()} — Verified Reader`,
				date: "Just now",
				text: inquiry.trim(),
			},
			...prev,
		]);
		setName("");
		setEmail("");
		setInquiry("");
		toast.success("Gratitude. Your reflection has been transmitted to our atelier ledger.");
	};

	const toggleFaq = (index: number) => {
		setOpenFaq(openFaq === index ? null : index);
	};

	return (
		<div className="w-full bg-background">
			{/* Reading Progress Indicator */}
			<div className="sticky top-20 sm:top-24 z-40 w-full bg-surface-container-low/80 backdrop-blur-sm h-1">
				<div
					className="h-full bg-primary transition-all duration-150 ease-out"
					style={{ width: `${readingProgress}%` }}
				/>
			</div>

			{/* Editorial Top Bar / Breadcrumb Canvas */}
			<section className="w-full bg-paper-tint py-space-sm border-b border-border-vellum">
				<div className="max-w-[1440px] mx-auto px-margin-mobile lg:px-margin flex flex-col md:flex-row md:items-center md:justify-between gap-4">
					<nav
						aria-label="Breadcrumbs"
						className="flex items-center space-x-2 font-label-sm text-label-sm tracking-[0.16em] uppercase text-secondary"
					>
						<Link href="/" className="hover:text-primary transition-colors">
							Home
						</Link>
						<span className="text-outline-variant font-light">/</span>
						<Link href="/blog" className="hover:text-primary transition-colors">
							Musings &amp; Journal
						</Link>
						<span className="text-outline-variant font-light">/</span>
						<span className="text-outline-variant">Studio Care</span>
						<span className="text-outline-variant font-light">/</span>
						<span className="text-primary font-semibold truncate max-w-[220px] sm:max-w-none">
							Preserving Glass Engraving
						</span>
					</nav>
					<div className="flex items-center space-x-4">
						<span className="font-label-sm text-label-sm uppercase tracking-[0.18em] text-secondary">
							ARCHIVAL DISPATCH № 084
						</span>
						<span className="h-2 w-2 rounded-full bg-primary" />
						<span className="font-label-sm text-label-sm uppercase tracking-[0.18em] text-on-surface-variant font-medium">
							BHUSAWAL ATELIER
						</span>
					</div>
				</div>
			</section>

			{/* Editorial Title Header Section */}
			<article className="w-full">
				<header className="max-w-4xl mx-auto px-margin-mobile lg:px-6 pt-space-md pb-space-sm text-center">
					{/* Category Pill */}
					<div className="inline-flex items-center justify-center mb-space-xs">
						<span className="bg-tertiary-fixed text-on-tertiary-fixed font-label-sm text-label-sm tracking-[0.2em] uppercase px-5 py-1.5 rounded-full font-semibold">
							STUDIO CARE &amp; CONSERVATION
						</span>
					</div>

					{/* Headline */}
					<h1 className="font-headline-lg text-headline-lg lg:text-display-hero text-primary font-normal leading-tight tracking-[0.03em] mt-3 mb-6">
						Preserving Glass Engraving: Caring for Hand-Etched Flutes &amp; Victorian Crystal
					</h1>

					{/* Subtitle */}
					<p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mx-auto leading-relaxed font-light">
						A comprehensive conservatory guide to washing, handling, and buffering personalized glassware
						etched with micro-drill diamond burs to prevent clouding, thermal shock, and micro-fractures.
					</p>

					{/* Byline & Metadata Strip */}
					<div className="mt-space-md pt-space-xs flex flex-col sm:flex-row items-center justify-between gap-6 border-t border-b border-border-vellum py-4">
						<div className="flex items-center space-x-3.5 text-left">
							<div className="w-12 h-12 rounded-full overflow-hidden bg-surface-container-high shrink-0 shadow-sm border border-border-vellum">
								<img
									className="w-full h-full object-cover"
									alt="Portrait of Maitri Shah, Master Calligrapher and Engraver"
									src="https://lh3.googleusercontent.com/aida-public/AB6AXuBbYt7Y8YOtKooK56Xw-WExyZbOTaZREvVfv2s9Z6MsEQe752dLjULKH6PhTTpJJ5GJSleAu6a3jR7AnyKih7pKW2Kf3ZfV5dRiVP-xUOkOqm6FvKT8BCh-zY_zPwTlDABtePM9wQ9vPb39HQGYu397dCTFOx3lfD7uQJ5lysyKWpBxjQjJPH843-j5xTIsUSLkQjqZUxevKtcZXYbYYFFu_OUoCt06RxhM_NpefhmkeS_m5VceNP8"
								/>
							</div>
							<div>
								<p className="font-label-md text-label-md text-primary uppercase tracking-[0.14em] font-semibold">
									Maitri Shah
								</p>
								<p className="font-body-sm text-body-sm text-secondary">
									Master Calligrapher &amp; Engraver • The Letter Ink Atelier
								</p>
							</div>
						</div>
						<div className="flex flex-col sm:items-end text-center sm:text-right">
							<span className="font-label-sm text-label-sm tracking-[0.18em] uppercase text-primary font-medium">
								4 MIN READ • OCTOBER 11, 2024
							</span>
							<span className="font-body-sm text-body-sm text-secondary">
								Verified Fine-Craft Conservatory Protocol
							</span>
						</div>
					</div>

					{/* Social Share Bar & Bookmark Actions */}
					<div className="mt-6 bg-paper-tint px-6 py-3.5 flex flex-wrap items-center justify-between gap-4 border border-border-vellum">
						<div className="flex items-center space-x-2 font-label-sm text-label-sm uppercase tracking-[0.14em] text-on-surface-variant">
							<span className="material-symbols-outlined text-[18px]">share</span>
							<span>Share Article:</span>
							<div className="flex items-center space-x-1 pl-2">
								<button
									type="button"
									onClick={() => handleShare("pinterest")}
									aria-label="Share on Pinterest"
									className="p-1.5 hover:text-primary transition-colors text-secondary cursor-pointer"
								>
									<span className="material-symbols-outlined text-[18px]">push_pin</span>
								</button>
								<button
									type="button"
									onClick={() => handleShare("whatsapp")}
									aria-label="Share on WhatsApp"
									className="p-1.5 hover:text-primary transition-colors text-secondary cursor-pointer"
								>
									<span className="material-symbols-outlined text-[18px]">chat</span>
								</button>
								<button
									type="button"
									onClick={() => handleShare("email")}
									aria-label="Share via Email"
									className="p-1.5 hover:text-primary transition-colors text-secondary cursor-pointer"
								>
									<span className="material-symbols-outlined text-[18px]">mail</span>
								</button>
								<button
									type="button"
									onClick={handleCopyLink}
									aria-label="Copy Link"
									className="p-1.5 hover:text-primary transition-colors text-secondary relative cursor-pointer"
								>
									<span className="material-symbols-outlined text-[18px]">
										{copied ? "done" : "link"}
									</span>
								</button>
							</div>
						</div>
						<div className="flex items-center space-x-3">
							<button
								type="button"
								onClick={handleBookmarkToggle}
								className={`inline-flex items-center space-x-1.5 font-label-sm text-label-sm uppercase tracking-[0.14em] transition-colors cursor-pointer ${
									bookmarked ? "text-primary font-semibold" : "text-secondary hover:text-primary"
								}`}
							>
								<span className="material-symbols-outlined text-[18px]">
									{bookmarked ? "bookmark" : "bookmark_border"}
								</span>
								<span>{bookmarked ? "Saved In Folio" : "Save To Atelier Folio"}</span>
							</button>
							<span className="text-outline-variant">|</span>
							<button
								type="button"
								onClick={() => window.print()}
								className="text-secondary hover:text-primary font-label-sm text-label-sm uppercase tracking-[0.14em] transition-colors flex items-center space-x-1 cursor-pointer"
							>
								<span className="material-symbols-outlined text-[18px]">print</span>
								<span>Print Folio</span>
							</button>
						</div>
					</div>
				</header>

				{/* Master Hero Visual Display */}
				<div className="max-w-[1280px] mx-auto px-margin-mobile lg:px-margin my-space-md">
					<div className="relative bg-surface-container-low shadow-sm overflow-hidden border border-border-vellum">
						<div className="w-full aspect-[16/9] lg:aspect-[21/9] overflow-hidden">
							<img
								className="w-full h-full object-cover"
								alt="Artisanal studio workspace featuring a pair of luxury crystal champagne flutes exquisitely hand-engraved with fine Spencerian calligraphy monograms"
								src="https://lh3.googleusercontent.com/aida-public/AB6AXuAFsdymvbrtuYrQ3_aK26tXiZPazl0Gl_sGKpQIZbUfLbA05U-1V1Wqy_oi0hLvfwps3MF5eSegza_KKx9UNq6NINzYP37EUS70BB-uu7lYeK1Re_RwC6aAhzhHCzGAQkhoWkyhzBuMaMxFdQ0lYjndDR97BgljqSMvvsD3UCNpL5nXpkyj6R7GPS_f12jQfOLac_XlgT8yLPdVAQWe-9ZAYG6MOUn8tsj4Uq47QdaKpT7tDn-0f9w"
							/>
						</div>
						<div className="bg-paper-tint p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-secondary border-t border-border-vellum">
							<div className="flex items-center space-x-3">
								<span className="material-symbols-outlined text-[18px] text-primary">photo_camera</span>
								<p className="font-body-sm text-body-sm text-on-surface-variant italic">
									Archival Study 01: Bespoke Spencerian Script rendered on hand-blown Austrian crystal via
									pneumatic diamond micro-burr (0.8mm ball).
								</p>
							</div>
							<span className="font-label-sm text-label-sm tracking-[0.16em] uppercase text-primary font-medium shrink-0">
								STUDIO ARCHIVE • BHUSAWAL
							</span>
						</div>
					</div>
				</div>

				{/* Editorial Main Reading Canvas */}
				<div className="max-w-3xl mx-auto px-margin-mobile lg:px-4 py-space-sm space-y-space-md">
					{/* Opening Narrative with Drop Cap */}
					<div className="font-body-lg text-body-lg text-on-surface leading-relaxed space-y-6">
						<p className="text-justify sm:text-left">
							<span className="float-left font-display-hero text-[68px] leading-[60px] pr-3 pt-1 text-primary font-normal">
								E
							</span>
							ach carved stroke upon fine crystal is an indelible dialogue between pressurized diamond and silica.
							When bespoke vows, gilded dates, and fluid Flourished Copperplate monograms are hand-inscribed into
							bridal flutes or Victorian decanters, the glass undergoes a profound architectural metamorphosis.
							Unlike uniform laser blasting or mass acid dipping, bespoke rotary diamond engraving creates
							micro-topographies—hundreds of delicate, microscopic prismatic fissures that catch candlelight with
							peerless iridescence.
						</p>
						<p className="text-on-surface-variant font-light">
							Yet, this tactile transcendence demands deliberate stewardship. Left to harsh modern detergents,
							violent dishwasher currents, or rapid thermal gradients, the crystalline tooth of the engraving
							can harbor mineral scale, micro-stress fractures, or irreversible surface haze. Herein lies our
							atelier’s definitive conservatory standard for preserving hand-engraved crystal across generations.
						</p>
					</div>

					{/* Atelier Technical Metric Box / SVG Diagram */}
					<div className="bg-surface-container-lowest p-6 lg:p-8 shadow-sm border border-border-vellum">
						<div className="flex items-center justify-between pb-4 border-b border-border-vellum">
							<div className="flex items-center space-x-2">
								<span className="material-symbols-outlined text-primary text-[20px]">architecture</span>
								<h3 className="font-label-md text-label-md uppercase tracking-[0.16em] text-primary font-semibold">
									Anatomy of the Engraved Surface
								</h3>
							</div>
							<span className="font-label-sm text-label-sm text-secondary uppercase tracking-[0.12em]">
								MAGNIFICATION 120X
							</span>
						</div>
						{/* Micro SVG Diagram */}
						<div className="py-6">
							<svg
								className="w-full h-auto text-primary"
								fill="none"
								viewBox="0 0 700 140"
								xmlns="http://www.w3.org/2000/svg"
							>
								<path
									className="opacity-30"
									d="M 10 110 L 690 110"
									stroke="currentColor"
									strokeDasharray="4 4"
									strokeWidth="1.5"
								/>
								<path
									d="M 10 110 Q 120 110 170 110 C 200 110 220 30 250 30 C 275 30 290 85 320 85 C 340 85 350 45 380 45 C 410 45 425 110 460 110 L 690 110"
									stroke="currentColor"
									strokeLinejoin="round"
									strokeWidth="2.5"
								/>
								<circle cx="250" cy="30" fill="currentColor" r="4" />
								<circle cx="320" cy="85" fill="currentColor" r="4" />
								<circle cx="380" cy="45" fill="currentColor" r="4" />
								<text
									fill="currentColor"
									fontFamily="Raleway"
									fontSize="10"
									fontWeight="600"
									letterSpacing="0.1em"
									textAnchor="middle"
									x="250"
									y="20"
								>
									PRIMARY BURR CAVITY (-120μm)
								</text>
								<text
									fill="currentColor"
									fontFamily="Raleway"
									fontSize="9"
									opacity="0.8"
									textAnchor="middle"
									x="345"
									y="105"
								>
									FROSTED TOOTH PRISMS
								</text>
								<text
									fill="currentColor"
									fontFamily="Raleway"
									fontSize="9"
									opacity="0.6"
									textAnchor="middle"
									x="560"
									y="125"
								>
									UNTOUCHED LEAD SILICA CANOPY
								</text>
							</svg>
						</div>
						<p className="font-body-sm text-body-sm text-secondary pt-2">
							Rotary diamond burs mechanically fracture microscopic silicate bonds rather than melting glass via
							laser heat. This preserves the surrounding structural integrity while offering the tactile,
							prismatic sparkle unique to traditional benchwork.
						</p>
					</div>

					{/* Section 1 */}
					<section className="space-y-4 pt-4">
						<h2 className="font-headline-lg text-headline-md lg:text-headline-lg text-primary font-normal tracking-[0.03em]">
							The Micro-Structure of Rotary Diamond Engraving
						</h2>
						<p className="font-body-md text-body-md text-on-surface-variant leading-relaxed font-light">
							When observing hand-engraved copperplate script under loupe magnification, one immediately notices
							the textural difference from standard sandblasting. Diamond burrs—spinning between 18,000 and 32,000
							RPM—sculpt tiny troughs into the crystal matrix. These troughs act as miniature concave lenses.
						</p>
						<p className="font-body-md text-body-md text-on-surface-variant leading-relaxed font-light">
							Because crystal contains barium oxide or lead monoxide to heighten refractive index, the exposed cut
							surfaces possess raw chemical affinity for trace minerals found in hard tap water. If left unbuffered
							after exposure, calcium carbonate calcifies within the hairline strokes, transforming shimmering frost
							into chalky dullness.
						</p>
					</section>

					{/* Section 2: The Three Golden Rules */}
					<section className="space-y-6 pt-4">
						<h2 className="font-headline-lg text-headline-md lg:text-headline-lg text-primary font-normal tracking-[0.03em]">
							The Golden Rules of Cleansing Hand-Etched Crystal
						</h2>
						<p className="font-body-md text-body-md text-on-surface-variant leading-relaxed font-light">
							Treat your engraved flutes not as domestic tableware, but as functional archival sculpture. We
							counsel our collectors to observe three immutable cleaning rituals:
						</p>

						{/* Rule Cards Grid */}
						<div className="space-y-4">
							{/* Rule 1 */}
							<div className="bg-surface-container-lowest p-6 shadow-sm border border-border-vellum transition-all hover:bg-paper-tint">
								<div className="flex items-start gap-4">
									<span className="font-display-hero text-headline-md text-primary font-light shrink-0">
										01
									</span>
									<div className="space-y-2">
										<h3 className="font-headline-sm text-headline-sm text-primary font-normal">
											Absolute Dishwasher Prohibition
										</h3>
										<p className="font-body-md text-body-md text-on-surface-variant font-light">
											Never, under any circumstance, place hand-engraved glassware into an automatic
											dishwasher. The combination of caustic alkaline detergents, high-pressure jet streams,
											and violent 65°C thermal shifts triggers rapid expansion at the base of micro-carved cuts,
											causing irreversible micro-fissures and persistent milky clouding.
										</p>
									</div>
								</div>
							</div>

							{/* Rule 2 */}
							<div className="bg-surface-container-lowest p-6 shadow-sm border border-border-vellum transition-all hover:bg-paper-tint">
								<div className="flex items-start gap-4">
									<span className="font-display-hero text-headline-md text-primary font-light shrink-0">
										02
									</span>
									<div className="space-y-2">
										<h3 className="font-headline-sm text-headline-sm text-primary font-normal">
											Lukewarm Cleansing with Botanical Soap
										</h3>
										<p className="font-body-md text-body-md text-on-surface-variant font-light">
											Wash singly in a plastic basin (or line your porcelain sink with an ultra-soft Turkish
											bath towel). Immerse exclusively in tepid, lukewarm water infused with two drops of
											organic unscented Castile soap or pH-neutral olive oil cleanser. Use only the soft pad of
											your bare fingertips or a plush horsehair baby brush across the engraved lettering.
										</p>
									</div>
								</div>
							</div>

							{/* Rule 3 */}
							<div className="bg-surface-container-lowest p-6 shadow-sm border border-border-vellum transition-all hover:bg-paper-tint">
								<div className="flex items-start gap-4">
									<span className="font-display-hero text-headline-md text-primary font-light shrink-0">
										03
									</span>
									<div className="space-y-2">
										<h3 className="font-headline-sm text-headline-sm text-primary font-normal">
											The Egyptian Linen Buffering Technique
										</h3>
										<p className="font-body-md text-body-md text-on-surface-variant font-light">
											Air-drying invites evaporation halos. While the flute is still warm and damp, wrap your
											non-dominant hand around the bowl (never hold solely by the delicate stem, which is
											susceptible to torque snapping). Using a lint-free 100% Belgian flax linen or high-thread
											Egyptian cotton towel, gently pat the grooves dry, then buffer in gentle circular strokes
											to polish the crystalline facets.
										</p>
									</div>
								</div>
							</div>
						</div>
					</section>

					{/* Atmospheric Mid-Article Editorial Visual */}
					<div className="my-space-md">
						<div className="bg-surface-container-low overflow-hidden shadow-sm border border-border-vellum">
							<img
								className="w-full h-80 object-cover"
								alt="Close up overhead capture of hands drying a fine engraved crystal champagne coupe using a soft unbleached natural linen cloth"
								src="https://lh3.googleusercontent.com/aida-public/AB6AXuD3kPccCvik-9SaNKg6aK0bImt8_mOjP_KN4Z5mK13vOVxhPToEm60hV5wTqKKzL57ZCbreo88I-xjSc9wNQ5rdFojzJNn9mjIK0ag_fpkzIwodmLceURgPfl2rFCanRfZIzCBIDhOKo55C_mZgKWPT62_KzTx-efzL0zUA-W8B713eDy5RW2Sn9cbDaNBZOxuHERMy1uYUZ1hUUK0yZACC4hEZZyXEI4Yifm3ilG4bcWKdliMnJ-0"
							/>
							<div className="p-4 bg-paper-tint flex items-center justify-between border-t border-border-vellum">
								<span className="font-body-sm text-body-sm text-on-surface-variant italic">
									Gentle buffering across the engraved relief revives the raw frosted tooth without scratching lead
									crystal.
								</span>
								<span className="font-label-sm text-label-sm uppercase tracking-wider text-secondary font-medium">
									ATELIER RITUAL
								</span>
							</div>
						</div>
					</div>

					{/* Atelier Conservatory Warning Callout Card */}
					<aside className="bg-tertiary-fixed text-on-tertiary-fixed p-6 sm:p-8 shadow-sm relative overflow-hidden border border-tertiary-fixed-dim">
						<div className="flex items-start gap-4">
							<div className="p-2 bg-on-tertiary-fixed text-tertiary-fixed shrink-0 rounded">
								<span className="material-symbols-outlined text-[24px]">warning</span>
							</div>
							<div className="space-y-2">
								<h4 className="font-label-md text-label-md uppercase tracking-[0.16em] font-bold">
									The Scribe’s Warning: Acids &amp; Abrasives
								</h4>
								<p className="font-body-md text-body-md text-on-tertiary-fixed-variant leading-relaxed">
									Never apply synthetic scouring pads, melamine foam sponges, or citrus-heavy acidic cleansers to
									personalized monograms. Lemon-based soaps erode the subtle micro-facets within the engraved
									groove, permanently rounding the sharp calligraphic hair-strokes and dampening their reflective
									sparkle.
								</p>
							</div>
						</div>
					</aside>

					{/* Section 3: Archival Storage in Maharashtra & Coastal Climates */}
					<section className="space-y-4 pt-4">
						<h2 className="font-headline-lg text-headline-md lg:text-headline-lg text-primary font-normal tracking-[0.03em]">
							Storage &amp; Archival Humidity in Maharashtra &amp; Coastal Climates
						</h2>
						<p className="font-body-md text-body-md text-on-surface-variant leading-relaxed font-light">
							In regions experiencing monsoon swings and high ambient humidity—from Bhusawal to Mumbai and
							coastal Konkan—glassware is subject to &ldquo;glass disease&rdquo; or silica weeping if sealed in
							airtight plastic wraps.
						</p>
						<div className="bg-surface-container-lowest p-6 space-y-4 shadow-sm border border-border-vellum">
							<div className="flex items-center space-x-3 pb-2 border-b border-border-vellum">
								<span className="material-symbols-outlined text-primary">inventory_2</span>
								<h4 className="font-label-md text-label-md uppercase tracking-[0.14em] text-primary font-semibold">
									Four Rules of Stemware Storage
								</h4>
							</div>
							<ul className="space-y-3 font-body-md text-body-md text-on-surface-variant font-light">
								<li className="flex items-start gap-3">
									<span className="text-primary font-bold">•</span>
									<span>
										<strong>Store Rim-Upward:</strong> Storing glasses inverted onto wooden shelves concentrates
										all structural weight onto the fragile, hand-blown lip. Keep them upright with at least 15mm
										clearance between stems.
									</span>
								</li>
								<li className="flex items-start gap-3">
									<span className="text-primary font-bold">•</span>
									<span>
										<strong>Porous Silk Lining:</strong> Store heirloom wedding flutes inside velvet-cushioned or
										pure unbleached raw silk chests rather than poly-foam cases, which emit volatile organic
										compounds (VOCs) over time.
									</span>
								</li>
								<li className="flex items-start gap-3">
									<span className="text-primary font-bold">•</span>
									<span>
										<strong>Active Silica Desiccants:</strong> Place food-safe breathable silica packets inside
										display cabinets during humid monsoon months to inhibit moisture condensation within deep
										calligraphy cuts.
									</span>
								</li>
							</ul>
						</div>
					</section>

					{/* Interactive Accordion / Scribe Notes FAQ */}
					<section className="space-y-6 pt-space-xs">
						<div className="flex items-center justify-between pb-2 border-b border-border-vellum">
							<div>
								<span className="font-label-sm text-label-sm uppercase tracking-[0.18em] text-secondary block">
									INQUIRIES &amp; CURATOR ANSWERS
								</span>
								<h3 className="font-headline-lg text-headline-md text-primary font-normal">
									Scribe Notes: Frequently Asked Questions
								</h3>
							</div>
							<span className="material-symbols-outlined text-primary text-[28px]">contact_support</span>
						</div>
						<div className="space-y-3">
							{/* FAQ 1 */}
							<div className="bg-surface-container-lowest shadow-sm overflow-hidden border border-border-vellum">
								<button
									type="button"
									onClick={() => toggleFaq(0)}
									className="w-full p-5 text-left flex items-center justify-between gap-4 font-headline-sm text-headline-sm text-primary hover:bg-paper-tint transition-colors cursor-pointer"
								>
									<span>Can filled flutes be refrigerated before celebratory toasts?</span>
									<span
										className={`material-symbols-outlined text-[20px] transition-transform duration-200 ${
											openFaq === 0 ? "rotate-180" : ""
										}`}
									>
										expand_more
									</span>
								</button>
								{openFaq === 0 && (
									<div className="px-5 pb-5 pt-1 text-on-surface-variant font-body-md text-body-md font-light border-t border-border-vellum/50">
										Yes, but with vital moderation. You may chill the flute for up to 20 minutes in a dry
										refrigerator. Never place personalized crystal in a sub-zero freezer, as the sudden
										condensation upon serving hot ambient room air causes extreme thermal shock along the thin
										engraved margins, risking instant fractures.
									</div>
								)}
							</div>

							{/* FAQ 2 */}
							<div className="bg-surface-container-lowest shadow-sm overflow-hidden border border-border-vellum">
								<button
									type="button"
									onClick={() => toggleFaq(1)}
									className="w-full p-5 text-left flex items-center justify-between gap-4 font-headline-sm text-headline-sm text-primary hover:bg-paper-tint transition-colors cursor-pointer"
								>
									<span>What should I do if water spots develop inside the engraved grooves?</span>
									<span
										className={`material-symbols-outlined text-[20px] transition-transform duration-200 ${
											openFaq === 1 ? "rotate-180" : ""
										}`}
									>
										expand_more
									</span>
								</button>
								{openFaq === 1 && (
									<div className="px-5 pb-5 pt-1 text-on-surface-variant font-body-md text-body-md font-light border-t border-border-vellum/50">
										Prepare a gentle bath of 1 part distilled white vinegar to 4 parts warm demineralized water.
										Soak a soft cotton bud (Q-tip), trace along the engraved Copperplate flourishes, and allow
										the solution to sit for 90 seconds. Rinse cleanly with distilled water and buffer with dry
										Belgian linen. The acetic acid gently lifts calcified minerals without touching the lead glass
										matrix.
									</div>
								)}
							</div>

							{/* FAQ 3 */}
							<div className="bg-surface-container-lowest shadow-sm overflow-hidden border border-border-vellum">
								<button
									type="button"
									onClick={() => toggleFaq(2)}
									className="w-full p-5 text-left flex items-center justify-between gap-4 font-headline-sm text-headline-sm text-primary hover:bg-paper-tint transition-colors cursor-pointer"
								>
									<span>Can heirloom engraved glass be re-gilded or touched up?</span>
									<span
										className={`material-symbols-outlined text-[20px] transition-transform duration-200 ${
											openFaq === 2 ? "rotate-180" : ""
										}`}
									>
										expand_more
									</span>
								</button>
								{openFaq === 2 && (
									<div className="px-5 pb-5 pt-1 text-on-surface-variant font-body-md text-body-md font-light border-t border-border-vellum/50">
										Yes. If your flutes were historically filled with liquid gold leafing, silver paste, or
										archival pigment rub-in, our Bhusawal studio provides an atelier restoration service. We
										ultrasonically de-grease the piece and carefully re-apply hand-burnished oil gilding into
										the original rotary grooves.
									</div>
								)}
							</div>
						</div>
					</section>

					{/* Author Bio Card */}
					<div className="bg-surface-container-low p-6 sm:p-8 mt-space-lg shadow-sm border border-border-vellum">
						<div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
							<div className="w-24 h-24 rounded-full overflow-hidden bg-surface-container-high shrink-0 shadow-sm border border-border-vellum">
								<img
									className="w-full h-full object-cover"
									alt="Portrait of Maitri Shah holding micro-engraving diamond handpiece"
									src="https://lh3.googleusercontent.com/aida-public/AB6AXuBkxd8X4wMXojg8wNYglvzc8CIInm8qRKs07Xf2583cCvpjCgqdXP4icb1Dv8x37mk0U9E3YqQw3Hs2aO4nK62c6UJJbfMMwxkEdj4UmrDMdratqiiaTi0WM0pq5f3MikhLtac6NCoe9jhrFJkxcLDCzZ4wAQChJ0yDaXlr4GSgH9hGCHoyChJehyF-fU8mhssWzf2LQYEfMuE7xLl6gF_UBV-qL2XNOuyuiGAR4rRYAGTHBOEcQ28"
								/>
							</div>
							<div className="space-y-3 text-center sm:text-left">
								<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
									<div>
										<h3 className="font-headline-sm text-headline-sm text-primary font-normal">
											Maitri Shah
										</h3>
										<p className="font-label-sm text-label-sm tracking-[0.16em] uppercase text-secondary">
											Founder &amp; Principal Scribe, The Letter Ink
										</p>
									</div>
									<Link
										href="/about"
										className="font-label-sm text-label-sm uppercase tracking-[0.14em] text-primary underline underline-offset-4 hover:text-secondary"
									>
										Read Studio Story
									</Link>
								</div>
								<p className="font-body-md text-body-md text-on-surface-variant font-light">
									Maitri Shah has spent over a decade honing the exacting disciplines of Engrosser’s Script,
									bespoke deckle-edge wedding suites, and hand-cut glass engraving. She operates The Letter Ink
									Atelier in Bhusawal, Maharashtra, providing custom heirloom keepsakes to private patrons and
									luxury houses across the globe.
								</p>
								<div className="pt-2">
									<Link
										href="/shop"
										className="inline-flex items-center space-x-2 bg-primary text-on-primary px-6 py-2.5 font-label-md text-label-md uppercase tracking-[0.15em] hover:bg-surface-container-high hover:text-primary transition-all shadow-sm"
									>
										<span>Explore Engraved Collections</span>
										<span className="material-symbols-outlined text-[16px]">arrow_forward</span>
									</Link>
								</div>
							</div>
						</div>
					</div>
				</div>
			</article>

			{/* Shop The Story Contextual Atelier Showcase */}
			<section className="w-full bg-paper-tint py-space-lg my-space-md border-t border-b border-border-vellum">
				<div className="max-w-[1440px] mx-auto px-margin-mobile lg:px-margin">
					<div className="flex flex-col md:flex-row md:items-end justify-between mb-space-sm gap-4">
						<div>
							<span className="font-label-sm text-label-sm uppercase tracking-[0.2em] text-secondary block mb-1">
								COMPANION PIECES FROM THE ATELIER
							</span>
							<h2 className="font-headline-lg text-headline-md lg:text-headline-lg text-primary font-normal tracking-[0.03em]">
								Artifacts Mentioned in This Journal
							</h2>
						</div>
						<Link
							href="/shop"
							className="font-label-md text-label-md uppercase tracking-[0.14em] text-primary hover:text-secondary transition-colors underline underline-offset-4"
						>
							Browse All Engravings →
						</Link>
					</div>

					{/* 2-Product Editorial Display */}
					<div className="grid grid-cols-1 md:grid-cols-2 gap-gutter">
						{/* Product 1 */}
						<div className="bg-surface-container-lowest p-6 lg:p-8 flex flex-col sm:flex-row items-center gap-6 shadow-sm border border-border-vellum group">
							<div className="w-full sm:w-48 h-64 overflow-hidden bg-surface-container shrink-0">
								<img
									className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
									alt="Pair of personalized crystal champagne flutes hand engraved with Spencerian initials"
									src="https://lh3.googleusercontent.com/aida-public/AB6AXuB0bNqf4z5KRTIoX85An4L15uGIbLz1KNQ_pD4szmVq8_Tu3sqUpR-Fys-dPTqY6ireFUyfIR1wdCHQ7mgGBlUFTjFWwXczRFGL-k_TpBj42MtA0OwXKGuSIcg0ymF2xZC5574MtGlVqwDvbxVEw-VzkfP_o2gxB1TcSHcgA06EMbdrtGGzMjz229ZCfMkjSWSXvpIuhBHIAiVqc116xupFeto62CtkRZ6T_pCTfzRWu3Iw2BMnBYQ"
								/>
							</div>
							<div className="flex flex-col justify-between h-full space-y-4 w-full text-center sm:text-left">
								<div>
									<span className="font-label-sm text-label-sm uppercase tracking-[0.16em] text-secondary">
										BESPOKE WEDDING SUITE
									</span>
									<h3 className="font-headline-sm text-headline-sm text-primary font-normal mt-1">
										Personalised Champagne Flutes (Pair)
									</h3>
									<p className="font-body-sm text-body-sm text-on-surface-variant mt-2 font-light">
										Hand-cut lead-free European crystal etched with personalized monograms and wedding date in
										Spencerian script.
									</p>
								</div>
								<div className="flex items-center justify-between pt-2">
									<span className="font-headline-sm text-headline-sm text-primary font-medium">₹3,640</span>
									<Link
										href="/shop"
										className="bg-tertiary-fixed text-on-tertiary-fixed px-5 py-2.5 font-label-sm text-label-sm uppercase tracking-[0.15em] font-semibold hover:bg-primary hover:text-on-primary transition-colors shadow-sm"
									>
										View In Atelier Shop
									</Link>
								</div>
							</div>
						</div>

						{/* Product 2 */}
						<div className="bg-surface-container-lowest p-6 lg:p-8 flex flex-col sm:flex-row items-center gap-6 shadow-sm border border-border-vellum group">
							<div className="w-full sm:w-48 h-64 overflow-hidden bg-surface-container shrink-0">
								<img
									className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
									alt="Vintage style beveled brass and glass French keepsake box hand engraved on the lid"
									src="https://lh3.googleusercontent.com/aida-public/AB6AXuDVicQt2VTUbun9F8lJMv_oqiO9ysnqp4btCcf9WnX0foKtdltZzsTV_UYm7pbZdRPN2hOu0lkjPgWV4BiD17SwC4myL8juSSzJ_DumgnyXih09ZcxhJf33JXza8YFUZdvb0041eZA74X42F2OlxdLMP1djeRDNeI2utR21_ySlmj4ccB-M59e_QHPpr7ZoNmrei3gc_uxQ2CcyIp1OpVDK4eDxOE9dzqmMdSysW74L0Yie4XvqRq0"
								/>
							</div>
							<div className="flex flex-col justify-between h-full space-y-4 w-full text-center sm:text-left">
								<div>
									<span className="font-label-sm text-label-sm uppercase tracking-[0.16em] text-secondary">
										ARCHIVAL KEEPSAKE
									</span>
									<h3 className="font-headline-sm text-headline-sm text-primary font-normal mt-1">
										Engraved French Glass Box
									</h3>
									<p className="font-body-sm text-body-sm text-on-surface-variant mt-2 font-light">
										Victorian brass framed beveled glass casket individually carved with floral garlands or
										couple names.
									</p>
								</div>
								<div className="flex items-center justify-between pt-2">
									<span className="font-headline-sm text-headline-sm text-primary font-medium">₹3,400</span>
									<Link
										href="/shop"
										className="bg-tertiary-fixed text-on-tertiary-fixed px-5 py-2.5 font-label-sm text-label-sm uppercase tracking-[0.15em] font-semibold hover:bg-primary hover:text-on-primary transition-colors shadow-sm"
									>
										View In Atelier Shop
									</Link>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Related Studio Musings Section */}
			<section className="max-w-[1440px] mx-auto px-margin-mobile lg:px-margin py-space-lg">
				<div className="text-center max-w-xl mx-auto mb-space-md">
					<span className="font-label-sm text-label-sm uppercase tracking-[0.2em] text-secondary">
						THE ATELIER JOURNAL
					</span>
					<h2 className="font-headline-lg text-headline-md lg:text-headline-lg text-primary font-normal tracking-[0.03em] mt-1">
						Related Studio Musings
					</h2>
					<p className="font-body-sm text-body-sm text-on-surface-variant font-light mt-2">
						Further meditations on tactile paper arts, ink-making chemistry, and sacred vows.
					</p>
				</div>
				<div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
					{/* Card 1 */}
					<article className="bg-surface-container-lowest p-6 flex flex-col justify-between shadow-sm border border-border-vellum group">
						<div>
							<div className="w-full aspect-[4/3] overflow-hidden bg-surface-container mb-4">
								<img
									className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
									alt="Artisanal cotton deckle edge paper illuminated with applied 24k pure gold leaf flakes"
									src="https://lh3.googleusercontent.com/aida-public/AB6AXuAlsDqwUtjVQYQZl6_Nz76yhDXfCEcsMSsy901Z24jbkzZ5sKexm8tQ8VuPSBMBxz5gHP7_9dEa9GSqlIy_nRC2_EeKXzHnM70I6JJrkzY_O0sDENoYoEREFUmKTkUxmIqotwCjR41YAtdJEzcn5qE-up-hhgg8WcXN_eZGSZyZGmPbqLmfz8xxAKAVJ3hjz0Rdf9OkVPMeei-qcQPLqhD0E92p9t2HL-4JssjZ3yQeJPy8KgiIhFc"
								/>
							</div>
							<span className="font-label-sm text-label-sm uppercase tracking-[0.16em] text-secondary">
								ILLUMINATION &amp; GILDING
							</span>
							<h3 className="font-headline-sm text-headline-sm text-primary font-normal mt-2 leading-snug group-hover:text-secondary transition-colors">
								<Link href="/blog">
									The Alchemy of 24k Gold Flakes &amp; Oak Gall Ink on Deckle-Edge Cotton Rag
								</Link>
							</h3>
							<p className="font-body-sm text-body-sm text-on-surface-variant mt-2 line-clamp-3 font-light">
								Explaining historical mordants, real gesso preparation, and the eternal luster of unadulterated
								gold foil on textured papers.
							</p>
						</div>
						<div className="pt-6 flex items-center justify-between border-t border-border-vellum mt-4">
							<span className="font-label-sm text-label-sm text-secondary">6 MIN READ</span>
							<Link
								href="/blog"
								className="font-label-sm text-label-sm uppercase tracking-[0.14em] text-primary group-hover:underline"
							>
								Read Musing →
							</Link>
						</div>
					</article>

					{/* Card 2 */}
					<article className="bg-surface-container-lowest p-6 flex flex-col justify-between shadow-sm border border-border-vellum group">
						<div>
							<div className="w-full aspect-[4/3] overflow-hidden bg-surface-container mb-4">
								<img
									className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
									alt="Framed bespoke wedding vows written in gold ink on dark charcoal handmade paper"
									src="https://lh3.googleusercontent.com/aida-public/AB6AXuDMbAbhbHASwQ1L-MvUe9NW2dMBUFv0npnQ8oN9hHSRj8D7OeSrFa9QqM7zMHsKvLxVK-_m-FyZRzIlCBdNLMOS-Uulha9XV3BiqvHBhErNSNW0QkEcYUHSgMYI9Nt82za-1-N5mm5li9rYwflsPwkUuNmEjob3ZIQYgMC9aURUL_7iLI0bT3XSlU8pvlbSoiwncU_bTNiFFthFLElPc8TW07-GpFbPnQ3eG_WOJtOIUMHSCM-Y3gE"
								/>
							</div>
							<span className="font-label-sm text-label-sm uppercase tracking-[0.16em] text-secondary">
								HEIRLOOM COMMISSIONS
							</span>
							<h3 className="font-headline-sm text-headline-sm text-primary font-normal mt-2 leading-snug group-hover:text-secondary transition-colors">
								<Link href="/blog">The Sacred Geometry of Wedding Vow Keepsakes</Link>
							</h3>
							<p className="font-body-sm text-body-sm text-on-surface-variant mt-2 line-clamp-3 font-light">
								How spatial hierarchy and balanced margins transform personal promises into generational artworks
								fit for framing.
							</p>
						</div>
						<div className="pt-6 flex items-center justify-between border-t border-border-vellum mt-4">
							<span className="font-label-sm text-label-sm text-secondary">5 MIN READ</span>
							<Link
								href="/blog"
								className="font-label-sm text-label-sm uppercase tracking-[0.14em] text-primary group-hover:underline"
							>
								Read Musing →
							</Link>
						</div>
					</article>

					{/* Card 3 */}
					<article className="bg-surface-container-lowest p-6 flex flex-col justify-between shadow-sm border border-border-vellum group">
						<div>
							<div className="w-full aspect-[4/3] overflow-hidden bg-surface-container mb-4">
								<img
									className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
									alt="Rustic glass ink pots containing deeply saturated brown walnut ink"
									src="https://lh3.googleusercontent.com/aida-public/AB6AXuDboCmMngmi9dEu25UcdWEcCylxLP5rvMBSsPOujiVOtdA2heHv1iUC_1-dbL8lwkcWgyZu5BGxPNRdRSvSIXoEt_VUPndjoSYbDYZYAgqvsD10fe0WmhE52phtvz1dFd4I-dh5IgnVHDOjskhvNZi9mm8LdfyJ9N-buKWeghAgTg3q1xtkHdKYN6wlKdAHfkrdkZm4ceZtFosm9hcULJ_0KzkCURNgxfyDdhaLsSmkQpX5OTiP7XI"
								/>
							</div>
							<span className="font-label-sm text-label-sm uppercase tracking-[0.16em] text-secondary">
								STUDIO EXPERIMENTS
							</span>
							<h3 className="font-headline-sm text-headline-sm text-primary font-normal mt-2 leading-snug group-hover:text-secondary transition-colors">
								<Link href="/blog">
									From Raw Pigments to Fluid Script: Crafting Custom Walnut Inks in Bhusawal
								</Link>
							</h3>
							<p className="font-body-sm text-body-sm text-on-surface-variant mt-2 line-clamp-3 font-light">
								Boiling crushed wild husks with clove preservatives to create archival, warm sepia fluids that glide
								gracefully across pointed nibs.
							</p>
						</div>
						<div className="pt-6 flex items-center justify-between border-t border-border-vellum mt-4">
							<span className="font-label-sm text-label-sm text-secondary">8 MIN READ</span>
							<Link
								href="/blog"
								className="font-label-sm text-label-sm uppercase tracking-[0.14em] text-primary group-hover:underline"
							>
								Read Musing →
							</Link>
						</div>
					</article>
				</div>
			</section>

			{/* Reader Reflections & Community Comments */}
			<section className="w-full bg-paper-tint py-space-lg border-t border-border-vellum">
				<div className="max-w-3xl mx-auto px-margin-mobile lg:px-4">
					<div className="flex items-center justify-between pb-6 border-b border-border-vellum">
						<div>
							<h3 className="font-headline-lg text-headline-md text-primary font-normal">Patron Reflections</h3>
							<p className="font-body-sm text-body-sm text-secondary">
								{comments.length} thoughts on glass care &amp; heirloom preservation
							</p>
						</div>
						<span className="material-symbols-outlined text-primary text-[24px]">forum</span>
					</div>

					{/* Comments Stream */}
					<div className="space-y-6 mt-6">
						{comments.map((comment, idx) => (
							<div
								key={idx}
								className="bg-surface-container-lowest p-6 shadow-sm border border-border-vellum"
							>
								<div className="flex items-center justify-between mb-2">
									<span className="font-label-md text-label-md uppercase tracking-[0.12em] text-primary font-semibold">
										{comment.author}
									</span>
									<span className="font-label-sm text-label-sm text-secondary">{comment.date}</span>
								</div>
								<p className="font-body-md text-body-md text-on-surface-variant font-light leading-relaxed">
									{comment.text}
								</p>
							</div>
						))}
					</div>

					{/* Add Reflection Form */}
					<div className="mt-space-md bg-surface-container-lowest p-6 sm:p-8 shadow-sm border border-border-vellum">
						<h4 className="font-headline-sm text-headline-sm text-primary font-normal mb-1">
							Leave a Dispatch Reflection
						</h4>
						<p className="font-body-sm text-body-sm text-on-surface-variant font-light mb-6">
							Have an heirloom glassware care dilemma? Ask our studio scribes.
						</p>
						<form className="space-y-4" onSubmit={handleReflectionSubmit}>
							<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
								<div>
									<label className="block font-label-sm text-label-sm uppercase tracking-[0.14em] text-secondary mb-1">
										Your Name
									</label>
									<input
										className="w-full bg-paper-tint px-4 py-3 font-body-md text-body-md text-on-surface outline-none border border-border-vellum focus:bg-surface-container-lowest focus:border-primary transition-colors"
										placeholder="e.g. Radhika Sen"
										required
										type="text"
										value={name}
										onChange={(e) => setName(e.target.value)}
									/>
								</div>
								<div>
									<label className="block font-label-sm text-label-sm uppercase tracking-[0.14em] text-secondary mb-1">
										Email (Private)
									</label>
									<input
										className="w-full bg-paper-tint px-4 py-3 font-body-md text-body-md text-on-surface outline-none border border-border-vellum focus:bg-surface-container-lowest focus:border-primary transition-colors"
										placeholder="your@email.com"
										required
										type="email"
										value={email}
										onChange={(e) => setEmail(e.target.value)}
									/>
								</div>
							</div>
							<div>
								<label className="block font-label-sm text-label-sm uppercase tracking-[0.14em] text-secondary mb-1">
									Inquiry or Reflection
								</label>
								<textarea
									className="w-full bg-paper-tint px-4 py-3 font-body-md text-body-md text-on-surface outline-none border border-border-vellum focus:bg-surface-container-lowest focus:border-primary transition-colors resize-none"
									placeholder="Share your experience caring for etched crystal..."
									required
									rows={4}
									value={inquiry}
									onChange={(e) => setInquiry(e.target.value)}
								/>
							</div>
							<button
								className="bg-primary text-on-primary px-8 py-3 font-label-md text-label-md uppercase tracking-[0.16em] hover:bg-secondary transition-colors cursor-pointer shadow-sm"
								type="submit"
							>
								Transmit To Atelier
							</button>
						</form>
					</div>
				</div>
			</section>
		</div>
	);
}
