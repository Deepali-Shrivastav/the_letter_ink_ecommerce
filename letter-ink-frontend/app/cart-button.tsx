"use client";

import { ShoppingBag } from "lucide-react";
import { useCart } from "@/app/cart/cart-context";

export function CartButton() {
	const { itemCount, openCart } = useCart();

	return (
		<button
			type="button"
			onClick={openCart}
			className="relative flex items-center justify-center h-11 w-11 rounded-full bg-primary text-on-primary hover:bg-primary/90 transition-all shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-script"
			aria-label={`Shopping bag${itemCount > 0 ? `, ${itemCount} items` : ""}`}
		>
			<ShoppingBag className="h-5 w-5 stroke-[1.75]" />
			{itemCount > 0 && (
				<span
					aria-live="polite"
					className="absolute -top-1 -right-1 flex items-center justify-center min-w-[20px] h-5 px-1 rounded-full bg-brand-script text-white text-[11px] font-semibold ring-2 ring-surface-container-lowest shadow-xs"
				>
					{itemCount}
				</span>
			)}
		</button>
	);
}
