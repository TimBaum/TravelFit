import UserAccountForm from "@/components/UserAccountForm";
import { NavigationMenuUser } from "@/components/ui/navigation-menu";
import '@/styles/CreateUserAccount.css';

function CreateUserAccount() {
  return (
    <>
      <NavigationMenuUser />
      <h1 className="centered-headline">Create your user account</h1>
      <div className="container">
        <div className="form-container">
          <UserAccountForm />
        </div>
      </div>
    </>
  );
}

export default CreateUserAccount;