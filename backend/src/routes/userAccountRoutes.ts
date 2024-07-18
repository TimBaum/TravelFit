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
//TODO: refactor
router.get('/get/:id', readUser)
router.patch('/update', auth.isAuthorizedUser, updateUser)
//TODO: Implement router.get('/favourites/:userId', auth.isAuthorizedUser, getFavouriteGyms);
router.patch('/favourites/add', auth.isAuthorizedUser, addFavourite)
router.patch(
  '/favourites/delete/:favourite',
  auth.isAuthorizedUser,
  deleteFavourite,
)
router.delete('/delete', auth.isAuthorizedUser, deleteUser)

export default router
