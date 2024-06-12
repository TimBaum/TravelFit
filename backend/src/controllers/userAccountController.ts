// the "return" statements could be left out at some places, but for clarity I added them.
import { error } from 'console'
import User from '../models/User'
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
    return res.status(200).json({ user })
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
    user.set(req.body)
    await user.save()
    return res.status(201).json({ user })
  } catch (err) {
    return res.status(500).json({ error })
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