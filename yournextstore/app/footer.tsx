import { cacheLife } from "next/cache";
import Link from "next/link";
import { FooterLegalModalButtons, FooterBottomBarModalButtons } from "@/components/footer-modal-links";
import { Mail, MapPin, MessageCircle } from "lucide-react";

async function getCopyrightYear() {
	"use cache";
	cacheLife("days");

	return new Date().getFullYear();
}

export async function Footer() {
	const year = await getCopyrightYear();

	return (
		<footer className="border-t border-border-vellum bg-surface-container-low/60 text-foreground transition-colors">

			{/* Main Footer Content */}
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-12">
					{/* Brand Column (Col 1 - 4 cols wide on lg) */}
					<div className="lg:col-span-4 flex flex-col justify-between space-y-6">
						<div>
							<Link href="/" className="inline-block" aria-label="The Letter Ink Home">
								<img
									src="/Latest-logo.png"
									alt="The Letter Ink"
									className="h-16 sm:h-20 w-auto object-contain"
								/>
							</Link>
							<p className="mt-4 text-sm text-secondary leading-relaxed max-w-sm">
								An artisanal calligraphy studio & bespoke stationery atelier. Hand-scripting timeless wedding suites, personalized name frames, and heirloom keepsakes.
							</p>
						</div>

						<div className="space-y-3 pt-2">
							<div className="flex items-start gap-2.5 text-xs text-secondary">
								<MapPin className="w-4 h-4 text-primary shrink-0 mt-0.5" />
								<span>Ratan Niwas, Plot 33/A, Bhusawal, Maharashtra 425201</span>
							</div>
							<div className="flex items-center gap-2.5 text-xs text-secondary">
								<Mail className="w-4 h-4 text-primary shrink-0" />
								<a
									href="mailto:concierge@theletterink.com"
									className="hover:text-primary transition-colors underline-offset-4 hover:underline"
								>
									concierge@theletterink.com
								</a>
							</div>
						</div>

						{/* Social Media & WhatsApp Links */}
						<div className="flex items-center gap-3 pt-1">
							<a
								href="https://www.instagram.com/the_letter_ink/?igshid=YmMyMTA2M2Y%3D"
								target="_blank"
								rel="noopener noreferrer"
								aria-label="Instagram @the_letter_ink"
								className="w-9 h-9 rounded-full bg-surface-container hover:bg-tertiary-fixed text-primary flex items-center justify-center transition-all duration-300 hover:scale-105 shadow-xs"
							>
								<svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
									<path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
								</svg>
							</a>
							<a
								href="https://wa.me/message/SO4FNIENMNMHA1"
								target="_blank"
								rel="noopener noreferrer"
								aria-label="WhatsApp Atelier"
								className="px-3.5 py-1.5 rounded-full bg-tertiary-fixed hover:bg-primary text-primary hover:text-on-primary text-xs font-medium tracking-wide flex items-center gap-1.5 transition-all duration-300 shadow-xs"
							>
								<MessageCircle className="w-3.5 h-3.5" />
								<span>WhatsApp Studio</span>
							</a>
						</div>
					</div>

					{/* Column 2: Atelier Creations & Collections (3 cols) */}
					<div className="lg:col-span-3">
						<h3 className="font-label-sm text-label-sm tracking-widest text-primary font-bold">
							Creations & Collections
						</h3>
						<ul className="mt-5 space-y-3">
							<li>
								<Link
									href="/shop"
									className="text-sm text-secondary hover:text-primary hover:translate-x-0.5 transition-all inline-block"
								>
									Personalized Name Frames
								</Link>
							</li>
							<li>
								<Link
									href="/shop"
									className="text-sm text-secondary hover:text-primary hover:translate-x-0.5 transition-all inline-block"
								>
									Handwritten Letters & Vows
								</Link>
							</li>
							<li>
								<Link
									href="/gifting"
									className="text-sm text-secondary hover:text-primary hover:translate-x-0.5 transition-all inline-block"
								>
									Wedding Stationery & Suites
								</Link>
							</li>
							<li>
								<Link
									href="/shop"
									className="text-sm text-secondary hover:text-primary hover:translate-x-0.5 transition-all inline-block"
								>
									Glass & Perfume Engraving
								</Link>
							</li>
							<li>
								<Link
									href="/collection/hampers"
									className="text-sm text-secondary hover:text-primary hover:translate-x-0.5 transition-all inline-block"
								>
									Artisanal Gift Hampers
								</Link>
							</li>
							<li>
								<Link
									href="/workshops"
									className="text-sm text-secondary hover:text-primary hover:translate-x-0.5 transition-all inline-block"
								>
									Calligraphy Workshops
								</Link>
							</li>
						</ul>
					</div>

					{/* Column 3: Atelier & Support (2 cols) */}
					<div className="lg:col-span-2">
						<h3 className="font-label-sm text-label-sm tracking-widest text-primary font-bold">
							Support & Atelier
						</h3>
						<ul className="mt-5 space-y-3">
							<li>
								<Link
									href="/about"
									className="text-sm text-secondary hover:text-primary hover:translate-x-0.5 transition-all inline-block"
								>
									About Us
								</Link>
							</li>
							<li>
								<Link
									href="/contact"
									className="text-sm text-secondary hover:text-primary hover:translate-x-0.5 transition-all inline-block"
								>
									Contact & Inquiries
								</Link>
							</li>
							<li>
								<Link
									href="/faq"
									className="text-sm text-secondary hover:text-primary hover:translate-x-0.5 transition-all inline-block"
								>
									FAQs & Care
								</Link>
							</li>
							<li>
								<Link
									href="/order/track"
									className="text-sm text-secondary hover:text-primary hover:translate-x-0.5 transition-all inline-block"
								>
									Track Order
								</Link>
							</li>
							<li>
								<Link
									href="/blog"
									className="text-sm text-secondary hover:text-primary hover:translate-x-0.5 transition-all inline-block"
								>
									Atelier Blog
								</Link>
							</li>
						</ul>
					</div>

					{/* Column 4: Legal & Policies Modal Triggers (3 cols) */}
					<div className="lg:col-span-3">
						<FooterLegalModalButtons />
					</div>
				</div>

				{/* Bottom bar */}
				<div className="mt-12 pt-8 border-t border-border-vellum flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-secondary">
					<p>&copy; {year} The Letter Ink. All rights reserved. Handcrafted with dip-pen & ink in India.</p>
					<div className="flex items-center gap-4">
						<FooterBottomBarModalButtons />
					</div>
				</div>
			</div>
		</footer>
	);
}
