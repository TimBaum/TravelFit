import mongoose from 'mongoose'
import { ObjectId } from 'mongodb'
import Address from './Address'

const gymAccountSchema = new mongoose.Schema({
  password: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  salutation: { type: String, required: true, enum: ['Mr.', 'Ms.', 'Diverse'] },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  address: { type: Address.schema, required: true },
  phone: { type: String, required: true },
  favourites: { type: [ObjectId], ref: 'Gym' },
  gyms: { type: [ObjectId], ref: 'Gym' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
})

gymAccountSchema.index({ email: 1 }, { unique: true })

const GymAccount = mongoose.model('GymAccount', gymAccountSchema)

GymAccount.init().catch((err) => {
  console.error('Error creating indexes for GymAccount:', err)
})

export default GymAccount
