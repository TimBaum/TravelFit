export interface IOffer {
  title: string
  type: 'Subscription' | 'OneTime' | 'FreeTrial' | '...'
  description: string
  validityDays: number
  priceEuro: number
  startDate: Date
  endDate: Date
}
