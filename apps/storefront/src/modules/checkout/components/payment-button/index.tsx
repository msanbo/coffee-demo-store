"use client"

import { isHostedRedirect, isManual, isStripeLike } from "@lib/constants"
import { checkCartOrder, clearCompletedCart, placeOrder } from "@lib/data/cart"
import { HttpTypes } from "@medusajs/types"
import { Button, Text } from "@modules/common/components/ui"
import { useElements, useStripe } from "@stripe/react-stripe-js"
import React, { useEffect, useState } from "react"
import ErrorMessage from "../error-message"

type PaymentButtonProps = {
  cart: HttpTypes.StoreCart
  disabled?: boolean
  "data-testid": string
}

const PaymentButton: React.FC<PaymentButtonProps> = ({
  cart,
  disabled = false,
  "data-testid": dataTestId,
}) => {
  const notReady =
    !cart ||
    !cart.shipping_address ||
    !cart.billing_address ||
    !cart.email ||
    (cart.shipping_methods?.length ?? 0) < 1 ||
    disabled

  const paymentSession = cart.payment_collection?.payment_sessions?.[0]

  switch (true) {
    case isStripeLike(paymentSession?.provider_id):
      return (
        <StripePaymentButton
          notReady={notReady}
          cart={cart}
          data-testid={dataTestId}
        />
      )
    case isManual(paymentSession?.provider_id):
      return (
        <ManualTestPaymentButton notReady={notReady} data-testid={dataTestId} />
      )
    case isHostedRedirect(paymentSession?.provider_id):
      return (
        <HostedRedirectPaymentButton
          notReady={notReady}
          cart={cart}
          data-testid={dataTestId}
        />
      )
    default:
      return <Button disabled>Select a payment method</Button>
  }
}

// For providers where the customer pays on the provider's own hosted page
// (PayRam, BTCPay) rather than entering card details inline. The order is
// created server-side once the provider's webhook confirms payment - this
// just opens that page and polls until the order shows up.
const HostedRedirectPaymentButton = ({
  cart,
  notReady,
  "data-testid": dataTestId,
}: {
  cart: HttpTypes.StoreCart
  notReady: boolean
  "data-testid"?: string
}) => {
  const [waiting, setWaiting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const session = cart.payment_collection?.payment_sessions?.find(
    (s) => s.status === "pending"
  )
  const sessionData = session?.data as
    | { payram_payment?: { url?: string }; btc_invoice?: { checkoutLink?: string } }
    | undefined
  const checkoutUrl =
    sessionData?.payram_payment?.url ?? sessionData?.btc_invoice?.checkoutLink

  const handlePayment = () => {
    if (!checkoutUrl) {
      setErrorMessage(
        "Unable to start payment - the checkout link is missing. Try selecting the payment method again."
      )
      return
    }
    setErrorMessage(null)
    window.open(checkoutUrl, "_blank", "noopener,noreferrer")
    setWaiting(true)
  }

  useEffect(() => {
    if (!waiting) {
      return
    }

    const interval = setInterval(async () => {
      try {
        const { order_id } = await checkCartOrder(cart.id)
        if (order_id) {
          clearInterval(interval)
          // The webhook created the order server-side, so placeOrder()'s
          // cookie cleanup never ran - clear the stale cart id before
          // navigating or the completed cart keeps showing in the nav.
          await clearCompletedCart().catch(() => {})
          const countryCode =
            cart.shipping_address?.country_code?.toLowerCase()
          window.location.href = `/${countryCode}/order/${order_id}/confirmed`
        }
      } catch {
        // Transient network/API errors shouldn't interrupt polling - the
        // next tick tries again.
      }
    }, 3000)

    return () => clearInterval(interval)
  }, [waiting, cart.id, cart.shipping_address?.country_code])

  return (
    <>
      <Button
        disabled={notReady || waiting}
        onClick={handlePayment}
        size="large"
        isLoading={waiting}
        data-testid={dataTestId}
      >
        {waiting ? "Waiting for payment..." : "Pay in new tab"}
      </Button>
      <Text className="txt-small text-ui-fg-subtle text-center mt-2">
        {waiting
          ? "Complete your payment in the tab that just opened - this page updates automatically once it's confirmed. You can close that tab once you're done."
          : "Opens our secure payment partner in a new tab. Come back here when you're finished - you don't need to do anything else."}
      </Text>
      <ErrorMessage
        error={errorMessage}
        data-testid="hosted-redirect-payment-error-message"
      />
    </>
  )
}

const StripePaymentButton = ({
  cart,
  notReady,
  "data-testid": dataTestId,
}: {
  cart: HttpTypes.StoreCart
  notReady: boolean
  "data-testid"?: string
}) => {
  const [submitting, setSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const onPaymentCompleted = async () => {
    await placeOrder()
      .catch((err) => {
        setErrorMessage(err.message)
      })
      .finally(() => {
        setSubmitting(false)
      })
  }

  const stripe = useStripe()
  const elements = useElements()
  const card = elements?.getElement("card")

  const session = cart.payment_collection?.payment_sessions?.find(
    (s) => s.status === "pending"
  )

  const disabled = !stripe || !elements ? true : false

  const handlePayment = async () => {
    setSubmitting(true)

    if (!stripe || !elements || !card || !cart) {
      setSubmitting(false)
      return
    }

    await stripe
      .confirmCardPayment(session?.data.client_secret as string, {
        payment_method: {
          card: card,
          billing_details: {
            name:
              cart.billing_address?.first_name +
              " " +
              cart.billing_address?.last_name,
            address: {
              city: cart.billing_address?.city ?? undefined,
              country: cart.billing_address?.country_code ?? undefined,
              line1: cart.billing_address?.address_1 ?? undefined,
              line2: cart.billing_address?.address_2 ?? undefined,
              postal_code: cart.billing_address?.postal_code ?? undefined,
              state: cart.billing_address?.province ?? undefined,
            },
            email: cart.email,
            phone: cart.billing_address?.phone ?? undefined,
          },
        },
      })
      .then(({ error, paymentIntent }) => {
        if (error) {
          const pi = error.payment_intent

          if (
            (pi && pi.status === "requires_capture") ||
            (pi && pi.status === "succeeded")
          ) {
            onPaymentCompleted()
          }

          setErrorMessage(error.message || null)
          return
        }

        if (
          (paymentIntent && paymentIntent.status === "requires_capture") ||
          paymentIntent.status === "succeeded"
        ) {
          return onPaymentCompleted()
        }

        return
      })
  }

  return (
    <>
      <Button
        disabled={disabled || notReady}
        onClick={handlePayment}
        size="large"
        isLoading={submitting}
        data-testid={dataTestId}
      >
        Place order
      </Button>
      <ErrorMessage
        error={errorMessage}
        data-testid="stripe-payment-error-message"
      />
    </>
  )
}

const ManualTestPaymentButton = ({ notReady }: { notReady: boolean }) => {
  const [submitting, setSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const onPaymentCompleted = async () => {
    await placeOrder()
      .catch((err) => {
        setErrorMessage(err.message)
      })
      .finally(() => {
        setSubmitting(false)
      })
  }

  const handlePayment = () => {
    setSubmitting(true)

    onPaymentCompleted()
  }

  return (
    <>
      <Button
        disabled={notReady}
        isLoading={submitting}
        onClick={handlePayment}
        size="large"
        data-testid="submit-order-button"
      >
        Place order
      </Button>
      <ErrorMessage
        error={errorMessage}
        data-testid="manual-payment-error-message"
      />
    </>
  )
}

export default PaymentButton
