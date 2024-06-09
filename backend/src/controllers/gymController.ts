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

interface OpenStreetMapResponse {
  lat: string
  lon: string
  //... we dont need the other attributes
}

async function getCoordinates(
  address: string,
): Promise<[number, number] | void> {
  return fetch(
    `https://nominatim.openstreetmap.org/search?q=${address}&format=json`,
  )
    .then((response) => response.json())
    .then((response: OpenStreetMapResponse[]) => {
      console.log(response)
      if (!response || response.length === 0) {
        return undefined
      }
      // We take the most important result, they are ranked by importance
      const result = response[0]
      return [parseFloat(result.lon), parseFloat(result.lat)] as [
        number,
        number,
      ]
    })
    .catch((error) => {
      console.error('Error fetching coordinates:', error)
    })
}

const searchGyms = async (req: Request, res: Response, next: NextFunction) => {
  const { searchString, pageLimit, sortBy } = req.body

  if (!searchString) {
    return res.status(400).json({ error: 'Search string is required' })
  }

  // Get coordinates of gym
  const coordinates = await getCoordinates(searchString)

  if (!coordinates) {
    return res.status(500).json({ error: 'LOCATION_NOT_FOUND' })
  }

  return Gym.find({
    'address.location': {
      $near: {
        $geometry: {
          type: 'Point',
          coordinates: coordinates,
        },
        $maxDistance: 10000, // 10 km
      },
    },
  })
    .then((gyms) => {
      res.status(200).json(gyms)
    })
    .catch((error) => res.status(500).json({ error }))
}

export default { readAll, createGym, getGym, searchGyms }
