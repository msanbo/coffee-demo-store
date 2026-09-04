import { ExecArgs } from "@medusajs/framework/types"
import { Modules } from "@medusajs/framework/utils"

export default async function testCalculatedShipping({ container }: ExecArgs) {
  const fulfillmentModuleService = container.resolve(Modules.FULFILLMENT)

  const options = await fulfillmentModuleService.retrieveFulfillmentOptions(
    "calculated-shipping_calculated-shipping"
  )
  console.log("=== options ===")
  console.log(JSON.stringify(options, null, 2))

  const baseContext = {
    id: "test-cart",
    items: [
      {
        id: "test-item",
        quantity: 2,
        variant: { id: "test-variant", weight: 908 }, // 2 lb bag x2 = 4 lb
      },
    ],
  }

  const scenarios = [
    { label: "US / ground", tier: "ground", country: "us" },
    { label: "US / express", tier: "express", country: "us" },
    { label: "International (DE) / ground", tier: "ground", country: "de" },
    { label: "International (DE) / express", tier: "express", country: "de" },
  ]

  for (const scenario of scenarios) {
    const result = await fulfillmentModuleService.calculateShippingOptionsPrices([
      {
        id: "test",
        provider_id: "calculated-shipping_calculated-shipping",
        optionData: { tier: scenario.tier },
        data: {},
        context: {
          ...baseContext,
          shipping_address: {
            id: "test-address",
            country_code: scenario.country,
          },
        } as any,
      },
    ])
    console.log(`${scenario.label}: $${result[0].calculated_amount}`)
  }
}
