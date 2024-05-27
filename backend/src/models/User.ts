// backend/src/models/User.js
import mongoose from 'mongoose';
import Payment from './Payment';

const userSchema = new mongoose.Schema({
  email: { type: String, index: true },
  displayName: String,
  picture: String,
  salutation: { type: String, enum: ["Mr.", "Ms.", "Diverse"] },
  password: String,
  hasPremiumSubscription: Boolean,
  payments: [Payment],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);

export default User;
