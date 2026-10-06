"use client";

import { ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export type GalleryProduct = {
	id: string | number;
	category: string;
	name: string;
	description: string;
	price: string | null;
	originalPrice: string | null;
	reviews: number;
	badge: string | null;
	image: string | null;
	slug: string;
};

const CATEGORIES = [
	{ id: "all", label: "All Pieces" },
	{ id: "frames", label: "Name Frames" },
	{ id: "letters", label: "Handwritten Letters" },
	{ id: "engraving", label: "Engraving" },
	{ id: "wedding", label: "Wedding Suites" },
];

export function GalleryGridClient({ products }: { products: GalleryProduct[] }) {
	const [activeCategory, setActiveCategory] = useState("all");

	const filteredProducts =
		activeCategory === "all" ? products : products.filter((p) => p.category === activeCategory);

	return (
		<>
			{/* Filter Tabs */}
			<div className="flex flex-wrap items-center gap-2 mb-10">
				{CATEGORIES.map((cat) => (
					<button
						key={cat.id}
						onClick={() => setActiveCategory(cat.id)}
						className={`px-4 py-1.5 rounded-full font-label-sm text-label-sm uppercase tracking-widest transition-colors ${
							activeCategory === cat.id
								? "bg-primary text-on-primary"
								: "bg-tertiary-fixed text-primary hover:bg-primary hover:text-on-primary"
						}`}
						type="button"
					>
						{cat.label}
					</button>
				))}
			</div>

			{/* Products Grid */}
			{filteredProducts.length === 0 ? (
				<div className="col-span-full py-16 px-6 text-center bg-surface-container-lowest border border-border-vellum rounded-xl max-w-xl mx-auto shadow-2xs my-4">
					<p className="font-headline-sm text-lg text-primary mb-2 font-serif">
						No Pieces in This Category Yet
					</p>
					<p className="font-body-sm text-on-surface-variant max-w-md mx-auto mb-6">
						We are hand-crafting new additions for this collection. You can explore all available creations or
						inquire for a custom calligraphy commission.
					</p>
					<div className="flex flex-wrap items-center justify-center gap-3">
						<button
							type="button"
							onClick={() => setActiveCategory("all")}
							className="px-5 py-2.5 bg-primary text-on-primary font-label-sm text-xs uppercase tracking-wider rounded-lg hover:bg-primary/90 transition-colors cursor-pointer"
						>
							View All Pieces
						</button>
						<Link
							href="/contact"
							className="px-5 py-2.5 bg-tertiary-fixed text-primary hover:bg-surface-container-low font-label-sm text-xs uppercase tracking-wider rounded-lg border border-border-vellum transition-colors"
						>
							Commission Custom Work →
						</Link>
					</div>
				</div>
			) : (
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
					{filteredProducts.map((product) => (
						<Link
							key={product.id}
							href={`/product/${product.slug}`}
							className="group flex flex-col bg-paper-tint rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all"
						>
							<div className="relative aspect-[4/5] overflow-hidden bg-surface-container">
								<img
									src={
										product.image ||
										"https://images.unsplash.com/photo-1586075010923-2dd4570fb338?auto=format&fit=crop&w=600&q=80"
									}
									alt={product.name}
									onError={(e) => {
										(e.target as HTMLImageElement).src =
											"https://images.unsplash.com/photo-1586075010923-2dd4570fb338?auto=format&fit=crop&w=600&q=80";
									}}
									className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
								/>
								{product.badge && (
									<span className="absolute top-3 left-3 bg-primary text-on-primary text-[10px] font-label-sm uppercase tracking-widest px-2.5 py-1">
										{product.badge}
									</span>
								)}
							</div>

							<div className="p-5 flex flex-col flex-grow justify-between">
								<div>
									<h3 className="font-headline-sm text-[17px] text-primary group-hover:underline">
										{product.name}
									</h3>
									<p className="font-body-sm text-body-sm text-secondary mt-1">{product.description}</p>
								</div>

								<div className="mt-4 pt-3 flex items-center justify-between border-t border-border-vellum/50">
									<div>
										{product.price && (
											<span className="font-label-lg text-label-lg font-bold text-primary">
												{product.price}
											</span>
										)}
										{product.originalPrice && (
											<span className="text-secondary text-[12px] line-through ml-1.5">
												{product.originalPrice}
											</span>
										)}
									</div>
									<span className="px-4 py-2 bg-primary text-on-primary font-label-sm text-xs uppercase tracking-wider rounded shadow-xs group-hover:bg-tertiary-fixed group-hover:text-primary transition-colors flex items-center gap-1.5">
										<span>Customise</span>
										<ArrowRight className="w-3.5 h-3.5" />
									</span>
								</div>
							</div>
						</Link>
					))}
				</div>
			)}

			{/* View All Button */}
			<div className="mt-16 flex justify-center">
				<Link
					href="/shop"
					className="inline-flex items-center gap-3 px-10 py-4 bg-primary text-on-primary font-label-lg text-label-lg tracking-wider shadow-md hover:shadow-lg hover:bg-tertiary-fixed hover:text-primary transition-all"
				>
					<span>View Full Atelier Catalogue</span>
					<ArrowRight className="w-4 h-4" />
				</Link>
			</div>
		</>
	);
}
