// the "return" statements could be left out at some places, but for clarity I added them.
import { error } from 'console'
import GymAccount from '../models/GymAccount'
import { Request, Response } from 'express'
import mongoose from 'mongoose'

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
    address,
    gyms,
  } = req.body

  try {
    const newGymAccount = new GymAccount({
      _id: new mongoose.Types.ObjectId(),
      email,
      firstName,
      lastName,
      phone,
      salutation,
      password,
      address,
      gyms,
    })
    await newGymAccount.save()
    return res.status(201).json({ newGymAccount })
  } catch (err) {
    console.log('Error creating gym account:', err)
    return res.status(500).json({ error })
  }
}

export const readGymAccount = async (req: Request, res: Response) => {
  try {
    const gymAccount = await GymAccount.findById(req.params.id)
    if (!gymAccount) {
      return res.status(404).json({ message: 'Gym account not found' })
    }
    return res.status(200).json({ gymAccount })
  } catch (err) {
    return res.status(500).json({ error })
  }
}

export const readAllGymAccounts = async (req: Request, res: Response) => {
  try {
    const gymAccounts = await GymAccount.find()
    return res.status(200).json({ gymAccounts })
  } catch (err) {
    return res.status(500).json({ error })
  }
}

export const updateGymAccount = async (req: Request, res: Response) => {
  try {
    const gymAccount = await GymAccount.findById(req.params.id)
    if (!gymAccount) {
      return res.status(404).json({ message: 'Gym account not found' })
    }
    gymAccount.set(req.body)
    await gymAccount.save()
    return res.status(201).json({ gymAccount })
  } catch (err) {
    return res.status(500).json({ error })
  }
}

export const deleteGymAccount = async (req: Request, res: Response) => {
  console.log('Trying to delete a gym account for testing')
  try {
    const gymAccount = await GymAccount.findByIdAndDelete(req.params.id)
    if (!gymAccount) {
      return res.status(404).json({ message: 'Gym account not found' })
    }
    return res.status(201).json({ message: 'Gym account deleted' })
  } catch (err) {
    return res.status(500).json({ error })
  }
}
