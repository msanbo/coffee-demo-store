"use client"

import { useEffect, useState } from "react"

import { sdk } from "@lib/config"
import { HttpTypes } from "@medusajs/types"
import clsx from "clsx"

type CategoryFilterProps = {
  selectedCategoryIds: string[]
  setCategoryIds: (categoryIds: string[]) => void
  // Set on a category's own page (e.g. /categories/single-origin-roasts),
  // where the category is fixed by the route rather than the query
  // string. Toggling a *different* category here wouldn't do anything -
  // this page only ever fetches products for its own route category - so
  // in that mode the current category renders as selected and every
  // other option is disabled instead of silently doing nothing on click.
  currentCategoryId?: string
}

const CategoryFilter = ({
  selectedCategoryIds,
  setCategoryIds,
  currentCategoryId,
}: CategoryFilterProps) => {
  const [categories, setCategories] = useState<
    HttpTypes.StoreProductCategory[]
  >([])

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await sdk.client.fetch<{
          product_categories?: HttpTypes.StoreProductCategory[]
        }>("/store/product-categories", {
          method: "GET",
          query: {
            fields: "id,name,handle,parent_category",
            limit: 100,
          },
        })

        setCategories(
          (response?.product_categories || []).filter(
            (c) => !c.parent_category
          )
        )
      } catch (error) {
        console.error("Failed to fetch categories", error)
      }
    }

    fetchCategories()
  }, [])

  if (!categories.length) {
    return null
  }

  const toggleCategory = (categoryId: string) => {
    const isSelected = selectedCategoryIds.includes(categoryId)
    const nextSelections = isSelected
      ? selectedCategoryIds.filter((id) => id !== categoryId)
      : [...selectedCategoryIds, categoryId]

    setCategoryIds(Array.from(new Set(nextSelections)))
  }

  return (
    <div className="flex flex-col gap-y-4">
      <span className="txt-compact-small-plus text-ui-fg-subtle px-1">
        Category
      </span>
      <div className="flex flex-wrap gap-2 pr-6">
        {categories.map((category) => {
          if (currentCategoryId) {
            const isCurrent = category.id === currentCategoryId

            return (
              <button
                key={category.id}
                disabled={!isCurrent}
                className={clsx(
                  "border text-small-regular h-10 rounded-rounded px-3 flex items-center",
                  {
                    "border-ui-border-interactive text-ui-fg-base": isCurrent,
                    "border-ui-border-base text-ui-fg-disabled cursor-not-allowed opacity-50":
                      !isCurrent,
                  }
                )}
                aria-current={isCurrent ? "page" : undefined}
              >
                {category.name}
              </button>
            )
          }

          const isSelected = selectedCategoryIds.includes(category.id)

          return (
            <button
              key={category.id}
              onClick={() => toggleCategory(category.id)}
              className={clsx(
                "border-ui-border-base border text-small-regular h-10 rounded-rounded px-3 flex items-center transition-colors duration-150",
                {
                  "border-ui-border-interactive text-ui-fg-base": isSelected,
                  "text-ui-fg-muted hover:text-ui-fg-base": !isSelected,
                }
              )}
              aria-pressed={isSelected}
            >
              {category.name}
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default CategoryFilter
