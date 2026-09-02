"use server"

import { sdk } from "@lib/config"
import { OptionValueIds } from "@lib/util/product-option-filters"
import { sortProducts } from "@lib/util/sort-products"
import { HttpTypes } from "@medusajs/types"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import { getAuthHeaders, getCacheOptions } from "./cookies"
import { getRegion, retrieveRegion } from "./regions"

type ProductListQueryParams = (HttpTypes.FindParams &
  HttpTypes.StoreProductListParams) & {
  options?: string[]
  option_value_id?: string | string[]
}

export const listProducts = async ({
  pageParam = 1,
  queryParams,
  countryCode,
  regionId,
}: {
  pageParam?: number
  queryParams?: ProductListQueryParams
  countryCode?: string
  regionId?: string
}): Promise<{
  response: { products: HttpTypes.StoreProduct[]; count: number }
  nextPage: number | null
  queryParams?: ProductListQueryParams
}> => {
  if (!countryCode && !regionId) {
    throw new Error("Country code or region ID is required")
  }

  const limit = queryParams?.limit || 12
  const _pageParam = Math.max(pageParam, 1)
  const offset = _pageParam === 1 ? 0 : (_pageParam - 1) * limit

  let region: HttpTypes.StoreRegion | undefined | null

  if (countryCode) {
    region = await getRegion(countryCode)
  } else {
    region = await retrieveRegion(regionId!)
  }

  if (!region) {
    return {
      response: { products: [], count: 0 },
      nextPage: null,
    }
  }

  const headers = {
    ...(await getAuthHeaders()),
  }

  // Per-visitor tag from getCacheOptions lets a visitor's own actions bust
  // their own cached view. "products-global" is a second, fixed tag that
  // isn't scoped to any visitor, so the /api/revalidate route (triggered by
  // the backend on any product-variant.updated event, e.g. a price change)
  // can invalidate this fetch for everyone at once.
  const cacheOptions = await getCacheOptions("products")
  const next = {
    ...cacheOptions,
    tags: [...(cacheOptions.tags ?? []), "products-global"],
  }

  return sdk.client
    .fetch<{ products: HttpTypes.StoreProduct[]; count: number }>(
      `/store/products`,
      {
        method: "GET",
        query: {
          limit,
          offset,
          region_id: region?.id,
          fields:
            "*variants.calculated_price,+variants.inventory_quantity,*variants.images,*variants.options,+metadata,+tags,+categories.name,+categories.handle",
          ...queryParams,
        },
        headers,
        next,
        cache: "force-cache",
      }
    )
    .then(({ products, count }) => {
      const nextPage = count > offset + limit ? pageParam + 1 : null

      return {
        response: {
          products,
          count,
        },
        nextPage: nextPage,
        queryParams,
      }
    })
}

// Bounds the in-memory price-sort fetch below. A catalog past this size
// needs real server-side price sorting, not this approach - see the comment
// in listProductsWithSort.
const MAX_SORTABLE_PRODUCTS = 1000

/**
 * Returns one page of products for sortBy. created_at is sorted and
 * paginated by Medusa directly. price_asc/price_desc can't be, since
 * calculated price isn't a plain sortable column - those fetch every
 * matching product, sort in memory, then paginate the sorted array.
 */
export const listProductsWithSort = async ({
  page = 1,
  queryParams,
  sortBy = "created_at",
  countryCode,
  optionValueIds,
}: {
  page?: number
  queryParams?: ProductListQueryParams
  sortBy?: SortOptions
  countryCode: string
  optionValueIds?: OptionValueIds
}): Promise<{
  response: { products: HttpTypes.StoreProduct[]; count: number }
  nextPage: number | null
  queryParams?: ProductListQueryParams
}> => {
  const limit = queryParams?.limit || 12
  const optionFilters = Array.from(
    new Set((optionValueIds || []).filter(Boolean))
  )
  const filterParams = {
    ...queryParams,
    ...(optionFilters.length ? { option_value_id: optionFilters } : {}),
  }

  if (sortBy === "created_at") {
    return listProducts({
      pageParam: page,
      queryParams: { ...filterParams, order: "-created_at", limit },
      countryCode,
    })
  }

  // price_asc / price_desc: Medusa can't sort by calculated price at the
  // database level (it's computed per region/currency from price rules,
  // not a plain column), so this has to fetch every matching product,
  // sort them all in memory, then paginate the sorted array itself.
  // Fetching only the first N and sorting just those - the previous
  // approach, capped at 100 - is correct only as long as a filter matches
  // fewer than N products, and silently wrong past that: the actual
  // cheapest/priciest match beyond the cutoff would never be fetched, so
  // it would never appear "first" no matter how it's sorted.
  const {
    response: { products, count },
  } = await listProducts({
    pageParam: 1,
    queryParams: { ...filterParams, limit: MAX_SORTABLE_PRODUCTS },
    countryCode,
  })

  const sortedProducts = sortProducts(products, sortBy)
  const pageParam = (page - 1) * limit
  const paginatedProducts = sortedProducts.slice(pageParam, pageParam + limit)
  const nextPage = count > pageParam + limit ? page + 1 : null

  return {
    response: {
      products: paginatedProducts,
      count,
    },
    nextPage,
    queryParams,
  }
}
