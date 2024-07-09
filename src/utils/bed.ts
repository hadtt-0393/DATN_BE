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

const createBed = (maxPeople: number) => {
    switch (maxPeople) {
        case 2: return [
            { bedId: "6678339f95f2653d4f5d9177", quantity: 1 },
        ]
        case 3: return [
            { bedId: "6678339095f2653d4f5d9176", quantity: 1 },
            { bedId: "6678339f95f2653d4f5d9177", quantity: 1 },
        ]
        case 4: return [
            { bedId: "6678339f95f2653d4f5d9177", quantity: 2 }
        ]
        case 5: return [
            { bedId: "668c43a969bae369e4e803a7", quantity: 1 }
        ]
        case 6: return [
            { bedId: "668c432869bae369e4e803a6", quantity: 1 },
            { bedId: "6678339f95f2653d4f5d9177", quantity: 1 },
        ]
        case 7: return [
            { bedId: "668c43a969bae369e4e803a7", quantity: 1 },
            { bedId: "6678339095f2653d4f5d9176", quantity: 1 },
        ]
        case 8: return [
            { bedId: "668c432869bae369e4e803a6", quantity: 1 },
            { bedId: "668c43a969bae369e4e803a7", quantity: 1 },
        ]
    }
}

export { getRoomsByBed, createBed }