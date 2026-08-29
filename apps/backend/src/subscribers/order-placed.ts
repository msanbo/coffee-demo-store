import type { SubscriberArgs, SubscriberConfig } from "@medusajs/framework"
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils"
import { Resend } from "resend"
import { wrapEmailBody } from "../lib/email-template"

const FROM_EMAIL = "Amber Hour Coffee Orders <orders@amberhourcoffee.com>"

// Order money fields come back as Medusa BigNumber instances, not plain
// numbers — this pulls out the actual numeric value from either shape.
const toNumber = (value: unknown): number =>
  typeof value === "number" ? value : Number(value ?? 0)

const formatMoney = (amount: unknown, currencyCode: string) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currencyCode,
  }).format(toNumber(amount))

export default async function orderPlacedHandler({
  event: { data },
  container,
}: SubscriberArgs<{ id: string }>) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const orderModuleService = container.resolve(Modules.ORDER)

  const order = await orderModuleService.retrieveOrder(data.id, {
    relations: ["items", "shipping_address"],
    select: [
      "id",
      "display_id",
      "email",
      "currency_code",
      "item_total",
      "shipping_total",
      "tax_total",
      "total",
    ],
  })

  if (!order?.email) {
    logger.warn(`order.placed: order ${data.id} has no email, skipping confirmation.`)
    return
  }

  if (!process.env.RESEND_API_KEY) {
    logger.error("RESEND_API_KEY not set - skipping order confirmation email")
    return
  }

  const currency = order.currency_code
  const itemsHtml = (order.items ?? [])
    .map(
      (item) => `
        <tr>
          <td style="padding:8px 0;">${item.title}</td>
          <td style="padding:8px 0;text-align:center;">${item.quantity}</td>
          <td style="padding:8px 0;text-align:right;">${formatMoney(
            item.unit_price,
            currency
          )}</td>
        </tr>`
    )
    .join("")

  const addr = order.shipping_address
  const addressHtml = addr
    ? `${addr.first_name ?? ""} ${addr.last_name ?? ""}<br/>
       ${addr.address_1 ?? ""}${addr.address_2 ? `, ${addr.address_2}` : ""}<br/>
       ${addr.city ?? ""}, ${addr.province ?? ""} ${addr.postal_code ?? ""}<br/>
       ${(addr.country_code ?? "").toUpperCase()}`
    : ""

  const orderUrl = `${process.env.STOREFRONT_URL}/us/order/${order.id}/confirmed`

  const body = `
    <h2 style="color:#6b4318;">Thanks for your order</h2>
    <p>Hi there,</p>
    <p>
      Thanks for ordering from us. Your order is confirmed and heading to
      our roastery queue.
    </p>
    <p><strong>What happens next</strong></p>
    <p>
      Your coffee will be freshly roasted and packed within the next couple
      of days, then shipped out right away so it reaches you as close to the
      roast date as possible.
    </p>
    <p>
      You'll get a shipping notification with tracking as soon as your order
      is on its way. Questions in the meantime? Just reply to this email
      with your order number.
    </p>
    <p>
      <a href="${orderUrl}" style="color:#6b4318;font-weight:600;">
        View your order on our site
      </a>
    </p>
    <table style="width:100%;border-collapse:collapse;margin:24px 0;">
      <thead>
        <tr style="border-bottom:1px solid #e6dccf;text-align:left;">
          <th style="padding:8px 0;">Item</th>
          <th style="padding:8px 0;text-align:center;">Qty</th>
          <th style="padding:8px 0;text-align:right;">Price</th>
        </tr>
      </thead>
      <tbody>${itemsHtml}</tbody>
    </table>
    <table style="width:100%;border-collapse:collapse;">
      <tr><td>Subtotal</td><td style="text-align:right;">${formatMoney(order.item_total, currency)}</td></tr>
      <tr><td>Shipping</td><td style="text-align:right;">${formatMoney(order.shipping_total, currency)}</td></tr>
      <tr><td>Tax</td><td style="text-align:right;">${formatMoney(order.tax_total, currency)}</td></tr>
      <tr style="font-weight:bold;"><td style="padding-top:8px;">Total</td><td style="text-align:right;padding-top:8px;">${formatMoney(order.total, currency)}</td></tr>
    </table>
    ${
      addressHtml
        ? `<h3 style="margin-top:32px;">Shipping to</h3><p>${addressHtml}</p>`
        : ""
    }
  `

  const resend = new Resend(process.env.RESEND_API_KEY)
  const { error } = await resend.emails.send({
    from: FROM_EMAIL,
    to: order.email,
    subject: `Order #${order.display_id} confirmed`,
    html: wrapEmailBody(body),
  })

  if (error) {
    logger.error(
      `Failed to send order confirmation email for order ${order.id}: ${error.message}`
    )
  }
}

export const config: SubscriberConfig = {
  event: "order.placed",
}
