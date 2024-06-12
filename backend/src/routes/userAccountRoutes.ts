import express from 'express'
import {
  createUser,
  readUser,
  readAllUsers,
  updateUser,
  deleteUser,
} from '../controllers/userAccountController'
import auth from '../middleware/auth'

const router = express.Router()

router.post('/create', createUser)
router.get('/get/:id', readUser)
router.get('/get', readAllUsers)
router.patch('/update/:id', auth.isAuthorized, updateUser)
router.delete('/delete/:id', auth.isAuthorized, deleteUser)

export default router
