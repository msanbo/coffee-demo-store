"use client"

import React, { useEffect, useActionState } from "react"
import AccountInfo from "../account-info"
import { HttpTypes } from "@medusajs/types"
import { requestPasswordReset } from "@lib/data/customer"

type MyInformationProps = {
  customer: HttpTypes.StoreCustomer
}

const ProfilePassword: React.FC<MyInformationProps> = ({ customer }) => {
  const [successState, setSuccessState] = React.useState(false)

  const sendResetLink = async () => {
    return requestPasswordReset(customer.email)
  }

  const [state, formAction] = useActionState(sendResetLink, {
    error: null as string | null,
    success: false,
  })

  const clearState = () => {
    setSuccessState(false)
  }

  useEffect(() => {
    setSuccessState(state.success)
  }, [state])

  return (
    <form
      action={formAction}
      onReset={() => clearState()}
      className="w-full"
    >
      <AccountInfo
        label="Password"
        currentInfo={
          <span>The password is not shown for security reasons</span>
        }
        isSuccess={successState}
        isError={!!state.error}
        errorMessage={state.error || undefined}
        successMessage={`Reset link sent to ${customer.email}`}
        clearState={clearState}
        data-testid="account-password-editor"
      >
        <p className="text-small-regular text-ui-fg-subtle">
          We&apos;ll email a link to {customer.email} to set a new password.
        </p>
      </AccountInfo>
    </form>
  )
}

export default ProfilePassword
