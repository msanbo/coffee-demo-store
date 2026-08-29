import { ShoppingCart } from "@medusajs/icons"

import { retrieveCart } from "@lib/data/cart"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

export default async function MobileCartButton() {
  const cart = await retrieveCart().catch(() => null)

  const totalItems =
    cart?.items?.reduce((acc, item) => acc + item.quantity, 0) || 0

  return (
    <LocalizedClientLink
      href="/cart"
      className="relative flex items-center justify-center medium:hidden"
      data-testid="mobile-cart-link"
    >
      <ShoppingCart />
      {totalItems > 0 && (
        <span className="absolute -top-2 -right-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-white px-1 text-[10px] font-semibold text-[#b6742a]">
          {totalItems}
        </span>
      )}
    </LocalizedClientLink>
  )
}
