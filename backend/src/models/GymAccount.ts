import mongoose from 'mongoose'
import Address from './Address'
import Gym from './Gym.js'

const gymAccountSchema = new mongoose.Schema({
  email: { type: String, required: true, index: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  phone: { type: String, required: true },
  salutation: { type: String, required: true, enum: ['Mr.', 'Ms.', 'Diverse'] },
  //password: { type: String, required: true },
  //address: { type: Address.schema, required: true },
  //gyms: { type: [Gym.schema], required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
})

const GymAccount = mongoose.model('GymAccount', gymAccountSchema)

export default GymAccount
