"use client";

import { useState } from "react";
import Link from "next/link";
import {
	MapPin,
	Clock,
	MessageSquare,
	Mail,
	Phone,
	Hourglass,
	Camera,
	Globe,
	Palette,
	Send,
	CheckCircle,
	PenTool,
	Sparkles,
} from "lucide-react";

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
	const [submitted, setSubmitted] = useState<boolean>(false);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		setSubmitted(true);
	};

	return (
		<div className="flex flex-col w-full bg-background min-h-screen text-on-surface">
			{/* Editorial Header & Ambient Glow */}
			<section className="relative w-full overflow-hidden pb-12 pt-8 bg-paper-tint border-b border-border-vellum">
				<div className="absolute -top-32 right-1/4 w-96 h-96 bg-[#fadcd0]/30 rounded-full blur-3xl pointer-events-none -z-10"></div>
				<div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-16">
					{/* Breadcrumb & Concierge Badge */}
					<div className="flex flex-wrap items-center justify-between gap-4 mb-6">
						<nav aria-label="Breadcrumbs" className="flex items-center gap-2 text-xs uppercase tracking-widest text-secondary font-label-sm">
							<Link href="/" className="hover:text-primary transition-colors">
								Home
							</Link>
							<span className="text-outline-variant">/</span>
							<span className="text-primary font-semibold">Contact Us</span>
						</nav>
						<span className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-[#fadcd0] text-[#271811] text-xs font-semibold uppercase tracking-widest rounded-full">
							<span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
							Commissions & Concierge
						</span>
					</div>

					{/* Main Headline Grid */}
					<div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
						<div className="lg:col-span-8">
							<p className="text-xs uppercase text-secondary tracking-[0.25em] mb-3 font-semibold">
								Bespeak The Written Word
							</p>
							<h1 className="font-display-hero text-4xl sm:text-5xl lg:text-6xl text-primary tracking-tight leading-tight font-serif">
								Initiate an Atelier Inscription or Consultation
							</h1>
						</div>
						<div className="lg:col-span-4">
							<p className="font-body-md text-base text-on-surface-variant leading-relaxed font-light">
								Whether you seek a bespoke wedding vow suite, archival name frame, on-site glass engraving, or private workshop enrollment, our studio is honored to assist you.
							</p>
						</div>
					</div>
				</div>
			</section>

			{/* Primary Two-Column Atelier Hub */}
			<section className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-16 py-16">
				<div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
					{/* Left Column: Sanctuary & Touchpoints (5 cols) */}
					<div className="lg:col-span-5 flex flex-col gap-8">
						{/* Sanctuary Address Card */}
						<div className="bg-paper-tint p-8 shadow-sm border border-border-vellum relative overflow-hidden flex flex-col justify-between rounded-sm">
							<div className="absolute top-0 right-0 w-32 h-32 bg-[#fadcd0]/20 rounded-full blur-xl pointer-events-none"></div>
							<div>
								<div className="flex items-center justify-between mb-6">
									<span className="text-xs uppercase tracking-widest text-secondary font-semibold">
										Physical Sanctuary
									</span>
									<PenTool className="w-5 h-5 text-primary" />
								</div>
								<h2 className="font-headline-md text-2xl text-primary font-serif mb-3">
									The Letter Ink Atelier
								</h2>
								<p className="text-sm text-on-surface-variant leading-relaxed mb-6 font-light">
									Ratan niwas, ground floor, plot no 33/A behind biyani chembers, bhusawal Maharashtra 425201
								</p>
								<div className="flex items-center gap-2 text-primary text-xs uppercase tracking-widest font-semibold">
									<Clock className="w-4 h-4" />
									<span>Appointments Welcomed Daily</span>
								</div>
							</div>

							{/* Direct WhatsApp Action */}
							<div className="mt-8 pt-6 border-t border-border-vellum">
								<a
									href="https://wa.me/919823011942?text=Hello%20The%20Letter%20Ink,%20I%20would%20like%20to%20inquire%20about%20a%20bespoke%20commission."
									target="_blank"
									rel="noopener noreferrer"
									className="w-full h-12 bg-[#fadcd0] hover:bg-primary hover:text-on-primary text-[#271811] px-6 flex items-center justify-center gap-3 transition-colors rounded-sm text-xs font-semibold uppercase tracking-wider"
								>
									<MessageSquare className="w-4 h-4" />
									<span>Direct WhatsApp Concierge</span>
								</a>
							</div>
						</div>

						{/* Direct Touchpoints & Working Cadence */}
						<div className="bg-surface-container-lowest p-8 shadow-sm border border-border-vellum rounded-sm">
							<span className="text-xs uppercase tracking-widest text-secondary block mb-6 font-semibold">
								Dispatch & Studio Desks
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
											href="mailto:concierge@theletterink.com"
											className="text-sm text-primary font-medium hover:underline"
										>
											concierge@theletterink.com
										</a>
										<p className="text-xs text-on-surface-variant font-light mt-0.5">
											Typical response within 12 atelier hours
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
										<a href="tel:+919823011942" className="text-sm text-primary font-medium hover:underline">
											+91 98230 11942
										</a>
										<p className="text-xs text-on-surface-variant font-light mt-0.5">
											Direct line to Founder & Calligrapher
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
											Studio Operating Rhythm
										</p>
										<div className="flex justify-between py-1 text-xs">
											<span className="text-on-surface-variant font-light">Monday – Saturday</span>
											<span className="text-primary font-medium">10:00 AM – 6:30 PM IST</span>
										</div>
										<div className="flex justify-between py-1 text-xs border-t border-border-vellum/50">
											<span className="text-on-surface-variant font-light">Sunday</span>
											<span className="text-secondary italic">Penning & Ink Curing</span>
										</div>
									</div>
								</div>
							</div>

							{/* Social Channels */}
							<div className="mt-8 pt-6 border-t border-border-vellum flex items-center justify-between">
								<span className="text-xs uppercase tracking-widest text-secondary font-semibold">Channels</span>
								<div className="flex items-center gap-3">
									<a
										href="https://www.instagram.com/the_letter_ink/?igshid=YmMyMTA2M2Y%3D"
										target="_blank"
										rel="noopener noreferrer"
										aria-label="Instagram"
										className="w-9 h-9 rounded-full bg-paper-tint border border-border-vellum hover:bg-[#fadcd0] text-primary flex items-center justify-center transition-colors"
									>
										<Camera className="w-4 h-4" />
									</a>
									<a
										href="https://www.facebook.com/profile.php?id=100083526653822"
										target="_blank"
										rel="noopener noreferrer"
										aria-label="Facebook"
										className="w-9 h-9 rounded-full bg-paper-tint border border-border-vellum hover:bg-[#fadcd0] text-primary flex items-center justify-center transition-colors"
									>
										<Globe className="w-4 h-4" />
									</a>
									<a
										href="#"
										aria-label="Pinterest"
										className="w-9 h-9 rounded-full bg-paper-tint border border-border-vellum hover:bg-[#fadcd0] text-primary flex items-center justify-center transition-colors"
									>
										<Palette className="w-4 h-4" />
									</a>
								</div>
							</div>
						</div>

						{/* Studio Creed */}
						<div className="p-6 bg-[#fadcd0]/30 border border-border-vellum rounded-sm text-center">
							<p className="font-serif text-lg italic text-primary mb-2">
								“Give us your words and we frame them into reality.”
							</p>
							<p className="text-xs text-secondary uppercase tracking-widest font-semibold">
								Handcrafted with raw botanical inks & deckle papers
							</p>
						</div>
					</div>

					{/* Right Column: Interactive Dossier Form (7 cols) */}
					<div className="lg:col-span-7 bg-surface-container-lowest p-8 lg:p-10 shadow-sm border border-border-vellum rounded-sm flex flex-col justify-between">
						{submitted ? (
							<div className="py-16 text-center space-y-4">
								<div className="w-16 h-16 rounded-full bg-[#fadcd0] text-primary mx-auto flex items-center justify-center">
									<CheckCircle className="w-8 h-8" />
								</div>
								<h3 className="font-serif text-3xl text-primary font-medium">Inquiry Received</h3>
								<p className="text-sm text-on-surface-variant font-light max-w-md mx-auto leading-relaxed">
									Thank you, <span className="font-semibold text-primary">{fullName || "Patron"}</span>. Our master calligrapher and atelier director will review your dossier and reach out within 12 operating hours.
								</p>
								<button
									onClick={() => setSubmitted(false)}
									className="mt-6 bg-[#fadcd0] hover:bg-primary hover:text-on-primary text-[#271811] px-6 py-2.5 text-xs font-semibold uppercase tracking-wider transition-colors rounded-sm"
								>
									Submit Another Dossier
								</button>
							</div>
						) : (
							<form onSubmit={handleSubmit} className="space-y-6">
								{/* Section Header */}
								<div className="flex items-center justify-between mb-2 pb-4 border-b border-border-vellum">
									<div>
										<span className="text-xs uppercase tracking-widest text-secondary block font-semibold">
											Inquiry Protocol
										</span>
										<h2 className="font-headline-md text-2xl text-primary font-serif mt-1">
											Bespoke Commission Dossier
										</h2>
									</div>
									<Sparkles className="w-6 h-6 text-secondary" />
								</div>

								{/* Category Pills */}
								<div>
									<label className="text-xs uppercase tracking-wider text-secondary block mb-3 font-semibold">
										1. Select Discipline of Interest
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
												className={`px-4 py-2 rounded-full text-xs uppercase tracking-wider transition-colors font-semibold ${
													selectedDiscipline === cat.id
														? "bg-primary text-on-primary"
														: "bg-[#fadcd0] text-[#271811] hover:bg-primary hover:text-on-primary"
												}`}
											>
												{cat.label}
											</button>
										))}
									</div>
								</div>

								{/* Row 1: Name & Email */}
								<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
									<div>
										<label className="block text-xs uppercase tracking-wider text-secondary mb-2 font-semibold">
											Patron Name *
										</label>
										<input
											required
											type="text"
											value={fullName}
											onChange={(e) => setFullName(e.target.value)}
											placeholder="e.g. Radhika Deshmukh"
											className="w-full bg-paper-tint border border-border-vellum px-4 py-3 text-sm font-light text-on-surface focus:outline-none focus:border-primary rounded-sm"
										/>
									</div>
									<div>
										<label className="block text-xs uppercase tracking-wider text-secondary mb-2 font-semibold">
											Email Address *
										</label>
										<input
											required
											type="email"
											value={email}
											onChange={(e) => setEmail(e.target.value)}
											placeholder="radhika@domain.com"
											className="w-full bg-paper-tint border border-border-vellum px-4 py-3 text-sm font-light text-on-surface focus:outline-none focus:border-primary rounded-sm"
										/>
									</div>
								</div>

								{/* Row 2: WhatsApp & Milestone Date */}
								<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
									<div>
										<label className="block text-xs uppercase tracking-wider text-secondary mb-2 font-semibold">
											WhatsApp Contact *
										</label>
										<div className="flex">
											<span className="inline-flex items-center px-3 bg-surface-container border-y border-l border-border-vellum text-secondary text-xs">
												+91
											</span>
											<input
												required
												type="tel"
												value={whatsapp}
												onChange={(e) => setWhatsapp(e.target.value)}
												placeholder="98230 11942"
												className="w-full bg-paper-tint border border-border-vellum px-4 py-3 text-sm font-light text-on-surface focus:outline-none focus:border-primary rounded-sm"
											/>
										</div>
									</div>
									<div>
										<label className="block text-xs uppercase tracking-wider text-secondary mb-2 font-semibold">
											Event / Inscription Deadline
										</label>
										<input
											type="date"
											value={deadline}
											onChange={(e) => setDeadline(e.target.value)}
											className="w-full bg-paper-tint border border-border-vellum px-4 py-3 text-sm font-light text-on-surface focus:outline-none focus:border-primary rounded-sm"
										/>
									</div>
								</div>

								{/* Row 3: Script Aesthetics */}
								<div>
									<label className="block text-xs uppercase tracking-wider text-secondary mb-2 font-semibold">
										2. Preferred Script Aesthetic
									</label>
									<div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
										{[
											{ id: "copperplate", title: "Copperplate", sub: "Classic Flourish" },
											{ id: "spencerian", title: "Spencerian", sub: "Delicate Hairlines" },
											{ id: "modern_roman", title: "Modern Roman", sub: "Minimal Serif" },
											{ id: "undecided", title: "Studio Choice", sub: "Artist Guidance" },
										].map((item) => (
											<div
												key={item.id}
												onClick={() => setScriptStyle(item.id)}
												className={`cursor-pointer p-3 text-center border rounded-sm transition-colors ${
													scriptStyle === item.id
														? "border-primary bg-paper-tint"
														: "border-border-vellum hover:bg-paper-tint/50"
												}`}
											>
												<span className="font-serif text-sm block italic mb-0.5">{item.title}</span>
												<span className="text-[10px] text-secondary tracking-widest uppercase font-semibold">
													{item.sub}
												</span>
											</div>
										))}
									</div>
								</div>

								{/* Row 4: Inscription Medium */}
								<div>
									<label className="block text-xs uppercase tracking-wider text-secondary mb-2 font-semibold">
										3. Inscription Medium / Presentation
									</label>
									<select
										value={medium}
										onChange={(e) => setMedium(e.target.value)}
										className="w-full bg-paper-tint border border-border-vellum px-4 py-3 text-sm font-light text-on-surface focus:outline-none focus:border-primary rounded-sm"
									>
										<option value="deckle">Deckle-Edge Cotton Rag Paper (Imported 300gsm)</option>
										<option value="glass_frame">Double Glass Floating Heirloom Frame (Brass or Teakwood)</option>
										<option value="engraving">Hand-Engraved Perfume / Luxury Spirits Bottle</option>
										<option value="invitations">Full Wedding Suite (Envelopes, Details & Monogram Wax Seals)</option>
										<option value="custom">Other Bespoke Artefact (Leather, Agate, Wooden Plank)</option>
									</select>
								</div>

								{/* Row 5: Notes */}
								<div>
									<label className="block text-xs uppercase tracking-wider text-secondary mb-2 font-semibold">
										4. Inscription Passage or Commission Details
									</label>
									<textarea
										rows={4}
										value={message}
										onChange={(e) => setMessage(e.target.value)}
										placeholder="Share your vows, requested names, quantity, or specific color schemes..."
										className="w-full bg-paper-tint border border-border-vellum px-4 py-3 text-sm font-light text-on-surface focus:outline-none focus:border-primary rounded-sm"
									></textarea>
								</div>

								<button
									type="submit"
									className="w-full bg-primary hover:bg-secondary text-on-primary py-4 text-xs font-semibold uppercase tracking-wider transition-colors rounded-sm inline-flex items-center justify-center gap-2"
								>
									<Send className="w-4 h-4" />
									Transmit Dossier to Atelier
								</button>
							</form>
						)}
					</div>
				</div>
			</section>
		</div>
	);
}
