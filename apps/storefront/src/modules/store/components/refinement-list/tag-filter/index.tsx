"use client"

import { useEffect, useState } from "react"

import { sdk } from "@lib/config"
import { HttpTypes } from "@medusajs/types"
import clsx from "clsx"

type TagFilterProps = {
  selectedTagIds: string[]
  setTagIds: (tagIds: string[]) => void
}

const TagFilter = ({ selectedTagIds, setTagIds }: TagFilterProps) => {
  const [tags, setTags] = useState<HttpTypes.StoreProductTag[]>([])

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const response = await sdk.client.fetch<{
          product_tags?: HttpTypes.StoreProductTag[]
        }>("/store/product-tags", {
          method: "GET",
          query: {
            fields: "id,value",
            limit: 100,
          },
        })

        setTags(response?.product_tags || [])
      } catch (error) {
        console.error("Failed to fetch product tags", error)
      }
    }

    fetchTags()
  }, [])

  if (!tags.length) {
    return null
  }

  const toggleTag = (tagId: string) => {
    const isSelected = selectedTagIds.includes(tagId)
    const nextSelections = isSelected
      ? selectedTagIds.filter((id) => id !== tagId)
      : [...selectedTagIds, tagId]

    setTagIds(Array.from(new Set(nextSelections)))
  }

  return (
    <div className="flex flex-col gap-y-4">
      <span className="txt-compact-small-plus text-ui-fg-subtle px-1">
        Roast &amp; Process
      </span>
      <div className="flex flex-wrap gap-2 pr-6">
        {tags.map((tag) => {
          const isSelected = selectedTagIds.includes(tag.id)

          return (
            <button
              key={tag.id}
              onClick={() => toggleTag(tag.id)}
              className={clsx(
                "border-ui-border-base border text-small-regular h-10 rounded-rounded px-3 flex items-center transition-colors duration-150",
                {
                  "border-ui-border-interactive text-ui-fg-base": isSelected,
                  "text-ui-fg-muted hover:text-ui-fg-base": !isSelected,
                }
              )}
              aria-pressed={isSelected}
            >
              {tag.value}
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default TagFilter
