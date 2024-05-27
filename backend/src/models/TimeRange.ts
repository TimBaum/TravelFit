// backend/src/models/TimeRange.js
import mongoose from 'mongoose';

const timeRangeSchema = new mongoose.Schema({
  weekday: Number,
  openingTime: {
    hour: Number,
    minute: Number
  },
  closingTime: {
    hour: Number,
    minute: Number
  }
});

const TimeRange = mongoose.model("TimeRange", timeRangeSchema); 

export default TimeRange; 