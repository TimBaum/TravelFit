import UserAccountForm from '@/components/UserAccountForm'
import { Button } from '@/components/ui/button'
import { useNavigate } from 'react-router-dom'

function CreateUserAccount() {
  const navigate = useNavigate()
  return (
    <>
      <h1 className="mb-2 font-bold text-5xl">Create your account</h1>
      <div className="max-w-lg mx-auto">
        <div className="bg-gray-300 p-10">
          <UserAccountForm />
        </div>
        <div className="flex-1 ml-5">
          <div className="flex justify-between items-center mt-5">
            <p>Already have an account?</p>
            <Button variant="outline" onClick={() => navigate('/login')}>
              Log in
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}

export default CreateUserAccount
