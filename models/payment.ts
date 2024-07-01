export interface IPayment {
  payPalId: string
  createdAt: Date
  status: 'ACTIVE' | 'CREATED' | 'CANCELLED'
  cancelledAt: Date
}

export interface PayPalSubscription {
  id: string
  create_time: string
  status: string
}
