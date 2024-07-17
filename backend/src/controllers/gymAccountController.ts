// the "return" statements could be left out at some places, but for clarity I added them.
import { error } from 'console'
import GymAccount from '../models/GymAccount'
import { Request, Response } from 'express'
import mongoose from 'mongoose'
import { PublicGymAccount } from '@models/gymAccount'
import bcryptjs from 'bcryptjs'
import User from '../models/User'
import { isMongoError } from './errors'

export const createGymAccount = async (req: Request, res: Response) => {
  console.log(
    'Creating gym account in controller with values' + JSON.stringify(req.body),
  )
  const {
    email,
    firstName,
    lastName,
    phone,
    salutation,
    password,
    //address,
    gyms,
  } = req.body

  const userWithSameMail = await User.findOne({ email: email }).exec()

  if (userWithSameMail) {
    return res
      .status(400)
      .json({ message: 'Email already exists. Try another email address' })
  }

  const hashedPassword = await bcryptjs.hash(password, 10)

  try {
    const newGymAccount = new GymAccount({
      _id: new mongoose.Types.ObjectId(),
      email,
      firstName,
      lastName,
      phone,
      salutation,
      //address,
      gyms,
      password: hashedPassword,
    })
    await newGymAccount.save()
    return res.status(201).json({ newGymAccount })
  } catch (err) {
    if (isMongoError(err) && err.code === 11000) {
      return res.status(400).json({ message: 'Email already exists' })
    }
    console.log('Error creating gym account:', err)
    return res.status(500).json({ error })
  }
}

export const readGymAccount = async (req: Request, res: Response) => {
  const gymAccountId = req.ctx!._id

  try {
    // could technically be skipped since we already fetch the account in the middleware
    // but for potential future modifications, it is left here
    const gymAccount = await GymAccount.findById(gymAccountId)
    if (!gymAccount) {
      return res.status(404).json({ message: 'Gym account not found' })
    }
    const publicGymAccount: PublicGymAccount = {
      _id: gymAccount._id.toString() || '',
      firstName: gymAccount.firstName || '',
      lastName: gymAccount.lastName || '',
      salutation: gymAccount.salutation || '',
      email: gymAccount.email || '',
      favourites: gymAccount.favourites.map((fav) => fav.toString()),
      gyms: gymAccount.gyms.map((gym) => gym.toString()),
      //address: gymAccount.address || '',
      phone: gymAccount.phone || '',
    }
    return res.status(200).json(publicGymAccount)
  } catch (err) {
    return res.status(500).json({ error })
  }
}

export const updateGymAccount = async (req: Request, res: Response) => {
  const gymAccountId = req.ctx!._id

  try {
    // could technically be skipped since we already fetch the account in the middleware
    // but for potential future modifications, it is left here
    const gymAccount = await GymAccount.findById(gymAccountId)
    console.log('This user will be updated: ', gymAccount)
    if (!gymAccount) {
      return res.status(404).json({ message: 'Gym account not found' })
    }
    gymAccount.set(req.body)
    await gymAccount.save()
    console.log('This is the updated gymAccount: ', gymAccount)
    const updatedPublicGymAccount: PublicGymAccount = {
      _id: gymAccount._id.toString() || '',
      firstName: gymAccount.firstName || '',
      lastName: gymAccount.lastName || '',
      salutation: gymAccount.salutation || '',
      email: gymAccount.email || '',
      favourites: gymAccount.favourites.map((fav) => fav.toString()),
      gyms: gymAccount.gyms.map((gym) => gym.toString()),
      //address: gymAccount.address || '',
      phone: gymAccount.phone || '',
    }
    return res.status(201).json({ updatedPublicGymAccount })
  } catch (err) {
    return res.status(500).json({ error })
  }
}

export const addFavourite = async (req: Request, res: Response) => {
  try {
    const gymAccount = await GymAccount.findById(req.params.id)
    if (!gymAccount) {
      return res.status(404).json({ message: 'Gym account not found' })
    }

    const publicGymAccount: PublicGymAccount = {
      _id: gymAccount._id.toString() || '',
      firstName: gymAccount.firstName || '',
      lastName: gymAccount.lastName || '',
      salutation: gymAccount.salutation || '',
      email: gymAccount.email || '',
      favourites: gymAccount.favourites.map((fav) => fav.toString()),
      gyms: gymAccount.gyms.map((gym) => gym.toString()),
      //address: gymAccount.address || '',
      phone: gymAccount.phone || '',
    }
    gymAccount.favourites.push(req.body.gymId)
    await gymAccount.save()
    return res.status(201).json({ publicGymAccount })
  } catch (err) {
    return res.status(500).json(err)
  }
}

export const deleteFavourite = async (req: Request, res: Response) => {
  try {
    const gymAccount = await GymAccount.findById(req.params.id)
    const favouriteId = new mongoose.Types.ObjectId(req.params.favourite)
    if (!gymAccount) {
      return res.status(404).json({ message: 'Gym account not found' })
    }
    const favouriteIndex = gymAccount.favourites.findIndex(
      (favourite) => favourite._id && favourite._id.equals(favouriteId),
    )
    if (favouriteIndex === -1) {
      return res.status(404).json({ message: 'Favourite not found' })
    }

    gymAccount.favourites.splice(favouriteIndex, 1)
    await gymAccount.save()

    res.status(200).json({ message: 'Favourite removed successfully' })
  } catch (err) {
    return res.status(500).json(err)
  }
}

//TODO: remove if not used?
export const deleteGymAccount = async (req: Request, res: Response) => {
  try {
    const gymAccount = await GymAccount.findByIdAndDelete(req.ctx!._id)
    if (!gymAccount) {
      return res.status(404).json({ message: 'Gym account not found' })
    }
    return res.status(201).json({ message: 'Gym account deleted' })
  } catch (err) {
    return res.status(500).json({ error })
  }
}
