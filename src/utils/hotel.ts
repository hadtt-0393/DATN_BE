import serviceHotelSchema from "../models/serviceHotel";
interface Hotel {
    serviceIds: string[];
    toObject: () => any;
    listRoomAvailable?: string[];
};

async function getHotelsByService(hotels: Hotel[]) {
    const resultHotels = await Promise.all(hotels.map(async (hotel) => {
        const services = await serviceHotelSchema.find({ _id: { $in: hotel.serviceIds } })
        return {
            ...hotel.toObject(),
            services: services.map(item => item.serviceName)
        };
    }))
    return resultHotels;
}

async function getHotelsByServiceVer2(hotels: Hotel[]) {
    const resultHotels = await Promise.all(hotels.map(async (hotel) => {
        const services = await serviceHotelSchema.find({ _id: { $in: hotel.serviceIds } })
        return {
            ...hotel,
            services: services.map(item => item.serviceName)
        };
    }))
    return resultHotels;
}

export { getHotelsByService, getHotelsByServiceVer2 }