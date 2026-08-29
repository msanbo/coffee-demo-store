import { Metadata } from "next"

import { SITE_NAME } from "@lib/constants"
import MarketingPage from "@modules/home/components/marketing-page"

export const metadata: Metadata = {
  title: `Why ${SITE_NAME}`,
  description:
    "Why customers choose us: direct sourcing, small-batch roasting, and fast shipping on every order.",
}

export default function WhyUsPage() {
  return (
    <MarketingPage
      eyebrow="Why Amber Hour"
      title="Coffee sourced and roasted the way it should be"
      intro="We exist to give people a source for coffee that's actually fresh - roasted in small batches, shipped within days, and sourced directly from growers we work with year after year."
      stats={[
        { value: "48 hrs", label: "roast to ship time" },
        { value: "12+", label: "origins in rotation" },
        { value: "Direct", label: "trade relationships" },
        { value: "Weekly", label: "roast batches" },
      ]}
      highlights={[
        {
          title: "Roasted to order",
          description:
            "We roast in small batches multiple times a week, so your bag ships within days of coming off the roaster - not months after sitting in a warehouse.",
        },
        {
          title: "Sourced directly",
          description:
            "We buy directly from growers and co-ops at prices that reflect the quality of the lot, and we tell you exactly where every bag came from.",
        },
        {
          title: "Dated, not guessed",
          description:
            "Every bag prints its roast date on the label, so you always know what you're brewing and when it was roasted.",
        },
      ]}
      ctaHref="/store"
      ctaLabel="Browse our coffee"
    />
  )
}
