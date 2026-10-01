import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function isVideoUrl(url: string): boolean {
	try {
		const { pathname } = new URL(url);
		return pathname.endsWith(".mp4") || pathname.endsWith(".webm") || pathname.endsWith(".mov");
	} catch {
		return false;
	}
}

/** Returns the first non-video URL from a media array — useful for thumbnails, OG images, and emails. */
export const getProductThumbnail = (urls: string[]): string | undefined => {
	return urls.find((url) => !isVideoUrl(url));
};

/**
 * Formats order identifiers with The Letter Ink brand prefix (e.g. TLI-1001 or TLI-84B91F)
 */
export function formatBrandOrderLookup(orderId?: string | null, displayId?: number | string | null): string {
	if (displayId !== undefined && displayId !== null && String(displayId).trim()) {
		const rawNum = String(displayId).replace(/^TLI-?/i, "").trim();
		if (!isNaN(Number(rawNum))) {
			return `TLI-${String(rawNum).padStart(4, "0")}`;
		}
		return `TLI-${rawNum.toUpperCase()}`;
	}

	if (!orderId) {
		return "TLI-1001";
	}

	const clean = String(orderId).trim();
	if (clean.toUpperCase().startsWith("TLI-")) {
		return clean.toUpperCase();
	}

	// Extract trailing 6 alphanumeric chars from the ID or timestamp
	const alphaNumOnly = clean.replace(/[^a-zA-Z0-9]/g, "");
	const suffix = alphaNumOnly.slice(-6).toUpperCase();
	return `TLI-${suffix || "1001"}`;
}

