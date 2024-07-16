import mongoose from 'mongoose'
import Gym from './Gym.js'
import { ObjectId } from 'mongodb'

const gymAccountSchema = new mongoose.Schema({
  password: { type: String, required: true },
  email: { type: String, required: true, index: true, unique: true },
  salutation: { type: String, required: true, enum: ['Mr.', 'Ms.', 'Diverse'] },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  // address: { type: String, required: true }, // TODO: use address.Schema
  phone: { type: String, required: true },
  favourites: { type: [ObjectId], ref: 'Gym' },
  gyms: { type: [ObjectId], ref: 'Gym' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
})

gymAccountSchema.index({ email: 1 }, { unique: true })

const GymAccount = mongoose.model('GymAccount', gymAccountSchema)

export default GymAccount
