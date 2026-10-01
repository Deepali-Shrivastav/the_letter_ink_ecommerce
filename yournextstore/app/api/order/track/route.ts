import { NextResponse } from "next/server";
import { logger } from "@/lib/logger";
import { recentOrdersMap, mapMedusaOrderToStorefront } from "@/lib/commerce";
import { formatBrandOrderLookup } from "@/lib/utils";

const BACKEND_URL = (process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000").replace(/\/$/, "");
const PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || "";

// Clean phone number to last 10 digits
function cleanPhone(phone?: string | null): string {
  if (!phone) return "";
  return phone.replace(/\D/g, "").slice(-10);
}

// Clean and normalize email
function cleanEmail(email?: string | null): string {
  if (!email) return "";
  return email.trim().toLowerCase();
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { orderId, contact } = body;

    const trimmedOrderId = (orderId || "").trim();
    const trimmedContact = (contact || "").trim();

    if (!trimmedOrderId) {
      return NextResponse.json(
        { success: false, error: "Please provide a valid Order ID or Reference." },
        { status: 400 }
      );
    }

    let rawOrder: any = null;

    // 1. Sanitize the reference: strip leading '#', 'TLI-', and leading zeros
    const rawRef = trimmedOrderId.replace(/^#/, "").trim();
    const normalizedInput = rawRef.toLowerCase();
    const strippedInput = normalizedInput.replace(/^tli-?/i, "").trim();
    const strippedLeadingZero = strippedInput.replace(/^0+/, "") || strippedInput;

    let orderSource = "none";

    // 2. Query Medusa Backend FIRST for authoritative live state
    try {
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };
      if (PUBLISHABLE_KEY) {
        headers["x-publishable-api-key"] = PUBLISHABLE_KEY;
      }

      // Try dedicated backend tracking endpoint first
      const trackRes = await fetch(`${BACKEND_URL}/store/orders/track`, {
        method: "POST",
        headers,
        body: JSON.stringify({
          reference: rawRef,
          contact: trimmedContact,
        }),
        cache: "no-store",
      });

      if (trackRes.ok) {
        const json = await trackRes.json();
        if (json.order) {
          orderSource = "medusa_track";
          rawOrder = mapMedusaOrderToStorefront(json.order);
          if (rawOrder) {
            rawOrder.fulfillments = json.order.fulfillments || [];
            rawOrder.fulfillment_status = json.order.fulfillment_status;
            rawOrder.status = json.order.status;
          }
        }
      } else {
        // Fallback to direct ID query
        const directRes = await fetch(`${BACKEND_URL}/store/orders/${encodeURIComponent(rawRef)}`, {
          headers,
          cache: "no-store",
        });
        if (directRes.ok) {
          const json = await directRes.json();
          if (json.order) {
            orderSource = "medusa_direct";
            rawOrder = mapMedusaOrderToStorefront(json.order);
            if (rawOrder) {
              rawOrder.fulfillments = json.order.fulfillments || [];
              rawOrder.fulfillment_status = json.order.fulfillment_status;
              rawOrder.status = json.order.status;
            }
          }
        }
      }
    } catch (err) {
      logger.warn("Medusa order lookup error:", err);
    }

    // 3. Fallback to in-memory recent orders only if backend did not find it (e.g. simulated orders)
    if (!rawOrder) {
      if (recentOrdersMap.has(trimmedOrderId) || recentOrdersMap.has(rawRef)) {
        orderSource = "recent_map_exact";
        rawOrder = recentOrdersMap.get(trimmedOrderId) || recentOrdersMap.get(rawRef);
      } else {
        for (const [key, order] of recentOrdersMap.entries()) {
          const lookup = (order?.lookup || "").toLowerCase().replace(/^#/, "").trim();
          const strippedLookup = lookup.replace(/^tli-?/i, "").trim();
          const strippedLookupZeros = strippedLookup.replace(/^0+/, "") || strippedLookup;
          const keyLower = key.toLowerCase();

          if (
            keyLower === normalizedInput ||
            lookup === normalizedInput ||
            strippedLookup === strippedInput ||
            strippedLookupZeros === strippedLeadingZero ||
            key.slice(-6).toUpperCase() === strippedInput.toUpperCase()
          ) {
            orderSource = "recent_map_search";
            rawOrder = order;
            break;
          }
        }
      }
    }

    if (!rawOrder) {
      return NextResponse.json(
        {
          success: false,
          error: "No order found matching this reference. Please check your Order ID and try again.",
        },
        { status: 404 }
      );
    }

    // 3. Security verification if contact is provided
    const orderData = rawOrder.orderData || rawOrder;
    const orderEmail = cleanEmail(orderData.customer?.email || rawOrder.email || rawOrder.customer?.email);
    const orderPhone = cleanPhone(
      orderData.customer?.phone ||
      orderData.shippingAddress?.phone ||
      rawOrder.shipping_address?.phone ||
      rawOrder.customer?.phone
    );

    // Only enforce contact verification if the order has contact info saved
    const hasOrderContact = Boolean(orderEmail || orderPhone);

    if (trimmedContact && hasOrderContact) {
      const inputCleanEmail = cleanEmail(trimmedContact);
      const inputCleanPhone = cleanPhone(trimmedContact);

      const emailMatches = Boolean(orderEmail && inputCleanEmail && orderEmail === inputCleanEmail);
      const phoneMatches = Boolean(orderPhone && inputCleanPhone && orderPhone === inputCleanPhone);

      if (!emailMatches && !phoneMatches) {
        return NextResponse.json(
          {
            success: false,
            error: "The email or phone number does not match this order. Please verify your contact details.",
          },
          { status: 401 }
        );
      }
    }

    // 4. Derive Status, Timeline, and Courier Tracking Details
    const fulfillments = rawOrder.fulfillments || orderData.fulfillments || [];
    const latestFulfillment = fulfillments[0];

    // Check delivery status across both order-level status and fulfillment timestamps
    const hasDeliveredFulfillment = fulfillments.some((f: any) => Boolean(f.delivered_at));
    const isDelivered =
      rawOrder.fulfillment_status === "delivered" ||
      orderData.fulfillment_status === "delivered" ||
      hasDeliveredFulfillment;

    // Check shipped status across both order-level status and fulfillment timestamps
    const hasShippedFulfillment = fulfillments.length > 0;
    const isShipped =
      rawOrder.fulfillment_status === "shipped" ||
      orderData.fulfillment_status === "shipped" ||
      rawOrder.fulfillment_status === "fulfilled" ||
      orderData.fulfillment_status === "fulfilled" ||
      hasShippedFulfillment;

    const isFulfilled = Boolean(
      latestFulfillment ||
      rawOrder.fulfillment_status === "fulfilled" ||
      orderData.fulfillment_status === "fulfilled"
    );

    const isCanceled = rawOrder.status === "canceled" || orderData.status === "canceled";

    // Tracking details
    const trackingNumber =
      latestFulfillment?.labels?.[0]?.tracking_number ||
      latestFulfillment?.tracking_numbers?.[0] ||
      orderData.shipping?.trackingNumber ||
      null;

    const courierName =
      latestFulfillment?.provider_id === "manual_manual"
        ? "Express Courier Partner"
        : (latestFulfillment?.provider_id || "Express Courier Delivery");

    const trackingUrl =
      latestFulfillment?.labels?.[0]?.tracking_url && latestFulfillment?.labels?.[0]?.tracking_url !== "#"
        ? latestFulfillment?.labels?.[0]?.tracking_url
        : (trackingNumber
          ? `https://track.shiprocket.in/${trackingNumber}`
          : null);

    // Current Milestone
    let currentStep = 1; // 1: Confirmed, 2: Processing, 3: Shipped, 4: Out for Delivery, 5: Delivered
    let statusLabel = "Order Confirmed";
    let statusDescription = "Your bespoke order has been confirmed. Our artisans are preparing your stationery.";

    if (isCanceled) {
      currentStep = 0;
      statusLabel = "Order Canceled";
      statusDescription = "This order has been canceled. Please contact our concierge for queries.";
    } else if (isDelivered) {
      currentStep = 5;
      statusLabel = "Delivered";
      statusDescription = "Your bespoke atelier stationery has been safely delivered.";
    } else if (isShipped || trackingNumber) {
      currentStep = 3;
      statusLabel = "Shipped";
      statusDescription = `Handed over to ${courierName}. In transit to your destination.`;
    } else if (isFulfilled) {
      currentStep = 2;
      statusLabel = "Processing";
      statusDescription = "Artisans are crafting, lettering, and wax-sealing your bespoke stationery.";
    } else {
      currentStep = 2;
      statusLabel = "Processing";
      statusDescription = "Artisans are crafting, lettering, and wax-sealing your bespoke stationery.";
    }

    // Masked customer address for privacy
    const rawAddress = orderData.shippingAddress;
    const maskedAddress = rawAddress
      ? {
          name: rawAddress.name || "Valued Patron",
          city: rawAddress.city || "Mumbai",
          state: rawAddress.state || "Maharashtra",
          postalCode: rawAddress.postalCode || "400001",
          country: rawAddress.country || "IN",
          maskedLine: `${rawAddress.city || "City"}, ${rawAddress.state || "State"} - ${rawAddress.postalCode || "PIN"}`,
        }
      : null;

    // Timeline events
    const createdAt = rawOrder.created_at || new Date().toISOString();
    const createdDate = new Date(createdAt);
    
    // Delivered date from fulfillment if present
    const deliveredDate = latestFulfillment?.delivered_at ? new Date(latestFulfillment.delivered_at) : null;
    const shippedDate = latestFulfillment?.shipped_at ? new Date(latestFulfillment.shipped_at) : null;

    // Estimated dispatch and delivery dates
    const estDispatch = shippedDate || new Date(createdDate.getTime() + 2 * 24 * 60 * 60 * 1000);
    const estDelivery = deliveredDate || new Date(createdDate.getTime() + 5 * 24 * 60 * 60 * 1000);

    const timeline = [
      {
        step: 1,
        title: "Order Confirmed",
        description: "Payment captured successfully via Razorpay.",
        date: createdDate.toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" }),
        time: createdDate.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }),
        completed: currentStep >= 1,
        current: currentStep === 1,
      },
      {
        step: 2,
        title: "Processing",
        description: "Calligraphy personalization, artisanal paper cutting, and wax packaging.",
        date: estDispatch.toLocaleDateString("en-IN", { month: "short", day: "numeric" }),
        time: "Studio Schedule",
        completed: currentStep >= 2,
        current: currentStep === 2,
      },
      {
        step: 3,
        title: "Shipped",
        description: trackingNumber
          ? `Package handed to ${courierName} (AWB: ${trackingNumber}).`
          : "Handing over to courier partner for domestic express delivery.",
        date: estDispatch.toLocaleDateString("en-IN", { month: "short", day: "numeric" }),
        time: shippedDate ? shippedDate.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }) : "Transit",
        completed: currentStep >= 3,
        current: currentStep === 3,
      },
      {
        step: 4,
        title: "Out for Delivery",
        description: isDelivered ? "Courier executive delivered package to your doorstep." : "Courier executive will deliver package to your doorstep.",
        date: estDelivery.toLocaleDateString("en-IN", { month: "short", day: "numeric" }),
        time: isDelivered ? "Completed" : "Expected by 7:00 PM",
        completed: currentStep >= 4,
        current: currentStep === 4,
      },
      {
        step: 5,
        title: "Delivered",
        description: "Package received safely.",
        date: estDelivery.toLocaleDateString("en-IN", { month: "short", day: "numeric" }),
        time: deliveredDate ? deliveredDate.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }) : "Completed",
        completed: currentStep >= 5,
        current: currentStep === 5,
      },
    ];

    return NextResponse.json({
      success: true,
      order: {
        id: rawOrder.id,
        lookup: rawOrder.lookup || formatBrandOrderLookup(rawOrder.id, rawOrder.display_id),
        status: statusLabel,
        statusDescription,
        currentStep,
        isCanceled,
        isDelivered,
        isFulfilled,
        courier: {
          name: courierName,
          trackingNumber: trackingNumber || "AWB Generating...",
          trackingUrl: trackingUrl,
        },
        estimatedDelivery: estDelivery.toLocaleDateString("en-IN", {
          weekday: "long",
          month: "long",
          day: "numeric",
          year: "numeric",
        }),
        timeline,
        shippingAddress: maskedAddress,
        lineItems: (orderData.lineItems || []).map((item: any) => ({
          id: item.id,
          name: item.productVariant?.product?.name || item.name || "Handcrafted Stationery Item",
          quantity: item.quantity || 1,
          price: item.productVariant?.price || item.price || 0,
          image: item.productVariant?.images?.[0] || item.thumbnail || "/Logo.jpeg",
          customNote:
            item.metadata?.custom_inscription ||
            item.metadata?.custom_letter_text ||
            item.productVariant?.metadata?.custom_letter_text ||
            (item.metadata?.customization_selections
              ? Object.entries(item.metadata.customization_selections)
                  .map(([k, v]) => `${k}: ${v}`)
                  .join(" • ")
              : null),
        })),
        summary: {
          subtotal: orderData.subtotal || 0,
          shipping: orderData.shipping?.price || 0,
          total: orderData.total || 0,
          currency: "INR",
        },
        payment: {
          gateway: orderData.payment?.gateway || "Razorpay",
          status: orderData.payment?.status || "Paid",
        },
      },
    });
  } catch (error: any) {
    logger.error("Order tracking error:", error);
    return NextResponse.json(
      { success: false, error: "An unexpected error occurred while fetching your order." },
      { status: 500 }
    );
  }
}
