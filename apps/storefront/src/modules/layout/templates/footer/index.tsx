import Image from "next/image";

import { SITE_NAME } from "@lib/constants";
import { Text } from "@modules/common/components/ui";
import LocalizedClientLink from "@modules/common/components/localized-client-link";

export default async function Footer() {
  return (
    <footer className="w-full bg-[#2b1c14]">
      <div className="content-container flex w-full flex-col items-center gap-y-6 py-12">
        <LocalizedClientLink href="/" className="flex items-center gap-2 hover:opacity-80">
          <Image
            src="/logo-mark.png"
            alt=""
            width={40}
            height={40}
            className="h-10 w-10"
          />
          <span className="font-semibold tracking-tight text-white">{SITE_NAME}</span>
        </LocalizedClientLink>

        <nav className="flex flex-wrap items-center justify-center gap-x-2 gap-y-2 text-white">
          <LocalizedClientLink className="hover:text-white/80" href="/">
            Home
          </LocalizedClientLink>
          <span className="text-white/50">|</span>
          <LocalizedClientLink className="hover:text-white/80" href="/why-us">
            Why Us
          </LocalizedClientLink>
          <span className="text-white/50">|</span>
          <LocalizedClientLink className="hover:text-white/80" href="/store">
            Shop All
          </LocalizedClientLink>
          <span className="text-white/50">|</span>
          <LocalizedClientLink className="hover:text-white/80" href="/contact">
            Contact
          </LocalizedClientLink>
          <span className="text-white/50">|</span>
          <LocalizedClientLink
            className="hover:text-white/80"
            href="/account"
            data-testid="footer-account-link"
          >
            Account
          </LocalizedClientLink>
          <span className="text-white/50">|</span>
          <LocalizedClientLink
            className="hover:text-white/80"
            href="/cart"
            data-testid="footer-cart-link"
          >
            Cart
          </LocalizedClientLink>
        </nav>

        <nav className="flex flex-wrap items-center justify-center gap-x-2 gap-y-2 text-white">
          <LocalizedClientLink className="hover:text-white/80" href="/privacy-policy">
            Privacy Policy
          </LocalizedClientLink>
          <span className="text-white/50">|</span>
          <LocalizedClientLink className="hover:text-white/80" href="/terms">
            Terms
          </LocalizedClientLink>
        </nav>

        <Text className="txt-compact-small text-white">
          © {new Date().getFullYear()} {SITE_NAME} All rights reserved.
        </Text>
      </div>
    </footer>
  );
}
