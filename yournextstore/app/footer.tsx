import { cacheLife } from "next/cache";
import Link from "next/link";
import { commerce, meGetCached } from "@/lib/commerce";
import { FooterLegalModalButtons, FooterBottomBarModalButtons } from "@/components/footer-modal-links";

async function FooterBlogLink() {
	"use cache";
	cacheLife("hours");

	const me = await meGetCached().catch(() => null);
	if (!me?.store.settings?.enabledTools?.blog) {
		return (
			<li>
				<Link href="/blog" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
					Atelier Blog
				</Link>
			</li>
		);
	}

	return (
		<li>
			<Link href="/blog" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
				Blog
			</Link>
		</li>
	);
}

async function FooterContactLink() {
	"use cache";
	cacheLife("hours");

	const me = await meGetCached().catch(() => null);
	if (!me?.store.settings?.enabledTools?.contactForm) {
		return (
			<li>
				<Link href="/contact" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
					Contact Us
				</Link>
			</li>
		);
	}

	return (
		<li>
			<Link href="/contact" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
				Contact Us
			</Link>
		</li>
	);
}

async function FooterCollections() {
	"use cache";
	cacheLife("hours");

	const collections = await commerce.collectionBrowse({ limit: 5 }).catch(() => ({ data: [] }));

	if (!collections?.data || collections.data.length === 0) {
		return (
			<div>
				<h3 className="text-sm font-semibold text-foreground">Atelier Navigation</h3>
				<ul className="mt-4 space-y-2.5">
					<li>
						<Link href="/shop" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
							The Shop
						</Link>
					</li>
					<li>
						<Link href="/gifting" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
							Bespoke Suites
						</Link>
					</li>
					<li>
						<Link href="/#workshops-section" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
							Workshops
						</Link>
					</li>
					<li>
						<Link href="/#shop-gallery" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
							Gallery
						</Link>
					</li>
				</ul>
			</div>
		);
	}

	return (
		<div>
			<h3 className="text-sm font-semibold text-foreground">Collections</h3>
			<ul className="mt-4 space-y-2.5">
				{collections.data.map((collection) => (
					<li key={collection.id}>
						<Link
							href={`/collection/${collection.slug}`}
							className="text-sm text-muted-foreground hover:text-foreground transition-colors"
						>
							{collection.name}
						</Link>
					</li>
				))}
			</ul>
		</div>
	);
}

async function getCopyrightYear() {
	"use cache";
	cacheLife("days");

	return new Date().getFullYear();
}

export async function Footer() {
	const year = await getCopyrightYear();

	return (
		<footer className="border-t border-border bg-background">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="py-12 sm:py-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-12">
					{/* Brand */}
					<div className="sm:max-w-xs">
						<Link href="/" className="flex items-center gap-3 text-xl font-bold text-foreground">
							<img src="/Logo.jpeg" alt="The Letter Ink Logo" className="h-10 w-10 rounded-sm object-cover" />
							<span>The Letter Ink</span>
						</Link>
						<p className="mt-4 text-sm text-muted-foreground leading-relaxed">
							An artisanal calligraphy studio, bespoke wedding stationery atelier, and custom lettering workshop.
						</p>
					</div>

					{/* Collections / Navigation */}
					<FooterCollections />

					{/* Support */}
					<div>
						<h3 className="text-sm font-semibold text-foreground">Support</h3>
						<ul className="mt-4 space-y-2.5">
							<li>
								<Link
									href="/about"
									className="text-sm text-muted-foreground hover:text-foreground transition-colors"
								>
									About Us
								</Link>
							</li>
							<FooterContactLink />
							<li>
								<Link
									href="/faq"
									className="text-sm text-muted-foreground hover:text-foreground transition-colors"
								>
									FAQ
								</Link>
							</li>
							<FooterBlogLink />
						</ul>
					</div>

					{/* Legal & Policies Modal Triggers */}
					<FooterLegalModalButtons />
				</div>

				{/* Bottom bar */}
				<div className="py-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
					<p className="text-sm text-muted-foreground">&copy; {year} The Letter Ink. All rights reserved.</p>
					<FooterBottomBarModalButtons />
				</div>
			</div>
		</footer>
	);
}
