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

// TODO: implement authetication-check
router.post('/create', createUser)
router.get('/get/:id', readUser)
router.get('/get', readAllUsers)
router.patch('/update/:id', updateUser) // without authorization for testing with postman
//router.patch('/update/:id', auth.isAuthorized, updateUser)
router.patch('/:id/favourites/add', addFavourite)
router.patch('/:id/favourites/delete/:favourite', deleteFavourite)
router.delete('/delete/:id', deleteUser) // without authorization for testing with postman
//router.delete('/delete/:id', auth.isAuthorized, deleteUser)

export default router
