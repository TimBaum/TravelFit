import User from '../models/User'
import GymAccount from '../models/GymAccount'
import { IUserWithId } from '@models/user'
import { IGymAccountWithId } from '@models/gymAccount'
import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { config } from '../config/config'
import { TokenPayload, AccountType } from '@models/token'

declare global {
  namespace Express {
    interface Request {
      ctx?: Context
    }
  }
}

// Context is either IUserWithId and IGymAccountWithId including the account type attribute or undefined
type Context =
  | ((IUserWithId | IGymAccountWithId) & { accountType: AccountType })
  | undefined

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

    const decoded = jwt.verify(token, config.JWT_SECRET) as TokenPayload

    let ctx: Context
    if (decoded.accountType === 'USER') {
      const user = await User.findById(decoded._id)
      if (!user) {
        throw new Error('No user found')
      }
      ctx = { ...user.toObject(), accountType: 'USER' }
    } else if (decoded.accountType === 'GYM_USER') {
      const gymAccount = await GymAccount.findById(decoded._id)
      if (!gymAccount) {
        throw new Error('No gym account found')
      }
      ctx = { ...gymAccount.toObject(), accountType: 'GYM_USER' }
    }
    req.ctx = ctx
    console.log(ctx)
  } catch (error) {
    // pass, since we also have non protected routes
  } finally {
    return next()
  }
}

async function isAuthorizedUser(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  if (!req.ctx || req.ctx.accountType !== 'USER')
    return res.status(401).json({ error: 'Unauthorized' })
  return next()
}

async function isAuthorizedGymAccount(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  if (!req.ctx || req.ctx.accountType !== 'GYM_USER')
    return res.status(401).json({ error: 'Unauthorized' })
  return next()
}

export default { isAuthorizedUser, isAuthorizedGymAccount, createUserContext }
