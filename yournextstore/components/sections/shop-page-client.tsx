"use client";

import Link from "next/link";
import { useState, useMemo } from "react";
import { Slider } from "@/components/ui/slider";

interface ShopPageClientProps {
  initialProducts?: any[];
}

export function ShopPageClient({ initialProducts = [] }: ShopPageClientProps) {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([100, 10000]);
  const [sortBy, setSortBy] = useState<string>("featured");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [wishlist, setWishlist] = useState<Record<string, boolean>>({});

  const itemsPerPage = 9;

  // Derive unique categories from products
  const availableCategories = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const p of initialProducts) {
      const cat = p.metadata?.category_name || p.category?.name || "General Artifacts";
      counts[cat] = (counts[cat] || 0) + 1;
    }
    return Object.entries(counts).map(([name, count]) => ({ name, count }));
  }, [initialProducts]);

  const toggleCategory = (catName: string) => {
    setCurrentPage(1);
    setSelectedCategories((prev) =>
      prev.includes(catName) ? prev.filter((c) => c !== catName) : [...prev, catName]
    );
  };

  const toggleWishlist = (id: string) => {
    setWishlist((prev) => ({ ...prev, [id]: !prev[id] }));
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
      const price = Number(product.variants?.[0]?.price) || 0;
      const [minPrice, maxPrice] = priceRange;

      if (price < minPrice || (maxPrice < 10000 && price > maxPrice)) {
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
        return list.sort((a, b) => (Number(a.variants?.[0]?.price) || 0) - (Number(b.variants?.[0]?.price) || 0));
      case "price-desc":
        return list.sort((a, b) => (Number(b.variants?.[0]?.price) || 0) - (Number(a.variants?.[0]?.price) || 0));
      case "bestsellers":
        return list.sort((a, b) => {
          const aBest = a.badge?.toLowerCase().includes("bestseller") || a.metadata?.badge?.toLowerCase().includes("bestseller") ? 1 : 0;
          const bBest = b.badge?.toLowerCase().includes("bestseller") || b.metadata?.badge?.toLowerCase().includes("bestseller") ? 1 : 0;
          return bBest - aBest;
        });
      case "newest":
        return list.reverse();
      case "featured":
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
            <nav aria-label="Breadcrumbs" className="flex items-center gap-space-xs text-on-surface-variant font-label-sm text-label-sm uppercase tracking-widest">
              <Link className="hover:text-primary transition-colors" href="/">Home</Link>
              <span className="text-outline">/</span>
              <span className="text-primary font-semibold">Shop</span>
            </nav>
            <span className="font-label-sm text-label-sm uppercase tracking-[0.28em] text-secondary">
              Dispatching from Maharashtra Atelier • Global Transit
            </span>
          </div>

          {/* Main Headline Block */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter items-end pt-space-xs pb-space-xs">
            <div className="lg:col-span-8 space-y-space-xs">
              <p className="font-label-md text-label-md uppercase tracking-[0.24em] text-on-secondary-fixed-variant">
                The Artisanal Collection
              </p>
              <h1 className="font-headline-lg text-headline-lg text-primary tracking-tight leading-tight">
                Handcrafted Stationery &amp; Inscribed Keepsakes
              </h1>
            </div>
            <div className="lg:col-span-4 lg:pl-space-sm">
              <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                Each piece is hand-lettered on handmade deckle-edge papers, etched on crystal glass, or framed in brass shadowboxes using archival inks and fine dip-pens.
              </p>
            </div>
          </div>

          {/* Atmospheric Atelier Stat Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-gutter pt-space-md mt-space-sm bg-surface-container-low px-space-md py-space-sm">
            <div className="flex flex-col">
              <span className="font-display-hero text-[28px] leading-8 text-primary font-serif">100%</span>
              <span className="font-label-sm text-label-sm uppercase text-secondary tracking-wider mt-1">Dip Pen Scripted</span>
            </div>
            <div className="flex flex-col">
              <span className="font-display-hero text-[28px] leading-8 text-primary font-serif">300 GSM</span>
              <span className="font-label-sm text-label-sm uppercase text-secondary tracking-wider mt-1">Cotton Rag Stock</span>
            </div>
            <div className="flex flex-col">
              <span className="font-display-hero text-[28px] leading-8 text-primary font-serif">24 KT</span>
              <span className="font-label-sm text-label-sm uppercase text-secondary tracking-wider mt-1">Pure Gold Leaf Flakes</span>
            </div>
            <div className="flex flex-col">
              <span className="font-display-hero text-[28px] leading-8 text-primary font-serif">7–10 Days</span>
              <span className="font-label-sm text-label-sm uppercase text-secondary tracking-wider mt-1">Atelier Curing &amp; Frame</span>
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
              <span className="material-symbols-outlined text-primary text-[20px]">auto_awesome</span>
              <p className="font-label-md text-label-md text-primary tracking-wide">
                Showing <span className="font-bold">{sortedProducts.length}</span> of{" "}
                <span className="font-bold">{initialProducts.length}</span> Heirloom Artifacts
              </p>
            </div>
            <div className="flex items-center gap-3">
              <label className="font-label-sm text-label-sm uppercase tracking-wider text-secondary" htmlFor="shop-sort">
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
                <span className="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-secondary text-[18px]">
                  expand_more
                </span>
              </div>
            </div>
          </div>

          {/* Two-Column Master Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
            {/* LEFT SIDEBAR: Filters */}
            <aside className="lg:col-span-3 space-y-space-md">
              <div className="bg-surface-container-lowest rounded-lg border border-border-vellum shadow-sm overflow-hidden text-primary font-body-sm">
                <div className="px-6 py-5 border-b border-border-vellum flex items-center justify-between bg-surface-container-lowest">
                  <h2 className="font-headline-sm text-headline-sm text-primary font-normal tracking-wide">Filter</h2>
                  <button
                    type="button"
                    onClick={resetFilters}
                    className="font-label-sm text-[11px] uppercase tracking-widest text-secondary hover:text-primary transition-colors"
                  >
                    Reset
                  </button>
                </div>

                {/* Price Histogram & Range */}
                <div className="p-6 border-b border-border-vellum">
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-label-md text-label-md text-primary font-medium tracking-wide">Price</span>
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
                        ₹ {maxVal.toLocaleString("en-IN")}{maxVal >= 10000 ? "+" : ""}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Facets Accordions */}
                <div className="divide-y divide-border-vellum">
                  <details className="group" open>
                    <summary className="flex items-center justify-between px-6 py-4 cursor-pointer list-none hover:bg-surface-container-low transition-colors">
                      <span className="font-label-md text-label-md text-primary font-medium tracking-wide">Categories</span>
                      <span className="material-symbols-outlined text-[18px] text-secondary group-open:!hidden">add</span>
                      <span className="material-symbols-outlined text-[18px] text-secondary !hidden group-open:!inline-block">remove</span>
                    </summary>
                    <div className="px-6 pb-4 pt-1 space-y-2.5">
                      {availableCategories.map((cat) => {
                        const isChecked = selectedCategories.includes(cat.name);
                        return (
                          <label key={cat.name} className="flex items-center justify-between cursor-pointer">
                            <span className="flex items-center gap-2.5">
                              <input
                                type="checkbox"
                                checked={isChecked}
                                onChange={() => toggleCategory(cat.name)}
                                className="w-4 h-4 rounded-none accent-primary cursor-pointer"
                              />
                              <span className="text-body-sm text-on-surface hover:text-primary">{cat.name}</span>
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
                      <span className="font-label-md text-label-md text-primary font-medium tracking-wide">Script &amp; Technique</span>
                      <span className="material-symbols-outlined text-[18px] text-secondary group-open:!hidden">add</span>
                      <span className="material-symbols-outlined text-[18px] text-secondary !hidden group-open:!inline-block">remove</span>
                    </summary>
                    <div className="px-6 pb-4 pt-1 space-y-2.5">
                      <label className="flex items-center gap-2.5 cursor-pointer">
                        <input type="checkbox" defaultChecked className="w-4 h-4 rounded-none accent-primary cursor-pointer" />
                        <span className="text-body-sm text-on-surface hover:text-primary">Copperplate Calligraphy</span>
                      </label>
                      <label className="flex items-center gap-2.5 cursor-pointer">
                        <input type="checkbox" defaultChecked className="w-4 h-4 rounded-none accent-primary cursor-pointer" />
                        <span className="text-body-sm text-on-surface hover:text-primary">Spencerian Script</span>
                      </label>
                      <label className="flex items-center gap-2.5 cursor-pointer">
                        <input type="checkbox" defaultChecked className="w-4 h-4 rounded-none accent-primary cursor-pointer" />
                        <span className="text-body-sm text-on-surface hover:text-primary">Modern Flourished Roman</span>
                      </label>
                      <label className="flex items-center gap-2.5 cursor-pointer">
                        <input type="checkbox" defaultChecked className="w-4 h-4 rounded-none accent-primary cursor-pointer" />
                        <span className="text-body-sm text-on-surface hover:text-primary">Hand-Engraved Crystal</span>
                      </label>
                    </div>
                  </details>

                  <details className="group">
                    <summary className="flex items-center justify-between px-6 py-4 cursor-pointer list-none hover:bg-surface-container-low transition-colors">
                      <span className="font-label-md text-label-md text-primary font-medium tracking-wide">Material &amp; Finish</span>
                      <span className="material-symbols-outlined text-[18px] text-secondary group-open:!hidden">add</span>
                      <span className="material-symbols-outlined text-[18px] text-secondary !hidden group-open:!inline-block">remove</span>
                    </summary>
                    <div className="px-6 pb-4 pt-1 space-y-2.5">
                      <label className="flex items-center gap-2.5 cursor-pointer">
                        <input type="checkbox" className="w-4 h-4 rounded-none accent-primary cursor-pointer" />
                        <span className="text-body-sm text-on-surface hover:text-primary">24k Pure Gold Leaf</span>
                      </label>
                      <label className="flex items-center gap-2.5 cursor-pointer">
                        <input type="checkbox" className="w-4 h-4 rounded-none accent-primary cursor-pointer" />
                        <span className="text-body-sm text-on-surface hover:text-primary">300 GSM Deckle Rag</span>
                      </label>
                      <label className="flex items-center gap-2.5 cursor-pointer">
                        <input type="checkbox" className="w-4 h-4 rounded-none accent-primary cursor-pointer" />
                        <span className="text-body-sm text-on-surface hover:text-primary">Victorian Brass &amp; Glass</span>
                      </label>
                      <label className="flex items-center gap-2.5 cursor-pointer">
                        <input type="checkbox" className="w-4 h-4 rounded-none accent-primary cursor-pointer" />
                        <span className="text-body-sm text-on-surface hover:text-primary">Hand-Poured Flexible Wax</span>
                      </label>
                    </div>
                  </details>
                </div>
              </div>

              {/* Studio Guarantee Seal Badge */}
              <div className="bg-paper-tint p-5 border border-border-vellum rounded-lg text-center shadow-sm">
                <div className="w-10 h-10 mx-auto rounded-full bg-tertiary-fixed flex items-center justify-center text-primary mb-3">
                  <span className="material-symbols-outlined text-[20px]">verified</span>
                </div>
                <h4 className="font-label-md text-label-md uppercase tracking-wider text-primary mb-1">
                  Hand-Inscribed Guarantee
                </h4>
                <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                  Every card, tag, and keepsake plaque is individually lettered with pointed nib and archival pigment inks by our master scribes.
                </p>
              </div>
            </aside>

            {/* RIGHT MAIN AREA: Dynamic Product Grid & Pagination */}
            <div className="lg:col-span-9">
              {displayedProducts.length === 0 ? (
                <div className="col-span-full py-16 px-6 text-center bg-surface-container-lowest border border-border-vellum rounded-lg">
                  <span className="material-symbols-outlined text-4xl text-secondary mb-3">inventory_2</span>
                  <h3 className="font-headline-sm text-lg text-primary mb-2">No Heirloom Artifacts Found</h3>
                  <p className="font-body-sm text-on-surface-variant max-w-md mx-auto mb-6">
                    We couldn't find any artisanal pieces matching your current filters. Try widening your price range or resetting selected categories.
                  </p>
                  <button
                    type="button"
                    onClick={resetFilters}
                    className="inline-flex items-center gap-2 bg-tertiary-fixed hover:bg-primary hover:text-on-primary text-primary font-label-md text-sm uppercase px-6 py-2.5 rounded-full transition-colors shadow-sm"
                  >
                    <span className="material-symbols-outlined text-sm">restart_alt</span>
                    Reset All Filters
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8">
                  {displayedProducts.map((product) => {
                    const price = Number(product.variants?.[0]?.price) || 0;
                    const badge = product.badge || product.metadata?.badge;
                    const categoryLabel =
                      product.metadata?.subtitle ||
                      product.category?.name ||
                      product.metadata?.category_name ||
                      "Atelier Heirloom";
                    const rating = Number(product.metadata?.rating) || 4.9;
                    const reviewCount = Number(product.metadata?.review_count) || 42;
                    const actionLabel = product.metadata?.action_label || "Order Online";
                    const isWishlisted = !!wishlist[product.id];
                    const imageSrc =
                      product.images?.[0] ||
                      product.thumbnail ||
                      "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&q=80&w=600";

                    return (
                      <article
                        key={product.id}
                        className="bg-surface-container-lowest p-5 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow group border border-border-vellum"
                      >
                        <div>
                          <div className="relative w-full aspect-square overflow-hidden mb-4 bg-surface-container-low">
                            <Link href={`/product/${product.slug}`} className="block w-full h-full">
                              <img
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                alt={product.name}
                                src={imageSrc}
                              />
                            </Link>
                            {badge && (
                              <div className="absolute top-2.5 left-2.5 bg-primary text-on-primary px-2.5 py-1 font-label-sm text-[10px] uppercase tracking-wider pointer-events-none">
                                {badge}
                              </div>
                            )}
                            <button
                              aria-label="Add to wishlist"
                              onClick={() => toggleWishlist(product.id)}
                              className="absolute top-2.5 right-2.5 w-7 h-7 bg-surface-container-lowest/90 hover:bg-surface-container-lowest rounded-full flex items-center justify-center text-secondary hover:text-primary transition-colors shadow-sm"
                              type="button"
                            >
                              <span
                                className="material-symbols-outlined text-[16px]"
                                style={isWishlisted ? { fontVariationSettings: "'FILL' 1", color: "#c25e4a" } : undefined}
                              >
                                favorite
                              </span>
                            </button>
                          </div>

                          <div className="space-y-1.5">
                            <div className="flex items-center justify-between">
                              <span className="font-label-sm text-[10px] uppercase tracking-widest text-secondary block truncate max-w-[150px]">
                                {categoryLabel}
                              </span>
                              <div className="flex items-center gap-1 text-primary">
                                <span
                                  className="material-symbols-outlined text-[14px]"
                                  style={{ fontVariationSettings: "'FILL' 1" }}
                                >
                                  star
                                </span>
                                <span className="font-label-sm text-[11px] font-medium">{rating.toFixed(1)}</span>
                                <span className="text-secondary text-[10px]">({reviewCount})</span>
                              </div>
                            </div>

                            <Link href={`/product/${product.slug}`}>
                              <h3 className="font-headline-sm text-headline-sm text-primary group-hover:text-tertiary-fixed-variant transition-colors line-clamp-1">
                                {product.name}
                              </h3>
                            </Link>

                            <p className="font-body-sm text-body-sm text-on-surface-variant line-clamp-2">
                              {product.summary || product.content || ""}
                            </p>
                          </div>
                        </div>

                        <div className="pt-5 mt-4 flex items-center justify-between gap-2 border-t border-border-vellum/50">
                          <div className="flex flex-col">
                            <span className="font-label-sm text-[10px] uppercase text-secondary">Price</span>
                            <span className="font-headline-md text-headline-md text-primary font-normal">
                              ₹{price.toLocaleString("en-IN")}
                            </span>
                          </div>
                          <Link
                            href={`/product/${product.slug}`}
                            className="bg-tertiary-fixed hover:bg-primary hover:text-on-primary text-primary font-label-md text-label-md uppercase px-4 py-2.5 rounded-full transition-colors shrink-0 shadow-sm text-center"
                          >
                            {actionLabel}
                          </Link>
                        </div>
                      </article>
                    );
                  })}
                </div>
              )}

              {/* Pagination Bar */}
              {sortedProducts.length > 0 && (
                <div className="mt-space-lg flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-surface-container-lowest shadow-sm border border-border-vellum">
                  <span className="font-body-sm text-body-sm text-secondary">
                    Page {currentPage} of {totalPages} — Handcrafted with slow intentionality
                  </span>
                  <div className="flex items-center gap-2">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                      <button
                        key={p}
                        onClick={() => setCurrentPage(p)}
                        className={`w-9 h-9 flex items-center justify-center font-label-sm text-xs transition-colors ${
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
                        className="px-3 h-9 flex items-center justify-center bg-surface-container-low hover:bg-tertiary-fixed text-primary font-label-sm text-xs uppercase tracking-wider transition-colors gap-1 border border-border-vellum"
                        type="button"
                      >
                        Next <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* 3 Trust Pillars Studio Assurance Banner */}
          <div className="mt-space-xl pt-space-lg border-t border-border-vellum">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
              <div className="bg-surface-container-lowest p-space-md flex flex-col items-center text-center shadow-sm border border-border-vellum">
                <div className="w-12 h-12 rounded-full bg-tertiary-fixed text-primary flex items-center justify-center mb-space-xs">
                  <span className="material-symbols-outlined text-[24px]">draw</span>
                </div>
                <h4 className="font-label-lg text-label-lg uppercase tracking-widest text-primary mb-2">100% Hand-Rendered</h4>
                <p className="font-body-sm text-body-sm text-on-surface-variant max-w-xs">
                  Zero mechanized printing. Every single letterform is carefully penned using genuine dip-pens and custom mixed archival inks.
                </p>
              </div>
              <div className="bg-surface-container-lowest p-space-md flex flex-col items-center text-center shadow-sm border border-border-vellum">
                <div className="w-12 h-12 rounded-full bg-tertiary-fixed text-primary flex items-center justify-center mb-space-xs">
                  <span className="material-symbols-outlined text-[24px]">workspace_premium</span>
                </div>
                <h4 className="font-label-lg text-label-lg uppercase tracking-widest text-primary mb-2">Artisanal Wax Packaging</h4>
                <p className="font-body-sm text-body-sm text-on-surface-variant max-w-xs">
                  Each commission is housed in our signature cream-bound presentation packaging, tied with hand-ripped silk and stamped with hot wax.
                </p>
              </div>
              <div className="bg-surface-container-lowest p-space-md flex flex-col items-center text-center shadow-sm border border-border-vellum">
                <div className="w-12 h-12 rounded-full bg-tertiary-fixed text-primary flex items-center justify-center mb-space-xs">
                  <span className="material-symbols-outlined text-[24px]">local_shipping</span>
                </div>
                <h4 className="font-label-lg text-label-lg uppercase tracking-widest text-primary mb-2">Secure Insured Courier</h4>
                <p className="font-body-sm text-body-sm text-on-surface-variant max-w-xs">
                  Reinforced triple-cushioned wooden shadowbox crating with real-time dispatch tracking across all India pincodes and worldwide.
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
                We collaborate intimately with couples, interior designers, and fine art collectors to curate bespoke monumental family trees, wedding crests, and gilded archival prose tailored to your exact architectural space.
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
