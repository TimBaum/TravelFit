// backend/src/models/TimeRange.ts
import mongoose from 'mongoose'

const timeRangeSchema = new mongoose.Schema({
  weekday1: String,
  weekday2: String,
  openingHour: { type: Number, required: true },
  closingHour: { type: Number, required: true },
})

//   weekday: Number,
//   openingTime: {
//     hour: Number,
//     minute: Number,
//   },
//   closingTime: {
//     hour: Number,
//     minute: Number,
//   },
// })

const TimeRange = mongoose.model('TimeRange', timeRangeSchema)

export default TimeRange
