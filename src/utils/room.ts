import serviceRoomSchema from "../models/serviceRoom";
interface Room {
    serviceIds: string[];
    toObject: () => any;
};

function getQuantityRoomsIsActive(room: any, start: any, end: any) {
    const startTime = new Date(start);
    const endTime = new Date(end);
    if (room.bookings.length === 0) {
        return room.quantity;
    }
    else {
        let quantity = room.quantity;
        for (let booking of room.bookings) {
            let bookedStart = new Date(booking.start);
            let bookedEnd = new Date(booking.end);
            if (startTime <= bookedEnd && endTime >= bookedStart) {
                quantity--;
            }
        }
        return quantity;
    }
}

async function getRoomsByService(rooms: Room[]) {
    const resultRooms = await Promise.all(rooms.map(async (room) => {
        const services = await serviceRoomSchema.find({ _id: { $in: room.serviceIds } })
        return {
            ...room.toObject(),
            services: services.map(item => item.serviceName)
        };
    }))
    return resultRooms;
}

async function getRoomsByServiceVer2(rooms: Room[]) {
    const resultRooms = await Promise.all(rooms.map(async (room) => {
        const services = await serviceRoomSchema.find({ _id: { $in: room.serviceIds } })
        return {
            ...room,
            services: services.map(item => item.serviceName)
        };
    }))
    return resultRooms;
}

export { getQuantityRoomsIsActive, getRoomsByService, getRoomsByServiceVer2 }