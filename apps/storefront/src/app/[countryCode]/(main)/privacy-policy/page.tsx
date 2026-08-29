import { Metadata } from "next"

import { SITE_NAME } from "@lib/constants"
import AccordionSection, { AccordionItem } from "@modules/common/components/accordion-section"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { Heading, Text } from "@modules/common/components/ui"

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: `How ${SITE_NAME} collects, uses, and protects your information.`,
}

const sections: AccordionItem[] = [
  {
    title: "Information We Collect",
    content: (
      <div className="space-y-3">
        <Text className="text-sm leading-7 text-[#5e554e]">
          We collect information you provide directly, such as your name, email address, shipping address, and phone number when you create an account, place an order, or contact us.
        </Text>
        <Text className="text-sm leading-7 text-[#5e554e]">
          We also collect technical information automatically, including your IP address, browser type, device information, and how you interact with our site, typically through cookies and similar technologies.
        </Text>
        <Text className="text-sm leading-7 text-[#5e554e]">
          Payment card details are handled directly by our payment processor and are not stored on our servers.
        </Text>
      </div>
    ),
  },
  {
    title: "How We Use Your Information",
    content: (
      <Text className="text-sm leading-7 text-[#5e554e]">
        We use the information we collect to process and fulfill orders, communicate with you about your account or purchases, provide customer support, maintain and improve our site, detect and prevent fraud, and comply with applicable legal obligations.
      </Text>
    ),
  },
  {
    title: "Cookies and Tracking Technologies",
    content: (
      <Text className="text-sm leading-7 text-[#5e554e]">
        We use cookies and similar technologies to keep you signed in, remember your preferences, and understand how our site is used so we can improve it. Most browsers let you control or disable cookies through their settings; doing so may affect how parts of the site function.
      </Text>
    ),
  },
  {
    title: "Information Sharing and Disclosure",
    content: (
      <Text className="text-sm leading-7 text-[#5e554e]">
        We do not sell your personal information. We share information with service providers who help us operate our business, such as payment processors, shipping carriers, and hosting providers, only as needed to provide our services. We may also disclose information if required to do so by law or in response to valid legal requests.
      </Text>
    ),
  },
  {
    title: "Data Security",
    content: (
      <Text className="text-sm leading-7 text-[#5e554e]">
        We use reasonable administrative, technical, and physical safeguards designed to protect the information we collect. No method of transmission or storage is completely secure, and we cannot guarantee absolute security.
      </Text>
    ),
  },
  {
    title: "Data Retention",
    content: (
      <Text className="text-sm leading-7 text-[#5e554e]">
        We retain personal information for as long as necessary to fulfill the purposes described in this policy, including maintaining order records and meeting legal, accounting, or reporting requirements.
      </Text>
    ),
  },
  {
    title: "Your Rights and Choices",
    content: (
      <Text className="text-sm leading-7 text-[#5e554e]">
        You may request access to, correction of, or deletion of your personal information, and you may opt out of marketing communications at any time. To exercise any of these choices, contact us using the information below.
      </Text>
    ),
  },
  {
    title: "Third-Party Links",
    content: (
      <Text className="text-sm leading-7 text-[#5e554e]">
        Our site may contain links to third-party websites. We are not responsible for the privacy practices or content of those sites, and we encourage you to review their privacy policies before providing any information.
      </Text>
    ),
  },
  {
    title: "Changes to This Policy",
    content: (
      <Text className="text-sm leading-7 text-[#5e554e]">
        We may update this policy from time to time to reflect changes in our practices. Continued use of our site after any changes are posted constitutes your acceptance of the updated policy.
      </Text>
    ),
  },
  {
    title: "Contact Information",
    content: (
      <Text className="text-sm leading-7 text-[#5e554e]">
        If you have questions about this policy or how we handle your information, please{" "}
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

export default function PrivacyPolicyPage() {
  return (
    <div className="w-full bg-[#f8f6f2]">
      <div className="mx-auto max-w-3xl px-6 py-16 sm:px-8">
        <Heading level="h1" className="text-center text-2xl text-[#b6742a] sm:text-3xl">
          Privacy Policy
        </Heading>
        <Text className="mt-4 text-center text-sm leading-7 text-[#5e554e]">
          This policy explains how {SITE_NAME} collects, uses, and protects your information when you use our site.
        </Text>
        <div className="mt-10">
          <AccordionSection items={sections} />
        </div>
      </div>
    </div>
  )
}
