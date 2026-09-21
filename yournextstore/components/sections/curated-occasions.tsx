import Link from "next/link";

export function CuratedOccasions() {
	const occasions = [
		{
			title: "Wedding Gifts & Suites",
			description: "Celebrate love with custom vows, handmade placecards, and keepsake vows.",
			icon: "favorite",
			image: "https://lh3.googleusercontent.com/aida-public/AB6AXuD5dqj8BbOJb5JF0b-9-BYJwuocmsSzWutBhaa4N4tEC3iun7ZCqP0QR2YIA-pE2EdP36chov5smrGEJkjpKQ_QqBZKLKaX76tDB2LShA1IuYQuqMIIv3K8FvJgKIsiUrht63h8HyVUgBU9tlCIr818ZV9ahUizQODewIQlM4OwkJXg5Zw9bTDEkhAsnzZxSO_wpGqEoasrGvOtoFkx1PIH2SVS2LTe_6eQyIRzS_n951QtFbc43Cc",
			tag: "Heirloom",
			linkText: "Explore Collection →",
			href: "#shop-gallery",
		},
		{
			title: "Hand Made Letters & Scrolls",
			description: "Heartfelt words penned in dip-pen scripts, sealed with custom botanicals.",
			icon: "mark_email_read",
			image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAxHBwu6IFNroq21t1CfzZdB_AEpuYdtmfOPnlTcuHPvH5K-YOfLAcbphMV8XQDD-nd8lfu7_uu5BcE5fVsukh--De2MxW5GTtA56apkbfKbvuypmUc87yGil46ULihWnY0vNmh_Tu9Gcl-v12cyXm8vpU5z4HCUNwlYNXQ2kpGaxdK4ZdLBBwyRbNPCF8G1M-rHZQyaD-u-IhJ7dC-YJ9VwHkaK1fyWqtj8-HzDtHhwnlTlJ4GVLY",
			tag: "Romantic",
			linkText: "Explore Letters →",
			href: "#shop-gallery",
		},
		{
			title: "Engraved Glassware & Keepsakes",
			description: "Fine crystal wine flutes, luxury perfume bottles, and brass Victorian glass boxes.",
			icon: "wine_bar",
			image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBtjIGC5zC1a1-Wp0fqSVdj675IbZ7P8_y0jFAdM7EQZHKdvQyIUfcIqf0HtbWjBOVC5a1zD6ywGCyZDn3m4XOnQPOb9ZCWrtuCCVklqvnNEo00F43aPyH2NIVA8_BhIBoLXG5DMJEFJoIXN5qMsot28P4pqJgw5Zp9mK9ZjvAoUu18d8jPHP6SdoVQFeN7dwuCuWvU8FZkB1XS31IfnaE9A7jsV_OIVHLboDf9AMhajPl8n8BgHdY",
			tag: "Luxury",
			linkText: "Explore Glassware →",
			href: "#shop-gallery",
		},
		{
			title: "Name Frame Royal Series",
			description: "Royal Large, Classic Small, and Royal Small personalized wooden name frames.",
			icon: "crop_original",
			image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDSWzo8jBoZwoueq44cZcss8LB_9QWQCqr9uM9elUDQ_3vFWsfstlLd4YHgJUMDhw0L1v3zofENkgVGCuwWHmKFFMLBWmkXx3GUI7186ckF-EbuaPhicuGAVCeciYb1JqrQ_zVf7UHUgwOI2rGLIJDw1B1VXKCIm2oRPDFu5BuxcAflHZ0LdDAqG_q1Es49k7tK5YQnW-3Tr6QOupL8gdWHsEx9iZUpWtHSN-2I5h4aXxN8hv8xrWY",
			tag: "Bestseller",
			linkText: "Explore Frames →",
			href: "#shop-gallery",
		},
		{
			title: "Envelope Addressing & Seals",
			description: "Curated custom ink calligraphy, vintage postage collages, and wax seal stamps.",
			icon: "mail",
			image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBGsX6h2yXr9AgVnHhyd5FzI-aouWc55scioI584arXgomMgfFYPLNAQd4IRfSdYJ9yD2zWTGH7Md2qUhHPnOPNNWb8v2jtY3IbA6aRcK3pZ8tUEOXRClSQOpvSD1RwEr3yRqu8fQcGkbxCiWfw6a_2wfbTTDOce4w6P6ks2xh3udAVNnEs9L8olmAuvBpsNJAooFEf5h1WkWQ7TxWEoywL5CVW12FoFJiaFLSF2wExo72BFXzj4Oc",
			tag: "Artisanal",
			linkText: "Explore Envelopes →",
			href: "#shop-gallery",
		},
		{
			title: "Workshops & Studio Sessions",
			description: "Immersive hands-on masterclasses teaching pointed pen calligraphy & brush lettering.",
			icon: "draw",
			image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBzUY4yo7tpJPfUvdWYiyaBKGrmhap7jR22LKRW_ztQ7mGViiY14FIr6BAxjIls2vigffJhXUlHIhtMmaapoFmybrN5ui6Q6TDrumZqt8znZVxGZFittBfl6vw3U51_Kve0AUkCFY-8nYVG4GcZZS7hlKRxsj-fX_fnso5bRwcrDZAiRq7pfH8B4wLbapMOe-3p5JEMwejRM9WejjmO5kEcVOVGaSxKOOyg5HKuh1qXrTqrXzegMt0",
			tag: "Learn",
			linkText: "View Workshops →",
			href: "#workshops-section",
		},
	];

	return (
		<section className="w-full py-space-xl bg-background">
			<div className="max-w-7xl mx-auto px-margin-mobile md:px-margin">
				<div className="text-center mb-space-md">
					<span className="font-label-sm text-label-sm uppercase tracking-widest text-secondary">
						Explore Our Favourites
					</span>
					<div className="flex items-center justify-center gap-4 mt-2">
						<div className="w-12 h-px bg-outline-variant" />
						<h2 className="font-headline-lg text-headline-lg text-primary tracking-wide">
							Gifts For Every Occasion
						</h2>
						<div className="w-12 h-px bg-outline-variant" />
					</div>
				</div>
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
					{occasions.map((occasion, i) => (
						<Link
							key={i}
							href={occasion.href}
							className="group relative bg-surface-container-lowest rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col"
						>
							<div className="relative h-64 overflow-hidden">
								<img
									src={occasion.image}
									alt={occasion.title}
									className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
								/>
							</div>
							<div className="p-6 text-center bg-paper-tint flex-grow flex flex-col justify-between">
								<div>
									<div className="w-8 h-8 mx-auto mb-2 rounded-full bg-tertiary-fixed flex items-center justify-center text-primary">
										<span className="material-symbols-outlined text-[18px]">{occasion.icon}</span>
									</div>
									<h3 className="font-headline-sm text-headline-sm text-primary mb-1">{occasion.title}</h3>
									<p className="font-body-sm text-body-sm text-secondary">{occasion.description}</p>
								</div>
								<span className="mt-4 font-label-sm text-label-sm uppercase tracking-widest text-primary font-bold group-hover:underline">
									{occasion.linkText}
								</span>
							</div>
						</Link>
					))}
				</div>
			</div>
		</section>
	);
}
