import "@/app/globals.css";

import { Search } from "lucide-react";
import type { Metadata } from "next";
import { cacheLife } from "next/cache";
import { EB_Garamond, Geist, Geist_Mono, Raleway } from "next/font/google";
import { getImageProps } from "next/image";
import Link from "next/link";
import { ThemeProvider } from "next-themes";
import { Suspense } from "react";
import { CartBootstrap, CartProvider } from "@/app/cart/cart-context";
import { CartSidebar } from "@/app/cart/cart-sidebar";
import { CartButton } from "@/app/cart-button";
import { Footer } from "@/app/footer";
import { MobileNav, Navbar, type NavLink } from "@/app/navbar";
import { AnnouncementBar } from "@/components/announcement-bar";
import { NewsletterDialog } from "@/components/newsletter-dialog";
import { StoreChatSection } from "@/components/store-chat/store-chat-section";
import { StoreConfigProvider } from "@/components/store-config-provider";
import { Toaster } from "@/components/ui/sonner";
import { commerce, getCanonicalUrl, getStoreFaviconUrl, meGetCached } from "@/lib/commerce";
import { getCartCookieJson } from "@/lib/cookies";
import { StoreJsonLd } from "@/lib/json-ld";
import { getStoreConfig } from "@/lib/store-config";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
	// Paints only inside chat and code spans, so it loads on use instead of blocking every first paint.
	preload: false,
});

const raleway = Raleway({
	variable: "--font-raleway",
	subsets: ["latin"],
});

const ebGaramond = EB_Garamond({
	variable: "--font-eb-garamond",
	subsets: ["latin"],
});

async function getStoreMetadata(): Promise<Metadata> {
	"use cache";
	cacheLife("hours");
	const me = await meGetCached();
	const storeName = me.store.name || "The Letter Ink";
	const storeDescription =
		me.store.settings?.storeDescription ||
		"The Letter Ink — Artisanal calligraphy studio & bespoke stationery";
	const faviconUrl = getStoreFaviconUrl(me.store.settings) ?? "/Logo.jpeg";
	// The platform favicon is whatever was uploaded (here a 500x500 PNG). Route it through
	// the image optimizer so browsers fetch a few KB from this origin, not the blob host.
	const iconUrl = (size: number) =>
		getImageProps({ src: faviconUrl, width: size, height: size, alt: "" }).props.src;
	const storeLogo =
		typeof me.store.settings?.logo === "string" ? me.store.settings.logo : me.store.settings?.logo?.imageUrl;
	const ogImage = me.store.settings?.ogimage || storeLogo || "/Logo.jpeg";

	return {
		title: {
			default: storeName,
			template: `%s — ${storeName}`,
		},
		description: storeDescription,
		applicationName: storeName,
		// No `alternates.canonical` here on purpose: Next inherits it into every page that
		// does not set its own, which silently declares each such page a duplicate of the
		// home page. The home page carries its own canonical in app/page.tsx instead.
		openGraph: {
			type: "website",
			siteName: storeName,
			title: storeName,
			description: storeDescription,
			url: "/",
			images: [{ url: ogImage, alt: storeName }],
		},
		twitter: {
			card: "summary_large_image",
			title: storeName,
			description: storeDescription,
			images: [ogImage],
		},
		robots: {
			index: true,
			follow: true,
			googleBot: {
				index: true,
				follow: true,
				"max-image-preview": "large",
				"max-snippet": -1,
				"max-video-preview": -1,
			},
		},
		icons: {
			// No `type`: the URL is whatever the admin uploaded and the optimizer negotiates the
			// format, and declaring image/svg+xml over a PNG makes Chrome drop the icon.
			icon: [{ url: iconUrl(64), sizes: "64x64" }],
			// iOS wants a PNG here (the optimizer negotiates WebP), so the original stays for the home-screen icon.
			apple: [{ url: faviconUrl, sizes: "180x180" }],
		},
		manifest: "/manifest.webmanifest",
	};
}

export async function generateMetadata(): Promise<Metadata> {
	const metadata = await getStoreMetadata();
	// URL instances can't cross the "use cache" serialization boundary, so
	// metadataBase is attached outside the cached scope (env-only, no IO).
	return { ...metadata, metadataBase: new URL(getCanonicalUrl()) };
}

async function getInitialCart() {
	const cartCookie = await getCartCookieJson();

	if (!cartCookie?.id) {
		return { cart: null, cartId: null };
	}

	try {
		const cart = await commerce.cartGet({ cartId: cartCookie.id });
		return { cart: cart ?? null, cartId: cartCookie.id };
	} catch {
		return { cart: null, cartId: cartCookie.id };
	}
}

function getNavLinks(): NavLink[] {
	return [
		{ href: "/shop", label: "Shop" },
		{ href: "/gifting", label: "Gifting" },
		{ href: "/workshops", label: "Workshops" },
		{ href: "/blog", label: "Blog" },
		{ href: "/about", label: "About" },
		{ href: "/contact", label: "Contact" },
	];
}

