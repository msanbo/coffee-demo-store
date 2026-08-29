import { Heading, Text } from "@modules/common/components/ui"

const trustPoints = [
  {
    title: "Directly Sourced",
    description:
      "We buy directly from growers and co-ops we know by name, at prices that reflect the quality of the lot - not through blind auction.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-8 w-8 text-[#b6742a]">
        <path
          d="M12 2s6 6.5 6 11a6 6 0 1 1-12 0c0-4.5 6-11 6-11Z"
          stroke="currentColor"
          strokeWidth="1.5"
        />
      </svg>
    ),
  },
  {
    title: "Small-Batch Roasted",
    description:
      "Every batch is roasted to order in small drum runs, so we can dial in each origin instead of running one profile for everything.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-8 w-8 text-[#b6742a]">
        <circle cx="12" cy="13" r="7" stroke="currentColor" strokeWidth="1.5" />
        <path d="M9 4c0 1.2.8 1.8.8 3S9 8.8 9 10M13 4c0 1.2.8 1.8.8 3S13 8.8 13 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    title: "Shipped Fresh",
    description:
      "Bags go out within days of roasting, not months - with the roast date printed right on the label so you always know what you're getting.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-8 w-8 text-[#b6742a]">
        <rect x="3" y="8" width="13" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
        <path d="M16 11h3l2 3v4h-5v-7Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
        <circle cx="7.5" cy="19" r="1.5" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="17.5" cy="19" r="1.5" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    ),
  },
]

const TrustSection = () => {
  return (
    <div className="w-full border-y border-ui-border-base bg-[#f8f6f2]">
      <div className="mx-auto max-w-7xl px-6 py-16 sm:px-8 lg:px-12">
        <div className="grid gap-6 md:grid-cols-3">
          {trustPoints.map((point) => (
            <div
              key={point.title}
              className="flex flex-col items-center rounded-3xl border border-[#e6dccf] bg-white p-8 text-center shadow-sm"
            >
              {point.icon}
              <Heading level="h3" className="mt-4 text-xl text-[#1f1a17]">
                {point.title}
              </Heading>
              <Text className="mt-3 text-sm leading-7 text-[#5e554e]">
                {point.description}
              </Text>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default TrustSection
