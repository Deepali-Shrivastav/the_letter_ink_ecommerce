"use client";

import { useState } from "react";
import Link from "next/link";

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
		activeCategory === "all"
			? products
			: products.filter((p) => p.category === activeCategory);

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
				<div className="col-span-full py-16 text-center">
					<p className="font-body-sm text-body-sm text-secondary">
						No pieces found in this category yet — check back soon.
					</p>
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
								{product.image ? (
									<img
										src={product.image}
										alt={product.name}
										className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
									/>
								) : (
									<div className="w-full h-full bg-surface-container" />
								)}
								{product.badge && (
									<span className="absolute top-3 left-3 bg-primary text-on-primary text-[10px] font-label-sm uppercase tracking-widest px-2.5 py-1">
										{product.badge}
									</span>
								)}

								{/* Customise & Order hover overlay */}
								<div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-primary/80 via-primary/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
									<span className="w-full bg-surface-container-lowest text-primary hover:bg-tertiary-fixed font-label-md text-label-md uppercase tracking-wider py-3 shadow-md transition-colors flex items-center justify-center gap-2 rounded-lg">
										<span className="material-symbols-outlined text-[18px]">brush</span>
										<span>Customise &amp; Order</span>
									</span>
								</div>
							</div>

							<div className="p-5 flex flex-col flex-grow justify-between">
								<div>
									{/* Stars */}
									<div className="flex items-center gap-1 text-amber-500 mb-1">
										{[...Array(5)].map((_, i) => (
											<span
												key={`star-${product.id}-${i}`}
												className="material-symbols-outlined text-[16px]"
												style={{ fontVariationSettings: "'FILL' 1" }}
											>
												star
											</span>
										))}
										{product.reviews > 0 && (
											<span className="font-body-sm text-[12px] text-secondary ml-1">
												({product.reviews})
											</span>
										)}
									</div>

									<h3 className="font-headline-sm text-[17px] text-primary group-hover:underline">
										{product.name}
									</h3>
									<p className="font-body-sm text-body-sm text-secondary mt-1">
										{product.description}
									</p>
								</div>

								<div className="mt-4 pt-3 flex items-center justify-between">
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
									<span className="px-3 py-1.5 bg-tertiary-fixed text-primary font-label-sm text-label-sm uppercase tracking-wider group-hover:bg-primary group-hover:text-on-primary transition-colors">
										Shop Now
									</span>
								</div>
							</div>
						</Link>
					))}
				</div>
			)}

			{/* View All Button */}
			<div className="mt-12 text-center">
				<Link
					href="/shop"
					className="inline-flex items-center gap-3 px-10 py-4 bg-primary text-on-primary font-label-lg text-label-lg uppercase tracking-widest hover:bg-tertiary-fixed hover:text-primary transition-colors"
				>
					<span>View Full Atelier Catalogue</span>
					<span className="material-symbols-outlined text-[18px]">east</span>
				</Link>
			</div>
		</>
	);
}
