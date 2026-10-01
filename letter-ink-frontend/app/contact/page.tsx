import type { Metadata } from "next";
import { ContactPageClient } from "@/components/sections/contact-page-client";

export const metadata: Metadata = {
	title: "Contact Us - Initiate an Atelier Inscription or Consultation",
	description:
		"Connect with The Letter Ink studio in Bhusawal, Maharashtra for bespoke wedding vows, custom name frames, glass engraving, workshops, and corporate gifting.",
};

export default function ContactPage() {
	return <ContactPageClient />;
}
