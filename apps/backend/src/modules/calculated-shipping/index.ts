import { ModuleProvider, Modules } from "@medusajs/framework/utils"
import CalculatedShippingProviderService from "./service"

export default ModuleProvider(Modules.FULFILLMENT, {
  services: [CalculatedShippingProviderService],
})
