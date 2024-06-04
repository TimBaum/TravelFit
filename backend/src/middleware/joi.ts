import Joi, { ObjectSchema } from 'joi'
import { NextFunction, Request, Response } from 'express'
import { IGym } from '../models/Gym'
import Logging from '../Logging'

export const ValidateJoi = (schema: ObjectSchema) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.validateAsync(req.body)
      next()
    } catch (error) {
      Logging.error(error)

      return res.status(422).json({ error })
    }
  }
}

export const Schemas = {
  author: {
    create: Joi.object<IGym>({
      name: Joi.string().required(),
      highlights: Joi.array().items(Joi.string()).optional(),
      websiteLink: Joi.string().required(),
      pictures: Joi.array().items(Joi.string()).optional(),
      averageRating: Joi.number().optional(),
      address: Joi.object({
        street: Joi.string().required(),
        postalCode: Joi.string().required(),
        city: Joi.string().required(),
        country: Joi.string().required(),
        latitude: Joi.number().required(),
        longitude: Joi.number().required(),
      }),
    }),
    update: Joi.object<IGym>({
      name: Joi.string().required(),
    }),
  },
  search: Joi.object({
    searchString: Joi.string().required(),
    pageLimit: Joi.number().optional(),
    sortBy: Joi.string().optional(),
  }),
}
