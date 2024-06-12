import express from 'express'
import {
  readGymAccount,
  createGymAccount,
  readAllGymAccounts,
  updateGymAccount,
  deleteGymAccount,
} from '../controllers/gymAccountController'

const router = express.Router()

router.post('/create', createGymAccount)
router.get('/get/:id', readGymAccount)
router.get('/get', readAllGymAccounts)
router.patch('/update/:id', updateGymAccount)
router.delete('/delete/:id', deleteGymAccount)

export default router
