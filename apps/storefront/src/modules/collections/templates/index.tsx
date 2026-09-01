import { Suspense } from "react"

import BreadcrumbBar, { Crumb, HOME_CRUMB } from "@modules/layout/components/breadcrumbs/breadcrumb-bar"
import SkeletonProductGrid from "@modules/skeletons/templates/skeleton-product-grid"
import RefinementList from "@modules/store/components/refinement-list"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import PaginatedProducts from "@modules/store/templates/paginated-products"
import { HttpTypes } from "@medusajs/types"
import { OptionValueIds } from "@lib/util/product-option-filters"

export default function CollectionTemplate({
  sortBy,
  collection,
  page,
  countryCode,
  optionValueIds,
  tagIds,
}: {
  sortBy?: SortOptions
  collection: HttpTypes.StoreCollection
  page?: string
  countryCode: string
  optionValueIds?: OptionValueIds
  tagIds?: string[]
}) {
  const pageNumber = page ? parseInt(page) : 1
  const sort = sortBy || "created_at"

  const crumbs: Crumb[] = [
    HOME_CRUMB,
    { label: "Collections", href: "/store" },
    { label: collection.title },
  ]

  return (
    <>
      <BreadcrumbBar crumbs={crumbs} />
      <div className="flex flex-col small:flex-row small:items-start py-6 content-container">
        <RefinementList sortBy={sort} hideOptionsPicker />
      <div className="w-full small:w-3/4">
        <div className="mb-8 text-2xl-semi">
          <h1>{collection.title}</h1>
        </div>
        <Suspense
          fallback={
            <SkeletonProductGrid
              numberOfProducts={collection.products?.length}
            />
          }
        >
          <PaginatedProducts
            sortBy={sort}
            page={pageNumber}
            collectionId={collection.id}
            countryCode={countryCode}
            optionValueIds={optionValueIds}
            tagIds={tagIds}
          />
        </Suspense>
      </div>
      </div>
    </>
  )
}
