import mongoose from 'mongoose';

// const Comment = {
//   service: Number,
//   cleanliness: Number,
//   comfortable: Number,
//   facilities: Number,
//   content: String,
//   image: String,
//   created: Date
// }

const FormSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
    },
    hotelId: {
      type: String,
    },
    rooms: {
      type: [{
        roomId: String,
        quantity: Number,
      }],
    },
    name: {
      type: String,
    },
    cost: {
      type: Number,
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
      type: Object
    },
    adults: {
      type: Number,
    },
    children: {
      type: Number,
    },
    note: {
      type: String,
      default: '',
    },
    paymentStatus: {
      type: String,
    },
    rating: {
      type: Number,
      default: 0,
    }
  },
  { timestamps: true },
);

export default mongoose.model("form", FormSchema);
