import GymAccountForm from '@/components/GymAccountForm'
import { Button } from '@/components/ui/button'
import { Megaphone, Star, Users } from 'lucide-react'

function CreateGymAccount() {
  return (
    <>
      <h1 className="mb-2 font-bold text-5xl">Create your partner account</h1>
      <div className="flex m-5">
        <div className="flex flex-col items-center justify-center bg-gray-300 mr-5 flex-1">
          <div className="flex flex-col items-center">
            <Users size={80} />
            <p className="text-center">Attract a broad audience</p>
          </div>
          <div className="flex flex-col items-center mt-4">
            <Megaphone size={80} />
            <p className="text-center">
              Spread information about offers and subscriptions
            </p>
          </div>
          <div className="flex flex-col items-center mt-4">
            <Star size={80} />
            <p className="text-center">
              Stand out with fitting offers for travellers
            </p>
          </div>
        </div>
        <div className="flex-1 ml-5">
          <GymAccountForm />
          <div className="flex justify-between items-center mt-5">
            <p>Already a partner?</p>
            <Button type="submit" variant="outline">
              Log in as partner
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}

export default CreateGymAccount
