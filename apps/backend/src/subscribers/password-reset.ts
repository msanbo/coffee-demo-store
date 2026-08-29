import type { SubscriberArgs, SubscriberConfig } from "@medusajs/framework"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"
import { Resend } from "resend"
import { wrapEmailBody } from "../lib/email-template"

const FROM_EMAIL = "Amber Hour Coffee Support <orders@amberhourcoffee.com>"

type PasswordResetEventData = {
  entity_id: string
  actor_type: string
  token: string
}

export default async function passwordResetHandler({
  event: { data },
  container,
}: SubscriberArgs<PasswordResetEventData>) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)

  // This event also fires for admin user resets (actor_type "user"); those
  // aren't customer-facing and have no storefront page to land on.
  if (data.actor_type !== "customer") {
    return
  }

  if (!process.env.RESEND_API_KEY) {
    logger.error("RESEND_API_KEY not set - skipping password reset email")
    return
  }

  // For the emailpass provider, entity_id is the customer's email.
  const resetUrl = `${process.env.STOREFRONT_URL}/us/reset-password?token=${encodeURIComponent(
    data.token
  )}`

  const body = `
    <h2 style="color:#6b4318;">Reset your password</h2>
    <p>Hello,</p>
    <p>
      We received a request to reset the password on your account. Click the
      link below to choose a new password. This link expires in 15 minutes
      and can only be used once.
    </p>
    <p>
      <a href="${resetUrl}" style="color:#6b4318;font-weight:600;">
        Reset your password
      </a>
    </p>
    <p>If you didn't request this, you can safely ignore this email.</p>
  `

  const resend = new Resend(process.env.RESEND_API_KEY)
  const { error } = await resend.emails.send({
    from: FROM_EMAIL,
    to: data.entity_id,
    subject: "Reset your password",
    html: wrapEmailBody(body),
  })

  if (error) {
    logger.error(
      `Failed to send password reset email to ${data.entity_id}: ${error.message}`
    )
  }
}

export const config: SubscriberConfig = {
  event: "auth.password_reset",
}
