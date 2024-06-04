// backend/src/models/GymManager.js
import mongoose from 'mongoose'
import Address from './Address'
import Gym from './Gym.js'

const gymManagerSchema = new mongoose.Schema({
  email: { type: String, index: true },
  firstName: String,
  lastName: String,
  phone: String,
  salutation: { type: String, enum: ['Mr.', 'Ms.', 'Diverse'] },
  password: String,
  address: Address,
  gyms: [Gym],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
})

const GymManager = mongoose.model('GymManager', gymManagerSchema)

export default GymManager
