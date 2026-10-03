"use client";

import { ArrowRight, ChevronDown, SlidersHorizontal, Sparkles, X } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

export type ShopProduct = {
	id: string | number;
	category: string;
	name: string;
	description: string;
	price: string | null;
	rawPrice?: number | null;
	originalPrice: string | null;
	discountPercent?: number;
	rating?: number;
	reviews?: number;
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
	const [sortBy, setSortBy] = useState<string>("featured");
	const [isDrawerOpen, setIsDrawerOpen] = useState(false);

	// Applied filters
	const [appliedPriceTier, setAppliedPriceTier] = useState<string>("all");
	const [appliedBadge, setAppliedBadge] = useState<string>("all");

	// Draft state inside drawer
	const [draftPriceTier, setDraftPriceTier] = useState<string>("all");
	const [draftBadge, setDraftBadge] = useState<string>("all");

	const handleOpenDrawer = () => {
		setDraftPriceTier(appliedPriceTier);
		setDraftBadge(appliedBadge);
		setIsDrawerOpen((prev) => !prev);
	};

	const handleApply = () => {
		setAppliedPriceTier(draftPriceTier);
		setAppliedBadge(draftBadge);
		setIsDrawerOpen(false);
	};

	const handleReset = () => {
		setDraftPriceTier("all");
		setDraftBadge("all");
		setAppliedPriceTier("all");
		setAppliedBadge("all");
		setActiveCategory("all");
		setSortBy("featured");
		setIsDrawerOpen(false);
	};

	const getNumericPrice = (p: ShopProduct): number => {
		if (typeof p.rawPrice === "number" && !isNaN(p.rawPrice)) return p.rawPrice;
		if (!p.price) return 0;
		const cleaned = p.price.replace(/[^0-9.]/g, "");
		return parseFloat(cleaned) || 0;
	};

	const filteredProducts = useMemo(() => {
		return products.filter((p) => {
			if (activeCategory !== "all" && p.category !== activeCategory) {
				return false;
			}
			if (appliedPriceTier !== "all") {
				const price = getNumericPrice(p);
				if (appliedPriceTier === "under-1500" && price > 1500) return false;
				if (appliedPriceTier === "1500-3000" && (price < 1500 || price > 3000)) return false;
				if (appliedPriceTier === "above-3000" && price < 3000) return false;
			}
			if (appliedBadge !== "all") {
				if (!p.badge || !p.badge.toLowerCase().includes(appliedBadge.toLowerCase())) {
					return false;
				}
			}
			return true;
		});
	}, [products, activeCategory, appliedPriceTier, appliedBadge]);

	const sortedProducts = useMemo(() => {
		const list = [...filteredProducts];
		switch (sortBy) {
			case "price-asc":
				return list.sort((a, b) => getNumericPrice(a) - getNumericPrice(b));
			case "price-desc":
				return list.sort((a, b) => getNumericPrice(b) - getNumericPrice(a));
			case "newest":
				return list.reverse();
			case "featured":
			default:
				return list;
		}
	}, [filteredProducts, sortBy]);

	const activeFiltersCount =
		(appliedPriceTier !== "all" ? 1 : 0) +
		(appliedBadge !== "all" ? 1 : 0) +
		(activeCategory !== "all" ? 1 : 0);

	return (
		<>
			{/* Filter & Controls Section */}
			<section className="max-w-7xl mx-auto px-margin-mobile lg:px-margin w-full mb-space-md mt-6">
				<div className="bg-surface-container-lowest p-space-sm shadow-sm flex flex-col xl:flex-row items-stretch xl:items-center justify-between gap-gutter rounded-xl border border-border-vellum/60">
					{/* Category Filter Pills */}
					<div className="flex items-center gap-space-xs overflow-x-auto pb-2 xl:pb-0 scrollbar-none">
						{CATEGORIES.map((cat) => (
							<button
								key={cat.id}
								onClick={() => setActiveCategory(cat.id)}
								className={`px-4 py-2 rounded-full font-label-sm text-label-sm uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
									activeCategory === cat.id
										? "bg-primary text-on-primary"
										: "bg-tertiary-fixed text-on-tertiary-fixed hover:bg-primary hover:text-on-primary"
								}`}
								type="button"
							>
								{cat.label}{" "}
								<span className="opacity-70 ml-1">
									({cat.id === "all" ? products.length : products.filter((p) => p.category === cat.id).length}
									)
								</span>
							</button>
						))}
					</div>

					{/* Secondary Controls */}
					<div className="flex items-center gap-space-xs shrink-0 justify-between xl:justify-end">
						<button
							onClick={handleOpenDrawer}
							className={`flex items-center gap-2 px-space-sm py-2.5 font-label-md text-label-md uppercase tracking-wider transition-colors rounded-lg cursor-pointer ${
								isDrawerOpen || activeFiltersCount > 0
									? "bg-primary text-on-primary shadow-xs"
									: "bg-surface-container-low hover:bg-surface-container text-on-surface"
							}`}
							type="button"
						>
							<SlidersHorizontal className="w-4 h-4" />
							<span>Refine Atelier Filter</span>
							{activeFiltersCount > 0 && (
								<span className="ml-1 w-5 h-5 rounded-full bg-tertiary-fixed text-primary text-xs font-bold flex items-center justify-center">
									{activeFiltersCount}
								</span>
							)}
						</button>
						<div className="flex items-center gap-2 bg-surface-container-low px-space-sm py-2.5 rounded-lg border border-border-vellum/50">
							<label
								className="font-label-sm text-label-sm uppercase text-secondary whitespace-nowrap hidden sm:inline"
								htmlFor="shopSortSelect"
							>
								Sort by:
							</label>
							<select
								className="bg-transparent font-label-md text-label-md text-primary tracking-wide focus:outline-none cursor-pointer"
								id="shopSortSelect"
								value={sortBy}
								onChange={(e) => setSortBy(e.target.value)}
							>
								<option value="featured">Featured Curations</option>
								<option value="price-asc">Price: Low to High</option>
								<option value="price-desc">Price: High to Low</option>
								<option value="newest">Newest Script Releases</option>
							</select>
						</div>
					</div>
				</div>

				{/* Quick Filter Accordion Drawer */}
				{isDrawerOpen && (
					<div className="mt-space-xs p-space-md bg-paper-tint shadow-sm transition-all duration-300 rounded-xl border border-border-vellum">
						<div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
							{/* Column 1: Price Tier */}
							<div className="space-y-space-xs">
								<h4 className="font-label-sm text-label-sm uppercase tracking-widest text-primary font-bold">
									Price Bracket
								</h4>
								<div className="flex flex-col gap-2 mt-4">
									{[
										{ id: "all", label: "All Prices" },
										{ id: "under-1500", label: "Under ₹1,500" },
										{ id: "1500-3000", label: "₹1,500 – ₹3,000" },
										{ id: "above-3000", label: "Above ₹3,000" },
									].map((opt) => (
										<label key={opt.id} className="flex items-center gap-3 cursor-pointer">
											<input
												type="radio"
												name="priceTier"
												value={opt.id}
												checked={draftPriceTier === opt.id}
												onChange={() => setDraftPriceTier(opt.id)}
												className="w-4 h-4 accent-primary cursor-pointer"
											/>
											<span className="font-body-sm text-body-sm text-on-surface">{opt.label}</span>
										</label>
									))}
								</div>
							</div>

							{/* Column 2: Atelier Editions */}
							<div className="space-y-space-xs">
								<h4 className="font-label-sm text-label-sm uppercase tracking-widest text-primary font-bold">
									Atelier Editions
								</h4>
								<div className="flex flex-col gap-2 mt-4">
									{[
										{ id: "all", label: "All Artifacts" },
										{ id: "Patron's Pick", label: "Patron's Pick" },
										{ id: "Bestseller", label: "Bestseller Creations" },
									].map((opt) => (
										<label key={opt.id} className="flex items-center gap-3 cursor-pointer">
											<input
												type="radio"
												name="badgeOption"
												value={opt.id}
												checked={draftBadge === opt.id}
												onChange={() => setDraftBadge(opt.id)}
												className="w-4 h-4 accent-primary cursor-pointer"
											/>
											<span className="font-body-sm text-body-sm text-on-surface">{opt.label}</span>
										</label>
									))}
								</div>
							</div>

							{/* Column 3: Category Quick Select */}
							<div className="space-y-space-xs">
								<h4 className="font-label-sm text-label-sm uppercase tracking-widest text-primary font-bold">
									Category Filter
								</h4>
								<div className="flex flex-col gap-2 mt-4">
									{CATEGORIES.map((cat) => (
										<label key={cat.id} className="flex items-center gap-3 cursor-pointer">
											<input
												type="radio"
												name="drawerCategory"
												value={cat.id}
												checked={activeCategory === cat.id}
												onChange={() => setActiveCategory(cat.id)}
												className="w-4 h-4 accent-primary cursor-pointer"
											/>
											<span className="font-body-sm text-body-sm text-on-surface">{cat.label}</span>
										</label>
									))}
								</div>
							</div>
						</div>

						{/* Action Buttons */}
						<div className="flex justify-between sm:justify-end items-center gap-space-sm pt-space-sm mt-space-sm border-t border-border-vellum">
							<button
								onClick={handleReset}
								className="font-label-sm text-label-sm uppercase tracking-wider text-secondary hover:text-primary transition-colors cursor-pointer"
								type="button"
							>
								Reset Filters
							</button>
							<div className="flex items-center gap-2">
								<button
									onClick={() => setIsDrawerOpen(false)}
									className="px-4 py-2 border border-border-vellum text-secondary hover:text-primary font-label-md text-label-md uppercase tracking-wider rounded-lg transition-colors cursor-pointer"
									type="button"
								>
									Cancel
								</button>
								<button
									onClick={handleApply}
									className="bg-primary hover:bg-primary/90 text-on-primary px-space-sm py-2 font-label-md text-label-md uppercase tracking-wider rounded-lg transition-colors cursor-pointer shadow-xs"
									type="button"
								>
									Apply Settings
								</button>
							</div>
						</div>
					</div>
				)}
			</section>

			{/* Curated Product Catalog Grid */}
			<section className="max-w-7xl mx-auto px-margin-mobile lg:px-margin w-full pb-16">
				{/* Result count & active filters row */}
				<div className="flex flex-col gap-2 pb-space-xs mb-space-sm">
					<div className="flex items-center justify-between">
						<span className="font-label-sm text-label-sm uppercase text-secondary tracking-widest">
							Displaying {sortedProducts.length} of {products.length} Bespoke Artifacts
						</span>
						<span className="font-label-sm text-label-sm uppercase text-secondary hidden sm:inline">
							Crafted in Bhusawal Atelier
						</span>
					</div>

					{/* Active Filter Chips */}
					{activeFiltersCount > 0 && (
						<div className="flex flex-wrap items-center gap-2 pt-2">
							<span className="text-xs uppercase tracking-wider text-secondary font-medium">
								Active Filters:
							</span>
							{activeCategory !== "all" && (
								<span className="inline-flex items-center gap-1.5 px-3 py-1 bg-surface-container-low border border-border-vellum rounded-full text-xs font-medium text-primary">
									Category: {CATEGORIES.find((c) => c.id === activeCategory)?.label || activeCategory}
									<button
										type="button"
										onClick={() => setActiveCategory("all")}
										className="hover:text-red-500 cursor-pointer"
									>
										<X className="w-3 h-3" />
									</button>
								</span>
							)}
							{appliedPriceTier !== "all" && (
								<span className="inline-flex items-center gap-1.5 px-3 py-1 bg-surface-container-low border border-border-vellum rounded-full text-xs font-medium text-primary">
									Price:{" "}
									{appliedPriceTier === "under-1500"
										? "Under ₹1,500"
										: appliedPriceTier === "1500-3000"
											? "₹1,500 – ₹3,000"
											: "Above ₹3,000"}
									<button
										type="button"
										onClick={() => setAppliedPriceTier("all")}
										className="hover:text-red-500 cursor-pointer"
									>
										<X className="w-3 h-3" />
									</button>
								</span>
							)}
							{appliedBadge !== "all" && (
								<span className="inline-flex items-center gap-1.5 px-3 py-1 bg-surface-container-low border border-border-vellum rounded-full text-xs font-medium text-primary">
									Edition: {appliedBadge}
									<button
										type="button"
										onClick={() => setAppliedBadge("all")}
										className="hover:text-red-500 cursor-pointer"
									>
										<X className="w-3 h-3" />
									</button>
								</span>
							)}
							<button
								type="button"
								onClick={handleReset}
								className="text-xs text-secondary hover:text-primary underline ml-2 cursor-pointer font-medium"
							>
								Clear all
							</button>
						</div>
					)}
				</div>

				{sortedProducts.length === 0 ? (
					<div className="py-24 text-center bg-surface-container-lowest rounded-xl border border-border-vellum p-8">
						<p className="font-body-md text-body-md text-secondary">
							No pieces match the selected filters.
						</p>
						<button
							type="button"
							onClick={handleReset}
							className="mt-4 px-5 py-2.5 bg-primary text-on-primary font-label-sm text-xs uppercase tracking-wider rounded-lg hover:bg-primary/90 transition-colors cursor-pointer"
						>
							Reset All Filters
						</button>
					</div>
				) : (
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter">
						{sortedProducts.map((product) => (
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

									{(product.badge || (product.discountPercent && product.discountPercent > 0)) && (
										<div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5 items-start">
											{product.badge && (
												<span
													className={`${
														product.badge === "Patron's Pick"
															? "bg-tertiary-fixed text-on-tertiary-fixed"
															: "bg-primary text-on-primary"
													} font-label-sm text-[10px] uppercase tracking-widest px-2.5 py-1 font-bold rounded-sm shadow-xs`}
												>
													{product.badge}
												</span>
											)}
											{product.discountPercent && product.discountPercent > 0 && (
												<span className="font-label-sm text-[10px] uppercase tracking-widest px-2.5 py-1 font-bold rounded-sm bg-tertiary-fixed text-on-tertiary-fixed shadow-xs">
													Save {product.discountPercent}%
												</span>
											)}
										</div>
									)}
								</div>

								{/* Card body */}
								<div className="p-space-md flex flex-col flex-grow justify-between space-y-space-xs">
									<div>
										<div className="flex items-center justify-between gap-2 mb-1">
											<span className="font-label-sm text-label-sm uppercase tracking-widest text-secondary">
												{product.type}
											</span>
										</div>
										<h3 className="font-headline-sm text-headline-sm text-primary group-hover:text-secondary transition-colors line-clamp-1 mt-2">
											{product.name}
										</h3>
										<p className="font-body-sm text-body-sm text-on-surface-variant line-clamp-2 mt-1.5">
											{product.description}
										</p>
									</div>

									<div className="pt-space-xs flex items-center justify-between mt-4 border-t border-border-vellum pt-4">
										<div className="flex flex-col">
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
												<span className="font-label-sm text-[11px] text-secondary mt-0.5">
													{product.addon}
												</span>
											)}
										</div>
										<span className="px-3.5 py-1.5 bg-primary text-on-primary font-label-sm text-xs uppercase tracking-wider rounded group-hover:bg-tertiary-fixed group-hover:text-primary transition-colors flex items-center gap-1.5 shadow-2xs">
											<span>Customise</span>
											<ArrowRight className="w-3.5 h-3.5" />
										</span>
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
