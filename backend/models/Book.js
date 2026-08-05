const mongoose = require('mongoose');

const ratingSchema = mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    grade: {
      type: Number,
      required: true,
      min: 0,
      max: 5,
    },
  },
  { _id: false },
);

const bookSchema = mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    author: {
      type: String,
      required: true,
      trim: true,
    },
    imageUrl: {
      type: String,
      required: true,
    },
    year: {
      type: Number,
      required: true,
    },
    genre: {
      type: String,
      required: true,
      trim: true,
    },
    ratings: {
      type: [ratingSchema],
      default: [],
    },
    averageRating: {
      type: Number,
      min: 0,
      max: 5,
      default: 0,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model('Book', bookSchema);
