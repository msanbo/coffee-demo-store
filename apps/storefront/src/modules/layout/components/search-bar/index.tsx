"use client"

import { FormEvent, useState } from "react"
import { useParams, useRouter, useSearchParams } from "next/navigation"

import MagnifyingGlassMini from "@modules/common/icons/magnifying-glass-mini"

const SearchBar = () => {
  const searchParams = useSearchParams()
  const [value, setValue] = useState(searchParams.get("q") ?? "")
  const router = useRouter()
  const { countryCode } = useParams()

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    const query = value.trim()
    router.push(
      `/${countryCode}/store${query ? `?q=${encodeURIComponent(query)}` : ""}`
    )
  }

  return (
    <form onSubmit={handleSubmit} className="relative flex items-center">
      <MagnifyingGlassMini className="pointer-events-none absolute left-3 text-white/70" />
      <input
        type="search"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Type to start searching..."
        className="w-56 rounded-full border border-white/30 bg-white/10 py-2 pl-9 pr-3 text-sm text-white placeholder-white/70 outline-none focus:border-white"
      />
    </form>
  )
}

export default SearchBar
