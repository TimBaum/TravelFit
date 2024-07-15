export interface PublicGymAccount {
  _id: string
  email: string
  salutation: string
  firstName: string
  lastName: string
  // address: string
  phone: string
  favourites: string[]
  gyms: string[]
  accountType: AccountType
}

export interface IGymAccount {
  password: string
  email: string
  salutation: string
  firstName: string
  lastName: string
  // address: string
  phone: string
  favourites: string[]
  gyms: string[]
  createdAt: Date
  updatedAt: Date
}

export interface IGymAccountWithId extends IGymAccount {
  _id: string
}

//TODO: deduplicate code
export type AccountType = 'USER' | 'GYM_USER' | 'NOT_LOGGED_IN'
