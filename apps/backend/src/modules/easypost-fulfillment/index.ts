import { ModuleProvider, Modules } from "@medusajs/framework/utils"
import EasyPostFulfillmentProviderService from "./service"

export default ModuleProvider(Modules.FULFILLMENT, {
  services: [EasyPostFulfillmentProviderService],
})
