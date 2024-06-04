// backend/src/models/Address.js
import mongoose from 'mongoose'

const addressSchema = new mongoose.Schema({
  street: String,
  postalCode: String,
  city: { type: String, index: true },
  country: String,
  latitude: Number,
  longitude: Number,
})

const Address = mongoose.model('Address', addressSchema)

export default Address
