import { Heading, Text } from "@modules/common/components/ui"

type PlaceholderPageProps = {
  title: string
}

const PlaceholderPage = ({ title }: PlaceholderPageProps) => {
  return (
    <div className="w-full bg-white">
      <div className="mx-auto max-w-3xl px-6 py-24 text-center sm:px-8">
        <Heading level="h1" className="text-2xl text-[#8f5a1f] sm:text-3xl">
          {title}
        </Heading>
        <Text className="mt-4 text-base leading-7 text-[#5e554e]">
          This page is being finalized. Check back soon.
        </Text>
      </div>
    </div>
  )
}

export default PlaceholderPage
