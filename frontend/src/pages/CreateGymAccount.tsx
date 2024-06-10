import GymAccountForm from '@/components/GymAccountForm'
import { Button } from '@/components/ui/button'
import '@/styles/CreateGymAccount.css'
import { Megaphone, Star, Users } from 'lucide-react'

function CreateGymAccount() {
  return (
    <>
      <h1 className="mb-2 font-bold text-5xl">Create your partner account</h1>
      <div className="container">
        <div className="info-box">
          <Users size={80} />
          <p>Attract a broad audience</p>
          <Megaphone size={80} />
          <p>Spread information about offers and subscriptions</p>
          <Star size={80} />
          <p>Stand out with fitting offers for travellers</p>
        </div>
        <div className="form-container">
          <GymAccountForm />
          <div className="already-partner">
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
