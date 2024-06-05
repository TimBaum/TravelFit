// backend/src/models/Offer.js
import exp from 'constants'
import mongoose from 'mongoose'

interface IOffer {
  title: string
  type: 'Subscription' | 'OneTime' | 'FreeTrial' | '...'
  description: string
  validityDays: number
  priceEuro: number
  startDate: Date
  endDate: Date
}

const offerSchema = new mongoose.Schema({
  title: String,
  type: { type: String, enum: ['Subscription', 'OneTime', 'FreeTrial', '...'] },
  description: String,
  validityDays: Number,
  priceEuro: Number,
  startDate: Date,
  endDate: Date,
})

const Offer = mongoose.model('Offer', offerSchema)

export default Offer

export { IOffer }
