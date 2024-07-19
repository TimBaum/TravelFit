import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import ChangeUserAccountForm from '@/components/ChangeUserAccountForm'
import PayPalButton from '@/components/PayPalButton'
import { useAuth } from '@/provider/AuthProvider'
import { Button } from '@/components/ui/button'
import { cancelSubscription } from '@/services/subscriptionService'
import { useState } from 'react'
import { Crown } from 'lucide-react'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbList,
} from '@/components/ui/breadcrumb'

function ChangeUserAccount() {
  const { hasActiveSubscription, checkSubscriptionStatus } = useAuth()
  const [isLoading, setIsLoading] = useState(false)

  return (
    <div>
      <div className="breadcrumps">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />

            <BreadcrumbItem>
              <BreadcrumbLink href="">My account</BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <h1 className="mb-2 font-bold text-5xl">My account</h1>
      <Tabs defaultValue="account" className="w-full">
        <TabsList>
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="subscription">Subscription</TabsTrigger>
        </TabsList>
        <TabsContent value="account" className="w-full">
          <div className="border rounded-lg p-4">
            <ChangeUserAccountForm />
          </div>
        </TabsContent>
        <TabsContent value="subscription" className="w-full">
          <div className="text-center border rounded-lg p-4">
            <p className="text-2xl font-bold mb-4">Active subscription</p>
            <div className="flex justify-center items-baseline w-full">
              {hasActiveSubscription ? (
                <div>
                  <div className="text-3xl font-bold gap-2 flex items-center justify-center border p-2 rounded-lg">
                    <Crown size={48} className="text-yellow-500" />
                    <span>TravelFitPremium</span>
                    <Crown size={48} className="text-yellow-500" />
                  </div>
                  <p className="text-xl mb-4 text-xs">
                    Monthly payments of 2,99€ via PayPal
                  </p>
                  <Button
                    variant={isLoading ? 'loading' : 'outline'}
                    onClick={async () => {
                      setIsLoading(true)
                      await cancelSubscription().finally(
                        checkSubscriptionStatus,
                      )
                      setIsLoading(false)
                    }}
                  >
                    Cancel your subscription
                  </Button>
                </div>
              ) : (
                <div>
                  <div className="p-4 text-3xl font-bold mb-6 border border-gray-300 rounded-lg">
                    <span className="flex items-center gap-2">
                      TravelFit Basic{' '}
                      <span className="text-gray-500 text-2xl">free</span>
                    </span>
                  </div>
                  <p className="text-xs">
                    Switch to{' '}
                    <Crown className="text-yellow-500 inline align-middle" />
                    TravelFit Premium
                    <Crown className="text-yellow-500 inline align-middle" />{' '}
                    for only 2,99€ per month to remove all ads by clicking the
                    PayPal-button below!
                  </p>
                  <PayPalButton />
                </div>
              )}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default ChangeUserAccount
