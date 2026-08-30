const checklistItems = [
  "Direct Trade",
  "Small-Batch Roasted",
  "Roasted to Order",
  "Freshly Shipped",
]

export const TestedPill = () => {
  return (
    <span className="inline-flex w-fit items-center rounded-full border border-[#8f5a1f] bg-[#8f5a1f] px-3 py-1 text-xs font-bold uppercase tracking-wide text-white">
      Freshly Roasted
    </span>
  )
}

export const QualityChecklist = () => {
  return (
    <ul className="flex flex-wrap gap-2">
      {checklistItems.map((item) => (
        <li
          key={item}
          className="inline-flex items-center gap-1 rounded-full border border-[#8f5a1f] bg-[#8f5a1f] px-3 py-1 text-sm font-semibold text-white"
        >
          <span aria-hidden="true">✓</span>
          {item}
        </li>
      ))}
    </ul>
  )
}
