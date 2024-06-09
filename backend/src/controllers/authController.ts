import User from '../models/User'
import { Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import { config } from '../config/config'
import bcryptjs from 'bcryptjs'

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

      const token = jwt.sign(
        {
          email: user.email,
          name: user.displayName,
          userId: user._id,
        },
        config.JWT_SECRET,
        {
          expiresIn: '7days', //TODO: enforce
        },
      )
      return res.status(200).json({ token })
    })
}
