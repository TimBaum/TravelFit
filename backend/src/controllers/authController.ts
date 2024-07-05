import User from '../models/User'
import GymAccount from '../models/GymAccount'
import { Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import { config } from '../config/config'
import { PublicUser } from '@models/user'
import { PublicGymAccount } from '@models/gymAccount'
// library to hash passwords
import bcryptjs from 'bcryptjs'

/**  check if user exists and password is correct */
export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body
  try {
    let user = await User.findOne({ email: email }).exec()
    let gymAccount = await GymAccount.findOne({ email: email }).exec()
    let token

    if (user) {
      const arePasswordsMatching = await bcryptjs.compare(
        password,
        user.password,
      )

      if (!arePasswordsMatching) {
        return res.status(401).json({ error: 'Auth failed' })
      }
      // create a public user object to sign a token
      const userBody: PublicUser = {
        _id: user._id.toString(),
        email: user.email,
        displayName: user.displayName,
        salutation: user.salutation,
        favourites: [], //TODO: implement favorites if they should be inside the token @leonie
      }

      token = jwt.sign(userBody, config.JWT_SECRET, {
        expiresIn: '7days', //TODO: enforce
      })
    } else if (gymAccount) {
      const arePasswordsMatching = await bcryptjs.compare(
        password,
        gymAccount.password,
      )

      if (!arePasswordsMatching) {
        return res.status(401).json({ error: 'Auth failed' })
      }
      // create a public gymAccount object to sign a token
      const gymAccountBody: PublicGymAccount = {
        _id: gymAccount._id.toString(),
        email: gymAccount.email,
        firstName: gymAccount.firstName,
        lastName: gymAccount.lastName,
        salutation: gymAccount.salutation,
        favourites: [], //TODO: implement favorites if they should be inside the token @leonie
        gyms: [], //TODO: implement gyms if they should be inside the token @leon
      }

      token = jwt.sign(gymAccountBody, config.JWT_SECRET, {
        expiresIn: '7days', //TODO: enforce
      })
    } else {
      return res.status(401).json({ error: 'Auth failed' })
    }

    return res.status(200).json({ token })
  } catch (error) {
    return res.status(401).json({ error: 'Auth failed' })
  }
}
