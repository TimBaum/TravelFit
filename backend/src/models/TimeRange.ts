// backend/src/models/TimeRange.ts
import mongoose from 'mongoose'

const timeRangeSchema = new mongoose.Schema({
  weekday: Number,
  openingTime: String, //hh:mm
  closingTime: String, //hh:mm
})

const TimeRange = mongoose.model('TimeRange', timeRangeSchema)

export default TimeRange
