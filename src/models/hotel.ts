import mongoose from 'mongoose';

const HotelSchema = new mongoose.Schema(
  {
    hotelName: {
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
      default: [],
      require: true,
    },
    city: {
      type: String,
      required: true,
    },
    distance: {
      type: Number,
      default: null,
      require: true,
    },
    description: {
      type: String,
      require: true,
    },
    ratingAvg: {
      type: Number,
      min: 0,
      max: 5,
      require: true,
    },
    discount: {
      type: Number,
      require: true,
      default: 0,
    },
    roomIds: {
      type: [String],
      require: true,
    },
    serviceIds: {
      type: [String],
      require: true,
    },
    isActive: {
      type: Boolean,
      required: true,
      default: false
    },
    serviceAvg: {
      type: Number,
      min: 0,
      max: 5,
    },
    cleanlinessAvg: {
      type: Number,
      min: 0,
      max: 5,
    },
    comfortableAvg: {
      type: Number,
      min: 0,
      max: 5,
    },
    facilitiesAvg: {
      type: Number,
      min: 0,
      max: 5,
    }
  },
  { timestamps: true },
);

export default mongoose.model('hotel', HotelSchema);
