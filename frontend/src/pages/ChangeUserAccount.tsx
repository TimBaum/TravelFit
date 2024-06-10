import { Button } from '@/components/ui/button'
import { config } from '@/config'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import ChangeUserAccountForm from '@/components/ChangeUserAccountForm'

async function updateUserAccount(id: string, userData: string) {
  try {
    const response = await fetch(config.BACKEND_URL + '/users/update/' + id, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    })

    if (!response.ok) {
      throw new Error('Failed to update user')
    }

    const data = await response.json()
    console.log('User updated successfully:', data)
  } catch (error) {
    console.error('Error updating user:', error)
  }
}

function ChangeUserAccount() {
  return (
    <>
      <h1 className="centered-headline">Account</h1>
      <Tabs defaultValue="account" className="w-[400px]">
        <TabsList>
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="subscription">Subscription</TabsTrigger>
        </TabsList>
        <TabsContent value="account">
          <ChangeUserAccountForm />
        </TabsContent>
        <TabsContent value="subscription">
          <div className="subscription-box">
            <p>Active subscription</p>
            <p>TravelFit basic</p>
            <p>free</p>
            <p>Pay via PayPal:</p>
            <Button
              type="submit"
              variant="outline"
              className="mt-4 bg-primary"
              onClick={() => updateUserAccount('', '')}
            >
              Get TravelFit Premium for 2,99€/month
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </>
  )
}

export default ChangeUserAccount
