"use client";

import {
	AlertCircle,
	ArrowLeft,
	CheckCircle2,
	ChevronRight,
	Clock,
	Copy,
	ExternalLink,
	Feather,
	Loader2,
	MapPin,
	Search,
	Truck,
} from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useCallback, useEffect, useState, useTransition } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatMoney } from "@/lib/money";

interface TimelineEvent {
	step: number;
	title: string;
	description: string;
	date: string;
	time: string;
	completed: boolean;
	current: boolean;
}

interface TrackedOrder {
	id: string;
	lookup: string;
	status: string;
	statusDescription: string;
	currentStep: number;
	isCanceled: boolean;
	isDelivered: boolean;
	isFulfilled: boolean;
	courier: {
		name: string;
		trackingNumber: string;
		trackingUrl: string | null;
	};
	estimatedDelivery: string;
	timeline: TimelineEvent[];
	shippingAddress: {
		name: string;
		city: string;
		state: string;
		postalCode: string;
		country: string;
		maskedLine: string;
	} | null;
	lineItems: Array<{
		id: string;
		name: string;
		quantity: number;
		price: number | string;
		image: string;
		customNote?: string | null;
	}>;
	summary: {
		itemsSubtotal?: number;
		subtotal: number;
		shipping: number;
		tax?: number;
		discount?: number;
		total: number;
		currency: string;
	};
	payment: {
		gateway: string;
		status: string;
	};
}

