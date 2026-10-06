import { ArrowUpRight, CheckCircle2, PenTool, Truck } from "lucide-react";
import type { Metadata } from "next";
import { cacheLife } from "next/cache";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { AddToCartButton } from "@/app/product/[slug]/add-to-cart-button";
import { BundleBuilder } from "@/app/product/[slug]/bundle-builder";
import { ProductCustomizationProvider } from "@/app/product/[slug]/customization-context";
import { MediaGallery } from "@/app/product/[slug]/media-gallery";
import { RelatedProducts } from "@/app/product/[slug]/related-products";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { TiptapRenderer } from "@/components/tiptap-renderer";
import { Skeleton } from "@/components/ui/skeleton";
import { commerce, meGetCached } from "@/lib/commerce";
import { buildProductBreadcrumbJsonLd, buildProductJsonLd, JsonLdScript } from "@/lib/json-ld";
import { TrackProductView } from "@/lib/track";

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
	const canonical = (product.seo as any)?.canonical || `/product/${product.slug}`;
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
	const restockNotificationsEnabled = me?.store.settings?.enabledTools?.restockNotifications ?? false;
	const product = await safeProductGet(slug);

	return { product, reviews: null, restockNotificationsEnabled };
};

const ProductDetails = async ({ params }: { params: Promise<{ slug: string }> }) => {
	const { slug } = await params;
	const { product, reviews, restockNotificationsEnabled } = await getProductPageData(slug);

	if (!product) {
		notFound();
	}

	const allImages = [
		...product.images,
		...product.variants.flatMap((v: any) => v.images).filter((img: string) => !product.images.includes(img)),
	];

	const productJsonLd = await buildProductJsonLd(product, reviews);

	const categoryName =
		product.category?.name ||
		(product as any).metadata?.category_name ||
		((product as any).type && (product as any).type !== "standard" ? (product as any).type : null) ||
		"Atelier Creation";

	const isWorkshop =
		categoryName.toLowerCase().includes("workshop") ||
		product.type === "workshop" ||
		Boolean(product.metadata?.is_workshop);

	return (
		<div className="w-full bg-background min-h-screen">
			<JsonLdScript data={productJsonLd} />
			<JsonLdScript data={buildProductBreadcrumbJsonLd(product)} />
			{product.variants[0] && <TrackProductView variant={product.variants[0]} name={product.name} />}

			{/* Breadcrumb & Top Bar */}
			<section className="w-full max-w-7xl mx-auto px-margin-mobile md:px-gutter pt-6 pb-4">
				<Breadcrumb>
					<BreadcrumbList className="font-body-sm text-body-sm text-secondary tracking-wider uppercase gap-1.5 sm:gap-2">
						<BreadcrumbItem>
							<BreadcrumbLink asChild>
								<Link href="/" className="hover:text-primary transition-colors">
									Home
								</Link>
							</BreadcrumbLink>
						</BreadcrumbItem>
						<BreadcrumbSeparator className="text-secondary/40 text-xs" aria-hidden="true">
							/
						</BreadcrumbSeparator>
						<BreadcrumbItem>
							<BreadcrumbLink asChild>
								<Link href="/shop" className="hover:text-primary transition-colors">
									Shop
								</Link>
							</BreadcrumbLink>
						</BreadcrumbItem>
						{product.category && (
							<>
								<BreadcrumbSeparator className="text-secondary/40 text-xs" aria-hidden="true">
									/
								</BreadcrumbSeparator>
								<BreadcrumbItem>
									<BreadcrumbLink asChild>
										<Link
											href={
												product.category.slug === "workshops" || product.metadata?.is_workshop
													? "/workshops"
													: `/category/${product.category.slug}`
											}
											className="hover:text-primary transition-colors"
										>
											{product.category.name}
										</Link>
									</BreadcrumbLink>
								</BreadcrumbItem>
							</>
						)}
						<BreadcrumbSeparator className="text-secondary/40 text-xs" aria-hidden="true">
							/
						</BreadcrumbSeparator>
						<BreadcrumbItem>
							<BreadcrumbPage className="text-primary font-medium truncate max-w-[200px] sm:max-w-none">
								{product.name}
							</BreadcrumbPage>
						</BreadcrumbItem>
					</BreadcrumbList>
				</Breadcrumb>
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
							<div className="flex flex-col gap-2 pb-2">
								<span className="font-label-sm text-label-sm uppercase tracking-[0.25em] text-secondary">
									{categoryName}
								</span>
								<h1 className="font-headline-lg text-headline-lg text-primary tracking-wide break-words [overflow-wrap:anywhere]">
									{product.name}
								</h1>
							</div>

							{product.type === "bundle" && (product as any).bundle?.groups?.length ? (
								<BundleBuilder
									bundleId={product.id}
									bundle={(product as any).bundle}
									pricing={{
										mode: (product as any).bundlePriceMode,
										fixedPriceAmount: (product as any).bundleFixedPriceAmount,
										fixedPriceAmountGross: (product as any).bundleFixedPriceAmountGross,
										amountOffAmount: (product as any).bundleAmountOffAmount,
										amountOffAmountGross: (product as any).bundleAmountOffAmountGross,
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
										summary={product.summary || (product as any).description}
										volumePricingTiers={(product as any).volumePricingTiers}
										restockNotificationsEnabled={restockNotificationsEnabled}
									/>
								</Suspense>
							)}

							{/* Trust & Fulfillment Triad */}
							<div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
								<div className="flex flex-col gap-1 p-3 bg-paper-tint">
									<PenTool className="w-5 h-5 text-primary" />
									<span className="font-label-sm text-label-sm uppercase tracking-wider text-primary">
										{isWorkshop ? "Personalized Coaching" : "100% Handcrafted"}
									</span>
									<span className="font-body-sm text-[12px] text-secondary">
										{isWorkshop
											? "Guided by master calligraphers; individual critique."
											: "Authentic studio craftsmanship; zero digital prints."}
									</span>
								</div>
								<div className="flex flex-col gap-1 p-3 bg-paper-tint">
									<CheckCircle2 className="w-5 h-5 text-primary" />
									<span className="font-label-sm text-label-sm uppercase tracking-wider text-primary">
										{isWorkshop ? "Studio Kit Included" : "Pre-Dispatch Proof"}
									</span>
									<span className="font-body-sm text-[12px] text-secondary">
										{isWorkshop
											? "Complete archival calligraphy materials delivered ahead."
											: "High-resolution preview via WhatsApp before final dispatch."}
									</span>
								</div>
								<div className="flex flex-col gap-1 p-3 bg-paper-tint">
									<Truck className="w-5 h-5 text-primary" />
									<span className="font-label-sm text-label-sm uppercase tracking-wider text-primary">
										{isWorkshop ? "Interactive Masterclass" : "Insured Delivery"}
									</span>
									<span className="font-body-sm text-[12px] text-secondary">
										{isWorkshop
											? "Live virtual masterclass access & recorded replay."
											: "Protective archival packaging with tracked delivery nationwide."}
									</span>
								</div>
							</div>

							{/* Product Details, Care & Shipping Accordions */}
							<Accordion
								type="single"
								collapsible
								defaultValue="details"
								className="w-full border-t border-border-vellum mt-2"
							>
								<AccordionItem value="details" className="border-b border-border-vellum/60">
									<AccordionTrigger className="font-serif text-base text-primary hover:no-underline py-4">
										{isWorkshop ? "Workshop Details & Curriculum" : "Artisanal Craft & Details"}
									</AccordionTrigger>
									<AccordionContent className="text-secondary leading-relaxed space-y-3 pb-5">
										{product.content &&
										(typeof product.content !== "string" ||
											!["NA", "N/A"].includes(product.content.trim().toUpperCase())) ? (
											<div className="font-body-md text-body-md text-on-surface-variant leading-relaxed break-words [overflow-wrap:anywhere]">
												<TiptapRenderer content={product.content} />
											</div>
										) : (
											<p className="font-body-md text-body-md">
												{product.summary ||
													(product as any).description ||
													"Individually hand-scripted in our studio using archival pigment inks and classical dip-pen calligraphy techniques."}
											</p>
										)}
									</AccordionContent>
								</AccordionItem>

								<AccordionItem value="care" className="border-b border-border-vellum/60">
									<AccordionTrigger className="font-serif text-base text-primary hover:no-underline py-4">
										{isWorkshop ? "Materials & Studio Kit" : "Materials & Archival Care"}
									</AccordionTrigger>
									<AccordionContent className="text-secondary leading-relaxed space-y-2 pb-5">
										{isWorkshop ? (
											<p className="font-body-md text-body-md">
												Each masterclass seat includes a curated calligraphy kit shipped prior to the session,
												including pointed nibs, oblique pen holder, imported sumi ink, practice guide sheets,
												and deckled cotton paper.
											</p>
										) : (
											<ul className="list-disc list-inside space-y-1.5 font-body-sm text-body-sm text-secondary">
												<li>
													Hand-lettered with lightfast, pH-neutral archival inks that resist fading over time.
												</li>
												<li>
													Created on premium 100% cotton deckle-edged handmade paper with natural textural
													grain.
												</li>
												<li>
													Keep out of direct intense sunlight and high humidity to preserve archival
													longevity.
												</li>
												<li>
													Clean float-glass frames with a dry microfiber cloth; avoid spraying liquid cleaners
													directly onto frame edges.
												</li>
											</ul>
										)}
									</AccordionContent>
								</AccordionItem>

								<AccordionItem value="shipping" className="border-b border-border-vellum/60">
									<AccordionTrigger className="font-serif text-base text-primary hover:no-underline py-4">
										Atelier Dispatch & Shipping
									</AccordionTrigger>
									<AccordionContent className="text-secondary leading-relaxed space-y-2 pb-5">
										<p className="font-body-md text-body-md">
											Every piece is made to order with patient dedication. Please allow 3–5 business days for
											hand-lettering and framing. A high-resolution photo proof is shared via WhatsApp prior
											to final sealing and dispatch.
										</p>
										<p className="font-body-sm text-body-sm text-secondary/90">
											Shipped in protective multi-layer cushioned archival packaging with insured courier
											tracking across India.
										</p>
									</AccordionContent>
								</AccordionItem>
							</Accordion>
						</div>
					</div>
				</ProductCustomizationProvider>
			</section>

			{/* Related Products */}
			<section className="w-full max-w-7xl mx-auto px-margin-mobile md:px-gutter py-space-lg">
				<div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
					<div>
						<span className="font-label-sm text-label-sm uppercase tracking-[0.25em] text-secondary">
							Complete the Ensemble
						</span>
						<h2 className="font-headline-lg text-headline-lg text-primary mt-1">Related Atelier Heirlooms</h2>
					</div>
					<Link
						className="font-label-md text-label-md uppercase tracking-wider text-primary hover:text-secondary flex items-center gap-1.5 transition-colors"
						href="/shop"
					>
						<span>Explore All Creations</span>
						<ArrowUpRight className="w-4 h-4" />
					</Link>
				</div>
				<RelatedProducts productId={product.id} categorySlug={product.category?.slug} />
			</section>

			{/* Bespoke Commission Inquiry Banner */}
			<section className="w-full max-w-7xl mx-auto px-margin-mobile md:px-gutter pb-space-lg">
				<div className="w-full bg-paper-tint p-8 md:p-12 shadow-sm flex flex-col md:flex-row items-center justify-between gap-8">
					<div className="flex flex-col gap-2 max-w-xl text-center md:text-left">
						<span className="font-label-sm text-label-sm uppercase tracking-[0.25em] text-secondary">
							Architectural & Large Format Commissions
						</span>
						<h3 className="font-headline-lg text-headline-lg text-primary">
							Seeking a Custom Dimension or Poetry Inscription?
						</h3>
						<p className="font-body-md text-body-md text-secondary leading-relaxed">
							Our senior scribe accepts private custom commissions for poetry, family crests, Sanskrit
							shlokas, and oversized architectural brass installations up to 36 inches.
						</p>
					</div>
					<div className="flex flex-col sm:flex-row items-center gap-4 shrink-0">
						<a
							href={`https://wa.me/919823011942?text=${encodeURIComponent(
								`Hello The Letter Ink, I would like to book an atelier consultation for a bespoke commission regarding "${product.name}".`,
							)}`}
							target="_blank"
							rel="noopener noreferrer"
							className="h-[49px] px-8 bg-primary hover:bg-brand-script-dark text-on-primary font-label-lg text-label-lg uppercase tracking-widest transition-all duration-300 shadow-sm flex items-center justify-center gap-2 rounded-sm"
						>
							Book Atelier Consultation
						</a>
						<Link
							href="/contact"
							className="h-[49px] px-6 bg-transparent hover:bg-surface-container-low text-primary border border-border-vellum font-label-md text-label-md uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-2 rounded-sm"
						>
							Online Inquiry Form
						</Link>
					</div>
				</div>
			</section>
		</div>
	);
};
