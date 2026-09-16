"use client";
import { useState } from "react";

export function ShopCatalog() {
	const [activeCategory, setActiveCategory] = useState("all");
	const [isDrawerOpen, setIsDrawerOpen] = useState(false);

	const products = [
		{
			id: 1,
			category: "frames",
			name: "Name Frame Royal Large",
			description: "Royal Large custom calligraphy in gold gilded frame with glass float and deckle cotton backing.",
			price: "₹3,800",
			originalPrice: null,
			reviews: 145,
			rating: 4.9,
			badge: "Bestseller",
			image: "https://lh3.googleusercontent.com/aida-public/AB6AXuA1Jo2z3X7-3YqpxGbuUdZ_Lwm6E0Ne7Qe3HjSzxOMWQDNLQ5VY0uLNhXpfSPBwJJkpU7_MYeQnKEl5WK5Y3RcbgunrljnXyUDFt5BCWJMfYIxnYIif5bRM4jt57O4-leUjt-PJTGxBMyLKp-aGE4oD6aJrCw2CXPBsej99Lgt3UDpfu-mRY8GPrvX9IRreeksfZiHN09Zk79Vm-5iNq_UmZxFiezuqJSDDnX1rziGsJW7FBe4V98U",
			type: "Shadowbox Keepsake",
			addon: "Free Wax Sealed Box",
		},
		{
			id: 2,
			category: "frames",
			name: "Name Frame Classic Small",
			description: "Desk keepsake frame with custom personal script and gold dust highlights on cotton paper.",
			price: "₹2,499",
			originalPrice: null,
			reviews: 37,
			rating: 4.8,
			badge: null,
			image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCedGcCVQVS0QQXgmN9S7LaG3iqBNz_5hrYB_rBfeSLGFLKuLt241B3oYfbdb7HykSdvw5gu9F1oUVmv-bh7Z-X0JVAWubDFPh7RiGoG0jxL_Mqr1dRu3oZl9h6Fp-v0uh018r1RYc-8Z87A8nnCMOeaLmxqu9sYyG5CBzhnhTD6SWs0EPFDHVmr0OksXFACP0MQ4lQiSLjZ3cBu5baMwW41sWS_Z7FGNHqtFHkM0lFhkLb01r4V3k",
			type: "Desk Keepsake",
			addon: "5x7 Inch Profile",
		},
		{
			id: 3,
			category: "frames",
			name: "Name Frame Royal Small",
			description: "Hand-lettered with gold flourishes, archival pigment, ideal for intimate bedside gifting.",
			price: "₹2,899",
			originalPrice: null,
			reviews: 98,
			rating: 4.9,
			badge: null,
			image: "https://lh3.googleusercontent.com/aida-public/AB6AXuB75ArS0r07MMWbQoQLpuico8FkzDjuY-tbgtY4V5hJ4de3HCPzzr_Uj-3GKIsxLqAlz1LyQa668jpffQhZXHC1zDMv8ALzkLC6qAcLa_taAzdDRrTgkmQeYWGFoQZsrDrov9xO2jbLD8xen-3oIGdYfp_PbALNSnOIS95znummCmJ3XY41felWnpOpe4pi46uaX6ef8WRqcvS8dTjK4Qhenor89KqA7BWq0j2v7thvzArkf9-i_us",
			type: "Gilded Miniature",
			addon: "6x8 Inch Profile",
		},
		{
			id: 4,
			category: "letters",
			name: "Personalised Handwritten Scroll",
			description: "250-word intimate bespoke prose on handmade parchment with solid brass finials and custom wax seal.",
			price: "₹3,500",
			originalPrice: "₹4,150",
			reviews: 64,
			rating: 5.0,
			badge: "Patron's Pick",
			image: "https://lh3.googleusercontent.com/aida-public/AB6AXuA5TPLWUtCMltK29f3MAUYdhl6NeiB_F9DrNgxWRwjuZWvBzbxmezk4dxTlgQOESsubv8slp0PKOFbVqwwHE5d8p17x9AljrRu3L8WS2WdtHXoWX6PU9ExyX3dM1UA_FfTWvG5H9p73o8za-xW49Z-nRkGeJDla8FEpgwLFyRHNlLNO62Ear-SNs5M-hdOnV-QTpkXg6vQEXGlS4HNbqawb8Wg-rTia-k8LG3ebMJbXJCavJDCtUxo",
			type: "Heirloom Scroll",
			addon: "Silk Velvet Pouch",
		},
		{
			id: 5,
			category: "letters",
			name: "Enveloped Letter & Wax Seal",
			description: "Romantic stationery letter sealed with custom metallic wax seal in velvet keepsake pouch.",
			price: "₹3,200",
			originalPrice: null,
			reviews: 29,
			rating: 4.8,
			badge: null,
			image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBZamVOmuD4E8_2wuonuA1sTuguYKCjQmkLdKTgeDGsYD0cRBzMxZ2zh3W7ED9LgGKpYrDXx-Z9IvqoaaiolW89eJxtPShV2zcUcdSBgkskkTLlQycgzWEkIMsjSXKN2gtwc9182Ah4t2FpHHnEyt2YvHMCwLV2MaHMv4FT59KjtTc890C2jAQMQOU8GyRRYprW4pL0OnIkm_Jr5FGEdDVOx6tDUP7VtxG7OqTHw0D9arHsH9qxEsY",
			type: "Epistle Suite",
			addon: "Archival Cotton",
		},
		{
			id: 6,
			category: "engraved",
			name: "Engraved French Glass Box",
			description: "Victorian brass & glass keepsake hand-engraved with botanicals & gold leafing accents.",
			price: "₹3,400",
			originalPrice: null,
			reviews: 58,
			rating: 4.9,
			badge: null,
			image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDhN2G6c2OrAZrrs7b2mUUkLy7AEdFe7TiTWGBkY09VrNorIf13UZ3Qp9UyJHgvzMUcMbUsEQArsDJg1nbIrEqoA2KRCpHTbbxg7CDyG0LzD8JWryZB7dlnFgbt4NbS5SeejCrXbPDR-Z6eVV0LfdXCUad2LY82NH3txvrlsTWSBHe-9IuI1daH4WkiG5OXDS6B967ix1mhM8xL8f9XnuNJbTxg_3g8VMewexjOOE4AFfAMaj9MDIM",
			type: "Glasswork Atelier",
			addon: "Hand Engraved",
		},
		{
			id: 7,
			category: "engraved",
			name: "Personalised Champagne Flutes (Pair)",
			description: "Fine crystal glasses with gold etched cursive and ceremonial ribbon bow for toastings.",
			price: "₹3,640",
			originalPrice: "₹4,200",
			reviews: 136,
			rating: 4.9,
			badge: null,
			image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBRwlNFCbU3f_iUlBAUMT4rTIRCE9psIY4aao1GWPm8meOk9L28GQKIEj9B4U_eYswvgTfqcfbNrGyM1GqYAPo8cfzZQXo-bVqChPWFwA-tHjFAgVdB0Odj7C0mvc552qcYRuFJ6JNDki_NusQeEl9lQgRP3veOxA3n9BxGEVfF90nuxqOx-bdpKE9MSYCS0JHvVDofU4wpxz8v29y1nZiHhZ0MUaxxp4NcAO1466v-oqFDQqk-W2I",
			type: "Crystal Glass",
			addon: "Twin Crystal Set",
		},
		{
			id: 8,
			category: "wedding",
			name: "Bespoke Wedding Vow Suite",
			description: "A pair of his and hers bespoke wedding vow booklets bound in soft almond linen.",
			price: "₹4,200",
			originalPrice: null,
			reviews: 42,
			rating: 5.0,
			badge: "Heirloom",
			image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCi73FGHk0rbuk262gpMtiRZfpmrZl7Pr-b14_3XJiL9Znzo__VXqzNuYqoMLouGGw3c64Q3RCduypiPcjSTXpIBbJvqT45bG2QltDAElJtkJgjQQ2RutukGDX2wvuaVTbP4AnEsPjHLa0rorL4ddIoTXOGeqCSO-eIk6Rp-JCFZdEFo2hv7_lwKt6k7uPsd7Ut0oK_TRYRyXZLl56lGciaVgJIDtU_7dMkV1bSTjHwW7IuSi5EN_8",
			type: "Wedding Suite",
			addon: "Archival Linen",
		},
	];

	const categories = [
		{ id: "all", label: "All Creations", count: 24 },
		{ id: "frames", label: "Name Frames", count: 8 },
		{ id: "letters", label: "Handwritten Letters & Vows", count: 5 },
		{ id: "wax", label: "Wax Seal Suites", count: 6 },
		{ id: "engraved", label: "Engraved Keepsakes", count: 5 },
	];

	const filteredProducts = activeCategory === "all" ? products : products.filter((p) => p.category === activeCategory);

	return (
		<>
			{/* Filter & Controls Section */}
			<section className="max-w-7xl mx-auto px-margin-mobile lg:px-margin w-full mb-space-md mt-6">
				<div className="bg-surface-container-lowest p-space-sm shadow-sm flex flex-col xl:flex-row items-stretch xl:items-center justify-between gap-gutter rounded-xl">
					{/* Category Filter Pills */}
					<div className="flex items-center gap-space-xs overflow-x-auto pb-2 xl:pb-0 scrollbar-none">
						{categories.map((cat) => (
							<button
								key={cat.id}
								onClick={() => setActiveCategory(cat.id)}
								className={`px-4 py-2 rounded-full font-label-sm text-label-sm uppercase tracking-wider transition-all whitespace-nowrap ${
									activeCategory === cat.id
										? "bg-primary text-on-primary"
										: "bg-tertiary-fixed text-on-tertiary-fixed hover:bg-primary hover:text-on-primary"
								}`}
								type="button"
							>
								{cat.label} <span className="opacity-70 ml-1">({cat.count})</span>
							</button>
						))}
					</div>
					{/* Secondary Controls: Filter Trigger & Sort Dropdown */}
					<div className="flex items-center gap-space-xs shrink-0 justify-between xl:justify-end">
						<button
							onClick={() => setIsDrawerOpen(!isDrawerOpen)}
							className="flex items-center gap-2 px-space-sm py-2.5 bg-surface-container-low hover:bg-surface-container text-on-surface font-label-md text-label-md uppercase tracking-wider transition-colors rounded-lg"
							type="button"
						>
							<span className="material-symbols-outlined text-[18px]">tune</span>
							<span>Refine Atelier Filter</span>
						</button>
						<div className="flex items-center gap-2 bg-surface-container-low px-space-sm py-2.5 rounded-lg">
							<label className="font-label-sm text-label-sm uppercase text-secondary whitespace-nowrap hidden sm:inline" htmlFor="sortSelect">Sort by:</label>
							<select className="bg-transparent font-label-md text-label-md text-primary tracking-wide focus:outline-none cursor-pointer" id="sortSelect">
								<option value="featured">Featured Curations</option>
								<option value="price-asc">Price: Low to High</option>
								<option value="price-desc">Price: High to Low</option>
								<option value="newest">Newest Script Releases</option>
								<option value="rating">Patron Rating</option>
							</select>
						</div>
					</div>
				</div>

				{/* Quick Filter Accordion Drawer (Expandable) */}
				{isDrawerOpen && (
					<div className="mt-space-xs p-space-md bg-paper-tint shadow-sm transition-all duration-300 rounded-xl border border-border-vellum">
						<div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
							<div className="space-y-space-xs">
								<h4 className="font-label-sm text-label-sm uppercase tracking-widest text-primary">Surface Medium</h4>
								<div className="flex flex-col gap-2 mt-4">
									<label className="flex items-center gap-3 cursor-pointer">
										<input defaultChecked className="w-4 h-4 rounded-none accent-primary" type="checkbox" />
										<span className="font-body-sm text-body-sm text-on-surface">300 GSM Cotton Khadi Paper</span>
									</label>
									<label className="flex items-center gap-3 cursor-pointer">
										<input defaultChecked className="w-4 h-4 rounded-none accent-primary" type="checkbox" />
										<span className="font-body-sm text-body-sm text-on-surface">Heavyweight Vellum Tracing</span>
									</label>
									<label className="flex items-center gap-3 cursor-pointer">
										<input className="w-4 h-4 rounded-none accent-primary" type="checkbox" />
										<span className="font-body-sm text-body-sm text-on-surface">Beveled Fluted Glass & Crystal</span>
									</label>
									<label className="flex items-center gap-3 cursor-pointer">
										<input className="w-4 h-4 rounded-none accent-primary" type="checkbox" />
										<span className="font-body-sm text-body-sm text-on-surface">Antique Brass Shadowbox</span>
									</label>
								</div>
							</div>
							<div className="space-y-space-xs">
								<h4 className="font-label-sm text-label-sm uppercase tracking-widest text-primary">Ink Chemistry & Leaf</h4>
								<div className="flex flex-col gap-2 mt-4">
									<label className="flex items-center gap-3 cursor-pointer">
										<input defaultChecked className="w-4 h-4 rounded-none accent-primary" type="checkbox" />
										<span className="font-body-sm text-body-sm text-on-surface">Iron Gall Black Carbon</span>
									</label>
									<label className="flex items-center gap-3 cursor-pointer">
										<input className="w-4 h-4 rounded-none accent-primary" type="checkbox" />
										<span className="font-body-sm text-body-sm text-on-surface">Rich Walnut Sepia Tint</span>
									</label>
									<label className="flex items-center gap-3 cursor-pointer">
										<input className="w-4 h-4 rounded-none accent-primary" type="checkbox" />
										<span className="font-body-sm text-body-sm text-on-surface">24KT Gold Gilded Illumination</span>
									</label>
									<label className="flex items-center gap-3 cursor-pointer">
										<input className="w-4 h-4 rounded-none accent-primary" type="checkbox" />
										<span className="font-body-sm text-body-sm text-on-surface">Copperplate Mica Shimmer</span>
									</label>
								</div>
							</div>
							<div className="space-y-space-xs">
								<h4 className="font-label-sm text-label-sm uppercase tracking-widest text-primary">Ceremonial Occasion</h4>
								<div className="flex flex-col gap-2 mt-4">
									<label className="flex items-center gap-3 cursor-pointer">
										<input className="w-4 h-4 rounded-none accent-primary" type="checkbox" />
										<span className="font-body-sm text-body-sm text-on-surface">Bridal & Wedding Ceremonies</span>
									</label>
									<label className="flex items-center gap-3 cursor-pointer">
										<input className="w-4 h-4 rounded-none accent-primary" type="checkbox" />
										<span className="font-body-sm text-body-sm text-on-surface">Intimate Anniversaries & Vows</span>
									</label>
									<label className="flex items-center gap-3 cursor-pointer">
										<input className="w-4 h-4 rounded-none accent-primary" type="checkbox" />
										<span className="font-body-sm text-body-sm text-on-surface">Corporate Executive Seals</span>
									</label>
									<label className="flex items-center gap-3 cursor-pointer">
										<input className="w-4 h-4 rounded-none accent-primary" type="checkbox" />
										<span className="font-body-sm text-body-sm text-on-surface">Newborn Baby Welcome Heirloom</span>
									</label>
								</div>
							</div>
						</div>
						<div className="flex justify-end items-center gap-space-sm pt-space-sm mt-space-sm bg-surface-container-high px-4 py-2 rounded-lg">
							<button className="font-label-sm text-label-sm uppercase text-secondary hover:text-primary" type="button">Reset Filters</button>
							<button className="bg-primary text-on-primary px-space-sm py-2 font-label-md text-label-md uppercase tracking-wider rounded-lg" type="button">Apply Settings</button>
						</div>
					</div>
				)}
			</section>

			{/* Curated Product Catalog Grid */}
			<section className="max-w-7xl mx-auto px-margin-mobile lg:px-margin w-full pb-16">
				{/* Active Result Count & Current View */}
				<div className="flex items-center justify-between pb-space-xs mb-space-sm">
					<span className="font-label-sm text-label-sm uppercase text-secondary tracking-widest">
						Displaying {filteredProducts.length} of {activeCategory === "all" ? products.length : filteredProducts.length} Bespoke Artifacts
					</span>
					<span className="font-label-sm text-label-sm uppercase text-secondary hidden sm:inline">
						Crafted in Bhusawal Atelier
					</span>
				</div>
				{/* The Grid: 3-column desktop layout with generous cards */}
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter">
					{filteredProducts.map((product) => (
						<article key={product.id} className="group relative flex flex-col bg-surface-container-lowest shadow-sm hover:shadow-xl transition-all duration-300 rounded-xl overflow-hidden">
							<div className="relative w-full aspect-[4/5] overflow-hidden bg-surface-container-low">
								<img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
								
								{product.badge && (
									<div className="absolute top-4 left-4 flex flex-col gap-1.5 items-start">
										<span className={`${product.badge === "Patron's Pick" ? "bg-tertiary-fixed text-on-tertiary-fixed" : "bg-primary text-on-primary"} font-label-sm text-label-sm uppercase tracking-widest px-3 py-1 font-bold rounded-sm`}>
											{product.badge}
										</span>
									</div>
								)}

								<button aria-label="Add to atelier wishlist" className="absolute top-4 right-4 w-9 h-9 bg-surface-container-lowest/90 backdrop-blur-sm text-primary rounded-full flex items-center justify-center hover:bg-primary hover:text-on-primary transition-colors" type="button">
									<span className="material-symbols-outlined text-[19px]">favorite</span>
								</button>
								
								<div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-primary/80 via-primary/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
									<button className="w-full bg-surface-container-lowest text-primary hover:bg-tertiary-fixed font-label-md text-label-md uppercase tracking-wider py-3 shadow-md transition-colors flex items-center justify-center gap-2 rounded-lg" type="button">
										<span className="material-symbols-outlined text-[18px]">brush</span>
										<span>Customise & Order</span>
									</button>
								</div>
							</div>
							
							<div className="p-space-md flex flex-col flex-grow justify-between space-y-space-xs">
								<div>
									<div className="flex items-center justify-between gap-2 mb-1">
										<span className="font-label-sm text-label-sm uppercase tracking-widest text-secondary">{product.type}</span>
										<div className="flex items-center gap-1 text-primary">
											<span className="material-symbols-outlined text-[15px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
											<span className="font-label-sm text-label-sm font-semibold">{product.rating}</span>
											<span className="font-label-sm text-label-sm text-secondary">({product.reviews})</span>
										</div>
									</div>
									<h3 className="font-headline-sm text-headline-sm text-primary group-hover:text-secondary transition-colors line-clamp-1 mt-2">
										{product.name}
									</h3>
									<p className="font-body-sm text-body-sm text-on-surface-variant line-clamp-2 mt-1.5">
										{product.description}
									</p>
								</div>
								<div className="pt-space-xs flex items-center justify-between mt-4 border-t border-border-vellum pt-4">
									<div className="flex items-baseline gap-2">
										<span className="font-headline-md text-headline-md text-primary font-serif">{product.price}</span>
										{product.originalPrice && (
											<span className="font-body-sm text-body-sm text-secondary line-through">{product.originalPrice}</span>
										)}
									</div>
									<span className="font-label-sm text-label-sm uppercase text-secondary">{product.addon}</span>
								</div>
							</div>
						</article>
					))}
				</div>
			</section>
		</>
	);
}
