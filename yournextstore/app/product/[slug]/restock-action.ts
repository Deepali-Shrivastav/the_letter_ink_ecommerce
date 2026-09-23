"use server";

import { try_ } from "safe-try";
import { commerce } from "@/lib/commerce";
import { isValidEmail, isValidId } from "@/lib/validation";
import { logger } from "@/lib/logger";

type RestockState = {
	success: boolean;
	message: string;
	error?: string;
} | null;

export async function subscribeToRestock(_prev: RestockState, formData: FormData): Promise<RestockState> {
	const productVariantId = formData.get("productVariantId");
	const email = formData.get("email");
	// Optional — only a ticked box makes the address a marketing subscriber.
	const marketingConsent = formData.get("marketingConsent") === "on";

	if (!isValidId(productVariantId)) {
		return { success: false, message: "", error: "Invalid product variant." };
	}

	if (!isValidEmail(email)) {
		return { success: false, message: "", error: "Please enter a valid email address." };
	}

	const [error, result] = await try_(
		commerce.request<{ status: string }>("/availability-notifications", {
			method: "POST",
			body: { email: email.trim().toLowerCase(), productVariantId, marketingConsent },
		}),
	);
	if (error) {
		logger.error("restock: availability-notifications failed", { productVariantId, error });
		return { success: false, message: "", error: "Something went wrong. Please try again later." };
	}

	if (result.status === "already_subscribed") {
		return { success: true, message: "You're already on the list — we'll email you when it's back." };
	}

	return { success: true, message: "Done! We'll email you when this item is back in stock." };
}
