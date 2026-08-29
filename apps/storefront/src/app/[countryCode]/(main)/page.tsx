import { Metadata } from "next"

import AboutUs from "@modules/home/components/about-us"
import Hero from "@modules/home/components/hero"
import ResearchGrid from "@modules/home/components/research-grid"
import TrustSection from "@modules/home/components/trust-section"
import { getRegion } from "@lib/data/regions"
import { SITE_NAME, SITE_DESCRIPTION } from "@lib/constants"

export const metadata: Metadata = {
  title: SITE_NAME,
  description: SITE_DESCRIPTION,
}

export default async function Home(props: {
  params: Promise<{ countryCode: string }>
}) {
  const params = await props.params

  const { countryCode } = params

  const region = await getRegion(countryCode)

  if (!region) {
    return null
  }

  return (
    <>
      <Hero />
      <AboutUs />
      <ResearchGrid region={region} />
      <TrustSection />
    </>
  )
}
