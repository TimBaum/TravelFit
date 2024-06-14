import { IPayment } from './payment'
import { IGymWithId } from './gym'

export interface PublicUser {
  _id: string
  displayName: string
  salutation: string
  email: string
}

export interface IUser {
  email: string
  displayName: string
  salutation: string
  password: string
  hasPremiumSubscription: boolean
  picture: string
  payments: IPayment[]
  createdAt: Date
  updatedAt: Date
  favourites: IGymWithId[]
}
