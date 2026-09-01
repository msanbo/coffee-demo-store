import { Metadata } from "next"

import { parseOptionValueIds } from "@lib/util/product-option-filters"
import { parseCategoryIds } from "@lib/util/category-filters"
import { parseTagIds } from "@lib/util/tag-filters"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import StoreTemplate from "@modules/store/templates"
import { SITE_NAME } from "@lib/constants"

const title = `Coffee | ${SITE_NAME}`
const description =
  "Shop small-batch roasted coffee from Amber Hour Coffee Co. - house blends, single-origin roasts, and cold brew, shipped fresh."

export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    title,
    description,
    images: ["/banner.webp"],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/banner.webp"],
  },
}

type StorePageSearchParams = Record<string, string | string[] | undefined> & {
  sortBy?: SortOptions
  page?: string
  optionValueIds?: string | string[]
  categoryId?: string | string[]
  q?: string
}

type Params = {
  searchParams: Promise<StorePageSearchParams>
  params: Promise<{
    countryCode: string
  }>
}

export default async function StorePage(props: Params) {
  const params = await props.params;
  const searchParams = await props.searchParams;
  const { sortBy, page, q } = searchParams
  const optionValueIds = parseOptionValueIds(searchParams)
  const categoryIds = parseCategoryIds(searchParams)
  const tagIds = parseTagIds(searchParams)

  return (
    <StoreTemplate
      sortBy={sortBy}
      page={page}
      countryCode={params.countryCode}
      optionValueIds={optionValueIds}
      categoryIds={categoryIds}
      tagIds={tagIds}
      q={q}
    />
  )
}
