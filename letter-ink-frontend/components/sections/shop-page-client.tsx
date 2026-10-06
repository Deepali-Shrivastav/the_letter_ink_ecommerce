"use client";

import {
	ArrowRight,
	CheckCircle2,
	ChevronDown,
	Clock,
	Minus,
	PackageOpen,
	Plus,
	RotateCcw,
	SlidersHorizontal,
	Sparkles,
} from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";

interface ShopPageClientProps {
	initialProducts?: any[];
}

export function ShopPageClient({ initialProducts = [] }: ShopPageClientProps) {
	const searchParams = useSearchParams();
	const categoryParam = searchParams.get("category");

	const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
	const [priceRange, setPriceRange] = useState<[number, number]>([100, 10000]);
	const [sortBy, setSortBy] = useState<string>("featured");
	const [currentPage, setCurrentPage] = useState<number>(1);
	const [isFilterOpen, setIsFilterOpen] = useState<boolean>(false);

	const isPriceFiltered = priceRange[0] > 100 || priceRange[1] < 10000;
	const activeFiltersCount = selectedCategories.length + (isPriceFiltered ? 1 : 0);

	const itemsPerPage = 12;

	// Derive unique categories from products
	const availableCategories = useMemo(() => {
		const counts: Record<string, number> = {};
		for (const p of initialProducts) {
			if (p.name && p.name.trim().toLowerCase() === "product") continue;
			const cat = p.metadata?.category_name || p.category?.name || "General Artifacts";
			counts[cat] = (counts[cat] || 0) + 1;
		}
		return Object.entries(counts).map(([name, count]) => ({ name, count }));
	}, [initialProducts]);

	useEffect(() => {
		if (!categoryParam) return;

		const paramLower = categoryParam.toLowerCase().trim();
		const match = availableCategories.find(
			(c) =>
				c.name.toLowerCase() === paramLower ||
				(paramLower.includes("frame") && c.name.toLowerCase().includes("frame")) ||
				((paramLower.includes("vow") || paramLower.includes("letter")) &&
					c.name.toLowerCase().includes("vow")) ||
				((paramLower.includes("glass") || paramLower.includes("engrav")) &&
					c.name.toLowerCase().includes("glass")) ||
				((paramLower.includes("wax") || paramLower.includes("seal")) && c.name.toLowerCase().includes("wax")),
		);

		if (match) {
			setSelectedCategories([match.name]);
			setCurrentPage(1);
		} else {
			setSelectedCategories([categoryParam]);
			setCurrentPage(1);
		}
	}, [categoryParam, availableCategories]);

	const toggleCategory = (catName: string) => {
		setCurrentPage(1);
		setSelectedCategories((prev) =>
			prev.includes(catName) ? prev.filter((c) => c !== catName) : [...prev, catName],
		);
	};

	const resetFilters = () => {
		setSelectedCategories([]);
		setPriceRange([100, 10000]);
		setSortBy("featured");
		setCurrentPage(1);
	};

	// Filter products
	const filteredProducts = useMemo(() => {
		return initialProducts.filter((product) => {
			// Exclude placeholder/dummy "Product" record
			if (product.name && product.name.trim().toLowerCase() === "product") {
				return false;
			}

			const price = Number(product.variants?.[0]?.price) || 0;
			const [minPrice, maxPrice] = priceRange;

			if (price > 0 && (price < minPrice || (maxPrice < 10000 && price > maxPrice))) {
				return false;
			}

			if (selectedCategories.length > 0) {
				const cat = product.metadata?.category_name || product.category?.name || "General Artifacts";
				if (!selectedCategories.includes(cat)) {
					return false;
				}
			}

			return true;
		});
	}, [initialProducts, priceRange, selectedCategories]);

	// Sort products
	const sortedProducts = useMemo(() => {
		const list = [...filteredProducts];
		switch (sortBy) {
			case "price-asc":
				return list.sort(
					(a, b) => (Number(a.variants?.[0]?.price) || 0) - (Number(b.variants?.[0]?.price) || 0),
				);
			case "price-desc":
				return list.sort(
					(a, b) => (Number(b.variants?.[0]?.price) || 0) - (Number(a.variants?.[0]?.price) || 0),
				);
			case "bestsellers":
				return list.sort((a, b) => {
					const aBest =
						a.badge?.toLowerCase().includes("bestseller") ||
						a.metadata?.badge?.toLowerCase().includes("bestseller")
							? 1
							: 0;
					const bBest =
						b.badge?.toLowerCase().includes("bestseller") ||
						b.metadata?.badge?.toLowerCase().includes("bestseller")
							? 1
							: 0;
					return bBest - aBest;
				});
			case "newest":
				return list.reverse();
			default:
				return list;
		}
	}, [filteredProducts, sortBy]);

	// Pagination
	const totalPages = Math.max(1, Math.ceil(sortedProducts.length / itemsPerPage));
	const displayedProducts = useMemo(() => {
		const start = (currentPage - 1) * itemsPerPage;
		return sortedProducts.slice(start, start + itemsPerPage);
	}, [sortedProducts, currentPage]);

	const minVal = priceRange[0] ?? 100;
	const maxVal = priceRange[1] ?? 10000;

	return (
		<div className="flex flex-col w-full">
			{/* Subtle top decorative ambient radial */}
			<div className="relative w-full overflow-hidden">
				<div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[850px] h-[340px] bg-tertiary-fixed/35 blur-3xl pointer-events-none rounded-full" />

				{/* Editorial Page Header */}
				<section className="relative max-w-[1440px] mx-auto px-margin-mobile lg:px-margin pt-space-lg pb-space-md">
					{/* Breadcrumb & Tagline Bar */}
					<div className="flex flex-wrap items-center justify-between gap-space-xs pb-space-sm">
						<nav
							aria-label="Breadcrumbs"
							className="flex items-center gap-space-xs text-on-surface-variant font-label-sm text-label-sm uppercase tracking-widest"
						>
							<Link className="hover:text-primary transition-colors" href="/">
								Home
							</Link>
							<span className="text-outline">/</span>
							<span className="text-primary font-semibold">Shop</span>
						</nav>
						<span className="font-label-sm text-label-sm tracking-[0.28em] text-secondary">
							Dispatching from Maharashtra Atelier • Global Transit
						</span>
					</div>

					{/* Main Headline Block */}
					<div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter items-end pt-space-xs pb-space-xs">
						<div className="lg:col-span-8 space-y-space-xs">
							<p className="font-label-md text-label-md tracking-[0.24em] text-on-secondary-fixed-variant">
								The Artisanal Collection
							</p>
							<h1 className="font-headline-lg text-headline-lg text-primary tracking-tight leading-tight">
								Handcrafted Stationery &amp; Inscribed Keepsakes
							</h1>
						</div>
						<div className="lg:col-span-4 lg:pl-space-sm">
							<p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
								Each piece is hand-lettered on handmade deckle-edge papers, etched on crystal glass, or framed
								in brass shadowboxes using archival inks and fine dip-pens.
							</p>
						</div>
					</div>

					{/* Atmospheric Atelier Stat Bar */}
					<div className="grid grid-cols-2 sm:grid-cols-4 gap-gutter pt-space-md mt-space-sm bg-surface-container-low px-space-md py-space-sm">
						<div className="flex flex-col">
							<span className="font-display-hero text-[28px] leading-8 text-primary font-serif">100%</span>
							<span className="font-label-sm text-label-sm uppercase text-secondary tracking-wider mt-1">
								Dip Pen Scripted
							</span>
						</div>
						<div className="flex flex-col">
							<span className="font-display-hero text-[28px] leading-8 text-primary font-serif">300 GSM</span>
							<span className="font-label-sm text-label-sm uppercase text-secondary tracking-wider mt-1">
								Cotton Rag Stock
							</span>
						</div>
						<div className="flex flex-col">
							<span className="font-display-hero text-[28px] leading-8 text-primary font-serif">24 KT</span>
							<span className="font-label-sm text-label-sm uppercase text-secondary tracking-wider mt-1">
								Pure Gold Leaf Flakes
							</span>
						</div>
						<div className="flex flex-col">
							<span className="font-display-hero text-[28px] leading-8 text-primary font-serif">
								7–10 Days
							</span>
							<span className="font-label-sm text-label-sm uppercase text-secondary tracking-wider mt-1">
								Atelier Curing &amp; Frame
							</span>
						</div>
					</div>
				</section>
			</div>

			{/* Curated Product Catalog Grid */}
			<section className="w-full bg-background py-space-md lg:py-space-lg px-margin-mobile lg:px-margin">
				<div className="max-w-[1440px] mx-auto">
					{/* Catalog Control Toolbar */}
					<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-space-sm mb-space-md bg-surface-container-lowest p-4 lg:px-6 shadow-sm border border-border-vellum">
						<div className="flex items-center gap-3">
							<Sparkles className="w-5 h-5 text-primary" />
							<p className="font-label-md text-label-md text-primary tracking-wide">
								{sortedProducts.length === initialProducts.length ? (
									<>
										<span className="font-bold">{initialProducts.length}</span> products
									</>
								) : (
									<>
										Showing <span className="font-bold">{sortedProducts.length}</span> of{" "}
										<span className="font-bold">{initialProducts.length}</span> products
									</>
								)}
							</p>
						</div>
						<div className="flex items-center gap-3">
							<label
								className="font-label-sm text-label-sm uppercase tracking-wider text-secondary"
								htmlFor="shop-sort"
							>
								Sort By:
							</label>
							<div className="relative min-w-[180px]">
								<select
									className="w-full bg-surface-container-low text-primary font-body-sm text-body-sm py-2 px-3 pr-8 rounded-none appearance-none focus:outline-none focus:bg-surface-container cursor-pointer shadow-inner"
									id="shop-sort"
									value={sortBy}
									onChange={(e) => {
										setSortBy(e.target.value);
										setCurrentPage(1);
									}}
								>
									<option value="featured">Featured / Curated</option>
									<option value="price-asc">Price: Low to High</option>
									<option value="price-desc">Price: High to Low</option>
									<option value="newest">Newest Arrivals</option>
									<option value="bestsellers">Bestsellers</option>
								</select>
								<ChevronDown className="w-4 h-4 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-secondary" />
							</div>
						</div>
					</div>

					{/* Two-Column Master Layout */}
					<div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
						{/* LEFT SIDEBAR: Filters */}
						<aside className="lg:col-span-3 space-y-space-md">
							<div className="bg-surface-container-lowest rounded-lg border border-border-vellum shadow-sm overflow-hidden text-primary font-body-sm transition-all duration-300">
								{/* Dropdown Header for Whole Filter Box */}
								<div
									onClick={() => setIsFilterOpen((prev) => !prev)}
									className={cn(
										"px-6 py-4 sm:py-5 flex items-center justify-between bg-surface-container-lowest cursor-pointer select-none hover:bg-surface-container-low/40 transition-colors group",
										isFilterOpen && "border-b border-border-vellum",
									)}
									role="button"
									tabIndex={0}
									onKeyDown={(e) => {
										if (e.key === "Enter" || e.key === " ") {
											e.preventDefault();
											setIsFilterOpen((prev) => !prev);
										}
									}}
									aria-expanded={isFilterOpen}
								>
									<div className="flex items-center gap-2.5">
										<SlidersHorizontal className="w-5 h-5 text-primary transition-transform group-hover:scale-110" />
										<h2 className="font-headline-sm text-headline-sm text-primary font-normal tracking-wide flex items-center gap-2">
											<span>Filter</span>
											{activeFiltersCount > 0 && (
												<span className="inline-flex items-center justify-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-primary text-on-primary">
													{activeFiltersCount}
												</span>
											)}
										</h2>
										<ChevronDown
											className={cn(
												"w-5 h-5 text-secondary transition-transform duration-300 ml-0.5",
												isFilterOpen ? "rotate-180" : "rotate-0",
											)}
										/>
									</div>
									<div className="flex items-center gap-3" onClick={(e) => e.stopPropagation()}>
										<button
											type="button"
											onClick={resetFilters}
											className={cn(
												"font-label-sm text-[11px] uppercase tracking-widest transition-colors",
												activeFiltersCount > 0
													? "text-primary font-medium hover:underline"
													: "text-secondary hover:text-primary",
											)}
										>
											Reset
										</button>
									</div>
								</div>

								{/* Collapsible Content with Smooth Grid Transition */}
								<div
									className={cn(
										"grid transition-all duration-300 ease-in-out",
										isFilterOpen
											? "grid-rows-[1fr] opacity-100"
											: "grid-rows-[0fr] opacity-0 pointer-events-none",
									)}
								>
									<div className="overflow-hidden">
										{/* Price Histogram & Range */}
										<div className="p-6 border-b border-border-vellum">
											<div className="flex items-center justify-between mb-4">
												<span className="font-label-md text-label-md text-primary font-medium tracking-wide">
													Price
												</span>
												<button
													type="button"
													onClick={() => setPriceRange([100, 10000])}
													className="text-secondary hover:text-primary text-[12px] uppercase font-label-sm"
													title="Reset price range"
												>
													Reset
												</button>
											</div>
											<div className="flex items-end gap-1 h-12 mb-3 px-1">
												<div className="flex-1 bg-surface-container rounded-t-sm h-[40%]" />
												<div className="flex-1 bg-surface-container-high rounded-t-sm h-[65%]" />
												<div className="flex-1 bg-tertiary-fixed rounded-t-sm h-[85%]" />
												<div className="flex-1 bg-tertiary-fixed rounded-t-sm h-[100%]" />
												<div className="flex-1 bg-tertiary-fixed rounded-t-sm h-[90%]" />
												<div className="flex-1 bg-tertiary-fixed rounded-t-sm h-[75%]" />
												<div className="flex-1 bg-tertiary-fixed rounded-t-sm h-[60%]" />
												<div className="flex-1 bg-surface-container-high rounded-t-sm h-[50%]" />
												<div className="flex-1 bg-surface-container rounded-t-sm h-[35%]" />
												<div className="flex-1 bg-surface-container rounded-t-sm h-[45%]" />
											</div>
											<div className="flex items-center justify-between text-secondary font-label-sm text-[11px] mb-2">
												<span>₹ 100</span>
												<span>₹ 10,000+</span>
											</div>
											<div className="relative py-2 mb-4 px-2">
												<Slider
													defaultValue={[100, 10000]}
													min={100}
													max={10000}
													step={100}
													value={priceRange}
													onValueChange={(val: number[]) => {
														setPriceRange([val[0] ?? 100, val[1] ?? 10000]);
														setCurrentPage(1);
													}}
												/>
											</div>
											<div className="grid grid-cols-2 gap-3 pt-2">
												<div className="flex flex-col">
													<span className="font-label-sm text-[10px] text-secondary uppercase tracking-wider mb-1 text-center">
														Minimum
													</span>
													<div className="border border-border-vellum bg-surface-container-lowest px-3 py-2 text-center text-primary font-medium shadow-inner">
														₹ {minVal.toLocaleString("en-IN")}
													</div>
												</div>
												<div className="flex flex-col">
													<span className="font-label-sm text-[10px] text-secondary uppercase tracking-wider mb-1 text-center">
														Maximum
													</span>
													<div className="border border-border-vellum bg-surface-container-lowest px-3 py-2 text-center text-primary font-medium shadow-inner">
														₹ {maxVal.toLocaleString("en-IN")}
														{maxVal >= 10000 ? "+" : ""}
													</div>
												</div>
											</div>
										</div>

										{/* Facets Accordions */}
										<div className="divide-y divide-border-vellum">
											<details className="group" open>
												<summary className="flex items-center justify-between px-6 py-4 cursor-pointer list-none hover:bg-surface-container-low transition-colors">
													<span className="font-label-md text-label-md text-primary font-medium tracking-wide">
														Categories
													</span>
													<Plus className="w-4 h-4 text-secondary group-open:hidden" />
													<Minus className="w-4 h-4 text-secondary hidden group-open:inline-block" />
												</summary>
												<div className="px-6 pb-4 pt-1 space-y-2.5">
													{availableCategories.map((cat) => {
														const isChecked = selectedCategories.includes(cat.name);
														return (
															<label
																key={cat.name}
																className="flex items-center justify-between cursor-pointer"
															>
																<span className="flex items-center gap-2.5">
																	<input
																		type="checkbox"
																		checked={isChecked}
																		onChange={() => toggleCategory(cat.name)}
																		className="w-4 h-4 rounded-none accent-primary cursor-pointer"
																	/>
																	<span className="text-body-sm text-on-surface hover:text-primary">
																		{cat.name}
																	</span>
																</span>
																<span className="font-label-sm text-[10px] bg-surface-container px-1.5 py-0.5 rounded text-secondary">
																	{cat.count}
																</span>
															</label>
														);
													})}
												</div>
											</details>

											<details className="group" open>
												<summary className="flex items-center justify-between px-6 py-4 cursor-pointer list-none hover:bg-surface-container-low transition-colors">
													<span className="font-label-md text-label-md text-primary font-medium tracking-wide">
														Script &amp; Technique
													</span>
													<Plus className="w-4 h-4 text-secondary group-open:hidden" />
													<Minus className="w-4 h-4 text-secondary hidden group-open:inline-block" />
												</summary>
												<div className="px-6 pb-4 pt-1 space-y-2.5">
													<label className="flex items-center gap-2.5 cursor-pointer">
														<input
															type="checkbox"
															defaultChecked
															className="w-4 h-4 rounded-none accent-primary cursor-pointer"
														/>
														<span className="text-body-sm text-on-surface hover:text-primary">
															Copperplate Calligraphy
														</span>
													</label>
													<label className="flex items-center gap-2.5 cursor-pointer">
														<input
															type="checkbox"
															defaultChecked
															className="w-4 h-4 rounded-none accent-primary cursor-pointer"
														/>
														<span className="text-body-sm text-on-surface hover:text-primary">
															Spencerian Script
														</span>
													</label>
													<label className="flex items-center gap-2.5 cursor-pointer">
														<input
															type="checkbox"
															defaultChecked
															className="w-4 h-4 rounded-none accent-primary cursor-pointer"
														/>
														<span className="text-body-sm text-on-surface hover:text-primary">
															Modern Flourished Roman
														</span>
													</label>
													<label className="flex items-center gap-2.5 cursor-pointer">
														<input
															type="checkbox"
															defaultChecked
															className="w-4 h-4 rounded-none accent-primary cursor-pointer"
														/>
														<span className="text-body-sm text-on-surface hover:text-primary">
															Hand-Engraved Crystal
														</span>
													</label>
												</div>
											</details>

											<details className="group">
												<summary className="flex items-center justify-between px-6 py-4 cursor-pointer list-none hover:bg-surface-container-low transition-colors">
													<span className="font-label-md text-label-md text-primary font-medium tracking-wide">
														Material &amp; Finish
													</span>
													<Plus className="w-4 h-4 text-secondary group-open:hidden" />
													<Minus className="w-4 h-4 text-secondary hidden group-open:inline-block" />
												</summary>
												<div className="px-6 pb-4 pt-1 space-y-2.5">
													<label className="flex items-center gap-2.5 cursor-pointer">
														<input
															type="checkbox"
															className="w-4 h-4 rounded-none accent-primary cursor-pointer"
														/>
														<span className="text-body-sm text-on-surface hover:text-primary">
															24k Pure Gold Leaf
														</span>
													</label>
													<label className="flex items-center gap-2.5 cursor-pointer">
														<input
															type="checkbox"
															className="w-4 h-4 rounded-none accent-primary cursor-pointer"
														/>
														<span className="text-body-sm text-on-surface hover:text-primary">
															300 GSM Deckle Rag
														</span>
													</label>
													<label className="flex items-center gap-2.5 cursor-pointer">
														<input
															type="checkbox"
															className="w-4 h-4 rounded-none accent-primary cursor-pointer"
														/>
														<span className="text-body-sm text-on-surface hover:text-primary">
															Victorian Brass &amp; Glass
														</span>
													</label>
													<label className="flex items-center gap-2.5 cursor-pointer">
														<input
															type="checkbox"
															className="w-4 h-4 rounded-none accent-primary cursor-pointer"
														/>
														<span className="text-body-sm text-on-surface hover:text-primary">
															Hand-Poured Flexible Wax
														</span>
													</label>
												</div>
											</details>
										</div>
									</div>
								</div>
							</div>
						</aside>

						{/* RIGHT MAIN AREA: Dynamic Product Grid & Pagination */}
						<div className="lg:col-span-9">
							{displayedProducts.length === 0 ? (
								<div className="col-span-full py-16 px-6 text-center bg-surface-container-lowest border border-border-vellum rounded-lg">
									<PackageOpen className="w-10 h-10 text-secondary mb-3 mx-auto" />
									<h3 className="font-headline-sm text-lg text-primary mb-2 font-serif">No Pieces Found</h3>
									<p className="font-body-sm text-on-surface-variant max-w-md mx-auto mb-6">
										We couldn't find any artisanal pieces matching your current filters. Try widening your
										price range, resetting filters, or commissioning a custom creation.
									</p>
									<div className="flex flex-wrap items-center justify-center gap-3">
										<button
											type="button"
											onClick={resetFilters}
											className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-on-primary font-label-md text-xs uppercase px-5 py-2.5 rounded transition-colors shadow-sm cursor-pointer"
										>
											<RotateCcw className="w-4 h-4" />
											Reset All Filters
										</button>
										<Link
											href="/contact"
											className="inline-flex items-center gap-2 bg-tertiary-fixed text-primary hover:bg-surface-container-low font-label-md text-xs uppercase px-5 py-2.5 rounded border border-border-vellum transition-colors shadow-2xs"
										>
											Commission Custom Piece →
										</Link>
									</div>
								</div>
							) : (
								<div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8">
									{displayedProducts.map((product) => {
										const variants = product.variants || [];
										const prices = variants
											.map((v: any) => Number(v.price))
											.filter((p: number) => !isNaN(p) && p > 0);
										const minPrice =
											prices.length > 0 ? Math.min(...prices) : Number(product.variants?.[0]?.price) || 0;
										const maxPrice = prices.length > 0 ? Math.max(...prices) : minPrice;
										const isPriceRange = prices.length > 1 && minPrice !== maxPrice;
										const price = minPrice;

										const originalPrice =
											Number(product.variants?.[0]?.originalPrice || product.metadata?.original_price) || 0;
										const isDiscounted = originalPrice > price;
										const percentOff = isDiscounted
											? Math.round(((originalPrice - price) / originalPrice) * 100)
											: 0;
										const editionBadge = product.badge || product.metadata?.badge || null;
										const discountBadge = isDiscounted
											? percentOff > 0
												? `Save ${percentOff}%`
												: "Sale"
											: null;

										const categoryLabel =
											product.metadata?.subtitle ||
											product.category?.name ||
											product.metadata?.category_name ||
											"Atelier Heirloom";
										const actionLabel = product.metadata?.action_label || "Order Online";
										const imageSrc =
											product.images?.[0] ||
											product.thumbnail ||
											"https://images.unsplash.com/photo-1586075010923-2dd4570fb338?auto=format&fit=crop&w=600&q=80";

										const isWorkshop =
											categoryLabel?.toLowerCase().includes("workshop") || product.type === "workshop";
										const leadTime =
											product.leadTime ||
											product.metadata?.lead_time ||
											product.metadata?.leadTime ||
											product.metadata?.turnaround ||
											(isWorkshop ? "Interactive Masterclass" : "Ships in 5–7 days");

										return (
											<article
												key={product.id}
												className="bg-surface-container-lowest flex flex-col justify-between shadow-2xs hover:shadow-xl transition-all duration-300 group border border-border-vellum/70 rounded-xl overflow-hidden"
											>
												<div>
													<div className="relative w-full aspect-[4/5] overflow-hidden bg-surface-container-low">
														<Link href={`/product/${product.slug}`} className="block w-full h-full">
															<img
																className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
																alt={product.name}
																src={imageSrc}
																onError={(e) => {
																	(e.target as HTMLImageElement).src =
																		"https://images.unsplash.com/photo-1586075010923-2dd4570fb338?auto=format&fit=crop&w=600&q=80";
																}}
															/>
														</Link>
														{(editionBadge || discountBadge) && (
															<div className="absolute top-3 left-3 flex flex-col gap-1.5 items-start pointer-events-none">
																{editionBadge && (
																	<div
																		className={`px-2.5 py-1 font-label-sm text-[10px] uppercase tracking-widest rounded-sm font-bold shadow-xs ${
																			editionBadge === "Patron's Pick"
																				? "bg-tertiary-fixed text-on-tertiary-fixed"
																				: "bg-primary text-on-primary"
																		}`}
																	>
																		{editionBadge}
																	</div>
																)}
																{discountBadge && (
																	<div className="bg-tertiary-fixed text-on-tertiary-fixed px-2.5 py-1 font-label-sm text-[10px] uppercase tracking-widest rounded-sm font-bold shadow-xs">
																		{discountBadge}
																	</div>
																)}
															</div>
														)}
													</div>

													<div className="p-space-md space-y-space-xs">
														<div className="flex items-center justify-between mb-1">
															<span className="font-label-sm text-label-sm uppercase tracking-widest text-secondary block truncate">
																{categoryLabel}
															</span>
														</div>

														<Link href={`/product/${product.slug}`}>
															<h3 className="font-headline-sm text-headline-sm text-primary group-hover:text-secondary transition-colors line-clamp-1 font-serif">
																{product.name}
															</h3>
														</Link>

														<p className="font-body-sm text-body-sm text-on-surface-variant line-clamp-2 mt-1.5">
															{product.summary || product.content || ""}
														</p>
													</div>
												</div>

												<div className="p-space-md pt-0">
													<div className="pt-space-xs flex items-end justify-between border-t border-border-vellum/60 pt-3">
														<div className="flex flex-col min-w-0">
															<span className="font-label-sm text-[11px] uppercase tracking-wider text-secondary/90 flex items-center gap-1.5 mb-1.5">
																<Clock className="w-3.5 h-3.5 text-secondary/80 shrink-0" />
																<span className="truncate">{leadTime}</span>
															</span>
															<div className="flex items-baseline gap-1.5 flex-wrap">
																{isPriceRange && (
																	<span className="font-label-sm text-[11px] uppercase tracking-widest text-secondary font-medium">
																		From
																	</span>
																)}
																<span className="font-headline-md text-headline-md text-primary font-serif">
																	₹{price.toLocaleString("en-IN")}
																</span>
																{isDiscounted && (
																	<span className="font-body-sm text-body-sm text-secondary line-through">
																		₹{originalPrice.toLocaleString("en-IN")}
																	</span>
																)}
															</div>
														</div>
														<Link
															href={`/product/${product.slug}`}
															className="px-3.5 py-1.5 bg-primary text-on-primary font-label-sm text-xs uppercase tracking-wider rounded group-hover:bg-tertiary-fixed group-hover:text-primary transition-colors flex items-center gap-1.5 shadow-2xs"
														>
															<span>{actionLabel === "Order Online" ? "Customise" : actionLabel}</span>
															<ArrowRight className="w-3.5 h-3.5" />
														</Link>
													</div>
												</div>
											</article>
										);
									})}
								</div>
							)}

							{/* Pagination Bar */}
							{sortedProducts.length > 0 && (
								<div className="mt-space-lg flex flex-col items-center justify-center gap-4 p-4 bg-surface-container-lowest shadow-sm border border-border-vellum">
									<span className="font-body-sm text-body-sm text-secondary">
										Page {currentPage} of {totalPages} — Handcrafted with slow intentionality
									</span>
									<div className="flex items-center gap-2">
										{Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
											<button
												key={p}
												onClick={() => setCurrentPage(p)}
												className={`w-9 h-9 flex items-center justify-center font-label-sm text-xs transition-colors rounded ${
													p === currentPage
														? "bg-primary text-on-primary font-semibold"
														: "bg-surface-container-low hover:bg-tertiary-fixed text-primary border border-border-vellum"
												}`}
												type="button"
											>
												{p}
											</button>
										))}
										{currentPage < totalPages && (
											<button
												onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
												className="px-3 h-9 flex items-center justify-center bg-surface-container-low hover:bg-tertiary-fixed text-primary font-label-sm text-xs tracking-wider transition-colors gap-1 border border-border-vellum rounded"
												type="button"
											>
												Next <ArrowRight className="w-3.5 h-3.5" />
											</button>
										)}
									</div>
								</div>
							)}

							{/* Studio Guarantee Seal Badge moved from sidebar */}
							<div className="mt-8 bg-paper-tint p-5 border border-border-vellum rounded-lg text-center shadow-sm w-full">
								<div className="w-10 h-10 mx-auto rounded-full bg-tertiary-fixed flex items-center justify-center text-primary mb-3">
									<CheckCircle2 className="w-5 h-5 text-primary" />
								</div>
								<h3 className="font-label-md text-label-md tracking-wider text-primary mb-1">
									Hand-Inscribed Guarantee
								</h3>
								<p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
									Every card, tag, and keepsake plaque is individually lettered with pointed nib and archival
									pigment inks by our master scribes.
								</p>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Bespoke Custom Commission Callout Banner */}
			<section className="max-w-[1440px] mx-auto px-margin-mobile lg:px-margin w-full mt-space-xl mb-space-md">
				<div className="relative overflow-hidden bg-tertiary-fixed text-on-tertiary-fixed p-space-md lg:p-space-lg shadow-md">
					{/* Decorative background calligraphy motif outline */}
					<div className="absolute -right-16 -bottom-16 opacity-10 pointer-events-none select-none text-primary">
						<svg className="w-96 h-96" fill="currentColor" viewBox="0 0 200 200">
							<path d="M45,30 Q90,5 120,40 T170,110 Q190,160 140,180 T60,160 Q20,130 35,80 Z" />
						</svg>
					</div>
					<div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-gutter items-center">
						<div className="lg:col-span-8 space-y-space-xs">
							<span className="font-label-sm text-label-sm uppercase tracking-[0.25em] text-on-tertiary-fixed-variant">
								Private Atelier Consultation
							</span>
							<h2 className="font-headline-lg text-headline-lg text-primary tracking-tight">
								Looking for a custom scale or family heirloom?
							</h2>
							<p className="font-body-md text-body-md text-on-tertiary-fixed-variant max-w-2xl leading-relaxed">
								We collaborate intimately with couples, interior designers, and fine art collectors to curate
								bespoke monumental family trees, wedding crests, and gilded archival prose tailored to your
								exact architectural space.
							</p>
						</div>
						<div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-space-xs justify-end items-start lg:items-end">
							<button
								className="w-full sm:w-auto bg-primary hover:bg-surface-container-lowest hover:text-primary text-on-primary px-8 py-4 font-label-lg text-label-lg uppercase tracking-widest transition-all shadow-md"
								type="button"
							>
								Inquire for Custom Commission
							</button>
							<span className="font-label-sm text-label-sm uppercase text-secondary tracking-wider">
								Lead times: 2 to 3 weeks
							</span>
						</div>
					</div>
				</div>
			</section>
		</div>
	);
}
