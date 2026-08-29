import React from "react"

import { IconProps } from "types/icon"

const ExclamationCircleSolid: React.FC<IconProps> = ({
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
        <path
          d="M7.5.389C3.58.389.389 3.579.389 7.5s3.19 7.111 7.111 7.111 7.111-3.19 7.111-7.111S11.421.389 7.5.389m-.667 3.939a.667.667 0 0 1 1.334 0v3.679a.667.667 0 0 1-1.334 0zm.667 7.098a.89.89 0 0 1 0-1.778.89.89 0 0 1 0 1.778"
          fill={color}
        />
      </g>
      <defs>
        <clipPath id="a">
          <path fill="#fff" d="M0 0h15v15H0z" />
        </clipPath>
      </defs>
    </svg>
  )
}

export default ExclamationCircleSolid
