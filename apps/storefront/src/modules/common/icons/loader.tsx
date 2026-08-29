import React from "react"

import { IconProps } from "types/icon"

const Loader: React.FC<IconProps> = ({
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
        <path d="m2.943 2.943 1.571 1.571" />
        <path d="M1.055 7.5h2.223" opacity="0.88" />
        <path d="m2.943 12.057 1.571-1.572" opacity="0.75" />
        <path d="M7.5 13.945v-2.222" opacity="0.63" />
        <path d="m12.057 12.057-1.572-1.571" opacity="0.5" />
        <path d="M13.945 7.5h-2.222" opacity="0.38" />
        <path d="m12.057 2.943-1.572 1.571" opacity="0.25" />
        <path d="M7.5 1.055v2.222" opacity="0.13" />
      </g>
      <defs>
        <clipPath id="a">
          <path fill="#fff" d="M0 0h15v15H0z" />
        </clipPath>
      </defs>
    </svg>
  )
}

export default Loader
