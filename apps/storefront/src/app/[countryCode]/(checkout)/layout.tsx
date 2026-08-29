import LocalizedClientLink from "@modules/common/components/localized-client-link"
import ChevronDown from "@modules/common/icons/chevron-down"
import Banner from "@modules/layout/components/banner"
import Nav from "@modules/layout/templates/nav"
import Footer from "@modules/layout/templates/footer"

export default function CheckoutLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="w-full bg-white relative">
      <Nav />
      <Banner />
      <div className="h-12 bg-white border-b">
        <div className="flex h-full items-center content-container">
          <LocalizedClientLink
            href="/cart"
            className="text-small-semi text-ui-fg-base flex items-center gap-x-2 uppercase"
            data-testid="back-to-cart-link"
          >
            <ChevronDown className="rotate-90" size={16} />
            <span className="mt-px txt-compact-plus text-ui-fg-subtle hover:text-ui-fg-base">
              Back to shopping cart
            </span>
          </LocalizedClientLink>
        </div>
      </div>
      <div className="relative" data-testid="checkout-container">{children}</div>
      <Footer />
    </div>
  )
}
