import Image from "next/image"

import { Heading, Text } from "@modules/common/components/ui"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

const Hero = () => {
  return (
    <div className="w-full border-b border-ui-border-base bg-[#f8f6f2]">
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 px-6 py-16 sm:px-8 lg:grid-cols-2 lg:px-12">
        <div className="flex flex-col items-start">
          <span className="inline-flex w-fit rounded-full border border-[#b6742a] bg-white px-3 py-1 text-sm font-medium text-[#b6742a]">
            Small-batch roasted, shipped fresh
          </span>
          <Heading level="h1" className="mt-6 max-w-xl text-4xl leading-tight text-[#1f1a17] sm:text-5xl">
            Coffee roasted in small batches, shipped the week it's roasted.
          </Heading>
          <Text className="mt-5 max-w-xl text-lg leading-8 text-[#5e554e]">
            Single-origin lots and house blends, roasted to order and shipped within days - not sitting on a warehouse shelf for months before it reaches you.
          </Text>
          <div className="mt-8 flex flex-wrap gap-3">
            <LocalizedClientLink
              href="/store"
              className="inline-flex items-center justify-center rounded-full bg-[#b6742a] px-6 py-3 text-sm font-medium text-white transition hover:bg-[#8f5a1f]"
            >
              Shop coffee
            </LocalizedClientLink>
            <LocalizedClientLink
              href="/why-us"
              className="inline-flex items-center justify-center rounded-full border border-[#b6742a] bg-white px-6 py-3 text-sm font-medium text-[#b6742a] transition hover:bg-[#f3e6d3]"
            >
              Why Amber Hour
            </LocalizedClientLink>
          </div>
        </div>

        <Image
          src="/hero-coffee.jpg"
          alt="Freshly roasted coffee beans, a bag of coffee, and a steaming cup on a wooden table."
          width={1536}
          height={1024}
          className="h-auto w-full rounded-3xl"
        />
      </div>
    </div>
  )
}

export default Hero
