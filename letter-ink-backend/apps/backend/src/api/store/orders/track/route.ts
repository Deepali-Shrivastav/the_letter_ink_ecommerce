import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"

export async function POST(
  req: MedusaRequest,
  res: MedusaResponse
): Promise<void> {
  const logger = req.scope.resolve("logger", { allowUnregistered: true }) as any
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)

  try {
    const { reference, contact } = (req.body || {}) as { reference?: string; contact?: string }

    if (!reference || !reference.trim()) {
      res.status(400).json({ success: false, message: "Order reference is required" })
      return
    }

    const hasApiKey = Boolean(req.headers["x-publishable-api-key"])
    if (!contact?.trim() && !hasApiKey) {
      res.status(400).json({ success: false, message: "Contact information (email or phone) is required" })
      return
    }

    // 1. Sanitize the reference: strip '#', 'TLI-', and spaces
    const cleanRef = reference.trim().replace(/^#/, "").trim()
    const stripped = cleanRef.replace(/^tli-?/i, "").trim()
    const isNumeric = /^\d+$/.test(stripped)
    const numericDisplayId = isNumeric ? parseInt(stripped, 10) : null

    logger?.info?.(`[OrderTrack] Searching for order with ref: "${reference}", clean: "${cleanRef}", numericId: ${numericDisplayId}`)

    const queryFields = [
      "id",
      "display_id",
      "status",
      "fulfillment_status",
      "payment_status",
      "total",
      "subtotal",
      "tax_total",
      "shipping_total",
      "currency_code",
      "email",
      "created_at",
      "customer.*",
      "shipping_address.*",
      "billing_address.*",
      "shipping_methods.*",
      "items.*",
      "items.variant.*",
      "items.variant.product.*",
      "fulfillments.*",
      "fulfillments.labels.*",
    ]

    let matchedOrder: any = null

    // Strategy A: Query by display_id if numeric
    if (numericDisplayId !== null && !isNaN(numericDisplayId)) {
      const { data: ordersByDisplayId } = await query.graph({
        entity: "order",
        fields: queryFields,
        filters: { display_id: numericDisplayId.toString() },
      })
      if (ordersByDisplayId && ordersByDisplayId.length > 0) {
        matchedOrder = ordersByDisplayId[0]
      }
    }

    // Strategy B: Query by exact ID (e.g. order_01...)
    if (!matchedOrder && (cleanRef.startsWith("order_") || stripped.startsWith("order_"))) {
      const targetId = cleanRef.startsWith("order_") ? cleanRef : stripped
      const { data: ordersById } = await query.graph({
        entity: "order",
        fields: queryFields,
        filters: { id: targetId },
      })
      if (ordersById && ordersById.length > 0) {
        matchedOrder = ordersById[0]
      }
    }


    if (!matchedOrder) {
      res.status(404).json({
        success: false,
        message: "No order found matching this reference. Please check your Order ID and try again.",
      })
      return
    }

    // 2. Validate Contact (Email or Phone) if provided
    if (contact && contact.trim()) {
      const inputCleanPhone = contact.replace(/\D/g, "").slice(-10)
      const inputCleanEmail = contact.trim().toLowerCase()

      const orderEmail = (matchedOrder.email || matchedOrder.customer?.email || "").trim().toLowerCase()
      const orderPhone = (
        matchedOrder.shipping_address?.phone ||
        matchedOrder.billing_address?.phone ||
        matchedOrder.customer?.phone ||
        ""
      ).replace(/\D/g, "").slice(-10)

      const emailMatches = Boolean(orderEmail && inputCleanEmail && orderEmail === inputCleanEmail)
      const phoneMatches = Boolean(orderPhone && inputCleanPhone && orderPhone === inputCleanPhone)

      if (!emailMatches && !phoneMatches) {
        res.status(401).json({
          success: false,
          message: "The contact details do not match this order. Please check the email or phone number.",
        })
        return
      }
    }

    res.json({
      success: true,
      order: matchedOrder,
    })
  } catch (err: any) {
    logger?.error?.("[OrderTrack] Error fetching order:", err)
    res.status(500).json({
      success: false,
      message: err.message || "Failed to retrieve order tracking info",
    })
  }
}
