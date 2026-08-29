"use client"

import { useState } from "react"
import {
  Dialog,
  DialogPanel,
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  TransitionChild,
} from "@headlessui/react"
import { BarsThree } from "@medusajs/icons"
import { HttpTypes } from "@medusajs/types"

import LocalizedClientLink from "@modules/common/components/localized-client-link"
import SearchBar from "@modules/layout/components/search-bar"
import ChevronDown from "@modules/common/icons/chevron-down"
import XMark from "@modules/common/icons/x-mark"

type MobileMenuProps = {
  categories: HttpTypes.StoreProductCategory[]
}

const MobileMenu = ({ categories }: MobileMenuProps) => {
  const [isOpen, setIsOpen] = useState(false)

  const close = () => setIsOpen(false)

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="flex items-center justify-center medium:hidden"
        aria-label="Open menu"
        data-testid="mobile-menu-toggle"
      >
        <BarsThree />
      </button>

      <Dialog open={isOpen} onClose={close} className="relative z-[60]">
        <TransitionChild
          enter="transition-opacity ease-linear duration-200"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="transition-opacity ease-linear duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/40" aria-hidden="true" />
        </TransitionChild>

        <TransitionChild
          enter="transition ease-in-out duration-200"
          enterFrom="translate-x-full"
          enterTo="translate-x-0"
          leave="transition ease-in-out duration-200"
          leaveFrom="translate-x-0"
          leaveTo="translate-x-full"
        >
          <DialogPanel className="fixed inset-y-0 right-0 flex w-full max-w-xs flex-col bg-white shadow-xl">
            <div className="flex items-center justify-between gap-x-4 bg-[#b6742a] px-4 py-4">
              <SearchBar />
              <button
                type="button"
                onClick={close}
                aria-label="Close menu"
                className="text-white"
              >
                <XMark size="20" />
              </button>
            </div>

            <nav className="flex flex-1 flex-col overflow-y-auto py-2 text-base-regular">
              <LocalizedClientLink
                href="/"
                onClick={close}
                className="px-4 py-3 hover:bg-ui-bg-subtle"
              >
                Home
              </LocalizedClientLink>
              <LocalizedClientLink
                href="/why-us"
                onClick={close}
                className="px-4 py-3 hover:bg-ui-bg-subtle"
              >
                Why Us
              </LocalizedClientLink>

              <Disclosure>
                <DisclosureButton className="flex w-full items-center justify-between px-4 py-3 hover:bg-ui-bg-subtle data-[open]:bg-ui-bg-subtle">
                  Shop
                  <ChevronDown className="transition-transform data-[open]:rotate-180" />
                </DisclosureButton>
                <DisclosurePanel className="flex flex-col bg-ui-bg-subtle-hover">
                  <LocalizedClientLink
                    href="/store"
                    onClick={close}
                    className="px-8 py-2 font-medium hover:bg-ui-bg-subtle"
                  >
                    Shop All
                  </LocalizedClientLink>
                  {categories.map((category) => (
                    <LocalizedClientLink
                      key={category.id}
                      href={`/categories/${category.handle}`}
                      onClick={close}
                      className="px-8 py-2 hover:bg-ui-bg-subtle"
                    >
                      {category.name}
                    </LocalizedClientLink>
                  ))}
                </DisclosurePanel>
              </Disclosure>

              <LocalizedClientLink
                href="/contact"
                onClick={close}
                className="px-4 py-3 hover:bg-ui-bg-subtle"
              >
                Contact
              </LocalizedClientLink>
              <LocalizedClientLink
                href="/account"
                onClick={close}
                className="px-4 py-3 hover:bg-ui-bg-subtle"
                data-testid="mobile-menu-account-link"
              >
                Account
              </LocalizedClientLink>
              <LocalizedClientLink
                href="/cart"
                onClick={close}
                className="px-4 py-3 hover:bg-ui-bg-subtle"
                data-testid="mobile-menu-cart-link"
              >
                Cart
              </LocalizedClientLink>
            </nav>
          </DialogPanel>
        </TransitionChild>
      </Dialog>
    </>
  )
}

export default MobileMenu
