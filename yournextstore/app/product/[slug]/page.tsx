import { Star } from "lucide-react";
import type { Metadata } from "next";
import { cacheLife } from "next/cache";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { AddToCartButton } from "@/app/product/[slug]/add-to-cart-button";
import { BundleBuilder } from "@/app/product/[slug]/bundle-builder";
import { MediaGallery } from "@/app/product/[slug]/media-gallery";
import { ProductFeatures } from "@/app/product/[slug]/product-features";
import { ProductReviews } from "@/app/product/[slug]/product-reviews";
import { RelatedProducts } from "@/app/product/[slug]/related-products";
import { ProductCustomizationProvider } from "@/app/product/[slug]/customization-context";
import { TiptapRenderer } from "@/components/tiptap-renderer";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Skeleton } from "@/components/ui/skeleton";
import { commerce, meGetCached } from "@/lib/commerce";
import { buildProductBreadcrumbJsonLd, buildProductJsonLd, JsonLdScript } from "@/lib/json-ld";
import { TrackProductView } from "@/lib/track";
import { cn } from "@/lib/utils";

// MediaGallery and the purchase panel read useSearchParams (selected variant),
// so they need a Suspense boundary to keep the rest of the page prerenderable.
function GallerySkeleton() {
	return (
		<div className="flex flex-col gap-4 lg:sticky lg:top-24 lg:self-start">
			<Skeleton className="aspect-square rounded-2xl" />
		</div>
	);
}

function PurchasePanelSkeleton() {
	return (
		<div className="space-y-4">
			<Skeleton className="h-9 w-40" />
			<Skeleton className="h-12 w-full rounded-full" />
		</div>
	);
}

function ProductPageSkeleton() {
	return (
		<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
			<Skeleton className="mb-6 h-5 w-64" />
			<div className="lg:grid lg:grid-cols-2 lg:gap-16">
				<GallerySkeleton />
				<div className="mt-8 lg:mt-0 space-y-8">
					<Skeleton className="h-12 w-3/4" />
					<PurchasePanelSkeleton />
				</div>
			</div>
		</div>
	);
}

function StarRow({ rating }: { rating: number }) {
	const rounded = Math.round(rating);
	return (
		<span className="flex gap-0.5" aria-hidden>
			{Array.from({ length: 5 }, (_, i) => (
				<Star
					key={i}
					className={cn("h-4 w-4", i < rounded ? "fill-yellow-400 text-yellow-400" : "fill-muted text-muted")}
				/>
			))}
		</span>
	);
}

// `productGet` resolves the API error rather than null for a missing slug, so the
// `!product` branches below are unreachable without this: the throw escapes the
// streamed Suspense boundary and the route answers 200 with an empty shell.
async function safeProductGet(slug: string) {
	try {
		return await commerce.productGet({ idOrSlug: slug });
	} catch {
		return null;
	}
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
	"use cache";
	cacheLife("minutes");
	const { slug } = await params;
	const product = await safeProductGet(slug);

	if (!product) {
		return { title: "Product Not Found", robots: { index: false, follow: true } };
	}

	const seoTitle = product.seo?.title || product.name;
	const seoDescription = product.seo?.description || product.summary || undefined;
	const canonical = product.seo?.canonical || `/product/${product.slug}`;
	const image = product.images[0];

	return {
		title: seoTitle,
		description: seoDescription,
		alternates: { canonical },
		openGraph: {
			type: "website",
			title: seoTitle,
			description: seoDescription,
			url: canonical,
			images: image ? [{ url: image, alt: product.name }] : undefined,
		},
		twitter: {
			card: image ? "summary_large_image" : "summary",
			title: seoTitle,
			description: seoDescription,
			images: image ? [image] : undefined,
		},
	};
}

// Awaiting params at the top of the page blocks the static shell — the page
// stays a sync shell and the params-dependent content streams inside Suspense.
export default function ProductPage(props: { params: Promise<{ slug: string }> }) {
	return (
		<Suspense fallback={<ProductPageSkeleton />}>
			<ProductDetails params={props.params} />
		</Suspense>
	);
}

const getProductPageData = async (slug: string) => {
	"use cache";
	cacheLife("minutes");

	const me = await meGetCached().catch(() => null);
	const reviewsEnabled = me?.store.settings?.enabledTools?.reviews ?? false;
	const restockNotificationsEnabled = me?.store.settings?.enabledTools?.restockNotifications ?? false;
	const [product, reviews] = await Promise.all([
		safeProductGet(slug),
		reviewsEnabled
			? commerce.productReviewsBrowse({ idOrSlug: slug }, { limit: 20 }).catch(() => null)
			: Promise.resolve(null),
	]);

	return { product, reviews, restockNotificationsEnabled };
};

