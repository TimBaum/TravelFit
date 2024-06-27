import { Request, Response } from 'express'
import Payment from '../models/Payment'
import { PayPalSubscription } from '@models/payment'

async function assertActiveSubscription(id: string): Promise<boolean> {
  return Promise.resolve(true)
}

async function createSubscription(req: Request, res: Response) {
  const ctx = req.ctx
  if (!ctx) {
    return res.status(401).json({ message: 'Unauthorized' })
  }

  const { create_time, id, status } = req.body as PayPalSubscription

  if (status !== 'ACTIVE')
    return res.status(400).json({ message: 'Subscription not active' })

  const subscription = new Payment({
    payPalId: id,
    created: new Date(create_time),
    status: 'CREATED',
  })

  try {
    await subscription.save()
    // validate with paypal that the subscription has actually been created
    const isActive = await assertActiveSubscription(id)

    // update the status of the subscription
    if (isActive) {
      await Payment.updateOne({ payPalId: id }, { status: 'ACTIVE' })
      return res.status(201)
    } else {
      await Payment.updateOne({ payPalId: id }, { status: 'CANCELLED' })
      throw new Error("Subscription wasn't created")
    }
  } catch (error) {
    return res.status(500).json({ error })
  }
}

async function cancelSubscription(req: Request, res: Response) {
  const ctx = req.ctx
  if (!ctx) {
    return res.status(401).json({ message: 'Unauthorized' })
  }

  // update the status of the subscription
  // TODO: handle differtly with ID
  await Payment.updateOne({ payPalId: req.body.id }, { status: 'CANCELLED' })
    .then(() => {
      return res.status(204)
    })
    .catch((error) => {
      return res.status(500).json({ error })
    })
}

/**
 * Intended for paypal webhooks to update the status based on changes of the subscription
 */
async function getSubscriptionUpdates(req: Request, res: Response) {
  throw new Error('Not implemented')
}

export default {
  createSubscription,
  cancelSubscription,
  getSubscriptionUpdates,
}
