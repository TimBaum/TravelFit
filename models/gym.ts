import { IAddress } from './address'
import { IOffer } from './offer'
import { IReview, IReviewPopulated } from './review'
import { ITimeRange } from './timerange'

export interface IGym {
  name: string
  highlights: Highlight[]
  websiteLink: string
  pictures: string[]
  averageRating: number
  cheapestOfferPrice: number
  address: IAddress
  openingHours: ITimeRange[]
  offers: IOffer[]
  reviews: IReview[]
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
  _id: string
}

// Allows to overwrite attributes of a type definition
type Modify<T, R> = Omit<T, keyof R> & R

export interface IGymWithIdPopulated
  extends Modify<
    IGymWithId,
    {
      reviews: IReviewPopulated[]
    }
  > {}
