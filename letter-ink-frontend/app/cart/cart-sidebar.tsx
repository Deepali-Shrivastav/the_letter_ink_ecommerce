"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, ShoppingBag, ShieldCheck, CheckCircle2, Lock, Info } from "lucide-react";
import { useCart } from "@/app/cart/cart-context";
import { CartItem } from "@/app/cart/cart-item";
import { CartPromoCode } from "@/app/cart/cart-promo";
import { useStoreConfig } from "@/components/store-config-provider";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetFooter,
	SheetHeader,
	SheetTitle,
} from "@/components/ui/sheet";
import { formatMoney } from "@/lib/money";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export function CartSidebar() {
	const router = useRouter();
	const { currency, locale, taxBehavior } = useStoreConfig();
	const { isOpen, closeCart, items, itemCount, subtotal, isMutating, cart } = useCart();

	const [isCheckingOut, setIsCheckingOut] = useState(false);
	const [showSimulatedModal, setShowSimulatedModal] = useState(false);
	const [simulatedOrderInfo, setSimulatedOrderInfo] = useState<any>(null);

	const rawSubtotal = Number(cart?.subtotal ?? subtotal ?? 0);
	const discountTotal = Number(cart?.discountTotal ?? 0);
	const grandTotal = cart?.subtotalGross ? Number(cart.subtotalGross) : Math.max(0, rawSubtotal - discountTotal);

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

	const handleCheckoutWithRazorpay = async () => {
		if (isMutating || isCheckingOut || !cart?.id) return;
		setIsCheckingOut(true);

		try {
			// Ensure Razorpay SDK is loaded
			await loadRazorpayScript();

			const res = await fetch("/api/checkout/razorpay/create-order", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					cartId: cart.id,
					amount: grandTotal,
				}),
			});

			const data = await res.json();
			if (!res.ok || !data.success) {
				throw new Error(data.error || "Failed to initialize Razorpay");
			}

			// Open official Razorpay Checkout Pop-up Modal
			if (typeof (window as any).Razorpay === "function") {
				const options = {
					key: data.keyId,
					amount: data.amount,
					currency: data.currency || "INR",
					name: "The Letter Ink",
					description: "Artisanal Calligraphy & Bespoke Stationery",
					image: "/Logo.jpeg",
					order_id: data.orderId,
					theme: { color: "#201A1C" },
					handler: async function (response: any) {
						toast.loading("Verifying Razorpay payment...", { id: "razorpay-verify" });
						const verifyRes = await fetch("/api/checkout/razorpay/verify", {
							method: "POST",
							headers: { "Content-Type": "application/json" },
							body: JSON.stringify({
								...response,
								cartId: cart.id,
								amount: grandTotal,
								cartItems: items,
							}),
						});
						const verifyData = await verifyRes.json();
						toast.dismiss("razorpay-verify");
						if (verifyRes.ok && verifyData.success) {
							closeCart();
							router.push(`/order/success/${verifyData.orderId}`);
						} else {
							toast.error("Payment verification failed. Please contact studio support.");
						}
					},
					modal: {
						ondismiss: function () {
							setIsCheckingOut(false);
							toast.info("Payment cancelled.");
						},
					},
				};
				const rzp = new (window as any).Razorpay(options);
				rzp.on("payment.failed", function (response: any) {
					setIsCheckingOut(false);
					toast.error(response.error?.description || "Payment failed. Please try again.");
				});
				rzp.open();
				setIsCheckingOut(false);
				return;
			}

			// Fallback in case Razorpay SDK script is blocked
			setSimulatedOrderInfo(data);
			setShowSimulatedModal(true);
			setIsCheckingOut(false);
		} catch (err: any) {
			setIsCheckingOut(false);
			toast.error(err.message || "Failed to launch Razorpay checkout.");
		}
	};

	const handleSimulateSuccess = async () => {
		setShowSimulatedModal(false);
		setIsCheckingOut(true);
		toast.loading("Completing order...", { id: "razorpay-verify" });

		try {
			const verifyRes = await fetch("/api/checkout/razorpay/verify", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					razorpay_order_id: simulatedOrderInfo?.orderId || `order_sim_${Date.now()}`,
					razorpay_payment_id: `pay_sim_${Date.now()}`,
					razorpay_signature: "simulated_signature",
					cartId: cart?.id,
					amount: grandTotal,
					cartItems: items,
					customer: {
						email: "patron@theletterink.com",
						name: "Valued Patron",
						phone: "9876543210",
					},
					shippingAddress: {
						firstName: "Valued",
						lastName: "Patron",
						address1: "Heritage Lane, Atelier Studio",
						city: "Mumbai",
						province: "Maharashtra",
						postalCode: "400001",
						countryCode: "in",
					},
				}),
			});

			const verifyData = await verifyRes.json();
			toast.dismiss("razorpay-verify");

			if (verifyRes.ok && verifyData.success) {
				closeCart();
				router.push(`/order/success/${verifyData.orderId}`);
			} else {
				toast.error("Order completion failed.");
			}
		} catch {
			setIsCheckingOut(false);
			toast.error("Could not complete order.");
		}
	};

	return (
		<>
			<Sheet open={isOpen} onOpenChange={(open) => !open && closeCart()}>
				<SheetContent className="flex flex-col w-full sm:max-w-lg">
					<SheetHeader className="border-b border-border pb-4">
						<SheetTitle className="flex items-center gap-2">
							Your Cart
							{itemCount > 0 && (
								<span className="text-sm font-normal text-muted-foreground">({itemCount} items)</span>
							)}
						</SheetTitle>
						<SheetDescription className="sr-only">
							Review items in your cart and proceed to checkout.
						</SheetDescription>
					</SheetHeader>

					{items.length === 0 ? (
						<div className="flex-1 flex flex-col items-center justify-center gap-4 py-12">
							<div className="flex h-20 w-20 items-center justify-center rounded-full bg-secondary">
								<ShoppingBag className="h-10 w-10 text-muted-foreground" />
							</div>
							<div className="text-center">
								<p className="text-lg font-medium">Your cart is empty</p>
								<p className="text-sm text-muted-foreground mt-1">Add some products to get started</p>
							</div>
							<Button variant="outline" onClick={closeCart}>
								Continue Shopping
							</Button>
						</div>
					) : (
						<>
							<ScrollArea className="flex-1 px-4">
								<div className="divide-y divide-border">
									{items.map((item) => (
										<CartItem key={item.productVariant.id} item={item} />
									))}
								</div>
							</ScrollArea>

							<SheetFooter className="border-t border-border pt-4 mt-auto">
								<div className="w-full space-y-4">
									<CartPromoCode />
									<div className="flex flex-col gap-2 text-base">
										<div className="flex items-center justify-between">
											<span className="text-muted-foreground">Subtotal</span>
											<span>{formatMoney({ amount: cart?.subtotal || subtotal, currency, locale })}</span>
										</div>
										{(cart?.discountTotal || 0) > 0 && (
											<div className="flex items-center justify-between text-primary">
												<span>Discount</span>
												<span>-{formatMoney({ amount: cart!.discountTotal!, currency, locale })}</span>
											</div>
										)}
										<div className="flex items-center justify-between font-medium pt-2 border-t border-border">
											<span>Total</span>
											<span className="font-semibold">{formatMoney({ amount: Math.round(grandTotal), currency, locale })}</span>
										</div>
									</div>

									<p className="text-xs text-muted-foreground">
										{taxBehavior === "inclusive"
											? "Shipping calculated at checkout"
											: "Shipping and taxes calculated at checkout"}
									</p>

									{/* Proceed to Delivery & Checkout */}
									<Button
										onClick={() => {
											closeCart();
											router.push("/checkout");
										}}
										disabled={isMutating}
										className="w-full h-12 text-sm sm:text-base font-semibold bg-stone-900 text-white hover:bg-stone-800 rounded-full flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
									>
										Proceed to Delivery & Checkout →
									</Button>

									<button
										type="button"
										onClick={closeCart}
										className="w-full text-sm text-muted-foreground hover:text-foreground transition-colors"
									>
										Continue Shopping
									</button>
								</div>
							</SheetFooter>
						</>
					)}
				</SheetContent>
			</Sheet>

			{/* Interactive Razorpay Test Modal (For Development / Demo without live API keys) */}
			{showSimulatedModal && (
				<div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
					<div className="bg-card border border-border rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-200">
						<div className="flex items-center justify-between pb-3 border-b border-border">
							<div className="flex items-center gap-2">
								<div className="h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-xs">
									RZP
								</div>
								<div>
									<h4 className="font-semibold text-foreground text-sm">Razorpay Payment Gateway</h4>
									<p className="text-[11px] text-muted-foreground">Test & Development Environment</p>
								</div>
							</div>
							<button
								type="button"
								onClick={() => setShowSimulatedModal(false)}
								className="text-muted-foreground hover:text-foreground text-sm p-1"
							>
								✕
							</button>
						</div>

						<div className="bg-secondary/40 p-4 rounded-xl space-y-2 border border-border/50">
							<div className="flex justify-between text-xs">
								<span className="text-muted-foreground">Merchant:</span>
								<span className="font-semibold text-foreground">The Letter Ink</span>
							</div>
							<div className="flex justify-between text-xs">
								<span className="text-muted-foreground">Payment Methods:</span>
								<span className="font-medium text-foreground">UPI • Cards • NetBanking</span>
							</div>
							<div className="flex justify-between items-center pt-2 border-t border-border">
								<span className="text-xs font-semibold text-foreground">Amount:</span>
								<span className="text-lg font-bold text-primary">
									{formatMoney({
										amount: Math.round(grandTotal),
										currency,
										locale,
									})}
								</span>
							</div>
						</div>

						<div className="text-xs text-muted-foreground flex items-start gap-2 bg-blue-50 dark:bg-blue-950/30 p-3 rounded-lg border border-blue-200 dark:border-blue-900 text-blue-800 dark:text-blue-300">
							<Info className="h-4 w-4 shrink-0 mt-0.5" />
							<span>
								Click below to simulate an immediate successful Razorpay payment! (To enable live bank modals, add your Razorpay keys in <code className="font-mono font-bold">.env.local</code>).
							</span>
						</div>

						<div className="flex gap-3 pt-2">
							<Button
								variant="outline"
								onClick={() => setShowSimulatedModal(false)}
								className="flex-1 rounded-full text-xs"
							>
								Cancel
							</Button>
							<Button
								onClick={handleSimulateSuccess}
								className="flex-1 rounded-full text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center gap-1.5"
							>
								<CheckCircle2 className="h-4 w-4" /> Simulate Success
							</Button>
						</div>
					</div>
				</div>
			)}
		</>
	);
}

