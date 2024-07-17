export interface TokenPayload {
  _id: string
  accountType: AccountType
  email: string
}

export type AccountType = 'USER' | 'GYM_USER' | 'NOT_LOGGED_IN'
