import mongoose from 'mongoose'
import Payment from './Payment'
import Gym from './Gym'

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, index: true },
  displayName: { type: String, required: true },
  salutation: { type: String, required: true, enum: ['Mr.', 'Ms.', 'Diverse'] },
  password: { type: String, required: true },
  hasPremiumSubscription: { type: Boolean, required: true },
  //picture: { type: String, required: false },
  //payments: { type: [Payment], required: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  favourites: { type: Array, ref: 'Gym' },
})

const User = mongoose.model('User', userSchema)

export default User
