export interface IOffer {
  title: string
  type: string // 'Subscription' | 'OneTime' | 'FreeTrial'
  isSpecial: boolean
  description: string
  priceEuro: number
  startDate: Date
  endDate: Date
}
