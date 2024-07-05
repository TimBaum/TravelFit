export interface PublicGymAccount {
  _id: string
  firstName: string
  lastName: string
  salutation: string
  email: string
  favourites: string[]
  gyms: string[]
}

export interface IGymAccount {
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
  gyms: string[]
}

export interface IGymAccountWithId extends IGymAccount {
  _id: string
}
