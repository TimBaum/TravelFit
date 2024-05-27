// backend/src/models/Offer.js
import mongoose from 'mongoose';

const offerSchema = new mongoose.Schema({
  title: String,
  type: { type: String, enum: ["Subscription", "OneTime", "FreeTrial", "..."] },
  description: String,
  validityDays: Number,
  priceEuro: Number,
  startDate: Date,
  endDate: Date
});

const Offer = mongoose.model("Offer", offerSchema);

export default Offer;