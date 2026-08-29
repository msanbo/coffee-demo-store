import { ReactNode } from "react"

import { HttpTypes } from "@medusajs/types"
import { Heading } from "@modules/common/components/ui"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { QualityChecklist, TestedPill } from "@modules/products/components/trust-badges"

type ProductInfoProps = {
  product: HttpTypes.StoreProduct
  actions?: ReactNode
}

const ProductInfo = ({ product, actions }: ProductInfoProps) => {
  return (
    <div id="product-info">
      <div className="flex flex-col gap-y-4 lg:max-w-[500px] mx-auto">
        {product.collection && (
          <LocalizedClientLink
            href={`/collections/${product.collection.handle}`}
            className="text-medium text-ui-fg-muted hover:text-ui-fg-subtle"
          >
            {product.collection.title}
          </LocalizedClientLink>
        )}
        <Heading
          level="h2"
          className="text-3xl leading-10 text-ui-fg-base"
          data-testid="product-title"
        >
          {product.title}
        </Heading>

        <TestedPill />

        {!!(product.metadata?.origin || product.metadata?.roast_level) && (
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-small-regular text-ui-fg-subtle">
            {!!product.metadata?.origin && (
              <span>
                Origin:{" "}
                <span className="font-semibold text-ui-fg-base">
                  {product.metadata.origin as string}
                </span>
              </span>
            )}
            {!!product.metadata?.roast_level && (
              <span>
                Roast:{" "}
                <span className="font-semibold text-ui-fg-base">
                  {product.metadata.roast_level as string}
                </span>
              </span>
            )}
          </div>
        )}

        {actions}

        {product.description && (
          <div
            className="text-medium text-ui-fg-subtle [&_p]:mb-3 last:[&_p]:mb-0 [&_strong]:text-ui-fg-base [&_strong]:font-semibold [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:mb-3 [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:mb-3 [&_li]:mb-1"
            data-testid="product-description"
            dangerouslySetInnerHTML={{ __html: product.description }}
          />
        )}

        <QualityChecklist />
      </div>
    </div>
  )
}

export default ProductInfo
