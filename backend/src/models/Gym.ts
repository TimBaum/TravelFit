// backend/src/models/Gym.js
import mongoose from 'mongoose';
import Adress from './Adress';
import TimeRange from './TimeRange';
import Offer from './Offer';
import Review from './Review';
import { ObjectId } from 'mongodb';

const gymSchema = new mongoose.Schema({
  owner: { type: ObjectId, ref: 'GymManager' },
  name: String,
  highlights: [{ type: String, enum: ["Sauna", "Posing room", "..."] }],
  websiteLink: String,
  pictures: [String],
  averageRating: Number,
  address: Adress,
  openingHours: [TimeRange],
  offers: [Offer],
  reviews: [Review],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const Gym = mongoose.model('Gym', gymSchema);

export default Gym;