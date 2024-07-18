import { NextFunction, Request, Response } from 'express'
import mongoose, { FilterQuery } from 'mongoose'
import Gym from '../models/Gym'
import { FilterState } from '@models/filter'
import cache from '../cache'
import cloudinary from 'cloudinary'
import GymAccount from '../models/GymAccount'
import { IGymAccountWithId } from '@models/gymAccount'
import axios from 'axios'

const createGym = async (req: Request, res: Response, next: NextFunction) => {
  const { ctx } = req
  console.log('ctx: ', ctx)
  if (!ctx) return res.status(401).json({ error: 'Unauthorized' })
  const gymData = req.body
  const gymId = new mongoose.Types.ObjectId()
  const coordinates = await getCoordinates(gymData.address)
  const fullAddress = {
    ...gymData.address,
    location: coordinates
      ? {
          type: 'Point',
          coordinates: coordinates,
        }
      : null,
  }
  console.log('CompleteAddress2:', fullAddress)
  const gym = new Gym({
    _id: gymId,
    ...gymData,
    address: fullAddress,
  })
  return gym
    .save()
    .then(async () => {
      await GymAccount.findById(ctx._id).then(async (gymAccount) => {
        gymAccount?.gyms.push(gymId)
        await gymAccount?.save()
      })
      res.status(201).json({ gym })
    })
    .catch((error) => {
      console.error('Error saving gym:', error)
      res.status(500).json({ error: error.message })
    })
}

/**
 * Returns all gyms which belong to a certain account
 * @returns All gyms, which belong to a gym account
 */
const readAll = async (req: Request, res: Response, next: NextFunction) => {
  const gymIds = (req.ctx! as IGymAccountWithId).gyms

  return Gym.find({ _id: { $in: gymIds } })
    .then((gyms) => res.status(200).json({ gyms }))
    .catch((error) => res.status(500).json({ error }))
}

const getGym = (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params

  return Gym.findById(id)
    .populate({
      path: 'reviews.author',
      select: 'displayName',
    })
    .then((gym) => {
      res.status(200).json(gym)
    })
    .catch((error) => res.status(500).json({ error }))
}

interface OpenStreetMapResponse {
  lat: string
  lon: string
  //... we dont need the other attributes
}

const addReview = async (req: Request, res: Response) => {
  try {
    const gym = await Gym.findById(req.params.id)
    if (!gym) {
      return res.status(404).json({ message: 'Gym not found' })
    }

    gym.reviews.push(req.body.review)

    const totalReviews = gym.reviews.length
    const totalRating = gym.reviews.reduce(
      (sum, review) => sum + review.rating.valueOf(),
      0,
    )

    gym.averageRating = totalRating / totalReviews

    await gym.save()
    return res.status(201).json({ gym })
  } catch (err) {
    return res.status(500).json(err)
  }
}

