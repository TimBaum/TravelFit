import express from 'express'
import {
  readGymAccount,
  createGymAccount,
  updateGymAccount,
  deleteGymAccount,
} from '../controllers/gymAccountController'
import auth from '../middleware/auth'

const router = express.Router()

router.post('/create', createGymAccount)
router.get('/get', auth.isAuthorizedGymAccount, readGymAccount)
router.patch('/update', auth.isAuthorizedGymAccount, updateGymAccount)
//TODO: delete if not used?
router.delete('/delete', auth.isAuthorizedGymAccount, deleteGymAccount)

export default router
