import mongoose from 'mongoose';

const ServiceHotelSchema = new mongoose.Schema(
    {
        serviceName: {
            type: String,
            required: true,
        },
    },
);

export default mongoose.model('serviceHotel', ServiceHotelSchema);
