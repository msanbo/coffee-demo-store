import type { SubscriberArgs, SubscriberConfig } from "@medusajs/framework"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"

// The storefront caches its product list with `next: { cache: "force-cache" }`
// and no automatic revalidation, so any product-facing change needs to bust
// that cache or it never shows up without a manual redeploy. Covers both
// variant-level events (price updates via updateProductVariantsWorkflow emit
// product-variant.updated unconditionally) and product-level events - admin
// edits to title/description/images/status emit product.updated, not the
// variant event, and were previously missed.
export default async function productRevalidateHandler({
  container,
}: SubscriberArgs<{ id: string }>) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)

  if (!process.env.STOREFRONT_URL || !process.env.REVALIDATE_SECRET) {
    logger.warn(
      "product revalidation: STOREFRONT_URL or REVALIDATE_SECRET not set, skipping."
    )
    return
  }

  try {
    const res = await fetch(`${process.env.STOREFRONT_URL}/api/revalidate`, {
      method: "POST",
      headers: { "x-revalidate-secret": process.env.REVALIDATE_SECRET },
    })
    if (!res.ok) {
      logger.error(`Storefront revalidation failed: ${res.status}`)
    }
  } catch (err) {
    logger.error(
      `Storefront revalidation request failed: ${err instanceof Error ? err.message : err}`
    )
  }
}

export const config: SubscriberConfig = {
  event: [
    "product-variant.updated",
    "product.updated",
    "product.created",
    "product.deleted",
  ],
}
