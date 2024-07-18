import { IAddress } from './address'

export interface PublicGymAccount {
  _id: string
  email: string
  salutation: string
  firstName: string
  lastName: string
  address: IAddress
  phone: string
  gyms: string[]
}

export interface IGymAccount {
  password: string
  email: string
  salutation: string
  firstName: string
  lastName: string
  address: IAddress
  phone: string
  gyms: string[]
  createdAt: Date
  updatedAt: Date
}

export interface IGymAccountWithId extends IGymAccount {
  _id: string
}
