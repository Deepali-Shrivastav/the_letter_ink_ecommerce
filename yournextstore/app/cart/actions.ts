"use server";

import { try_ } from "safe-try";
import { commerce } from "@/lib/commerce";
import { getCartCookieJson, setCartCookie } from "@/lib/cookies";
import { getStoreConfig } from "@/lib/store-config";
import { isValidId, isValidQuantity } from "@/lib/validation";
import { logger } from "@/lib/logger";

export async function getCart() {
	const cartCookie = await getCartCookieJson();

	if (!cartCookie?.id) {
		return null;
	}

	const [error, cart] = await try_(commerce.cartGet({ cartId: cartCookie.id }));
	if (error) {
		logger.error("cart: cartGet failed", { cartId: cartCookie.id, error });
		return null;
	}
	return cart;
}

export async function addToCart(variantId: string, quantity = 1, metadata?: Record<string, any>, unit_price?: number) {
	if (!isValidId(variantId)) {
		return { success: false, cart: null, error: "Invalid product variant identifier" };
	}

	const validQuantity = isValidQuantity(quantity, 1, 99) ? quantity : 1;
	const validUnitPrice = typeof unit_price === "number" && unit_price >= 0 ? unit_price : undefined;
	const safeMetadata = metadata && typeof metadata === "object" ? metadata : undefined;

	const cartCookie = await getCartCookieJson();

	// The theletterink_cart cookie can point at a cartId that no longer exists server-side
	// (expired, store re-seeded, old session). cartUpsert then throws "Cart not found";
	// retry once with a FRESH cart so the add always lands.
	let [error, cart] = await try_(commerce.cartUpsert({ cartId: cartCookie?.id, variantId, quantity: validQuantity, metadata: safeMetadata, unit_price: validUnitPrice }));
	if (error) {
		[error, cart] = await try_(commerce.cartUpsert({ variantId, quantity: validQuantity, metadata: safeMetadata, unit_price: validUnitPrice }));
		if (error) {
			logger.error("cart: addToCart failed after fresh-cart retry", { variantId, quantity: validQuantity, error });
			return { success: false, cart: null, error: "Could not add item to cart. Please try again." };
		}
	}

	if (!cart) {
		return { success: false, cart: null, error: "Could not create cart" };
	}

	if (cart.id !== cartCookie?.id) {
		await setCartCookie({ id: cart.id });
	}

	return { success: true, cart };
}

export async function addBundleToCart(
	bundleId: string,
	selections: Array<{ variantId: string; groupId: string; quantity: number }>,
) {
	if (!isValidId(bundleId) || !Array.isArray(selections) || selections.length === 0) {
		return { success: false as const, error: "Invalid bundle selection" };
	}

	const [cartCookie, { currency }] = await Promise.all([getCartCookieJson(), getStoreConfig()]);

	const [error, cart] = await try_(
		commerce.cartAddBundle({
			cartId: cartCookie?.id,
			bundleId,
			selections,
			currency,
		}),
	);

	if (error) {
		logger.error("cart: addBundleToCart failed", { bundleId, error });
		return { success: false as const, error: "Could not add bundle to cart. Please try again." };
	}

	if (!cart) {
		return { success: false as const, error: "Could not add bundle to cart" };
	}

	if (cart.id !== cartCookie?.id) {
		await setCartCookie({ id: cart.id });
	}

	return { success: true as const, cart };
}

export async function removeFromCart(variantId: string) {
	if (!isValidId(variantId)) {
		return { success: false, cart: null };
	}

	const cartCookie = await getCartCookieJson();

	if (!cartCookie?.id) {
		return { success: false, cart: null };
	}

	// Quantity 0 removes the item; the response is the updated cart
	const [error, cart] = await try_(
		commerce.cartUpsert({
			cartId: cartCookie.id,
			variantId,
			quantity: 0,
		}),
	);
	if (error) {
		logger.error("cart: removeFromCart failed", { cartId: cartCookie.id, variantId, error });
		return { success: false, cart: null };
	}
	return { success: true, cart };
}

// Set absolute quantity for a cart item
export async function setCartQuantity(variantId: string, quantity: number) {
	if (!isValidId(variantId)) {
		return { success: false, cart: null };
	}

	const validQuantity = typeof quantity === "number" && Number.isInteger(quantity)
		? Math.max(0, Math.min(quantity, 99))
		: 0;

	const cartCookie = await getCartCookieJson();

	if (!cartCookie?.id) {
		return { success: false, cart: null };
	}

	// mode "set" replaces the line quantity atomically; 0 removes the item
	const [error, cart] = await try_(
		commerce.cartUpsert({
			cartId: cartCookie.id,
			variantId,
			quantity: validQuantity,
			mode: "set",
		}),
	);
	if (error) {
		logger.error("cart: setCartQuantity failed", { cartId: cartCookie.id, variantId, quantity: validQuantity, error });
		return { success: false, cart: null };
	}
	return { success: true, cart };
}

