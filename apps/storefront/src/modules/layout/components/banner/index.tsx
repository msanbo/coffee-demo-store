import Image from "next/image"

import { SITE_NAME } from "@lib/constants"

const Banner = () => {
  return (
    <div className="w-full">
      <Image
        src="/banner.webp"
        alt={SITE_NAME}
        width={1936}
        height={544}
        priority
        sizes="100vw"
        className="h-auto w-full"
      />
    </div>
  )
}

export default Banner
