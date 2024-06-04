// backend/src/models/Gym.js
import mongoose, { Document, Schema } from 'mongoose'
import Adress from './Address'
import TimeRange from './TimeRange'
import Offer from './Offer'
import Review from './Review'
import { ObjectId } from 'mongodb'

export interface IGym {
  name: String
}

export interface IGymModel extends IGym, Document {}

const GymSchema: Schema = new mongoose.Schema({
  name: String,
  highlights: [{ type: String, enum: ['Sauna', 'Posing room', 'Pool'] }],
  websiteLink: String,
  pictures: [String],
  averageRating: Number,
  address: Adress.schema,
  openingHours: [TimeRange.schema],
  offers: [Offer.schema],
  reviews: [Review.schema],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
})

export default mongoose.model<IGymModel>('Gym', GymSchema)
