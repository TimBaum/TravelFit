import { IAddress } from './adress'
import { IOffer } from './offer'
import { IReview } from './review'
import { ITimeRange } from './timeRange'

export interface IGym {
  name: string
  highlights: ['Sauna', 'Posing room', 'Pool']
  websiteLink: string
  pictures: [string]
  averageRating: Number
  address: IAddress
  openingHours: [ITimeRange]
  offers: [IOffer]
  reviews: [IReview]
  createdAt: Date
  updatedAt: Date
}

export interface IGymWithId extends IGym {
  id: string
}
