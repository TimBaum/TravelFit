// the "return" statements could be left out at some places, but for clarity I added them.
import { error } from 'console'
import User from '../models/User'
import { PublicUser } from '@models/user'
import { Request, Response } from 'express'
import mongoose from 'mongoose'
import bcryptjs from 'bcryptjs'

export const createUser = async (req: Request, res: Response) => {
  const { email, displayName, salutation, password, hasPremiumSubscription } =
    req.body

  const hashedPassword = await bcryptjs.hash(password, 10)

  // TODO: check if email already exists

  try {
    const newUser = new User({
      _id: new mongoose.Types.ObjectId(),
      email,
      displayName,
      salutation,
      password: hashedPassword,
      hasPremiumSubscription,
    })
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

export const readAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find()
    return res.status(200).json({ users })
  } catch (err) {
    return res.status(500).json({ error })
  }
}

export const updateUser = async (req: Request, res: Response) => {
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
    user.set(req.body)
    await user.save()
    return res.status(201).json({ publicUser })
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
  console.log('Trying to delete a user for testing')
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
