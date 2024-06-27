export interface IPayment {
  date: Date
  total: number
  details: string
}

export interface PayPalSubscription {
  create_time: string
  id: string
  status: string
}
