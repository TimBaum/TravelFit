import { Router } from 'express'
import controller from '../controllers/subscriptionController'

const router = Router()
router.post('/create', controller.createSubscription)
router.get('/cancel', controller.cancelSubscription)
router.get('/active', controller.hasActiveSubscription)

// Intended for paypal webhooks to update the status based on changes of the subscription
// We just implement cancellation in our webapplication
router.post('/update', controller.getSubscriptionUpdates)

export = router
