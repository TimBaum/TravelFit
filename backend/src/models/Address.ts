// backend/src/models/Address.js
import mongoose from 'mongoose'

const pointSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['Point'],
    required: true,
  },
  coordinates: {
    type: [Number],
    required: true,
  },
})

const addressSchema = new mongoose.Schema({
  street: String,
  postalCode: String,
  city: { type: String, index: true },
  country: String,
  location: {
    type: pointSchema,
    index: '2dsphere',
  },
})

const Address = mongoose.model('Address', addressSchema)

export default Address
