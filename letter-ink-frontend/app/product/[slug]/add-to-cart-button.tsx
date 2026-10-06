"use client";

import { ArrowRight, MessageCircle, PenTool, Sparkles } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { addToCart } from "@/app/cart/actions";
import { useCart } from "@/app/cart/cart-context";
import { QuantitySelector } from "@/app/product/[slug]/quantity-selector";
import { RestockNotify } from "@/app/product/[slug]/restock-notify";
import { useSelectedVariant } from "@/app/product/[slug]/use-selected-variant";
import { VariantSelector } from "@/app/product/[slug]/variant-selector";
import { useVolumePricing, VolumePricingDisplay, type VolumeTier } from "@/app/product/[slug]/volume-pricing";
import { useStoreConfig } from "@/components/store-config-provider";
import { formatMoney } from "@/lib/money";
import { displayPrice, priceRange } from "@/lib/pricing";
import { trackAddToCart } from "@/lib/track";
import { cn } from "@/lib/utils";
import { useCustomization } from "./customization-context";
import { CustomizationSelector } from "./customization-selector";

type CustomizationCombination = {
	id: string;
	preview_image_url: string | null;
	price_adjustment: number | null;
	values: { id: string; value: string }[];
};

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
};

const LOW_STOCK_THRESHOLD = 5;

