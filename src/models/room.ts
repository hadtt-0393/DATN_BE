import mongoose from 'mongoose';

const RoomSchema = new mongoose.Schema(
    {
        roomNumber: {
            type: String,
            required: true,
        },
        price: {
            type: Number,
            required: true,
        },
        type: {
            type: String,
            required: true,
        },
        services: {
            type: [String],
            required: true,
        },
        max_person: {
            type: Number,
            required: true,
        },
        image: {
            type: String,
            // required: true,
        },
        description: {
            type: String,
            required: true,
        },
        status: {
            type: Boolean,
            required: true,
        },
        isDiscount: {
            type: Number,
        },
        bookings: {
            type: Array,
            default: [],
        }
    },
    { timestamps: true },
);

export default mongoose.model('room', RoomSchema);
