"use client";

import { useState } from "react";
import Link from "next/link";
import {
	Home,
	Edit3,
	Clock,
	Headphones,
	ArrowRight,
	ArrowUpRight,
	BookOpen,
	CheckCircle,
	Mail,
	Quote,
} from "lucide-react";

interface ArticleItem {
	id: string;
	title: string;
	category: "craft" | "vows" | "wax" | "studio";
	categoryLabel: string;
	tag: string;
	readTime: string;
	date: string;
	image: string;
	alt: string;
	excerpt: string;
}

const ARTICLES: ArticleItem[] = [
	{
		id: "1",
		title: "The Etiquette of Handwritten Wedding Vows: Framing Words for Generations",
		category: "vows",
		categoryLabel: "Wedding & Ceremony",
		tag: "Vow Etiquette",
		readTime: "6 min read",
		date: "October 28, 2024",
		image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCx8Am73NQ6kk9vZFdxxHp5ueC-dDWXJEXsAJhDB3Oz_Z7wl1rQUfP-fhZll4_fa-pAiqut3QOGFfo-IVMbu-FxyNS8Aw0EhXg4SUC4a_RfGA-NtWjhzUgVvHji9yjTVPnEHtgXOvUBLFnYWFU4d_fmP4m9B1iHuPSawIGW1vHdkyx4kYsCkuGHNSD9vgcPKBcUkJg8dAE9GAhXoMauJ4252jw-A1MoatwTflU3oCmTwiT0koJxmOY",
		alt: "Handwritten wedding vows in dark walnut calligraphy ink framed in double glass brass float frame",
		excerpt: "A gentle guide for couples seeking to immortalize spoken promises in floating double-glass frames with custom botanical wax seals that preserve delicate sentiment.",
	},
	{
		id: "2",
		title: "Spencerian vs. Copperplate: Choosing Your Heirloom Script Aesthetic",
		category: "craft",
		categoryLabel: "The Scribe's Craft",
		tag: "Calligraphy History",
		readTime: "10 min read",
		date: "October 14, 2024",
		image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCABL3ymezsTrN5s8lwnwG1IVMt43ReCJcjWLMXP1n5GBl5fd96MvPxUdXHfqw2CXRsE8KU6lNd7nFMplryJJ0mlNPnkoKY12-cMeo86f8quJ4T1865Vjl5-g-OYlZQ8FRnQ9CNxFd4A0j8olf8GIhwxmjeuVaQaJXaidQfWfOnTNGFVycLY5jwyHHmNrWQGLhWC39m1O96KSqoyuiM4Jvye-Lw-nEbboWMZFB5gjeSZiWnlHqtEI0",
		alt: "Comparing thin delicate hairline strokes of Spencerian script versus heavy rhythmic swells of English Copperplate",
		excerpt: "Deciphering the delicate featherlight hairlines of American Spencerian versus the rhythmic shaded swells of traditional English Copperplate for bespoke suites.",
	},
	{
		id: "3",
		title: "The Secret to Pouring Flawless 180°C Botanical Wax Seals Without Cracking",
		category: "wax",
		categoryLabel: "Botanical Wax & Seals",
		tag: "Atelier Technique",
		readTime: "5 min read",
		date: "September 30, 2024",
		image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDpuAyt_0gMkotwKU99FN3qj5DylNYOL1oOyb6h9UaBnluyoBgj1J0u6Xdv0D2dHXYLlrBS_j__jDmTs5Ek7s6JQQ_f93MKHoRNrece-dxJTqVHX24ogZNreOeCGMfXi1DsWGorfFA6SsM2pHaCWrEv8pPqFGYuVEjptMfQmN1VyU4tj7YXiHuRsj2GLY3xDXCrv9WECHxHfTew_86rj-pZ9vsHNHxltTBIPP8hKB4rrPVhSxgf8jo",
		alt: "Molten botanical sealing wax poured from a vintage brass melting spoon with pressed hydrangea petals",
		excerpt: "Natural shellac versus synthetic resins, optimal brass chilling methods, and embedding delicate dried hydrangea petals without scorching the fibers.",
	},
	{
		id: "4",
		title: "A Morning in Bhusawal: Inside Our Slow Penmanship Sanctum",
		category: "studio",
		categoryLabel: "Studio Behind-the-Scenes",
		tag: "Sanctum Journal",
		readTime: "7 min read",
		date: "September 18, 2024",
		image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCkg6AqUpbX0D7iFrk6BkbVKJZLiSpZ3WPaLUzeiLEcpVCWJCVUi2AdDld1Um0ZC1jrMNyvxlDFGwTqVzxerthSLLi8iE56Tb0JqgiDFzq7NKYUaqbLlIuz5kN5Mtda045CFfbewpc3MCA-QtG6d9_8vML0PPf3e23ZLug1PIr2cpadGSUs1edWuDUR_a3givqW7bEWkLNj_Khm9Te05sCiRkHAlw1wZyqLKjCrENyFqQ_3DjxgznM",
		alt: "Morning scene inside the Maharashtra calligraphy atelier in Bhusawal",
		excerpt: "From waking the vintage Hunt 101 nibs to hand-mixing walnut crystals, a visual glimpse into our Maharashtra studio routine and slow-paced craft rituals.",
	},
	{
		id: "5",
		title: "Care & Preservation: Ensuring Your Framed Gold Inscriptions Never Tarnish",
		category: "craft",
		categoryLabel: "The Scribe's Craft",
		tag: "Conservation",
		readTime: "4 min read",
		date: "August 29, 2024",
		image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCbfqtbUPKcW7fjZbFKMQ4_G9v7n8n5zQJNimie5vvt9oP5UJOYRiCdVMbWMve6UThIfZWSlrsk3dcKxM2IhOiE4s_A7B2duwcJ2G_WiaHgfw6mNEmT40Xn_n7R36BzCP_gqA9QVKiRtfRwFSuBXnVkZIlWNU7RDIW8M7gMEFA3Kbkgs_pXakv5jId87NCTqjhb8pPU9MkeJ7F_XPF5gEGXVDkczBgY5pEBvjY1hdic9VnA2IUcvq8",
		alt: "Framed gold illumination artwork on black heavy handmade cotton paper under UV float glass",
		excerpt: "Museum-grade UV float glass, humidity guidelines, and keeping hand-lettered gold leaf keepsakes pristine across decades in tropical and humid homes.",
	},
	{
		id: "6",
		title: "Custom Envelope Addressing: Timelines, Postal Guidelines & Calligraphy Etiquette",
		category: "vows",
		categoryLabel: "Wedding & Ceremony",
		tag: "Invitation Suites",
		readTime: "9 min read",
		date: "August 15, 2024",
		image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAnf3KApbK0HpG-HT8gmhhoiOoLs9i7jn4gwiDmXIAG0F3jpZCbiB2H24sS2W1-2yMck5apRCABdSKP5tm6Q5vzdEsUGZuviqaW3gDapm6vPCNlLSuW1-D4qnIppGcBvEoBjbf8e1C-7mUPo9LoZ4wsZe5oPz_6OfMQ6bmP6Q7U4GIB2ER44eOA20kW4mh7JpJXvYHUe_QPsqNqZ7Oq1HzC7vTOdBwEot5wX3edBSWEY5fOYMKpNoE",
		alt: "Sage green and muted blush luxury envelopes addressed in white calligraphy ink",
		excerpt: "When to commission your suite, postal machine sorting transit protocols, and curating bespoke vintage postage stamps for heirloom wedding delivery.",
	},
];

