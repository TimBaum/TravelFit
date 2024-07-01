import { PayPalSubscription } from '@models/payment'
import { fetchJSON } from './utils'

export async function createSubscription(
  subscription: PayPalSubscription,
): Promise<void> {
  return await fetchJSON('/subscriptions/create', {
    method: 'POST',
    body: JSON.stringify(subscription),
  })
}

export async function cancelSubscription(): Promise<void> {
  return await fetchJSON('/subscriptions/cancel', {
    method: 'GET',
  })
}
