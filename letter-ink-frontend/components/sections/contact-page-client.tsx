"use client";

import {
	AlertCircle,
	CheckCircle,
	Clock,
	Hourglass,
	Loader2,
	Mail,
	MessageSquare,
	PenTool,
	Phone,
	Send,
	Sparkles,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { FacebookIcon, InstagramIcon } from "@/components/icons/social-icons";
import {
	STUDIO_ADDRESS,
	STUDIO_EMAIL,
	STUDIO_FACEBOOK,
	STUDIO_INSTAGRAM,
	STUDIO_PHONE,
	STUDIO_WHATSAPP,
} from "@/lib/constants";

export function ContactPageClient() {
	const [selectedDiscipline, setSelectedDiscipline] = useState<string>("wedding");
	const [scriptStyle, setScriptStyle] = useState<string>("copperplate");
	const [medium, setMedium] = useState<string>("deckle");

	// Form state
	const [fullName, setFullName] = useState<string>("");
	const [email, setEmail] = useState<string>("");
	const [whatsapp, setWhatsapp] = useState<string>("");
	const [deadline, setDeadline] = useState<string>("");
	const [message, setMessage] = useState<string>("");

	const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
	const [submitted, setSubmitted] = useState<boolean>(false);
	const [errorMessage, setErrorMessage] = useState<string | null>(null);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setErrorMessage(null);

		if (!fullName.trim() || !email.trim() || !whatsapp.trim() || !message.trim()) {
			setErrorMessage("Please complete all required fields (*).");
			return;
		}

		setIsSubmitting(true);

		try {
			const res = await fetch("/api/contact", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					fullName,
					email,
					whatsapp,
					discipline: selectedDiscipline,
					scriptStyle,
					medium,
					deadline,
					message,
				}),
			});

			const data = await res.json();
			if (!res.ok || !data.success) {
				throw new Error(data.error || "Failed to submit inquiry. Please try again.");
			}

			setSubmitted(true);
			toast.success("Inquiry sent successfully!");
		} catch (err: any) {
			setErrorMessage(err.message || "Failed to transmit message. Please contact us via WhatsApp.");
			toast.error(err.message || "Failed to transmit message.");
		} finally {
			setIsSubmitting(false);
		}
	};

	const whatsappPrefillUrl = `https://wa.me/${STUDIO_WHATSAPP}?text=${encodeURIComponent(
		`Hello The Letter Ink Studio! I submitted an inquiry for ${selectedDiscipline}.\nName: ${fullName}\nEmail: ${email}\nNotes: ${message}`,
	)}`;

	return (
		<div className="flex flex-col w-full bg-background min-h-screen text-on-surface">
			{/* Editorial Header & Ambient Glow */}
			<section className="relative w-full overflow-hidden pb-12 pt-8 bg-paper-tint border-b border-border-vellum">
				<div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
					{/* Breadcrumb & Concierge Badge */}
					<div className="flex flex-wrap items-center justify-between gap-4 mb-6">
						<nav
							aria-label="Breadcrumb"
							className="flex items-center gap-2 text-xs uppercase tracking-widest text-secondary font-label-sm"
						>
							<Link href="/" className="hover:text-primary transition-colors">
								Home
							</Link>
							<span className="text-secondary/60">/</span>
							<span className="text-primary font-semibold" aria-current="page">
								Contact & Commissions
							</span>
						</nav>
						<span className="inline-flex items-center gap-2 px-3 py-1 bg-paper-tint text-primary border border-border-vellum text-xs font-semibold uppercase tracking-widest rounded-full">
							<span className="w-2 h-2 rounded-full bg-primary motion-safe:animate-pulse"></span>
							Commissions & Concierge
						</span>
					</div>

					{/* Main Headline Grid */}
					<div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
						<div className="lg:col-span-8">
							<p className="text-xs uppercase text-secondary tracking-[0.25em] mb-3 font-semibold">
								Artisanal Calligraphy & Bespoke Stationery
							</p>
							<h1 className="font-display-hero text-3xl sm:text-4xl lg:text-5xl text-primary tracking-tight leading-tight font-serif">
								Contact Our Studio & Book A Consultation
							</h1>
						</div>
						<div className="lg:col-span-4">
							<p className="text-sm sm:text-base text-secondary leading-relaxed font-normal">
								Whether you seek a bespoke wedding vow suite, archival name frame, on-site live glass engraving,
								or calligraphy workshops, our atelier is honored to craft your vision.
							</p>
						</div>
					</div>
				</div>
			</section>

			{/* Primary Two-Column Atelier Hub */}
			<section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16 w-full">
				<div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
					{/* Left Column: Studio Sanctuary & Touchpoints (5 cols) */}
					<div className="lg:col-span-5 flex flex-col gap-8">
						{/* Sanctuary Address Card */}
						<div className="bg-card p-6 sm:p-8 shadow-xs border border-border-vellum/90 relative overflow-hidden flex flex-col justify-between rounded-xl">
							<div>
								<div className="flex items-center justify-between mb-6">
									<span className="text-xs uppercase tracking-widest text-secondary font-semibold">
										Studio Location
									</span>
									<PenTool className="w-5 h-5 text-primary" />
								</div>
								<h2 className="font-headline-md text-xl sm:text-2xl text-primary font-serif mb-3">
									The Letter Ink Atelier
								</h2>
								<p className="text-sm text-secondary leading-relaxed mb-6 font-normal">
									{STUDIO_ADDRESS}
								</p>
								<div className="flex items-center gap-2 text-primary text-xs uppercase tracking-widest font-semibold">
									<Clock className="w-4 h-4" />
									<span>Appointments Welcomed Daily</span>
								</div>
							</div>

							{/* Direct WhatsApp Action */}
							<div className="mt-8 pt-6 border-t border-border-vellum/60">
								<a
									href={`https://wa.me/${STUDIO_WHATSAPP}?text=Hello%20The%20Letter%20Ink,%20I%20would%20like%20to%20inquire%20about%20a%20bespoke%20commission.`}
									target="_blank"
									rel="noopener noreferrer"
									className="w-full h-12 bg-primary hover:bg-brand-script-dark text-on-primary px-6 flex items-center justify-center gap-3 transition-colors rounded-sm text-xs font-semibold uppercase tracking-wider shadow-xs cursor-pointer"
								>
									<MessageSquare className="w-4 h-4" />
									<span>Direct WhatsApp Concierge</span>
								</a>
							</div>
						</div>

						{/* Direct Touchpoints & Working Cadence */}
						<div className="bg-card p-6 sm:p-8 shadow-xs border border-border-vellum/90 rounded-xl">
							<span className="text-xs uppercase tracking-widest text-secondary block mb-6 font-semibold">
								Direct Inquiries & Hours
							</span>
							<div className="space-y-6">
								{/* Email */}
								<div className="flex items-start gap-4">
									<div className="w-10 h-10 rounded-full bg-paper-tint border border-border-vellum flex items-center justify-center shrink-0 text-primary">
										<Mail className="w-4 h-4" />
									</div>
									<div>
										<p className="text-xs uppercase tracking-wider text-secondary font-semibold mb-0.5">
											Written Inquiries
										</p>
										<a
											href={`mailto:${STUDIO_EMAIL}`}
											className="text-sm text-primary font-medium hover:underline"
										>
											{STUDIO_EMAIL}
										</a>
										<p className="text-xs text-secondary/80 mt-0.5">
											Typical response within 12 operating hours
										</p>
									</div>
								</div>

								{/* Phone */}
								<div className="flex items-start gap-4">
									<div className="w-10 h-10 rounded-full bg-paper-tint border border-border-vellum flex items-center justify-center shrink-0 text-primary">
										<Phone className="w-4 h-4" />
									</div>
									<div>
										<p className="text-xs uppercase tracking-wider text-secondary font-semibold mb-0.5">
											Direct Telephony
										</p>
										<a href={`tel:${STUDIO_PHONE.replace(/\s+/g, "")}`} className="text-sm text-primary font-medium hover:underline">
											{STUDIO_PHONE}
										</a>
										<p className="text-xs text-secondary/80 mt-0.5">
											Direct line to Founder & Lead Calligrapher
										</p>
									</div>
								</div>

								{/* Operating Rhythm */}
								<div className="flex items-start gap-4 pt-2">
									<div className="w-10 h-10 rounded-full bg-paper-tint border border-border-vellum flex items-center justify-center shrink-0 text-primary">
										<Hourglass className="w-4 h-4" />
									</div>
									<div className="w-full">
										<p className="text-xs uppercase tracking-wider text-secondary font-semibold mb-1">
											Studio Operating Hours
										</p>
										<div className="flex justify-between py-1 text-xs">
											<span className="text-secondary">Monday – Saturday</span>
											<span className="text-primary font-medium">10:00 AM – 6:30 PM IST</span>
										</div>
										<div className="flex justify-between py-1 text-xs border-t border-border-vellum/50">
											<span className="text-secondary">Sunday</span>
											<span className="text-secondary italic">Penning & Ink Curing</span>
										</div>
									</div>
								</div>
							</div>

							{/* Social Channels */}
							<div className="mt-8 pt-6 border-t border-border-vellum/60 flex items-center justify-between">
								<span className="text-xs uppercase tracking-widest text-secondary font-semibold">
									Studio Channels
								</span>
								<div className="flex items-center gap-3">
									<a
										href={STUDIO_INSTAGRAM}
										target="_blank"
										rel="noopener noreferrer"
										aria-label="Follow The Letter Ink on Instagram"
										className="w-9 h-9 rounded-full bg-paper-tint border border-border-vellum hover:bg-primary hover:text-on-primary text-primary flex items-center justify-center transition-colors"
									>
										<InstagramIcon className="w-4 h-4 fill-current" />
									</a>
									<a
										href={STUDIO_FACEBOOK}
										target="_blank"
										rel="noopener noreferrer"
										aria-label="Visit The Letter Ink on Facebook"
										className="w-9 h-9 rounded-full bg-paper-tint border border-border-vellum hover:bg-primary hover:text-on-primary text-primary flex items-center justify-center transition-colors"
									>
										<FacebookIcon className="w-4 h-4 fill-current" />
									</a>
								</div>
							</div>
						</div>

						{/* Studio Creed */}
						<div className="p-6 bg-paper-tint/70 border border-border-vellum/80 rounded-xl text-center">
							<p className="font-serif text-lg italic text-primary mb-2">
								“Give us your words and we frame them into reality.”
							</p>
							<p className="text-xs text-secondary uppercase tracking-widest font-semibold">
								Handcrafted with archival inks & botanical deckle papers
							</p>
						</div>
					</div>

					{/* Right Column: Interactive Dossier Form (7 cols) */}
					<div className="lg:col-span-7 bg-card p-6 sm:p-8 lg:p-10 shadow-xs border border-border-vellum/90 rounded-xl flex flex-col justify-between">
						{submitted ? (
							<div className="py-12 text-center space-y-5 animate-in fade-in-50 duration-300">
								<div className="w-16 h-16 rounded-full bg-paper-tint border border-border-vellum text-primary mx-auto flex items-center justify-center shadow-xs">
									<CheckCircle className="w-8 h-8" />
								</div>
								<h2 className="font-serif text-2xl sm:text-3xl text-foreground font-medium">
									Commission Inquiry Received
								</h2>
								<p className="text-sm text-secondary leading-relaxed max-w-md mx-auto">
									Thank you, <span className="font-semibold text-foreground">{fullName || "Valued Patron"}</span>.
									Our master calligrapher will review your requirements and respond within 12 operating hours.
								</p>

								{/* Direct WhatsApp Fast Track */}
								<div className="pt-4 max-w-md mx-auto space-y-3">
									<a
										href={whatsappPrefillUrl}
										target="_blank"
										rel="noopener noreferrer"
										className="w-full h-12 bg-emerald-700 hover:bg-emerald-800 text-white px-6 flex items-center justify-center gap-2 rounded-sm text-xs font-semibold uppercase tracking-wider transition-colors shadow-xs"
									>
										<MessageSquare className="w-4 h-4" />
										<span>Fast-Track On WhatsApp With These Details</span>
									</a>
									<button
										type="button"
										onClick={() => {
											setSubmitted(false);
											setMessage("");
										}}
										className="text-xs text-secondary hover:text-foreground underline pt-2"
									>
										Send another inquiry
									</button>
								</div>
							</div>
						) : (
							<form onSubmit={handleSubmit} className="space-y-6">
								{/* Section Header */}
								<div className="flex items-center justify-between pb-4 border-b border-border-vellum/60">
									<div>
										<span className="text-xs uppercase tracking-widest text-secondary block font-semibold">
											Custom Commission Dossier
										</span>
										<h2 className="font-headline-md text-xl sm:text-2xl text-foreground font-serif mt-1">
											Tell Us About Your Project
										</h2>
									</div>
									<Sparkles className="w-5 h-5 text-primary" />
								</div>

								{errorMessage && (
									<div
										role="alert"
										className="p-3.5 rounded-sm bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-red-800 dark:text-red-300 text-xs flex items-center gap-2"
									>
										<AlertCircle className="w-4 h-4 shrink-0 text-red-600 dark:text-red-400" />
										<span>{errorMessage}</span>
									</div>
								)}

								{/* Category Selection */}
								<div>
									<label className="text-xs uppercase tracking-wider text-secondary block mb-3 font-semibold">
										1. Select Creation Category
									</label>
									<div className="flex flex-wrap gap-2">
										{[
											{ id: "wedding", label: "Wedding Suites & Vows" },
											{ id: "frames", label: "Custom Name Frames" },
											{ id: "engraving", label: "Glass & Perfume Engraving" },
											{ id: "workshops", label: "Workshops & Masterclasses" },
											{ id: "corporate", label: "Corporate Gifting" },
										].map((cat) => (
											<button
												key={cat.id}
												type="button"
												onClick={() => setSelectedDiscipline(cat.id)}
												className={`px-3.5 py-2 rounded-full text-xs uppercase tracking-wider transition-colors font-medium border ${
													selectedDiscipline === cat.id
														? "bg-primary text-on-primary border-primary"
														: "bg-paper-tint/60 text-secondary border-border-vellum hover:border-primary hover:text-foreground"
												}`}
											>
												{cat.label}
											</button>
										))}
									</div>
								</div>

								{/* Row 1: Name & Email */}
								<div className="grid grid-cols-1 md:grid-cols-2 gap-5">
									<div className="space-y-1.5">
										<label
											htmlFor="contact-fullName"
											className="block text-xs uppercase tracking-wider text-secondary font-semibold"
										>
											Your Name *
										</label>
										<input
											id="contact-fullName"
											name="fullName"
											required
											type="text"
											autoComplete="name"
											value={fullName}
											onChange={(e) => setFullName(e.target.value)}
											placeholder="e.g. Radhika Deshmukh"
											className="w-full bg-background border border-border-vellum px-3.5 py-2.5 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-sm"
										/>
									</div>
									<div className="space-y-1.5">
										<label
											htmlFor="contact-email"
											className="block text-xs uppercase tracking-wider text-secondary font-semibold"
										>
											Email Address *
										</label>
										<input
											id="contact-email"
											name="email"
											required
											type="email"
											autoComplete="email"
											value={email}
											onChange={(e) => setEmail(e.target.value)}
											placeholder="radhika.deshmukh@gmail.com"
											className="w-full bg-background border border-border-vellum px-3.5 py-2.5 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-sm"
										/>
									</div>
								</div>

								{/* Row 2: WhatsApp & Milestone Date */}
								<div className="grid grid-cols-1 md:grid-cols-2 gap-5">
									<div className="space-y-1.5">
										<label
											htmlFor="contact-whatsapp"
											className="block text-xs uppercase tracking-wider text-secondary font-semibold"
										>
											WhatsApp Mobile Number *
										</label>
										<div className="flex">
											<span className="inline-flex items-center px-3 bg-paper-tint border-y border-l border-border-vellum text-secondary text-xs rounded-l-sm font-medium">
												+91
											</span>
											<input
												id="contact-whatsapp"
												name="whatsapp"
												required
												type="tel"
												autoComplete="tel"
												value={whatsapp}
												onChange={(e) => setWhatsapp(e.target.value)}
												placeholder="98230 11942"
												className="w-full bg-background border border-border-vellum px-3.5 py-2.5 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-r-sm"
											/>
										</div>
									</div>
									<div className="space-y-1.5">
										<label
											htmlFor="contact-deadline"
											className="block text-xs uppercase tracking-wider text-secondary font-semibold"
										>
											Event or Deadline Date (Optional)
										</label>
										<input
											id="contact-deadline"
											name="deadline"
											type="date"
											value={deadline}
											onChange={(e) => setDeadline(e.target.value)}
											className="w-full bg-background border border-border-vellum px-3.5 py-2.5 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-sm"
										/>
									</div>
								</div>

								{/* Row 3: Script Aesthetics */}
								<div>
									<span className="block text-xs uppercase tracking-wider text-secondary mb-2 font-semibold">
										2. Preferred Calligraphy Style
									</span>
									<div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
										{[
											{ id: "copperplate", title: "Copperplate", sub: "Classic Flourish" },
											{ id: "spencerian", title: "Spencerian", sub: "Delicate Hairlines" },
											{ id: "modern_roman", title: "Modern Roman", sub: "Minimal Serif" },
											{ id: "undecided", title: "Studio Choice", sub: "Artist Guidance" },
										].map((item) => (
											<button
												key={item.id}
												type="button"
												onClick={() => setScriptStyle(item.id)}
												className={`p-3 text-center border rounded-sm transition-colors text-left ${
													scriptStyle === item.id
														? "border-primary bg-paper-tint/80 ring-1 ring-primary"
														: "border-border-vellum hover:bg-paper-tint/40"
												}`}
											>
												<span className="font-serif text-sm block italic mb-0.5 text-foreground">
													{item.title}
												</span>
												<span className="text-xs text-secondary tracking-wider uppercase font-medium">
													{item.sub}
												</span>
											</button>
										))}
									</div>
								</div>

								{/* Row 4: Inscription Medium */}
								<div className="space-y-1.5">
									<label
										htmlFor="contact-medium"
										className="block text-xs uppercase tracking-wider text-secondary font-semibold"
									>
										3. Preferred Medium or Presentation
									</label>
									<select
										id="contact-medium"
										name="medium"
										value={medium}
										onChange={(e) => setMedium(e.target.value)}
										className="w-full bg-background border border-border-vellum px-3.5 py-2.5 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-sm"
									>
										<option value="deckle">Deckle-Edge Cotton Rag Paper (Imported 300gsm)</option>
										<option value="glass_frame">
											Double Glass Floating Heirloom Frame (Brass or Teakwood)
										</option>
										<option value="engraving">Hand-Engraved Perfume / Luxury Spirits Bottle</option>
										<option value="invitations">
											Full Wedding Suite (Envelopes, Details & Monogram Wax Seals)
										</option>
										<option value="custom">Other Bespoke Medium (Leather, Agate, Wooden Plank)</option>
									</select>
								</div>

								{/* Row 5: Notes */}
								<div className="space-y-1.5">
									<label
										htmlFor="contact-message"
										className="block text-xs uppercase tracking-wider text-secondary font-semibold"
									>
										4. Inscription Text or Commission Notes *
									</label>
									<textarea
										id="contact-message"
										name="message"
										required
										rows={4}
										value={message}
										onChange={(e) => setMessage(e.target.value)}
										placeholder="Share your vows, desired names, quantity, or specific color schemes..."
										className="w-full bg-background border border-border-vellum px-3.5 py-2.5 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-sm"
									></textarea>
								</div>

								<button
									type="submit"
									disabled={isSubmitting}
									className="w-full bg-primary hover:bg-brand-script-dark text-on-primary py-3.5 text-xs font-semibold uppercase tracking-wider transition-colors rounded-sm inline-flex items-center justify-center gap-2 cursor-pointer shadow-xs disabled:opacity-60"
								>
									{isSubmitting ? (
										<>
											<Loader2 className="w-4 h-4 animate-spin" />
											<span>Transmitting Dossier to Atelier…</span>
										</>
									) : (
										<>
											<Send className="w-4 h-4" />
											<span>Submit Commission Inquiry to Atelier</span>
										</>
									)}
								</button>
							</form>
						)}
					</div>
				</div>
			</section>
		</div>
	);
}
