import Image from "next/image";
import Link from "next/link";

export function HeroShowcase() {
	return (
		<section className="relative w-full overflow-hidden bg-paper-tint">
			{/* Visual Multi-pane collage mimicking the hero in inspiration */}
			<div className="grid grid-cols-2 md:grid-cols-4 gap-2 p-2">
				<div className="relative h-64 md:h-[420px] overflow-hidden group">
					<img
						className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
						alt="Close up of exquisite copperplate calligraphy"
						src="https://lh3.googleusercontent.com/aida-public/AB6AXuA45MDyXsdfxPrK5HxKbeLTSl86eMkq4hIXXdTudGblIxxbqkpFUNa22flBE3GXE4Rr3kWUCUKXv1YHGFHlvJPGUcEtAVkyPpaMcR7pKVZzFMSVApn__SS7xrDu5FZpXQV3xNTmsDM99C87H6ecw6qx_825ZKyf0IQFWzoTvgf_OGotG5y9Sl-8vVa47PfLsLctgBr8uzMQTa0rJreQbt8MEt4eFmYI35eSHFdSOXqx_HWrMI2toy8"
					/>
					<div className="absolute inset-0 bg-primary/20 group-hover:bg-primary/10 transition-colors" />
				</div>
				<div className="relative h-64 md:h-[420px] overflow-hidden group">
					<img
						className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
						alt="Custom luxury wedding invitation suite"
						src="https://lh3.googleusercontent.com/aida-public/AB6AXuArnY5tZa2PTWAedjSTixoATAYL2W6ZSQl1fp_ny7H56ScBL8iX5Y0P3vxWSgcXqEZc1srcjTevzAEmbtZO3wM5_PDoTvAxboiCOjpQcj1pPUbGryzlfQWZgq9Jyk4KRzDjdwWJ4jnn_gRRjwE-RooWn5KaL60ZbFfJuYEsAn_fca_h153DcgGoZ9smc3BFXynnCS7G42O4eKZNaIUheL6cB8JzSXnLBqXMNPdeohCEYXtEDPJJxpc"
					/>
					<div className="absolute inset-0 bg-primary/20 group-hover:bg-primary/10 transition-colors" />
				</div>
				<div className="relative h-64 md:h-[420px] overflow-hidden group">
					<img
						className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
						alt="Artisanal hand-engraved crystal perfume bottle"
						src="https://lh3.googleusercontent.com/aida-public/AB6AXuBqkNWHdohjnAfNzOVmKL5P1zYKiTIq5MJDJmKinRjbLGgAqcdM65PxuyboCw6-7_kc5YQpzU_kCeGB1Ffd9BIxKHntpvtgV90X1WSYzYGGNL2u-97lHVx5KbGF-msF1mWBXCXVeE6eP676UdQ4mXqfY3KMdCHA07T-AbcpnghcYqRjj3U9Zdg5DI6cVOvdNEHVr6uxgllbjoanW68oy9EGhZJkPKBBUn701KNkwRgqVdsaDNPrDHE"
					/>
					<div className="absolute inset-0 bg-primary/20 group-hover:bg-primary/10 transition-colors" />
				</div>
				<div className="relative h-64 md:h-[420px] overflow-hidden group">
					<img
						className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
						alt="Ornate vintage golden brass glass keepsake box"
						src="https://lh3.googleusercontent.com/aida-public/AB6AXuAXLWCc9YnLis-GOkHN-tM1WSlE4KwsYDv8DnHEpxBKWZtwwv0PqBEmyhmpLrPLFABBLnt6OB0Y1hSskv9esc_ECgdQ6OGv5Q6scwVmu2U04eiZaFfamKeUAKSlOY9YbJoyv66MQU7POqJhUdexVZFIo7BJv16f2ZJD_17Q_dJvYy5OHBL3nLb15nTEDJ_wPZWmR84oSY127HH3ljCY-l8vT8wjWuHMxAiuBVv_czsJYxZ9oZJG294"
					/>
					<div className="absolute inset-0 bg-primary/20 group-hover:bg-primary/10 transition-colors" />
				</div>
			</div>
			{/* Hero Content Overlay / Lower Banner */}
			<div className="max-w-5xl mx-auto px-margin-mobile md:px-margin pt-space-md pb-space-lg text-center flex flex-col items-center">
				<div className="inline-flex items-center gap-2 mb-4 bg-tertiary-fixed px-4 py-1.5 rounded-full">
					<span className="material-symbols-outlined text-[16px] text-on-tertiary-fixed">draw</span>
					<span className="font-label-sm text-label-sm uppercase tracking-widest text-on-tertiary-fixed">
						Artisanal Calligraphy Atelier
					</span>
				</div>
				<h1 className="font-display-hero text-headline-lg md:text-display-hero tracking-widest uppercase text-primary max-w-4xl text-center leading-tight">
					Thoughtful Script & Handcrafted Calligraphy
				</h1>
				<div className="w-16 h-0.5 bg-primary/20 my-6" />
				<p className="font-body-lg text-body-lg text-secondary max-w-3xl text-center italic font-serif">
					“The Letter Ink is a calligraphy based design studio which strives to bring back the treasure and
					love of hand rendered scripts. Give us your words and we frame them into reality.”
				</p>
				<div className="flex flex-wrap items-center justify-center gap-4 mt-8">
					<Link
						href="#shop-gallery"
						className="px-8 py-3.5 bg-tertiary-fixed text-primary font-label-lg text-label-lg uppercase tracking-widest hover:bg-surface-container-lowest transition-all duration-300 shadow-sm flex items-center gap-2"
					>
						<span>Shop Now</span>
						<span className="material-symbols-outlined text-[18px]">arrow_forward</span>
					</Link>
					<Link
						href="#services-atelier"
						className="px-8 py-3.5 bg-transparent text-primary font-label-lg text-label-lg uppercase tracking-widest hover:bg-tertiary-fixed transition-all duration-300"
					>
						Explore Commissions
					</Link>
				</div>
			</div>
		</section>
	);
}
