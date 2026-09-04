import { ExecArgs } from "@medusajs/framework/types"
import {
  ContainerRegistrationKeys,
  MedusaError,
  Modules,
} from "@medusajs/framework/utils"
import { createShippingOptionsWorkflow } from "@medusajs/medusa/core-flows"

const PROVIDER_ID = "calculated-shipping_calculated-shipping"

const TIERS = [
  { tier: "ground", label: "Calculated Ground", code: "calc-ground" },
  { tier: "priority", label: "Calculated Priority", code: "calc-priority" },
  { tier: "express", label: "Calculated Express", code: "calc-express" },
]

export default async function createCalculatedShippingOptions({ container }: ExecArgs) {
  const fulfillmentModuleService = container.resolve(Modules.FULFILLMENT)
  const query = container.resolve(ContainerRegistrationKeys.QUERY)
  const remoteLink = container.resolve(ContainerRegistrationKeys.LINK)

  const [serviceZone] = await fulfillmentModuleService.listServiceZones({
    name: "United States",
  })
  if (!serviceZone) {
    throw new MedusaError(
      MedusaError.Types.NOT_FOUND,
      'Service zone "United States" not found'
    )
  }

  const [existingOption] = await fulfillmentModuleService.listShippingOptions({
    service_zone: { id: serviceZone.id },
  })
  const shippingProfileId = existingOption?.shipping_profile_id
  if (!shippingProfileId) {
    throw new MedusaError(
      MedusaError.Types.NOT_FOUND,
      "Could not determine shipping_profile_id from an existing option"
    )
  }

  // A fulfillment provider must be explicitly enabled for a stock location
  // before any shipping option on that location's service zone can use it -
  // being registered in medusa-config.ts alone isn't enough. This is the
  // same link the "Add Fulfillment Provider" admin route creates.
  //
  // fulfillment_sets is a cross-module link (stock-location <-> fulfillment),
  // not a native relation on the stock-location module, so it has to be
  // resolved via query.graph() rather than the module service's own
  // listStockLocations relations option.
  const { data: locations } = await query.graph({
    entity: "stock_location",
    fields: ["id", "fulfillment_sets.id"],
  })
  const location = locations.find((l) =>
    l.fulfillment_sets?.some((fs) => fs?.id === serviceZone.fulfillment_set_id)
  )
  if (!location) {
    throw new MedusaError(
      MedusaError.Types.NOT_FOUND,
      "Could not find the stock location for this service zone"
    )
  }
  await remoteLink.create({
    [Modules.STOCK_LOCATION]: { stock_location_id: location.id },
    [Modules.FULFILLMENT]: { fulfillment_provider_id: PROVIDER_ID },
  })
  console.log(`Enabled ${PROVIDER_ID} for stock location ${location.id}`)

  const { result } = await createShippingOptionsWorkflow(container).run({
    input: TIERS.map(({ tier, label, code }) => ({
      name: label,
      service_zone_id: serviceZone.id,
      shipping_profile_id: shippingProfileId,
      provider_id: PROVIDER_ID,
      type: { label, description: `${label} (calculated)`, code },
      price_type: "calculated" as const,
      data: { tier },
    })),
  })

  console.log(JSON.stringify(result, null, 2))
}
