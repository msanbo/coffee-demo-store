import { Suspense } from "react"
import Image from "next/image"

import { listCategories } from "@lib/data/categories"
import { SITE_NAME } from "@lib/constants"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import CartButton from "@modules/layout/components/cart-button"
import MobileCartButton from "@modules/layout/components/mobile-cart-button"
import MobileMenu from "@modules/layout/components/mobile-menu"
import SearchBar from "@modules/layout/components/search-bar"
import ShopDropdown from "@modules/layout/components/shop-dropdown"

export default async function Nav() {
  const categories = await listCategories()
  const topLevelCategories = (categories || []).filter(
    (category) => !category.parent_category
  )

  return (
    <div className="sticky top-0 inset-x-0 z-50 group">
      <header className="relative h-16 mx-auto bg-[#2b1c14] text-white">
        <nav className="content-container flex items-center justify-between w-full h-full text-small-regular">
          <div className="flex items-center h-full">
            <LocalizedClientLink
              href="/"
              className="flex items-center gap-2 hover:opacity-80"
              data-testid="nav-store-link"
            >
              <Image
                src="/logo-mark.png"
                alt=""
                width={36}
                height={36}
                className="h-8 w-8"
                priority
              />
              <span className="font-semibold tracking-tight">{SITE_NAME}</span>
            </LocalizedClientLink>
          </div>

          <div className="hidden medium:flex items-center gap-x-6 h-full">
            <LocalizedClientLink className="hover:text-white/80" href="/">
              Home
            </LocalizedClientLink>
            <LocalizedClientLink className="hover:text-white/80" href="/why-us">
              Why Us
            </LocalizedClientLink>
            <ShopDropdown categories={topLevelCategories} />
            <LocalizedClientLink className="hover:text-white/80" href="/contact">
              Contact
            </LocalizedClientLink>
            <LocalizedClientLink
              className="hover:text-white/80"
              href="/account"
              data-testid="nav-account-link"
            >
              Account
            </LocalizedClientLink>
            <Suspense
              fallback={
                <LocalizedClientLink
                  className="hover:text-white/80 flex gap-2"
                  href="/cart"
                  data-testid="nav-cart-link"
                >
                  Cart (0)
                </LocalizedClientLink>
              }
            >
              <CartButton />
            </Suspense>
          </div>

          <div className="hidden medium:block">
            <SearchBar />
          </div>

          <div className="flex items-center gap-x-4 medium:hidden">
            <Suspense fallback={null}>
              <MobileCartButton />
            </Suspense>
            <MobileMenu categories={topLevelCategories} />
          </div>
        </nav>
      </header>
    </div>
  )
}
