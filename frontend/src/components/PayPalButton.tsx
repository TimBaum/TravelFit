import { useAuth } from '@/provider/AuthProvider'
import { createSubscription } from '@/services/subscriptionService'
import { PayPalSubscription } from '@models/payment'
import {
  PayPalButtons,
  PayPalButtonsComponentProps,
  PayPalScriptProvider,
  ReactPayPalScriptOptions,
} from '@paypal/react-paypal-js'
import toast from 'react-hot-toast'

function PayPalButton() {
  const { checkSubscriptionStatus } = useAuth()

  const initialOptions: ReactPayPalScriptOptions = {
    clientId:
      'Adbt4h3JnCf1oIYv4VfOITWXa78GBDcWpWCwgAA9eB6vqTcpeWXGLuGVNYX_wEhpZRqZJ1qQq0Bt0txM',
    intent: 'subscription',
    vault: true,
  }

  const onApprove: PayPalButtonsComponentProps['onApprove'] = async (
    _data,
    actions,
  ) => {
    if (!actions.subscription) throw new Error('Subscription not active')
    return actions.subscription
      .get()
      .then(async function (details) {
        if (
          details.id &&
          details.create_time &&
          details.status &&
          details.status === 'ACTIVE'
        ) {
          await createSubscription(details as PayPalSubscription) // weird typescript behavior requires explicit cast
          checkSubscriptionStatus()
          toast.success('Subscription created')
        } else throw new Error('Subscription not active')
      })
      .catch((error) => {
        console.error('Error creating subscription:', error)
      })
  }

  return (
    <PayPalScriptProvider options={initialOptions}>
      <PayPalButtons
        className="mt-6"
        createSubscription={(_data, actions) => {
          return actions.subscription
            .create({
              plan_id: 'P-5NT356891H3510226MZ64P4I',
            })
            .then(async (res) => {
              await checkSubscriptionStatus()
              return res
            })
            .catch(async (error) => {
              await checkSubscriptionStatus()
              return error
            })
        }}
        onApprove={onApprove}
        style={{
          layout: 'horizontal',
          shape: 'rect',
          color: 'blue',
          label: 'paypal',
        }}
      />
    </PayPalScriptProvider>
  )
}

export default PayPalButton
