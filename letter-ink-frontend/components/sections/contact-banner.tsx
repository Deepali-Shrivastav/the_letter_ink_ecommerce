import { MessageCircle, Store } from "lucide-react";

export function ContactBanner() {
	return (
		<section className="w-full py-space-lg bg-paper-tint border-t border-border-vellum/80" id="contact">
			<div className="max-w-7xl mx-auto px-margin-mobile md:px-margin">
				<div className="bg-surface-container-lowest border border-border-vellum/80 rounded-xl p-8 md:p-12 shadow-xs flex flex-col md:flex-row items-center justify-between gap-8">
					<div className="flex items-start gap-5">
						<div className="w-14 h-14 rounded-full bg-tertiary-fixed flex items-center justify-center text-primary shrink-0">
							<Store className="w-7 h-7 text-primary" />
						</div>
						<div>
							<span className="font-label-sm text-label-sm uppercase tracking-widest text-secondary">
								The Studio • Maharashtra
							</span>
							<h3 className="font-headline-sm text-headline-sm text-primary mt-1">The Letter Ink Studio</h3>
							<p className="font-body-sm text-body-sm text-secondary mt-1 max-w-lg">
								Ratan niwas, ground floor, plot no 33/A behind biyani chembers, bhusawal Maharashtra 425201
							</p>
						</div>
					</div>
					<div className="flex flex-wrap items-center gap-4">
						<a
							href="https://wa.me/message/SO4FNIENMNMHA1"
							target="_blank"
							rel="noopener noreferrer"
							className="px-6 py-3 bg-tertiary-fixed text-primary font-label-sm text-label-sm uppercase tracking-widest hover:bg-primary hover:text-on-primary transition-colors flex items-center gap-2"
						>
							<MessageCircle className="w-4 h-4" />
							<span>WhatsApp Atelier</span>
						</a>
						<a
							href="mailto:concierge@theletterink.com"
							className="px-6 py-3 bg-primary text-on-primary font-label-sm text-label-sm uppercase tracking-widest hover:bg-tertiary-fixed hover:text-primary transition-colors"
						>
							Email Us
						</a>
					</div>
				</div>
			</div>
		</section>
	);
}
