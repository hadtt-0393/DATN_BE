/** @format */

import { Request, Response } from "express";
import { Document } from "mongoose";
import HotelSchema from "../models/hotel";
import RoomSchema from "../models/room";
import CitySchema from "../models/city";
import serviceRoomSchema from "../models/serviceRoom";
import serviceHotelSchema from "../models/serviceHotel";
import { getHotelsByService, getHotelsByServiceVer2 } from "../utils/hotel";
import { getQuantityRoomsIsActive } from "../utils/room";
interface RequestWithUser extends Request {
	user: any;
}

interface ParamsSearchHotel {
	city: string;
	startDate: string;
	endDate: string;
	adult: string;
	children: string;
	roomNumber: string;
}

const HotelController = {
	async getHotelsByCity(req: Request, res: Response) {
		try {
			const { city } = req.params
			const hotels = await HotelSchema.find({ isActive: true, city });
			return res.status(200).json(hotels);
		} catch (error) {
			return res.status(400).json({ error: error });
		}
	},

	async getDetailHotel(req: Request, res: Response) {
		try {
			const id = req.params.id;
			const hotel = await HotelSchema.findById(id);
			const services = await serviceRoomSchema.find({ _id: { $in: hotel!.serviceIds } })
			const hotelService = { ...hotel?.toObject(), services: services.map(service => service.serviceName) };

			return res.status(200).json(hotelService);
		}
		catch (error) {
			return res.status(400).json({ error: error });
		}
	},

	async getDetailhotelV2(req: RequestWithUser, res: Response) {
		try {
			const id = req.user.id;
			const hotel = await HotelSchema.findOne({ owner: id });
			return res.status(200).json(hotel);
		}
		catch (error) {
			return res.status(400).json({ error: error });
		}
	},


	async updateHotel(req: RequestWithUser, res: Response) {
		try {
			const { distance, description, hotelName, discount, address, serviceIds, images } = req.body;
			const id = req.user.id;
			const hotel = await HotelSchema.findOneAndUpdate({ owner: id }, {
				hotelName: hotelName,
				address: address,
				distance: distance,
				description: description,	
				discount: discount,
				serviceIds,
				images,
			},
				{
					new: true,
					useFindAndModify: false,
				}
			);
			return res.status(200).json(hotel);
		}
		catch (error) {
			return res.status(400).json({ error: error });
		}
	},

	async getAllHotel(req: Request, res: Response) {
		try {
			let hotels = await HotelSchema.find({ isActive: true })
			hotels = await Promise.all(hotels.map(async(hotel: any) => {
				let listRoomId = hotel.roomIds;
				const listServiceHotel = hotel.serviceIds;
				const serviceHotel = await serviceHotelSchema.find({_id: {$in: listServiceHotel}})
				let rooms = await RoomSchema.find({_id: listRoomId});
				rooms = await Promise.all(rooms.map(async(room: any) => {
					const listServiceRoom = room.serviceIds;
					const services = await serviceRoomSchema.find({ _id: { $in: listServiceRoom } })
					return {...room.toJSON(), services: services.map(item => item.serviceName) };
				}))
				return {...hotel.toJSON(), rooms, services: serviceHotel.map(item => item.serviceName)};
			}))
			return res.status(200).json(hotels);
		} catch (error) {
			return res.status(400).json({ error: error });
		}
	},

	async getTopTenRating(req: Request, res: Response) {
		try {
			const top10Rating = await HotelSchema.find({ isActive: true })
				.sort({ ratingAvg: -1 })
				.limit(10);
			const result = await getHotelsByService(top10Rating);
			return res.status(200).json(result);
		} catch (err) {
			return res.status(400).json({ error: err });
		}
	},

	async getTopTenNewest(req: Request, res: Response) {
		try {
			const top10Newest = await HotelSchema.find({ isActive: true })
				.sort({ createdAt: -1 })
				.limit(10);
			const result = await getHotelsByService(top10Newest);
			return res.status(200).json(result);
		} catch (err) {
			return res.status(400).json({ error: err });
		}
	},

	async getHotelBySearch(req: Request, res: Response): Promise<any> {
		try {
			const { city, startDate, endDate, adult, children, roomNumber }: any = req.query;
			const totalPeopleNum = parseInt(adult) + parseInt(children);
			const roomNum = parseInt(roomNumber);
			const City = await CitySchema.findOne({ cityName: city });
			const listHotelByCity = await HotelSchema.find({ _id: City?.hotelIds })

			//Mảng hotel sau khi map xong trả ra kết quả mảng boolean theo thứ tự của từng hotel
			const hotelsMapBoolean = await Promise.all(listHotelByCity.map(async (hotel) => {
				const listRoomId = hotel.roomIds;
				const listRoom = await RoomSchema.find({ _id: listRoomId });
				let totalRoomAvailable = 0;
				let totalPositionAvailable = 0;
				for (let room of listRoom) {
					const quantityRoomActive = getQuantityRoomsIsActive(room, startDate, endDate);
					totalRoomAvailable += quantityRoomActive;
					totalPositionAvailable += quantityRoomActive * room.maxPeople;
				}
				return totalRoomAvailable >= roomNum && totalPositionAvailable >= totalPeopleNum;
			}));

			//Filter hotel by [index] hotelsMapBoolean 
			const filterHotel = listHotelByCity.filter((hotel, index) => hotelsMapBoolean[index]);
			const resultHotel = await getHotelsByService(filterHotel);
			return res.status(200).json(resultHotel);
		}
		catch (error) {
			return res.status(400).json({ error: error });
		}
	},

	async getHotelByFilter(req: Request, res: Response) {
		try {
			const { city, startDate, endDate, adult, children, roomNumber, serviceHotel, distance, serviceRoom, priceRange }: any = req.query;
			const totalPeopleNum = parseInt(adult) + parseInt(children);
			const roomNum = parseInt(roomNumber);
			const serviceRoomArray = serviceRoom ? serviceRoom.split(',').map((service: any) => service.trim()) : [];
			const distanceArray = distance ? distance.split(',').map((dist: string) => parseFloat(dist.trim())) : [];
			const serviceHotelArray = serviceHotel ? serviceHotel.split(',').map((service: any) => service.trim()) : [];
			const priceRangeArray = priceRange ? priceRange.split(',').map((price: string) => parseFloat(price.trim())) : [];
			const City = await CitySchema.findOne({ cityName: city });
			const listHotelByCity = await HotelSchema.find({ _id: City?.hotelIds })
			let hotelAvailable = [] as any;
			const hotelsFilter = await Promise.all(listHotelByCity.map(async (hotel) => {
				const listRoomId = hotel.roomIds;
				const listRoom = await RoomSchema.find({ _id: listRoomId });
				let totalRoomAvailable = 0;
				let totalPositionAvailable = 0;
				let roomIdsAvailable = [];
				for (let room of listRoom) {
					const quantityRoomActive = getQuantityRoomsIsActive(room, startDate, endDate);
					if (quantityRoomActive > 0) {
						roomIdsAvailable.push(room._id);
					}
					totalRoomAvailable += quantityRoomActive;
					totalPositionAvailable += quantityRoomActive * room.maxPeople;
				}
				return { ...hotel.toObject(), listRoomAvailable: roomIdsAvailable, isAvailable: totalRoomAvailable >= roomNum && totalPositionAvailable >= totalPeopleNum };
			}));


			const filterHotel = hotelsFilter.filter((hotel, index) => hotel.isAvailable);
			if (filterHotel.length === 0) {
				return res.status(200).json([]);
			}
			else {
				for (let hotel of filterHotel) {
					const hotelServices = hotel.serviceIds
					const hotelHasAllService = serviceHotelArray.every((service: any) => hotelServices.includes(service));
					if (distanceArray.length > 0) {
						const maxDistance = Math.max(...distanceArray);
						if (hotel.distance > maxDistance) {
							continue;
						}
					}
					if (!hotelHasAllService) {
						continue;
					}
					else {
						let minPrice = 0;
						let maxPrice = 0;
						if (priceRangeArray.length > 0) {
							minPrice = priceRangeArray[0];
							maxPrice = priceRangeArray[1];
						}
						const roomAvailableIds = hotel.listRoomAvailable;
						const roomList = await RoomSchema.find({ _id: roomAvailableIds });
						const roomFilter = roomList.filter((room: any) => {
							const roomHasAllService = serviceRoomArray.every((service: any) => room.serviceIds.includes(service))
							const isRoomComforPrice = priceRangeArray.length > 0 ? room.price >= minPrice && room.price <= maxPrice : true;
							return roomHasAllService && isRoomComforPrice;
						})
						if (roomFilter.length > 0) {
							hotelAvailable.push(hotel);
						}
						else {
							continue;
						}
					}
				}
				const ResultFilterByService = await getHotelsByServiceVer2(hotelAvailable);
				return res.status(200).json(ResultFilterByService)
			}
		}
		catch (error) {
			return res.status(400).json({ error: error });

		}
		// 	const totalPeopleNum = parseInt(adult) + parseInt(children);
		// 	const roomNum = parseInt(roomNumber);
		// 	const hotels = await HotelSchema.find({ isActive: true, city });
		// 	const formatStart = new Date(startDate);
		// 	const formatEnd = new Date(endDate);

		// 	function isRoomAvailable(requestedStart: any, requestedEnd: any, bookings: any) {
		// 		if (bookings.length === 0) return true;
		// 		for (let booking of bookings) {
		// 			if (!booking) {
		// 				return true;
		// 			}
		// 			let bookedStart = new Date(booking.start);
		// 			let bookedEnd = new Date(booking.end);
		// 			if (requestedStart <= bookedEnd && requestedEnd >= bookedStart) {
		// 				return false;
		// 			}
		// 		}
		// 		return true;
		// 	}

		// 	const availableHotels = [];
		// 	for (let hotel of hotels) {
		// 		const serviceHotelArray = serviceHotel ? serviceHotel.split(',').map((service: any) => service.trim()) : [];


		// 		if (serviceHotel && serviceHotel.length > 0) {
		// 			const hotelServices = hotel.services
		// 			const hasAllHotelServices = serviceHotelArray.every((service: any) => hotelServices.includes(service));
		// 			if (!hasAllHotelServices) {
		// 				continue;
		// 			}
		// 		}

		// 		const distanceArray = distance ? distance.split(',').map((dist: string) => parseFloat(dist.trim())) : [];
		// 		const maxDistance = Math.max(...distanceArray);
		// 		if (distanceArray.length > 0 && hotel.distance >= maxDistance) {
		// 			continue;
		// 		}

		// 		const roomList = await Promise.all(
		// 			hotel!.roomIds.map((roomId) => {
		// 				return RoomSchema.findById(roomId);
		// 			}),
		// 		);

		// 		const serviceRoomArray = serviceRoom ? serviceRoom.split(',').map((service: any) => service.trim()) : [];
		// 		const priceRangeArray = priceRange ? priceRange.split(',').map((price: string) => parseFloat(price.trim())) : [];
		// 		const minPrice = priceRangeArray[0];
		// 		const maxPrice = priceRangeArray[1];



		// 		const suitableRooms = roomList.filter((room: any) => {
		// 			const roomServices = room.services
		// 			const hasAllRoomServices = serviceRoomArray.every((service: any) => roomServices.includes(service));
		// 			const isPriceInRange = priceRangeArray.length > 0 ? room.price >= minPrice && room.price <= maxPrice : true;
		// 			return room && room.max_person >= people && isRoomAvailable(formatStart, formatEnd, room.bookings) && hasAllRoomServices && isPriceInRange;
		// 		});

		// 		if (suitableRooms.length >= roomNum) {
		// 			availableHotels.push({
		// 				...hotel.toObject(),
		// 				rooms: suitableRooms,
		// 			});
		// 		}
		// 	}

		// 	return res.status(200).json({ hotels: availableHotels });

		// } catch (error) {
		// 	return res.status(400).json({ error: error });
		// }
	}
};

export default HotelController;
