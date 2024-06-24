import mongoose from 'mongoose';

const RoomSchema = new mongoose.Schema(
    {
        roomType: {
            type: String,
            required: true,
        },
        quantity: {
            type: Number,
            required: true,
        },
        price: {
            type: Number,
            required: true,
        },
        serviceIds: {
            type: [String],
            required: true,
        },
        image: {
            type: String,
            // required: true,
        },
        maxPeople: {
            type: Number,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        bookings: {
            type: Array,
            default: [],
        },
        beds: {
            type: Array,
            default: [],
        }
    },
    { timestamps: true },
);

export default mongoose.model('room', RoomSchema);
