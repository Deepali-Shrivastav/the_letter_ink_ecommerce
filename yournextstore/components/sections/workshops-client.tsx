"use client";

import { useState } from "react";
import Link from "next/link";
import {
	Calendar,
	Clock,
	MapPin,
	Users,
	Globe,
	Sliders,
	Wrench,
	Download,
	ChevronDown,
	Star,
	Sparkles,
	GraduationCap,
	CheckCircle,
} from "lucide-react";

export type WorkshopItem = {
	id: string;
	title: string;
	description: string;
	format: "studio" | "virtual";
	badgeText: string;
	spotsText?: string | null;
	date: string;
	time: string;
	venue: string;
	level: string;
	kitInfo?: string;
	price: string;
	variantId?: string;
	image?: string | null;
	slug?: string;
};

export function WorkshopsClient({ initialWorkshops = [] }: { initialWorkshops?: WorkshopItem[] }) {
	const workshops = initialWorkshops;
	const [activeFilter, setActiveFilter] = useState<"all" | "studio" | "virtual">("all");
	const [openFaq, setOpenFaq] = useState<number | null>(0);

	const toggleFaq = (index: number) => {
		setOpenFaq(openFaq === index ? null : index);
	};

	const filteredWorkshops =
		activeFilter === "all"
			? workshops
			: workshops.filter((w) => w.format === activeFilter);

	return (
		<div className="flex flex-col w-full bg-background min-h-screen text-on-surface">
			{/* Top Editorial Header & Intro */}
			<section className="w-full bg-paper-tint py-12 lg:py-16 border-b border-border-vellum">
				<div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-16">
					{/* Breadcrumb & Badge Navigation */}
					<div className="flex flex-wrap items-center justify-between gap-4 mb-8">
						<nav className="flex items-center gap-2 text-xs uppercase tracking-widest text-on-surface-variant font-label-sm">
							<Link href="/" className="hover:text-primary transition-colors">
								Home
							</Link>
							<span className="text-outline-variant">/</span>
							<span className="text-primary font-semibold">Workshops</span>
						</nav>
						<span className="bg-[#fadcd0] text-[#271811] text-[11px] font-semibold uppercase tracking-widest px-4 py-1.5 rounded-full">
							LEARN THE CRAFT
						</span>
					</div>

					{/* Main Heading Layout */}
					<div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
						<div className="lg:col-span-8">
							<h1 className="font-display-hero text-4xl sm:text-5xl lg:text-6xl text-primary tracking-tight mb-4 max-w-4xl leading-tight">
								Artisanal Calligraphy Masterclasses & Studio Workshops
							</h1>
						</div>
						<div className="lg:col-span-4">
							<p className="font-body-lg text-base lg:text-lg text-on-surface-variant font-light leading-relaxed">
								Step inside our world of slow lettering. From pointed pen fundamentals to advanced flourishing, wax seal crafting, and glass engraving. Hosted in Maharashtra and live virtually worldwide.
							</p>
						</div>
					</div>

					{/* Atmospheric Studio Strip Banner */}
					<div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
						<div className="relative overflow-hidden bg-surface-container-lowest shadow-sm h-64 rounded-sm group">
							<img
								className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
								alt="Pointed pen calligraphy"
								src="https://lh3.googleusercontent.com/aida-public/AB6AXuC8I4oorBFzBN5p6t_lRFz5AM4rnwFsoK4zIa4LbYfTFefUAQyOrKdwCZIspFwmL2_vFn5G9SCG6iP29yt76e5JTEmoeXIn5H1jyB23rBAtGRIhtGIZ9gcDIwElkhdWv6ZT5Wp6-20KcW8h6Do9lIPYCXbGZ-KH9zRteyXSQ6Id76Vnk_2I6ndyVuPTp2ddElW5RyD73Cwdg7r01po1uu7lm2u-bt3Gvd69tEAvru3RgnC__l750H4"
							/>
							<div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-transparent to-transparent flex items-end p-5">
								<span className="text-xs uppercase text-on-primary tracking-widest font-semibold">
									Tactile Pointed Pen
								</span>
							</div>
						</div>
						<div className="relative overflow-hidden bg-surface-container-lowest shadow-sm h-64 rounded-sm group">
							<img
								className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
								alt="Wax seal crafting"
								src="https://lh3.googleusercontent.com/aida-public/AB6AXuCPOSgaSRa7qbnbYqkFEtSwe6-NEZ16jDEmXsJTR6d8MNOS80K-0tZ77rZQ93WAXaHXez8Ag2s93SOBHbYZon1x-YQslirYlBhu6wxRSQrInkcvVAb02nXgyojOZBYz7bxhBoZflcOvhDc5ogQLnOIjGJDX8t1i_RU31I8hnRoY-LhTb_ptWrOCkA36ZIs2bSGrjsT46DCn7uwC8mvG1x3l--H7tadTIXpU8oHcz8qn_R_7ei4rlrY"
							/>
							<div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-transparent to-transparent flex items-end p-5">
								<span className="text-xs uppercase text-on-primary tracking-widest font-semibold">
									Wax Seal Crafting
								</span>
							</div>
						</div>
						<div className="relative overflow-hidden bg-surface-container-lowest shadow-sm h-64 rounded-sm group">
							<img
								className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
								alt="Precision glass engraving"
								src="https://lh3.googleusercontent.com/aida-public/AB6AXuANI0qw1XJ7UEoKPkX6DQlzSd9ybLs0e_6AttJOBBN4bk_MfrOZYjvB0KlkTIWnSWKdA4_gLS7zym24d1JyjPgCYEIVjAluih3CEXciULQboaHET6CI5xZvobfkroCwYHrUab4l4nuNHNtjdCica16RSf0rjhMLziHilD5Df_hTbGmCzktbbUiNSaPjxnTErlPxwjFdsby7CS-BG6b49oB2PuNX_l7GeNqFzvEh-l8NmMENoY7zbk8"
							/>
							<div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-transparent to-transparent flex items-end p-5">
								<span className="text-xs uppercase text-on-primary tracking-widest font-semibold">
									Precision Glass Engraving
								</span>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Filter / Cohort Schedule Section */}
			<section className="w-full bg-background py-16">
				<div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-16">
					<div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
						<div>
							<span className="text-xs uppercase tracking-widest text-secondary block mb-2 font-semibold">
								CURATED SYLLABI
							</span>
							<h2 className="font-headline-lg text-3xl lg:text-4xl text-primary font-serif">
								Upcoming Cohorts & Masterclasses
							</h2>
						</div>
						<div className="flex flex-wrap items-center gap-2">
							<button
								onClick={() => setActiveFilter("all")}
								className={`text-xs uppercase tracking-wider px-4 py-2 rounded-full transition-colors ${
									activeFilter === "all"
										? "bg-primary text-on-primary font-semibold"
										: "bg-[#fadcd0] text-[#271811] hover:bg-[#f5c7b3]"
								}`}
							>
								All Formats
							</button>
							<button
								onClick={() => setActiveFilter("studio")}
								className={`text-xs uppercase tracking-wider px-4 py-2 rounded-full transition-colors ${
									activeFilter === "studio"
										? "bg-primary text-on-primary font-semibold"
										: "bg-[#fadcd0] text-[#271811] hover:bg-[#f5c7b3]"
								}`}
							>
								In-Studio (Bhusawal)
							</button>
							<button
								onClick={() => setActiveFilter("virtual")}
								className={`text-xs uppercase tracking-wider px-4 py-2 rounded-full transition-colors ${
									activeFilter === "virtual"
										? "bg-primary text-on-primary font-semibold"
										: "bg-[#fadcd0] text-[#271811] hover:bg-[#f5c7b3]"
								}`}
							>
								Virtual Interactive
							</button>
						</div>
					</div>

					{/* Schedule Cards */}
					<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
						{filteredWorkshops.length === 0 ? (
							<div className="col-span-full py-16 text-center bg-surface-container-lowest border border-border-vellum p-8 rounded-sm">
								<GraduationCap className="w-10 h-10 mx-auto text-secondary mb-3 opacity-60" />
								<h3 className="font-headline-sm text-xl text-primary font-serif mb-2">
									No Upcoming Workshops Scheduled
								</h3>
								<p className="text-sm text-on-surface-variant font-light max-w-md mx-auto mb-6 leading-relaxed">
									Create a product in your Medusa Backend with metadata (<code className="bg-paper-tint px-2 py-0.5 rounded border border-border-vellum text-xs">is_workshop: true</code>) to publish workshops live.
								</p>
								<Link
									href="/contact"
									className="inline-block bg-[#fadcd0] text-[#271811] hover:bg-primary hover:text-on-primary text-xs uppercase tracking-wider px-6 py-3 font-semibold transition-colors rounded-sm"
								>
									Request Private Studio Session
								</Link>
							</div>
						) : (
							filteredWorkshops.map((ws) => (
								<div
									key={ws.id}
									className="bg-surface-container-lowest shadow-md border border-border-vellum flex flex-col justify-between p-8 relative transition-transform hover:-translate-y-1 duration-300 rounded-sm"
								>
									<div
										className={`absolute top-0 left-0 right-0 h-1.5 ${
											ws.format === "studio" ? "bg-[#fadcd0]" : "bg-primary"
										}`}
									/>
									<div>
										<div className="flex items-center justify-between mb-4">
											<span
												className={`text-xs uppercase tracking-widest px-3 py-1 rounded-full font-semibold ${
													ws.format === "studio"
														? "bg-[#fadcd0] text-[#271811]"
														: "bg-surface-container-high text-on-surface"
												}`}
											>
												{ws.badgeText}
											</span>
										</div>
										<h3 className="font-headline-md text-2xl text-primary font-serif mb-3">
											{ws.title}
										</h3>
										<p className="text-sm text-on-surface-variant font-light mb-6 leading-relaxed">
											{ws.description}
										</p>

										{/* Details Box */}
										<div className="space-y-3 mb-6 bg-paper-tint p-4 rounded-sm border border-border-vellum text-sm">
											<div className="flex items-center gap-2.5 text-on-surface">
												<Calendar className="w-4 h-4 text-secondary shrink-0" />
												<span>{ws.date}</span>
											</div>
											<div className="flex items-center gap-2.5 text-on-surface">
												<Clock className="w-4 h-4 text-secondary shrink-0" />
												<span>{ws.time}</span>
											</div>
											<div className="flex items-center gap-2.5 text-on-surface">
												<Globe className="w-4 h-4 text-secondary shrink-0" />
												<span>{ws.venue}</span>
											</div>
											<div className="flex items-center gap-2.5 text-on-surface">
												<Sliders className="w-4 h-4 text-secondary shrink-0" />
												<span>{ws.level}</span>
											</div>
										</div>

										{ws.kitInfo && (
											<div className="mb-6">
												<p className="text-xs uppercase tracking-wider text-secondary mb-1 font-semibold">
													Kit Included
												</p>
												<p className="text-xs text-on-surface-variant leading-relaxed">
													{ws.kitInfo}
												</p>
											</div>
										)}
									</div>

									<div>
										<div className="flex items-baseline justify-between pt-4 border-t border-border-vellum mb-4">
											<span className="text-xs uppercase tracking-widest text-secondary font-semibold">
												Fee / Seat
											</span>
											<span className="text-2xl text-primary font-serif font-medium">
												{ws.price}
											</span>
										</div>
										<div className="flex flex-col sm:flex-row gap-2">
											<Link
												href={ws.slug ? `/product/${ws.slug}` : "/contact"}
												className="flex-1 bg-[#fadcd0] hover:bg-primary hover:text-on-primary text-[#271811] text-xs uppercase tracking-wider py-3.5 px-4 font-semibold text-center transition-colors rounded-sm"
											>
												Enroll / Reserve
											</Link>
											<button
												type="button"
												className="bg-surface-container hover:bg-surface-variant text-primary p-3 flex items-center justify-center transition-colors rounded-sm"
												title="Download Syllabus PDF"
											>
												<Download className="w-5 h-5" />
											</button>
										</div>
									</div>
								</div>
							))
						)}
					</div>
				</div>
			</section>

			{/* Studio Starter Kit Breakdown */}
			<section className="w-full bg-paper-tint py-16 lg:py-20 border-y border-border-vellum">
				<div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-16">
					<div className="max-w-3xl mb-12">
						<span className="text-xs uppercase tracking-widest text-secondary block mb-2 font-semibold">
							TANGIBLE TOOLS OF THE ATELIER
						</span>
						<h2 className="font-display-hero text-3xl lg:text-5xl text-primary font-serif mb-3">
							What is Inside Your Studio Starter Kit
						</h2>
						<p className="font-body-lg text-base lg:text-lg text-on-surface-variant font-light">
							Every participant receives our bespoke, handcrafted heirloom gift box. Handpicked tools calibrated to foster tactile delight and effortless nib glide.
						</p>
					</div>

					{/* Kit Grid */}
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
						{/* Item 1 */}
						<div className="bg-surface-container-lowest p-6 shadow-sm border border-border-vellum flex flex-col justify-between group hover:shadow-md transition-shadow rounded-sm">
							<div>
								<div className="aspect-square w-full overflow-hidden bg-surface-container mb-4 rounded-sm">
									<img
										className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
										alt="Handcrafted Oblique Holder"
										src="https://lh3.googleusercontent.com/aida-public/AB6AXuDKUqTD7-Uz0pUDBonbNr63bhSt9MWJmMdyM7YLJLWTyJPOVqx-TlIrJkVNydAOgRcii_4xzhTMKKFhy8tp87yNGFn9E605a1wObZ0oZSNE9hxKLmmlN4BjUQKzpR8Z3TOox7xCfxOuGLEIcVC5mfTkbpDveNSIiiqH-LDpAAzWEmH0FAsUycGOt65aoiGXwXosAAHvVo5FwLAxUZWQ74cFDRBeShyLwTJTgK16H6olFHoWGcrN4jA"
									/>
								</div>
								<span className="text-xs uppercase text-secondary tracking-widest block mb-1 font-semibold">01 / Penholder</span>
								<h4 className="font-headline-sm text-xl text-primary font-serif mb-2">Handcrafted Oblique Holder</h4>
								<p className="text-xs text-on-surface-variant leading-relaxed">
									Turned hardwood holder with an adjustable brass flange engineered for the optimal 55-degree script angle, alleviating hand fatigue.
								</p>
							</div>
							<div className="mt-6 pt-3">
								<span className="text-[11px] font-semibold uppercase text-[#56423a] bg-[#fadcd0] px-2.5 py-1 rounded">Heirloom Grade</span>
							</div>
						</div>

						{/* Item 2 */}
						<div className="bg-surface-container-lowest p-6 shadow-sm border border-border-vellum flex flex-col justify-between group hover:shadow-md transition-shadow rounded-sm">
							<div>
								<div className="aspect-square w-full overflow-hidden bg-surface-container mb-4 rounded-sm">
									<img
										className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
										alt="Selected Nibs"
										src="https://lh3.googleusercontent.com/aida-public/AB6AXuCffPXlC_Xv2zXSZup49acfu4_GfIoa9h_fejGiThlrwHpGBZiR913xDb9FT3_PQyw97Xz3L9QWKmNJzseJITQX788yxyUPgWbsn96HDUJACCv0pw9fpzakNmi9-6nKIcgroGGCyszqDqe5HkYFxkyiuo0Mtxa6P-6kXjdYNGbwtZvgKQQnTFCWqRF1UQMcbUP9i-Qs-6vKBES9P5w_dSPWHNuJo6gyUbWWBQpTTOnF5Fv2vL52mAE"
									/>
								</div>
								<span className="text-xs uppercase text-secondary tracking-widest block mb-1 font-semibold">02 / Nibs</span>
								<h4 className="font-headline-sm text-xl text-primary font-serif mb-2">3 Selected Steel Pointed Nibs</h4>
								<p className="text-xs text-on-surface-variant leading-relaxed">
									Includes beginner-friendly Nikko G for consistent hairlines, alongside high-flex Leonardt Principal and Hunt 101 for expressive swelling.
								</p>
							</div>
							<div className="mt-6 pt-3">
								<span className="text-[11px] font-semibold uppercase text-[#56423a] bg-[#fadcd0] px-2.5 py-1 rounded">Hand-Treated</span>
							</div>
						</div>

						{/* Item 3 */}
						<div className="bg-surface-container-lowest p-6 shadow-sm border border-border-vellum flex flex-col justify-between group hover:shadow-md transition-shadow rounded-sm">
							<div>
								<div className="aspect-square w-full overflow-hidden bg-surface-container mb-4 rounded-sm">
									<img
										className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
										alt="Walnut & Gold Inkpots"
										src="https://lh3.googleusercontent.com/aida-public/AB6AXuCkYumUCHHkCwbWxXzkmy4Peg_5vTwrARgVg9JxyWWaBCtUtI2P2FLeDKCX5fNkhGHh1s2UvG2YJ5VL7j9nu5Rb3bjb-gAHmRM8H_GUOCPpZuaGAzmI0OxNbhu8ygNt97mOfHydcXf5vpV3XDyiG66pmBeGzRKdunmdWIIOYPsfU5RU5h9q3pZvN5kIQK8SB07UGLVL_iEikU7u0tBdwfW9ATlnMU7Yi9tKiLBokOKkjMK-CChcMJ8"
									/>
								</div>
								<span className="text-xs uppercase text-secondary tracking-widest block mb-1 font-semibold">03 / Fluid Pigment</span>
								<h4 className="font-headline-sm text-xl text-primary font-serif mb-2">Walnut & Gold Inkpots</h4>
								<p className="text-xs text-on-surface-variant leading-relaxed">
									Specially formulated non-bleed studio ink with gentle iron gall consistency, plus a vial of shimmering mica pearl calligraphy gold ink.
								</p>
							</div>
							<div className="mt-6 pt-3">
								<span className="text-[11px] font-semibold uppercase text-[#56423a] bg-[#fadcd0] px-2.5 py-1 rounded">Archival Grade</span>
							</div>
						</div>

						{/* Item 4 */}
						<div className="bg-surface-container-lowest p-6 shadow-sm border border-border-vellum flex flex-col justify-between group hover:shadow-md transition-shadow rounded-sm">
							<div>
								<div className="aspect-square w-full overflow-hidden bg-surface-container mb-4 rounded-sm">
									<img
										className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
										alt="Rhodia Guideline Pad"
										src="https://lh3.googleusercontent.com/aida-public/AB6AXuBUItd8336yJuzEt7CPIrL7u7y79PBhZwS9epWTrKBbfLzS-NZO3qV1nenj-gyhZXJKIlRbnDmbyXeFk5qLViZhLIJpFYNsqf1k7wV8y8AoeWcoSaYsxePiYsww-fUl-MUG0IoyQKKxLYVCs8snjqOZLBOFUzpWlV04TXjL-_YBsJ-ry8su7H5vzTmZW9SEks571P7VdR8lRGOt12DL8OF7guxFA5KE0mugFdHQ6ou5p4ljeZqTfgg"
									/>
								</div>
								<span className="text-xs uppercase text-secondary tracking-widest block mb-1 font-semibold">04 / Paper Stock</span>
								<h4 className="font-headline-sm text-xl text-primary font-serif mb-2">100gsm Rhodia Guideline Pad</h4>
								<p className="text-xs text-on-surface-variant leading-relaxed">
									Ultra-smooth French satin paper engineered to prevent ink feathering and nib snagging, pre-ruled with slanted 55° baseline guides.
								</p>
							</div>
							<div className="mt-6 pt-3">
								<span className="text-[11px] font-semibold uppercase text-[#56423a] bg-[#fadcd0] px-2.5 py-1 rounded">No-Bleed Surface</span>
							</div>
						</div>

						{/* Item 5 */}
						<div className="bg-surface-container-lowest p-6 shadow-sm border border-border-vellum flex flex-col justify-between group hover:shadow-md transition-shadow rounded-sm">
							<div>
								<div className="aspect-square w-full overflow-hidden bg-surface-container mb-4 rounded-sm">
									<img
										className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
										alt="Brass Wax Stamp"
										src="https://lh3.googleusercontent.com/aida-public/AB6AXuBCKiJttLURVgb2TsqApuCWY1BQxNARNFc_beK291Av1LF3Qz8x9GDyxV1unnQM22ZgSgMGQjTjW7QxF7SnhTH1MQtEtSW6KrtDOVxaTWVOpGVw3OG16_JNnEx4BFVb2g2omOASWyHVA9tKocgMNDWEfoKyX4DufIXkseapu4f03aI2aQ9T1rIumB7Gc8TBJ6d_RIJG52hFKowNsDPAb6lUeXVPjanUt3Q-OUfL-XV-gBe57HxGUkM"
									/>
								</div>
								<span className="text-xs uppercase text-secondary tracking-widest block mb-1 font-semibold">05 / Sealing Suite</span>
								<h4 className="font-headline-sm text-xl text-primary font-serif mb-2">Brass Wax Stamp & Sealing Sticks</h4>
								<p className="text-xs text-on-surface-variant leading-relaxed">
									Atelier botanical monogram brass seal, brass melting spoon, tealight stove, and flexible mailable sealing waxes that do not shatter in transit.
								</p>
							</div>
							<div className="mt-6 pt-3">
								<span className="text-[11px] font-semibold uppercase text-[#56423a] bg-[#fadcd0] px-2.5 py-1 rounded">Complete Kit</span>
							</div>
						</div>

						{/* Item 6 */}
						<div className="bg-surface-container-lowest p-6 shadow-sm border border-border-vellum flex flex-col justify-between group hover:shadow-md transition-shadow rounded-sm">
							<div>
								<div className="aspect-square w-full overflow-hidden bg-surface-container mb-4 rounded-sm">
									<img
										className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
										alt="Practice Exemplar"
										src="https://lh3.googleusercontent.com/aida-public/AB6AXuCjD8_rzfGkTs6nNoxT84YJv1kD3dowpBQR6C6IugqBf-e7ACLxsWwFthtu2liPA0z3NtoQ5jKB5mGe0Net5ErvRXmw2UVwlwEaQGr39prd90wpDr9US5NKkPVYfXHtJX7lXaFbIqmQTCXFZiJMJbDIvplYilw8aQ9UbRqO14sUbNPuKYpq6V6H5PIJw1ynDczU8e9rLUKUar98XLLsfkEobtCYPyTuBpSTeBljImDZHuxPal07Dj4"
									/>
								</div>
								<span className="text-xs uppercase text-secondary tracking-widest block mb-1 font-semibold">06 / Atelier Reference</span>
								<h4 className="font-headline-sm text-xl text-primary font-serif mb-2">Practice Exemplar & Guide</h4>
								<p className="text-xs text-on-surface-variant leading-relaxed">
									A 48-page spiral workbook with stroke-by-stroke diagrams, ductus guides, spacing rules, flourishing anatomy, and troubleshooting tips.
								</p>
							</div>
							<div className="mt-6 pt-3">
								<span className="text-[11px] font-semibold uppercase text-[#56423a] bg-[#fadcd0] px-2.5 py-1 rounded">Full Reference</span>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Private & Corporate Workshops Section */}
			<section className="w-full bg-primary text-on-primary py-20">
				<div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-16">
					<div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
						<div className="lg:col-span-6">
							<span className="text-xs uppercase tracking-widest text-outline-variant block mb-3 font-semibold">
								BESPOKE GATHERINGS
							</span>
							<h2 className="font-display-hero text-3xl lg:text-5xl text-on-primary font-serif tracking-tight mb-6 leading-tight">
								Private Atelier Sessions & Corporate Brand Activations
							</h2>
							<p className="text-base lg:text-lg text-outline-variant font-light mb-8 leading-relaxed">
								Cultivate mindful focus and artistic bonding. We design custom in-person and digital workshops tailored for corporate team retreats, bridal showers, PR launches, and luxury hospitality events.
							</p>
							<div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
								<div className="bg-white/5 border border-white/10 p-5 rounded-sm">
									<Sparkles className="w-6 h-6 text-[#fadcd0] mb-2" />
									<h4 className="text-base text-on-primary font-serif mb-1">Luxury VIP Activations</h4>
									<p className="text-xs text-outline-variant leading-relaxed">Live on-site fragrance bottle personalization and monogramming masterclasses for high-end clientele.</p>
								</div>
								<div className="bg-white/5 border border-white/10 p-5 rounded-sm">
									<GraduationCap className="w-6 h-6 text-[#fadcd0] mb-2" />
									<h4 className="text-base text-on-primary font-serif mb-1">Bridal & Intimate Circles</h4>
									<p className="text-xs text-outline-variant leading-relaxed">Unwind over tea and botanical wax sealing for bridal party suites or private milestone birthdays.</p>
								</div>
							</div>
							<div className="flex flex-wrap items-center gap-4">
								<Link
									href="/contact"
									className="bg-[#fadcd0] hover:bg-white text-primary text-xs uppercase tracking-wider px-8 py-4 font-semibold transition-colors rounded-sm"
								>
									Inquire for Private Workshop
								</Link>
								<span className="text-xs text-outline-variant">Tailored packages for 6 to 50+ guests</span>
							</div>
						</div>
						<div className="lg:col-span-6 relative">
							<div className="aspect-[4/3] w-full overflow-hidden rounded-sm">
								<img
									className="w-full h-full object-cover"
									alt="Private workshop gathering"
									src="https://lh3.googleusercontent.com/aida-public/AB6AXuCXrPWCEqUjsvLDcnk_2VJg8UBF6lXFRc4p3ryTBVJEPxRE7NkuiSMLv8KFLmMQnk26ROnol8JOuvKNN6F60Oy_lM7qj0i8SCFCKaHUfMHWyTy5gI8j5SSXzzWKfLqYovqu8GSmfMYjeRHmnGsl6hnOVWiBXK4iEf2j9BIhOxmVViA_bd7nSr-kbn4pkeidJwnu8JO92UPrxbyUCBbj6W9gbp9FYsgPaJE-bWjpXyb1rZESlyLuuZ0"
								/>
							</div>
							<div className="absolute -bottom-6 -right-6 bg-[#fadcd0] text-primary p-6 shadow-xl hidden md:block max-w-xs rounded-sm">
								<p className="text-xs uppercase tracking-wider font-bold mb-1">Bespoke Curation</p>
								<p className="text-xs text-[#271811] leading-relaxed">Custom branded kits, personalized guest name cards & curated nib boxes included.</p>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Student Reviews & Handcrafted Results */}
			<section className="w-full bg-background py-20">
				<div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-16">
					<div className="text-center max-w-3xl mx-auto mb-16">
						<span className="text-xs uppercase tracking-widest text-secondary block mb-2 font-semibold">
							THE JOURNEY FROM BLOT TO FLOURISH
						</span>
						<h2 className="font-headline-lg text-3xl lg:text-4xl text-primary font-serif">
							Student Words & Handcrafted Results
						</h2>
						<p className="text-sm text-on-surface-variant mt-2 font-light">
							Real stories from creators who traded rapid keyboard tapping for mindful, rhythmic pen strokes.
						</p>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
						{/* Review 1 */}
						<div className="bg-surface-container-lowest p-8 shadow-sm border border-border-vellum flex flex-col justify-between rounded-sm">
							<div>
								<div className="flex items-center gap-1 text-amber-500 mb-4">
									{[...Array(5)].map((_, i) => (
										<Star key={i} className="w-4 h-4 fill-current" />
									))}
								</div>
								<p className="text-sm text-on-surface italic mb-6 leading-relaxed">
									“I was terrified because my daily handwriting is a chaotic doctor's scribble. Within three hours, the breakdown of muscle memory and nib angle completely shifted my perspective. Addressing my sister's wedding suites was a dream come true.”
								</p>
							</div>
							<div className="flex items-center gap-3 pt-4 border-t border-border-vellum">
								<div className="w-10 h-10 rounded-full bg-[#fadcd0] flex items-center justify-center text-primary font-bold text-sm">
									AK
								</div>
								<div>
									<p className="text-sm font-semibold text-primary">Ananya Kapoor</p>
									<p className="text-xs text-secondary">Mumbai Cohort • Modern Calligraphy</p>
								</div>
							</div>
						</div>

						{/* Review 2 */}
						<div className="bg-surface-container-lowest p-8 shadow-sm border border-border-vellum flex flex-col justify-between rounded-sm">
							<div>
								<div className="flex items-center gap-1 text-amber-500 mb-4">
									{[...Array(5)].map((_, i) => (
										<Star key={i} className="w-4 h-4 fill-current" />
									))}
								</div>
								<p className="text-sm text-on-surface italic mb-6 leading-relaxed">
									“The physical starter kit delivered to London was packed with such immense care and quiet beauty. The dual overhead Zoom feed felt like having a personal tutor leaning right over my shoulder correcting my tines.”
								</p>
							</div>
							<div className="flex items-center gap-3 pt-4 border-t border-border-vellum">
								<div className="w-10 h-10 rounded-full bg-[#fadcd0] flex items-center justify-center text-primary font-bold text-sm">
									MR
								</div>
								<div>
									<p className="text-sm font-semibold text-primary">Maya Rathod</p>
									<p className="text-xs text-secondary">London (Virtual Cohort) • Envelope Suite</p>
								</div>
							</div>
						</div>

						{/* Review 3 */}
						<div className="bg-surface-container-lowest p-8 shadow-sm border border-border-vellum flex flex-col justify-between rounded-sm">
							<div>
								<div className="flex items-center gap-1 text-amber-500 mb-4">
									{[...Array(5)].map((_, i) => (
										<Star key={i} className="w-4 h-4 fill-current" />
									))}
								</div>
								<p className="text-sm text-on-surface italic mb-6 leading-relaxed">
									“The glass engraving intensive opened a totally new commercial revenue stream for my luxury wedding styling studio. The focus on micro-bur control and safety gave me instant confidence on real perfume flacons.”
								</p>
							</div>
							<div className="flex items-center gap-3 pt-4 border-t border-border-vellum">
								<div className="w-10 h-10 rounded-full bg-[#fadcd0] flex items-center justify-center text-primary font-bold text-sm">
									RD
								</div>
								<div>
									<p className="text-sm font-semibold text-primary">Rohit Deshmukh</p>
									<p className="text-xs text-secondary">Pune Atelier • Glass Engraving</p>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* FAQ Accordion Section */}
			<section className="w-full bg-paper-tint py-20 border-t border-border-vellum">
				<div className="max-w-[960px] mx-auto px-4 sm:px-6 lg:px-8">
					<div className="text-center mb-12">
						<span className="text-xs uppercase tracking-widest text-secondary block mb-2 font-semibold">
							QUESTIONS & CLARIFICATIONS
						</span>
						<h2 className="font-headline-lg text-3xl lg:text-4xl text-primary font-serif">
							Frequently Asked Inquiries
						</h2>
					</div>

					<div className="space-y-4">
						{[
							{
								q: "Do I need good handwriting to learn calligraphy?",
								a: "Not at all! Handwriting is a rapid, muscle-memory habit designed for speed. Calligraphy, by contrast, is the conscious art of drawing individual letterforms with disciplined, rhythmic pressure contrast. Some of our finest students started with messy everyday scripts.",
							},
							{
								q: "Are materials provided or do I need to purchase them beforehand?",
								a: "For both in-studio and virtual masterclasses, your tuition includes the full Studio Starter Kit. For virtual students, the physical kit is carefully dispatched to your address well ahead of the workshop date. You only need a clean desk and a small cup of clean water.",
							},
							{
								q: "Can I attend virtually from outside India?",
								a: "Yes, our virtual cohorts welcome international attendees. We provide international DHL courier tracking for physical kits. Replay recordings with high-definition multi-angle footage remain accessible for 60 days following the live stream.",
							},
							{
								q: "What are your cancellation and transfer policies?",
								a: "Because seats are strictly limited to maintain intimate direct critique and physical kits are prepared upon enrollment, ticket reservations are non-refundable. However, you may transfer your seat to another student or reschedule to an upcoming cohort with at least 14 business days prior written notice.",
							},
						].map((item, index) => (
							<div key={index} className="bg-surface-container-lowest shadow-sm border border-border-vellum rounded-sm overflow-hidden">
								<button
									onClick={() => toggleFaq(index)}
									className="w-full text-left p-6 flex items-center justify-between text-primary font-serif text-lg hover:text-secondary transition-colors"
								>
									<span>{item.q}</span>
									<ChevronDown
										className={`w-5 h-5 transition-transform duration-300 text-secondary ${
											openFaq === index ? "rotate-180" : ""
										}`}
									/>
								</button>
								{openFaq === index && (
									<div className="px-6 pb-6 text-on-surface-variant text-sm leading-relaxed border-t border-border-vellum/50 pt-4 font-light">
										{item.a}
									</div>
								)}
							</div>
						))}
					</div>
				</div>
			</section>

			{/* Bottom Consultation Banner */}
			<section className="w-full bg-surface-container-high py-12 border-t border-border-vellum">
				<div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-16 text-center">
					<div className="max-w-2xl mx-auto">
						<h3 className="font-headline-md text-2xl text-primary font-serif mb-2">
							Unsure Which Cohort Fits Your Creative Path?
						</h3>
						<p className="text-sm text-on-surface-variant mb-6 font-light">
							Reach out directly to our Bhusawal studio team for tailored guidance on skill alignment, left-handed nib adjustments, or bespoke private bookings.
						</p>
						<div className="flex justify-center items-center">
							<Link
								href="/contact"
								className="bg-primary text-on-primary hover:bg-secondary text-xs uppercase tracking-wider px-8 py-4 transition-colors rounded-sm font-semibold"
							>
								Speak with an Instructor
							</Link>
						</div>
					</div>
				</div>
			</section>
		</div>
	);
}
