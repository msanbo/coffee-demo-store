import { ExecArgs } from "@medusajs/framework/types"
import { Modules } from "@medusajs/framework/utils"

export default async function testEasypostCalculate({ container }: ExecArgs) {
  const fulfillmentModuleService = container.resolve(Modules.FULFILLMENT)
  const stockLocationModuleService = container.resolve(Modules.STOCK_LOCATION)

  const [location] = await stockLocationModuleService.listStockLocations(
    { name: "US Warehouse" },
    { relations: ["address"] }
  )

  const result = await fulfillmentModuleService.calculateShippingOptionsPrices(
    [
      {
        id: "test",
        provider_id: "easypost_easypost",
        optionData: { carrier: "USPS", service: "GroundAdvantage" },
        data: {},
        context: {
          id: "test-cart",
          from_location: location,
          shipping_address: {
            id: "test-address",
            address_1: "1600 Pennsylvania Ave NW",
            city: "Washington",
            province: "DC",
            postal_code: "20500",
            country_code: "us",
          },
          items: [
            {
              id: "test-item",
              quantity: 2,
              variant: { id: "test-variant", weight: 908 },
            },
          ],
        } as any,
      },
    ]
  )

  console.log(JSON.stringify(result, null, 2))
}
