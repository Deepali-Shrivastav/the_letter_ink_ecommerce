"use client";

import { useState } from "react";

export function GalleryGrid() {
	const [activeCategory, setActiveCategory] = useState("all");

	const products = [
		{
			id: 1,
			category: "frames",
			name: "Name Frame Royal Large",
			description: "Hand-rendered royal script on cotton stock with glass frame.",
			price: "₹3,800",
			originalPrice: null,
			reviews: 48,
			badge: "Best Seller",
			image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDiUg7eEJNeRKbnCf9wmR4dPWUiIwlgF-QaSHTn_QqrQt-QoMC_ZWWJcmw2NNm1yCPZUBXbIu9xQDHBFDom2NUoyW5DqNSuWjGKEkiRkOnp-etnvtGzD3uF43pGWfD63gtnYTDByxMkpLhZGVqdlli_7gqp8dqV6vwsFIIMYg4kCNr6Yvcxq4i6XCYUgIsE7F4dpg157MdJYWtWBwaL95uvzKRkpLe4vVdxGSuFBhHDrdDl3VMHN0E",
		},
		{
			id: 2,
			category: "frames",
			name: "Name Frame Classic Small",
			description: "Delicate desk keepsake frame with custom personal script.",
			price: "₹2,499",
			originalPrice: null,
			reviews: 31,
			badge: null,
			image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDvyjserhW_6kmrSrIl2PVOjbOK0iTosS7lF5LkNNoUL2-TArpCvTFyGSlb3Hpe1_mqxAd5W0PoQ3q3iFSvKELhLRNhs4Qc2I-cgzNBx1q01jruKYSS0-X533-vL5B_KdHFGRuM3iW3LQYViryGs7S9whKQAVl28XUzG8p4Ir3mDqQn76KMlo-BqXJ8ad5jDhk1SfMFeoGPop61f94ysBwHRe8wj3lOspJFChihZdZdffQ9OffBZeo",
		},
		{
			id: 3,
			category: "frames",
			name: "Name Frame Royal Small",
			description: "Hand-lettered with gold flourishes, ideal for intimate gifts.",
			price: "₹2,899",
			originalPrice: null,
			reviews: 26,
			badge: null,
			image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAB_imOQSM2eSB6dPQSbJhgyZgUEIQiiTv4ZkMOvdHXl9DXdpigXGq-RzW1qWhtquHhMjyZvMxKgVkvbrO1nuGH9k0bCLS2y0qlje1Zd-BAJgvQ28QO_ZwCXPFhWo0XNx-mimpQG4ydtoLnFBbNuI_heAijM9UNXwrCyN7Nw3PLLuURVTLXf1akNL44Y5W3YcCi-KTdV__gr_GQ3Iuu7klecG1umRcdp7e5WT4z6AGpYVuSXM-SQ2c",
		},
		{
			id: 4,
			category: "letters",
			name: "Personalised Handwritten Scroll",
			description: "150-word intimate bespoke prose on handmade parchment.",
			price: "₹3,500",
			originalPrice: "₹4,750",
			reviews: 54,
			badge: "Patron Pick",
			image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCGV6kpiZgErK-Od6c5U8664cAvO7ZPFawo7RhRreizGZum0awrVmTYTRwK-9cVxn_JcBFCq7O8CR4eLMZW6KclUKS47YMT78zvk3ubKeeq07nRULbM6pS-Ty-Q8BOb5ZagiIvrlAGLVSRh3X6RiuBk_FF5Aje76byB7Se_RR0uqtD3NG9X0AWPxHGYUGaxemMWW593s8Wis-nwrm5QabqeoSxn1-siCa5RsOKZObyko78B0BmI94w",
		},
		{
			id: 5,
			category: "letters",
			name: "Enveloped Letter & Wax Seal",
			description: "Romantic stationery letter sealed with custom metallic wax seal.",
			price: "₹3,200",
			originalPrice: null,
			reviews: 29,
			badge: null,
			image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAD7U4Cp8GGTDNTE3cOSHGO2IOrBH_Dn4id9MuIXcap-QoDWPzNmFfDXgJ3Zp00OfS-ZTI4AkG2OkF6I2Lil4RzdDiCphijEBJkh8T1-cSCrBzoYTV6pB5VSEcUQemS4ncKRGrV8BM7iKF8GA2OeHabsZUgDq49fKUDU58LyK5MtxM5730NuMx_MPkxdk_ZjZFT1gZFOZPhTngr636RuKt7c0_QOTuaS4g6g2ouK4zlWi-RbaDp77w",
		},
		{
			id: 6,
			category: "engraving",
			name: "Engraved French Glass Box",
			description: "Victorian brass & glass keepsake hand-engraved with botanicals.",
			price: "₹3,400",
			originalPrice: "₹4,250",
			reviews: 18,
			badge: null,
			image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAqeaXDTRuyQbJ2w25-OUQIULXoCWGfN_unzuRy6jTb-hvQbE2YVCh0tSDKl2Yl6-A9d8S6LUSNXlT-4eCYAu1vWHoQNv5LPocjEih_cgIMDmlaswIBuvAiPcVxBw3TGjc7lP-20Fiv1x7a_WbmvVYxP3_M5NBbzOXNGtSQ_MuIfy6F7Uxi21MbUt2D_yW4hOHktMYWzNRnBlhhInX2GOMKSOytSv_nC08vBdOj3CuZFwpkrWZkfzw",
		},
		{
			id: 7,
			category: "engraving",
			name: "Personalised Flutes Set (Pair)",
			description: "Initial + Leaf Pattern + Full Names hand-engraved on crystal.",
			price: "₹3,640",
			originalPrice: "₹4,550",
			reviews: 38,
			badge: null,
			image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBura3tmzqFhuTJgCVoS0lvp1a9GyYtNnmdVrB16WZr5dqISEzaUiOC4YLyclrqoVKuVePm0Qm45uC3T-2mtZfsJEcBmort1L_puA1Ql1HC2sIQVUIr1Me9XM3Tzl08kV-OpR80jKNYgWHAUGZQF3fWz43BOxHT2CFZhEYdAOELWOEt3cfnG1uuptmx8_TQVfSp8jYEAyrZysac7sBNGosemKm1GRQubVCX69DYWzZZBq0YcHOCjs8",
		},
		{
			id: 8,
			category: "wedding",
			name: "Bespoke Wedding Vow Suite",
			description: "Archival deckle-edge vows booklet with gold leaf initials.",
			price: "₹4,200",
			originalPrice: null,
			reviews: 42,
			badge: null,
			image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCvFaQxJJRtzjzsb1eq-syfMvE7arw6BBS6AK_wTpXmt0gE7zwieFlrpWdMJQqQB2FkiDHfPvufAK4nsotq6-uFn7to_KAe1O4m4GcHfbnpmCqcm7ynS56MQEirb0kvYl-ZX9ZHsihZo30dTDpOrVQNRAepK3o6fUXG9YG_G8bz43KO50zEezdGZTISHz4s9VWs7XwI7rVy83shP922mlExORcyVNPHkHGE97cuyZE9kJp8L5EAX9c",
		},
	];

	const filteredProducts =
		activeCategory === "all" ? products : products.filter((p) => p.category === activeCategory);

	const categories = [
		{ id: "all", label: "All Pieces" },
		{ id: "frames", label: "Name Frames" },
		{ id: "letters", label: "Handwritten Letters" },
		{ id: "engraving", label: "Engraving" },
		{ id: "wedding", label: "Wedding Suites" },
	];

	return (
		<section className="w-full py-space-xl bg-surface-container-lowest" id="shop-gallery">
			<div className="max-w-7xl mx-auto px-margin-mobile md:px-margin">
				{/* Header */}
				<div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-4">
					<div>
						<span className="font-label-sm text-label-sm uppercase tracking-widest text-secondary">
							Explore Our Favourites
						</span>
						<h2 className="font-headline-lg text-headline-lg text-primary tracking-wide mt-1">
							Handcrafted Pieces Loved by Our Patrons
						</h2>
					</div>
					<p className="font-body-sm text-body-sm text-secondary max-w-md mt-2 md:mt-0">
						Every piece is meticulously rendered by hand in our studio. Personalized with bespoke words, archival
						inks, and heirloom framing.
					</p>
				</div>
				{/* Filter Tabs */}
				<div className="flex flex-wrap items-center gap-2 mb-10">
					{categories.map((cat) => (
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
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
					{filteredProducts.map((product) => (
						<div
							key={product.id}
							className="group flex flex-col bg-paper-tint rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all"
						>
							<div className="relative aspect-[4/5] overflow-hidden bg-surface-container">
								<img
									src={product.image}
									alt={product.name}
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
									<div className="flex items-center gap-1 text-amber-500 mb-1">
										{[...Array(5)].map((_, i) => (
											<span
												key={i}
												className="material-symbols-outlined text-[16px]"
												style={{ fontVariationSettings: "'FILL' 1" }}
											>
												star
											</span>
										))}
										<span className="font-body-sm text-[12px] text-secondary ml-1">({product.reviews})</span>
									</div>
									<h3 className="font-headline-sm text-[17px] text-primary group-hover:underline">
										{product.name}
									</h3>
									<p className="font-body-sm text-body-sm text-secondary mt-1">{product.description}</p>
								</div>
								<div className="mt-4 pt-3 flex items-center justify-between">
									<div>
										<span className="font-label-lg text-label-lg font-bold text-primary">{product.price}</span>
										{product.originalPrice && (
											<span className="text-secondary text-[12px] line-through ml-1.5">
												{product.originalPrice}
											</span>
										)}
									</div>
									<button
										className="px-3 py-1.5 bg-tertiary-fixed text-primary font-label-sm text-label-sm uppercase tracking-wider hover:bg-primary hover:text-on-primary transition-colors"
										type="button"
									>
										Shop now
									</button>
								</div>
							</div>
						</div>
					))}
				</div>
				{/* View All Button */}
				<div className="mt-12 text-center">
					<a
						href="#shop-gallery"
						className="inline-flex items-center gap-3 px-10 py-4 bg-primary text-on-primary font-label-lg text-label-lg uppercase tracking-widest hover:bg-tertiary-fixed hover:text-primary transition-colors"
					>
						<span>View Full Atelier Catalogue</span>
						<span className="material-symbols-outlined text-[18px]">east</span>
					</a>
				</div>
			</div>
		</section>
	);
}
