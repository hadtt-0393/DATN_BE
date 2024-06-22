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

export { getQuantityRoomsIsActive };