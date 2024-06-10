import UserAccountForm from '@/components/UserAccountForm'
import '@/styles/CreateUserAccount.css'

function CreateUserAccount() {
  return (
    <>
      <h1 className="mb-2 font-bold text-5xl">Create your user account</h1>
      <div className="items-center">
        <div className="bg-gray-300 p-10">
          <UserAccountForm />
        </div>
      </div>
    </>
  )
}

export default CreateUserAccount
