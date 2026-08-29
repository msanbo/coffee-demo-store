import { HttpTypes } from "@medusajs/types"

type MyInformationProps = {
  customer: HttpTypes.StoreCustomer
}

const ProfileEmail: React.FC<MyInformationProps> = ({ customer }) => {
  return (
    <div className="text-small-regular" data-testid="account-email-editor">
      <div className="flex items-end justify-between">
        <div className="flex flex-col">
          <span className="uppercase text-ui-fg-base">Email</span>
          <div className="flex items-center flex-1 basis-0 justify-end gap-x-4">
            <span className="font-semibold" data-testid="current-info">
              {customer.email}
            </span>
          </div>
        </div>
      </div>
      <p className="text-ui-fg-subtle text-small-regular pt-2">
        Contact support to change the email on your account.
      </p>
    </div>
  )
}

export default ProfileEmail
