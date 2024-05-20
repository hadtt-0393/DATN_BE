import mongoose from 'mongoose';

const FormSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
    },
    hotelId: {
      type: String,
    },
    roomIds: {
      type: [String],
    },
    name: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
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
    childrent: {
      type: Number,
      default: 0,
    },
    note:{
      type: String,
      default: '',
    },
    paymentStatus: {
      type: Boolean,
      default: false,
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

module.exports = mongoose.model('Form', FormSchema);