export async function getCoordinates(
  address:
    | {
        street: string
        postalCode: string
        city: string
        country: string
      }
    | string,
): Promise<[number, number] | void> {
  let fullAddress: string
  if (typeof address === 'string') {
    fullAddress = address.toLowerCase()
  } else {
    fullAddress =
      `${address.street}, ${address.postalCode} ${address.city}, ${address.country}`.toLowerCase()
  }
  // Check if the coordinates are already cached to improve response time
  const cachedCoordinates: [number, number] | undefined = cache.get(fullAddress)
  if (cachedCoordinates !== undefined) return cachedCoordinates

  try {
    const response = await axios.get(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(fullAddress)}`,
    )
    if (!response.data || response.data.length === 0) {
      return
    }
    const { lat, lon } = response.data[0]
    const coordinates = [parseFloat(lon), parseFloat(lat)] as [number, number]
    cache.set(fullAddress, coordinates)
    return coordinates
  } catch (error) {
    console.error('Error fetching coordinates:', error)
  }
}

interface SearchRequestBody {
  searchString: string
  filters: FilterState
  pageLimit: number
  sortBy: string
  page: number
}

const searchGyms = async (
  req: Request<any, any, SearchRequestBody>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { searchString, filters, pageLimit, sortBy, page } = req.body

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

    const maxDistance = filters.radius ? filters.radius * 1000 : 10000 // default 10 km

    function queryBuilder(type: 'FETCH' | 'COUNT') {
      // Two queries are required since Mongo DB doesn't allow for the $near operator, when sorting isnt required (for the count)
      // But sorting IS required for the

      const query: any = {
        'address.location': {},
        ...dbFilters,
      }

      if (type === 'FETCH') {
        query['address.location'].$near = {
          $geometry: {
            type: 'Point',
            coordinates: coordinates,
          },
          $maxDistance: maxDistance,
        }
      }

      if (type === 'COUNT') {
        query['address.location'].$geoWithin = {
          $centerSphere: [coordinates, maxDistance],
        }
      }

      return query
    }

    const gymsPromise = Gym.find(queryBuilder('FETCH'))
      .sort(sortBy)
      .skip(page * pageLimit)
      .limit(pageLimit)

    const countPromise = Gym.countDocuments(queryBuilder('COUNT'))

    const [gyms, count] = await Promise.all([gymsPromise, countPromise])

    return res.status(200).json({
      gyms,
      pages: Math.floor(count / pageLimit) + 1,
      coordinates: [coordinates[1], coordinates[0]],
    })
  } catch (error) {
    console.log(error)
    return res.status(500).json({ error })
  }
}

/**
 * Check if a gym belongs to a gym account
 */
function gymBelongsToGymAccount(
  gymAccount: IGymAccountWithId,
  gymId: string,
): boolean {
  const gyms = gymAccount.gyms
  const gymIdsAsString = gyms.map((id) => id.toString())

  return gymIdsAsString.includes(gymId)
}

const deleteGym = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params
  const { ctx } = req

  if (!ctx) return res.status(401).json({ error: 'Unauthorized' })

  try {
    const gymAccountId = ctx._id
    const gymAccount = await GymAccount.findById(gymAccountId)

    if (!gymAccount) {
      return res.status(404).json({ message: 'Gym account not found' })
    }

    if (!gymBelongsToGymAccount(req.ctx as IGymAccountWithId, id)) {
      return res
        .status(400)
        .json({ message: "You don't have the right to delete this gym" })
    }

    const gym = await Gym.findByIdAndDelete(id)
    if (!gym) {
      return res.status(404).json({ message: 'Gym not found' })
    }
    gymAccount.gyms.pull(id) //mongoose method to remove entry from DocumentArray (ObjectIds)
    await gymAccount.save()

    return res.status(201).json({ message: 'Gym deleted' })
  } catch (error) {
    console.error('Error deleting gym:', error)
    return res.status(500).json({ error })
  }
}

const updateGym = (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params
  const gymData = req.body

  if (!gymBelongsToGymAccount(req.ctx as IGymAccountWithId, id)) {
    return res
      .status(400)
      .json({ message: "You don't have the right to edit this gym" })
  }

  return Gym.findByIdAndUpdate(id, gymData)
    .then((gym) => res.status(201).json({ gym }))
    .catch((error) => res.status(500).json({ error }))
}

const fetchImages = async (req: Request, res: Response) => {
  const cloudName = 'travelfit'
  const apiKey = process.env.CLOUDINARY_KEY
  const apiSecret = process.env.CLOUDINARY_SECRET
  const prefix = req.params.id
  // filter images by gymId (public_id starts with gymId); limit to 20 results
  const url = `https://api.cloudinary.com/v1_1/${cloudName}/resources/image?max_results=20&prefix=${prefix}&type=upload`

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization:
          'Basic ' + Buffer.from(`${apiKey}:${apiSecret}`).toString('base64'),
      },
    })

    if (!response.ok) {
      throw new Error('Failed to fetch images')
    }

    const results = await response.json()
    res.json(results)
  } catch (error) {
    res.status(500).json({ error })
  }
}

cloudinary.v2.config({
  cloud_name: 'travelfit',
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
})

const deleteImage = async (req: Request, res: Response) => {
  //TODO: need to check if gym is allowed to be deleted from and if picture belongs to gym, etc...

  try {
    // Extract the public_id from the request parameters
    const public_id = req.params.public_id

    /* Cloudinary API call to delete the image: takes in an array of public_ids and a callback function for response handling */
    await cloudinary.v2.api.delete_resources([public_id], (error, result) => {
      if (error) {
        return res.status(500).json({ error })
      }
      return res.status(200).json({ result })
    })
  } catch (error) {
    res.status(500).json({ error })
  }
}

export default {
  readAll,
  createGym,
  getGym,
  addReview,
  searchGyms,
  deleteGym,
  fetchImages,
  updateGym,
  deleteImage,
}
