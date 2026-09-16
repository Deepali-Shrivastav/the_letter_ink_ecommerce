"use client";

import React, { useState } from "react";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";

type PolicyType = "terms" | "privacy" | "shipping" | "refunds" | null;

const POLICIES_CONTENT: Record<NonNullable<PolicyType>, { title: string; subtitle: string; content: React.ReactNode }> = {
	terms: {
		title: "Terms & Conditions of Commission",
		subtitle: "The Letter Ink Atelier Rules & Service Terms",
		content: (
			<div className="space-y-4 text-sm text-muted-foreground leading-relaxed max-h-[60vh] overflow-y-auto pr-2">
				<div>
					<h4 className="font-semibold text-foreground mb-1">1. Bespoke Commissions & Proofing</h4>
					<p>
						All custom calligraphy, wax seals, and wedding stationery are produced strictly according to the digital proofs provided. Once final digital proofs are approved by the client in writing, production commences. Any changes requested after proof approval will incur additional material and typesetting fees.
					</p>
				</div>
				<div>
					<h4 className="font-semibold text-foreground mb-1">2. Handcrafted Variations</h4>
					<p>
						As all our creations utilize handmade deckle-edge papers, vintage nibs, and hand-mixed inks, subtle variations in ink opacity, paper texture, and deckle margins are celebrated characteristics of artisanal craftsmanship rather than defects.
					</p>
				</div>
				<div>
					<h4 className="font-semibold text-foreground mb-1">3. Intellectual Property</h4>
					<p>
						The Letter Ink retains all intellectual property rights and copyrights over original artwork, custom lettering styles, and crest designs. Clients receive full personal usage rights for their commissioned stationery.
					</p>
				</div>
				<div>
					<h4 className="font-semibold text-foreground mb-1">4. Payment & Timelines</h4>
					<p>
						A 50% non-refundable retainer is required to reserve production slots for bespoke suites. Final balances are due prior to dispatch or atelier pickup.
					</p>
				</div>
			</div>
		),
	},
	privacy: {
		title: "Privacy & Data Protection Policy",
		subtitle: "How The Letter Ink Safeguards Your Information",
		content: (
			<div className="space-y-4 text-sm text-muted-foreground leading-relaxed max-h-[60vh] overflow-y-auto pr-2">
				<div>
					<h4 className="font-semibold text-foreground mb-1">1. Personal Data Collection</h4>
					<p>
						We collect personal details (names, mailing addresses, guest address lists for envelope calligraphy, and email addresses) solely for the purpose of fulfilling your order and creating your custom stationery.
					</p>
				</div>
				<div>
					<h4 className="font-semibold text-foreground mb-1">2. Confidentiality & Guest Lists</h4>
					<p>
						Guest address lists provided for calligraphic envelope addressing are strictly confidential. We never share, export, or store your private contact lists beyond the immediate completion of your order.
					</p>
				</div>
				<div>
					<h4 className="font-semibold text-foreground mb-1">3. Marketing Communications</h4>
					<p>
						You will only receive newsletter dispatches or masterclass release previews if you explicitly opt in to the Atelier Gazette. You may unsubscribe at any time with one click.
					</p>
				</div>
				<div>
					<h4 className="font-semibold text-foreground mb-1">4. Third-Party Security</h4>
					<p>
						All payments are processed through encrypted, PCI-compliant payment gateways. We never store credit card numbers on our local servers.
					</p>
				</div>
			</div>
		),
	},
	shipping: {
		title: "Worldwide Atelier Shipping & Care Guide",
		subtitle: "Packaging, Transit, and Handling Guidelines",
		content: (
			<div className="space-y-4 text-sm text-muted-foreground leading-relaxed max-h-[60vh] overflow-y-auto pr-2">
				<div>
					<h4 className="font-semibold text-foreground mb-1">1. Protective Packaging</h4>
					<p>
						Every commission is wrapped in acid-free tissue paper, wax-sealed, and encased in rigid archival boxes to prevent bending or moisture damage during transit.
					</p>
				</div>
				<div>
					<h4 className="font-semibold text-foreground mb-1">2. Delivery Timelines</h4>
					<p>
						Domestic courier shipping typically takes 2–5 business days after production completion. International atelier shipping takes 5–12 business days depending on customs processing in your destination country.
					</p>
				</div>
				<div>
					<h4 className="font-semibold text-foreground mb-1">3. Care Instructions</h4>
					<p>
						Keep handmade paper goods away from direct sunlight and high humidity. Handle calligraphy with clean, dry hands to avoid smudging delicate metallic or walnut inks.
					</p>
				</div>
			</div>
		),
	},
	refunds: {
		title: "Refunds, Returns & Replacements Policy",
		subtitle: "Policies for Bespoke Goods & Curated Items",
		content: (
			<div className="space-y-4 text-sm text-muted-foreground leading-relaxed max-h-[60vh] overflow-y-auto pr-2">
				<div>
					<h4 className="font-semibold text-foreground mb-1">1. Bespoke & Personalized Items</h4>
					<p>
						Due to the custom nature of calligraphic artwork, wax seals, and personalized stationery, all bespoke orders are non-refundable once final digital proofs have been approved and production has started.
					</p>
				</div>
				<div>
					<h4 className="font-semibold text-foreground mb-1">2. Transit Damage</h4>
					<p>
						In the rare event that your package arrives damaged in transit, please notify us within 48 hours of delivery with photo evidence. We will expedite reprints or replacements immediately at no cost to you.
					</p>
				</div>
				<div>
					<h4 className="font-semibold text-foreground mb-1">3. Non-Custom Curated Goods</h4>
					<p>
						Non-personalized tools (such as nib holders, seal stamps, and sealing wax sticks) may be returned unopened within 14 days of delivery for atelier store credit.
					</p>
				</div>
			</div>
		),
	},
};

