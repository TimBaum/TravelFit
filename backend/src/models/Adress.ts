// backend/src/models/Address.js
import mongoose from 'mongoose';

const addressSchema = new mongoose.Schema({
  street: String,
  postalCode: String,
  city: { type: String, index: true },
  country: String,
  latitude: Number,
  longitude: Number
});

const Adress = mongoose.model("Adress", addressSchema);

export default Adress;