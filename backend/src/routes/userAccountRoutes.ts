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

//TODO: update routes with isAuthorized middleware
router.post('/create', createUser)
router.get('/get/:id', readUser)
router.get('/get', readAllUsers)
router.patch('/update/:id', auth.isAuthorized, updateUser)
router.patch('/:id/favourites/add', addFavourite)
router.patch('/:id/favourites/delete/:favourite', deleteFavourite)
router.delete('/delete/:id', auth.isAuthorized, deleteUser)

export default router
