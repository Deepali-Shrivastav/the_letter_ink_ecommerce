"use client";

import { useState } from "react";
import Link from "next/link";

export type ShopProduct = {
	id: string | number;
	category: string;
	name: string;
	description: string;
	price: string | null;
	originalPrice: string | null;
	rating: number;
	reviews: number;
	badge: string | null;
	image: string | null;
	slug: string;
	type: string;
	addon: string | null;
};

const CATEGORIES = [
	{ id: "all", label: "All Creations" },
	{ id: "frames", label: "Name Frames" },
	{ id: "letters", label: "Handwritten Letters & Vows" },
	{ id: "wax", label: "Wax Seal Suites" },
	{ id: "engraved", label: "Engraved Keepsakes" },
	{ id: "wedding", label: "Wedding Suites" },
];

export function ShopCatalogClient({ products }: { products: ShopProduct[] }) {
	const [activeCategory, setActiveCategory] = useState("all");
	const [isDrawerOpen, setIsDrawerOpen] = useState(false);

	const filteredProducts =
		activeCategory === "all"
			? products
			: products.filter((p) => p.category === activeCategory);

	return (
		<>
			{/* Filter & Controls Section */}
			<section className="max-w-7xl mx-auto px-margin-mobile lg:px-margin w-full mb-space-md mt-6">
				<div className="bg-surface-container-lowest p-space-sm shadow-sm flex flex-col xl:flex-row items-stretch xl:items-center justify-between gap-gutter rounded-xl">
					{/* Category Filter Pills */}
					<div className="flex items-center gap-space-xs overflow-x-auto pb-2 xl:pb-0 scrollbar-none">
						{CATEGORIES.map((cat) => (
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
								{cat.label}{" "}
								<span className="opacity-70 ml-1">
									(
									{cat.id === "all"
										? products.length
										: products.filter((p) => p.category === cat.id).length}
									)
								</span>
							</button>
						))}
					</div>

					{/* Secondary Controls */}
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
							<label
								className="font-label-sm text-label-sm uppercase text-secondary whitespace-nowrap hidden sm:inline"
								htmlFor="shopSortSelect"
							>
								Sort by:
							</label>
							<select
								className="bg-transparent font-label-md text-label-md text-primary tracking-wide focus:outline-none cursor-pointer"
								id="shopSortSelect"
							>
								<option value="featured">Featured Curations</option>
								<option value="price-asc">Price: Low to High</option>
								<option value="price-desc">Price: High to Low</option>
								<option value="newest">Newest Script Releases</option>
								<option value="rating">Patron Rating</option>
							</select>
						</div>
					</div>
				</div>

				{/* Quick Filter Accordion Drawer */}
				{isDrawerOpen && (
					<div className="mt-space-xs p-space-md bg-paper-tint shadow-sm transition-all duration-300 rounded-xl border border-border-vellum">
						<div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
							<div className="space-y-space-xs">
								<h4 className="font-label-sm text-label-sm uppercase tracking-widest text-primary">
									Surface Medium
								</h4>
								<div className="flex flex-col gap-2 mt-4">
									{[
										"300 GSM Cotton Khadi Paper",
										"Heavyweight Vellum Tracing",
										"Beveled Fluted Glass & Crystal",
										"Antique Brass Shadowbox",
									].map((opt) => (
										<label key={opt} className="flex items-center gap-3 cursor-pointer">
											<input
												className="w-4 h-4 rounded-none accent-primary"
												type="checkbox"
											/>
											<span className="font-body-sm text-body-sm text-on-surface">{opt}</span>
										</label>
									))}
								</div>
							</div>
							<div className="space-y-space-xs">
								<h4 className="font-label-sm text-label-sm uppercase tracking-widest text-primary">
									Ink Chemistry & Leaf
								</h4>
								<div className="flex flex-col gap-2 mt-4">
									{[
										"Iron Gall Black Carbon",
										"Rich Walnut Sepia Tint",
										"24KT Gold Gilded Illumination",
										"Copperplate Mica Shimmer",
									].map((opt) => (
										<label key={opt} className="flex items-center gap-3 cursor-pointer">
											<input
												className="w-4 h-4 rounded-none accent-primary"
												type="checkbox"
											/>
											<span className="font-body-sm text-body-sm text-on-surface">{opt}</span>
										</label>
									))}
								</div>
							</div>
							<div className="space-y-space-xs">
								<h4 className="font-label-sm text-label-sm uppercase tracking-widest text-primary">
									Ceremonial Occasion
								</h4>
								<div className="flex flex-col gap-2 mt-4">
									{[
										"Bridal & Wedding Ceremonies",
										"Intimate Anniversaries & Vows",
										"Corporate Executive Seals",
										"Newborn Baby Welcome Heirloom",
									].map((opt) => (
										<label key={opt} className="flex items-center gap-3 cursor-pointer">
											<input
												className="w-4 h-4 rounded-none accent-primary"
												type="checkbox"
											/>
											<span className="font-body-sm text-body-sm text-on-surface">{opt}</span>
										</label>
									))}
								</div>
							</div>
						</div>
						<div className="flex justify-end items-center gap-space-sm pt-space-sm mt-space-sm bg-surface-container-high px-4 py-2 rounded-lg">
							<button
								className="font-label-sm text-label-sm uppercase text-secondary hover:text-primary"
								type="button"
							>
								Reset Filters
							</button>
							<button
								className="bg-primary text-on-primary px-space-sm py-2 font-label-md text-label-md uppercase tracking-wider rounded-lg"
								type="button"
							>
								Apply Settings
							</button>
						</div>
					</div>
				)}
			</section>

			{/* Curated Product Catalog Grid */}
			<section className="max-w-7xl mx-auto px-margin-mobile lg:px-margin w-full pb-16">
				{/* Result count */}
				<div className="flex items-center justify-between pb-space-xs mb-space-sm">
					<span className="font-label-sm text-label-sm uppercase text-secondary tracking-widest">
						Displaying {filteredProducts.length} of {products.length} Bespoke Artifacts
					</span>
					<span className="font-label-sm text-label-sm uppercase text-secondary hidden sm:inline">
						Crafted in Bhusawal Atelier
					</span>
				</div>

				{filteredProducts.length === 0 ? (
					<div className="py-24 text-center">
						<p className="font-body-md text-body-md text-secondary">
							No pieces found in this category yet — check back soon.
						</p>
					</div>
				) : (
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter">
						{filteredProducts.map((product) => (
							<Link
								key={product.id}
								href={`/product/${product.slug}`}
								className="group relative flex flex-col bg-surface-container-lowest shadow-sm hover:shadow-xl transition-all duration-300 rounded-xl overflow-hidden"
							>
								{/* Image */}
								<div className="relative w-full aspect-[4/5] overflow-hidden bg-surface-container-low">
									{product.image ? (
										<img
											src={product.image}
											alt={product.name}
											className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
										/>
									) : (
										<div className="w-full h-full bg-surface-container-low" />
									)}

									{product.badge && (
										<div className="absolute top-4 left-4 flex flex-col gap-1.5 items-start">
											<span
												className={`${
													product.badge === "Patron's Pick"
														? "bg-tertiary-fixed text-on-tertiary-fixed"
														: "bg-primary text-on-primary"
												} font-label-sm text-label-sm uppercase tracking-widest px-3 py-1 font-bold rounded-sm`}
											>
												{product.badge}
											</span>
										</div>
									)}

									<button
										aria-label="Add to atelier wishlist"
										className="absolute top-4 right-4 w-9 h-9 bg-surface-container-lowest/90 backdrop-blur-sm text-primary rounded-full flex items-center justify-center hover:bg-primary hover:text-on-primary transition-colors"
										type="button"
										onClick={(e) => e.preventDefault()}
									>
										<span className="material-symbols-outlined text-[19px]">favorite</span>
									</button>

									<div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-primary/80 via-primary/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
										<span className="w-full bg-surface-container-lowest text-primary hover:bg-tertiary-fixed font-label-md text-label-md uppercase tracking-wider py-3 shadow-md transition-colors flex items-center justify-center gap-2 rounded-lg">
											<span className="material-symbols-outlined text-[18px]">brush</span>
											<span>Customise & Order</span>
										</span>
									</div>
								</div>

								{/* Card body */}
								<div className="p-space-md flex flex-col flex-grow justify-between space-y-space-xs">
									<div>
										<div className="flex items-center justify-between gap-2 mb-1">
											<span className="font-label-sm text-label-sm uppercase tracking-widest text-secondary">
												{product.type}
											</span>
											<div className="flex items-center gap-1 text-primary">
												<span
													className="material-symbols-outlined text-[15px]"
													style={{ fontVariationSettings: "'FILL' 1" }}
												>
													star
												</span>
												<span className="font-label-sm text-label-sm font-semibold">
													{product.rating.toFixed(1)}
												</span>
												{product.reviews > 0 && (
													<span className="font-label-sm text-label-sm text-secondary">
														({product.reviews})
													</span>
												)}
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
											{product.price && (
												<span className="font-headline-md text-headline-md text-primary font-serif">
													{product.price}
												</span>
											)}
											{product.originalPrice && (
												<span className="font-body-sm text-body-sm text-secondary line-through">
													{product.originalPrice}
												</span>
											)}
										</div>
										{product.addon && (
											<span className="font-label-sm text-label-sm uppercase text-secondary">
												{product.addon}
											</span>
										)}
									</div>
								</div>
							</Link>
						))}
					</div>
				)}
			</section>
		</>
	);
}
