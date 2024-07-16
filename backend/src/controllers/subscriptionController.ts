import { Request, Response } from 'express'
import Payment from '../models/Payment'
import { PayPalSubscription } from '@models/payment'
import { config } from '../config/config'
import User from '../models/User'
import { IUserWithId } from '@models/user'

async function hasActiveSubscription(req: Request, res: Response) {
  const ctx = req.ctx
  if (!ctx) {
    return res.status(401).json({ message: 'Unauthorized' })
  }

  const hasPremiumSubscription = (ctx as IUserWithId).payments.some(
    (subscription) => {
      if (subscription.status === 'ACTIVE') return true

      const gracePeriod = false

      if (
        gracePeriod &&
        subscription.status === 'CANCELLED' &&
        subscription.cancelledAt
      ) {
        const cancelledDate = new Date(subscription.cancelledAt)
        const thirtyDaysAfterCancellation = new Date(
          cancelledDate.setDate(cancelledDate.getDate() + 30),
        )

        if (thirtyDaysAfterCancellation > new Date()) {
          return true
        }
      }

      return false
    },
  )

  return res.status(200).json({ hasPremiumSubscription })
}

async function assertActiveSubscription(id: string): Promise<boolean> {
  return Promise.resolve(true)
}

async function createSubscription(req: Request, res: Response) {
  const ctx = req.ctx
  if (!ctx) {
    return res.status(401).json({ message: 'Unauthorized' })
  }

  const { id, status } = req.body as PayPalSubscription

  if (status !== 'ACTIVE')
    return res.status(400).json({ message: 'Subscription not active' })

  const subscription = new Payment({
    payPalId: id,
    createdAt: new Date(),
    status: 'CREATED',
  })

  try {
    const result = await User.updateOne(
      { _id: ctx._id },
      { $push: { payments: subscription } },
    )
    // validate with paypal that the subscription has actually been created
    const isActive = await assertActiveSubscription(id)

    // update the status of the subscription
    if (isActive) {
      await User.updateOne(
        { _id: ctx._id, 'payments.payPalId': id },
        { $set: { 'payments.$.status': 'ACTIVE' } },
      )
      return res.status(201).json({ message: 'Subscription created' })
    } else {
      await User.updateOne(
        { _id: ctx._id, 'payments.payPalId': id },
        {
          $set: {
            'payments.$.status': 'CANCELLED',
            'payments.$.cancelledAt': new Date(),
          },
        },
      )
      throw new Error("Subscription wasn't created")
    }
  } catch (error) {
    console.error(error)
    return res.status(500).json({ error })
  }
}

async function cancelSubscription(req: Request, res: Response) {
  const ctx = req.ctx! as IUserWithId

  // Get the active subscription
  const payPalId = (ctx as IUserWithId).payments.find(
    (subscription) => subscription.status == 'ACTIVE',
  )?.payPalId

  if (!payPalId) {
    return res.status(404).json({ message: 'No active subscription found' })
  }

  try {
    await cancelPayPalSubscription(payPalId)
    await User.updateOne(
      { _id: ctx._id, 'payments.payPalId': payPalId },
      {
        $set: {
          'payments.$.status': 'CANCELLED',
          'payments.$.cancelledAt': new Date(),
        },
      },
    )
    return res.status(200).json({ message: 'Subscription cancelled' })
  } catch (error) {
    console.error('Failed to cancel subscription:', error)
    return res.status(500).json({ error })
  }
}

/**
 * Intended for paypal webhooks to update the status based on changes of the subscription
 */
async function getSubscriptionUpdates(req: Request, res: Response) {
  throw new Error('Not implemented')
}

async function cancelPayPalSubscription(planId: string) {
  const client_secret_base64 = Buffer.from(
    `${config.PAYPAL.CLIENT_ID}:${config.PAYPAL.CLIENT_SECRET}`,
  ).toString('base64')
  fetch(
    `https://api-m.sandbox.paypal.com/v1/billing/subscriptions/${planId}/cancel`,
    {
      method: 'POST',
      headers: {
        Authorization: `Basic ${client_secret_base64}`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    },
  ).then((res) => {
    if (!res.ok) throw new Error('Failed to cancel subscription' + planId)
  })
}

export default {
  createSubscription,
  cancelSubscription,
  getSubscriptionUpdates,
  hasActiveSubscription,
}
