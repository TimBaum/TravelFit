import { Router } from 'express'
import controller from '../controllers/subscriptionController'
import auth from '../middleware/auth'

const router = Router()
router.post('/create', auth.isAuthorizedUser, controller.createSubscription)
router.get('/cancel', auth.isAuthorizedUser, controller.cancelSubscription)
router.get('/active', auth.isAuthorizedUser, controller.hasActiveSubscription)

// Intended for paypal webhooks to update the status based on changes of the subscription
// We just implement cancellation in our webapplication
router.post('/update', controller.getSubscriptionUpdates)

export = router
