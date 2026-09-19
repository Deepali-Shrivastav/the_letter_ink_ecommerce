"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";
import { addToCart } from "@/app/cart/actions";
import { useCart } from "@/app/cart/cart-context";
import { QuantitySelector } from "@/app/product/[slug]/quantity-selector";
import { RestockNotify } from "@/app/product/[slug]/restock-notify";
import { TrustBadges } from "@/app/product/[slug]/trust-badges";
import { useSelectedVariant } from "@/app/product/[slug]/use-selected-variant";
import { VariantSelector } from "@/app/product/[slug]/variant-selector";
import { useVolumePricing, VolumePricingDisplay, type VolumeTier } from "@/app/product/[slug]/volume-pricing";
import { CustomisationConfig } from "@/lib/customisation-api";
import { CustomisationPanel } from "@/app/product/[slug]/customisation/customisation-panel";
import { useCustomisation } from "@/app/product/[slug]/customisation/use-customisation";
import { useStoreConfig } from "@/components/store-config-provider";
import { formatMoney } from "@/lib/money";
import { displayPrice, priceRange } from "@/lib/pricing";
import { trackAddToCart } from "@/lib/track";
import { cn } from "@/lib/utils";

// Every net price below has a gross twin; which of the pair a shopper sees is the store's
// `taxBehavior` (see lib/pricing.ts). The twins stay optional so this still renders against
// an older API payload that sends the net values only.
type Variant = {
	id: string;
	price: string;
	priceGross?: string;
	originalPrice: string;
	originalPriceGross?: string | null;
	sku: string | null;
	images: string[];
	stock: number | null;
	/** EU Omnibus: lowest price in the last 30 days (null unless the store enables omnibus). */
	omnibusPrice: string | null;
	omnibusPriceGross?: string | null;
	combinations: {
		variantValue: {
			id: string;
			value: string;
			colorValue: string | null;
			variantType: {
				id: string;
				type: "string" | "color";
				label: string;
			};
		};
	}[];
};

type AddToCartButtonProps = {
	variants: Variant[];
	product: {
		id: string;
		name: string;
		slug: string;
		images: string[];
	};
	summary?: string | null;
	volumePricingTiers?: VolumeTier[];
	/** Show a "remind me when back in stock" flow when out of stock (Restock Notifications module). */
	restockNotificationsEnabled?: boolean;
	customisationConfig?: CustomisationConfig | null;
};

const LOW_STOCK_THRESHOLD = 5;

