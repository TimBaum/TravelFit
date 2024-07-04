import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import ChangeUserAccountForm from '@/components/ChangeUserAccountForm'
import PayPalButton from '@/components/PayPalButton'
import { useAuth } from '@/provider/AuthProvider'
import { Button } from '@/components/ui/button'
import { cancelSubscription } from '@/services/subscriptionService'
import { useState } from 'react'

function ChangeGymAccount() {
  const { hasActiveSubscription, checkSubscriptionStatus } = useAuth()
  const [isLoading, setIsLoading] = useState(false)

  const hasPremium = hasActiveSubscription ?? false

  return (
    <>
      <h1 className="mb-2 font-bold text-5xl">Account</h1>
      <Tabs defaultValue="account" className="w-[400px]">
        <TabsList>
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="subscription">Subscription</TabsTrigger>
        </TabsList>
        <TabsContent value="account">
          <ChangeUserAccountForm />
        </TabsContent>
        <TabsContent value="subscription">
          <div className="p-6 m-6 text-center">
            <p className="text-2xl font-bold mb-4">Active subscription</p>
            <div className="flex justify-center items-baseline">
              <p className="p-4 text-3xl font-bold">
                {hasActiveSubscription ? (
                  'TravelFit Premium'
                ) : (
                  <span className="flex items-center gap-2">
                    TravelFit basic{' '}
                    <span className="text-gray-500 text-2xl">free</span>
                  </span>
                )}
              </p>
            </div>
            <p className="text-xl mb-4">Pay via PayPal:</p>
            {hasPremium ? (
              <Button
                variant={isLoading ? 'loading' : 'outline'}
                onClick={async () => {
                  setIsLoading(true)
                  await cancelSubscription().finally(checkSubscriptionStatus)
                  setIsLoading(false)
                }}
              >
                Cancel your subscription
              </Button>
            ) : (
              <PayPalButton />
            )}
          </div>
        </TabsContent>
      </Tabs>
    </>
  )
}

export default ChangeGymAccount
