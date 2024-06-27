// backend/src/models/Payment.js
import mongoose from 'mongoose'

//payment is realized via paypal

const paymentSchema = new mongoose.Schema({
  payPalId: String,
  created: Date,
  status: {
    type: String,
    enum: ['ACTIVE', 'CREATED', 'CANCELLED'],
  },
})

const Payment = mongoose.model('Payment', paymentSchema)

export default Payment