export function FooterLegalModalButtons() {
	const [activePolicy, setActivePolicy] = useState<PolicyType>(null);

	const policyData = activePolicy ? POLICIES_CONTENT[activePolicy] : null;

	return (
		<>
			<div>
				<h3 className="text-sm font-semibold text-foreground">Legal & Policies</h3>
				<ul className="mt-4 space-y-2.5">
					<li>
						<button
							type="button"
							onClick={() => setActivePolicy("terms")}
							className="text-sm text-muted-foreground hover:text-foreground transition-colors text-left"
						>
							Terms & Conditions
						</button>
					</li>
					<li>
						<button
							type="button"
							onClick={() => setActivePolicy("privacy")}
							className="text-sm text-muted-foreground hover:text-foreground transition-colors text-left"
						>
							Privacy Policy
						</button>
					</li>
					<li>
						<button
							type="button"
							onClick={() => setActivePolicy("shipping")}
							className="text-sm text-muted-foreground hover:text-foreground transition-colors text-left"
						>
							Shipping & Atelier Care
						</button>
					</li>
					<li>
						<button
							type="button"
							onClick={() => setActivePolicy("refunds")}
							className="text-sm text-muted-foreground hover:text-foreground transition-colors text-left"
						>
							Refunds & Returns
						</button>
					</li>
				</ul>
			</div>

			<Dialog open={activePolicy !== null} onOpenChange={(open) => !open && setActivePolicy(null)}>
				{policyData && (
					<DialogContent className="sm:max-w-lg border border-border">
						<DialogHeader>
							<DialogTitle className="text-xl font-bold font-serif">{policyData.title}</DialogTitle>
							<DialogDescription>{policyData.subtitle}</DialogDescription>
						</DialogHeader>
						{policyData.content}
					</DialogContent>
				)}
			</Dialog>
		</>
	);
}

export function FooterBottomBarModalButtons() {
	const [activePolicy, setActivePolicy] = useState<PolicyType>(null);

	const policyData = activePolicy ? POLICIES_CONTENT[activePolicy] : null;

	return (
		<>
			<div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
				<button
					type="button"
					onClick={() => setActivePolicy("terms")}
					className="hover:text-foreground transition-colors"
				>
					Terms of Commission
				</button>
				<span>•</span>
				<button
					type="button"
					onClick={() => setActivePolicy("privacy")}
					className="hover:text-foreground transition-colors"
				>
					Privacy Policy
				</button>
				<span>•</span>
				<button
					type="button"
					onClick={() => setActivePolicy("shipping")}
					className="hover:text-foreground transition-colors"
				>
					Shipping & Care
				</button>
			</div>

			<Dialog open={activePolicy !== null} onOpenChange={(open) => !open && setActivePolicy(null)}>
				{policyData && (
					<DialogContent className="sm:max-w-lg border border-border">
						<DialogHeader>
							<DialogTitle className="text-xl font-bold font-serif">{policyData.title}</DialogTitle>
							<DialogDescription>{policyData.subtitle}</DialogDescription>
						</DialogHeader>
						{policyData.content}
					</DialogContent>
				)}
			</Dialog>
		</>
	);
}
