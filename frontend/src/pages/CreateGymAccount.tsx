import GymAccountForm from '@/components/GymAccountForm'
import { Button } from '@/components/ui/button'
import { Megaphone, Star, Users } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Separator } from '@/components/ui/separator'

function CreateGymAccount() {
  const navigate = useNavigate()
  return (
    <div>
      <h1 className="text-5xl font-bold mb-6 text-center">
        Create your partner account
      </h1>
      <div className="flex w-full justify-between gap-8">
        <div className="border border-dashed rounded p-10 pt-4 flex flex-col gap-4 w-full border-primary">
          <img src="src/assets/illustrations/RollerbladeDoodle.svg" />
          <div className="font-bold">Grow your business with TravelFit</div>
          <div>Attract a broader audience</div>
          <div>Spread information about offers and subscriptions</div>
          <div>Stand out with suitable offers for travellers</div>
        </div>
        <div className="w-full flex flex-col justify-between">
          <GymAccountForm />
          <div>
            <Separator className="my-4" />
            <div className="flex justify-between items-center">
              <i>Already a partner?</i>
              <Button variant="outline" onClick={() => navigate('/login')}>
                Log in as partner
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CreateGymAccount
