"use client"

import { Disclosure, DisclosureButton, DisclosurePanel } from "@headlessui/react"

import ChevronDownMini from "@modules/common/icons/chevron-down-mini"
import { clx } from "@modules/common/components/ui"

export type AccordionItem = {
  title: string
  content: React.ReactNode
}

const AccordionSection = ({ items }: { items: AccordionItem[] }) => {
  return (
    <div className="divide-y divide-[#e6dccf] rounded-3xl border border-[#e6dccf] bg-white">
      {items.map((item) => (
        <Disclosure key={item.title} as="div" className="px-6">
          {({ open }) => (
            <>
              <DisclosureButton className="flex w-full items-center justify-between gap-4 py-5 text-left">
                <span className="text-base font-semibold text-[#1f1a17]">
                  {item.title}
                </span>
                <ChevronDownMini
                  className={clx(
                    "shrink-0 text-[#b6742a] transition-transform duration-150",
                    { "rotate-180": open }
                  )}
                />
              </DisclosureButton>
              <DisclosurePanel className="pb-5 text-sm leading-7 text-[#5e554e]">
                {item.content}
              </DisclosurePanel>
            </>
          )}
        </Disclosure>
      ))}
    </div>
  )
}

export default AccordionSection
