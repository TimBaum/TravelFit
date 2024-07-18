// the "return" statements could be left out at some places, but for clarity I added them.
import { error } from 'console'
import GymAccount from '../models/GymAccount'
import { Request, Response } from 'express'
import mongoose from 'mongoose'
import { PublicGymAccount } from '@models/gymAccount'
import bcryptjs from 'bcryptjs'
import { isMongoError } from './errors'
import { getCoordinates } from './gymController'
import User from '../models/User'

export const createGymAccount = async (req: Request, res: Response) => {
  try {
    const accData = req.body
    const accId = new mongoose.Types.ObjectId()
    const accAddress = accData.address
    const hashedPassword = await bcryptjs.hash(accData.password, 10)

    const userWithSameMail = await User.findOne({ email: accData.email }).exec()
    if (userWithSameMail) {
      return res
        .status(400)
        .json({ message: 'Email already exists. Try another email address' })
    }

    //TODO: use location to check if address is valid
    //dont save it in the db, we dont need the coordinates
    const coordinates = await getCoordinates(accAddress)

    const acc = new GymAccount({
      _id: accId,
      ...accData,
      password: hashedPassword,
      address: { ...accAddress },
    })
    await acc.save()
    res.status(201).json({ message: 'Account created successfully', acc })
  } catch (err) {
    if (isMongoError(err) && err.code === 11000) {
      return res.status(400).json({ message: 'Email already exists' })
    }
    console.error('Error creating acc:', err)
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
      gyms: gymAccount.gyms.map((gym) => gym.toString()),
      address: {
        street: gymAccount.address.street || '',
        postalCode: gymAccount.address.postalCode || '',
        country: gymAccount.address.country || '',
        city: gymAccount.address.city || '',
        location: {
          type: 'Point',
          coordinates: (gymAccount.address.location?.coordinates as [
            number,
            number,
          ]) ?? [0, 0],
        },
      },
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
    const userWithSameMail = await User.findOne({
      email: gymAccount?.email,
    }).exec()
    if (userWithSameMail) {
      return res
        .status(400)
        .json({ message: 'Email already exists. Try another email address' })
    }
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
      gyms: gymAccount.gyms.map((gym) => gym.toString()),
      address: {
        street: gymAccount.address.street || '',
        postalCode: gymAccount.address.postalCode || '',
        country: gymAccount.address.country || '',
        city: gymAccount.address.city || '',
        location: {
          type: 'Point',
          coordinates: (gymAccount.address.location?.coordinates as [
            number,
            number,
          ]) ?? [0, 0],
        },
      },
      phone: gymAccount.phone || '',
    }
    return res.status(201).json({ updatedPublicGymAccount })
  } catch (err) {
    if (isMongoError(err) && err.code === 11000) {
      return res.status(400).json({ message: 'Email already exists' })
    }
    return res.status(500).json({ error })
  }
}

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
