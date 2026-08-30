import LocalizedClientLink from "@modules/common/components/localized-client-link"

export type Crumb = { label: string; href?: string }

export const HOME_CRUMB: Crumb = { label: "Home", href: "/" }

// Single-line breadcrumb bar. Every crumb with an href is a real link
// except the last one (the current page), which renders as plain text.
const BreadcrumbBar = ({ crumbs }: { crumbs: Crumb[] }) => {
  return (
    <nav
      aria-label="Breadcrumb"
      className="flex w-full justify-center border-b border-ui-border-base bg-[#f8f6f2] py-3"
    >
      <ol className="flex flex-wrap items-center gap-2 text-sm text-[#5e554e]">
        {crumbs.map((crumb, index) => {
          const isLast = index === crumbs.length - 1

          return (
            <li key={`${crumb.label}-${index}`} className="flex items-center gap-2">
              {index > 0 && <span className="text-[#c9bda9]">/</span>}
              {isLast || !crumb.href ? (
                <span className="font-medium text-[#8f5a1f]">{crumb.label}</span>
              ) : (
                <LocalizedClientLink href={crumb.href} className="hover:text-[#8f5a1f]">
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

export default BreadcrumbBar
