import { Suspense } from "react"
import { Metadata } from "next"

import { getBaseURL } from "@lib/util/env"
import Banner from "@modules/layout/components/banner"
import Breadcrumbs from "@modules/layout/components/breadcrumbs"
import CartAwareBanners from "@modules/layout/components/cart-aware-banners"
import Footer from "@modules/layout/templates/footer"
import Nav from "@modules/layout/templates/nav"

export const metadata: Metadata = {
  metadataBase: new URL(getBaseURL()),
}

export default function PageLayout(props: { children: React.ReactNode }) {
  return (
    <>
      <Nav />
      <Banner />
      <Breadcrumbs />
      <Suspense fallback={null}>
        <CartAwareBanners />
      </Suspense>
      {props.children}
      <Footer />
    </>
  )
}
