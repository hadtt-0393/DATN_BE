import mongoose from 'mongoose';

const BedSchema = new mongoose.Schema(
    {
        bedName: {
            type: String,
            required: true,
        },
    },
);

export default mongoose.model('bed', BedSchema);
