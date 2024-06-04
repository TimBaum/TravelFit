// backend/src/models/Address.js
import mongoose from 'mongoose'

interface IAddress {
  street: string
  postalCode: string
  city: string
  country: string
  latitude: number
  longitude: number
}

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

export { IAddress }
