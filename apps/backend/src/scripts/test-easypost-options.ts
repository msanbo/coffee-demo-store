import { ExecArgs } from "@medusajs/framework/types"
import { Modules } from "@medusajs/framework/utils"

export default async function testEasypostOptions({ container }: ExecArgs) {
  const fulfillmentModuleService = container.resolve(Modules.FULFILLMENT)
  const options = await fulfillmentModuleService.retrieveFulfillmentOptions("easypost_easypost")
  console.log(JSON.stringify(options, null, 2))
}
