import mongoose from 'mongoose';

const HotelSchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    city: {
      type: String,
    },
    address: {
      type: String,
    },
    distance: {
      type: String,
    },
    photos: {
      type: [String],
    },
    description: {
      type: String,
    },
    rating: {
      type: Number,
      min: 0,
      max: 5,
    },
    rooms: {
      type: [String],
    },
    cheapestPrice: {
      type: Number,
    },
    services: {
      type: [String],
    },
    featured: {
      type: Boolean,
      default: false,
    },
    comment: {
      type: [],
      default: [],
    },
    ratingAvg: {
      type: Number,
      default: 0,
    }

  },
  { timestamps: true },
);

export default mongoose.model('hotel', HotelSchema);
