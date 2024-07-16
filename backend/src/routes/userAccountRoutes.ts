import express from 'express'
import {
  createUser,
  readUser,
  updateUser,
  deleteUser,
  addFavourite,
  deleteFavourite,
} from '../controllers/userAccountController'
import auth from '../middleware/auth'

const router = express.Router()

router.post('/create', createUser)
router.get('/get/:id', auth.isAuthorizedUser, readUser)
router.patch('/update/:id', auth.isAuthorizedUser, updateUser)
router.patch('/:id/favourites/add', auth.isAuthorizedUser, addFavourite)
router.patch(
  '/:id/favourites/delete/:favourite',
  auth.isAuthorizedUser,
  deleteFavourite,
)
router.delete('/delete/:id', auth.isAuthorizedUser, deleteUser)

export default router
