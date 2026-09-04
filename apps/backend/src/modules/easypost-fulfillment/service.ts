import {
  AbstractFulfillmentProviderService,
  MedusaError,
} from "@medusajs/framework/utils"
import type { Logger } from "@medusajs/framework/types"
import type {
  CalculatedShippingOptionPrice,
  CalculateShippingOptionPriceContext,
  CalculateShippingOptionPriceDTO,
  CreateShippingOptionDTO,
  FulfillmentOption,
  ValidateFulfillmentDataContext,
} from "@medusajs/framework/types"

type InjectedDependencies = {
  logger: Logger
}

type Options = {
  apiKey: string
}

type EasyPostAddressInput = {
  address_1?: string | null
  address_2?: string | null
  city?: string | null
  province?: string | null
  postal_code?: string | null
  country_code?: string | null
}

type EasyPostAddress = {
  street1?: string
  street2?: string
  city?: string
  state?: string
  zip?: string
  country?: string
}

type EasyPostRate = {
  carrier: string
  service: string
  rate: string
  currency: string
}

type EasyPostShipmentResponse = {
  rates?: EasyPostRate[]
}

const GRAMS_PER_OUNCE = 28.3495

// A generic small box, used since this demo catalog has variant weight but
// no per-product dimensions. EasyPost requires a parcel size to quote a
// rate - this is a stand-in, not a real per-order package size.
const DEFAULT_PARCEL_INCHES = { length: 10, width: 8, height: 6 }

// EasyPost's known carrier service codes, confirmed against their docs and
// support articles - these are looked up by exact string match against the
// "service" field of each returned rate, so a wrong string here means the
// lookup silently finds nothing rather than erroring loudly.
//
// USPS rates are available on any EasyPost account by default. UPS rates
// require a UPS carrier account added in the EasyPost dashboard first (done
// 2026-09-04) - without one, EasyPost's response just won't include UPS
// rates, and calculatePrice falls back to the flat estimate for those
// options rather than erroring.
const CARRIER_SERVICES: Record<
  string,
  { carrier: string; service: string; name: string }
> = {
  "usps-ground-advantage": {
    carrier: "USPS",
    service: "GroundAdvantage",
    name: "USPS Ground Advantage",
  },
  "usps-priority": { carrier: "USPS", service: "Priority", name: "USPS Priority" },
  "usps-express": { carrier: "USPS", service: "Express", name: "USPS Express" },
  "ups-ground": { carrier: "UPS", service: "Ground", name: "UPS Ground" },
  "ups-2nd-day-air": {
    carrier: "UPS",
    service: "2ndDayAir",
    name: "UPS 2nd Day Air",
  },
  "ups-next-day-air": {
    carrier: "UPS",
    service: "NextDayAir",
    name: "UPS Next Day Air",
  },
}

// A flat estimate used only if a live EasyPost rate call fails. Per
// Medusa's own docs for calculatePrice: throwing here blocks checkout (or
// any cart refresh) entirely, so a third-party outage shouldn't be able to
// do that on a live store.
const FALLBACK_RATE = 9.99

class EasyPostFulfillmentProviderService extends AbstractFulfillmentProviderService {
  static identifier = "easypost"

  protected logger_: Logger
  protected options_: Options

  constructor({ logger }: InjectedDependencies, options: Options) {
    super()
    this.logger_ = logger
    this.options_ = options
  }

  async getFulfillmentOptions(): Promise<FulfillmentOption[]> {
    return Object.entries(CARRIER_SERVICES).map(([id, { carrier, service, name }]) => ({
      id,
      name,
      carrier,
      service,
    }))
  }

  async validateFulfillmentData(
    _optionData: Record<string, unknown>,
    data: Record<string, unknown>,
    _context: ValidateFulfillmentDataContext
  ): Promise<any> {
    return data
  }

  async validateOption(data: Record<string, unknown>): Promise<boolean> {
    return typeof data.carrier === "string" && typeof data.service === "string"
  }

  async canCalculate(_data: CreateShippingOptionDTO): Promise<boolean> {
    return true
  }

  private toEasyPostAddress(address?: EasyPostAddressInput): EasyPostAddress {
    return {
      street1: address?.address_1 ?? undefined,
      street2: address?.address_2 ?? undefined,
      city: address?.city ?? undefined,
      state: address?.province ?? undefined,
      zip: address?.postal_code ?? undefined,
      country: address?.country_code?.toUpperCase(),
    }
  }

  async calculatePrice(
    optionData: CalculateShippingOptionPriceDTO["optionData"],
    _data: CalculateShippingOptionPriceDTO["data"],
    context: CalculateShippingOptionPriceContext
  ): Promise<CalculatedShippingOptionPrice> {
    const carrier = optionData.carrier as string
    const service = optionData.service as string

    try {
      const toAddress = this.toEasyPostAddress(context.shipping_address)
      const fromAddress = this.toEasyPostAddress(context.from_location?.address)

      if (!toAddress.zip || !toAddress.country) {
        throw new MedusaError(
          MedusaError.Types.INVALID_DATA,
          "Cart has no shipping address yet"
        )
      }

      // Variant weight is stored in grams (confirmed against this store's
      // seed data - e.g. a "2 lb" bag is stored as 908g); EasyPost expects
      // ounces.
      const totalWeightGrams = (context.items ?? []).reduce((sum, item) => {
        const weight = item.variant?.weight ?? 0
        return sum + weight * Number(item.quantity ?? 1)
      }, 0)
      const weightOz = totalWeightGrams / GRAMS_PER_OUNCE || 1

      const response = await fetch("https://api.easypost.com/v2/shipments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.options_.apiKey}`,
        },
        body: JSON.stringify({
          shipment: {
            to_address: toAddress,
            from_address: fromAddress,
            parcel: { ...DEFAULT_PARCEL_INCHES, weight: weightOz },
          },
        }),
      })

      if (!response.ok) {
        throw new MedusaError(
          MedusaError.Types.UNEXPECTED_STATE,
          `EasyPost returned ${response.status}`
        )
      }

      const shipment = (await response.json()) as EasyPostShipmentResponse
      const rate = shipment.rates?.find(
        (r) => r.carrier === carrier && r.service === service
      )

      if (!rate) {
        throw new MedusaError(
          MedusaError.Types.UNEXPECTED_STATE,
          `No EasyPost rate found for ${carrier} ${service}`
        )
      }

      // EasyPost's rate is a decimal-dollar string ("12.99"), matching how
      // this store already stores/returns prices (confirmed against the
      // price table: a $38.00 product is stored as the integer 38, not
      // 3800) - no unit conversion needed for the amount itself.
      return {
        calculated_amount: parseFloat(rate.rate),
        is_calculated_price_tax_inclusive: false,
      }
    } catch (error) {
      this.logger_.error(
        `EasyPost rate calculation failed for ${carrier} ${service}: ${
          error instanceof Error ? error.message : String(error)
        }`
      )
      return {
        calculated_amount: FALLBACK_RATE,
        is_calculated_price_tax_inclusive: false,
      }
    }
  }

  async createFulfillment(
    data: Record<string, unknown>
  ): Promise<{ data: Record<string, unknown>; labels: never[] }> {
    // Purchasing a real label through EasyPost is out of scope here - rates
    // are live, but fulfillment creation just records the chosen service.
    return { data, labels: [] }
  }

  async cancelFulfillment(): Promise<Record<string, never>> {
    return {}
  }
}

export default EasyPostFulfillmentProviderService
