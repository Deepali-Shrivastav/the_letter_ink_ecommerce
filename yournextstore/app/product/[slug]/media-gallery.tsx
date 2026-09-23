"use client";

import { ChevronLeft, ChevronRight, ZoomIn } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useCallback, useMemo, useRef, useState } from "react";
import { useSelectedVariant } from "@/app/product/[slug]/use-selected-variant";
import { useCustomization } from "@/app/product/[slug]/customization-context";
import { Button } from "@/components/ui/button";
import { cn, isVideoUrl } from "@/lib/utils";
import { LetterInkMedia } from "@/lib/the-letter-ink-media";

type Variant = {
	id: string;
	images: string[];
	combinations: {
		variantValue: {
			value: string;
			variantType: {
				label: string;
			};
		};
	}[];
};

type MediaGalleryProps = {
	images: string[];
	productName: string;
	variants: Variant[];
};

export function MediaGallery({ images, productName, variants }: MediaGalleryProps) {
	const searchParams = useSearchParams();
	const [selectedIndex, setSelectedIndex] = useState(0);
	const [isZoomed, setIsZoomed] = useState(false);
	const { previewImageUrl } = useCustomization();

	// If there is an active bespoke customization preview image, prioritize it as the first image
	const displayImages = useMemo(() => {
		if (!previewImageUrl) return images;
		return [previewImageUrl, ...images.filter((img) => img !== previewImageUrl)];
	}, [images, previewImageUrl]);

	const selectedVariant = useSelectedVariant(variants);

	const variantImageIndex = useMemo(() => {
		// Only variants with real combinations drive the gallery jump.
		const firstVariantImage =
			selectedVariant && selectedVariant.combinations.length > 0 ? selectedVariant.images[0] : undefined;
		if (!firstVariantImage) return 0;

		const index = displayImages.indexOf(firstVariantImage);
		return index >= 0 ? index : 0;
	}, [selectedVariant, displayImages]);

	// Jump to the preview image when customization combination resolves
	const prevPreviewImageRef = useRef(previewImageUrl);
	if (prevPreviewImageRef.current !== previewImageUrl) {
		prevPreviewImageRef.current = previewImageUrl;
		if (previewImageUrl) {
			setSelectedIndex(0);
		}
	}

	// Jump to the selected variant's image when the variant changes
	const searchParamsKey = searchParams.toString();
	const prevSearchParamsKey = useRef(searchParamsKey);
	if (prevSearchParamsKey.current !== searchParamsKey) {
		prevSearchParamsKey.current = searchParamsKey;
		if (!previewImageUrl) {
			setSelectedIndex(variantImageIndex);
		}
	}

	const handlePrevious = useCallback(() => {
		setSelectedIndex((prev) => (prev === 0 ? displayImages.length - 1 : prev - 1));
	}, [displayImages.length]);

	const handleNext = useCallback(() => {
		setSelectedIndex((prev) => (prev === displayImages.length - 1 ? 0 : prev + 1));
	}, [displayImages.length]);

	// Keyboard navigation: ArrowLeft / ArrowRight (scoped to gallery container)
	const handleKeyDown = useCallback(
		(e: React.KeyboardEvent<HTMLDivElement>) => {
			if (displayImages.length <= 1) return;

			if (e.key === "ArrowLeft") {
				e.preventDefault();
				handlePrevious();
			} else if (e.key === "ArrowRight") {
				e.preventDefault();
				handleNext();
			}
		},
		[displayImages.length, handlePrevious, handleNext],
	);

	if (displayImages.length === 0) {
		return (
			<div className="flex flex-col gap-4 lg:sticky lg:top-24 lg:self-start">
				<div className="relative w-full aspect-[4/5] bg-paper-tint overflow-hidden shadow-sm flex items-center justify-center">
					<p className="text-muted-foreground font-body-sm">No images available</p>
				</div>
			</div>
		);
	}

	return (
		// WAI-APG carousel: a named region; arrow keys bubble up from the focusable controls inside.
		<section
			aria-roledescription="carousel"
			aria-label="Product media gallery"
			onKeyDown={handleKeyDown}
			className="flex flex-col gap-4 outline-none lg:sticky lg:top-24 lg:self-start"
		>
			{/* Main Image */}
			<div className="relative w-full aspect-[4/5] bg-paper-tint overflow-hidden shadow-sm group">
				{isVideoUrl(displayImages[selectedIndex] ?? "") ? (
					<video
						className="absolute inset-0 w-full h-full object-cover"
						src={displayImages[selectedIndex]}
						muted
						loop
						autoPlay
						playsInline
						controls
					/>
				) : (
					<LetterInkMedia
						src={displayImages[selectedIndex] ?? ""}
						alt={`${productName} - View ${selectedIndex + 1}`}
						fill
						sizes="(max-width: 1024px) 100vw, 50vw"
						className={cn(
							"w-full h-full object-cover transition-all duration-700 ease-out group-hover:scale-[1.02]",
							isZoomed && "scale-150 cursor-zoom-out",
						)}
						onClick={() => setIsZoomed(!isZoomed)}
						priority
					/>
				)}

				{/* Navigation Arrows */}
				{displayImages.length > 1 && (
					<div className="absolute inset-x-4 top-1/2 flex -translate-y-1/2 justify-between opacity-0 transition-opacity group-hover:opacity-100">
						<Button
							variant="secondary"
							size="icon"
							className="h-10 w-10 rounded-full bg-surface-container-lowest/90 shadow-sm backdrop-blur-sm hover:bg-surface-container-lowest text-primary"
							onClick={(e) => {
								e.stopPropagation();
								handlePrevious();
							}}
							aria-label="Previous image"
						>
							<ChevronLeft className="h-5 w-5" />
						</Button>
						<Button
							variant="secondary"
							size="icon"
							className="h-10 w-10 rounded-full bg-surface-container-lowest/90 shadow-sm backdrop-blur-sm hover:bg-surface-container-lowest text-primary"
							onClick={(e) => {
								e.stopPropagation();
								handleNext();
							}}
							aria-label="Next image"
						>
							<ChevronRight className="h-5 w-5" />
						</Button>
					</div>
				)}

				{/* Image Counter */}
				{displayImages.length > 1 && (
					<div className="absolute bottom-5 right-5 pointer-events-none bg-surface-container-lowest/80 backdrop-blur-md px-3 py-1.5 text-secondary font-label-sm text-[10px] uppercase tracking-widest">
						{selectedIndex + 1} / {displayImages.length}
					</div>
				)}
			</div>

			{/* Thumbnails */}
			{displayImages.length > 1 && (
				<div className="grid grid-cols-4 gap-3 md:gap-4 mt-4">
					{displayImages.map((image, index) => (
						<button
							key={`${image}-${index}`}
							type="button"
							onClick={() => setSelectedIndex(index)}
							className={cn(
								"relative aspect-square bg-paper-tint overflow-hidden transition-all duration-300 ring-0",
								selectedIndex === index
									? "ring-2 ring-primary opacity-100"
									: "opacity-75 hover:opacity-100 hover:ring-1 hover:ring-primary",
							)}
						>
							{isVideoUrl(image) ? (
								<video
									className="absolute inset-0 w-full h-full object-cover"
									src={image}
									muted
									playsInline
								/>
							) : (
								<LetterInkMedia
									src={image}
									alt={`${productName} thumbnail ${index + 1}`}
									fill
									sizes="80px"
									className="object-cover w-full h-full"
								/>
							)}
						</button>
					))}
				</div>
			)}
			
			{/* Material Authenticity Footnote */}
			<div className="mt-2 p-4 bg-paper-tint flex items-center justify-between gap-4">
				<div className="flex items-center gap-3">
					<span className="material-symbols-outlined text-primary text-[22px]">verified</span>
					<p className="font-body-sm text-body-sm text-secondary">Signed atelier authenticity wax seal certificate encapsulated on rear verso.</p>
				</div>
				<span className="font-label-sm text-label-sm text-primary uppercase tracking-widest whitespace-nowrap hidden sm:block">Atelier Heirlooms</span>
			</div>
		</section>
	);
}
