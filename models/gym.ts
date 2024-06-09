import { IAddress } from './adress'
import { IOffer } from './offer'
import { IReview } from './review'
import { ITimeRange } from './timeRange'

export interface IGym {
  name: string
  highlights: Highlight[]
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

export type Highlight =
  | 'Sauna'
  | 'Posing room'
  | 'Pool'
  | 'Courses'
  | 'Personal trainings'
  | 'Nutrition bar'
  | 'Outdoor'
  | 'Parking'

export interface IGymWithId extends IGym {
  id: string
}
