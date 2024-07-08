import User from '../models/User'
import GymAccount from '../models/GymAccount'
import { IUserWithId, PublicUser } from '@models/user'
import { IGymAccountWithId, PublicGymAccount } from '@models/gymAccount'
import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { config } from '../config/config'

declare global {
  namespace Express {
    interface Request {
      ctx?: IUserWithId | IGymAccountWithId
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
    console.log('createUserContext in auth.ts was called with token ', token)
    if (!token) {
      throw new Error('No token provided')
    }
    token = token.split(' ')[1]
    console.log('token was split:  ', token)
    const decoded = jwt.verify(token, config.JWT_SECRET) as
      | PublicUser
      | PublicGymAccount
    console.log('token was decoded:  ', decoded)
    let ctx: IUserWithId | IGymAccountWithId | undefined
    if ('displayName' in decoded) {
      // as decoded is a type and not a value we need a runtime-check that aligns with the structure of PublicUser and PublicGymAccount to distinguish between them
      const user = await User.findById(decoded._id)
      if (!user) {
        throw new Error('No user found')
      }
      ctx = user.toObject()
    } else if ('firstName' in decoded) {
      // as decoded is a type and not a value we need a runtime-check that aligns with the structure of PublicUser and PublicGymAccount to distinguish between them
      const gymAccount = await GymAccount.findById(decoded._id)
      if (!gymAccount) {
        throw new Error('No gym account found')
      }
      ctx = gymAccount.toObject()
    }
    req.ctx = ctx
    //console.log('this context was created:  ', ctx)
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
