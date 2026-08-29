import { MedusaContainer } from "@medusajs/types"
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils"
import { Resend } from "resend"
import { wrapEmailBody } from "../lib/email-template"

const REMINDER_DELAY_HOURS = 48
const FROM_EMAIL = "Amber Hour Coffee Orders <orders@amberhourcoffee.com>"

// Orders in any of these states have already shipped (or won't), so no
// reminder is needed.
const SKIP_STATUSES = new Set([
  "shipped",
  "partially_shipped",
  "delivered",
  "partially_delivered",
  "canceled",
])

export default async function orderFulfillmentReminderJob(
  container: MedusaContainer
) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const orderModuleService = container.resolve(Modules.ORDER)

  if (!process.env.RESEND_API_KEY) {
    logger.error(
      "RESEND_API_KEY not set - skipping order-fulfillment-reminder job"
    )
    return
  }

  const cutoff = new Date(
    Date.now() - REMINDER_DELAY_HOURS * 60 * 60 * 1000
  ).toISOString()

  const orders = (await orderModuleService.listOrders(
    { created_at: { $lte: cutoff } },
    {
      select: [
        "id",
        "display_id",
        "email",
        "created_at",
        "fulfillment_status",
        "metadata",
      ],
    }
  )) as (Awaited<
    ReturnType<typeof orderModuleService.listOrders>
  >[number] & { fulfillment_status: string })[]

  const dueOrders = orders.filter(
    (order) =>
      !!order.email &&
      !SKIP_STATUSES.has(order.fulfillment_status) &&
      !order.metadata?.fulfillment_reminder_sent_at
  )

  if (!dueOrders.length) {
    return
  }

  const resend = new Resend(process.env.RESEND_API_KEY)

  for (const order of dueOrders) {
    const orderUrl = `${process.env.STOREFRONT_URL}/us/order/${order.id}/confirmed`

    const body = `
      <p>Hi there,</p>
      <p>
        Quick update on your order - it's roasted, packed, and about to
        head out.
      </p>
      <p>
        Your tracking number will go active within the next 24 hours as the
        carrier picks it up.
      </p>
      <p>
        Thanks again for the order - we hope you enjoy it.
      </p>
      <p>
        <a href="${orderUrl}" style="color:#6b4318;font-weight:600;">
          View your order on our site
        </a>
      </p>
    `

    const { error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: order.email!,
      subject: `Order #${order.display_id} update`,
      html: wrapEmailBody(body),
    })

    if (error) {
      logger.error(
        `Failed to send fulfillment reminder for order ${order.id}: ${error.message}`
      )
      continue
    }

    await orderModuleService.updateOrders(order.id, {
      metadata: {
        ...(order.metadata ?? {}),
        fulfillment_reminder_sent_at: new Date().toISOString(),
      },
    })
  }

  logger.info(
    `order-fulfillment-reminder: sent ${dueOrders.length} reminder(s).`
  )
}

export const config = {
  name: "order-fulfillment-reminder",
  schedule: "0 * * * *", // every hour
}
