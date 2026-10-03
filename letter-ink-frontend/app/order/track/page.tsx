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
		subtotal: number;
		shipping: number;
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
				setError("Please enter your Order ID or Reference number.");
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
						setError(data.error || "Unable to find order details. Please check your credentials.");
					} else {
						setOrder(data.order);
						setError(null);
					}
				} catch (_err: any) {
					setOrder(null);
					setError("Network error. Could not connect to order tracking service.");
				}
			});
		},
		[orderId, contact],
	);

	// Auto-fetch if order ID is present in URL
	useEffect(() => {
		if (initialId) {
			handleTrack(initialId, initialContact);
		}
	}, [initialId, initialContact, handleTrack]);

	const handleCopyAWB = (awb: string) => {
		navigator.clipboard.writeText(awb);
		setCopied(true);
		toast.success("Tracking number copied to clipboard!");
		setTimeout(() => setCopied(false), 2500);
	};

	return (
		<div className="min-h-screen bg-stone-50/50 py-12 px-4 sm:px-6 lg:px-8">
			<div className="max-w-4xl mx-auto">
				{/* Navigation Breadcrumb */}
				<div className="mb-6 flex items-center justify-between">
					<Link
						href="/"
						className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors group"
					>
						<ArrowLeft className="h-4 w-4 mr-1.5 transition-transform group-hover:-translate-x-1" />
						Back to Atelier Store
					</Link>
					<span className="text-xs uppercase tracking-widest text-muted-foreground font-serif">
						The Letter Ink Concierge
					</span>
				</div>

				{/* Hero Header */}
				<div className="text-center mb-10">
					<div className="inline-flex items-center justify-center p-3 rounded-full bg-amber-50 border border-amber-200/60 mb-4 shadow-sm">
						<Feather className="h-6 w-6 text-amber-800" />
					</div>
					<h1 className="text-3xl sm:text-4xl font-serif font-medium tracking-tight text-stone-900">
						Track Your Atelier Order
					</h1>
					<p className="mt-3 text-sm sm:text-base text-stone-600 max-w-xl mx-auto leading-relaxed">
						Follow the journey of your bespoke calligraphy, artisanal stationery, and wax suites from our
						studio to your doorstep.
					</p>
				</div>

				{/* Tracking Input Card */}
				<div className="bg-white border border-stone-200/80 rounded-2xl p-6 sm:p-8 shadow-sm mb-8 backdrop-blur-sm">
					<form
						onSubmit={(e) => {
							e.preventDefault();
							handleTrack();
						}}
						className="space-y-4 sm:space-y-0 sm:grid sm:grid-cols-12 sm:gap-4 items-end"
					>
						<div className="sm:col-span-5">
							<Label
								htmlFor="orderId"
								className="text-xs font-medium text-stone-700 uppercase tracking-wider mb-1.5 block"
							>
								Order Reference or ID *
							</Label>
							<div className="relative">
								<Input
									id="orderId"
									placeholder="e.g. TLI-1001 or order_01JC..."
									value={orderId}
									onChange={(e) => setOrderId(e.target.value)}
									className="pl-9 h-11 border-stone-200 focus-visible:ring-stone-800 text-sm"
									required
								/>
								<Search className="h-4 w-4 text-stone-400 absolute left-3 top-3.5" />
							</div>
						</div>

						<div className="sm:col-span-4">
							<Label
								htmlFor="contact"
								className="text-xs font-medium text-stone-700 uppercase tracking-wider mb-1.5 block"
							>
								Email or 10-Digit Mobile
							</Label>
							<Input
								id="contact"
								placeholder="e.g. aarav@gmail.com or 9876543210"
								value={contact}
								onChange={(e) => setContact(e.target.value)}
								className="h-11 border-stone-200 focus-visible:ring-stone-800 text-sm"
							/>
						</div>

						<div className="sm:col-span-3">
							<Button
								type="submit"
								disabled={isLoading}
								className="w-full h-11 bg-stone-900 hover:bg-stone-800 text-white font-medium text-sm transition-all shadow-sm"
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
					<div className="mt-4 pt-4 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
						<span>Tip: Check your order confirmation SMS or email for your reference ID.</span>
						<span className="hidden sm:inline text-stone-400">All India Express Shipping</span>
					</div>

					{error && (
						<div className="mt-4 p-4 rounded-xl bg-rose-50/80 border border-rose-200 text-rose-800 text-sm flex items-start gap-3">
							<AlertCircle className="h-5 w-5 text-rose-600 shrink-0 mt-0.5" />
							<div>
								<p className="font-medium">Order Search Note</p>
								<p className="mt-0.5 text-xs text-rose-700 leading-relaxed">{error}</p>
							</div>
						</div>
					)}
				</div>

				{/* Order Details Result */}
				{order && (
					<div className="space-y-6 animate-in fade-in-50 duration-300">
						{/* Status Summary Banner */}
						<div className="bg-white border border-stone-200/80 rounded-2xl p-6 sm:p-8 shadow-sm">
							<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-stone-100">
								<div>
									<div className="flex items-center gap-2.5">
										<h2 className="text-xl sm:text-2xl font-serif font-medium text-stone-900">
											Order #{order.lookup}
										</h2>
										<Badge
											variant="outline"
											className={`font-sans text-xs px-2.5 py-0.5 rounded-full ${
												order.isDelivered
													? "bg-emerald-50 text-emerald-800 border-emerald-300"
													: order.isCanceled
														? "bg-rose-50 text-rose-800 border-rose-300"
														: "bg-amber-50 text-amber-900 border-amber-300"
											}`}
										>
											{order.status}
										</Badge>
									</div>
									<p className="text-sm text-stone-600 mt-1.5 leading-relaxed">{order.statusDescription}</p>
								</div>

								<div className="text-left sm:text-right shrink-0 bg-stone-50 sm:bg-transparent p-3 sm:p-0 rounded-xl">
									<span className="text-xs uppercase tracking-wider text-stone-500 block font-sans">
										Estimated Delivery
									</span>
									<span className="text-sm sm:text-base font-medium text-stone-900 font-serif">
										{order.estimatedDelivery}
									</span>
								</div>
							</div>

							{/* Progress Milestones Timeline */}
							<div className="mt-8">
								<h3 className="text-xs uppercase tracking-wider text-stone-500 font-semibold mb-6">
									Artisanal Fulfillment Progress
								</h3>

								<div className="relative">
									<div className="space-y-8">
										{order.timeline.map((event, idx) => {
											const isLast = idx === order.timeline.length - 1;
											return (
												<div key={event.step} className="relative flex items-start group">
													{/* Vertical line connecting steps */}
													{!isLast && (
														<div
															className={`absolute left-4 top-8 bottom-0 w-0.5 -ml-[1px] ${
																event.completed ? "bg-stone-900" : "bg-stone-200"
															}`}
														/>
													)}

													{/* Step Icon Indicator */}
													<div
														className={`relative z-10 flex h-8 w-8 items-center justify-center rounded-full shrink-0 transition-all ${
															event.completed
																? "bg-stone-900 text-white shadow-sm ring-4 ring-white"
																: event.current
																	? "bg-amber-100 text-amber-900 border-2 border-amber-500 ring-4 ring-amber-50"
																	: "bg-stone-100 text-stone-400 border border-stone-200 ring-4 ring-white"
														}`}
													>
														{event.completed ? (
															<CheckCircle2 className="h-4 w-4" />
														) : event.current ? (
															<Clock className="h-4 w-4 animate-pulse" />
														) : (
															<span className="text-xs font-semibold">{event.step}</span>
														)}
													</div>

													{/* Content */}
													<div className="ml-4 flex-1">
														<div className="flex flex-col sm:flex-row sm:items-center justify-between">
															<h4
																className={`text-sm font-medium ${
																	event.completed || event.current
																		? "text-stone-900 font-serif text-base"
																		: "text-stone-500"
																}`}
															>
																{event.title}
															</h4>
															<span className="text-xs text-stone-400 sm:text-right mt-0.5 sm:mt-0 font-sans">
																{event.date} {event.time && `• ${event.time}`}
															</span>
														</div>
														<p className="text-xs sm:text-sm text-stone-600 mt-1 leading-relaxed">
															{event.description}
														</p>
													</div>
												</div>
											);
										})}
									</div>
								</div>
							</div>

							{/* Courier & AWB Box */}
							<div className="mt-8 p-5 rounded-xl bg-stone-50 border border-stone-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
								<div className="flex items-center gap-3.5">
									<div className="h-10 w-10 rounded-lg bg-white border border-stone-200 flex items-center justify-center text-stone-800 shadow-2xs">
										<Truck className="h-5 w-5" />
									</div>
									<div>
										<span className="text-xs text-stone-500 uppercase tracking-wider block font-sans">
											Shipping Partner & Waybill
										</span>
										<div className="flex items-center gap-2 mt-0.5">
											<span className="text-sm font-semibold text-stone-900">{order.courier.name}</span>
											<span className="text-xs text-stone-400">•</span>
											<span className="text-xs font-mono font-medium text-stone-700 bg-white px-2 py-0.5 rounded border border-stone-200">
												{order.courier.trackingNumber}
											</span>
											{order.courier.trackingNumber !== "AWB Generating..." && (
												<button
													type="button"
													onClick={() => handleCopyAWB(order.courier.trackingNumber)}
													className="text-stone-500 hover:text-stone-800 transition-colors p-1"
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
										className="border-stone-300 text-stone-800 hover:bg-white text-xs h-9"
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
									<span className="text-xs text-stone-500 italic">
										Live GPS tracker activates on courier dispatch
									</span>
								)}
							</div>
						</div>

						{/* Atelier Order Items & Shipping Address Grid */}
						<div className="grid grid-cols-1 md:grid-cols-12 gap-6">
							{/* Line Items */}
							<div className="md:col-span-7 bg-white border border-stone-200/80 rounded-2xl p-6 shadow-sm">
								<h3 className="text-sm font-semibold text-stone-900 uppercase tracking-wider mb-4 font-serif">
									Bespoke Order Items ({order.lineItems.length})
								</h3>

								<div className="divide-y divide-stone-100">
									{order.lineItems.map((item) => (
										<div key={item.id} className="py-3.5 flex items-center gap-3.5">
											<div className="relative h-14 w-14 rounded-lg bg-stone-100 border border-stone-200 overflow-hidden shrink-0">
												<img src={item.image} alt={item.name} className="h-full w-full object-cover" />
											</div>
											<div className="flex-1 min-w-0">
												<h4 className="text-sm font-medium text-stone-900 truncate">{item.name}</h4>
												<p className="text-xs text-stone-500 mt-0.5">Quantity: {item.quantity}</p>
												{item.customNote && (
													<p className="text-xs text-amber-900/80 italic mt-0.5 truncate">
														Custom Lettering: "{item.customNote}"
													</p>
												)}
											</div>
											<div className="text-right">
												<span className="text-sm font-medium text-stone-900">
													₹{Number(item.price).toLocaleString("en-IN")}
												</span>
											</div>
										</div>
									))}
								</div>

								{/* Subtotals */}
								<div className="mt-4 pt-4 border-t border-stone-100 space-y-1.5 text-xs text-stone-600">
									<div className="flex justify-between">
										<span>Subtotal</span>
										<span>₹{Number(order.summary.subtotal).toLocaleString("en-IN")}</span>
									</div>
									<div className="flex justify-between">
										<span>Standard Express Shipping</span>
										<span>
											{order.summary.shipping === 0
												? "FREE"
												: `₹${Number(order.summary.shipping).toLocaleString("en-IN")}`}
										</span>
									</div>
									<div className="flex justify-between text-sm font-semibold text-stone-900 pt-2 border-t border-stone-100 font-serif">
										<span>Total Paid</span>
										<span>₹{Number(order.summary.total).toLocaleString("en-IN")}</span>
									</div>
								</div>
							</div>

							{/* Delivery Destination & Support */}
							<div className="md:col-span-5 space-y-6">
								{/* Shipping destination */}
								{order.shippingAddress && (
									<div className="bg-white border border-stone-200/80 rounded-2xl p-6 shadow-sm">
										<div className="flex items-center gap-2 text-stone-900 mb-3">
											<MapPin className="h-4 w-4 text-stone-600" />
											<h3 className="text-sm font-semibold uppercase tracking-wider font-serif">
												Delivery Destination
											</h3>
										</div>
										<div className="text-xs sm:text-sm text-stone-600 space-y-1">
											<p className="font-medium text-stone-900">{order.shippingAddress.name}</p>
											<p>{order.shippingAddress.maskedLine}</p>
											<p className="text-xs text-stone-400 uppercase tracking-widest mt-1">
												India (Verified Delivery Zone)
											</p>
										</div>
									</div>
								)}

								{/* Need Assistance Card */}
								<div className="bg-stone-900 text-stone-100 rounded-2xl p-6 shadow-sm relative overflow-hidden">
									<div className="relative z-10">
										<h3 className="text-base font-serif font-medium text-stone-50">
											Need Dispatch Assistance?
										</h3>
										<p className="text-xs text-stone-300 mt-1.5 leading-relaxed">
											Have delivery instructions or need urgent dispatch for a wedding date? Contact our
											atelier concierge.
										</p>
										<div className="mt-4 pt-4 border-t border-stone-800 flex items-center justify-between">
											<Link
												href="/contact"
												className="inline-flex items-center text-xs text-amber-300 hover:text-amber-200 font-medium transition-colors"
											>
												Contact Studio Team
												<ChevronRight className="h-3.5 w-3.5 ml-1" />
											</Link>
											<span className="text-xs text-stone-400">Response within 2 hrs</span>
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
		<div className="min-h-screen bg-stone-50 py-16 px-4 flex items-center justify-center">
			<div className="flex flex-col items-center gap-3">
				<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-stone-800"></div>
				<p className="text-xs text-stone-500 font-serif">Loading Atelier Tracking...</p>
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
