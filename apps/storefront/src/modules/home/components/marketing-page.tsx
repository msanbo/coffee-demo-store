import { Heading, Text } from "@modules/common/components/ui"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

type Highlight = {
  title: string
  description: string
}

type Stat = {
  value: string
  label: string
}

type MarketingPageProps = {
  eyebrow: string
  title: string
  intro: string
  highlights: Highlight[]
  stats?: Stat[]
  ctaHref?: string
  ctaLabel?: string
  secondaryHref?: string
  secondaryLabel?: string
}

export default function MarketingPage({
  eyebrow,
  title,
  intro,
  highlights,
  stats,
  ctaHref = "/store",
  ctaLabel = "Shop now",
  secondaryHref,
  secondaryLabel,
}: MarketingPageProps) {
  return (
    <div className="w-full bg-[#f8f6f2]">
      <section className="mx-auto max-w-7xl px-6 py-16 lg:py-24">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
          <div className="space-y-6">
            <span className="inline-flex rounded-full border border-[#b6742a] bg-white px-3 py-1 text-sm font-medium text-[#8f5a1f]">
              {eyebrow}
            </span>
            <Heading level="h1" className="text-4xl leading-tight text-[#1f1a17] sm:text-5xl">
              {title}
            </Heading>
            <Text className="max-w-2xl text-lg leading-8 text-[#5e554e]">
              {intro}
            </Text>
            <div className="flex flex-wrap gap-3">
              <LocalizedClientLink
                href={ctaHref}
                className="inline-flex items-center justify-center rounded-full bg-[#8f5a1f] px-6 py-3 text-sm font-medium text-white transition hover:bg-[#653f16]"
              >
                {ctaLabel}
              </LocalizedClientLink>
              {secondaryHref && secondaryLabel && (
                <LocalizedClientLink
                  href={secondaryHref}
                  className="inline-flex items-center justify-center rounded-full border border-[#b6742a] bg-white px-6 py-3 text-sm font-medium text-[#8f5a1f] transition hover:bg-[#f3e6d3]"
                >
                  {secondaryLabel}
                </LocalizedClientLink>
              )}
            </div>
          </div>

          <div className="rounded-3xl border border-[#e6dccf] bg-white p-8 shadow-sm">
            {stats && stats.length > 0 ? (
              <div className="grid gap-4 sm:grid-cols-2">
                {stats.map((stat) => (
                  <div key={stat.label} className="rounded-2xl bg-[#f8f6f2] p-4">
                    <div className="text-2xl font-semibold text-[#8f5a1f]">
                      {stat.value}
                    </div>
                    <div className="mt-1 text-sm text-[#5e554e]">{stat.label}</div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-2xl bg-[#f8f6f2] p-6 text-sm text-[#5e554e]">
                Science-led formulas, transparent ingredients, and fast delivery.
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-20">
        <div className="grid gap-6 md:grid-cols-3">
          {highlights.map((highlight) => (
            <div
              key={highlight.title}
              className="rounded-3xl border border-[#e6dccf] bg-white p-6 shadow-sm"
            >
              <Heading level="h3" className="text-xl text-[#1f1a17]">
                {highlight.title}
              </Heading>
              <Text className="mt-3 text-sm leading-7 text-[#5e554e]">
                {highlight.description}
              </Text>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
