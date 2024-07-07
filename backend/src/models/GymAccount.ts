import mongoose from 'mongoose'
import Address from './Address'
import Gym from './Gym.js'
import { ObjectId } from 'mongodb'

const gymAccountSchema = new mongoose.Schema({
  password: { type: String, required: true },
  email: { type: String, required: true, index: true },
  salutation: { type: String, required: true, enum: ['Mr.', 'Ms.', 'Diverse'] },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  address: { type: Address.schema, required: false }, // TODO: set to required:true. I set this to required:false because of errors since change from string to Address.schema
  phone: { type: String, required: true },
  favourites: { type: [ObjectId], ref: 'Gym' },
  gyms: { type: [Gym.schema], required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
})

const GymAccount = mongoose.model('GymAccount', gymAccountSchema)

export default GymAccount
