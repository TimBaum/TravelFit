// backend/src/models/Offer.js
import exp from 'constants'
import mongoose from 'mongoose'

const offerSchema = new mongoose.Schema({
  title: String,
  type: String,
  isSpecial: Boolean,
  description: String,
  priceEuro: Number,
  startDate: Date,
  endDate: Date,
})

const Offer = mongoose.model('Offer', offerSchema)

export default Offer
