import { ExecArgs } from "@medusajs/framework/types"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"

export default async function checkOrders({ container }: ExecArgs) {
  const query = container.resolve(ContainerRegistrationKeys.QUERY)
  const { data: orders } = await query.graph({
    entity: "order",
    fields: [
      "id",
      "display_id",
      "email",
      "customer.phone",
      "shipping_address.*",
      "total",
      "created_at"
    ],
  })

  console.log("Total orders in database:", orders.length)
  for (const o of orders) {
    console.log(`Order: id=${o.id}, display_id=${o.display_id}, email=${o.email}, phone=${o.shipping_address?.phone || o.customer?.phone}`)
  }
}
