import { sdk } from "@lib/config"
import { HttpTypes } from "@medusajs/types"
import { getCacheOptions } from "./cookies"

export const listCategories = async (query?: Record<string, unknown>) => {
  const next = {
    ...(await getCacheOptions("categories")),
  }

  const limit = query?.limit || 100

  return sdk.client
    .fetch<{ product_categories: HttpTypes.StoreProductCategory[] }>(
      "/store/product-categories",
      {
        query: {
          // Both callers (the nav dropdown, and generateStaticParams) only
          // need id/name/handle and whether a category has a parent - not
          // the full category tree or every field of every product in
          // every category. The nav dropdown renders on every route via
          // the root layout, so anything heavier here gets serialized to
          // the client and re-parsed on every single page load.
          fields: "id,name,handle,parent_category.id",
          limit,
          ...query,
        },
        next,
        cache: "force-cache",
      }
    )
    .then(({ product_categories }) => product_categories)
}

export const getCategoryByHandle = async (categoryHandle: string[]) => {
  const handle = `${categoryHandle.join("/")}`

  const next = {
    ...(await getCacheOptions("categories")),
  }

  return sdk.client
    .fetch<HttpTypes.StoreProductCategoryListResponse>(
      `/store/product-categories`,
      {
        query: {
          // CategoryTemplate only reads id/name/handle/description, the
          // immediate category_children's id/name/handle, a parent chain
          // (walked for breadcrumbs) up to two levels up, and products.id
          // (just for its .length, as a skeleton-count fallback) - not
          // every field of every product in the category, which is the
          // same oversized-payload problem fixed in listCategories above.
          fields:
            "id,name,handle,description,products.id," +
            "category_children.id,category_children.name,category_children.handle," +
            "parent_category.id,parent_category.name,parent_category.handle," +
            "parent_category.parent_category.id,parent_category.parent_category.name,parent_category.parent_category.handle",
          handle,
        },
        next,
        cache: "force-cache",
      }
    )
    .then(({ product_categories }) => product_categories[0])
}
