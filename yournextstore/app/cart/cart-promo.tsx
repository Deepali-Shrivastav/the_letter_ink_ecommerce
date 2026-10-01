"use client";

import { useState, useTransition } from "react";
import { Loader2, Tag, X } from "lucide-react";
import { useCart } from "@/app/cart/cart-context";
import { applyPromotionCode, removePromotionCode } from "@/app/cart/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function CartPromoCode() {
	const { cart, syncCart, reconcile } = useCart();
	const [code, setCode] = useState("");
	const [error, setError] = useState<string | null>(null);
	const [isPending, startTransition] = useTransition();

	const hasPromotions = cart?.promotions && cart.promotions.length > 0;

	const handleApply = (e: React.FormEvent) => {
		e.preventDefault();
		if (!code.trim()) return;

		setError(null);
		startTransition(async () => {
			const res = await applyPromotionCode(code.trim());
			if (res.success && res.cart) {
				syncCart(res.cart);
				setCode("");
			} else {
				setError(res.error || "Failed to apply code.");
				await reconcile();
			}
		});
	};

	const handleRemove = (promoCode: string) => {
		setError(null);
		startTransition(async () => {
			const res = await removePromotionCode(promoCode);
			if (res.success && res.cart) {
				syncCart(res.cart);
			} else {
				await reconcile();
			}
		});
	};

	return (
		<div className="py-4 space-y-3 border-t border-border mt-4">
			{hasPromotions && (
				<div className="space-y-2">
					<p className="text-sm font-medium">Applied Promotions</p>
					<div className="flex flex-wrap gap-2">
						{cart.promotions!.map((promo) => (
							<div
								key={promo.id}
								className="flex items-center gap-1.5 bg-primary/10 text-primary px-2.5 py-1 rounded-md text-xs font-medium"
							>
								<Tag className="w-3 h-3" />
								{promo.code || promo.id}
								{!promo.isAutomatic && promo.code && (
									<button
										type="button"
										onClick={() => handleRemove(promo.code!)}
										disabled={isPending}
										className="ml-1 text-primary hover:text-primary/70 disabled:opacity-50"
										aria-label={`Remove promotion ${promo.code}`}
									>
										{isPending ? (
											<Loader2 className="w-3 h-3 animate-spin" />
										) : (
											<X className="w-3 h-3" />
										)}
									</button>
								)}
							</div>
						))}
					</div>
				</div>
			)}

			<form onSubmit={handleApply} className="flex gap-2">
				<Input
					value={code}
					onChange={(e) => setCode(e.target.value)}
					placeholder="e.g. ATELIER10 or WELCOMEINK"
					className="h-10"
					disabled={isPending}
				/>
				<Button type="submit" variant="secondary" disabled={isPending || !code.trim()}>
					{isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Apply"}
				</Button>
			</form>
			{error && <p className="text-sm text-destructive">{error}</p>}
		</div>
	);
}
