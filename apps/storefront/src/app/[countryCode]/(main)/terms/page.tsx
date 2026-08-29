import { Metadata } from "next"

import { SITE_NAME } from "@lib/constants"
import AccordionSection, { AccordionItem } from "@modules/common/components/accordion-section"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { Heading, Text } from "@modules/common/components/ui"

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description: `The terms and conditions for using ${SITE_NAME}`,
}

const sections: AccordionItem[] = [
  {
    title: "Eligibility and Access",
    content: (
      <Text className="text-sm leading-7 text-[#5e554e]">
        By using this site, you represent that you are at least 18 years old and that any information you provide when creating an account or placing an order is accurate.
      </Text>
    ),
  },
  {
    title: "Account Registration",
    content: (
      <Text className="text-sm leading-7 text-[#5e554e]">
        You may need to create an account to place an order. You agree to provide accurate information when creating an account and to keep your login credentials confidential. You are responsible for all activity that occurs under your account.
      </Text>
    ),
  },
  {
    title: "Orders, Availability, and Fulfillment",
    content: (
      <Text className="text-sm leading-7 text-[#5e554e]">
        We reserve the right to accept, decline, or limit any order for any reason, including product availability, errors in pricing or product information, or suspected fraud. Product availability is not guaranteed until an order is confirmed.
      </Text>
    ),
  },
  {
    title: "Payment and Pricing",
    content: (
      <Text className="text-sm leading-7 text-[#5e554e]">
        Payments are processed through our third-party payment provider. Prices are subject to change at any time without notice. We make reasonable efforts to display accurate pricing but are not liable for typographical or pricing errors.
      </Text>
    ),
  },
  {
    title: "Intellectual Property",
    content: (
      <Text className="text-sm leading-7 text-[#5e554e]">
        All content on this site, including text, graphics, logos, and images, is the property of {SITE_NAME} or its licensors and is protected by applicable intellectual property laws. You may not reproduce, distribute, or otherwise use our content without prior written permission.
      </Text>
    ),
  },
  {
    title: "User Conduct",
    content: (
      <Text className="text-sm leading-7 text-[#5e554e]">
        You agree not to misuse this site, including by attempting to gain unauthorized access to our systems, interfering with the site&apos;s operation, or using the site for any unlawful purpose.
      </Text>
    ),
  },
  {
    title: "No Warranties",
    content: (
      <Text className="text-sm leading-7 text-[#5e554e]">
        Products and services are provided &quot;as is&quot; without warranties of any kind, express or implied, including any warranty of merchantability or fitness for a particular purpose, to the fullest extent permitted by law.
      </Text>
    ),
  },
  {
    title: "Shipping and Sales",
    content: (
      <Text className="text-sm leading-7 text-[#5e554e]">
        Shipping timeframes are estimates and are not guaranteed. All sales are final. Products are sold as-is, and we do not accept returns or exchanges except as described under Damaged or Incorrect Orders below.
      </Text>
    ),
  },
  {
    title: "Damaged or Incorrect Orders",
    content: (
      <Text className="text-sm leading-7 text-[#5e554e]">
        If you receive a damaged or incorrect item, please contact us within 7 days of delivery so we can help resolve the issue.
      </Text>
    ),
  },
  {
    title: "Limitation of Liability",
    content: (
      <Text className="text-sm leading-7 text-[#5e554e]">
        To the fullest extent permitted by law, {SITE_NAME} will not be liable for any indirect, incidental, or consequential damages arising from your use of this site or our products.
      </Text>
    ),
  },
  {
    title: "Indemnification",
    content: (
      <Text className="text-sm leading-7 text-[#5e554e]">
        You agree to indemnify and hold {SITE_NAME} harmless from any claims, losses, or damages arising from your misuse of this site or violation of these terms.
      </Text>
    ),
  },
  {
    title: "Privacy",
    content: (
      <Text className="text-sm leading-7 text-[#5e554e]">
        Our collection and use of personal information is described in our{" "}
        <LocalizedClientLink href="/privacy-policy" className="font-medium text-[#b6742a] hover:underline">
          Privacy Policy
        </LocalizedClientLink>
        .
      </Text>
    ),
  },
  {
    title: "Modifications to Terms",
    content: (
      <Text className="text-sm leading-7 text-[#5e554e]">
        We may update these terms from time to time. Continued use of this site after changes are posted constitutes your acceptance of the updated terms.
      </Text>
    ),
  },
  {
    title: "Governing Law",
    content: (
      <Text className="text-sm leading-7 text-[#5e554e]">
        These terms are governed by the laws of the State of Wisconsin, without regard to its conflict of law principles.
      </Text>
    ),
  },
  {
    title: "Contact Information",
    content: (
      <Text className="text-sm leading-7 text-[#5e554e]">
        Questions about these terms? Please{" "}
        <LocalizedClientLink href="/contact" className="font-medium text-[#b6742a] hover:underline">
          contact us
        </LocalizedClientLink>{" "}
        or email us directly at{" "}
        <a href="mailto:hello@amberhourcoffee.com" className="font-medium text-[#b6742a] hover:underline">
          hello@amberhourcoffee.com
        </a>
        .
      </Text>
    ),
  },
]

export default function TermsPage() {
  return (
    <div className="w-full bg-[#f8f6f2]">
      <div className="mx-auto max-w-3xl px-6 py-16 sm:px-8">
        <Heading level="h1" className="text-center text-2xl text-[#b6742a] sm:text-3xl">
          Terms &amp; Conditions
        </Heading>
        <Text className="mt-4 text-center text-sm leading-7 text-[#5e554e]">
          These terms govern your use of {SITE_NAME} and your purchase of our products.
        </Text>
        <div className="mt-10">
          <AccordionSection items={sections} />
        </div>
      </div>
    </div>
  )
}
