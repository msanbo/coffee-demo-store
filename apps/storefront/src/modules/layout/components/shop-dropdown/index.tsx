"use client"

import { Popover, PopoverButton, PopoverPanel } from "@headlessui/react"
import { HttpTypes } from "@medusajs/types"

import LocalizedClientLink from "@modules/common/components/localized-client-link"
import ChevronDown from "@modules/common/icons/chevron-down"

type ShopDropdownProps = {
  categories: HttpTypes.StoreProductCategory[]
}

const ShopDropdown = ({ categories }: ShopDropdownProps) => {
  return (
    <Popover className="relative h-full flex items-center">
      <PopoverButton className="flex items-center gap-x-1 outline-none hover:text-white/80 data-[open]:text-white/80">
        Shop
        <ChevronDown className="transition-transform data-[open]:rotate-180" />
      </PopoverButton>
      <PopoverPanel
        transition
        anchor={{ to: "bottom start", gap: 8 }}
        className="z-50 w-64 rounded-md bg-white text-ui-fg-base shadow-elevation-flyout py-2 transition duration-150 ease-out data-[closed]:opacity-0 data-[closed]:-translate-y-1"
      >
        <LocalizedClientLink
          href="/store"
          className="block px-4 py-2 text-small-regular font-medium hover:bg-ui-bg-subtle"
        >
          Shop All
        </LocalizedClientLink>
        <div className="my-1 border-t border-ui-border-base" />
        {categories.map((category) => (
          <LocalizedClientLink
            key={category.id}
            href={`/categories/${category.handle}`}
            className="block px-4 py-2 text-small-regular hover:bg-ui-bg-subtle"
          >
            {category.name}
          </LocalizedClientLink>
        ))}
      </PopoverPanel>
    </Popover>
  )
}

export default ShopDropdown
