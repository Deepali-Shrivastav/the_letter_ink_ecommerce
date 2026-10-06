"use client";

import { Minus, PenTool, Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRef, useTransition } from "react";
import { setCartQuantity } from "@/app/cart/actions";
import { type Cart, type CartLineItem, getLineItemUnitPrice, useCart } from "@/app/cart/cart-context";
import { useStoreConfig } from "@/components/store-config-provider";
import { formatMoney } from "@/lib/money";
import { LetterInkMedia } from "@/lib/the-letter-ink-media";
import { cn, getProductThumbnail } from "@/lib/utils";

type CartItemProps = {
	item: CartLineItem;
};

export function CartItem({ item }: CartItemProps) {
	const { currency, locale, taxBehavior } = useStoreConfig();
	const { dispatch, closeCart, startMutation, syncCart, reconcile } = useCart();
	const [isPending, startTransition] = useTransition();

	const { productVariant, quantity } = item;
	const { product } = productVariant;

	const image = getProductThumbnail(productVariant.images) ?? getProductThumbnail(product.images);
	const price = getLineItemUnitPrice(item, taxBehavior);
	const lineTotal = price * BigInt(quantity);

	const targetQuantityRef = useRef<number | null>(null);
	const sendQueueRef = useRef<Promise<void>>(Promise.resolve());
	const latestCartRef = useRef<Cart | null>(null);
	const sendFailedRef = useRef(false);

	// Optimistic update + queued sync: rapid clicks collapse into the newest absolute
	// quantity (safe thanks to mode "set"), one request in flight per line, and each
	// transition stays open until the queue drains so the value never flickers back.
	const updateQuantity = (action: Parameters<typeof dispatch>[0], target: number) => {
		// Mirror this line's pending window onto the cart-wide `isMutating` flag so the
		// Checkout link stays blocked while the write is in flight. `done` resolves when
		// the local transition finishes; the work itself only runs once.
		const { promise: done, resolve: resolveDone } = Promise.withResolvers<void>();
		startMutation(async () => {
			await done;
		});
		startTransition(async () => {
			try {
				dispatch(action);
				targetQuantityRef.current = target;
				sendQueueRef.current = sendQueueRef.current.then(async () => {
					const latest = targetQuantityRef.current;
					if (latest === null) {
						return; // newest value already sent
					}
					targetQuantityRef.current = null;
					const res = await setCartQuantity(productVariant.id, latest);
					// Remember the newest server-returned cart so we can sync from it (never
					// refetch — the layout cartGet hits a read-replica and can rebase stale).
					if (res.success && res.cart) {
						latestCartRef.current = res.cart;
					} else {
						sendFailedRef.current = true;
					}
				});
				// Drain the queue, then reconcile once. Concurrent transitions land here
				// together, so this runs a single sync per batch.
				let tail: Promise<void>;
				do {
					tail = sendQueueRef.current;
					await tail;
				} while (tail !== sendQueueRef.current);
				if (sendFailedRef.current) {
					sendFailedRef.current = false;
					latestCartRef.current = null;
					await reconcile();
				} else if (latestCartRef.current) {
					syncCart(latestCartRef.current);
					latestCartRef.current = null;
				}
			} finally {
				resolveDone();
			}
		});
	};

	const handleRemove = () => {
		updateQuantity({ type: "REMOVE", variantId: productVariant.id }, 0);
	};

	const handleIncrement = () => {
		updateQuantity({ type: "INCREASE", variantId: productVariant.id }, quantity + 1);
	};

	const handleDecrement = () => {
		if (quantity <= 1) {
			handleRemove();
			return;
		}
		updateQuantity({ type: "DECREASE", variantId: productVariant.id }, quantity - 1);
	};

	return (
		<div className="flex gap-3 py-4">
			{/* Product Image */}
			<Link
				href={`/product/${product.slug}`}
				onClick={closeCart}
				className="relative h-24 w-24 shrink-0 overflow-hidden rounded-sm border border-border-vellum/60 bg-paper-tint"
			>
				{image && (
					<LetterInkMedia src={image} alt={product.name} fill className="object-cover" sizes="96px" />
				)}
			</Link>

			{/* Product Details */}
			<div className="flex min-w-0 flex-1 flex-col justify-between py-0.5">
				<div className="flex items-start justify-between gap-2">
					<Link
						href={`/product/${product.slug}`}
						onClick={closeCart}
						className="text-sm font-medium leading-tight text-primary hover:underline line-clamp-2"
					>
						{product.name}
					</Link>
					<button
						type="button"
						onClick={handleRemove}
						disabled={isPending}
						className="shrink-0 p-1 text-secondary hover:text-destructive transition-colors disabled:pointer-events-none disabled:opacity-50 cursor-pointer"
						aria-label="Remove item"
					>
						<Trash2 className="h-4 w-4" />
					</button>
				</div>

				{item.metadata?.customization_selections && (
					<div className="flex flex-col gap-0.5 text-xs text-secondary mt-1 mb-1.5">
						{Object.entries(item.metadata.customization_selections)
							.filter(([key]) => key.toLowerCase() !== "inscription")
							.map(([key, value]) => (
								<div key={key} className="flex gap-1.5">
									<span className="font-medium text-primary">{key}:</span>
									<span>{String(value)}</span>
								</div>
							))}
					</div>
				)}

				{(item.metadata?.custom_inscription || item.metadata?.customization_selections?.Inscription) && (
					<div className="mt-1 mb-2 p-2 rounded-sm bg-paper-tint/90 border border-border-vellum">
						<div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-secondary font-label-sm">
							<PenTool className="w-3 h-3 text-brand-script shrink-0" />
							<span className="font-medium text-primary">Hand-Scripted Inscription:</span>
						</div>
						<p className="font-serif italic text-xs text-primary leading-relaxed mt-0.5 line-clamp-3">
							“{item.metadata?.custom_inscription || item.metadata?.customization_selections?.Inscription}”
						</p>
					</div>
				)}

				<div className="flex items-center justify-between mt-auto">
					{/* Quantity Controls */}
					<div
						className={cn(
							"inline-flex items-center rounded-sm border border-border-vellum bg-background transition-opacity",
							isPending && "opacity-70",
						)}
					>
						<button
							type="button"
							onClick={handleDecrement}
							className="shrink-0 flex h-7 w-7 items-center justify-center hover:bg-paper-tint text-primary transition-colors cursor-pointer"
							aria-label="Decrease quantity"
						>
							<Minus className="h-3 w-3" />
						</button>
						<span className="flex h-7 w-8 items-center justify-center text-xs font-mono tabular-nums text-primary border-x border-border-vellum/60">
							{quantity}
						</span>
						<button
							type="button"
							onClick={handleIncrement}
							className="shrink-0 flex h-7 w-7 items-center justify-center hover:bg-paper-tint text-primary transition-colors cursor-pointer"
							aria-label="Increase quantity"
						>
							<Plus className="h-3 w-3" />
						</button>
					</div>

					{/* Price */}
					<div className="flex flex-col items-end">
						{(item.discountTotal || 0) > 0 && (
							<span className="text-xs text-secondary line-through">
								{formatMoney({ amount: lineTotal, currency, locale })}
							</span>
						)}
						<span className="text-sm font-semibold text-primary">
							{formatMoney({ amount: lineTotal - BigInt(item.discountTotal || 0), currency, locale })}
						</span>
					</div>
				</div>
			</div>
		</div>
	);
}
