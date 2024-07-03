import UserAccountForm from '@/components/UserAccountForm'
import { useNavigate } from 'react-router-dom'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'

function CreateUserAccount() {
  const navigate = useNavigate()
  return (
    <div>
      <h1 className="text-5xl font-bold mb-6 text-center">
        Create your account
      </h1>
      <div className="flex w-full justify-between gap-8">
        <div className="border border-dashed rounded p-10 pt-4 flex flex-col gap-4 w-full border-primary">
          <img src="src/assets/illustrations/RollerbladeDoodle.svg" />
          <div className="font-bold">Stay healthy during your travels</div>
          <div>Find suitable gyms for your destination</div>
          <div>Easily compare gyms </div>
          <div>Get special offers</div>
        </div>
        <div className="w-full flex flex-col justify-between">
          <UserAccountForm />
          <div>
            <Separator className="my-4" />
            <div className="flex justify-between items-center">
              <i>Already have an account?</i>
              <Button variant={'outline'} onClick={() => navigate('/login')}>
                Log in
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CreateUserAccount
