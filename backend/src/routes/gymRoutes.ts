import express from 'express'
import controller from '../controllers/gymController'
import auth from '../middleware/auth'

const router = express.Router()

router.post('/create', auth.isAuthorizedGymAccount, controller.createGym)
router.get('/get', auth.isAuthorizedGymAccount, controller.readAll)
router.get('/get/:id', controller.getGym)
router.get('/by-ids', controller.getGymsByIds)
router.post('/search', controller.searchGyms)
router.patch('/:id/reviews', controller.addReview)
router.delete('/:id', auth.isAuthorizedGymAccount, controller.deleteGym)
router.get('/fetch-images/:id', controller.fetchImages)
router.patch('/update/:id', auth.isAuthorizedGymAccount, controller.updateGym)
router.delete(
  '/delete-image/:public_id',
  auth.isAuthorizedGymAccount,
  controller.deleteImage,
)

export = router
