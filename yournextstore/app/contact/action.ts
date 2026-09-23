"use server";

import { try_ } from "safe-try";
import { commerce } from "@/lib/commerce";
import { isValidEmail, sanitizeText } from "@/lib/validation";
import { logger } from "@/lib/logger";

type ContactState = {
	success: boolean;
	message: string;
	error?: string;
} | null;

export async function sendContactMessage(_prev: ContactState, formData: FormData): Promise<ContactState> {
	const rawEmail = formData.get("email");
	const rawMessage = formData.get("message");

	if (!isValidEmail(rawEmail)) {
		return { success: false, message: "", error: "Please enter a valid email address." };
	}

	const message = sanitizeText(rawMessage, 3000);
	if (message.length < 5) {
		return { success: false, message: "", error: "Please enter a message (at least 5 characters)." };
	}

	const email = rawEmail.trim().toLowerCase();
	const [error] = await try_(commerce.contactMessageCreate({ email, message }));
	if (error) {
		logger.error("contact: contactMessageCreate failed", { error });
		return { success: false, message: "", error: "Something went wrong. Please try again later." };
	}

	return { success: true, message: "Thanks for reaching out! We'll get back to you soon." };
}
