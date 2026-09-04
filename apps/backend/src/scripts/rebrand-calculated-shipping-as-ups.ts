import { ExecArgs } from "@medusajs/framework/types"
import { Modules } from "@medusajs/framework/utils"
import {
  deleteShippingOptionsWorkflow,
  updateShippingOptionsWorkflow,
} from "@medusajs/medusa/core-flows"

const PROVIDER_ID = "calculated-shipping_calculated-shipping"

// tier -> new name, matching the flat options' existing naming convention
const NEW_NAMES: Record<string, string> = {
  ground: "UPS Ground",
  priority: "UPS Second Day Air",
  express: "UPS Next Day Air",
}

// The old flat options these replace - deleted by name, scoped to the
// manual provider so a re-run after renaming can't ever match (and delete)
// the calculated ones themselves.
const OLD_FLAT_UPS_NAMES = ["UPS Ground", "UPS Second Day Air", "UPS Next Day Air"]

export default async function rebrandCalculatedShippingAsUps({ container }: ExecArgs) {
  const fulfillmentModuleService = container.resolve(Modules.FULFILLMENT)

  // provider_id isn't filterable on listShippingOptions, so filter by
  // price_type at the DB level and narrow to this provider in JS.
  const calculatedOptions = (
    await fulfillmentModuleService.listShippingOptions({ price_type: "calculated" })
  ).filter((opt) => opt.provider_id === PROVIDER_ID)

  const renameInput = calculatedOptions
    .map((opt) => {
      const tier = (opt.data as { tier?: string } | null)?.tier
      const newName = tier ? NEW_NAMES[tier] : undefined
      return newName ? { id: opt.id, name: newName } : null
    })
    .filter((x): x is { id: string; name: string } => x !== null)

  if (renameInput.length) {
    await updateShippingOptionsWorkflow(container).run({ input: renameInput })
    console.log(`Renamed ${renameInput.length} calculated option(s) to UPS branding.`)
  }

  const oldFlatOptions = (
    await fulfillmentModuleService.listShippingOptions({
      name: OLD_FLAT_UPS_NAMES,
      price_type: "flat",
    })
  ).filter((opt) => opt.provider_id === "manual_manual")

  if (oldFlatOptions.length) {
    await deleteShippingOptionsWorkflow(container).run({
      input: { ids: oldFlatOptions.map((o) => o.id) },
    })
    console.log(
      `Deleted ${oldFlatOptions.length} old flat UPS option(s): ${oldFlatOptions
        .map((o) => o.name)
        .join(", ")}`
    )
  } else {
    console.log("No old flat UPS options found to delete.")
  }
}
