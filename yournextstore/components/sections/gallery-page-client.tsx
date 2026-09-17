"use client";

import { useState } from "react";
import Link from "next/link";
import { ZoomIn, ArrowRight, Filter, X, History, Droplets, Edit3, ShieldCheck } from "lucide-react";

interface GalleryItem {
	id: string;
	ref: string;
	title: string;
	category: "wedding" | "frames" | "engraving" | "scrolls" | "editorial";
	categoryLabel: string;
	image: string;
	alt: string;
	description: string;
	specs: string;
	medium: string;
	year: string;
	colSpan: string;
}

const GALLERY_ITEMS: GalleryItem[] = [
	{
		id: "1",
		ref: "AT-041",
		title: "The Alistair Wedding Suite",
		category: "wedding",
		categoryLabel: "Wedding Suites",
		image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBDVPb2IKCn_GWDC7fWE6hyAYbI1p8b-5zKFpf6dLhjs-qXzJqsN6YLmutZJCWni9FQv50l4HtxWp8q3bD_Z8KvWfImVkbs5swgHHBDJTuZOIxk626j-RTVOP9WDMfn7dP2VGUEfhfRYbQiILkIRZWr0KPHymNtLJBu6LV9p2LHF_bby1qLtw1Hj1_397U2SzDaJFXAryyc6bnOJxJkpTph22-v0bdhK_ig0zKbvyDDph-ab7LnHBM",
		alt: "Bespoke wedding invitation stationery with deckle edge cotton paper and blush wax seal",
		description: "Romantic deckle-edge paper, subtle blush wax seal, gold foil monogram, and bespoke pointed pen calligraphy envelope addressing crafted for an intimate Cotswolds estate gathering.",
		specs: "Cotton Rag 320gsm · Finetec Gold Mica · Custom Brass Die Seal · Hand-torn Deckle",
		medium: "Brause 66EF & Custom Ink",
		year: "2024 Commission",
		colSpan: "lg:col-span-7",
	},
	{
		id: "2",
		ref: "AT-042",
		title: "Heritage Brass Float Frame",
		category: "frames",
		categoryLabel: "Custom Name Frames",
		image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDfJJ3rWuC6FdYiWyOxuADMRWc0veVylrSHFa2CZleXk1Aw6i9u8TveXTH3VTnnFgFJwtfnvHBGBCkM0W7iDT-O4dh0I8iTuEv2hcQLgsJwwc6nKAd0fxjJttqUaKJVhV-g7NWdG6qMBk64pCXtWEs50-7BbgYDhnpTHEgY5fiW11c4r_SLHCuFPUo0bEdePpxSMYD5FohQj9sxJyqOfSuaSO-nXnlyO-a1NOSJiL1O6P2vITVURKE",
		alt: "Artisanal glass floating frame with unlacquered brass hardware",
		description: "24k gold gouache calligraphy on handmade cotton rag paper with pressed botanicals delicately suspended between dual museum-grade glass panes.",
		specs: "Solid Unlacquered Brass · 24k Shell Gold Gouache · Pressed Botanical Specimens · Archival Float Mount",
		medium: "Dimensions: 11\" × 14\" Double Glass",
		year: "Private Keepsake",
		colSpan: "lg:col-span-5",
	},
	{
		id: "3",
		ref: "AT-043",
		title: "Luxury Perfume Bottle Engraving",
		category: "engraving",
		categoryLabel: "On-Site Glass Engraving",
		image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCUNVCILwwKLCKNyUbAhO7EQFfjpKPveMkcX2GkpZfngbzG0RTLdV3Sj3o6nxB3Ixz8VXofB8NNYGqYNVnPT_XoybUoxLwihwpTTTrqXPhAiwazbE2_td6d-_-Agqk_ZqgHQpkm7AHyu8c4ccm9Fs15hc9S_NfJWoCUO0XnKBbwMx0_DDzCBnY-w8l-B2TBOhTTeIzvOgitef_HqWBcOSGxmBkRCj1WUGHpmN5kQjcZc3YmcCrBSQY",
		alt: "Hand-drilled diamond micro-bur engraving on crystal fragrance flacon",
		description: "Hand-drilled bur engraving on crystal fragrance flacons with metallic gold leaf gilding, produced for a private bridal gift unboxing.",
		specs: "Diamond Micro-Bur Dental Drill · Heavy Crystal Flacon · Metallic Mica Infill · Water-Resistant Seal",
		medium: "Craft: Diamond Micro-Rotary",
		year: "Bridal Suite",
		colSpan: "lg:col-span-4",
	},
	{
		id: "4",
		ref: "AT-044",
		title: "The Victorian Botanical Scroll",
		category: "scrolls",
		categoryLabel: "Poetry Scrolls",
		image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDUZMijfhwc7j3yh8mNFTl7D-Tv2ywKZj7jiYSbO7atMUGHBnd4jh9V4ciynsV3SU-gh2_wTEwsg9SJhOBEW3D9gbua0u1T382C_Qf1gvjjeW29N1kDMWzG4pbA-ktT1iRIVWk6Jec1wcFcooFZ3aDr1ETSAohL0rYaJYXZvjHZZwP3Jpam7u1F6ZMNOYJJcpL0GBXsTulP4ECvQtPhnuAzPZD8_1rL_KDF8dYNE8Tp3fHC5GzQEDc",
		alt: "Unrolled continuous vellum scroll with Spencerian calligraphy",
		description: "300-word anniversary prose tied with hand-dyed silk ribbon, miniature botanical flourishes, and a heavy bronze wax seal.",
		specs: "Handmade Cotton Vellum · Oak Gall Ink · Botanical Gouache Illumination · Hand-Dyed Habotai Silk",
		medium: "Length: 28\" Continuous Scroll",
		year: "Anniversary Suite",
		colSpan: "lg:col-span-4",
	},
	{
		id: "5",
		ref: "AT-045",
		title: "Custom Agate Placecards",
		category: "wedding",
		categoryLabel: "Wedding Suites",
		image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAlM3OASYorp4kHImiJOls7Fo0X6ibFANgLirYNGUZYuFUcVjeYSf9BHH2T1OrdYiRy3inyqmPcGkuHdvT4qaFN8KI8usDOUolMQeKMJUsZj91_fJFloMAi7gmoECbjAU9mU6grikSN6z70B8yCo-bDgWWEPK-ombM4NBDza40CmG87_NnN5R3Aas3Y22sngxx8zIuq3my9Oy1jKUpXTh4X04hmrogUhuzVjhyLqamHMvwNtsqlMPI",
		alt: "Sliced natural agate placecards written in white ink",
		description: "Polished Brazilian agate slices hand-lettered with waterproof white ink for destination wedding reception tablescapes.",
		specs: "Natural Sliced Agate · Waterproof White Acrylic Ink · Gillott 303 Nib · Hand-gilded 18k Rim Option",
		medium: "Cohort: 120 Units Individualized",
		year: "Destination Banquet",
		colSpan: "lg:col-span-4",
	},
	{
		id: "6",
		ref: "AT-046",
		title: "Vintage Leather Journal Inscription",
		category: "frames",
		categoryLabel: "Custom Commission",
		image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAp0wAYjeELNnrEpu0clEeKUQPie3lhW_Em_e-5hYa6-3-ZcgT3kxVxF6gXuXl31B0Eapvsi82Neow8xWe-n3bcR87UiLok3-ei5M1B9E5aC-wmCDI5tM2hnZYLemSJgj8TdAwpZcyeZCF1UvR0t0HFr13bJwfeE3sUSbpY884AIFJIo-Fk4WxyG4KONob3A3bg10YjqrKQRzflqUnU8NeNKZSn56CqMj0tVy_ShmhvD_GupVJk4vA",
		alt: "Leather journal flyleaf inscription with gold flourishes",
		description: "Deep debossed calligraphy and hand-painted flourishes executed directly onto vegetable-tanned Italian leather endpapers.",
		specs: "Tuscan Full-Grain Cowhide · Japanese Sumi Ink · Warm Hand Foil Deboss · Mill-made Parchment Core",
		medium: "Binding: Hand-stitched Coptic",
		year: "Bespoke Keepsake",
		colSpan: "lg:col-span-6",
	},
	{
		id: "7",
		ref: "AT-047",
		title: "Grand Champagne Flutes",
		category: "engraving",
		categoryLabel: "On-Site Engraving",
		image: "https://lh3.googleusercontent.com/aida-public/AB6AXuD4rmcxlnRJDljmzrnSIbwVSdlwFpaWZZoC8-WgNh70h481steyQw3WTKzPNaqOlkciC8pa-fQvmvMHspjEa_lxsjemAPTjK1nJKMFCfO45JUtDCQ-dk-ycK1CHVX9S3kfXtBaAOzVv-YnV_to0S1L6D0Nw_YMkTtr6lTgozK49TI4lljNR5Rk2EbFtH9xpUARuCIRSpZJyhZvc9EntDzdiy54YLfztRT6zzEkpe_SpaB9itoSwkP0",
		alt: "Engraved crystal champagne flutes with botanical vines",
		description: "Customized couple initials engraved with delicate botanical vines winding seamlessly around lead-free European mouth-blown stemware.",
		specs: "Lead-free European Crystal · Micro-engraving bur · Custom Interlocking Monogram · Hand Buffed",
		medium: "Pair Set · Dishwasher Safe",
		year: "Heirloom Stemware",
		colSpan: "lg:col-span-6",
	},
	{
		id: "8",
		ref: "AT-048",
		title: "Royal Blue Wax Sealed Invitations",
		category: "wedding",
		categoryLabel: "Wedding Suites",
		image: "https://lh3.googleusercontent.com/aida-public/AB6AXuChCjtfBKR-XjjTE8BnM19YGwfAl2PjJWXIbLmYmRSNg1S7F07nSSFphMiAPMIMf1eBLv8hnKxyIZGoNDAzgfaOuv3zULJtldqh7GnnhUBFNozAJ5iCJ-VLY8kL_-L7YpUAdor_yPxYw1xxvLVtbfaik_fu22Uc1STPuqznxk4If616kgACloT2orknwhbP0aCHSsytEXWLLIbUxcyTMLQv7vgWv15wyhLfOdceiA8QdFm9ujGF8F4",
		alt: "Midnight blue envelopes with gold calligraphy and wax seals",
		description: "Midnight blue envelopes with pointed pen calligraphy in metallic gold ink, paired with a custom bespoke crest wax seal.",
		specs: "Colorplan Imperial Blue 270gsm · Finetec Arabic Gold · Custom Crest Intaglio Stamp · Brause 361 Nib",
		medium: "Quantity: 180 Recipient Envelopes",
		year: "Grand Reception",
		colSpan: "lg:col-span-4",
	},
	{
		id: "9",
		ref: "AT-049",
		title: "Bespoke Vow Keepsake Booklets",
		category: "scrolls",
		categoryLabel: "Keepsakes",
		image: "https://lh3.googleusercontent.com/aida-public/AB6AXuB3JUvYiWy3gABCEkTXqzuyiVHts7JYJQOtyKL40unqNMu-34uD9dKcSpTQLLznYTaTKBvgvpeh-iMCL5qRg-QTIp3AXMPoyD2HZo4fqnS2n7kmoLfk70uP-Qnih6RlgG60j_PUOJoRJL-ggf_NRtqtG9GndgjWUfSSoUhbk2b0KGrd7wwwtaCGxhPOaoqZeM2dWTeIOJxM8f4ZWO9azHJW6do5HSG_X60dasy5bimah1rO4lz6dVQ",
		alt: "Hand-bound Japanese stab-stitch vow booklets",
		description: "Hand-bound Japanese stab-stitch booklets with deckle edges, archival interior pages, and matching monogram wax closures.",
		specs: "Khadi 210gsm Rag Cotton · Natural Flax Thread · Organic Beeswax Seal · Hand-lettered Prompts",
		medium: "Pair (His & Hers) · 16 Inner Pages",
		year: "Heirloom Booklets",
		colSpan: "lg:col-span-4",
	},
	{
		id: "10",
		ref: "AT-050",
		title: "Live Event Brand Activation",
		category: "editorial",
		categoryLabel: "Editorial & Branding",
		image: "https://lh3.googleusercontent.com/aida-public/AB6AXuA9uXpNlNcFHkdgX8dgo0eojmI-yMKr2sxwdh2nBOiw_9FNQ5QTol3pNBGY--4BCY82MXO7QPH7Zox29vci8a7MPq_KF_yut5AvaTMc5M-JdDbpx8daTypUbqHcUK4fK9W-zCtuRf31NsFmJScsfvAJDZE_xdv5zmyQRP-tRX9zsIOP8cFKvYF70MV9wIJl5L-6vxU2QXZdEe-D-BYO7m3as6Iot6ehTokdJmokeFh9PO-21KtGIzU",
		alt: "Live on-site calligraphy activation at luxury store",
		description: "Live on-site personalization on fine Italian leather accessories and rigid unboxing packaging for high-jewelry clientele.",
		specs: "Direct Leather Foil Pen · Acrylic Waterproof Inks · 180+ Personalized Pieces/Day · On-site Activation",
		medium: "Client: Maison de Beauté",
		year: "Retail Flagship",
		colSpan: "lg:col-span-4",
	},
];

