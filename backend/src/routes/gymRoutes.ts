import express from 'express'
import controller from '../controllers/gymController'
import { Schemas, ValidateJoi } from '../middleware/joi'

const router = express.Router()

router.post('/create', controller.createGym)
router.get('/get', controller.readAll)
router.get('/get/:id', controller.getGym)
router.post('/search', controller.searchGyms)
router.put('/post/:id/reviews', controller.addReview)

export = router
