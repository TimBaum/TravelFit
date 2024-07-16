// the "return" statements could be left out at some places, but for clarity I added them.
import { error } from 'console'
import User from '../models/User'
import { PublicUser } from '@models/user'
import { Request, Response } from 'express'
import mongoose from 'mongoose'
import bcryptjs from 'bcryptjs'
import GymAccount from '../models/GymAccount'

export const createUser = async (req: Request, res: Response) => {
  console.log(
    'createUser was called in controller with params ',
    req.params,
    ' and body ',
    req.body,
  )
  const { email, displayName, salutation, password } = req.body

  const hashedPassword = await bcryptjs.hash(password, 10)

  const gymAccountWithSameEmail = await GymAccount.findOne({
    email: email,
  }).exec()

  console.log(gymAccountWithSameEmail)

  if (gymAccountWithSameEmail)
    return res
      .status(400)
      .json({ message: 'Email already exists. Try another email address' })

  try {
    const newUser = new User({
      _id: new mongoose.Types.ObjectId(),
      email, // TODO: check if email already exists
      displayName,
      salutation,
      password: hashedPassword,
    })
    console.log('newUser object will be saved: ', newUser)
    await newUser.save()
    return res.status(201).json({ newUser })
  } catch (err) {
    console.log('Error creating user:', err)
    return res.status(500).json({ error })
  }
}

export const readUser = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.params.id)
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }
    const publicUser: PublicUser = {
      _id: user._id.toString() || '',
      displayName: user.displayName || '',
      salutation: user.salutation || '',
      email: user.email || '',
      favourites: user.favourites.map((fav) => fav.toString()),
    }
    return res.status(200).json(publicUser)
  } catch (err) {
    return res.status(500).json({ error })
  }
}

export const updateUser = async (req: Request, res: Response) => {
  console.log(
    'updateUser was called in controller with request body ',
    req.body,
    ' and req.params ',
    req.params,
  )
  try {
    const user = await User.findById(req.params.id)
    console.log('This user will be updated: ', user)
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }
    user.set(req.body)
    await user.save()
    console.log('This is the updated user: ', user)
    const updatedPublicUser: PublicUser = {
      _id: user._id.toString() || '',
      displayName: user.displayName || '',
      salutation: user.salutation || '',
      email: user.email || '',
      favourites: user.favourites.map((fav) => fav.toString()),
    }
    return res.status(200).json({ updatedPublicUser })
  } catch (err) {
    return res.status(500).json({ error })
  }
}

export const addFavourite = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.params.id)
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    const publicUser: PublicUser = {
      _id: user._id.toString() || '',
      displayName: user.displayName || '',
      salutation: user.salutation || '',
      email: user.email || '',
      favourites: user.favourites.map((fav) => fav.toString()),
    }

    user.favourites.push(req.body.gymId)
    await user.save()
    return res.status(201).json({ publicUser })
  } catch (err) {
    return res.status(500).json(err)
  }
}

export const deleteFavourite = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.params.id)
    const favouriteId = new mongoose.Types.ObjectId(req.params.favourite)
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }
    const favouriteIndex = user.favourites.findIndex(
      (favourite) => favourite._id && favourite._id.equals(favouriteId),
    )
    if (favouriteIndex === -1) {
      return res.status(404).json({ message: 'Favourite not found' })
    }

    user.favourites.splice(favouriteIndex, 1)
    await user.save()

    res.status(200).json({ message: 'Favourite removed successfully' })
  } catch (err) {
    return res.status(500).json(err)
  }
}

export const deleteUser = async (req: Request, res: Response) => {
  console.log('deleteUser was called in controller')
  try {
    const user = await User.findByIdAndDelete(req.params.id)
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }
    return res.status(201).json({ message: 'User deleted' })
  } catch (err) {
    return res.status(500).json({ error })
  }
}
