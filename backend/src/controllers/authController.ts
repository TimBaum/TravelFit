import User from '../models/User'
import { Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import { config } from '../config/config'
import { PublicUser } from '@models/user'
// library to hash passwords
import bcryptjs from 'bcryptjs'

// check if user exists and password is correct
export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body
  User.findOne({ email: email })
    .exec()
    .then(async (user) => {
      if (!user) {
        return res.status(401).json({ error: 'Auth failed' })
      }

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
      }

      const token = jwt.sign(userBody, config.JWT_SECRET, {
        expiresIn: '7days', //TODO: enforce
      })
      return res.status(200).json({ token })
    })
}
