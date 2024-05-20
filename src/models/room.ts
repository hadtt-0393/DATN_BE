import mongoose from 'mongoose';

const RoomSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        type: {
            type: String,
            required: true,
        },
        services: {
            type: [String],
        },
        max_person: {
            type: Number,
            required: true,
        },
        price: {
            type: Number,
            required: true,
        },
        image: {
            type: String,
            required: true,
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
        busyDate: {
            type: [String]
        }
    },
    { timestamps: true },
);

export default mongoose.model('room', RoomSchema);
