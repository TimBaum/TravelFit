import mongoose from 'mongoose';
import Payment from './Payment';

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, index: true },
  displayName: {type: String, required: true},
  picture: {type: String, required: false},
  salutation: { type: String, required: true, enum: ["Mr.", "Ms.", "Diverse"] },
  password: {type: String, required: true},
  hasPremiumSubscription: {type: Boolean, required: true},
  payments: {type: [Payment], required: false},
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);

export default User;
