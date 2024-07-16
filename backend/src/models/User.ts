import mongoose from 'mongoose'
import Payment from './Payment'
import { ObjectId } from 'mongodb'

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  displayName: { type: String, required: true },
  salutation: { type: String, required: true, enum: ['Mr.', 'Ms.', 'Diverse'] },
  password: { type: String, required: true },
  picture: { type: String, required: false },
  payments: { type: [Payment.schema], required: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  favourites: { type: [ObjectId], ref: 'Gym' },
})

userSchema.index({ email: 1 }, { unique: true })

const User = mongoose.model('User', userSchema)

User.init().catch((err) => {
  console.error('Error creating indexes:', err)
})

export default User
