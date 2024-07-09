import express from 'express'
import controller from '../controllers/gymController'
import { Schemas, ValidateJoi } from '../middleware/joi'

const router = express.Router()

router.post('/create', controller.createGym)
router.get('/get', controller.readAll)
router.get('/get/:id', controller.getGym)
router.post('/search', controller.searchGyms)
router.patch('/:id/reviews', controller.addReview)
router.delete('/:id', controller.deleteGym)
router.get('/fetch-images/:id', controller.fetchImages)
router.patch('/:id', controller.updateGym)

export = router
