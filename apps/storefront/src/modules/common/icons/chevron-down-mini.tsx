import React from "react"

import { IconProps } from "types/icon"

const ChevronDownMini: React.FC<IconProps> = ({
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
      <g clipPath="url(#a)">
        <g clipPath="url(#b)">
          <path
            d="M13.056 5.278 7.5 10.833 1.944 5.278"
            stroke={color}
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>
      </g>
      <defs>
        <clipPath id="a">
          <path fill="#fff" d="M0 0h15v15H0z" />
        </clipPath>
        <clipPath id="b">
          <path fill="#fff" d="M-.5-.5h16v16h-16z" />
        </clipPath>
      </defs>
    </svg>
  )
}

export default ChevronDownMini
