import UserAccountForm from '@/components/UserAccountForm'
import '@/styles/CreateUserAccount.css'

function CreateUserAccount() {
  return (
    <>
      <h1 className="centered-headline">Create your user account</h1>
      <div className="container">
        <div className="form-container">
          <UserAccountForm />
        </div>
      </div>
    </>
  )
}

export default CreateUserAccount
