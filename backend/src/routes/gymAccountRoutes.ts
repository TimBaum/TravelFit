import express from 'express'
import {
  readGymAccount,
  createGymAccount,
  readAllGymAccounts,
  updateGymAccount,
  deleteGymAccount,
} from '../controllers/gymAccountController'
import auth from '../middleware/auth'

const router = express.Router()

router.post('/create', createGymAccount)
router.get('/get/:id', auth.isAuthorized, readGymAccount)
router.get('/get', auth.isAuthorized, readAllGymAccounts)
router.patch('/update/:id', auth.isAuthorized, updateGymAccount)
router.delete('/delete/:id', auth.isAuthorized, deleteGymAccount)

export default router
