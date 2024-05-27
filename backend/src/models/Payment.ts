// backend/src/models/Payment.js
import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema({
  date: Date,
  total: Number,
  details: String
});

const Payment = mongoose.model("Payment", paymentSchema);

export default Payment;