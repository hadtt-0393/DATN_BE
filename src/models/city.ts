import mongoose from 'mongoose';

const CitySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    slogan: {
      type: String,
      required: true,
    },
    hotels: {
      type: [String],
      required: true,
    }
  },
);

export default mongoose.model('city', CitySchema);
