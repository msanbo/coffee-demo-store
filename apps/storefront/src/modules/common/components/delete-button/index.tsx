import { deleteLineItem } from "@lib/data/cart"
import ErrorMessage from "@modules/checkout/components/error-message"
import Spinner from "@modules/common/icons/spinner"
import Trash from "@modules/common/icons/trash"
import { clx } from "@modules/common/components/ui"
import { useState } from "react"

const DeleteButton = ({
  id,
  children,
  className,
}: {
  id: string
  children?: React.ReactNode
  className?: string
}) => {
  const [isDeleting, setIsDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleDelete = async (id: string) => {
    setError(null)
    setIsDeleting(true)
    await deleteLineItem(id)
      .catch((err) => {
        setError(err.message)
      })
      .finally(() => {
        setIsDeleting(false)
      })
  }

  return (
    <div
      className={clx(
        "flex flex-col text-small-regular",
        className
      )}
    >
      <div className="flex items-center justify-between">
        <button
          className="flex gap-x-1 text-ui-fg-subtle hover:text-ui-fg-base cursor-pointer"
          onClick={() => handleDelete(id)}
        >
          {isDeleting ? <Spinner className="animate-spin" /> : <Trash />}
          <span>{children}</span>
        </button>
      </div>
      <ErrorMessage error={error} data-testid="delete-error-message" />
    </div>
  )
}

export default DeleteButton