export function AddToCartButton({
	variants,
	product,
	summary,
	volumePricingTiers = [],
	restockNotificationsEnabled = false,
}: AddToCartButtonProps) {
	const { currency, locale, taxBehavior } = useStoreConfig();
	const [quantity, setQuantity] = useState(1);
	const { items, openCart, dispatch, syncCart, reconcile, startMutation } = useCart();
	const { matchedCombination, selectedValuesByName } = useCustomization();
	const [customInscription, setCustomInscription] = useState("");
	const formRef = useRef<HTMLFormElement>(null);
	const [showStickyBar, setShowStickyBar] = useState(false);

	useEffect(() => {
		const target = formRef.current;
		if (!target || typeof IntersectionObserver === "undefined") return;

		const observer = new IntersectionObserver(
			([entry]) => {
				setShowStickyBar(!entry.isIntersecting);
			},
			{ threshold: 0.1 },
		);

		observer.observe(target);
		return () => observer.disconnect();
	}, []);

	const selectedVariant = useSelectedVariant(variants);

	// Dynamic out-of-stock handling: null stock indicates unlimited/made-to-order craft
	const isOutOfStock = Boolean(
		selectedVariant && selectedVariant.stock !== null && selectedVariant.stock <= 0,
	);
	const maxQuantity =
		selectedVariant?.stock !== null && selectedVariant?.stock !== undefined
			? Math.max(0, selectedVariant.stock)
			: 99;
	const effectiveQuantity = isOutOfStock ? 1 : Math.min(quantity, Math.max(1, maxQuantity));

	const { resolvedTiers, volumePrice } = useVolumePricing(
		volumePricingTiers,
		selectedVariant?.id,
		effectiveQuantity,
		taxBehavior,
	);

	const unitPrice = volumePrice ?? (selectedVariant ? displayPrice(selectedVariant, taxBehavior) : null);

	// Add customization price adjustment if present
	const finalUnitPrice =
		matchedCombination?.price_adjustment && unitPrice
			? String(Number(unitPrice) + matchedCombination.price_adjustment)
			: unitPrice;

	const totalPrice = finalUnitPrice ? BigInt(finalUnitPrice) * BigInt(effectiveQuantity) : null;

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
			const basePrice = BigInt(displayPrice(selectedVariant, taxBehavior));
			const price = matchedCombination?.price_adjustment
				? basePrice + BigInt(matchedCombination.price_adjustment)
				: basePrice;

			const listPrice = BigInt(
				displayPrice(selectedVariant, taxBehavior, "originalPrice") ??
					displayPrice(selectedVariant, taxBehavior),
			);
			const onSale = listPrice > basePrice;
			return {
				display: fmt(price),
				compareAt: onSale ? fmt(listPrice) : null,
				discountPercent: onSale
					? Math.round((Number(listPrice - basePrice) / Number(listPrice)) * 100)
					: null,
			};
		}

		const { min: minPrice, max: maxPrice } = priceRange(variants, taxBehavior);
		return {
			display: minPrice === maxPrice ? fmt(minPrice) : `${fmt(minPrice)} - ${fmt(maxPrice)}`,
			compareAt: null,
			discountPercent: null,
		};
	}, [selectedVariant, variants, locale, currency, taxBehavior, matchedCombination?.price_adjustment]);

	// EU Omnibus: when the variant is discounted, show the lowest price recorded in the last 30 days.
	const omnibusPrice = useMemo(() => {
		if (!selectedVariant || !priceInfo.compareAt) return null;
		const lowest = displayPrice(selectedVariant, taxBehavior, "omnibusPrice");
		if (!lowest) return null;
		return formatMoney({ amount: BigInt(lowest), currency, locale });
	}, [selectedVariant, priceInfo.compareAt, locale, currency, taxBehavior]);

	// Stock availability status
	const stockStatus = useMemo(() => {
		if (!selectedVariant) return null;
		const { stock } = selectedVariant;
		if (stock !== null && stock <= 0) {
			return { label: "Out of stock", tone: "out" as "low" | "out" | "in" };
		}
		if (stock !== null && stock <= LOW_STOCK_THRESHOLD) {
			return { label: `Only ${stock} left in stock`, tone: "low" as "low" | "out" | "in" };
		}
		return null;
	}, [selectedVariant]);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		if (!selectedVariant || isOutOfStock) return;

		const variantId = selectedVariant.id;
		const addedQuantity = effectiveQuantity;
		const previousQuantity = items.find((item) => item.productVariant.id === variantId)?.quantity ?? 0;

		trackAddToCart(selectedVariant, product.name, addedQuantity);

		openCart();
		setQuantity(1);

		const mergedSelections = {
			...selectedValuesByName,
			...(customInscription.trim() ? { Inscription: customInscription.trim() } : {}),
		};

		const itemMetadata = {
			customization_selections: mergedSelections,
			customization_combination_id: matchedCombination?.id,
			preview_image: matchedCombination?.preview_image_url,
			customization_price_adjustment: matchedCombination?.price_adjustment,
			custom_inscription: customInscription.trim() || undefined,
		};

		// Instant local feedback OUTSIDE the transition, then REPLACE with the
		// server-returned cart (never refetch — the layout cartGet hits a stale
		// read replica). See patterns/cart-sync.md.
		dispatch({
			type: "ADD_ITEM",
			item: {
				quantity: addedQuantity,
				metadata: itemMetadata,
				productVariant: {
					id: variantId,
					price: finalUnitPrice || selectedVariant.price,
					priceGross: finalUnitPrice || selectedVariant.priceGross,
					images: matchedCombination?.preview_image_url
						? [matchedCombination.preview_image_url]
						: selectedVariant.images,
					product,
				},
			},
		});

		startMutation(async () => {
			const result = await addToCart(
				variantId,
				addedQuantity,
				itemMetadata,
				finalUnitPrice ? Number(finalUnitPrice) : undefined,
			);
			if (result.success && result.cart) {
				syncCart(result.cart);
				const line = result.cart.lineItems.find((item: any) => item.productVariant?.id === variantId);
				if (line && line.quantity < previousQuantity + addedQuantity) {
					toast.warning(`Only ${line.quantity} in stock — quantity adjusted`);
				}
			} else {
				await reconcile();
				toast.error(result.error || "Could not add item to cart");
			}
		});
	};

	return (
		<div className="flex flex-col gap-6">
			{/* Price & sale */}
			<div className="flex flex-col gap-2 pb-5 border-b border-border-vellum">
				<div className="flex flex-wrap items-baseline gap-3 sm:gap-4 mt-2">
					<span className="font-headline-md text-headline-md text-primary font-normal tracking-tight">
						<span className="sr-only">Current price: </span>
						{priceInfo.display}
					</span>
					{priceInfo.compareAt && (
						<del className="text-lg text-secondary/70 line-through decoration-secondary/50 font-normal">
							<span className="sr-only">Original price: </span>
							{priceInfo.compareAt}
						</del>
					)}
					{priceInfo.discountPercent ? (
						<span className="inline-flex items-center font-label-sm text-xs font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-sm bg-brand-script/10 text-brand-script border border-brand-script/20">
							Save {priceInfo.discountPercent}%
						</span>
					) : null}
				</div>
				<p className="font-body-sm text-body-sm text-secondary/80 mt-1">Taxes included.</p>

				{omnibusPrice && (
					<p className="font-body-sm text-body-sm text-muted-foreground mt-2">
						Lowest price in the last 30 days: {omnibusPrice}
					</p>
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

				{summary && (
					<p className="font-body-md text-body-md text-secondary leading-relaxed break-words [overflow-wrap:anywhere] pt-2">
						{summary}
					</p>
				)}
			</div>

			{variants.length > 1 && <VariantSelector variants={variants} />}
			<CustomizationSelector />

			{matchedCombination && (
				<div className="p-3.5 bg-paper-tint/70 border border-border/80 rounded-sm flex items-center gap-3.5 mt-2">
					{matchedCombination.preview_image_url && (
						<img
							src={matchedCombination.preview_image_url}
							alt="Selected combination preview"
							className="w-14 h-14 object-cover rounded border border-border shrink-0 shadow-xs"
						/>
					)}
					<div className="flex-1 min-w-0">
						<div className="text-[11px] uppercase tracking-widest text-secondary font-label-sm font-semibold">
							Active Bespoke Combination
						</div>
						<div className="text-sm font-medium text-primary truncate mt-0.5">
							{matchedCombination.values?.map((v: any) => v.value).join(" • ")}
						</div>
						{matchedCombination.price_adjustment ? (
							<div className="text-xs text-secondary mt-0.5">
								{matchedCombination.price_adjustment > 0 ? "+" : ""}
								{formatMoney({ amount: BigInt(matchedCombination.price_adjustment), currency, locale })}{" "}
								adjustment included
							</div>
						) : null}
					</div>
				</div>
			)}

			<VolumePricingDisplay tiers={resolvedTiers} quantity={effectiveQuantity} volumePrice={volumePrice} />

			{/* Bespoke Personalization & Hand-Lettered Inscription */}
			<div className="space-y-3 pt-5 pb-3 border-t border-border-vellum">
				<div className="flex items-center justify-between gap-2">
					<div className="flex items-center gap-2">
						<label
							htmlFor="bespoke-inscription"
							className="text-sm font-medium text-primary flex items-center gap-1.5"
						>
							<PenTool className="w-4 h-4 text-brand-script shrink-0" />
							Personalized Inscription & Calligraphy
						</label>
						<span className="hidden sm:inline-flex px-2 py-0.5 text-[10px] uppercase tracking-wider bg-tertiary-fixed text-primary font-label-sm font-semibold rounded-xs">
							Complimentary
						</span>
					</div>
					<span className="text-xs text-secondary font-mono shrink-0">{customInscription.length}/150</span>
				</div>

				<textarea
					id="bespoke-inscription"
					rows={3}
					maxLength={150}
					value={customInscription}
					onChange={(e) => setCustomInscription(e.target.value)}
					placeholder="e.g. Aarav & Meera — 24th October 2026 • Forever in Love"
					className="w-full text-base p-3.5 rounded-sm border border-border-vellum bg-paper-tint/70 focus:bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-primary placeholder:text-secondary/60 transition-all resize-none leading-relaxed"
				/>

				<div className="flex items-center justify-between text-xs text-secondary">
					<span className="flex items-center gap-1.5">
						<Sparkles className="w-3.5 h-3.5 text-brand-script shrink-0" />
						Hand-lettered with archival sumi ink & gilded 24K gold accents
					</span>
					<span className="text-xs text-secondary/70">Optional</span>
				</div>

				{/* Quick Inspiration Examples */}
				<div className="flex flex-wrap items-center gap-1.5 pt-1">
					<span className="text-[11px] uppercase tracking-wider text-secondary/70 font-label-sm">
						Inspiration:
					</span>
					{[
						"Aarav & Meera • 24.10.2026",
						"“Where thou art, that is home.”",
						"Dr. Sharma • In Honor & Gratitude",
					].map((sample) => (
						<button
							key={sample}
							type="button"
							onClick={() => setCustomInscription(sample)}
							className="text-xs text-secondary hover:text-primary bg-surface-container-low hover:bg-surface-container px-2 py-1 rounded transition-colors border border-border/50 text-left cursor-pointer"
						>
							{sample}
						</button>
					))}
				</div>

				{/* Live Calligraphy Script Preview Card */}
				{customInscription.trim() && (
					<div className="mt-3 p-4 sm:p-5 bg-paper-tint rounded-sm border border-border-vellum shadow-xs flex flex-col items-center justify-center text-center gap-2 relative overflow-hidden transition-all animate-in fade-in duration-300">
						<div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-secondary font-label-sm">
							<span className="w-6 h-px bg-border-vellum" />
							<span className="flex items-center gap-1 text-primary font-medium">
								<PenTool className="w-3 h-3 text-brand-script" />
								Live Atelier Script Preview
							</span>
							<span className="w-6 h-px bg-border-vellum" />
						</div>

						<p className="font-serif italic text-lg sm:text-xl text-primary leading-relaxed break-words max-w-md px-2 py-1">
							“{customInscription.trim()}”
						</p>

						<p className="text-[11px] text-secondary/80 tracking-wide font-sans">
							Individual pointed dip-pen lettering on deckled cotton paper. High-res proof shared via WhatsApp
							before sealing.
						</p>
					</div>
				)}
			</div>

			<div className="flex flex-col gap-3 pt-2">
				{isOutOfStock && restockNotificationsEnabled && selectedVariant ? (
					<RestockNotify productVariantId={selectedVariant.id} productName={product.name} />
				) : (
					<form ref={formRef} onSubmit={handleSubmit} className="flex flex-col gap-4">
						<div className="flex items-stretch gap-3">
							<QuantitySelector
								quantity={effectiveQuantity}
								onQuantityChange={setQuantity}
								max={Math.max(1, Math.min(99, maxQuantity))}
								disabled={isOutOfStock}
							/>
							<button
								type="submit"
								disabled={!selectedVariant || isOutOfStock}
								className="flex-1 h-[49px] bg-primary hover:bg-brand-script-dark text-on-primary transition-all duration-300 font-label-lg text-label-lg uppercase tracking-widest flex items-center justify-center gap-2 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-script focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
							>
								<span className="">{buttonText}</span>
								<ArrowRight className="w-4 h-4" />
							</button>
						</div>
					</form>
				)}
				{/* Inquire Secondary Button */}
				<a
					href={`https://wa.me/919823011942?text=${encodeURIComponent(
						`Hello The Letter Ink, I would like to inquire with the atelier calligrapher regarding "${product.name}".`,
					)}`}
					target="_blank"
					rel="noopener noreferrer"
					className="w-full h-[45px] bg-transparent hover:bg-paper-tint text-primary font-label-md text-label-md uppercase tracking-widest flex items-center justify-center gap-2 transition-colors border border-border-vellum/60 rounded-sm"
				>
					<MessageCircle className="w-4 h-4 text-brand-script" />
					<span className="">Inquire With Atelier Calligrapher</span>
				</a>
			</div>

			{/* Sticky Mobile Purchase Bar (Active when buy box CTA scrolls off screen) */}
			{showStickyBar && (
				<div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-background/95 backdrop-blur-md border-t border-border-vellum px-4 py-3 shadow-[0_-4px_16px_rgba(0,0,0,0.12)] flex items-center justify-between gap-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
					<div className="flex flex-col min-w-0 flex-1">
						<span className="font-label-sm text-xs font-semibold text-primary truncate">{product.name}</span>
						<div className="flex items-baseline gap-2 mt-0.5">
							<span className="font-headline-sm text-base text-primary font-bold">
								<span className="sr-only">Current price: </span>
								{priceInfo.display}
							</span>
							{priceInfo.compareAt && (
								<del className="text-xs text-secondary/70 line-through">
									<span className="sr-only">Original price: </span>
									{priceInfo.compareAt}
								</del>
							)}
							{priceInfo.discountPercent ? (
								<span className="text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 bg-brand-script/10 text-brand-script border border-brand-script/20 rounded-sm">
									-{priceInfo.discountPercent}%
								</span>
							) : null}
						</div>
					</div>
					<button
						type="button"
						onClick={() => {
							if (formRef.current) {
								formRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
							}
						}}
						disabled={!selectedVariant || isOutOfStock}
						className="h-10 px-5 bg-primary hover:bg-brand-script-dark text-on-primary font-label-md text-xs uppercase tracking-wider flex items-center gap-1.5 rounded-sm shrink-0 shadow-sm cursor-pointer disabled:opacity-50"
					>
						<span>{buttonText}</span>
						<ArrowRight className="w-3.5 h-3.5" />
					</button>
				</div>
			)}
		</div>
	);
}
