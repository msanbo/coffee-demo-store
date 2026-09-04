import { ExecArgs } from "@medusajs/framework/types"
import { MedusaError, Modules } from "@medusajs/framework/utils"
import { deleteShippingOptionsWorkflow } from "@medusajs/medusa/core-flows"

export default async function removeFlatUspsOption({ container }: ExecArgs) {
  const fulfillmentModuleService = container.resolve(Modules.FULFILLMENT)

  const uspsOptions = (
    await fulfillmentModuleService.listShippingOptions({
      name: "USPS",
      price_type: "flat",
    })
  ).filter((opt) => opt.provider_id === "manual_manual")

  if (!uspsOptions.length) {
    throw new MedusaError(
      MedusaError.Types.NOT_FOUND,
      'No flat "USPS" option (manual_manual) found to delete'
    )
  }

  await deleteShippingOptionsWorkflow(container).run({
    input: { ids: uspsOptions.map((o) => o.id) },
  })
  console.log(`Deleted ${uspsOptions.length} flat USPS option(s).`)
}
