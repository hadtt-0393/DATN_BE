/** @format */

import { Request, Response } from "express";
import { Document } from "mongoose";
import HotelSchema from "../models/hotel";
import RoomSchema from "../models/room";

interface RequestWithUser extends Request {
	user: any;
}

const HotelController = {
	async getHotelsByCity(req: Request, res: Response) {
		try {
			const { city } = req.query
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
			return res.status(200).json(hotel);
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
			const { distance, description, hotelName, city, cheapestPrice, highestPrice, discount, address, services, images } = req.body;
			const id = req.user.id;
			const hotel = await HotelSchema.findOneAndUpdate({ owner: id }, {
				distance: distance,
				description: description,
				hotelName: hotelName,
				city: city,
				address: address,
				cheapestPrice: cheapestPrice,
				highestPrice: highestPrice,
				discount: discount,
				services,
				images,
				isActive: true,
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
			const Hotels = await HotelSchema.find({ isActive: true })
			return res.status(200).json(Hotels);
		} catch (error) {
			return res.status(400).json({ error: error });
		}

	},

	async getTopTenRating(req: Request, res: Response) {
		try {
			const top10Rating = await HotelSchema.find({ isActive: true })
				.sort({ ratingAvg: -1 })
				.limit(10);
			return res.status(200).json(top10Rating);
		} catch (err) {
			return res.status(400).json({ error: err });
		}
	},

	async getTopTenNewest(req: Request, res: Response) {
		try {
			const top10Newest = await HotelSchema.find({ isActive: true })
				.sort({ createdAt: -1 })
				.limit(10);
			return res.status(200).json(top10Newest);
		} catch (err) {
			return res.status(400).json({ error: err });
		}
	},

	async getHotelBySearch(req: Request, res: Response) {
		try {
			const { city, startDate, endDate, adult, children, roomNumber }: any = req.query
			if (!startDate && !endDate && !children && !adult && !roomNumber) {
				const hotels = await HotelSchema.find({ isActive: true, city });
				return res.status(200).json(hotels);
			}
			const totalPeople = parseInt(adult) + parseInt(children);
			const roomNum = parseInt(roomNumber)
			const people = Math.ceil(totalPeople / roomNum);
			const hotels = await HotelSchema.find({ isActive: true, city });
			const formatStart = new Date(startDate)
			const formatEnd = new Date(endDate)


			function isRoomAvailable(requestedStart: any, requestedEnd: any, bookings: any) {
				if (bookings.length === 0) return false;
				for (let booking of bookings) {
					if (!booking) {
						return false;
					}
					let bookedStart = new Date(booking.start);
					let bookedEnd = new Date(booking.end);
					if (requestedStart <= bookedEnd && requestedEnd >= bookedStart) {
						return false;
					}
				}
				return true;
			}

			const availableHotels = [];
			for (let hotel of hotels) {
				const roomList = await Promise.all(
					hotel!.rooms.map((roomId) => {
						return RoomSchema.findById(roomId);
					}),
				);

				const suitableRooms = roomList.filter(room => {
					return room && room.max_person >= people && isRoomAvailable(formatStart, formatEnd, room.bookings);
				});


				if (suitableRooms.length >= roomNum) {
					availableHotels.push({
						...hotel.toObject(),
						rooms: suitableRooms,
					});
				}
			}
			res.status(200).json(availableHotels);
		} catch (error) {
			return res.status(400).json({ error: error });
		}
	},

	async getHotelByFilter(req: Request, res: Response) {
		try {
			const { city, startDate, endDate, adult, children, roomNumber, serviceHotel, distance, serviceRoom, priceRange }: any = req.query;

			const totalPeople = parseInt(adult) + parseInt(children);
			const roomNum = parseInt(roomNumber);
			const people = Math.ceil(totalPeople / roomNum);
			const hotels = await HotelSchema.find({ isActive: true, city });
			const formatStart = new Date(startDate);
			const formatEnd = new Date(endDate);

			function isRoomAvailable(requestedStart: any, requestedEnd: any, bookings: any) {
				if (bookings.length === 0) return true;
				for (let booking of bookings) {
					if (!booking) {
						return true;
					}
					let bookedStart = new Date(booking.start);
					let bookedEnd = new Date(booking.end);
					if (requestedStart <= bookedEnd && requestedEnd >= bookedStart) {
						return false;
					}
				}
				return true;
			}

			const availableHotels = [];
			for (let hotel of hotels) {
				const serviceHotelArray = serviceHotel ? serviceHotel.split(',').map((service: any) => service.trim()) : [];
				

				if (serviceHotel && serviceHotel.length > 0) {
					const hotelServices = hotel.services
					const hasAllHotelServices = serviceHotelArray.every((service: any) => hotelServices.includes(service));
					if (!hasAllHotelServices) {
						continue;
					}
				}

				const distanceArray = distance ? distance.split(',').map((dist: string) => parseFloat(dist.trim())) : [];
				const maxDistance = Math.max(...distanceArray);
				if (distanceArray.length > 0 && hotel.distance >= maxDistance) {
					continue;
				}

				const roomList = await Promise.all(
					hotel!.rooms.map((roomId) => {
						return RoomSchema.findById(roomId);
					}),
				);

				const serviceRoomArray = serviceRoom ? serviceRoom.split(',').map((service: any) => service.trim()) : [];
				const priceRangeArray = priceRange ? priceRange.split(',').map((price: string) => parseFloat(price.trim())) : [];
				const minPrice = priceRangeArray[0];
				const maxPrice = priceRangeArray[1];



				const suitableRooms = roomList.filter((room: any) => {
					const roomServices = room.services
					const hasAllRoomServices = serviceRoomArray.every((service: any) => roomServices.includes(service));
					const isPriceInRange = priceRangeArray.length > 0 ? room.price >= minPrice && room.price <= maxPrice : true;
					return room && room.max_person >= people && isRoomAvailable(formatStart, formatEnd, room.bookings) && hasAllRoomServices && isPriceInRange;
				});

				if (suitableRooms.length >= roomNum) {
					availableHotels.push({
						...hotel.toObject(),
						rooms: suitableRooms,
					});
				}
			}

			return res.status(200).json({ hotels: availableHotels });

		} catch (error) {
			return res.status(400).json({ error: error });
		}
	}


};

export default HotelController;
