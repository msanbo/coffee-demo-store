import { listProducts } from "@lib/data/products"
import { HttpTypes } from "@medusajs/types"
import { Heading } from "@modules/common/components/ui"
import ProductPreview from "@modules/products/components/product-preview"

export default async function ResearchGrid({
  region,
}: {
  region: HttpTypes.StoreRegion
}) {
  const {
    response: { products },
  } = await listProducts({
    regionId: region.id,
    queryParams: {
      limit: 8,
      fields: "*variants.calculated_price",
    },
  })

  if (!products?.length) {
    return null
  }

  return (
    <div className="content-container py-16">
      <Heading level="h2" className="text-center text-2xl text-[#8f5a1f] sm:text-3xl">
        Shop the Lineup
      </Heading>
      <ul className="mt-10 grid grid-cols-2 gap-x-6 gap-y-12 small:grid-cols-3 medium:grid-cols-4">
        {products.map((product) => (
          <li key={product.id}>
            <ProductPreview product={product} region={region} isFeatured />
          </li>
        ))}
      </ul>
    </div>
  )
}
