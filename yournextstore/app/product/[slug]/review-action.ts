"use server";

import { try_ } from "safe-try";
import { commerce } from "@/lib/commerce";
import { isValidEmail, isValidRating, sanitizeText } from "@/lib/validation";
import { logger } from "@/lib/logger";

type ReviewState = {
	success: boolean;
	message: string;
	error?: string;
} | null;

export async function submitReview(_prev: ReviewState, formData: FormData): Promise<ReviewState> {
	const rawSlug = formData.get("slug");
	const rawAuthor = formData.get("author");
	const rawEmail = formData.get("email");
	const rawContent = formData.get("content");
	const rawRating = formData.get("rating");

	if (!rawSlug || typeof rawSlug !== "string" || rawSlug.length > 200) {
		return { success: false, message: "", error: "Invalid product identifier." };
	}

	const author = sanitizeText(rawAuthor, 100);
	if (author.length < 2) {
		return { success: false, message: "", error: "Please enter your name (at least 2 characters)." };
	}

	if (!isValidEmail(rawEmail)) {
		return { success: false, message: "", error: "Please enter a valid email address." };
	}

	const content = sanitizeText(rawContent, 2000);
	if (content.length < 5) {
		return { success: false, message: "", error: "Please write a review (at least 5 characters)." };
	}

	if (!isValidRating(rawRating)) {
		return { success: false, message: "", error: "Please select a valid rating between 1 and 5." };
	}

	const slug = rawSlug.trim();
	const email = rawEmail.trim().toLowerCase();
	const ratingNum = Number(rawRating);

	const [error] = await try_(
		commerce.productReviewCreate(
			{ idOrSlug: slug },
			{ author, email, content, rating: ratingNum },
		),
	);
	if (error) {
		logger.error("review: productReviewCreate failed", { slug, error });
		return { success: false, message: "", error: "Something went wrong. Please try again later." };
	}

	return { success: true, message: "Thanks for your review! It will appear once approved." };
}
