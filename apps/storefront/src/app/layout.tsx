import { getBaseURL } from "@lib/util/env"
import { Metadata } from "next"
import Script from "next/script"
import "styles/globals.css"

export const metadata: Metadata = {
  metadataBase: new URL(getBaseURL()),
}

const GA_MEASUREMENT_ID = "G-0C7SB7TVV1"

export default function RootLayout(props: { children: React.ReactNode }) {
  return (
    <html lang="en" data-mode="light">
      <body>
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
          strategy="lazyOnload"
        />
        <Script id="ga4-init" strategy="lazyOnload">
          {`
            window.dataLayer = window.dataLayer || []
            function gtag(){dataLayer.push(arguments)}
            gtag('js', new Date())
            gtag('config', '${GA_MEASUREMENT_ID}')
          `}
        </Script>
        <main className="relative">{props.children}</main>
      </body>
    </html>
  )
}
