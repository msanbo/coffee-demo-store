const checklistItems = [
  ">98% Purity",
  "Research Grade",
  "COA Verified",
  "Third-Party Tested",
]

export const TestedPill = () => {
  return (
    <span className="inline-flex w-fit items-center rounded-full border border-[#b6742a] bg-[#b6742a] px-3 py-1 text-xs font-bold uppercase tracking-wide text-white">
      Third Party Tested
    </span>
  )
}

export const QualityChecklist = () => {
  return (
    <ul className="flex flex-wrap gap-2">
      {checklistItems.map((item) => (
        <li
          key={item}
          className="inline-flex items-center gap-1 rounded-full border border-[#b6742a] bg-[#b6742a] px-3 py-1 text-sm font-semibold text-white"
        >
          <span aria-hidden="true">✓</span>
          {item}
        </li>
      ))}
    </ul>
  )
}
