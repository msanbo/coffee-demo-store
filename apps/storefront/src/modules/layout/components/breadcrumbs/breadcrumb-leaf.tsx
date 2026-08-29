// Appends the final breadcrumb segment for a product/category/collection
// detail page, styled to continue the shared Breadcrumbs bar seamlessly.
// Takes the real title as a prop instead of re-fetching it, so it's
// correct in server-rendered HTML on first paint - see the comment on
// Breadcrumbs for why this can't just be part of that shared component.
const BreadcrumbLeaf = ({ label }: { label: string }) => {
  return (
    <div className="flex w-full justify-center border-b border-ui-border-base bg-[#f8f6f2] py-3">
      <div className="flex items-center gap-2 text-sm text-[#5e554e]">
        <span className="text-[#c9bda9]">/</span>
        <span className="font-medium text-[#b6742a]">{label}</span>
      </div>
    </div>
  )
}

export default BreadcrumbLeaf
