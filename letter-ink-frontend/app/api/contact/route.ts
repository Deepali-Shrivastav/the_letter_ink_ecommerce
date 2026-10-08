import { NextResponse } from "next/server";
import { try_ } from "safe-try";
import { commerce } from "@/lib/commerce";
import { logger } from "@/lib/logger";
import { isValidEmail, sanitizeText } from "@/lib/validation";

export async function POST(req: Request) {
	try {
		const body = await req.json();
		const {
			fullName,
			email: rawEmail,
			whatsapp,
			discipline,
			scriptStyle,
			medium,
			deadline,
			message: rawMessage,
		} = body || {};

		const name = sanitizeText(fullName, 100);
		if (!name || name.length < 2) {
			return NextResponse.json(
				{ success: false, error: "Please provide your name (at least 2 characters)." },
				{ status: 400 },
			);
		}

		if (!isValidEmail(rawEmail)) {
			return NextResponse.json(
				{ success: false, error: "Please enter a valid email address." },
				{ status: 400 },
			);
		}

		const phone = sanitizeText(whatsapp, 20);
		if (!phone || phone.replace(/\D/g, "").length < 10) {
			return NextResponse.json(
				{ success: false, error: "Please provide a valid 10-digit mobile or WhatsApp number." },
				{ status: 400 },
			);
		}

		const message = sanitizeText(rawMessage, 3000);
		if (!message || message.length < 5) {
			return NextResponse.json(
				{ success: false, error: "Please share commission details or message (at least 5 characters)." },
				{ status: 400 },
			);
		}

		const email = rawEmail.trim().toLowerCase();
		const formattedDossier = [
			`Name: ${name}`,
			`Email: ${email}`,
			`WhatsApp: ${phone}`,
			`Discipline: ${sanitizeText(discipline, 50)}`,
			`Script Style: ${sanitizeText(scriptStyle, 50)}`,
			`Medium: ${sanitizeText(medium, 50)}`,
			deadline ? `Deadline: ${sanitizeText(deadline, 30)}` : null,
			`\nCommission Details:\n${message}`,
		]
			.filter(Boolean)
			.join("\n");

		const [error] = await try_(
			commerce.contactMessageCreate({
				email,
				message: formattedDossier,
			}),
		);

		if (error) {
			logger.error("api/contact: failed to record message", { error, email });
			return NextResponse.json(
				{ success: false, error: "Something went wrong sending your inquiry. Please try again later." },
				{ status: 500 },
			);
		}

		logger.info("api/contact: commission inquiry received", { email, name, discipline });

		return NextResponse.json({
			success: true,
			message: "Thank you for reaching out! Our atelier team will review your dossier and get back to you within 12 operating hours.",
		});
	} catch (err: any) {
		logger.error("api/contact: unhandled error", { error: err?.message });
		return NextResponse.json(
			{ success: false, error: "Invalid request payload." },
			{ status: 400 },
		);
	}
}
