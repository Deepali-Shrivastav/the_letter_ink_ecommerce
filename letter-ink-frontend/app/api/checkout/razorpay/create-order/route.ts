import { NextResponse } from "next/server";
import { logger } from "@/lib/logger";

const BACKEND_URL = (process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000").replace(/\/$/, "");
const PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || "";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { cartId, customer, notes } = body;

    if (!cartId) {
      return NextResponse.json(
        { success: false, error: "cartId is required" },
        { status: 400 }
      );
    }

    const keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!PUBLISHABLE_KEY) {
      return NextResponse.json(
        { success: false, error: "Server misconfiguration: missing publishable key" },
        { status: 500 }
      );
    }

    let amountInPaise = 0;

    try {
      const cartRes = await fetch(`${BACKEND_URL}/store/carts/${cartId}`, {
        headers: {
          "x-publishable-api-key": PUBLISHABLE_KEY,
        },
        cache: "no-store",
      });
      
      if (!cartRes.ok) {
        return NextResponse.json(
          { success: false, error: "Failed to fetch cart from server" },
          { status: 400 }
        );
      }

      const cartJson = await cartRes.json();
      if (!cartJson.cart?.total) {
        return NextResponse.json(
          { success: false, error: "Cart total is invalid" },
          { status: 400 }
        );
      }
      
      amountInPaise = Math.round(cartJson.cart.total * 100);
    } catch (e) {
      logger.error("Razorpay create-order: Medusa cart fetch error:", e);
      return NextResponse.json(
        { success: false, error: "Internal server error while fetching cart" },
        { status: 500 }
      );
    }

    if (amountInPaise <= 0) {
      return NextResponse.json(
        { success: false, error: "Invalid cart amount" },
        { status: 400 }
      );
    }

    const isLiveConfigured = Boolean(
      keyId &&
      keySecret &&
      !keyId.includes("placeholder") &&
      !keySecret.includes("placeholder") &&
      keyId.startsWith("rzp_")
    );

    if (isLiveConfigured) {
      try {
        const auth = Buffer.from(`${keyId}:${keySecret}`).toString("base64");
        const receipt = `rcpt_${(cartId || Date.now().toString()).slice(-10)}`;

        const rzpResponse = await fetch("https://api.razorpay.com/v1/orders", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Basic ${auth}`,
          },
          body: JSON.stringify({
            amount: amountInPaise,
            currency: "INR",
            receipt,
            notes: {
              cart_id: cartId || "",
              customer_email: customer?.email || "",
              ...notes,
            },
          }),
        });

        if (rzpResponse.ok) {
          const rzpOrder = await rzpResponse.json();

          return NextResponse.json({
            success: true,
            orderId: rzpOrder.id,
            amount: rzpOrder.amount,
            currency: rzpOrder.currency || "INR",
            keyId: keyId,
            isLive: true,
          });
        }

        const errorData = await rzpResponse.json();
        logger.error("Razorpay API order creation failed:", errorData);
      } catch (err) {
        logger.error("Error calling Razorpay Orders API:", err);
      }
    }

    // Fallback/Test/Demo mode (works seamlessly during development or if keys are mock)
    const simulatedOrderId = `order_sim_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    return NextResponse.json({
      success: true,
      orderId: simulatedOrderId,
      amount: amountInPaise,
      currency: "INR",
      keyId: keyId || "rzp_test_theletterink_demo",
      isLive: false,
    });
  } catch (error: any) {
    logger.error("Razorpay create-order error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to create Razorpay order" },
      { status: 500 }
    );
  }
}
