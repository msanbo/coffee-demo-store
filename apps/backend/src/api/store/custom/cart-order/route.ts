import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import type { RemoteQueryFunction } from "@medusajs/framework/types"
import { ContainerRegistrationKeys, MedusaError } from "@medusajs/framework/utils"

// Lets the storefront poll for a cart's completed order after an async,
// hosted-redirect payment (PayRam, BTCPay): the order gets created
// server-side by the core payment webhook workflow once the provider
// confirms payment, not by the storefront calling cart.complete() itself -
// this is how it finds out the order now exists. Uses the same "order_cart"
// link the workflow itself queries (see @medusajs/core-flows
// process-payment.js), so it can't disagree with what actually happened.
export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const cartId = req.query.cart_id as string | undefined

  if (!cartId) {
    throw new MedusaError(
      MedusaError.Types.INVALID_DATA,
      "cart_id query parameter is required"
    )
  }

  const query = req.scope.resolve(
    ContainerRegistrationKeys.QUERY
  ) as RemoteQueryFunction

  const { data } = await query.graph({
    entity: "order_cart",
    fields: ["order_id"],
    filters: { cart_id: cartId },
  })

  res.json({ order_id: data[0]?.order_id ?? null })
}
