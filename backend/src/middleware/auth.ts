import User from '../models/User'
import { IUser, IUserWithId } from '@models/user'
import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { config } from '../config/config'
import { PublicUser } from '@models/user'

declare global {
  namespace Express {
    interface Request {
      ctx?: IUserWithId
    }
  }
}

async function createUserContext(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    let token = req.headers.authorization
    if (!token) {
      throw new Error('No token provided')
    }
    token = token.split(' ')[1]
    const decoded = jwt.verify(token, config.JWT_SECRET) as PublicUser
    const user = await User.findById(decoded._id)
    if (!user) {
      throw new Error('No user found')
    }
    req.ctx = user.toObject()
  } catch (error) {
    // pass, since we also have non protected routes
  } finally {
    return next()
  }
}

async function isAuthorized(req: Request, res: Response, next: NextFunction) {
  if (!req.ctx) return res.status(401).json({ error: 'Unauthorized' })
  return next()
}

export default { isAuthorized, createUserContext }
