"use client"

import { useMemo } from "react"
import { usePathname, useRouter, useParams } from "next/navigation"
import { HttpTypes } from "@medusajs/types"

type RegionSwitcherProps = {
  regions: HttpTypes.StoreRegion[]
}

const RegionSwitcher = ({ regions }: RegionSwitcherProps) => {
  const router = useRouter()
  const pathname = usePathname()
  const { countryCode } = useParams()

  const options = useMemo(
    () =>
      regions.flatMap((region) =>
        (region.countries ?? [])
          .filter((c): c is typeof c & { iso_2: string } => !!c.iso_2)
          .map((country) => ({
            countryCode: country.iso_2,
            label: country.display_name ?? country.iso_2.toUpperCase(),
            currency: region.currency_code?.toUpperCase(),
          }))
      ),
    [regions]
  )

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const nextCountryCode = event.target.value
    const segments = pathname.split("/")
    segments[1] = nextCountryCode
    router.push(segments.join("/") || "/")
  }

  if (options.length < 2) {
    return null
  }

  return (
    <select
      value={typeof countryCode === "string" ? countryCode : undefined}
      onChange={handleChange}
      data-testid="region-switcher"
      aria-label="Shipping region"
      className="bg-transparent text-white text-small-regular border border-white/30 rounded-md px-2 py-1 hover:border-white/60 focus:outline-none cursor-pointer"
    >
      {options.map((option) => (
        <option
          key={option.countryCode}
          value={option.countryCode}
          className="text-ui-fg-base"
        >
          {option.label} ({option.currency})
        </option>
      ))}
    </select>
  )
}

export default RegionSwitcher
