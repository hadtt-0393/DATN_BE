import mongoose from 'mongoose';

const FormSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
    },
    hotelId: {
      type: String,
    },
    rooms: {
      type: [String],
    },
    name: {
      type: String,
    },
    address: {
      type: String,
    },
    email: {
      type: String,
    },
    phoneNumber: {
      type: String,
    },
    price: {
      type: Number,
    },
    startDate: { type: Date },
    endDate: { type: Date },
    comment: {
      type: String,
      default: '',
    },
    adults: {
      type: Number,
      default: 1,
    },
    children: {
      type: Number,
      default: 0,
    },
    note:{
      type: String,
      default: '',
    },
    paymentStatus: {
      type: String,
    },
    rating: {
      type: Number,
      default: 0,
    },
    isComment: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

export default mongoose.model("form", FormSchema);
