import express from 'express'
import {
  createUser,
  readUser,
  readAllUsers,
  updateUser,
  deleteUser,
  addFavourite,
  deleteFavourite,
} from '../controllers/userAccountController'
import auth from '../middleware/auth'

const router = express.Router()

router.post('/create', createUser)
router.get('/get/:id', auth.isAuthorized, readUser)
router.get('/get', auth.isAuthorized, readAllUsers)
router.patch('/update/:id', auth.isAuthorized, updateUser)
router.patch('/:id/favourites/add', auth.isAuthorized, addFavourite)
router.patch(
  '/:id/favourites/delete/:favourite',
  auth.isAuthorized,
  deleteFavourite,
)
router.delete('/delete/:id', auth.isAuthorized, deleteUser)

export default router
