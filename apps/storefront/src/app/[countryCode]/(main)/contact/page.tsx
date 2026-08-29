import { Metadata } from "next"

import { SITE_NAME } from "@lib/constants"
import ContactForm from "@modules/common/components/contact-form"
import { Heading, Text } from "@modules/common/components/ui"

export const metadata: Metadata = {
  title: "Contact Us",
  description: `Get in touch with ${SITE_NAME}.`,
}

export default function ContactPage() {
  return (
    <div className="w-full bg-white">
      <div className="mx-auto max-w-xl px-6 py-16 sm:px-8">
        <Heading level="h1" className="text-center text-2xl text-[#b6742a] sm:text-3xl">
          Contact Us
        </Heading>
        <Text className="mt-4 text-center text-sm leading-7 text-[#5e554e]">
          Questions about an order, a product, or anything else? Send us a message and we&apos;ll get back to you.
        </Text>
        <div className="mt-10">
          <ContactForm />
        </div>
      </div>
    </div>
  )
}
