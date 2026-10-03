"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { subscribeToNewsletter } from "@/app/newsletter/action";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const Facebook = (props: React.SVGProps<SVGSVGElement>) => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		strokeWidth="2"
		strokeLinecap="round"
		strokeLinejoin="round"
		{...props}
	>
		<path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
	</svg>
);

const Twitter = (props: React.SVGProps<SVGSVGElement>) => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		strokeWidth="2"
		strokeLinecap="round"
		strokeLinejoin="round"
		{...props}
	>
		<path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
	</svg>
);

const Instagram = (props: React.SVGProps<SVGSVGElement>) => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		strokeWidth="2"
		strokeLinecap="round"
		strokeLinejoin="round"
		{...props}
	>
		<rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
		<path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
		<line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
	</svg>
);

const Linkedin = (props: React.SVGProps<SVGSVGElement>) => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		strokeWidth="2"
		strokeLinecap="round"
		strokeLinejoin="round"
		{...props}
	>
		<path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
		<rect width="4" height="12" x="2" y="9" />
		<circle cx="4" cy="4" r="2" />
	</svg>
);

function StackedCircularFooter({ year }: { year?: number | string }) {
	const [email, setEmail] = useState("");
	const [isPending, startTransition] = useTransition();
	const [isSubscribed, setIsSubscribed] = useState(false);

	const handleSubscribe = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (!email.trim()) return;

		startTransition(async () => {
			const formData = new FormData();
			formData.set("email", email.trim());
			formData.set("marketingConsent", "on");

			const result = await subscribeToNewsletter(null, formData);
			if (result?.success) {
				setIsSubscribed(true);
				toast.success(result.message || "Thank you for subscribing to The Letter Ink!");
				setEmail("");
			} else {
				toast.error(result?.error || "Failed to subscribe. Please check your email.");
			}
		});
	};

	const displayYear = year ?? new Date().getFullYear();

	return (
		<footer className="bg-background py-12">
			<div className="container mx-auto px-4 md:px-6">
				<div className="flex flex-col items-center">
					<Link href="/" className="mb-8 block group" aria-label="The Letter Ink Home">
						<div className="w-20 h-20 rounded-full overflow-hidden border border-border-vellum shadow-sm group-hover:scale-105 transition-transform bg-white flex items-center justify-center">
							<img src="/Logo.jpeg" alt="The Letter Ink" className="w-full h-full object-cover" />
						</div>
					</Link>
					<nav className="mb-8 flex flex-wrap justify-center gap-6">
						<Link href="/" className="hover:text-primary transition-colors text-sm">
							Home
						</Link>
						<Link href="/about" className="hover:text-primary transition-colors text-sm">
							About
						</Link>
						<Link href="/shop" className="hover:text-primary transition-colors text-sm">
							Shop
						</Link>
						<Link href="/gifting" className="hover:text-primary transition-colors text-sm">
							Gifting
						</Link>
						<Link href="/contact" className="hover:text-primary transition-colors text-sm">
							Contact
						</Link>
					</nav>
					<div className="mb-8 flex space-x-4">
						<a
							href="https://www.facebook.com"
							target="_blank"
							rel="noopener noreferrer"
							aria-label="Facebook"
						>
							<Button variant="outline" size="icon" className="rounded-full">
								<Facebook className="h-4 w-4" />
								<span className="sr-only">Facebook</span>
							</Button>
						</a>
						<a
							href="https://twitter.com"
							target="_blank"
							rel="noopener noreferrer"
							aria-label="Twitter"
						>
							<Button variant="outline" size="icon" className="rounded-full">
								<Twitter className="h-4 w-4" />
								<span className="sr-only">Twitter</span>
							</Button>
						</a>
						<a
							href="https://www.instagram.com/the_letter_ink/?igshid=YmMyMTA2M2Y%3D"
							target="_blank"
							rel="noopener noreferrer"
							aria-label="Instagram"
						>
							<Button variant="outline" size="icon" className="rounded-full">
								<Instagram className="h-4 w-4" />
								<span className="sr-only">Instagram</span>
							</Button>
						</a>
						<a
							href="https://www.linkedin.com"
							target="_blank"
							rel="noopener noreferrer"
							aria-label="LinkedIn"
						>
							<Button variant="outline" size="icon" className="rounded-full">
								<Linkedin className="h-4 w-4" />
								<span className="sr-only">LinkedIn</span>
							</Button>
						</a>
					</div>
					<div className="mb-8 w-full max-w-md">
						<form onSubmit={handleSubscribe} className="flex space-x-2">
							<div className="flex-grow">
								<Label htmlFor="email" className="sr-only">
									Email
								</Label>
								<Input
									id="email"
									value={email}
									onChange={(e) => setEmail(e.target.value)}
									placeholder="Enter your email"
									type="email"
									required
									disabled={isPending}
									className="rounded-full"
								/>
							</div>
							<Button type="submit" disabled={isPending} className="rounded-full">
								{isPending ? "Subscribing..." : isSubscribed ? "Subscribed!" : "Subscribe"}
							</Button>
						</form>
					</div>
					<div className="text-center">
						<p className="text-sm text-muted-foreground">
							© {displayYear} The Letter Ink. All rights reserved.
						</p>
					</div>
				</div>
			</div>
		</footer>
	);
}

export { StackedCircularFooter };
