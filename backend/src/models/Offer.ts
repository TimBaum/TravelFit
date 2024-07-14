// backend/src/models/Offer.js
import exp from 'constants'
import mongoose from 'mongoose'

const offerSchema = new mongoose.Schema({
  title: String,
  type: String,
  isSpecial: Boolean,
  // {
  //   type: String,
  //   enum: ['Subscription', 'OneTime', 'FreeTrial', 'Special'],
  // },
  description: String,
  // validityDays: Number,
  priceEuro: Number,
  startDate: Date,
  endDate: Date,
})

const Offer = mongoose.model('Offer', offerSchema)

export default Offer
