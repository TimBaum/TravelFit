// backend/src/models/Review.js
import { ObjectId } from 'mongodb'
import mongoose from 'mongoose'

interface IReview {
  author: ObjectId
  rating: Number
  text: String
}

const reviewSchema = new mongoose.Schema({
  author: { type: ObjectId, ref: 'User' },
  rating: Number,
  text: String,
})

const Review = mongoose.model('Review', reviewSchema)

export default Review

export { IReview }
