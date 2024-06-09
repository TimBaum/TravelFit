// backend/src/models/Address.js
import mongoose from 'mongoose'

const addressSchema = new mongoose.Schema({
  street: String,
  postalCode: String,
  city: { type: String, index: true },
  country: String,
  location: {
    type: { type: String, enum: ['Point'] },
    coordinates: [Number],
  },
})

const Address = mongoose.model('Address', addressSchema)

export default Address
