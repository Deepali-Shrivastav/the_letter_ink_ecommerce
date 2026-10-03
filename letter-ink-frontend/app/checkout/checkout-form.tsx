"use client";

import { AlertCircle, ArrowLeft, Loader2, Lock, Package, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { toast } from "sonner";
import { useCart } from "@/app/cart/cart-context";
import { CartPromoCode } from "@/app/cart/cart-promo";
import { type ShippingAddressData, ShippingAddressForm } from "@/components/checkout/shipping-address-form";
import { Button } from "@/components/ui/button";
import { formatMoney } from "@/lib/money";

interface CheckoutFormProps {
	initialCart: any;
	storeConfig: {
		currency: string;
		locale: string;
	};
}

export function CheckoutForm({ initialCart, storeConfig }: CheckoutFormProps) {
	const router = useRouter();
	const { cart: contextCart } = useCart();
	const cart = contextCart || initialCart;

	const [isProcessing, setIsProcessing] = useState(false);

	const [shippingAddress, setShippingAddress] = useState<ShippingAddressData | null>(null);
	const [isAddressValid, setIsAddressValid] = useState(false);

	const items = cart?.lineItems ?? [];
	const rawSubtotal = cart?.subtotal ? Number(cart.subtotal) : 0;
	const discountTotal = cart?.discountTotal ? Number(cart.discountTotal) : 0;
	const grandTotal = Math.max(0, rawSubtotal - discountTotal);

	const handleAddressChange = useCallback((data: ShippingAddressData, isValid: boolean) => {
		setShippingAddress(data);
		setIsAddressValid(isValid);
	}, []);

	const loadRazorpayScript = (): Promise<boolean> => {
		return new Promise((resolve) => {
			if (typeof window !== "undefined" && (window as any).Razorpay) {
				resolve(true);
				return;
			}
			const existing = document.querySelector('script[src="https://checkout.razorpay.com/v1/checkout.js"]');
			if (existing && (window as any).Razorpay) {
				resolve(true);
				return;
			}
			const script = document.createElement("script");
			script.src = "https://checkout.razorpay.com/v1/checkout.js";
			script.async = true;
			script.onload = () => resolve(true);
			script.onerror = () => resolve(false);
			document.body.appendChild(script);
		});
	};

	// Directly launch Razorpay
	const handleLaunchRazorpay = async () => {
		if (!items.length || isProcessing) return;

		if (!isAddressValid || !shippingAddress) {
			toast.error("Please fill in your delivery address before proceeding to payment.", {
				icon: <AlertCircle className="h-4 w-4 text-rose-500" />,
			});
			return;
		}

		setIsProcessing(true);

		try {
			await loadRazorpayScript();
			const res = await fetch("/api/checkout/razorpay/create-order", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					cartId: cart.id,
					amount: grandTotal,
					customer: {
						email: shippingAddress.email,
						phone: shippingAddress.phone,
						name: `${shippingAddress.firstName} ${shippingAddress.lastName}`.trim(),
					},
					notes: {
						shipping_address: `${shippingAddress.address1}, ${shippingAddress.city}, ${shippingAddress.province} - ${shippingAddress.postalCode}`,
						instructions: shippingAddress.deliveryNotes || "Standard Delivery",
					},
				}),
			});

			const orderData = await res.json();
			if (!res.ok || !orderData.success) {
				throw new Error(orderData.error || "Failed to initialize Razorpay checkout");
			}

			// If live Razorpay checkout.js is available:
			if (typeof (window as any).Razorpay === "function") {
				const options = {
					key: orderData.keyId,
					amount: orderData.amount,
					currency: orderData.currency || "INR",
					name: "The Letter Ink",
					description: "Artisanal Calligraphy & Bespoke Stationery",
					image: "/Logo.jpeg",
					order_id: orderData.orderId,
					prefill: {
						name: `${shippingAddress.firstName} ${shippingAddress.lastName}`.trim(),
						email: shippingAddress.email,
						contact: shippingAddress.phone,
					},
					theme: { color: "#201A1C" },
					handler: async (response: any) => {
						toast.loading("Verifying payment...", { id: "payment-verify" });
						const verifyRes = await fetch("/api/checkout/razorpay/verify", {
							method: "POST",
							headers: { "Content-Type": "application/json" },
							body: JSON.stringify({
								...response,
								cartId: cart.id,
								amount: grandTotal,
								cartItems: items,
								customer: {
									email: shippingAddress.email,
									phone: shippingAddress.phone,
									name: `${shippingAddress.firstName} ${shippingAddress.lastName}`.trim(),
								},
								shippingAddress: {
									firstName: shippingAddress.firstName,
									lastName: shippingAddress.lastName,
									address1: shippingAddress.address1,
									address2: shippingAddress.address2,
									city: shippingAddress.city,
									province: shippingAddress.province,
									postalCode: shippingAddress.postalCode,
									countryCode: "in",
								},
							}),
						});
						const verifyData = await verifyRes.json();
						toast.dismiss("payment-verify");
						if (verifyRes.ok && verifyData.success) {
							router.push(`/order/success/${verifyData.orderId}`);
						} else {
							toast.error("Payment verification failed");
						}
					},
					modal: {
						ondismiss: () => {
							setIsProcessing(false);
						},
					},
				};

				const rzp = new (window as any).Razorpay(options);
				rzp.open();
				return;
			}

			// If Razorpay checkout.js is not loaded, show error
			setIsProcessing(false);
			toast.error("Failed to load Razorpay checkout");
		} catch (err: any) {
			setIsProcessing(false);
			toast.error(err.message || "Failed to launch Razorpay");
		}
	};

	if (!items.length) {
		return (
			<div className="max-w-2xl mx-auto py-20 px-4 text-center">
				<div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-secondary/50 mb-6">
					<Package className="h-10 w-10 text-muted-foreground" />
				</div>
				<h1 className="text-3xl font-serif font-medium tracking-tight mb-3">Your Cart is Empty</h1>
				<p className="text-muted-foreground mb-8 max-w-md mx-auto">
					Add items to your cart before proceeding to checkout.
				</p>
				<Button asChild size="lg" className="rounded-full px-8">
					<Link href="/shop">Browse Collections</Link>
				</Button>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-paper-tint/40">
			{/* Header */}
			<header className="border-b border-border/60 bg-background/95 backdrop-blur-sm sticky top-0 z-30">
				<div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
					<Link
						href="/"
						className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
					>
						<ArrowLeft className="h-4 w-4" />
						<span>Return to Studio</span>
					</Link>

					<Link
						href="/"
						className="font-serif text-xl tracking-wider uppercase font-semibold text-foreground"
					>
						The Letter Ink
					</Link>

					<div className="flex items-center gap-1.5 text-xs text-muted-foreground bg-secondary/40 px-3 py-1.5 rounded-full border border-border/40">
						<Lock className="h-3.5 w-3.5 text-primary" />
						<span className="font-medium">Razorpay Secured</span>
					</div>
				</div>
			</header>

			{/* Main 2-Column Checkout Layout */}
			<main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 lg:py-12">
				<div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
					{/* Left Column: Shipping Address & Recipient Details Form */}
					<div className="lg:col-span-7 space-y-6">
						<ShippingAddressForm onChange={handleAddressChange} />
					</div>

					{/* Right Column: Order Summary, Items Preview, Promos & Payment Action */}
					<div className="lg:col-span-5 space-y-6 lg:sticky lg:top-24">
						<div className="bg-card border border-border/80 rounded-2xl p-6 sm:p-7 shadow-sm space-y-6">
							<div className="flex items-center justify-between border-b border-border/60 pb-3">
								<h3 className="font-serif text-lg font-semibold text-foreground">Order Summary</h3>
								<span className="text-xs text-muted-foreground font-medium">
									{items.length} {items.length === 1 ? "Item" : "Items"}
								</span>
							</div>

							{/* Items List */}
							<div className="space-y-3 max-h-60 overflow-y-auto pr-1">
								{items.map((item: any) => {
									const imageSrc =
										item.productVariant?.images?.[0] ||
										item.productVariant?.product?.images?.[0] ||
										"/Latest-logo.png";
									const unitPrice = Number(item.productVariant?.price || item.originalPrice || 0);

									return (
										<div
											key={item.id}
											className="flex gap-3 items-center py-2 border-b border-border/40 last:border-b-0"
										>
											<div className="relative h-14 w-14 rounded-lg overflow-hidden bg-muted border border-border/50 shrink-0">
												{imageSrc && (
													<img
														src={imageSrc}
														alt={item.productVariant?.product?.name || "Product"}
														className="h-full w-full object-cover"
													/>
												)}
												<span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-[10px] font-bold rounded-full h-4.5 w-4.5 flex items-center justify-center shadow">
													{item.quantity}
												</span>
											</div>
											<div className="flex-1 min-w-0">
												<p className="text-xs font-medium text-foreground truncate">
													{item.productVariant?.product?.name || "Artisanal Creation"}
												</p>
												{item.metadata?.custom_inscription && (
													<p className="text-[11px] text-amber-700 dark:text-amber-400 italic truncate mt-0.5">
														"{item.metadata.custom_inscription}"
													</p>
												)}
												{item.metadata?.customization_selections && (
													<p className="text-[10px] text-muted-foreground truncate mt-0.5">
														{Object.entries(item.metadata.customization_selections)
															.filter(([k]) => k !== "Inscription")
															.map(([k, v]) => `${k}: ${v}`)
															.join(" • ")}
													</p>
												)}
												<p className="text-[10px] text-muted-foreground/80 mt-0.5">Qty: {item.quantity}</p>
											</div>
											<div className="text-right shrink-0">
												<p className="text-xs font-semibold text-foreground font-mono">
													{formatMoney({
														amount: BigInt(unitPrice * item.quantity),
														currency: storeConfig.currency,
														locale: storeConfig.locale,
													})}
												</p>
											</div>
										</div>
									);
								})}
							</div>

							{/* Price Breakdown */}
							<div className="space-y-2 text-xs border-t border-border/60 pt-4">
								<div className="flex justify-between text-muted-foreground">
									<span>Subtotal</span>
									<span className="font-mono text-foreground font-medium">
										{formatMoney({
											amount: BigInt(rawSubtotal),
											currency: storeConfig.currency,
											locale: storeConfig.locale,
										})}
									</span>
								</div>

								<div className="flex justify-between text-muted-foreground">
									<span>Standard Atelier Delivery (India)</span>
									<span className="text-emerald-600 font-medium">Complimentary</span>
								</div>

								{discountTotal > 0 && (
									<div className="flex justify-between text-emerald-600 font-medium">
										<span>Promotional Discount</span>
										<span className="font-mono">
											-
											{formatMoney({
												amount: BigInt(discountTotal),
												currency: storeConfig.currency,
												locale: storeConfig.locale,
											})}
										</span>
									</div>
								)}

								<div className="pt-3 border-t border-border/60 flex items-baseline justify-between">
									<span className="font-serif font-semibold text-sm text-foreground">Total Amount</span>
									<span className="text-xl font-serif font-bold text-primary font-mono">
										{formatMoney({
											amount: BigInt(grandTotal),
											currency: storeConfig.currency,
											locale: storeConfig.locale,
										})}
									</span>
								</div>
							</div>

							{/* Promo Code Input */}
							<div className="pt-1">
								<CartPromoCode />
							</div>

							{/* Razorpay CTA Button */}
							<div className="space-y-2 pt-2">
								<Button
									onClick={handleLaunchRazorpay}
									disabled={isProcessing}
									size="lg"
									className="w-full h-14 rounded-full text-sm font-semibold bg-primary text-primary-foreground hover:bg-primary/90 shadow-md shadow-primary/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
								>
									{isProcessing ? (
										<>
											<Loader2 className="h-5 w-5 animate-spin" />
											<span>Opening Secure Razorpay Gateway…</span>
										</>
									) : (
										<>
											<Lock className="h-4 w-4" />
											<span>Proceed to Pay with Razorpay</span>
										</>
									)}
								</Button>

								{!isAddressValid && (
									<p className="text-[11px] text-amber-600 dark:text-amber-400 text-center flex items-center justify-center gap-1">
										<AlertCircle className="h-3 w-3 shrink-0" />
										Please fill out the delivery address to proceed.
									</p>
								)}
							</div>

							{/* Security & Payment Badges */}
							<div className="pt-2 border-t border-border/40 text-center space-y-1.5">
								<div className="flex items-center justify-center gap-2 text-[11px] text-muted-foreground">
									<ShieldCheck className="h-3.5 w-3.5 text-blue-600" />
									<span>Accepts UPI, Credit/Debit Cards, NetBanking & Wallets</span>
								</div>
								<p className="text-[10px] text-muted-foreground/80">
									Protected by 256-bit bank grade encryption & RBI PCI-DSS compliance.
								</p>
							</div>
						</div>
					</div>
				</div>
			</main>
		</div>
	);
}
