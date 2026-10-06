import { ArrowRight, Clock } from "lucide-react";
import Link from "next/link";
import { getActiveCampaigns } from "@/lib/campaigns";
import type {
	APICollectionGetByIdResult,
	APIProductGetByIdResult,
	APIProductsBrowseResult,
} from "@/lib/commerce-types";
import { formatMoney } from "@/lib/money";
import { displayPrice, priceRange } from "@/lib/pricing";
import { getStoreConfig } from "@/lib/store-config";
import { LetterInkMedia } from "@/lib/the-letter-ink-media";
import { isVideoUrl } from "@/lib/utils";

type BrowseProduct = APIProductsBrowseResult["data"][number];
type CollectionProduct = APICollectionGetByIdResult["productCollections"][number]["product"];
type FullProduct = NonNullable<APIProductGetByIdResult>;

export async function ProductCard({
	product,
	priority = false,
}: {
	product: BrowseProduct | CollectionProduct | FullProduct;
	priority?: boolean;
}) {
	const { currency, locale, taxBehavior } = await getStoreConfig();
	const activeCampaigns = await getActiveCampaigns();
	const isCampaignActive = activeCampaigns.length > 0;

	const variants = "variants" in product ? product.variants : null;
	const { min: minPrice, max: maxPrice } =
		variants && variants.length > 0 ? priceRange(variants, taxBehavior) : { min: null, max: null };

	const isPriceRange = Boolean(
		variants && variants.length > 1 && minPrice && maxPrice && minPrice !== maxPrice,
	);

	const priceDisplay = minPrice ? formatMoney({ amount: minPrice, currency, locale }) : null;

	const firstVariant = variants?.[0];
	const originalPriceVal = firstVariant ? displayPrice(firstVariant, taxBehavior, "originalPrice") : null;
	const isDiscounted = Boolean(originalPriceVal && minPrice && Number(originalPriceVal) > Number(minPrice));
	const compareAtDisplay = isDiscounted ? formatMoney({ amount: originalPriceVal!, currency, locale }) : null;

	const percentOff =
		isDiscounted && originalPriceVal && minPrice
			? Math.round(((Number(originalPriceVal) - Number(minPrice)) / Number(originalPriceVal)) * 100)
			: 0;

	const allImages = [
		...(product.images ?? []),
		...(variants
			?.flatMap((v: any) => v.images ?? [])
			.filter((img: any) => !(product.images ?? []).includes(img)) ?? []),
	];
	const primaryImage = allImages[0] || (product as any).thumbnail;
	const secondaryImage = allImages[1];

	const categoryLabel =
		(product as any).category?.name ||
		(product as any).metadata?.category_name ||
		((product as any).type && (product as any).type !== "standard" ? (product as any).type : null) ||
		"Atelier Creation";

	const isWorkshop =
		categoryLabel?.toLowerCase().includes("workshop") || (product as any).type === "workshop";

	const leadTime =
		(product as any).leadTime ||
		(product as any).metadata?.lead_time ||
		(product as any).metadata?.leadTime ||
		(product as any).metadata?.turnaround ||
		(isWorkshop ? "Interactive Masterclass" : "Ships in 5–7 days");

	const summary =
		(product as any).summary || (product as any).description || (product as any).metadata?.summary || null;

	const editionBadge = (product as any).badge || (product as any).metadata?.badge || null;
	const discountBadge = isDiscounted ? (percentOff > 0 ? `Save ${percentOff}%` : "Sale") : null;

	// A single-variant card deep-links to that variant; a bare link would show the product's default.
	const onlyVariant = variants?.length === 1 ? variants[0] : null;
	const variantSearch = (() => {
		if (!onlyVariant || !("combinations" in onlyVariant) || onlyVariant.combinations.length === 0) {
			return "";
		}
		const params = new URLSearchParams();
		for (const combination of onlyVariant.combinations) {
			params.set(combination.variantValue.variantType.label, combination.variantValue.value);
		}
		return `?${params.toString()}`;
	})();

	return (
		<Link
			href={`/product/${product.slug}${variantSearch}`}
			className="group relative flex flex-col bg-surface-container-lowest border border-border-vellum/70 shadow-2xs hover:shadow-xl transition-all duration-300 rounded-xl overflow-hidden justify-between"
		>
			{/* Image */}
			<div className="relative w-full aspect-[4/5] overflow-hidden bg-surface-container-low">
				{(editionBadge || discountBadge) && (
					<div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5 items-start">
						{editionBadge && (
							<span
								className={`font-label-sm text-[10px] uppercase tracking-widest px-2.5 py-1 font-bold rounded-sm shadow-xs ${
									editionBadge === "Patron's Pick"
										? "bg-tertiary-fixed text-on-tertiary-fixed"
										: "bg-primary text-on-primary"
								}`}
							>
								{editionBadge}
							</span>
						)}
						{discountBadge && (
							<span className="font-label-sm text-[10px] uppercase tracking-widest px-2.5 py-1 font-bold rounded-sm bg-tertiary-fixed text-on-tertiary-fixed shadow-xs">
								{discountBadge}
							</span>
						)}
					</div>
				)}

				{primaryImage &&
					(isVideoUrl(primaryImage) ? (
						<video
							className={`absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 ${secondaryImage ? "group-hover:opacity-0" : ""}`}
							src={primaryImage}
							muted
							loop
							autoPlay
							playsInline
						/>
					) : (
						<LetterInkMedia
							src={primaryImage}
							alt={product.name}
							fill
							sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
							className={`object-cover transition-all duration-700 group-hover:scale-105 ${secondaryImage ? "group-hover:opacity-0" : ""}`}
							priority={priority}
						/>
					))}
				{secondaryImage &&
					(isVideoUrl(secondaryImage) ? (
						<video
							className="absolute inset-0 w-full h-full object-cover opacity-0 transition-opacity duration-700 group-hover:opacity-100"
							src={secondaryImage}
							muted
							loop
							autoPlay
							playsInline
						/>
					) : (
						<LetterInkMedia
							src={secondaryImage}
							alt={`${product.name} - alternate view`}
							fill
							sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
							className="object-cover opacity-0 transition-all duration-700 group-hover:opacity-100 group-hover:scale-105"
						/>
					))}
			</div>

			{/* Card Body */}
			<div className="p-space-md flex flex-col flex-grow justify-between space-y-space-xs">
				<div>
					<div className="flex items-center justify-between gap-2 mb-1">
						<span className="font-label-sm text-label-sm uppercase tracking-widest text-secondary truncate">
							{categoryLabel}
						</span>
					</div>
					<h3 className="font-headline-sm text-headline-sm text-primary group-hover:text-secondary transition-colors line-clamp-1 mt-1 font-serif">
						{product.name}
					</h3>
					{summary && (
						<p className="font-body-sm text-body-sm text-on-surface-variant line-clamp-2 mt-1.5">{summary}</p>
					)}
				</div>

				<div className="pt-space-xs flex items-end justify-between mt-4 border-t border-border-vellum/60 pt-3">
					<div className="flex flex-col min-w-0">
						<span className="font-label-sm text-[11px] uppercase tracking-wider text-secondary/90 flex items-center gap-1.5 mb-1.5">
							<Clock className="w-3.5 h-3.5 text-secondary/80 shrink-0" />
							<span className="truncate">{leadTime}</span>
						</span>
						<div className="flex items-baseline gap-1.5 flex-wrap">
							{isPriceRange && (
								<span className="font-label-sm text-[11px] uppercase tracking-widest text-secondary font-medium">
									From
								</span>
							)}
							{priceDisplay && (
								<span className="font-headline-md text-headline-md text-primary font-serif">
									{priceDisplay}
								</span>
							)}
							{compareAtDisplay && (
								<span className="font-body-sm text-body-sm text-secondary line-through">
									{compareAtDisplay}
								</span>
							)}
						</div>
					</div>

					<span className="px-3.5 py-1.5 bg-primary text-on-primary font-label-sm text-xs uppercase tracking-wider rounded group-hover:bg-tertiary-fixed group-hover:text-primary transition-colors flex items-center gap-1.5 shadow-2xs shrink-0 ml-2">
						<span>Customise</span>
						<ArrowRight className="w-3.5 h-3.5" />
					</span>
				</div>
			</div>
		</Link>
	);
}
