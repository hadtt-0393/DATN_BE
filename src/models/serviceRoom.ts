import mongoose from 'mongoose';

const ServiceRoomSchema = new mongoose.Schema(
    {
        serviceName: {
            type: String,
            required: true,
        },
    },
);

export default mongoose.model('serviceRoom', ServiceRoomSchema);
