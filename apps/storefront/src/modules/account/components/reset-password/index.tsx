"use client"

import { useActionState } from "react"
import { useSearchParams } from "next/navigation"
import Input from "@modules/common/components/input"
import { Button } from "@modules/common/components/ui"
import ErrorMessage from "@modules/checkout/components/error-message"
import { SubmitButton } from "@modules/checkout/components/submit-button"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { requestPasswordReset, resetPassword } from "@lib/data/customer"

type ActionState = { success: boolean; error: string | null }

const initialState: ActionState = { success: false, error: null }

const RequestForm = () => {
  const requestLink = async (
    _state: ActionState,
    formData: FormData
  ): Promise<ActionState> => {
    const email = formData.get("email") as string
    return requestPasswordReset(email)
  }

  const [state, formAction] = useActionState(requestLink, initialState)

  if (state.success) {
    return (
      <div
        className="max-w-sm w-full flex flex-col items-center text-center gap-y-4"
        data-testid="reset-password-requested"
      >
        <h1 className="text-large-semi uppercase">Check your email</h1>
        <p className="text-base-regular text-ui-fg-base">
          If an account exists for that email, we&apos;ve sent a link to
          reset your password. The link expires in 15 minutes.
        </p>
      </div>
    )
  }

  return (
    <form
      action={formAction}
      className="max-w-sm w-full flex flex-col items-center"
      data-testid="reset-password-request-form"
    >
      <h1 className="text-large-semi uppercase mb-6">Reset your password</h1>
      <p className="text-center text-base-regular text-ui-fg-base mb-8">
        Enter your email and we&apos;ll send you a link to reset your
        password.
      </p>
      <div className="flex flex-col w-full gap-y-2">
        <Input
          label="Email"
          name="email"
          type="email"
          autoComplete="email"
          required
          data-testid="email-input"
        />
      </div>
      <ErrorMessage error={state.error} data-testid="reset-password-error" />
      <SubmitButton data-testid="send-reset-link-button" className="w-full mt-6">
        Send reset link
      </SubmitButton>
    </form>
  )
}

const ConfirmForm = ({ token }: { token: string }) => {
  const submitNewPassword = async (
    _state: ActionState,
    formData: FormData
  ): Promise<ActionState> => {
    const newPassword = formData.get("new_password") as string
    const confirmPassword = formData.get("confirm_password") as string

    if (newPassword !== confirmPassword) {
      return { success: false, error: "Passwords do not match" }
    }

    return resetPassword(token, newPassword)
  }

  const [state, formAction] = useActionState(submitNewPassword, initialState)

  if (state.success) {
    return (
      <div
        className="max-w-sm w-full flex flex-col items-center text-center gap-y-4"
        data-testid="reset-password-success"
      >
        <h1 className="text-large-semi uppercase">Password updated</h1>
        <p className="text-base-regular text-ui-fg-base">
          Your password has been changed. You can now sign in with your new
          password.
        </p>
        <LocalizedClientLink href="/account">
          <Button variant="primary">Go to sign in</Button>
        </LocalizedClientLink>
      </div>
    )
  }

  return (
    <form
      action={formAction}
      className="max-w-sm w-full flex flex-col items-center"
      data-testid="reset-password-confirm-form"
    >
      <h1 className="text-large-semi uppercase mb-6">Choose a new password</h1>
      <div className="flex flex-col w-full gap-y-2">
        <Input
          label="New password"
          name="new_password"
          type="password"
          required
          data-testid="new-password-input"
        />
        <Input
          label="Confirm password"
          name="confirm_password"
          type="password"
          required
          data-testid="confirm-password-input"
        />
      </div>
      <ErrorMessage error={state.error} data-testid="reset-password-error" />
      {state.error && (
        <p className="text-center text-small-regular text-ui-fg-subtle mt-2">
          Reset links expire after 15 minutes and can only be used once.{" "}
          <LocalizedClientLink href="/reset-password" className="underline">
            Request a new one
          </LocalizedClientLink>
          .
        </p>
      )}
      <SubmitButton data-testid="reset-password-button" className="w-full mt-6">
        Reset password
      </SubmitButton>
    </form>
  )
}

const ResetPassword = () => {
  const searchParams = useSearchParams()
  const token = searchParams.get("token")

  return token ? <ConfirmForm token={token} /> : <RequestForm />
}

export default ResetPassword
