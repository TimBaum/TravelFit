import { NextFunction, Request, Response } from 'express'
import mongoose from 'mongoose'
import Gym from '../models/Gym'

const createGym = (req: Request, res: Response, next: NextFunction) => {
  const gymData = req.body

  const gym = new Gym({
    _id: new mongoose.Types.ObjectId(),
    ...gymData,
  })

  return gym
    .save()
    .then((gym) => res.status(201).json({ gym }))
    .catch((error) => {
      console.error('Error saving gym:', error) // Detaillierte Fehlermeldung
      res.status(500).json({ error: error.message })
    })
}

const readAll = (req: Request, res: Response, next: NextFunction) => {
  return Gym.find()
    .then((gyms) => res.status(200).json({ gyms }))
    .catch((error) => res.status(500).json({ error }))
}

const getGym = (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params

  return Gym.findById(id)
    .then((gym) => res.status(200).json({ gym }))
    .catch((error) => res.status(500).json({ error }))
}

const searchGyms = (req: Request, res: Response, next: NextFunction) => {
  const { searchString, pageLimit, sortBy } = req.body

  return Gym.find({
    'address.location': {
      $near: {
        $geometry: {
          type: 'Point',
          coordinates: [11.581981, 48.135124], // Example coordinates for Munich
        },
        $maxDistance: 10000, // 10 km
      },
    },
  })
    .then((gyms) => {
      console.log(gyms)
      res.status(200).json(gyms)
    })
    .catch((error) => res.status(500).json({ error }))

  return Gym.where('address.city')
    .in([searchString])
    .then((gyms) => {
      console.log(gyms[0].address.location)
      res.status(200).json(gyms)
    })
    .catch((error) => res.status(500).json({ error }))
}

export default { readAll, createGym, getGym, searchGyms }
