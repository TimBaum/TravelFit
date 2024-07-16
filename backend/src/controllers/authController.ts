import User from '../models/User'
import GymAccount from '../models/GymAccount'
import { Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import { config } from '../config/config'
import { PublicUser } from '@models/user'
import { PublicGymAccount } from '@models/gymAccount'
import { AccountType, TokenPayload } from '@models/token'
// library to hash passwords
import bcryptjs from 'bcryptjs'

/**  check if user exists and password is correct */
export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body
  try {
    let userPromise = User.findOne({ email: email }).exec() // email could belong to a user account or a gym account
    let gymAccountPromise = GymAccount.findOne({ email: email }).exec() // email could belong to a user account or a gym account

    //await both promises
    let [user, gymAccount] = await Promise.all([userPromise, gymAccountPromise])

    async function createToken(
      id: string,
      email: string,
      password: string,
      accountPassword: string,
      accountType: AccountType,
    ): Promise<string> {
      const arePasswordsMatching = await bcryptjs.compare(
        password,
        accountPassword,
      )

      if (!arePasswordsMatching) {
        throw new Error('Password are not matching')
      }

      // create a public user object to sign a token
      const userBody: TokenPayload = {
        _id: id,
        email: email,
        accountType: accountType,
      }

      const token = jwt.sign(userBody, config.JWT_SECRET, {
        expiresIn: '7days', //TODO: enforce
      })

      return token
    }

    if (!gymAccount && !user) throw new Error('No account found')

    let token: string = ''
    if (user) {
      token = await createToken(
        user._id.toString(),
        user.email,
        password,
        user.password,
        'USER',
      )
    }
    if (gymAccount) {
      token = await createToken(
        gymAccount._id.toString(),
        gymAccount.email,
        password,
        gymAccount.password,
        'GYM_USER',
      )
    }

    return res.status(200).json({ token })
  } catch (error) {
    console.log(error)
    return res.status(401).json({ error: 'Auth failed' })
  }
}