function OrderTrackingContent() {
	const searchParams = useSearchParams();
	const initialId = searchParams.get("id") || "";
	const initialContact = searchParams.get("contact") || "";

	const [orderId, setOrderId] = useState(initialId);
	const [contact, setContact] = useState(initialContact);
	const [isLoading, startTransition] = useTransition();
	const [order, setOrder] = useState<TrackedOrder | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [_copied, setCopied] = useState(false);

	const handleTrack = useCallback(
		(queryId?: string, queryContact?: string) => {
			const targetId = (queryId ?? orderId).trim();
			const targetContact = (queryContact ?? contact).trim();

			if (!targetId) {
				setError("Please enter your Order Reference or ID (e.g. TLI-0003).");
				return;
			}

			setError(null);

			startTransition(async () => {
				try {
					const res = await fetch("/api/order/track", {
						method: "POST",
						headers: { "Content-Type": "application/json" },
						body: JSON.stringify({
							orderId: targetId,
							contact: targetContact,
						}),
					});

					const data = await res.json();

					if (!res.ok || !data.success) {
						setOrder(null);
						setError(
							data.error ||
								"We couldn't find an order matching these details. Please check your Reference ID and contact number/email.",
						);
					} else {
						setOrder(data.order);
						setError(null);
						if (data.order?.lookup) {
							setOrderId(data.order.lookup);
							if (typeof window !== "undefined") {
								try {
									sessionStorage.setItem("tli_last_order_lookup", data.order.lookup);
									if (targetContact) {
										sessionStorage.setItem("tli_last_order_contact", targetContact);
									}
									if (data.order.id) {
										sessionStorage.setItem(`tli_map_${data.order.id}`, data.order.lookup);
									}
									const url = new URL(window.location.href);
									url.searchParams.set("id", data.order.lookup);
									if (targetContact) {
										url.searchParams.set("contact", targetContact);
									}
									window.history.replaceState({}, "", url.toString());
								} catch {}
							}
						}
					}
				} catch (_err: any) {
					setOrder(null);
					setError("Network error. Unable to connect to order tracking service. Please try again.");
				}
			});
		},
		[orderId, contact],
	);

	// Auto-fetch if order ID is present in URL or recent session
	useEffect(() => {
		let effId = initialId;
		let effContact = initialContact;

		if (typeof window !== "undefined") {
			// If initial ID is raw Medusa format (order_...), check if we have mapped TLI lookup
			if (effId && effId.startsWith("order_")) {
				const mapped = sessionStorage.getItem(`tli_map_${effId}`);
				if (mapped) {
					effId = mapped;
					setOrderId(mapped);
				}
			} else if (!effId) {
				const savedId = sessionStorage.getItem("tli_last_order_lookup");
				if (savedId) {
					effId = savedId;
					setOrderId(savedId);
				}
			}

			if (!effContact) {
				const savedContact = sessionStorage.getItem("tli_last_order_contact");
				if (savedContact) {
					effContact = savedContact;
					setContact(savedContact);
				}
			}
		}

		if (effId) {
			handleTrack(effId, effContact);
		}
	}, [initialId, initialContact, handleTrack]);

	const handleCopyAWB = (awb: string) => {
		navigator.clipboard.writeText(awb);
		setCopied(true);
		toast.success("Tracking number copied to clipboard!");
		setTimeout(() => setCopied(false), 2500);
	};

	return (
		<div className="min-h-screen bg-paper-tint/30 py-10 sm:py-12 px-4 sm:px-6 lg:px-8">
			<div className="max-w-4xl mx-auto">
				{/* Navigation Breadcrumb */}
				<div className="mb-6 flex items-center justify-between">
					<Link
						href="/"
						className="inline-flex items-center text-sm text-secondary hover:text-foreground transition-colors group"
					>
						<ArrowLeft className="h-4 w-4 mr-1.5 transition-transform group-hover:-translate-x-1" />
						Back to Atelier Store
					</Link>
					<span className="text-xs uppercase tracking-widest text-secondary font-serif">
						The Letter Ink Concierge
					</span>
				</div>

				{/* Hero Header */}
				<div className="text-center mb-10">
					<div className="inline-flex items-center justify-center p-3 rounded-full bg-paper-tint border border-border-vellum mb-4 shadow-xs">
						<Feather className="h-6 w-6 text-primary" />
					</div>
					<h1 className="text-3xl sm:text-4xl font-serif font-medium tracking-tight text-foreground">
						Track Your Atelier Order
					</h1>
					<p className="mt-3 text-sm sm:text-base text-secondary max-w-xl mx-auto leading-relaxed">
						Follow the journey of your bespoke calligraphy, artisanal stationery, and wax suites from our
						studio to your doorstep.
					</p>
				</div>

				{/* Tracking Input Card */}
				<div className="bg-card border border-border-vellum/90 rounded-xl p-6 sm:p-8 shadow-xs mb-8">
					<form
						onSubmit={(e) => {
							e.preventDefault();
							handleTrack();
						}}
						className="space-y-4 sm:space-y-0 sm:grid sm:grid-cols-12 sm:gap-4 items-end"
					>
						<div className="sm:col-span-5 space-y-1.5">
							<Label
								htmlFor="orderId"
								className="text-xs font-medium text-foreground uppercase tracking-wider block"
							>
								Order Reference or ID *
							</Label>
							<div className="relative">
								<Input
									id="orderId"
									placeholder="e.g. TLI-0003 or TLI-1001"
									value={orderId}
									onChange={(e) => setOrderId(e.target.value)}
									className="pl-9 h-11 border-border-vellum focus-visible:ring-primary text-sm"
									required
								/>
								<Search className="h-4 w-4 text-secondary/70 absolute left-3 top-3.5" />
							</div>
						</div>

						<div className="sm:col-span-4 space-y-1.5">
							<Label
								htmlFor="contact"
								className="text-xs font-medium text-foreground uppercase tracking-wider block"
							>
								Email or 10-Digit Mobile *
							</Label>
							<Input
								id="contact"
								placeholder="e.g. 9876543210 or email"
								value={contact}
								onChange={(e) => setContact(e.target.value)}
								className="h-11 border-border-vellum focus-visible:ring-primary text-sm"
								required
							/>
						</div>

						<div className="sm:col-span-3">
							<Button
								type="submit"
								disabled={isLoading}
								className="w-full h-11 bg-primary hover:bg-brand-script-dark text-on-primary font-medium text-sm transition-all shadow-xs cursor-pointer"
							>
								{isLoading ? (
									<>
										<Loader2 className="h-4 w-4 mr-2 animate-spin" />
										Locating...
									</>
								) : (
									<>
										<Truck className="h-4 w-4 mr-2" />
										Track Order
									</>
								)}
							</Button>
						</div>
					</form>

					{/* Quick instructions / tip */}
					<div className="mt-4 pt-4 border-t border-border-vellum/60 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-secondary">
						<span>Email or phone number is required to verify and protect your private order details.</span>
						<span className="text-secondary/80">All India Express Shipping</span>
					</div>

					{error && (
						<div
							role="alert"
							className="mt-4 p-4 rounded-lg bg-red-50/80 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-red-900 dark:text-red-300 text-sm flex items-start gap-3"
						>
							<AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
							<div>
								<p className="font-serif font-medium text-sm">We couldn't find that order</p>
								<p className="mt-1 text-xs text-red-800 dark:text-red-400 leading-relaxed">{error}</p>
							</div>
						</div>
					)}
				</div>

				{/* Order Details Result */}
				{order && (
					<div className="space-y-6 animate-in fade-in-50 duration-300">
						{/* Status Summary Banner */}
						<div className="bg-card border border-border-vellum/90 rounded-xl p-6 sm:p-8 shadow-xs">
							<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border-vellum/60">
								<div>
									<div className="flex items-center gap-2.5">
										<h2 className="text-xl sm:text-2xl font-serif font-medium text-foreground">
											Order #{order.lookup}
										</h2>
										<Badge
											variant="outline"
											className={`font-sans text-xs px-2.5 py-0.5 rounded-full ${
												order.isDelivered
													? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-400 border-emerald-300 dark:border-emerald-800"
													: order.isCanceled
														? "bg-red-50 dark:bg-red-950/40 text-red-800 dark:text-red-400 border-red-300 dark:border-red-800"
														: "bg-paper-tint text-primary border-border-vellum"
											}`}
										>
											{order.status}
										</Badge>
									</div>
									<p className="text-sm text-secondary mt-1.5 leading-relaxed">{order.statusDescription}</p>
								</div>

								<div className="text-left sm:text-right shrink-0 bg-paper-tint/60 sm:bg-transparent p-3 sm:p-0 rounded-lg">
									<span className="text-xs uppercase tracking-wider text-secondary block font-sans">
										Estimated Delivery
									</span>
									<span className="text-sm sm:text-base font-medium text-foreground font-serif">
										{order.estimatedDelivery}
									</span>
								</div>
							</div>

							{/* Progress Milestones Timeline */}
							<div className="mt-8">
								<h3 className="text-xs uppercase tracking-wider text-secondary font-semibold mb-6">
									Artisanal Fulfillment Progress
								</h3>

								<div className="relative">
									<ol className="space-y-8" aria-label="Order fulfillment milestones">
										{order.timeline.map((event, idx) => {
											const isLast = idx === order.timeline.length - 1;
											return (
												<li
													key={event.step}
													className="relative flex items-start group"
													aria-current={event.current ? "step" : undefined}
												>
													{/* Vertical line connecting steps */}
													{!isLast && (
														<div
															className={`absolute left-4 top-8 bottom-0 w-0.5 -ml-[1px] ${
																event.completed ? "bg-primary" : "bg-border-vellum"
															}`}
														/>
													)}

													{/* Step Icon Indicator */}
													<div
														className={`relative z-10 flex h-8 w-8 items-center justify-center rounded-full shrink-0 transition-all ${
															event.completed
																? "bg-primary text-on-primary shadow-xs ring-4 ring-card"
																: event.current
																	? "bg-paper-tint text-primary border-2 border-primary ring-4 ring-paper-tint"
																	: "bg-muted text-muted-foreground border border-border-vellum ring-4 ring-card"
														}`}
													>
														{event.completed ? (
															<CheckCircle2 className="h-4 w-4" />
														) : event.current ? (
															<Clock className="h-4 w-4 motion-safe:animate-pulse" />
														) : (
															<span className="text-xs font-semibold tabular-nums">{event.step}</span>
														)}
													</div>

													{/* Content */}
													<div className="ml-4 flex-1">
														<div className="flex flex-col sm:flex-row sm:items-center justify-between">
															<h4
																className={`text-sm font-medium ${
																	event.completed || event.current
																		? "text-foreground font-serif text-base"
																		: "text-secondary"
																}`}
															>
																{event.title}
															</h4>
															<span className="text-xs text-secondary/80 sm:text-right mt-0.5 sm:mt-0 font-sans tabular-nums">
																{event.date} {event.time && `• ${event.time}`}
															</span>
														</div>
														<p className="text-xs sm:text-sm text-secondary mt-1 leading-relaxed">
															{event.description}
														</p>
													</div>
												</li>
											);
										})}
									</ol>
								</div>
							</div>

							{/* Courier & AWB Box */}
							<div className="mt-8 p-5 rounded-lg bg-paper-tint/60 border border-border-vellum/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
								<div className="flex items-center gap-3.5">
									<div className="h-10 w-10 rounded-sm bg-card border border-border-vellum flex items-center justify-center text-primary shadow-xs">
										<Truck className="h-5 w-5" />
									</div>
									<div>
										<span className="text-xs text-secondary uppercase tracking-wider block font-sans">
											Shipping Partner & Waybill
										</span>
										<div className="flex items-center gap-2 mt-0.5">
											<span className="text-sm font-semibold text-foreground">{order.courier.name}</span>
											<span className="text-xs text-secondary/60">•</span>
											<span className="text-xs tabular-nums font-medium text-foreground bg-card px-2 py-0.5 rounded border border-border-vellum">
												{order.courier.trackingNumber}
											</span>
											{order.courier.trackingNumber !== "AWB Generating..." && (
												<button
													type="button"
													onClick={() => handleCopyAWB(order.courier.trackingNumber)}
													className="text-secondary hover:text-primary transition-colors p-1"
													title="Copy AWB number"
												>
													<Copy className="h-3.5 w-3.5" />
												</button>
											)}
										</div>
									</div>
								</div>

								{order.courier.trackingUrl ? (
									<Button
										asChild
										variant="outline"
										className="border-border-vellum text-foreground hover:bg-card text-xs h-9 rounded-sm"
									>
										<a
											href={order.courier.trackingUrl}
											target="_blank"
											rel="noopener noreferrer"
											className="inline-flex items-center gap-1.5"
										>
											Track on Courier Site
											<ExternalLink className="h-3.5 w-3.5" />
										</a>
									</Button>
								) : (
									<span className="text-xs text-secondary italic">
										Courier tracking link activates once parcel is dispatched from our atelier
									</span>
								)}
							</div>
						</div>

						{/* Atelier Order Items & Shipping Address Grid */}
						<div className="grid grid-cols-1 md:grid-cols-12 gap-6">
							{/* Line Items */}
							<div className="md:col-span-7 bg-card border border-border-vellum/90 rounded-xl p-6 shadow-xs">
								<h3 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-4 font-serif">
									Bespoke Order Items ({order.lineItems.length})
								</h3>

								<div className="divide-y divide-border-vellum/60">
									{order.lineItems.map((item) => (
										<div key={item.id} className="py-3.5 flex items-center gap-3.5">
											<div className="relative h-14 w-14 rounded-sm bg-muted border border-border-vellum overflow-hidden shrink-0">
												<img src={item.image} alt={item.name} className="h-full w-full object-cover" />
											</div>
											<div className="flex-1 min-w-0">
												<h4 className="text-sm font-medium text-foreground truncate">{item.name}</h4>
												<p className="text-xs text-secondary mt-0.5">Quantity: {item.quantity}</p>
												{item.customNote && (
													<p className="text-xs text-brand-script italic mt-0.5 truncate">
														Custom Lettering: "{item.customNote}"
													</p>
												)}
											</div>
											<div className="text-right">
												<span className="text-sm font-medium text-foreground tabular-nums">
													{formatMoney({
														amount: BigInt(Math.round(Number(item.price))),
														currency: "INR",
														locale: "en-IN",
													})}
												</span>
											</div>
										</div>
									))}
								</div>

								{/* Detailed Bill Subtotals */}
								{(() => {
									const calculatedItemsSubtotal =
										order.summary.itemsSubtotal ??
										order.lineItems.reduce(
											(sum, it) => sum + (Number(it.price) || 0) * (it.quantity || 1),
											0,
										);
									const totalItemsCount = order.lineItems.reduce(
										(sum, it) => sum + (it.quantity || 1),
										0,
									);
									const shippingPrice = Number(order.summary.shipping || 0);
									const taxAmount = Number(order.summary.tax || 0);
									const discountAmount = Number(order.summary.discount || 0);
									const finalTotal =
										Number(order.summary.total) ||
										calculatedItemsSubtotal + shippingPrice + taxAmount - discountAmount;

									return (
										<div className="mt-5 pt-4 border-t border-border-vellum space-y-2.5 text-xs text-secondary bg-paper-tint/40 -mx-6 -mb-6 p-6 rounded-b-xl">
											<div className="flex items-center justify-between pb-2 border-b border-border-vellum/60">
												<span className="font-serif uppercase tracking-wider text-xs font-semibold text-foreground">
													Detailed Bill Breakdown
												</span>
												<span className="text-xs text-secondary/70">
													Currency: {order.summary.currency || "INR"} (₹)
												</span>
											</div>

											{/* Products / Items Subtotal */}
											<div className="flex justify-between items-center text-secondary">
												<span className="flex items-center gap-1.5">
													<span>Product Price Subtotal</span>
													<span className="text-xs text-secondary/70">
														({totalItemsCount} {totalItemsCount === 1 ? "item" : "items"})
													</span>
												</span>
												<span className="font-medium text-foreground tabular-nums text-sm">
													{formatMoney({
														amount: BigInt(Math.round(calculatedItemsSubtotal)),
														currency: "INR",
														locale: "en-IN",
													})}
												</span>
											</div>

											{/* Delivery / Shipping Charges */}
											<div className="flex justify-between items-center text-secondary">
												<div className="flex items-center gap-1.5">
													<span>Standard Express Delivery</span>
													<span className="text-[11px] bg-paper-tint text-primary px-1.5 py-0.5 rounded border border-border-vellum">
														All India
													</span>
												</div>
												<span className="font-medium text-foreground tabular-nums">
													{shippingPrice === 0
														? "FREE (Complimentary)"
														: formatMoney({
																amount: BigInt(Math.round(shippingPrice)),
																currency: "INR",
																locale: "en-IN",
															})}
												</span>
											</div>

											{/* Bespoke Packaging */}
											<div className="flex justify-between items-center text-secondary">
												<div className="flex items-center gap-1.5">
													<span>Atelier Keepsake Packaging & Wax Seal</span>
													<span className="text-[11px] bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-400 px-1.5 py-0.5 rounded font-medium border border-emerald-300 dark:border-emerald-800">
														Signature
													</span>
												</div>
												<span className="font-medium text-emerald-700 dark:text-emerald-400">Complimentary</span>
											</div>

											{/* Taxes & GST */}
											<div className="flex justify-between items-center text-secondary">
												<span>Estimated Taxes & GST</span>
												<span className="font-medium text-secondary tabular-nums">
													{taxAmount > 0
														? formatMoney({
																amount: BigInt(Math.round(taxAmount)),
																currency: "INR",
																locale: "en-IN",
															})
														: "₹0 (Included in price)"}
												</span>
											</div>

											{/* Discount if present */}
											{discountAmount > 0 && (
												<div className="flex justify-between items-center text-emerald-700 dark:text-emerald-400">
													<span>Promotional Privilege Discount</span>
													<span className="font-medium tabular-nums">
														-
														{formatMoney({
															amount: BigInt(Math.round(discountAmount)),
															currency: "INR",
															locale: "en-IN",
														})}
													</span>
												</div>
											)}

											{/* Total Paid */}
											<div className="flex justify-between items-baseline pt-3 border-t border-border-vellum text-foreground font-serif">
												<div className="flex flex-col">
													<span className="text-sm sm:text-base font-bold text-foreground">
														Total Amount Paid
													</span>
													<span className="text-xs font-sans font-normal text-secondary mt-0.5">
														Secured & verified via {order.payment?.gateway || "Razorpay"}
													</span>
												</div>
												<span className="text-lg sm:text-xl font-bold text-primary tabular-nums">
													{formatMoney({
														amount: BigInt(Math.round(finalTotal)),
														currency: "INR",
														locale: "en-IN",
													})}
												</span>
											</div>
										</div>
									);
								})()}
							</div>

							{/* Delivery Destination & Support */}
							<div className="md:col-span-5 space-y-6">
								{/* Shipping destination */}
								{order.shippingAddress && (
									<div className="bg-card border border-border-vellum/90 rounded-xl p-6 shadow-xs">
										<div className="flex items-center gap-2 text-foreground mb-3">
											<MapPin className="h-4 w-4 text-primary" />
											<h3 className="text-sm font-semibold uppercase tracking-wider font-serif">
												Delivery Destination
											</h3>
										</div>
										<div className="text-xs sm:text-sm text-secondary space-y-1">
											<p className="font-medium text-foreground">{order.shippingAddress.name}</p>
											<p>{order.shippingAddress.maskedLine}</p>
											<p className="text-xs text-secondary/80 uppercase tracking-widest mt-1">
												India (Verified Delivery Zone)
											</p>
										</div>
									</div>
								)}

								{/* Need Assistance Card */}
								<div className="bg-primary text-on-primary rounded-xl p-6 shadow-xs relative overflow-hidden">
									<div className="relative z-10">
										<h3 className="text-base font-serif font-medium text-on-primary">
											Need Dispatch Assistance?
										</h3>
										<p className="text-xs text-on-primary/80 mt-1.5 leading-relaxed font-light">
											Have delivery instructions or need urgent dispatch for a wedding date? Contact our
											atelier concierge.
										</p>
										<div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between">
											<Link
												href="/contact"
												className="inline-flex items-center text-xs text-tertiary-fixed-dim hover:text-white font-medium transition-colors"
											>
												Contact Studio Team
												<ChevronRight className="h-3.5 w-3.5 ml-1" />
											</Link>
											<span className="text-xs text-on-primary/70">Response within 2 hrs</span>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				)}
			</div>
		</div>
	);
}

function OrderTrackingSkeleton() {
	return (
		<div className="min-h-screen bg-paper-tint/30 py-16 px-4 flex items-center justify-center">
			<div className="flex flex-col items-center gap-3">
				<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
				<p className="text-xs text-secondary font-serif">Loading Atelier Tracking...</p>
			</div>
		</div>
	);
}

export default function OrderTrackingPage() {
	return (
		<Suspense fallback={<OrderTrackingSkeleton />}>
			<OrderTrackingContent />
		</Suspense>
	);
}
