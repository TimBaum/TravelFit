// backend/src/models/Gym.js
import mongoose, { Document, Schema } from 'mongoose'
import Address, { IAddress } from './Address'
import TimeRange from './TimeRange'
import Offer from './Offer'
import Review from './Review'

export interface IGym {
  name: String
  highlights: String[]
  websiteLink: String
  pictures: String[]
  averageRating: Number
  address: IAddress
  // ...
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
