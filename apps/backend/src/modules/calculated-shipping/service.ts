import { AbstractFulfillmentProviderService } from "@medusajs/framework/utils"
import type {
  CalculatedShippingOptionPrice,
  CalculateShippingOptionPriceContext,
  CalculateShippingOptionPriceDTO,
  CreateShippingOptionDTO,
  FulfillmentOption,
  ValidateFulfillmentDataContext,
} from "@medusajs/framework/types"

const GRAMS_PER_POUND = 453.592

// A simple, deterministic pricing model - no third-party carrier account
// needed. Not real carrier rates, but weight- and destination-sensitive
// rather than flat, which is the actual gap this replaces.
const BASE_RATE_USD = 5
const RATE_PER_POUND_USD = 0.75
const INTERNATIONAL_MULTIPLIER = 2.5

// Branded as UPS speed tiers to match this store's naming convention -
// still the same formula underneath, not a live UPS rate lookup.
const SERVICE_TIERS: Record<string, { name: string; speedMultiplier: number }> = {
  ground: { name: "UPS Ground", speedMultiplier: 1 },
  priority: { name: "UPS Second Day Air", speedMultiplier: 1.6 },
  express: { name: "UPS Next Day Air", speedMultiplier: 2.5 },
}

class CalculatedShippingProviderService extends AbstractFulfillmentProviderService {
  static identifier = "calculated-shipping"

  async getFulfillmentOptions(): Promise<FulfillmentOption[]> {
    return Object.entries(SERVICE_TIERS).map(([id, { name }]) => ({
      id,
      name,
      tier: id,
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
    return typeof data.tier === "string" && data.tier in SERVICE_TIERS
  }

  async canCalculate(_data: CreateShippingOptionDTO): Promise<boolean> {
    return true
  }

  async calculatePrice(
    optionData: CalculateShippingOptionPriceDTO["optionData"],
    _data: CalculateShippingOptionPriceDTO["data"],
    context: CalculateShippingOptionPriceContext
  ): Promise<CalculatedShippingOptionPrice> {
    const tier = SERVICE_TIERS[optionData.tier as string] ?? SERVICE_TIERS.ground

    // Variant weight is stored in grams (confirmed against this store's
    // seed data - e.g. a "2 lb" bag is stored as 908g).
    const totalWeightGrams = (context.items ?? []).reduce((sum, item) => {
      const weight = item.variant?.weight ?? 0
      return sum + weight * Number(item.quantity ?? 1)
    }, 0)
    const weightLb = totalWeightGrams / GRAMS_PER_POUND

    const isDomestic =
      (context.shipping_address?.country_code ?? "us").toLowerCase() === "us"
    const zoneMultiplier = isDomestic ? 1 : INTERNATIONAL_MULTIPLIER

    const amount =
      (BASE_RATE_USD + RATE_PER_POUND_USD * weightLb) *
      tier.speedMultiplier *
      zoneMultiplier

    return {
      // Round to cents - the multipliers above produce more than 2 decimal
      // places for most weights.
      calculated_amount: Math.round(amount * 100) / 100,
      is_calculated_price_tax_inclusive: false,
    }
  }

  async createFulfillment(
    data: Record<string, unknown>
  ): Promise<{ data: Record<string, unknown>; labels: never[] }> {
    return { data, labels: [] }
  }

  async cancelFulfillment(): Promise<Record<string, never>> {
    return {}
  }
}

export default CalculatedShippingProviderService
