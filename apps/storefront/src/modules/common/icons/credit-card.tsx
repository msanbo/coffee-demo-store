import React from "react"

import { IconProps } from "types/icon"

const CreditCard: React.FC<IconProps> = ({
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
      <g
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        clipPath="url(#a)"
      >
        <path d="M1.056 5.944h12.888M2.833 12.167h9.334c.982 0 1.777-.796 1.777-1.778V4.61c0-.982-.796-1.778-1.777-1.778H2.833c-.981 0-1.777.796-1.777 1.778v5.778c0 .982.796 1.778 1.777 1.778M3.278 9.5h2.666M10.833 9.5h.89" />
      </g>
      <defs>
        <clipPath id="a">
          <path fill="#fff" d="M0 0h15v15H0z" />
        </clipPath>
      </defs>
    </svg>
  )
}

export default CreditCard