export function GalleryPageClient() {
	const [activeFilter, setActiveFilter] = useState<string>("all");
	const [selectedSpecimen, setSelectedSpecimen] = useState<GalleryItem | null>(null);

	const filteredItems =
		activeFilter === "all"
			? GALLERY_ITEMS
			: GALLERY_ITEMS.filter((item) => item.category === activeFilter);

	return (
		<div className="flex flex-col w-full bg-background min-h-screen text-on-surface">
			{/* Editorial Header Section */}
			<section className="relative w-full overflow-hidden pb-12 lg:pb-16 border-b border-border-vellum bg-paper-tint">
				<div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-16 pt-8">
					<nav aria-label="Breadcrumb" className="flex items-center gap-2 mb-6 text-xs uppercase tracking-widest text-secondary font-label-sm">
						<Link href="/" className="hover:text-primary transition-colors">
							Home
						</Link>
						<span className="text-outline-variant">/</span>
						<span className="text-primary font-semibold">Gallery</span>
					</nav>
					<div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">
						<div className="max-w-3xl">
							<span className="inline-block text-xs uppercase tracking-[0.25em] text-[#271811] bg-[#fadcd0] px-3.5 py-1.5 rounded-full mb-4 font-semibold">
								Our Atelier Portfolio
							</span>
							<h1 className="font-display-hero text-4xl sm:text-5xl lg:text-6xl text-primary tracking-wide leading-none mt-2 mb-4 font-serif">
								A Visual Chronicle of Hand-Rendered Artistry
							</h1>
							<p className="font-body-lg text-base lg:text-lg text-on-surface-variant max-w-2xl font-light leading-relaxed">
								An expansive showcase of past bespoke commissions, luxury wedding suites, glass engravings, and studio experiments crafted with unhurried devotion.
							</p>
						</div>
						<div className="hidden lg:flex flex-col items-end text-right border-l border-border-vellum pl-8 py-2">
							<span className="font-headline-sm text-2xl text-primary font-serif font-medium">Est. 2019</span>
							<span className="text-xs text-secondary uppercase tracking-widest mt-1">
								Archive Index / {GALLERY_ITEMS.length} Works Displayed
							</span>
						</div>
					</div>

					{/* Filter Bar */}
					<div className="mt-12 flex flex-wrap items-center justify-between gap-4 bg-surface-container-lowest p-2 shadow-sm rounded-sm border border-border-vellum">
						<div className="flex flex-wrap items-center gap-2">
							<button
								onClick={() => setActiveFilter("all")}
								className={`px-5 py-2 text-xs uppercase tracking-wider rounded-full transition-all ${
									activeFilter === "all"
										? "bg-primary text-on-primary font-semibold"
										: "bg-surface-container-low text-on-surface hover:bg-[#fadcd0]"
								}`}
							>
								All Works ({GALLERY_ITEMS.length})
							</button>
							<button
								onClick={() => setActiveFilter("wedding")}
								className={`px-5 py-2 text-xs uppercase tracking-wider rounded-full transition-all ${
									activeFilter === "wedding"
										? "bg-primary text-on-primary font-semibold"
										: "bg-surface-container-low text-on-surface hover:bg-[#fadcd0]"
								}`}
							>
								Wedding Suites
							</button>
							<button
								onClick={() => setActiveFilter("frames")}
								className={`px-5 py-2 text-xs uppercase tracking-wider rounded-full transition-all ${
									activeFilter === "frames"
										? "bg-primary text-on-primary font-semibold"
										: "bg-surface-container-low text-on-surface hover:bg-[#fadcd0]"
								}`}
							>
								Custom Name Frames
							</button>
							<button
								onClick={() => setActiveFilter("engraving")}
								className={`px-5 py-2 text-xs uppercase tracking-wider rounded-full transition-all ${
									activeFilter === "engraving"
										? "bg-primary text-on-primary font-semibold"
										: "bg-surface-container-low text-on-surface hover:bg-[#fadcd0]"
								}`}
							>
								On-Site Glass Engraving
							</button>
							<button
								onClick={() => setActiveFilter("scrolls")}
								className={`px-5 py-2 text-xs uppercase tracking-wider rounded-full transition-all ${
									activeFilter === "scrolls"
										? "bg-primary text-on-primary font-semibold"
										: "bg-surface-container-low text-on-surface hover:bg-[#fadcd0]"
								}`}
							>
								Letters & Poetry Scrolls
							</button>
							<button
								onClick={() => setActiveFilter("editorial")}
								className={`px-5 py-2 text-xs uppercase tracking-wider rounded-full transition-all ${
									activeFilter === "editorial"
										? "bg-primary text-on-primary font-semibold"
										: "bg-surface-container-low text-on-surface hover:bg-[#fadcd0]"
								}`}
							>
								Editorial & Branding
							</button>
						</div>
						<div className="flex items-center gap-2 text-secondary text-xs uppercase tracking-widest px-3 font-semibold">
							<Filter className="w-4 h-4" />
							<span>{filteredItems.length} Archived Pieces</span>
						</div>
					</div>
				</div>
			</section>

			{/* Masonry / Asymmetric Gallery Showcase */}
			<section className="w-full py-16">
				<div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-16">
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8">
						{filteredItems.map((item) => (
							<article
								key={item.id}
								className={`${item.colSpan} flex flex-col bg-surface-container-lowest shadow-sm border border-border-vellum rounded-sm group overflow-hidden transition-all duration-300 hover:shadow-md`}
							>
								<div className="relative w-full aspect-[4/3] sm:aspect-[16/10] overflow-hidden bg-surface-container">
									<img
										className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
										src={item.image}
										alt={item.alt}
									/>
									<div className="absolute inset-0 bg-primary/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
										<button
											onClick={() => setSelectedSpecimen(item)}
											className="w-12 h-12 rounded-full bg-surface-container-lowest text-primary shadow flex items-center justify-center hover:bg-[#fadcd0] transition-colors"
											title="Examine Specimen"
										>
											<ZoomIn className="w-5 h-5" />
										</button>
									</div>
									<span className="absolute top-4 left-4 bg-surface-container-lowest/90 backdrop-blur-sm px-3 py-1 text-xs uppercase tracking-wider text-primary font-semibold rounded-full shadow-xs">
										{item.categoryLabel}
									</span>
								</div>

								<div className="p-6 flex flex-col justify-between flex-grow">
									<div>
										<div className="flex items-center justify-between mb-2">
											<span className="text-xs text-secondary uppercase tracking-widest font-semibold">
												Ref. No. {item.ref}
											</span>
											<span className="text-xs text-secondary uppercase font-semibold">
												{item.year}
											</span>
										</div>
										<h2 className="font-headline-md text-2xl text-primary font-serif mb-2">
											{item.title}
										</h2>
										<p className="text-sm text-on-surface-variant font-light leading-relaxed">
											{item.description}
										</p>
									</div>
									<div className="pt-4 mt-6 flex items-center justify-between bg-surface-container-low px-4 py-2.5 rounded-sm border border-border-vellum/60">
										<span className="text-xs text-secondary font-medium">{item.medium}</span>
										<button
											onClick={() => setSelectedSpecimen(item)}
											className="text-xs uppercase tracking-wider text-primary font-semibold flex items-center gap-1 hover:text-amber-800 transition-colors"
										>
											Examine Specimen <ArrowRight className="w-3.5 h-3.5" />
										</button>
									</div>
								</div>
							</article>
						))}
					</div>
				</div>
			</section>

			{/* Studio Behind-The-Scenes & Materials Spotlight */}
			<section className="w-full bg-paper-tint py-20 border-t border-border-vellum">
				<div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-16">
					<div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
						<div className="lg:col-span-6">
							<span className="text-xs uppercase tracking-[0.25em] text-secondary block mb-3 font-semibold">
								THE PHILOSOPHY OF MATTER
							</span>
							<h2 className="font-headline-lg text-3xl lg:text-5xl text-primary tracking-wide mb-6 leading-tight font-serif">
								Archival Materials We Cherish
							</h2>
							<p className="text-base lg:text-lg text-on-surface-variant font-light mb-8 leading-relaxed">
								Before our nib touches the surface, every commission begins with quiet tactile decisions: the tooth of pure cotton rag, the viscosity of pine soot ink, and the melting scent of organic resin seals.
							</p>
							<div className="space-y-4">
								<div className="bg-surface-container-lowest p-5 rounded-sm shadow-sm border border-border-vellum">
									<div className="flex items-center gap-2 mb-1.5">
										<History className="w-5 h-5 text-primary" />
										<h3 className="text-xs uppercase tracking-wider text-primary font-semibold">
											Khadi & Cotton Rag Papers
										</h3>
									</div>
									<p className="text-xs text-secondary font-light leading-relaxed">
										Handmade sheet by sheet using reclaimed cotton rags from textile mills. Tub-sized with gelatine to produce an unhurried, velvety pen pull and organic feathered deckle edges.
									</p>
								</div>
								<div className="bg-surface-container-lowest p-5 rounded-sm shadow-sm border border-border-vellum">
									<div className="flex items-center gap-2 mb-1.5">
										<Droplets className="w-5 h-5 text-primary" />
										<h3 className="text-xs uppercase tracking-wider text-primary font-semibold">
											Sumi & Iron Gall Fluid Inks
										</h3>
									</div>
									<p className="text-xs text-secondary font-light leading-relaxed">
										Authentic ink ground by hand from natural pine soot inksticks paired with acidic oak gall formulas that physically bond into the fibers, deepening in hue over decades.
									</p>
								</div>
								<div className="bg-surface-container-lowest p-5 rounded-sm shadow-sm border border-border-vellum">
									<div className="flex items-center gap-2 mb-1.5">
										<Edit3 className="w-5 h-5 text-primary" />
										<h3 className="text-xs uppercase tracking-wider text-primary font-semibold">
											Vintage Brause & Gillott Nibs
										</h3>
									</div>
									<p className="text-xs text-secondary font-light leading-relaxed">
										Ultra-flexible historical steel and brass nibs sourced from vintage deadstock, delivering microscopic hairlines and bold, expressive swell contrast.
									</p>
								</div>
								<div className="bg-surface-container-lowest p-5 rounded-sm shadow-sm border border-border-vellum">
									<div className="flex items-center gap-2 mb-1.5">
										<ShieldCheck className="w-5 h-5 text-primary" />
										<h3 className="text-xs uppercase tracking-wider text-primary font-semibold">
											Natural Shellac & Beeswax Seals
										</h3>
									</div>
									<p className="text-xs text-secondary font-light leading-relaxed">
										Compounded with purified rosin, beeswax, and mineral oxides. Supple enough to survive intercontinental post without cracking or chipping.
									</p>
								</div>
							</div>
						</div>
						<div className="lg:col-span-6">
							<div className="grid grid-cols-2 gap-4">
								<div className="aspect-[3/4] overflow-hidden rounded-sm bg-surface-container">
									<img
										className="w-full h-full object-cover"
										alt="Studio materials process"
										src="https://lh3.googleusercontent.com/aida-public/AB6AXuDKUqTD7-Uz0pUDBonbNr63bhSt9MWJmMdyM7YLJLWTyJPOVqx-TlIrJkVNydAOgRcii_4xzhTMKKFhy8tp87yNGFn9E605a1wObZ0oZSNE9hxKLmmlN4BjUQKzpR8Z3TOox7xCfxOuGLEIcVC5mfTkbpDveNSIiiqH-LDpAAzWEmH0FAsUycGOt65aoiGXwXosAAHvVo5FwLAxUZWQ74cFDRBeShyLwTJTgK16H6olFHoWGcrN4jA"
									/>
								</div>
								<div className="aspect-[3/4] overflow-hidden rounded-sm bg-surface-container mt-8">
									<img
										className="w-full h-full object-cover"
										alt="Botanical wax seal detail"
										src="https://lh3.googleusercontent.com/aida-public/AB6AXuCPOSgaSRa7qbnbYqkFEtSwe6-NEZ16jDEmXsJTR6d8MNOS80K-0tZ77rZQ93WAXaHXez8Ag2s93SOBHbYZon1x-YQslirYlBhu6wxRSQrInkcvVAb02nXgyojOZBYz7bxhBoZflcOvhDc5ogQLnOIjGJDX8t1i_RU31I8hnRoY-LhTb_ptWrOCkA36ZIs2bSGrjsT46DCn7uwC8mvG1x3l--H7tadTIXpU8oHcz8qn_R_7ei4rlrY"
									/>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Specimen Detail Modal */}
			{selectedSpecimen && (
				<div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
					<div className="bg-surface-container-lowest border border-border-vellum max-w-2xl w-full rounded-sm overflow-hidden shadow-2xl relative animate-in fade-in zoom-in duration-200">
						<button
							onClick={() => setSelectedSpecimen(null)}
							className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-surface-container-lowest/80 text-primary flex items-center justify-center hover:bg-surface-container transition-colors"
						>
							<X className="w-5 h-5" />
						</button>
						<div className="aspect-[16/10] w-full overflow-hidden bg-surface-container relative">
							<img
								className="w-full h-full object-cover"
								src={selectedSpecimen.image}
								alt={selectedSpecimen.title}
							/>
							<span className="absolute top-4 left-4 bg-primary text-on-primary px-3 py-1 text-xs uppercase tracking-wider font-semibold rounded-full">
								{selectedSpecimen.categoryLabel}
							</span>
						</div>
						<div className="p-8">
							<div className="flex items-center justify-between mb-2">
								<span className="text-xs text-secondary uppercase tracking-widest font-semibold">
									Ref. {selectedSpecimen.ref}
								</span>
								<span className="text-xs text-secondary uppercase font-semibold">
									{selectedSpecimen.year}
								</span>
							</div>
							<h3 className="font-headline-md text-3xl text-primary font-serif mb-3">
								{selectedSpecimen.title}
							</h3>
							<p className="text-sm text-on-surface-variant font-light mb-6 leading-relaxed">
								{selectedSpecimen.description}
							</p>
							<div className="bg-paper-tint p-4 rounded-sm border border-border-vellum mb-6">
								<p className="text-xs uppercase tracking-wider text-secondary font-semibold mb-1">
									Material Specifications
								</p>
								<p className="text-xs text-on-surface font-medium leading-relaxed">
									{selectedSpecimen.specs}
								</p>
							</div>
							<div className="flex items-center justify-between">
								<span className="text-xs text-secondary font-medium">{selectedSpecimen.medium}</span>
								<Link
									href="/contact"
									className="bg-[#fadcd0] hover:bg-primary hover:text-on-primary text-[#271811] text-xs uppercase tracking-wider px-6 py-3 font-semibold transition-colors rounded-sm"
									onClick={() => setSelectedSpecimen(null)}
								>
									Commission Similar Work
								</Link>
							</div>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
