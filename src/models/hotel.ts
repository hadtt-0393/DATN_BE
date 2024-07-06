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
      default: null,
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
      default: null,
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
      default: true,
    },
    cheapestPrice: {
      type: Number,
      require: true,
      default: 250000,
    },
    // serviceAvg: {
    //   type: Number,
    //   min: 0,
    //   max: 5,
    //   default: 0,
    // },
    // cleanlinessAvg: {
    //   type: Number,
    //   min: 0,
    //   max: 5,
    //   default: 0,
    // },
    // comfortableAvg: {
    //   type: Number,
    //   min: 0,
    //   max: 5,
    //   default: 0,
    // },
    // facilitiesAvg: {
    //   type: Number,
    //   min: 0,
    //   max: 5,
    //   default: 0,
    // }
  },
  { timestamps: true },
);

export default mongoose.model('hotel', HotelSchema);