export function AddToCartButton({
	variants,
	product,
	summary,
	volumePricingTiers = [],
	restockNotificationsEnabled = false,
	customisationConfig = null,
}: AddToCartButtonProps) {
	const { currency, locale, taxBehavior } = useStoreConfig();
	const [quantity, setQuantity] = useState(1);
	const { items, openCart, dispatch, syncCart, reconcile, startMutation } = useCart();
	const customisationHook = useCustomisation(customisationConfig);

	const selectedVariant = useSelectedVariant(variants);

	// stock === null means stock isn't tracked for this variant (unlimited)
	const isOutOfStock = selectedVariant?.stock === 0;
	const maxQuantity = selectedVariant?.stock ?? 99;
	const effectiveQuantity = isOutOfStock ? 1 : Math.min(quantity, maxQuantity);

	const { resolvedTiers, volumePrice } = useVolumePricing(
		volumePricingTiers,
		selectedVariant?.id,
		effectiveQuantity,
		taxBehavior,
	);

	const unitPrice = volumePrice ?? (selectedVariant ? displayPrice(selectedVariant, taxBehavior) : null);
	const totalPrice = unitPrice ? BigInt(unitPrice) * BigInt(effectiveQuantity) : null;

	const buttonText = useMemo(() => {
		if (!selectedVariant) return "Select options";
		if (isOutOfStock) return "Out of stock";
		if (totalPrice) {
			return `Add to Cart — ${formatMoney({ amount: totalPrice, currency, locale })}`;
		}
		return "Add to Cart";
	}, [selectedVariant, isOutOfStock, totalPrice, locale, currency]);

	// Headline price. For the selected variant we show its own price (and the struck-through
	// list price when it's on sale). Before a variant is picked we fall back to a range.
	const priceInfo = useMemo(() => {
		const fmt = (amount: bigint) => formatMoney({ amount, currency, locale });

		if (selectedVariant) {
			const price = BigInt(displayPrice(selectedVariant, taxBehavior));
			const listPrice = BigInt(
				displayPrice(selectedVariant, taxBehavior, "originalPrice") ??
					displayPrice(selectedVariant, taxBehavior),
			);
			const onSale = listPrice > price;
			return {
				display: fmt(price),
				compareAt: onSale ? fmt(listPrice) : null,
				discountPercent: onSale ? Math.round((Number(listPrice - price) / Number(listPrice)) * 100) : null,
			};
		}

		const { min: minPrice, max: maxPrice } = priceRange(variants, taxBehavior);
		return {
			display: minPrice === maxPrice ? fmt(minPrice) : `${fmt(minPrice)} - ${fmt(maxPrice)}`,
			compareAt: null,
			discountPercent: null,
		};
	}, [selectedVariant, variants, locale, currency, taxBehavior]);

	// EU Omnibus: when the variant is discounted, show the lowest price recorded in the last 30 days.
	const omnibusPrice = useMemo(() => {
		if (!selectedVariant || !priceInfo.compareAt) return null;
		const lowest = displayPrice(selectedVariant, taxBehavior, "omnibusPrice");
		if (!lowest) return null;
		return formatMoney({ amount: BigInt(lowest), currency, locale });
	}, [selectedVariant, priceInfo.compareAt, locale, currency, taxBehavior]);

	// Stock availability. null stock means it isn't tracked (treated as in stock).
	const stockStatus = useMemo(() => {
		if (!selectedVariant) return null;
		const { stock } = selectedVariant;
		if (stock === 0) return { label: "Out of stock", tone: "out" as const };
		if (stock !== null && stock <= LOW_STOCK_THRESHOLD) {
			return { label: `Only ${stock} left in stock`, tone: "low" as const };
		}
		return { label: "In stock", tone: "in" as const };
	}, [selectedVariant]);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		if (!selectedVariant || isOutOfStock) return;
		if (!customisationHook.validate()) return;

		const variantId = selectedVariant.id;
		const addedQuantity = effectiveQuantity;
		const previousQuantity = items.find((item) => item.productVariant.id === variantId)?.quantity ?? 0;
		const metadata = customisationHook.buildMetadata();

		trackAddToCart(selectedVariant, product.name, addedQuantity);

		openCart();
		setQuantity(1);

		// Instant local feedback OUTSIDE the transition, then REPLACE with the
		// server-returned cart (never refetch — the layout cartGet hits a stale
		// read replica). See patterns/cart-sync.md.
		dispatch({
			type: "ADD_ITEM",
			item: {
				quantity: addedQuantity,
				productVariant: {
					id: variantId,
					price: selectedVariant.price,
					// Carry the gross twin so the optimistic line renders in the same basis the
					// server-returned cart will use — no net/gross flip while the write is in flight.
					priceGross: selectedVariant.priceGross,
					images: selectedVariant.images,
					product,
					metadata,
				},
			},
		});

		startMutation(async () => {
			// The server clamps line quantities to available stock and still responds
			// with the updated cart — sync from the RETURNED cart; reconcile only on failure.
			const result = await addToCart(variantId, addedQuantity, metadata);
			const line = result.cart?.lineItems.find((item) => item.productVariant.id === variantId);
			if (result.success && result.cart && line) {
				syncCart(result.cart);
				if (line.quantity < previousQuantity + addedQuantity) {
					toast.warning(`Only ${line.quantity} in stock — quantity adjusted`);
				}
			} else {
				await reconcile();
				toast.error("This item is out of stock");
			}
		});
	};

	return (
		<div className="flex flex-col gap-6">
			{/* Price & sale */}
			<div className="flex flex-col gap-2 pb-5 border-b border-border-vellum">
				<div className="flex items-baseline gap-4 mt-2">
					<span className="font-headline-md text-headline-md text-primary font-normal tracking-tight">{priceInfo.display}</span>
					{priceInfo.compareAt && (
						<span className="font-body-sm text-body-sm text-secondary line-through">{priceInfo.compareAt}</span>
					)}
					{priceInfo.discountPercent ? (
						<span className="font-label-sm text-label-sm uppercase tracking-wider px-2 py-0.5 bg-tertiary-fixed text-on-tertiary-fixed">
							Save {priceInfo.discountPercent}%
						</span>
					) : null}
				</div>
				<p className="font-body-sm text-body-sm text-secondary/80 mt-1">
					Taxes included.
				</p>

				{omnibusPrice && (
					<p className="font-body-sm text-body-sm text-muted-foreground mt-2">Lowest price in the last 30 days: {omnibusPrice}</p>
				)}

				{/* SKU & stock availability */}
				{(selectedVariant?.sku || stockStatus) && (
					<div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
						{stockStatus && (
							<span
								className={cn(
									"inline-flex items-center gap-1.5 font-medium",
									stockStatus.tone === "out" && "text-destructive",
									stockStatus.tone === "low" && "text-amber-600 dark:text-amber-500",
									stockStatus.tone === "in" && "text-green-600 dark:text-green-500",
								)}
							>
								<span className="h-1.5 w-1.5 rounded-full bg-current" aria-hidden />
								{stockStatus.label}
							</span>
						)}
						{selectedVariant?.sku && (
							<span className="text-muted-foreground">
								SKU: <span className="font-medium text-foreground">{selectedVariant.sku}</span>
							</span>
						)}
					</div>
				)}
			</div>

			{variants.length > 1 && <VariantSelector variants={variants} />}

			{customisationConfig && <CustomisationPanel config={customisationConfig} hook={customisationHook} />}

			<VolumePricingDisplay tiers={resolvedTiers} quantity={effectiveQuantity} volumePrice={volumePrice} />

			<div className="flex flex-col gap-3 pt-4">
				{isOutOfStock && restockNotificationsEnabled && selectedVariant ? (
					<RestockNotify productVariantId={selectedVariant.id} productName={product.name} />
				) : (
					<form onSubmit={handleSubmit} className="flex flex-col gap-4">
						<div className="flex items-stretch gap-3">
							<QuantitySelector
								quantity={effectiveQuantity}
								onQuantityChange={setQuantity}
								max={Math.max(1, Math.min(99, maxQuantity))}
								disabled={isOutOfStock}
							/>
							<button
								type="submit"
								disabled={!selectedVariant || isOutOfStock || !customisationHook.isValid}
								className="flex-1 h-[49px] bg-tertiary-fixed hover:bg-surface-container-lowest text-on-tertiary-fixed hover:text-primary transition-all duration-300 font-label-lg text-label-lg uppercase tracking-widest flex items-center justify-center gap-2 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
							>
								<span className="">{buttonText}</span>
								<span className="material-symbols-outlined text-[18px]">arrow_forward</span>
							</button>
						</div>
					</form>
				)}
				{/* Inquire Secondary Button */}
				<button className="w-full h-[45px] bg-transparent hover:bg-paper-tint text-primary font-label-md text-label-md uppercase tracking-widest flex items-center justify-center gap-2 transition-colors" type="button">
					<span className="material-symbols-outlined text-[18px]">chat</span>
					<span className="">Inquire With Atelier Calligrapher</span>
				</button>
			</div>
		</div>
	);
}
