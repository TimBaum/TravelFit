import GymAccountForm from "@/components/GymAccountForm";
import { Button } from "@/components/ui/button";
import { NavigationMenuGym } from "@/components/ui/navigation-menu";

function CreateGymAccount() {
    return (
      <>
      <NavigationMenuGym/>
        <h1>Create your partner account</h1>
        <p>Attract a broad audience</p>
        <p>Spread information about offers and subscriptions</p>
        <p>Stand out with fitting offers for travellers</p>
        <GymAccountForm />
        <p>Already a partner?</p>
        <Button type="submit">Log in as partner</Button>
      </>
    )
  }
  
  export default CreateGymAccount
  