export interface IOffer {
  title: string
  type: string //'Subscription' | 'OneTime' | 'FreeTrial' | 'Special'
  isSpecial: boolean
  description: string
  //validityDays: number
  priceEuro: number
  startDate: Date
  endDate: Date
}
