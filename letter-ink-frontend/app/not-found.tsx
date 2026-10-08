import { ArrowRight, Compass, Feather, Gift, Home, Package, ShoppingBag } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
	title: "Page Not Found — The Letter Ink",
	description:
		"This page does not exist or has been archived. Explore handcrafted calligraphy, bespoke vow suites, and heirloom framing at The Letter Ink.",
	robots: { index: false, follow: true },
};

export default function NotFound() {
	return (
		<div className="min-h-[85vh] bg-paper-tint/30 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
			<div className="max-w-2xl w-full text-center space-y-8">
				{/* Studio Emblem */}
				<div className="inline-flex items-center justify-center p-4 rounded-full bg-paper-tint border border-border-vellum shadow-xs mx-auto">
					<Feather className="h-8 w-8 text-primary" />
				</div>

				{/* Headings */}
				<div className="space-y-3">
					<span className="font-label-sm text-xs uppercase tracking-[0.25em] text-secondary font-semibold">
						Manuscript Not Found • 404
					</span>
					<h1 className="text-3xl sm:text-5xl font-serif font-medium tracking-tight text-foreground">
						This Page Has Drifted Away
					</h1>
					<p className="text-sm sm:text-base text-secondary max-w-lg mx-auto leading-relaxed font-normal">
						Like wet ink on parchment, the page or inscription you were seeking is nowhere to be found. But our
						calligraphy atelier is open and ready to inspire you.
					</p>
				</div>

				{/* Helpful Curated Quick Links */}
				<div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-lg mx-auto text-left pt-2">
					<Link
						href="/shop"
						className="p-4 rounded-xl bg-card border border-border-vellum/90 hover:border-primary transition-colors flex items-center justify-between group shadow-xs"
					>
						<div className="flex items-center gap-3">
							<div className="p-2 rounded-sm bg-paper-tint text-primary">
								<ShoppingBag className="h-4 w-4" />
							</div>
							<div>
								<h2 className="text-sm font-medium text-foreground">Explore Creations</h2>
								<p className="text-xs text-secondary">Browse handmade frames & vow suites</p>
							</div>
						</div>
						<ArrowRight className="h-4 w-4 text-secondary group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
					</Link>

					<Link
						href="/gifting"
						className="p-4 rounded-xl bg-card border border-border-vellum/90 hover:border-primary transition-colors flex items-center justify-between group shadow-xs"
					>
						<div className="flex items-center gap-3">
							<div className="p-2 rounded-sm bg-paper-tint text-primary">
								<Gift className="h-4 w-4" />
							</div>
							<div>
								<h2 className="text-sm font-medium text-foreground">Artisanal Gifting</h2>
								<p className="text-xs text-secondary">Hampers, wedding trousseau & VIP suites</p>
							</div>
						</div>
						<ArrowRight className="h-4 w-4 text-secondary group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
					</Link>

					<Link
						href="/contact"
						className="p-4 rounded-xl bg-card border border-border-vellum/90 hover:border-primary transition-colors flex items-center justify-between group shadow-xs"
					>
						<div className="flex items-center gap-3">
							<div className="p-2 rounded-sm bg-paper-tint text-primary">
								<Compass className="h-4 w-4" />
							</div>
							<div>
								<h2 className="text-sm font-medium text-foreground">Bespoke Commissions</h2>
								<p className="text-xs text-secondary">Inquire about custom calligraphy</p>
							</div>
						</div>
						<ArrowRight className="h-4 w-4 text-secondary group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
					</Link>

					<Link
						href="/order/track"
						className="p-4 rounded-xl bg-card border border-border-vellum/90 hover:border-primary transition-colors flex items-center justify-between group shadow-xs"
					>
						<div className="flex items-center gap-3">
							<div className="p-2 rounded-sm bg-paper-tint text-primary">
								<Package className="h-4 w-4" />
							</div>
							<div>
								<h2 className="text-sm font-medium text-foreground">Track An Order</h2>
								<p className="text-xs text-secondary">Follow your courier dispatch status</p>
							</div>
						</div>
						<ArrowRight className="h-4 w-4 text-secondary group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
					</Link>
				</div>

				{/* Primary Return Button */}
				<div className="pt-2">
					<Button asChild size="lg" className="rounded-sm px-8 bg-primary text-on-primary hover:bg-brand-script-dark shadow-xs">
						<Link href="/" className="inline-flex items-center gap-2">
							<Home className="h-4 w-4" />
							<span>Return to Studio Home</span>
						</Link>
					</Button>
				</div>
			</div>
		</div>
	);
}
