"use client";

import { ShoppingBag } from "lucide-react";
import { useRouter } from "next/navigation";
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

export function CartSidebar() {
	const router = useRouter();
	const { currency, locale, taxBehavior } = useStoreConfig();
	const { isOpen, closeCart, items, itemCount, subtotal, isMutating, cart } = useCart();

	const rawSubtotal = Number(cart?.subtotal ?? subtotal ?? 0);
	const discountTotal = Number(cart?.discountTotal ?? 0);
	const grandTotal = cart?.subtotalGross
		? Number(cart.subtotalGross)
		: Math.max(0, rawSubtotal - discountTotal);

	return (
		<Sheet open={isOpen} onOpenChange={(open) => !open && closeCart()}>
			<SheetContent className="flex flex-col w-full sm:max-w-lg">
				<SheetHeader className="border-b border-border-vellum pb-4">
					<SheetTitle className="flex items-center gap-2 font-headline-sm text-headline-sm text-primary">
						Your Cart
						{itemCount > 0 && <span className="text-sm font-normal text-secondary">({itemCount} items)</span>}
					</SheetTitle>
					<SheetDescription className="sr-only">
						Review items in your cart and proceed to checkout.
					</SheetDescription>
				</SheetHeader>

				{items.length === 0 ? (
					<div className="flex-1 flex flex-col items-center justify-center gap-4 py-12">
						<div className="flex h-20 w-20 items-center justify-center rounded-sm bg-paper-tint border border-border-vellum">
							<ShoppingBag className="h-10 w-10 text-secondary" />
						</div>
						<div className="text-center">
							<p className="text-lg font-serif italic text-primary">Your cart is empty</p>
							<p className="text-sm text-secondary mt-1">Add hand-lettered pieces to begin your order</p>
						</div>
						<Button
							variant="outline"
							onClick={closeCart}
							className="rounded-sm border-border-vellum hover:bg-paper-tint text-primary font-label-md uppercase tracking-wider text-xs cursor-pointer"
						>
							Continue Shopping
						</Button>
					</div>
				) : (
					<>
						<ScrollArea className="flex-1 px-4">
							<div className="divide-y divide-border-vellum">
								{items.map((item) => (
									<CartItem key={item.productVariant.id} item={item} />
								))}
							</div>
						</ScrollArea>

						<SheetFooter className="border-t border-border-vellum pt-4 mt-auto">
							<div className="w-full space-y-4">
								<CartPromoCode />
								<div className="flex flex-col gap-2 text-base">
									<div className="flex items-center justify-between">
										<span className="text-secondary">Subtotal</span>
										<span className="text-primary font-medium">
											{formatMoney({ amount: cart?.subtotal || subtotal, currency, locale })}
										</span>
									</div>
									<div className="flex items-center justify-between text-sm">
										<span className="text-secondary">Shipping</span>
										<span className="text-emerald-700 dark:text-emerald-400 font-medium">
											Free (Complimentary)
										</span>
									</div>
									{(cart?.discountTotal || 0) > 0 && (
										<div className="flex items-center justify-between text-brand-script font-medium">
											<span>Discount</span>
											<span>-{formatMoney({ amount: cart?.discountTotal!, currency, locale })}</span>
										</div>
									)}
									<div className="flex items-center justify-between font-medium pt-2 border-t border-border-vellum">
										<span className="text-primary">Total</span>
										<span className="font-semibold text-primary">
											{formatMoney({ amount: Math.round(grandTotal), currency, locale })}
										</span>
									</div>
								</div>

								<p className="text-xs text-secondary/80">
									Taxes included. Complimentary insured atelier shipping across India.
								</p>

								{/* Checkout CTA */}
								<Button
									onClick={() => {
										closeCart();
										router.push("/checkout");
									}}
									disabled={isMutating}
									className="w-full h-12 text-sm sm:text-base font-label-lg uppercase tracking-widest bg-primary text-on-primary hover:bg-brand-script-dark rounded-sm flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer disabled:opacity-50"
								>
									Checkout →
								</Button>

								<button
									type="button"
									onClick={closeCart}
									className="w-full text-xs font-label-md uppercase tracking-wider text-secondary hover:text-primary transition-colors py-1 cursor-pointer"
								>
									Continue Shopping
								</button>
							</div>
						</SheetFooter>
					</>
				)}
			</SheetContent>
		</Sheet>
	);
}
