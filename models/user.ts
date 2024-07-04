import { IPayment } from './payment'

export interface PublicUser {
  _id: string
  displayName: string
  salutation: string
  email: string
  favourites: string[]
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
  favourites: string[]
}

export interface IUserWithId extends IUser {
  _id: string
}

export interface IGymUser {
  email: string
  firstName: string
  lastName: string
  salutation: string
  address: string
  phone: string
  password: string
  createdAt: Date
  updatedAt: Date
  favourites: string[]
}

export interface IGymUserWithId extends IGymUser {
  _id: string
}