export function BlogPageClient() {
	const [activeFilter, setActiveFilter] = useState<string>("all");
	const [subscribed, setSubscribed] = useState<boolean>(false);

	const filteredArticles =
		activeFilter === "all"
			? ARTICLES
			: ARTICLES.filter((art) => art.category === activeFilter);

	return (
		<div className="flex flex-col w-full bg-background min-h-screen text-on-surface">
			{/* Atelier Journal Header */}
			<section className="relative w-full overflow-hidden bg-paper-tint border-b border-border-vellum">
				<div className="absolute -top-32 right-1/4 w-96 h-96 bg-[#fadcd0]/40 rounded-full blur-3xl pointer-events-none -z-10"></div>
				<div className="max-w-[1440px] mx-auto w-full px-4 sm:px-6 lg:px-16 pt-8 pb-12">
					<nav aria-label="Breadcrumb" className="mb-6">
						<ol className="flex items-center gap-2 text-xs uppercase tracking-widest text-secondary font-label-sm">
							<li>
								<Link href="/" className="hover:text-primary transition-colors flex items-center gap-1">
									<Home className="w-3.5 h-3.5" />
									<span>Home</span>
								</Link>
							</li>
							<li className="text-outline-variant">/</li>
							<li className="text-primary font-semibold">Journal & Musings</li>
						</ol>
					</nav>

					<div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
						<div className="lg:col-span-8">
							<div className="inline-flex items-center gap-2 bg-[#fadcd0] text-[#271811] px-3.5 py-1.5 mb-4 rounded-full text-xs font-semibold uppercase tracking-widest">
								<span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
								<span>The Atelier Dispatches • Essays & Craft</span>
							</div>
							<h1 className="font-display-hero text-4xl sm:text-5xl lg:text-6xl text-primary tracking-wide uppercase leading-tight font-serif">
								Ink Musings, Studio Chronicles & The Scribe's Journal
							</h1>
						</div>
						<div className="lg:col-span-4 lg:pl-4 flex flex-col justify-end">
							<p className="text-sm text-on-surface-variant leading-relaxed mb-3 font-light">
								Explorations into the slow art of pointed pen penmanship, archival ink formulations, wedding stationery etiquette, and glimpses inside our Maharashtra atelier.
							</p>
							<div className="flex items-center gap-4 text-xs text-secondary uppercase tracking-wider font-semibold">
								<span className="flex items-center gap-1">
									<Edit3 className="w-4 h-4 text-primary" /> {ARTICLES.length} Dispatches
								</span>
								<span className="text-outline-variant">•</span>
								<span className="flex items-center gap-1">
									<Clock className="w-4 h-4 text-primary" /> Quarterly Edition
								</span>
							</div>
						</div>
					</div>

					{/* Category Filter Bar */}
					<div className="mt-10 bg-surface-container-low p-2 shadow-sm flex items-center justify-between flex-wrap gap-2 rounded-sm border border-border-vellum">
						<div className="flex items-center gap-2 flex-wrap">
							<button
								onClick={() => setActiveFilter("all")}
								className={`px-4 py-2 text-xs uppercase tracking-widest font-semibold rounded-full transition-colors ${
									activeFilter === "all"
										? "bg-primary text-on-primary"
										: "bg-[#fadcd0] text-[#271811] hover:bg-primary hover:text-on-primary"
								}`}
							>
								All Dispatches ({ARTICLES.length})
							</button>
							<button
								onClick={() => setActiveFilter("craft")}
								className={`px-4 py-2 text-xs uppercase tracking-widest font-semibold rounded-full transition-colors ${
									activeFilter === "craft"
										? "bg-primary text-on-primary"
										: "bg-[#fadcd0] text-[#271811] hover:bg-primary hover:text-on-primary"
								}`}
							>
								The Scribe's Craft (2)
							</button>
							<button
								onClick={() => setActiveFilter("vows")}
								className={`px-4 py-2 text-xs uppercase tracking-widest font-semibold rounded-full transition-colors ${
									activeFilter === "vows"
										? "bg-primary text-on-primary"
										: "bg-[#fadcd0] text-[#271811] hover:bg-primary hover:text-on-primary"
								}`}
							>
								Wedding Stationery & Vows (2)
							</button>
							<button
								onClick={() => setActiveFilter("wax")}
								className={`px-4 py-2 text-xs uppercase tracking-widest font-semibold rounded-full transition-colors ${
									activeFilter === "wax"
										? "bg-primary text-on-primary"
										: "bg-[#fadcd0] text-[#271811] hover:bg-primary hover:text-on-primary"
								}`}
							>
								Botanical Wax & Seals (1)
							</button>
							<button
								onClick={() => setActiveFilter("studio")}
								className={`px-4 py-2 text-xs uppercase tracking-widest font-semibold rounded-full transition-colors ${
									activeFilter === "studio"
										? "bg-primary text-on-primary"
										: "bg-[#fadcd0] text-[#271811] hover:bg-primary hover:text-on-primary"
								}`}
							>
								Studio Behind-the-Scenes (1)
							</button>
						</div>
						<div className="hidden sm:flex items-center gap-2 pr-3 text-secondary text-xs uppercase tracking-widest font-semibold">
							<BookOpen className="w-4 h-4 text-primary" />
							<span>Archival Readings</span>
						</div>
					</div>
				</div>
			</section>

			{/* Featured Curator's Pick Essay */}
			<section className="max-w-[1440px] mx-auto w-full px-4 sm:px-6 lg:px-16 py-16">
				<article className="bg-surface-container-lowest shadow-xl border border-border-vellum rounded-sm overflow-hidden grid grid-cols-1 lg:grid-cols-12 group">
					{/* Image */}
					<div className="lg:col-span-7 relative min-h-[380px] lg:min-h-[500px] bg-surface-container overflow-hidden">
						<img
							className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
							alt="Curator's Pick Calligraphy Essay"
							src="https://lh3.googleusercontent.com/aida-public/AB6AXuCnRrRlPLGIlpU799UA0OLbLf9EyFy3teUrHFpsJ0Kga3zMVLHpSyPHvJaA2M1Bng68Befw1AVJYajLG-gnbV-gqCtjzzX0-l6NCgBO3aPh3ojic6InPeLd-noEWZmt1eF-dQ4hiAtD_q8Q4NEBGA7Pz6ifJ6QMyEAJeDNOZETZevZ57XaB9789PNwyVQMEot_Ww-xDdtuQBl9HoRQZ5N32NTI_f1IDzG9yzTGne6s83INwxTkhqTU"
						/>
						<div className="absolute top-4 left-4 bg-primary text-on-primary px-3.5 py-1 text-xs uppercase tracking-widest font-semibold rounded-full shadow-xs">
							Curator's Pick
						</div>
						<div className="absolute bottom-4 left-4 bg-paper-tint/95 backdrop-blur-md p-4 shadow-md hidden sm:flex items-center gap-3 rounded-sm border border-border-vellum">
							<CheckCircle className="w-5 h-5 text-primary shrink-0" />
							<div>
								<p className="text-xs uppercase tracking-wider text-primary font-semibold">
									Archival Formula No. 04
								</p>
								<p className="text-xs text-on-surface-variant font-light">Deckle Rag • 300 GSM</p>
							</div>
						</div>
					</div>

					{/* Content */}
					<div className="lg:col-span-5 p-8 lg:p-10 flex flex-col justify-between bg-surface-container-lowest">
						<div>
							<div className="flex items-center gap-2 text-xs uppercase tracking-widest mb-3 font-semibold">
								<span className="text-red-700 font-bold">FEATURED ESSAY</span>
								<span>•</span>
								<span className="text-secondary">ARCHIVAL PENMANSHIP</span>
							</div>
							<h2 className="font-headline-md text-2xl sm:text-3xl text-primary font-serif tracking-wide uppercase leading-tight mb-4 group-hover:text-secondary transition-colors">
								The Alchemy of Genuine Gold Gouache & Ancient Sumi Ink on Deckle-Edge Cotton Rag
							</h2>
							<p className="text-sm text-on-surface-variant leading-relaxed mb-6 font-light">
								Why modern archival calligraphy rejects chemical synthetics in favor of stone-ground pine soot, 24-karat Japanese gold leaf, and 300 GSM hand-torn cotton fibers that outlast centuries without fading or feathering.
							</p>

							<div className="bg-paper-tint p-4 rounded-sm border border-border-vellum mb-6 space-y-2 text-xs">
								<div className="flex justify-between items-center">
									<span className="text-secondary font-medium">Pigment Base</span>
									<span className="text-primary font-semibold">Stone-milled Pine Soot • 24K Leaf</span>
								</div>
								<div className="flex justify-between items-center">
									<span className="text-secondary font-medium">Substrate</span>
									<span className="text-primary font-semibold">100% Unbleached Cotton Rag</span>
								</div>
								<div className="flex justify-between items-center">
									<span className="text-secondary font-medium">Lightfastness</span>
									<span className="text-primary font-semibold">Museum Grade (200+ Years)</span>
								</div>
							</div>
						</div>

						<div>
							<div className="flex items-center justify-between flex-wrap gap-4 mb-6 pt-4 border-t border-border-vellum">
								<div className="flex items-center gap-3">
									<div className="w-10 h-10 rounded-full bg-[#fadcd0] flex items-center justify-center text-primary font-bold text-xs">
										PI
									</div>
									<div>
										<p className="text-xs text-primary uppercase font-semibold">Penwoman & Founder</p>
										<p className="text-[11px] text-on-surface-variant font-light">
											November 12, 2024 • 8 min read
										</p>
									</div>
								</div>
								<div className="flex items-center gap-1.5 px-3 py-1 bg-surface-container-low text-secondary text-xs uppercase rounded-full">
									<Headphones className="w-4 h-4 text-primary" />
									<span>Listen 6m</span>
								</div>
							</div>
							<a
								href="#"
								className="inline-flex items-center justify-between w-full bg-[#fadcd0] hover:bg-primary hover:text-on-primary text-[#271811] text-xs uppercase tracking-wider px-6 py-4 font-semibold transition-colors rounded-sm"
							>
								<span>Read Full Atelier Essay</span>
								<ArrowRight className="w-4 h-4" />
							</a>
						</div>
					</div>
				</article>
			</section>

			{/* Curated Articles Grid */}
			<section className="max-w-[1440px] mx-auto w-full px-4 sm:px-6 lg:px-16 pb-16">
				<div className="flex items-center justify-between mb-8 flex-wrap gap-4">
					<div>
						<span className="text-xs uppercase text-secondary tracking-widest block font-semibold mb-1">
							Archival Portfolio
						</span>
						<h2 className="font-headline-lg text-2xl lg:text-3xl text-primary font-serif uppercase tracking-wide">
							Recent Chronicles
						</h2>
					</div>
					<div className="flex items-center gap-2 text-xs uppercase font-semibold">
						<span className="text-on-surface-variant">Sort By:</span>
						<span className="text-primary underline underline-offset-4">Newest First</span>
					</div>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
					{filteredArticles.map((article) => (
						<article
							key={article.id}
							className="bg-surface-container-lowest border border-border-vellum rounded-sm flex flex-col justify-between group shadow-sm hover:shadow-md transition-shadow overflow-hidden"
						>
							<div>
								<div className="relative w-full aspect-[4/3] overflow-hidden bg-surface-container">
									<img
										className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
										src={article.image}
										alt={article.alt}
									/>
									<span className="absolute top-3 left-3 bg-[#fadcd0] text-[#271811] px-2.5 py-1 text-[11px] uppercase tracking-widest font-semibold rounded-full shadow-xs">
										{article.categoryLabel}
									</span>
								</div>
								<div className="p-6">
									<div className="flex items-center justify-between text-secondary text-xs uppercase tracking-widest mb-2 font-semibold">
										<span>{article.tag}</span>
										<span>{article.readTime}</span>
									</div>
									<h3 className="font-headline-sm text-lg text-primary font-serif uppercase leading-snug mb-3 group-hover:text-secondary transition-colors">
										{article.title}
									</h3>
									<p className="text-xs text-on-surface-variant leading-relaxed font-light line-clamp-3">
										{article.excerpt}
									</p>
								</div>
							</div>
							<div className="px-6 pb-6 pt-2 flex items-center justify-between border-t border-border-vellum/60 text-xs uppercase font-semibold">
								<span className="text-secondary">{article.date}</span>
								<a href="#" className="text-primary group-hover:text-secondary flex items-center gap-1">
									Read Essay <ArrowUpRight className="w-4 h-4" />
								</a>
							</div>
						</article>
					))}
				</div>
			</section>

			{/* Studio Gazette Newsletter Banner */}
			<section className="max-w-[1440px] mx-auto w-full px-4 sm:px-6 lg:px-16 pb-16">
				<div className="bg-[#fadcd0] p-8 sm:p-12 lg:p-16 shadow-lg relative overflow-hidden rounded-sm border border-border-vellum">
					<div className="max-w-3xl relative z-10">
						<div className="inline-flex items-center gap-2 mb-3 text-primary text-xs uppercase tracking-widest font-semibold">
							<Mail className="w-4 h-4" />
							<span>The Quarterly Letter</span>
						</div>
						<h2 className="font-headline-lg text-3xl lg:text-5xl text-primary font-serif uppercase tracking-wide leading-tight mb-3">
							Join the Scribe's Circle — The Atelier Gazette
						</h2>
						<p className="text-sm lg:text-base text-on-tertiary-fixed-variant mb-6 font-light leading-relaxed">
							Receive unhurried quarterly letters on calligraphy history, early masterclass enrollments, raw paper foraging notes, and exclusive stationery releases. We never send rush correspondence.
						</p>

						{subscribed ? (
							<div className="bg-surface-container-lowest p-4 rounded-sm text-primary font-semibold text-sm flex items-center gap-2 max-w-md">
								<CheckCircle className="w-5 h-5 text-emerald-600" />
								<span>Enrolled in Scribe's Circle. Welcome!</span>
							</div>
						) : (
							<form
								onSubmit={(e) => {
									e.preventDefault();
									setSubscribed(true);
								}}
								className="flex flex-col sm:flex-row gap-3 max-w-xl"
							>
								<input
									required
									type="email"
									placeholder="Enter your personal email address..."
									className="w-full bg-surface-container-lowest text-on-surface px-5 py-3.5 text-xs focus:outline-none focus:ring-2 focus:ring-primary rounded-sm border border-border-vellum"
								/>
								<button
									type="submit"
									className="bg-primary hover:bg-secondary text-on-primary text-xs uppercase tracking-wider px-8 py-3.5 font-semibold transition-colors shrink-0 rounded-sm"
								>
									Subscribe to Dispatches
								</button>
							</form>
						)}
						<p className="mt-3 text-[11px] uppercase tracking-widest text-secondary font-semibold">
							Privacy Assured • Seasonal Letters Only • Unsubscribe At Leisure
						</p>
					</div>
				</div>
			</section>

			{/* Popular Topics & Tags */}
			<section className="max-w-[1440px] mx-auto w-full px-4 sm:px-6 lg:px-16 pb-16">
				<div className="bg-surface-container-lowest p-8 shadow-md border border-border-vellum rounded-sm">
					<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
						<div>
							<span className="text-xs uppercase text-secondary tracking-widest block font-semibold">
								Index • Lexicon
							</span>
							<h3 className="font-headline-sm text-xl uppercase text-primary font-serif tracking-wide">
								Popular Topics & Reading Tags
							</h3>
						</div>
						<p className="text-xs text-on-surface-variant font-light">
							Click any tag to browse corresponding atelier archives
						</p>
					</div>
					<div className="flex flex-wrap gap-2.5">
						{[
							"#PointedPen",
							"#WaxSealCraft",
							"#BespokeVows",
							"#FloatFrames",
							"#BhusawalAtelier",
							"#GoldLeaf",
							"#WeddingCalligraphy",
							"#HandwritingArt",
							"#WalnutInk",
							"#DeckleEdgePaper",
						].map((tag) => (
							<a
								key={tag}
								href="#"
								className="px-4 py-2 bg-paper-tint hover:bg-primary hover:text-on-primary text-primary text-xs uppercase tracking-widest font-semibold rounded-full transition-colors border border-border-vellum"
							>
								{tag}
							</a>
						))}
					</div>
				</div>
			</section>

			{/* Studio Quotation Pullout */}
			<section className="max-w-[1440px] mx-auto w-full px-4 sm:px-6 lg:px-16 pb-16">
				<div className="text-center max-w-2xl mx-auto py-6">
					<Quote className="w-8 h-8 text-primary mx-auto mb-2 opacity-60" />
					<blockquote className="font-serif text-xl lg:text-2xl text-primary uppercase tracking-wide leading-relaxed mb-3">
						“Ink is blood of thought; penmanship is the breathing rhythm that grounds spoken emotion into physical eternity.”
					</blockquote>
					<cite className="text-xs uppercase tracking-widest text-secondary not-italic font-semibold">
						— The Letter Ink Atelier Studio Doctrine • Bhusawal
					</cite>
				</div>
			</section>
		</div>
	);
}
