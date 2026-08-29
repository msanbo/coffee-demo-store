"use client"

import { useState } from "react"

import { HttpTypes } from "@medusajs/types"
import { Container } from "@modules/common/components/ui"
import ChevronDown from "@modules/common/icons/chevron-down"
import Image from "next/image"

type ImageGalleryProps = {
  images: HttpTypes.StoreProductImage[]
}

const ImageGallery = ({ images }: ImageGalleryProps) => {
  const [current, setCurrent] = useState(0)

  if (!images.length) {
    return null
  }

  const hasMultiple = images.length > 1
  const image = images[current]

  const goPrev = () =>
    setCurrent((i) => (i === 0 ? images.length - 1 : i - 1))
  const goNext = () =>
    setCurrent((i) => (i === images.length - 1 ? 0 : i + 1))

  return (
    <div className="flex flex-col flex-1 gap-y-4">
      <Container
        className="relative aspect-[29/34] w-full overflow-hidden bg-ui-bg-subtle"
        id={image.id}
      >
        {!!image.url && (
          <Image
            src={image.url}
            priority={current === 0}
            className="absolute inset-0 rounded-rounded"
            alt={`Product image ${current + 1}`}
            fill
            sizes="(max-width: 576px) 280px, (max-width: 768px) 360px, (max-width: 992px) 480px, 800px"
            style={{
              objectFit: "cover",
            }}
          />
        )}

        {hasMultiple && (
          <>
            <button
              type="button"
              onClick={goPrev}
              aria-label="Previous image"
              className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center justify-center h-9 w-9 rounded-full bg-white/80 text-ui-fg-base hover:bg-white transition-colors"
            >
              <ChevronDown className="rotate-90" />
            </button>
            <button
              type="button"
              onClick={goNext}
              aria-label="Next image"
              className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center justify-center h-9 w-9 rounded-full bg-white/80 text-ui-fg-base hover:bg-white transition-colors"
            >
              <ChevronDown className="-rotate-90" />
            </button>
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-black/50 px-2.5 py-1 text-xs text-white">
              {current + 1} / {images.length}
            </div>
          </>
        )}
      </Container>
    </div>
  )
}

export default ImageGallery
