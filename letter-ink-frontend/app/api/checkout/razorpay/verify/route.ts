import crypto from "node:crypto";
import { NextResponse } from "next/server";
import { storeRecentOrder } from "@/lib/commerce";
import { setCartCookie } from "@/lib/cookies";
import { logger } from "@/lib/logger";
import { rateLimit } from "@/lib/rate-limit";
import { formatBrandOrderLookup } from "@/lib/utils";

const BACKEND_URL = (process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://127.0.0.1:9000")
	.replace("localhost", "127.0.0.1")
	.replace(/\/$/, "");
const PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || "";

export async function POST(request: Request) {
	try {
		const ip = request.headers.get("x-forwarded-for") || "127.0.0.1";
		const { success: rateLimitSuccess } = await rateLimit(ip, 5, 60000);
		if (!rateLimitSuccess) {
			return NextResponse.json({ success: false, error: "Too many requests" }, { status: 429 });
		}

		const body = await request.json();
		const {
			razorpay_order_id,
			razorpay_payment_id,
			razorpay_signature,
			cartId,
			customer,
			shippingAddress,
			cartItems,
			amount,
		} = body;

		const keySecret = process.env.RAZORPAY_KEY_SECRET;

		if (
			(razorpay_order_id?.startsWith("order_sim_") || razorpay_signature?.startsWith("simulated_")) &&
			process.env.ENABLE_PAYMENT_SIMULATION !== "true"
		) {
			return NextResponse.json(
				{ success: false, error: "Payment simulation is not enabled in this environment" },
				{ status: 400 },
			);
		}

		const isSimulated =
			process.env.ENABLE_PAYMENT_SIMULATION === "true" &&
			(razorpay_order_id?.startsWith("order_sim_") || razorpay_signature?.startsWith("simulated_"));

		if (!isSimulated) {
			if (!keySecret || keySecret.includes("placeholder")) {
				return NextResponse.json(
					{ success: false, error: "Payment verification cannot proceed: secret key is not configured" },
					{ status: 500 },
				);
			}

			if (!razorpay_signature) {
				return NextResponse.json({ success: false, error: "Payment signature is missing" }, { status: 400 });
			}

			const generatedSignature = crypto
				.createHmac("sha256", keySecret)
				.update(`${razorpay_order_id}|${razorpay_payment_id}`)
				.digest("hex");

			if (generatedSignature !== razorpay_signature) {
				logger.error("Razorpay signature verification failed:", {
					received: razorpay_signature,
					expected: generatedSignature,
				});
				return NextResponse.json(
					{ success: false, error: "Payment signature verification failed" },
					{ status: 400 },
				);
			}
		}

		let completedOrderId = `order_${Date.now()}`;
		let _medusaCompleted = false;

		let verifiedAmount = amount || 0;
		if (razorpay_order_id && !isSimulated) {
			try {
				const authId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || process.env.RAZORPAY_KEY_ID;
				const authStr = Buffer.from(`${authId}:${keySecret}`).toString("base64");
				const rzpResponse = await fetch(`https://api.razorpay.com/v1/orders/${razorpay_order_id}`, {
					headers: { Authorization: `Basic ${authStr}` },
				});
				if (rzpResponse.ok) {
					const rzpOrder = await rzpResponse.json();
					verifiedAmount = rzpOrder.amount / 100;
				} else {
					logger.warn("Failed to fetch authoritative Razorpay order amount", await rzpResponse.text());
				}
			} catch (e) {
				logger.warn("Razorpay API call error for amount verify", e);
			}
		}

		// 1. Complete cart in Medusa if cartId provided
		if (cartId && PUBLISHABLE_KEY) {
			const headers: Record<string, string> = {
				"Content-Type": "application/json",
				"x-publishable-api-key": PUBLISHABLE_KEY,
			};

			try {
				// Step A: Update customer and shipping address on cart
				const customerEmail = customer?.email || "patron@theletterink.com";
				const firstName = shippingAddress?.firstName || customer?.name?.split(" ")?.[0] || "Valued";
				const lastName =
					shippingAddress?.lastName || customer?.name?.split(" ")?.slice(1)?.join(" ") || "Patron";
				const address1 = shippingAddress?.address1 || "Atelier Delivery Address";
				const city = shippingAddress?.city || "Mumbai";
				const province = shippingAddress?.province || "Maharashtra";
				const postalCode = shippingAddress?.postalCode || "400001";
				const countryCode = (shippingAddress?.countryCode || "in").toLowerCase();
				const phone = customer?.phone || shippingAddress?.phone || "9876543210";

				await fetch(`${BACKEND_URL}/store/carts/${cartId}`, {
					method: "POST",
					headers,
					body: JSON.stringify({
						email: customerEmail,
						shipping_address: {
							first_name: firstName,
							last_name: lastName,
							address_1: address1,
							address_2: shippingAddress?.address2 || "",
							city,
							province,
							postal_code: postalCode,
							country_code: countryCode,
							phone,
						},
						billing_address: {
							first_name: firstName,
							last_name: lastName,
							address_1: address1,
							address_2: shippingAddress?.address2 || "",
							city,
							province,
							postal_code: postalCode,
							country_code: countryCode,
							phone,
						},
					}),
				});

				// Step B: Ensure valid priced shipping option is selected
				const shipOptionsRes = await fetch(`${BACKEND_URL}/store/shipping-options?cart_id=${cartId}`, {
					headers,
					cache: "no-store",
				});
				let optionId: string | null = null;
				if (shipOptionsRes.ok) {
					const shipData = await shipOptionsRes.json();
					const option =
						shipData.shipping_options?.find((o: any) => o.amount !== undefined) ||
						shipData.shipping_options?.find(
							(o: any) => o.price_type === "flat_rate" && o.amount !== undefined,
						) ||
						shipData.shipping_options?.[0];
					if (option) {
						optionId = option.id;
					}
				}
				if (!optionId) {
					optionId = "so_01M3415J8WVJ6WQK0J1856EEZS";
				}
				await fetch(`${BACKEND_URL}/store/carts/${cartId}/shipping-methods`, {
					method: "POST",
					headers,
					body: JSON.stringify({ option_id: optionId }),
				});

				// Step C: Initialize payment collection & session if not present
				const payColRes = await fetch(`${BACKEND_URL}/store/payment-collections`, {
					method: "POST",
					headers,
					body: JSON.stringify({ cart_id: cartId }),
				});
				if (payColRes.ok) {
					const payColJson = await payColRes.json();
					const payColId = payColJson.payment_collection?.id;
					if (payColId) {
						await fetch(`${BACKEND_URL}/store/payment-collections/${payColId}/payment-sessions`, {
							method: "POST",
							headers,
							body: JSON.stringify({ provider_id: "pp_system_default" }),
						});
					}
				}

				// Step D: Complete the cart
				const completeRes = await fetch(`${BACKEND_URL}/store/carts/${cartId}/complete`, {
					method: "POST",
					headers,
				});

				if (completeRes.ok) {
					const completeJson = await completeRes.json();
					if (completeJson.type === "order" && completeJson.order?.id) {
						completedOrderId = completeJson.order.id;
						_medusaCompleted = true;
					} else {
						return NextResponse.json({ success: false, error: "Cart completion did not return an order" }, { status: 500 });
					}
				} else {
					const errText = await completeRes.text();
					logger.error("Cart complete returned error:", errText);
					return NextResponse.json({ success: false, error: "Cart completion failed" }, { status: 500 });
				}
			} catch (medusaErr) {
				logger.error("Medusa cart completion error:", medusaErr);
				return NextResponse.json({ success: false, error: "Internal error during cart completion" }, { status: 500 });
			}
		}

		// 2. Build full order payload for immediate rendering on /order/success/[id]
		const lineItems = (cartItems || []).map((item: any, idx: number) => {
			const priceStr = String(
				item.productVariant?.price || item.metadata?.custom_unit_price || item.unit_price || item.price || 0,
			);
			const itemName =
				item.productVariant?.product?.name ||
				item.product_title ||
				item.title ||
				item.name ||
				"Grand Royal Illuminated Monogram Float Frame";

			const metadataObj = item.metadata || item.productVariant?.metadata || {};

			return {
				id: item.id || `item_${idx}_${Date.now()}`,
				quantity: item.quantity || 1,
				metadata: metadataObj,
				productVariant: {
					id: item.productVariant?.id || item.variant_id || `var_${idx}`,
					price: priceStr,
					priceGross: priceStr,
					images: item.productVariant?.images || (item.thumbnail ? [item.thumbnail] : []),
					metadata: metadataObj,
					product: {
						id: item.productVariant?.product?.id || item.product_id || `prod_${idx}`,
						name: itemName,
						slug: item.productVariant?.product?.slug || item.product_handle || "product",
						images: item.productVariant?.images || (item.thumbnail ? [item.thumbnail] : []),
					},
				},
			};
		});

		const fullName =
			`${shippingAddress?.firstName || ""} ${shippingAddress?.lastName || ""}`.trim() || "Valued Patron";

		const formattedOrder = {
			id: completedOrderId,
			lookup: formatBrandOrderLookup(completedOrderId),
			orderData: {
				lineItems,
				subtotal: verifiedAmount,
				total: verifiedAmount,
				totalTax: 0,
				shipping: {
					name: "Standard Delivery (India)",
					price: 0,
					priceGross: 0,
				},
				shippingAddress: {
					name: fullName,
					line1: shippingAddress?.address1 || "",
					line2: shippingAddress?.address2 || "",
					city: shippingAddress?.city || "",
					state: shippingAddress?.province || "",
					postalCode: shippingAddress?.postalCode || "",
					country: (shippingAddress?.countryCode || "IN").toUpperCase(),
				},
				customer: {
					email: customer?.email || "",
					phone: customer?.phone || "",
				},
				payment: {
					gateway: "Razorpay",
					paymentId: razorpay_payment_id || "sim_pay_default",
					orderId: razorpay_order_id,
					status: "captured",
				},
			},
		};

		// Store in memory cache for instant, fail-proof success page retrieval
		storeRecentOrder(formattedOrder);

		// 3. Clear cart cookie
		await setCartCookie({ id: "" });

		return NextResponse.json({
			success: true,
			orderId: completedOrderId,
			lookup: formattedOrder.lookup,
		});
	} catch (error: any) {
		logger.error("Razorpay verification error:", error);
		return NextResponse.json(
			{ success: false, error: error.message || "Payment verification failed" },
			{ status: 500 },
		);
	}
}
