import BedSchema from "../models/bed";

interface Bed {
    bedId: string;
    quantity: number;
    bedName: string;
    toObject: () => any;
};

interface Room {
    beds: Bed[];
    toObject: () => any;
};

async function getRoomsByBed(rooms: Room[]) {
    const resultRooms = await Promise.all(rooms.map(async (room) => {
        let BED = [] as any;
        for (let bed of room.beds) {
            const Bed = await BedSchema.findById(bed.bedId);
            BED.push({ ...Bed?.toObject(), quantity: bed.quantity });
        }
        return {
            ...room,
            Beds: BED.map((item: any) => {
                return { bedName: item?.bedName, quantity: item?.quantity }
            })
        };
    }))
    return resultRooms;
}

export { getRoomsByBed }