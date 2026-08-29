"use client"

import { FormEvent, useState } from "react"

type Status = "idle" | "submitting" | "success" | "error"

const ContactForm = () => {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState("")
  const [status, setStatus] = useState<Status>("idle")
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setStatus("submitting")
    setErrorMessage(null)

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data?.error || "Something went wrong. Please try again.")
      }

      setStatus("success")
      setName("")
      setEmail("")
      setMessage("")
    } catch (error) {
      setStatus("error")
      setErrorMessage(
        error instanceof Error ? error.message : "Something went wrong. Please try again."
      )
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-2xl border border-[#b6742a] bg-[#f3e6d3] p-6 text-center">
        <p className="text-sm font-medium text-[#b6742a]">
          Thanks for reaching out — we&apos;ll get back to you soon.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div>
        <label htmlFor="contact-name" className="text-sm font-medium text-[#1f1a17]">
          Name
        </label>
        <input
          id="contact-name"
          type="text"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-1 w-full rounded-xl border border-[#e6dccf] px-4 py-2 text-sm text-[#1f1a17] outline-none focus:border-[#b6742a]"
        />
      </div>
      <div>
        <label htmlFor="contact-email" className="text-sm font-medium text-[#1f1a17]">
          Email
        </label>
        <input
          id="contact-email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-1 w-full rounded-xl border border-[#e6dccf] px-4 py-2 text-sm text-[#1f1a17] outline-none focus:border-[#b6742a]"
        />
      </div>
      <div>
        <label htmlFor="contact-message" className="text-sm font-medium text-[#1f1a17]">
          Message
        </label>
        <textarea
          id="contact-message"
          required
          rows={5}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="mt-1 w-full rounded-xl border border-[#e6dccf] px-4 py-2 text-sm text-[#1f1a17] outline-none focus:border-[#b6742a]"
        />
      </div>

      {status === "error" && errorMessage && (
        <p className="text-sm text-red-600">{errorMessage}</p>
      )}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="mt-2 inline-flex items-center justify-center rounded-full bg-[#b6742a] px-6 py-3 text-sm font-medium text-white transition hover:bg-[#8f5a1f] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {status === "submitting" ? "Sending..." : "Send message"}
      </button>
    </form>
  )
}

export default ContactForm