// The customer's cart is a cookie read, so it can never be part of the prerendered
// shell. Kept in its own component (and its own Suspense boundary below) so the await
// lands BELOW the chrome instead of above it.
async function CartBootstrapper() {
	try {
		const { cart, cartId } = await getInitialCart();
		return <CartBootstrap cart={cart} cartId={cartId} />;
	} catch {
		return <CartBootstrap cart={null} cartId={null} />;
	}
}

async function CartProviderWrapper({ children }: { children: React.ReactNode }) {
	// Only cached reads here. Awaiting anything request-time (cookies, headers, the
	// cart) would take the header, nav and footer out of the prerendered shell and
	// leave the page blank until the server responds. The other half of the rule: no
	// <Suspense> around this component either — the boundary itself is what streams the
	// chrome out of the shell, whether or not anything inside it is request-time.
	const [links, storeConfig] = await Promise.all([Promise.resolve(getNavLinks()), getStoreConfig()]);

	return (
		<StoreConfigProvider value={storeConfig}>
			<CartProvider>
				<div className="flex min-h-screen flex-col">
					<Suspense fallback={null}>
						<AnnouncementBar />
					</Suspense>
					<header className="sticky top-0 z-50 bg-surface-container-lowest shadow-sm">
						<div className="w-full px-margin-mobile lg:px-8">
							<div className="relative flex items-center justify-between h-14 sm:h-16 lg:h-18">
								{/* Left: Logo */}
								<div className="flex items-center shrink-0">
									<Link href="/" className="flex items-center py-1" aria-label="The Letter Ink Home">
										<img
											alt="The Letter Ink Logo"
											className="h-9 sm:h-12 lg:h-16 w-auto object-contain transition-all duration-200"
											src="/Latest-logo.png"
										/>
									</Link>
								</div>

								{/* Center: Desktop Navbar */}
								<div className="hidden lg:flex flex-1 justify-center">
									<Suspense fallback={null}>
										<Navbar links={links} />
									</Suspense>
								</div>

								{/* Right: Actions */}
								<div className="flex items-center justify-end">
									{/* Mobile: Cart + Hamburger Menu */}
									<div className="lg:hidden flex items-center gap-1.5">
										<CartButton />
										<Suspense fallback={null}>
											<MobileNav links={links} />
										</Suspense>
									</div>

									{/* Desktop Action Icons */}
									<div className="hidden lg:flex items-center justify-end gap-3">
										<Link
											href="/search"
											aria-label="Search atelier catalog"
											className="flex items-center justify-center h-11 w-11 rounded-full text-foreground hover:text-brand-script hover:bg-surface-container-high/60 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-script"
										>
											<Search className="h-5 w-5 stroke-[1.75]" />
										</Link>
										<CartButton />
									</div>
								</div>
							</div>
						</div>
					</header>
					<main className="flex-1">{children}</main>
					<Footer />
				</div>
				<CartSidebar />
				<Suspense fallback={null}>
					<CartBootstrapper />
				</Suspense>
				{/* Inside CartProvider on purpose: add-to-cart from chat uses the cart context. */}
				<Suspense fallback={null}>
					<StoreChatSection />
				</Suspense>
			</CartProvider>
		</StoreConfigProvider>
	);
}

async function getHtmlLang(): Promise<string> {
	try {
		const me = await meGetCached();
		return me.store.settings?.defaultLanguage?.split("-")[0] ?? "en";
	} catch {
		return "en";
	}
}

async function NewsletterPopupSection() {
	const me = await meGetCached();
	if (!me.store.settings?.enabledTools?.newsletterPopup) {
		return null;
	}
	return <NewsletterDialog settings={me.store.settings?.newsletterPopup} />;
}

export default async function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const lang = await getHtmlLang();

	return (
		// suppressHydrationWarning: next-themes sets the theme class on <html> before hydration.
		<html lang={lang} className="light" style={{ colorScheme: "light" }} suppressHydrationWarning>
			<body
				className={`${geistSans.variable} ${geistMono.variable} ${raleway.variable} ${ebGaramond.variable} antialiased`}
				suppressHydrationWarning
			>
				<Suspense fallback={null}>
					<StoreJsonLd />
				</Suspense>
				<ThemeProvider
					attribute="class"
					defaultTheme="light"
					enableSystem={false}
					forcedTheme="light"
					disableTransitionOnChange
					scriptProps={{ async: true }}
				>
					<CartProviderWrapper>{children}</CartProviderWrapper>
					<Suspense fallback={null}>
						<NewsletterPopupSection />
					</Suspense>
					<Toaster richColors position="top-center" />
				</ThemeProvider>
			</body>
		</html>
	);
}
