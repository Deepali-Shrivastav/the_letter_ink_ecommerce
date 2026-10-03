"use client";

import Image, { getImageProps } from "next/image";
import { type ComponentProps, useEffect, useState } from "react";
import { isVideoUrl } from "@/lib/utils";

type ImageProps = ComponentProps<typeof Image>;

const LetterInkImageWithPolling = (props: ImageProps) => {
	let resolvedProps: any = null;
	let hasConfigError = false;

	try {
		resolvedProps = getImageProps(props as Parameters<typeof getImageProps>[0]).props;
	} catch {
		hasConfigError = true;
	}

	if (hasConfigError || !resolvedProps?.src) {
		const { fill, priority, unoptimized, ...rest } = props as any;
		return (
			<img
				{...rest}
				src={typeof props.src === "string" ? props.src : ""}
				alt={props.alt || ""}
				className={props.className}
				style={
					fill
						? { position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", ...props.style }
						: props.style
				}
			/>
		);
	}

	const [isReady, setIsReady] = useState(false);
	const src = resolvedProps.src;

	useEffect(() => {
		setIsReady(false);
		let cancelled = false;

		const probe = () => {
			const img = new window.Image();
			img.onload = () => {
				if (!cancelled) setIsReady(true);
			};
			img.onerror = () => {
				if (cancelled) return;
				// Fallback to ready on probe error so we don't shimmer indefinitely
				setIsReady(true);
			};
			img.src = src;
		};

		probe();

		return () => {
			cancelled = true;
		};
	}, [src]);

	if (!isReady) {
		const style: React.CSSProperties = props.fill
			? { position: "absolute", inset: 0, width: "100%", height: "100%" }
			: { width: resolvedProps.width, height: resolvedProps.height };

		return <div className={`letterink-image-shimmer ${props.className ?? ""}`} style={style} />;
	}

	return <Image {...props} />;
};

const LetterInkImageSafe = (props: ImageProps) => {
	try {
		getImageProps(props as Parameters<typeof getImageProps>[0]);
		return <Image {...props} />;
	} catch {
		const { fill, priority, unoptimized, ...rest } = props as any;
		return (
			<img
				{...rest}
				src={typeof props.src === "string" ? props.src : ""}
				alt={props.alt || ""}
				className={props.className}
				style={
					fill
						? { position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", ...props.style }
						: props.style
				}
			/>
		);
	}
};

const LetterInkImage = process.env.NODE_ENV === "development" ? LetterInkImageWithPolling : LetterInkImageSafe;

type LetterInkMediaProps = ImageProps & {
	autoPlay?: boolean;
	controls?: boolean;
};

/** Renders a <video> for video URLs, otherwise falls back to the Image component. */
export const LetterInkMedia = ({ autoPlay = true, controls = false, ...props }: LetterInkMediaProps) => {
	const src = typeof props.src === "string" ? props.src : "";
	if (isVideoUrl(src)) {
		return (
			<video
				// Videos have no alt attribute — surface the image alt text to assistive tech instead.
				aria-label={props.alt || undefined}
				className={typeof props.className === "string" ? props.className : undefined}
				style={
					props.fill
						? { position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }
						: undefined
				}
				src={src}
				muted
				loop
				autoPlay={autoPlay}
				playsInline
				controls={controls}
			/>
		);
	}
	return <LetterInkImage {...props} />;
};
