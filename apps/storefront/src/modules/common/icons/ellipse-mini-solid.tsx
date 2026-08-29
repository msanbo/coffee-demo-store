import React from "react"

import { IconProps } from "types/icon"

const EllipseMiniSolid: React.FC<IconProps> = ({
  size = "15",
  color = "currentColor",
  ...attributes
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 15 15"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...attributes}
    >
      <circle cx="7.5" cy="7.5" r="2" fill={color} />
    </svg>
  )
}

export default EllipseMiniSolid
