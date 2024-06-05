// backend/src/models/Gym.js
import mongoose, { Document, Schema } from 'mongoose'
import Address, { IAddress } from './Address'
import TimeRange, { ITimeRange } from './TimeRange'
import Offer, { IOffer } from './Offer'
import Review, { IReview } from './Review'

export interface IGym {
  name: string
  highlights: 'Sauna' | 'Posing room' | 'Pool'
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

export interface IGymModel extends IGym, Document {}

const GymSchema: Schema = new mongoose.Schema({
  name: { type: String, required: true },
  highlights: [{ type: String, enum: ['Sauna', 'Posing room', 'Pool'] }],
  websiteLink: { type: String, required: true },
  pictures: [String],
  averageRating: Number,
  address: { type: Address.schema, required: true },
  openingHours: [TimeRange.schema],
  offers: [Offer.schema],
  reviews: [Review.schema],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
})

export default mongoose.model<IGymModel>('Gym', GymSchema)