const ProductDetails = async ({ params }: { params: Promise<{ slug: string }> }) => {
	const { slug } = await params;
	const { product, reviews, restockNotificationsEnabled } = await getProductPageData(slug);

	if (!product) {
		notFound();
	}

	const reviewSummary = reviews?.summary ?? null;

	const allImages = [
		...product.images,
		...product.variants.flatMap((v) => v.images).filter((img) => !product.images.includes(img)),
	];

	const productJsonLd = await buildProductJsonLd(product, reviews);

	return (
		<main className="w-full bg-background min-h-screen">
			<JsonLdScript data={productJsonLd} />
			<JsonLdScript data={buildProductBreadcrumbJsonLd(product)} />
			{product.variants[0] && <TrackProductView variant={product.variants[0]} name={product.name} />}
			
			{/* Breadcrumb & Top Bar */}
			<section className="w-full max-w-7xl mx-auto px-margin-mobile md:px-gutter pt-6 pb-4">
				<nav className="flex items-center gap-2 font-body-sm text-body-sm text-secondary tracking-wider uppercase">
					<Link href="/" className="hover:text-primary transition-colors">Home</Link>
					<span className="text-secondary/40 text-xs">/</span>
					<Link href="/shop" className="hover:text-primary transition-colors">Shop</Link>
					{product.category && (
						<>
							<span className="text-secondary/40 text-xs">/</span>
							<Link href={`/category/${product.category.slug}`} className="hover:text-primary transition-colors">{product.category.name}</Link>
						</>
					)}
					<span className="text-secondary/40 text-xs">/</span>
					<span className="text-primary font-medium">{product.name}</span>
				</nav>
			</section>

			{/* Product Showcase (2-Column Editorial Masterpiece) */}
			<section className="w-full max-w-7xl mx-auto px-margin-mobile md:px-gutter pb-space-lg">
				<ProductCustomizationProvider productId={product.id}>
					<div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-gutter items-start">
						{/* Left Column: Expansive Imagery Gallery */}
						<div className="lg:col-span-7 flex flex-col gap-4">
							<Suspense fallback={<GallerySkeleton />}>
								<MediaGallery images={allImages} productName={product.name} variants={product.variants} />
							</Suspense>
						</div>

						{/* Right Column: Atelier Customizer & Purchase Actions */}
						<div className="lg:col-span-5 flex flex-col gap-6 min-w-0 w-full">
							{/* Header Info */}
							<div className="flex flex-col gap-2 pb-5 bg-gradient-to-b from-transparent to-surface-container-low/40 p-1">
								<div className="flex items-center justify-between gap-4">
									<span className="font-label-sm text-label-sm uppercase tracking-[0.25em] text-secondary">The Atelier Heirlooms Series</span>
									{reviewSummary && reviewSummary.reviewCount > 0 && (
										<a href="#reviews" className="flex items-center gap-1.5 transition-opacity hover:opacity-80">
											<div className="flex text-primary">
												<StarRow rating={reviewSummary.averageRating} />
											</div>
											<span className="font-label-sm text-label-sm text-on-surface font-semibold">{reviewSummary.averageRating.toFixed(1)}</span>
											<span className="font-body-sm text-body-sm text-secondary">({reviewSummary.reviewCount} Patrons)</span>
										</a>
									)}
								</div>
								<h1 className="font-headline-lg text-headline-lg text-primary tracking-wide mt-1 break-words [overflow-wrap:anywhere]">
									{product.name}
								</h1>
								<p className="font-body-md text-body-md text-secondary leading-relaxed break-words [overflow-wrap:anywhere]">
									{product.summary || "Bespoke Classical Calligraphy in Antiqued Brass & Double Glass Float Frame"}
								</p>
							</div>

							{/* Editorial Description Callout */}
							{product.content && (typeof product.content !== "string" || !["NA", "N/A"].includes(product.content.trim().toUpperCase())) && (
								<div className="w-full min-w-0 h-auto p-4 md:p-5 bg-paper-tint text-on-surface border border-border-vellum/40 break-words [overflow-wrap:anywhere]">
									<div className="font-body-md text-body-md text-on-surface-variant leading-relaxed break-words [overflow-wrap:anywhere]">
										<TiptapRenderer content={product.content} />
									</div>
								</div>
							)}

							{product.type === "bundle" && product.bundle?.groups?.length ? (
								<BundleBuilder
									bundleId={product.id}
									bundle={product.bundle}
									pricing={{
										mode: product.bundlePriceMode,
										fixedPriceAmount: product.bundleFixedPriceAmount,
										fixedPriceAmountGross: product.bundleFixedPriceAmountGross,
										amountOffAmount: product.bundleAmountOffAmount,
										amountOffAmountGross: product.bundleAmountOffAmountGross,
									}}
								/>
							) : (
								<Suspense fallback={<PurchasePanelSkeleton />}>
									<AddToCartButton
										variants={product.variants}
										product={{
											id: product.id,
											name: product.name,
											slug: product.slug,
											images: product.images,
										}}
										summary={product.summary}
										volumePricingTiers={product.volumePricingTiers}
										restockNotificationsEnabled={restockNotificationsEnabled}
									/>
								</Suspense>
							)}
							
							{/* Trust & Fulfillment Triad */}
							<div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-3">
								<div className="flex flex-col gap-1 p-3 bg-paper-tint">
									<span className="material-symbols-outlined text-primary text-[20px]">brush</span>
									<span className="font-label-sm text-label-sm uppercase tracking-wider text-primary">100% Dip-Pen Hand Scripted</span>
									<span className="font-body-sm text-[12px] text-secondary">Zero digital prints; genuine archival hand calligraphy.</span>
								</div>
								<div className="flex flex-col gap-1 p-3 bg-paper-tint">
									<span className="material-symbols-outlined text-primary text-[20px]">mark_chat_read</span>
									<span className="font-label-sm text-label-sm uppercase tracking-wider text-primary">Pre-Dispatch Proof</span>
									<span className="font-body-sm text-[12px] text-secondary">High-res approval via WhatsApp before glass sealing.</span>
								</div>
								<div className="flex flex-col gap-1 p-3 bg-paper-tint">
									<span className="material-symbols-outlined text-primary text-[20px]">local_shipping</span>
									<span className="font-label-sm text-label-sm uppercase tracking-wider text-primary">5-7 Days • Insured</span>
									<span className="font-body-sm text-[12px] text-secondary">Cushioned wooden crate courier delivery nationwide.</span>
								</div>
							</div>
						</div>
					</div>
				</ProductCustomizationProvider>
			</section>

			{/* Reviews Section */}
			{reviews && (
				<div id="reviews" className="w-full max-w-7xl mx-auto px-margin-mobile md:px-gutter py-space-lg border-t border-border-vellum">
					<ProductReviews reviews={reviews} slug={slug} />
				</div>
			)}

			{/* Related Products */}
			<section className="w-full max-w-7xl mx-auto px-margin-mobile md:px-gutter py-space-lg">
				<div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
					<div>
						<span className="font-label-sm text-label-sm uppercase tracking-[0.25em] text-secondary">Complete the Ensemble</span>
						<h2 className="font-headline-lg text-headline-lg text-primary mt-1">Related Atelier Heirlooms</h2>
					</div>
					<Link className="font-label-md text-label-md uppercase tracking-wider text-primary hover:text-secondary flex items-center gap-1.5 transition-colors" href="/shop">
						<span>Explore All Frames</span>
						<span className="material-symbols-outlined text-[16px]">north_east</span>
					</Link>
				</div>
				<RelatedProducts productId={product.id} categorySlug={product.category?.slug} />
			</section>

			{/* Bespoke Commission Inquiry Banner */}
			<section className="w-full max-w-7xl mx-auto px-margin-mobile md:px-gutter pb-space-lg">
				<div className="w-full bg-paper-tint p-8 md:p-12 shadow-sm flex flex-col md:flex-row items-center justify-between gap-8">
					<div className="flex flex-col gap-2 max-w-xl text-center md:text-left">
						<span className="font-label-sm text-label-sm uppercase tracking-[0.25em] text-secondary">Architectural & Large Format Commissions</span>
						<h3 className="font-headline-lg text-headline-lg text-primary">Seeking a Custom Dimension or Poetry Inscription?</h3>
						<p className="font-body-md text-body-md text-secondary leading-relaxed">
							Our senior scribe accepts private custom commissions for poetry, family crests, Sanskrit shlokas, and oversized architectural brass installations up to 36 inches.
						</p>
					</div>
					<div className="flex flex-col sm:flex-row items-center gap-4 shrink-0">
						<button className="h-[49px] px-8 bg-primary hover:bg-tertiary-fixed text-on-primary hover:text-on-tertiary-fixed font-label-lg text-label-lg uppercase tracking-widest transition-all duration-300 shadow-sm" type="button">
							Book Atelier Consultation
						</button>
					</div>
				</div>
			</section>
		</main>
	);
};
