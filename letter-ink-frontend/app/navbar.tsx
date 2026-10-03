"use client";

import {
	ChevronRight,
	Menu,
	MessageCircle,
	Phone,
	ShoppingBag,
	Truck,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useCart } from "@/app/cart/cart-context";
import { MobileSearchInput } from "@/components/search/mobile-search-input";
import {
	Sheet,
	SheetContent,
	SheetTitle,
	SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

export type NavLink = {
	href: string;
	label: string;
};

export function isLinkActive(pathname: string, href: string): boolean {
	if (pathname === href) return true;
	if (href === "/shop") {
		return (
			pathname.startsWith("/shop") ||
			pathname.startsWith("/product") ||
			pathname.startsWith("/category")
		);
	}
	return href !== "/" && pathname.startsWith(`${href}/`);
}

/**
 * Mobile Hamburger Menu & Luxury Atelier Drawer (Right side slide-out)
 */
export function MobileNav({ links }: { links: NavLink[] }) {
	const [open, setOpen] = useState(false);
	const pathname = usePathname();
	const { openCart, count } = useCart();

	return (
		<Sheet open={open} onOpenChange={setOpen}>
			<SheetTrigger asChild>
				<button
					type="button"
					aria-label="Open navigation menu"
					className="flex items-center justify-center h-11 w-11 rounded-full text-foreground hover:text-brand-script hover:bg-surface-container-high/60 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-script"
				>
					<Menu className="h-5 w-5 stroke-[1.75]" />
				</button>
			</SheetTrigger>
			<SheetContent
				side="right"
				className="w-[min(22rem,85vw)] max-w-sm p-0 flex flex-col justify-between bg-surface-container-lowest border-l border-border-vellum/80 shadow-2xl"
			>
				<SheetTitle className="sr-only">The Letter Ink Menu</SheetTitle>

				{/* Atelier Brand Header */}
				<div className="p-5 pb-4 border-b border-border-vellum/70 flex items-center justify-between">
					<Link
						href="/"
						onClick={() => setOpen(false)}
						className="flex items-center gap-3 group"
						aria-label="The Letter Ink Home"
					>
						<img
							src="/Latest-logo.png"
							alt="The Letter Ink"
							className="h-11 w-auto object-contain transition-transform group-hover:scale-105"
						/>
					</Link>
				</div>

				{/* Search Bar */}
				<div className="px-4 pt-4 pb-2">
					<MobileSearchInput onNavigate={() => setOpen(false)} />
				</div>

				{/* Navigation Links Scroll Container */}
				<div className="flex-1 overflow-y-auto px-4 py-2 divide-y divide-border-vellum/40">
					{/* Primary Nav Links */}
					<nav className="py-2 flex flex-col gap-1" aria-label="Mobile Navigation">
						{links.map((link) => {
							const isActive = isLinkActive(pathname, link.href);
							return (
								<Link
									key={link.href}
									href={link.href}
									onClick={() => setOpen(false)}
									aria-current={isActive ? "page" : undefined}
									className={cn(
										"flex items-center justify-between px-3.5 py-3 rounded-lg text-sm font-medium tracking-wider uppercase transition-all duration-200",
										isActive
											? "bg-brand-blush-light/90 text-brand-script font-semibold shadow-xs"
											: "text-foreground/90 hover:bg-surface-container-high/60 hover:text-brand-script",
									)}
								>
									<span>{link.label}</span>
									<ChevronRight
										className={cn(
											"h-4 w-4 transition-transform duration-200",
											isActive
												? "text-brand-script translate-x-0.5"
												: "text-muted-foreground/40",
										)}
									/>
								</Link>
							);
						})}
					</nav>

					{/* Customer Support & Direct Services */}
					<div className="py-3 flex flex-col gap-1">
						<span className="px-3.5 pb-1 text-xs uppercase font-semibold tracking-wider text-muted-foreground">
							Customer Support
						</span>
						<button
							type="button"
							onClick={() => {
								setOpen(false);
								openCart();
							}}
							className="flex items-center justify-between px-3.5 py-3 rounded-lg text-sm font-medium text-foreground hover:bg-surface-container-high/60 hover:text-brand-script transition-colors w-full text-left"
						>
							<div className="flex items-center gap-3">
								<ShoppingBag className="h-4 w-4 text-brand-script shrink-0" />
								<span>Shopping Bag</span>
							</div>
							{count > 0 ? (
								<span className="px-2 py-0.5 rounded-full bg-brand-script text-white text-[10px] font-bold">
									{count}
								</span>
							) : (
								<ChevronRight className="h-4 w-4 text-muted-foreground/40" />
							)}
						</button>
						<Link
							href="/order/track"
							onClick={() => setOpen(false)}
							className="flex items-center justify-between px-3.5 py-3 rounded-lg text-sm font-medium text-foreground hover:bg-surface-container-high/60 hover:text-brand-script transition-colors"
						>
							<div className="flex items-center gap-3">
								<Truck className="h-4 w-4 text-brand-script shrink-0" />
								<span>Track Your Order</span>
							</div>
							<ChevronRight className="h-4 w-4 text-muted-foreground/40" />
						</Link>

						<Link
							href="/contact"
							onClick={() => setOpen(false)}
							className="flex items-center justify-between px-3.5 py-3 rounded-lg text-sm font-medium text-foreground hover:bg-surface-container-high/60 hover:text-brand-script transition-colors"
						>
							<div className="flex items-center gap-3">
								<Phone className="h-4 w-4 text-brand-script shrink-0" />
								<span>Contact & Custom Orders</span>
							</div>
							<ChevronRight className="h-4 w-4 text-muted-foreground/40" />
						</Link>

						<a
							href="https://wa.me/919823011942?text=Hello%20The%20Letter%20Ink,%20I%20have%20an%20inquiry%20regarding%20bespoke%20calligraphy."
							target="_blank"
							rel="noopener noreferrer"
							onClick={() => setOpen(false)}
							className="flex items-center justify-between px-3.5 py-3 rounded-lg text-sm font-medium text-foreground hover:bg-surface-container-high/60 hover:text-brand-script transition-colors"
						>
							<div className="flex items-center gap-3">
								<MessageCircle className="h-4 w-4 text-brand-script shrink-0" />
								<span>WhatsApp Atelier</span>
							</div>
							<ChevronRight className="h-4 w-4 text-muted-foreground/40" />
						</a>
					</div>
				</div>
			</SheetContent>
		</Sheet>
	);
}

/**
 * Desktop Navigation Bar
 */
export function Navbar({ links }: { links: NavLink[] }) {
	const pathname = usePathname();

	return (
		<nav className="flex items-center gap-4 xl:gap-space-sm" aria-label="Desktop Navigation">
			{links.map((link) => {
				const isActive = isLinkActive(pathname, link.href);
				return (
					<Link
						key={link.href}
						href={link.href}
						aria-current={isActive ? "page" : undefined}
						className={cn(
							"font-label-md text-label-md uppercase hover:text-primary transition-colors pb-1 whitespace-nowrap",
							isActive ? "text-primary border-b border-primary" : "text-on-surface-variant",
						)}
					>
						{link.label}
					</Link>
				);
			})}
		</nav>
	);
}
