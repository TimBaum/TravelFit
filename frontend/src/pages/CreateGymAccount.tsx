import GymAccountForm from "@/components/GymAccountForm"
import { Button } from "@/components/ui/button"
import { NavigationMenuGym } from "@/components/ui/navigation-menu"
import '@/styles/CreateGymAccount.css'

function CreateGymAccount() {
    return (
      <>
      <NavigationMenuGym/>
      <div className="container">
        <div className="info-box">
        <h1>Create your partner account</h1>
        <p>Attract a broad audience</p>
        <p>Spread information about offers and subscriptions</p>
        <p>Stand out with fitting offers for travellers</p>
        </div>
        <div className="form-container">
        <GymAccountForm />
        <div className="already-partner">
        <p>Already a partner?</p>
        <Button type="submit">Log in as partner</Button>
      </div>
      </div>
      </div>
      </>
    )
  }
  
  export default CreateGymAccount  