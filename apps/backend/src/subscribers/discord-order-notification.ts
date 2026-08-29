import type { SubscriberArgs, SubscriberConfig } from "@medusajs/framework"
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils"

// Order money fields come back as Medusa BigNumber instances, not plain
// numbers — this pulls out the actual numeric value from either shape.
const toNumber = (value: unknown): number =>
  typeof value === "number" ? value : Number(value ?? 0)

const formatMoney = (amount: unknown, currencyCode: string) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currencyCode,
  }).format(toNumber(amount))

// Discord embed field values are capped at 1024 chars - truncate defensively
// so a huge order doesn't make the whole webhook call fail with a 400.
const truncate = (value: string, max: number) =>
  value.length > max ? `${value.slice(0, max - 1)}…` : value

export default async function discordOrderNotificationHandler({
  event: { data },
  container,
}: SubscriberArgs<{ id: string }>) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)

  const webhookUrl = process.env.DISCORD_ORDER_WEBHOOK_URL
  if (!webhookUrl) {
    logger.error(
      "DISCORD_ORDER_WEBHOOK_URL not set - skipping Discord order notification"
    )
    return
  }

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

  const currency = order.currency_code
  const itemsText = truncate(
    (order.items ?? [])
      .map((item) => `${item.quantity}x ${item.title} — ${formatMoney(item.unit_price, currency)}`)
      .join("\n") || "—",
    1024
  )

  const addr = order.shipping_address
  const addressText = addr
    ? truncate(
        `${addr.first_name ?? ""} ${addr.last_name ?? ""}\n${addr.address_1 ?? ""}${addr.address_2 ? `, ${addr.address_2}` : ""}\n${addr.city ?? ""}, ${addr.province ?? ""} ${addr.postal_code ?? ""}\n${(addr.country_code ?? "").toUpperCase()}`,
        1024
      )
    : null

  const orderUrl = `${process.env.STOREFRONT_URL}/us/order/${order.id}/confirmed`

  const fields = [
    { name: "Items", value: itemsText },
    { name: "Total", value: formatMoney(order.total, currency), inline: true },
    { name: "Customer", value: order.email ?? "—", inline: true },
  ]
  if (addressText) {
    fields.push({ name: "Shipping to", value: addressText })
  }

  const payload = {
    embeds: [
      {
        title: `New order #${order.display_id}`,
        url: orderUrl,
        color: 0x6b4318,
        fields,
        timestamp: new Date().toISOString(),
      },
    ],
  }

  const response = await fetch(webhookUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  }).catch((err: Error) => {
    logger.error(`Failed to reach Discord webhook for order ${order.id}: ${err.message}`)
    return null
  })

  if (response && !response.ok) {
    const body = await response.text().catch(() => "")
    logger.error(
      `Discord webhook rejected order ${order.id} notification: ${response.status} ${body}`
    )
  }
}

export const config: SubscriberConfig = {
  event: "order.placed",
}
