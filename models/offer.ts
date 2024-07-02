export interface IOffer {
  title: string
  type: 'Subscription' | 'OneTime' | 'FreeTrial' | 'Special' | '...'
  description: string
  validityDays: number
  priceEuro: number

  // Special Offer
  startDate: Date
  endDate: Date
}
