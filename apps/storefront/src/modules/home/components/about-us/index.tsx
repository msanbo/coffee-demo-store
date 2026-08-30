import { SITE_NAME } from "@lib/constants"
import { Heading, Text } from "@modules/common/components/ui"

const AboutUs = () => {
  return (
    <div className="w-full bg-white">
      <div className="mx-auto max-w-4xl px-6 py-16 text-center sm:px-8">
        <Heading level="h2" className="text-2xl text-[#8f5a1f] sm:text-3xl">
          About Us
        </Heading>
        <Text className="mt-4 text-base leading-7 text-[#5e554e]">
          {SITE_NAME} works directly with growers to source coffee we're genuinely excited about, then roasts it in small batches close to the day it ships. No middlemen buying blind lots, no beans sitting in a warehouse for a year before they reach a cup.
        </Text>
        <Text className="mt-4 text-base leading-7 text-[#5e554e]">
          Every bag lists the origin, process, and roast date - because coffee this fresh deserves to say so.
        </Text>
      </div>
    </div>
  )
}

export default AboutUs
