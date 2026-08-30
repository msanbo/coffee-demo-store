"use client"

import { usePathname, useParams } from "next/navigation"

import BreadcrumbBar, { Crumb, HOME_CRUMB } from "./breadcrumb-bar"

const STATIC_LABELS: Record<string, string> = {
  store: "Shop",
  categories: "Shop",
  products: "Shop",
  collections: "Collections",
  "why-us": "Why Us",
  account: "Account",
  cart: "Cart",
  orders: "Orders",
  addresses: "Addresses",
  profile: "Profile",
}

// Segments that don't have their own listing page - point the crumb at the
// shop instead of a URL that would 404.
const HREF_OVERRIDE: Record<string, string> = {
  categories: "/store",
  products: "/store",
  collections: "/store",
}

const DYNAMIC_PARENTS = new Set(["categories", "products", "collections"])

const titleCase = (value: string) =>
  value
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")

// Renders Home / Shop, Home / Collections, etc for every page EXCEPT a
// product/category/collection detail page. Those need the real title
// (not a guessed URL slug) as the final crumb, which this shared,
// pathname-only component has no way to know - so on a detail page it
// renders nothing, and the page's own template (which already has the
// real title as a prop) renders the whole trail itself, in one line,
// via BreadcrumbBar. That avoids both a client fetch (which would leave
// the wrong title on first paint) and a second, separately-styled bar
// stacked underneath this one.
const Breadcrumbs = () => {
  const pathname = usePathname()
  const { countryCode } = useParams()

  const withoutCountry =
    typeof countryCode === "string"
      ? pathname.replace(`/${countryCode}`, "")
      : pathname
  const segments = withoutCountry.split("/").filter(Boolean)

  if (segments.length === 0) {
    return null
  }

  if (segments.length > 1 && DYNAMIC_PARENTS.has(segments[0])) {
    return null
  }

  const crumbs: Crumb[] = [HOME_CRUMB]

  segments.forEach((segment, index) => {
    const isLast = index === segments.length - 1
    const label = STATIC_LABELS[segment] ?? titleCase(segment)
    const href =
      HREF_OVERRIDE[segment] ?? "/" + segments.slice(0, index + 1).join("/")
    crumbs.push({ label, href: isLast ? undefined : href })
  })

  return <BreadcrumbBar crumbs={crumbs} />
}

export default Breadcrumbs
