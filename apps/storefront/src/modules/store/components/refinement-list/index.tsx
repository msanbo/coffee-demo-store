"use client"

import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useCallback, useMemo } from "react"

import {
  OPTION_VALUE_QUERY_KEY,
  parseOptionValueIds,
} from "@lib/util/product-option-filters"
import { CATEGORY_QUERY_KEY, parseCategoryIds } from "@lib/util/category-filters"
import CategoryFilter from "./category-filter"
import OptionsPicker from "./options-picker"
import { SortOptions } from "./sort-products"

type RefinementListProps = {
  sortBy: SortOptions
  search?: boolean
  hideOptionsPicker?: boolean
  hideCategoryFilter?: boolean
  "data-testid"?: string
}

const RefinementList = ({
  hideOptionsPicker = false,
  hideCategoryFilter = false,
}: RefinementListProps) => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const updateQueryParams = useCallback(
    (updater: (params: URLSearchParams) => void) => {
      const params = new URLSearchParams(searchParams.toString())
      updater(params)

      params.delete("page")

      const queryString = params.toString()
      const currentQuery = searchParams.toString()
      const nextPath = queryString ? `${pathname}?${queryString}` : pathname
      const currentPath = currentQuery
        ? `${pathname}?${currentQuery}`
        : pathname

      if (nextPath !== currentPath) {
        router.push(nextPath)
      }
    },
    [pathname, router, searchParams]
  )

  const selectedOptionValueIds = useMemo(
    () => parseOptionValueIds(searchParams),
    [searchParams]
  )

  const setOptionValueIds = (valueIds: string[]) =>
    updateQueryParams((params) => {
      params.delete(OPTION_VALUE_QUERY_KEY)
      valueIds.forEach((valueId) =>
        params.append(OPTION_VALUE_QUERY_KEY, valueId)
      )
    })

  const selectedCategoryIds = useMemo(
    () => parseCategoryIds(searchParams),
    [searchParams]
  )

  const setCategoryIds = (categoryIds: string[]) =>
    updateQueryParams((params) => {
      params.delete(CATEGORY_QUERY_KEY)
      categoryIds.forEach((categoryId) =>
        params.append(CATEGORY_QUERY_KEY, categoryId)
      )
    })

  return (
    <div className="flex flex-col gap-12 py-4 mb-8 small:px-0 pl-6 small:min-w-[250px] small:ml-[1.675rem]">
      {!hideCategoryFilter && (
        <CategoryFilter
          selectedCategoryIds={selectedCategoryIds}
          setCategoryIds={setCategoryIds}
        />
      )}
      {!hideOptionsPicker && (
        <OptionsPicker
          selectedValueIds={selectedOptionValueIds}
          setOptionValueIds={setOptionValueIds}
        />
      )}
    </div>
  )
}

export default RefinementList
