"use client"

import { useEffect, useState } from "react"

import { sdk } from "@lib/config"
import { HttpTypes } from "@medusajs/types"
import clsx from "clsx"

type CategoryFilterProps = {
  selectedCategoryIds: string[]
  setCategoryIds: (categoryIds: string[]) => void
}

const CategoryFilter = ({
  selectedCategoryIds,
  setCategoryIds,
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
