import mongoose from 'mongoose';

const HotelSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    owner: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      require: true,
    },
    hotline: {
      type: String,
      require: true,
    },
    images: {
      type: [String],
      require: true,
    },
    cheapestPrice: {
      type: Number,
      require: true,
    },
    highestPrice: {
      type: Number,
      require: true,
    },
    city: {
      type: String,
      required: true,
    },
    distance: {
      type: Number,
      require: true,
    },
    description: {
      type: String,
    },
    ratingAvg: {
      type: Number,
      min: 0,
      max: 5,
    },
    discount: {
      type: Number,
      default: 0,
    },
    roomIds: {
      type: [String],
    },
    roomType: {
      type: [String],
      require: true,
    },
    services: {
      type: [String],
      require: true,
    },
    featured: {
      type: Boolean,
      default: false,
    },
    comments: {
      type: [],
      default: [],
    },
    isActive: {
      type: Boolean,
      required: true,
      default: false
    }

  },
  { timestamps: true },
);

export default mongoose.model('hotel', HotelSchema);
