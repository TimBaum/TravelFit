// backend/src/models/Payment.js
import mongoose from 'mongoose'

//payment is realized via paypal

const paymentSchema = new mongoose.Schema({
  payPalId: { type: String, required: true },
  createdAt: { type: Date, required: true },
  status: {
    type: String,
    enum: ['ACTIVE', 'CREATED', 'CANCELLED'],
    required: true,
  },
  cancelledAt: { type: Date, required: false },
})

const Payment = mongoose.model('Payment', paymentSchema)

export default Payment
