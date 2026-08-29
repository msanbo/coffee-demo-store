"use client"

import { usePathname, useParams } from "next/navigation"

import LocalizedClientLink from "@modules/common/components/localized-client-link"

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

// Renders the "trunk" only (Home / Shop, Home / Collections, etc). The
// final segment for a product/category/collection page needs real data
// (the actual title, not a guess off the URL slug) that this
// shared-across-every-page component has no way to know - it's rendered
// once in the root layout, above where Next.js resolves the page's own
// [handle] param, so it can't read that data without a client-side
// fetch. A client fetch just moves the problem: the real title would
// still be missing from server-rendered HTML and from the very first
// paint, and a titleCase(slug) fallback is often wrong (acronyms,
// unusual capitalization). Instead, BreadcrumbLeaf (rendered by each
// product/category/collection template, which already has the real
// title as a prop) appends the correct final segment, styled to
// continue this bar seamlessly.
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

  const crumbs: { label: string; href: string }[] = [{ label: "Home", href: "/" }]

  segments.forEach((segment, index) => {
    const isLast = index === segments.length - 1
    const prevSegment = index > 0 ? segments[index - 1] : null

    // The final segment under a dynamic parent (product/category/
    // collection detail pages) is rendered by BreadcrumbLeaf instead -
    // skip it here entirely.
    if (isLast && prevSegment && DYNAMIC_PARENTS.has(prevSegment)) {
      return
    }

    if (DYNAMIC_PARENTS.has(segment)) {
      crumbs.push({ label: STATIC_LABELS[segment], href: HREF_OVERRIDE[segment] })
      return
    }

    const label = STATIC_LABELS[segment] ?? titleCase(segment)
    const href = "/" + segments.slice(0, index + 1).join("/")
    crumbs.push({ label, href: isLast ? "" : href })
  })

  return (
    <nav
      aria-label="Breadcrumb"
      className="flex w-full justify-center border-b border-ui-border-base bg-[#f8f6f2] py-3"
    >
      <ol className="flex items-center gap-2 text-sm text-[#5e554e]">
        {crumbs.map((crumb, index) => {
          const isLast = index === crumbs.length - 1

          return (
            <li key={`${crumb.label}-${index}`} className="flex items-center gap-2">
              {index > 0 && <span className="text-[#c9bda9]">/</span>}
              {isLast || !crumb.href ? (
                <span className="font-medium text-[#b6742a]">{crumb.label}</span>
              ) : (
                <LocalizedClientLink
                  href={crumb.href}
                  className="hover:text-[#b6742a]"
                >
                  {crumb.label}
                </LocalizedClientLink>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}

export default Breadcrumbs
