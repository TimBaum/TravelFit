import { NextFunction, Request, Response } from 'express'
import mongoose, { FilterQuery } from 'mongoose'
import Gym from '../models/Gym'
import Review from '../models/Review'
import { FilterState } from '@models/filter'
import cache from '../cache'

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
    .then((gym) => res.status(200).json(gym))
    .catch((error) => res.status(500).json({ error }))
}

interface OpenStreetMapResponse {
  lat: string
  lon: string
  //... we dont need the other attributes
}

const addReview = (req: Request, res: Response) => {
  const { id } = req.params
  const { reviewData } = req.body

  const review = new Review({
    ...reviewData,
  })

  Gym.findById(id)
    .then((gym) => {
      // Update the reviews array
      if (!gym) throw new Error('Gym not found!')
      gym.reviews.push(review)

      // Save the updated gym document
      return gym!.save()
    })
    .then((updatedGym) => res.status(200).json(updatedGym))
    .catch((error) => res.status(500).json({ error }))
}

async function getCoordinates(
  address: string,
): Promise<[number, number] | void> {
  // Check if the coordinates are already cached to improve response time
  const cachedCoordinates: [number, number] | undefined = cache.get(
    address.toLowerCase(),
  )

  if (cachedCoordinates !== undefined) return cachedCoordinates

  return fetch(
    `https://nominatim.openstreetmap.org/search?q=${address}&format=json`,
  )
    .then((response) => response.json())
    .then((response: OpenStreetMapResponse[]) => {
      if (!response || response.length === 0) {
        return undefined
      }
      // We take the first result, they are ranked by importance
      const result = response[0]
      const coordinates = [parseFloat(result.lon), parseFloat(result.lat)] as [
        number,
        number,
      ]
      cache.set(address.toLowerCase(), coordinates)
      return coordinates
    })
    .catch((error) => {
      console.error('Error fetching coordinates:', error)
    })
}

interface SearchRequestBody {
  searchString: string
  filters: FilterState
  pageLimit: number
  sortBy: string
}

const searchGyms = async (
  req: Request<any, any, SearchRequestBody>,
  res: Response,
  next: NextFunction,
) => {
  const { searchString, filters, pageLimit, sortBy } = req.body

  if (!searchString) {
    return res.status(400).json({ error: 'Search string is required' })
  }

  // Get coordinates of gym
  const coordinates = await getCoordinates(searchString)

  if (!coordinates) {
    return res.status(500).json({ error: 'LOCATION_NOT_FOUND' })
  }

  const dbFilters: FilterQuery<typeof Gym> = {} // Be careful! Typescript is not typechecking this object for some reason

  if (filters.rating.from)
    dbFilters.averageRating = { $gte: filters.rating.from }

  if (filters.price.from || filters.price.to) {
    dbFilters.cheapestOfferPrice = {}
    if (filters.price.from)
      dbFilters.cheapestOfferPrice.$gte = filters.price.from
    if (filters.price.to) dbFilters.cheapestOfferPrice.$lte = filters.price.to
  }

  return Gym.find({
    'address.location': {
      $near: {
        $geometry: {
          type: 'Point',
          coordinates: coordinates,
        },
        $maxDistance: filters.radius ? filters.radius * 1000 : 10000, // default 10 km
      },
    },
    ...dbFilters,
  })
    .then((gyms) => {
      res.status(200).json(gyms)
    })
    .catch((error) => res.status(500).json({ error }))
}
const deleteGym = (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params

  return Gym.findByIdAndDelete(id)
    .then((gym) => {
      if (gym) {
        return res.status(201).json({ message: 'Gym deleted' })
      } else {
        return res.status(404).json({ message: 'Gym not found' })
      }
    })
    .catch((error) => {
      return res.status(500).json({ error })
    })
}

export default { readAll, createGym, getGym, addReview, searchGyms, deleteGym }
