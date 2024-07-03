import UserAccountForm from '@/components/UserAccountForm'

function CreateUserAccount() {
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
        </div>
      </div>
    </div>
  )
}

export default CreateUserAccount
