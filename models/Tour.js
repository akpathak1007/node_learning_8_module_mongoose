const mongoose = require('mongoose');

const tourSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    unique: true,
    trim: true
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
  },
  priceDiscount: {
    type: Number,
  },
  duration: {
    type: Number,
    required: [true, 'A tour must have a duration.'],
  },
  maxGroupSize: {
    type: Number,
    required: [true, 'Tour must have max group size.'],
  },
  difficulty: {
    type: String,
    required: [true, 'Tour must have difficulty field'],
  },
  summary: {
    type: String,
    trim: true,
    required: [true, 'A tour must have summary.'],
  },
  description: {
    type: String,
    trim: true
  },
  imageCover: {
    type: String,
    required: [true, 'Tour mush have Image cover.'],
  },
  ratingAverage: {
    type: Number,
    default: 4.5,
  },
  ratingQuntity: {
    type: Number,
    default: 0
  },
  images: [String],
  startDates: [Date],
  createdAt: {
    type: Date,
    default: Date.now(),
    select: false
  },
});

module.exports = mongoose.model('Tour', tourSchema);
