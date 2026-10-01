import { NextResponse, connection } from "next/server";
import { storeRecentOrder } from "@/lib/commerce";
import { setCartCookie } from "@/lib/cookies";
import { logger } from "@/lib/logger";
import { formatBrandOrderLookup } from "@/lib/utils";

const BACKEND_URL = (process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://127.0.0.1:9000")
  .replace("localhost", "127.0.0.1")
  .replace(/\/$/, "");
const PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || "";

export async function GET(request: Request) {
  await connection();
  try {
    const url = new URL(request.url);
    const razorpay_payment_id = url.searchParams.get("razorpay_payment_id");
    const razorpay_payment_link_id = url.searchParams.get("razorpay_payment_link_id");
    const status = url.searchParams.get("razorpay_payment_link_status");
    const cartId = url.searchParams.get("cartId");

    const host = request.headers.get("host") || "localhost:3000";
    const protocol = host.includes("localhost") ? "http" : "https";

    let completedOrderId = `order_${Date.now()}`;

    if (cartId && PUBLISHABLE_KEY) {
      try {
        const headers = {
          "Content-Type": "application/json",
          "x-publishable-api-key": PUBLISHABLE_KEY,
        };
        // Attempt cart completion in Medusa
        const completeRes = await fetch(`${BACKEND_URL}/store/carts/${cartId}/complete`, {
          method: "POST",
          headers,
        });
        if (completeRes.ok) {
          const completeJson = await completeRes.json();
          if (completeJson.type === "order" && completeJson.order?.id) {
            completedOrderId = completeJson.order.id;
          }
        }
      } catch (err) {
        logger.warn("Medusa complete cart on Razorpay callback:", err);
      }
    }

    // Store in recent orders
    const fallbackOrder = {
      id: completedOrderId,
      lookup: formatBrandOrderLookup(completedOrderId),
      orderData: {
        lineItems: [],
        subtotal: 0,
        total: 0,
        totalTax: 0,
        shipping: {
          name: "Standard Delivery (India)",
          price: 0,
          priceGross: 0,
        },
        shippingAddress: {
          name: "Valued Patron",
          country: "IN",
        },
        customer: {
          email: "",
        },
        payment: {
          gateway: "Razorpay",
          paymentId: razorpay_payment_id,
          paymentLinkId: razorpay_payment_link_id,
          status: status || "paid",
        },
      },
    };
    storeRecentOrder(fallbackOrder);

    // Clear cart cookie
    await setCartCookie({ id: "" });

    return NextResponse.redirect(`${protocol}://${host}/order/success/${completedOrderId}`);
  } catch (error) {
    logger.error("Razorpay callback error:", error);
    return NextResponse.redirect(new URL("/cart", request.url));
  }
}
