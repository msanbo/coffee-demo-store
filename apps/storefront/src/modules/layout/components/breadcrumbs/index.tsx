"use client"

import { useEffect, useState } from "react"
import { usePathname, useParams } from "next/navigation"

import { sdk } from "@lib/config"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

const STATIC_LABELS: Record<string, string> = {
  store: "Shop",
  categories: "Shop",
  products: "Shop",
  collections: "Collections",
  "why-us": "Why Us",
  coa: "COA",
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

const Breadcrumbs = () => {
  const pathname = usePathname()
  const { countryCode } = useParams()
  const [dynamicLabel, setDynamicLabel] = useState<string | null>(null)

  const withoutCountry =
    typeof countryCode === "string"
      ? pathname.replace(`/${countryCode}`, "")
      : pathname
  const segments = withoutCountry.split("/").filter(Boolean)

  useEffect(() => {
    setDynamicLabel(null)

    if (segments.length < 2) {
      return
    }

    const section = segments[segments.length - 2]
    const handle = segments[segments.length - 1]

    if (!DYNAMIC_PARENTS.has(section)) {
      return
    }

    let cancelled = false

    const resolve = async () => {
      try {
        if (section === "categories") {
          const res = await sdk.client.fetch<{
            product_categories?: { name: string }[]
          }>("/store/product-categories", {
            method: "GET",
            query: { handle, limit: 1 },
          })
          if (!cancelled) {
            setDynamicLabel(res.product_categories?.[0]?.name ?? titleCase(handle))
          }
        } else if (section === "products") {
          const res = await sdk.client.fetch<{ products?: { title: string }[] }>(
            "/store/products",
            { method: "GET", query: { handle, limit: 1 } }
          )
          if (!cancelled) {
            setDynamicLabel(res.products?.[0]?.title ?? titleCase(handle))
          }
        } else if (section === "collections") {
          const res = await sdk.client.fetch<{
            collections?: { title: string }[]
          }>("/store/collections", {
            method: "GET",
            query: { handle, limit: 1 },
          })
          if (!cancelled) {
            setDynamicLabel(res.collections?.[0]?.title ?? titleCase(handle))
          }
        }
      } catch {
        if (!cancelled) {
          setDynamicLabel(titleCase(handle))
        }
      }
    }

    resolve()

    return () => {
      cancelled = true
    }
  }, [pathname])

  if (segments.length === 0) {
    return null
  }

  const crumbs: { label: string; href: string }[] = [{ label: "Home", href: "/" }]

  segments.forEach((segment, index) => {
    const isLast = index === segments.length - 1
    const prevSegment = index > 0 ? segments[index - 1] : null

    if (isLast && prevSegment && DYNAMIC_PARENTS.has(prevSegment)) {
      crumbs.push({ label: dynamicLabel ?? titleCase(segment), href: "" })
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
