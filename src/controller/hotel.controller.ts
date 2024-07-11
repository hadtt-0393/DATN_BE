/** @format */

import { Request, Response } from "express";
import { Document } from "mongoose";
import HotelSchema from "../models/hotel";
import RoomSchema from "../models/room";
import CitySchema from "../models/city";
import serviceRoomSchema from "../models/serviceRoom";
import serviceHotelSchema from "../models/serviceHotel";
import {
	getHotelsByService,
	getHotelsByRating,
	getHotelsByRateAvg,
} from "../utils/hotel";
import { getListRoomActive, getQuantityRoomsIsAvailable } from "../utils/room";
import FormSchema from "../models/form";
import UserSchema from "../models/user";
interface RequestWithUser extends Request {
	user: any;
}

const HotelController = {
	async getDetailHotel(req: Request, res: Response) {
		try {
			const id = req.params.id;
			let hotel = (await HotelSchema.findById(id)) as any;
			const services = await serviceHotelSchema.find({
				_id: { $in: hotel!.serviceIds },
			});

			const roomsType = await RoomSchema.find(
				{
					_id: { $in: hotel!.roomIds },
					isActive: true,
				}
			)

			const totalRooms = roomsType.reduce((totalRoom, roomType) => totalRoom + roomType.quantity, 0)
			const hotelRating = await getHotelsByRating(hotel.toJSON());
			const forms = await FormSchema.find({hotelId: id})

			const formFilter = await FormSchema.find({
				hotelId: id,
				comment: { $exists: true },
			});
			const resultForms = await Promise.all(
				formFilter.map(async (form) => {
					const user = await UserSchema.findById(form.userId);
					const username = user.username;
					return {
						...form.toJSON(),
						username,
					};
				})
			);
			const hotelService = {
				...hotelRating,
				services: services.map((service) => service.serviceName),
				formsFeedback: resultForms,
				totalRooms: totalRooms,
			};
			return res.status(200).json(hotelService);
		} catch (error) {
			return res.status(400).json({ error: error });
		}
	},

	async getDetailhotelByStaff(req: RequestWithUser, res: Response) {
		try {
			const id = req.user.id;
			const hotel = await HotelSchema.findOne({ owner: id });
			return res.status(200).json(hotel);
		} catch (error) {
			return res.status(400).json({ error: error });
		}
	},

	async updateHotel(req: RequestWithUser, res: Response) {
		try {
			const {
				distance,
				description,
				hotelName,
				discount,
				address,
				serviceIds,
				images,
			} = req.body;
			const id = req.user.id;
			const hotel = await HotelSchema.findOneAndUpdate(
				{ owner: id },
				{
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
		} catch (error) {
			return res.status(400).json({ error: error });
		}
	},

	async getAllHotel(req: Request, res: Response) {
		try {
			const cities = await CitySchema.find({});
			let listCityId = [];
			for (let city of cities) {
				listCityId.push(...city.hotelIds);
			}
			let hotels = await HotelSchema.find({});
			hotels = (await Promise.all(
				hotels.map(async (hotel: any) => {
					let listRoomId = hotel.roomIds;
					const listServiceHotel = hotel.serviceIds;
					const serviceHotel = await serviceHotelSchema.find({
						_id: { $in: listServiceHotel },
					});
					let rooms = await RoomSchema.find({ _id: listRoomId });
					rooms = await Promise.all(
						rooms.map(async (room: any) => {
							const listServiceRoom = room.serviceIds;
							const services = await serviceRoomSchema.find({
								_id: { $in: listServiceRoom },
							});
							return {
								...room.toJSON(),
								services: services.map(
									(item) => item.serviceName
								),
							};
						})
					);
					return {
						...hotel.toJSON(),
						rooms,
						services: serviceHotel.map((item) => item.serviceName),
					};
				})
			)) as any;
			hotels = hotels.map((hotel: any) => {
				if (
					hotel.isActive &&
					listCityId.includes(hotel._id.toString())
				) {
					return { ...hotel, status: "Đang hoạt động" };
				}
				if (
					hotel.isActive &&
					!listCityId.includes(hotel._id.toString())
				) {
					return { ...hotel, status: "Đang chờ duyệt" };
				}
				if (hotel.isActive === false) {
					return { ...hotel, status: "Không duyệt" };
				}
			});
			hotels = await Promise.all(hotels.map(async (hotel: any) => {
				const listForm = await FormSchema.find({ hotelId: hotel._id, comment: { $exists: true } })
				if (listForm.length === 0) {
					return { ...hotel }
				}
				const ratingAvg = listForm.reduce((acc: any, form: any) => acc + form.rating, 0) / listForm.length;
				return { ...hotel, ratingAvg }
			}))
			return res.status(200).json(hotels);
		} catch (error) {
			return res.status(400).json({ error: error });
		}
	},

	async getTopTenRating(req: Request, res: Response) {
		try {
			let hotels = (await HotelSchema.find({ isActive: true })) as any;
			hotels = hotels.map((hotel: any) => hotel.toJSON());
			const hotelsByComments = (await Promise.all(
				hotels.map(async (hotel: any) => await getHotelsByRating(hotel))
			)) as any;
			let top10Hotels = hotelsByComments
				.filter((hotel: any) => hotel.ratingAvg !== undefined)
				.sort((a: any, b: any) => b.ratingAvg - a.ratingAvg)
				.slice(0, 10);

			top10Hotels = await getHotelsByService(top10Hotels);
			return res.status(200).json(top10Hotels);
		} catch (err) {
			return res.status(400).json({ error: err });
		}
	},

	async getTopTenNewest(req: Request, res: Response) {
		try {
			let hotels = (await HotelSchema.find({ isActive: true })) as any;
			hotels = hotels.map((hotel: any) => hotel.toJSON());
			const hotelsByComments = (await Promise.all(
				hotels.map(async (hotel: any) => await getHotelsByRating(hotel))
			)) as any;
			const top10Newest = hotelsByComments
				.sort((a: any, b: any) => a.createdAt - b.createdAt)
				.slice(0, 10);
			const result = await getHotelsByService(top10Newest);
			return res.status(200).json(result);
		} catch (err) {
			return res.status(400).json({ error: err });
		}
	},

	

	async getHotelBySearch(req: Request, res: Response): Promise<any> {
		try {
			const {
				city,
				startDate,
				endDate,
				adult,
				children,
				roomNumber,
			}: any = req.query;
			const totalPeopleNum = parseInt(adult) + parseInt(children);
			const roomNum = parseInt(roomNumber);
			const City = await CitySchema.findOne({ cityName: city });
			const listHotelByCity = await HotelSchema.find({
				_id: City?.hotelIds,
			});
			//Mảng hotel sau khi map xong trả ra kết quả mảng boolean theo thứ tự của từng hotel

			const hotelsMapBoolean = await Promise.all(
				listHotelByCity.map(async (hotel) => {
					const listRoom = await getListRoomActive(hotel.roomIds);
					if (listRoom.length === 0) {
						return false;
					}
					let totalRoomAvailable = 0;
					let totalPositionAvailable = 0;
					for (let room of listRoom) {
						const quantityRoomAvailable = getQuantityRoomsIsAvailable(
							room,
							startDate,
							endDate
						);
						totalRoomAvailable += quantityRoomAvailable;
						totalPositionAvailable +=
							quantityRoomAvailable * room!.maxPeople;
					}
					return (
						totalRoomAvailable >= roomNum &&
						totalPositionAvailable >= totalPeopleNum
					);
				})
			);

			//Filter hotel by [index] hotelsMapBoolean
			const resultSearchHotel = listHotelByCity
				.filter((hotel, index) => hotelsMapBoolean[index])
				.map((hotel) => hotel.toJSON());

			if (resultSearchHotel.length === 0) {
				return res.status(200).json([]);
			}


			const hotelService = await getHotelsByService(resultSearchHotel);
			const hotelRating = await Promise.all(
				hotelService.map(
					async (hotel: any) => await getHotelsByRateAvg(hotel)
				)
			);
			return res.status(200).json(hotelRating);
		} catch (error) {
			return res.status(400).json({ error: error });
		}
	},

	async getHotelByFilter(req: Request, res: Response) {
		try {
			const {
				city,
				startDate,
				endDate,
				adult,
				children,
				roomNumber,
				serviceHotel,
				distance,
				serviceRoom,
				priceRange,
			}: any = req.query;
			console.log(
				city,
				startDate,
				endDate,
				adult,
				children,
				roomNumber,
				distance,
				priceRange,
			);

			const totalPeopleNum = parseInt(adult) + parseInt(children);
			const roomNum = parseInt(roomNumber);
			const serviceRoomArray = serviceRoom
				? serviceRoom.split(",").map((service: any) => service.trim())
				: [];
			const distanceArray = distance
				? distance
					.split(",")
					.map((dist: string) => parseFloat(dist.trim()))
				: [];
			const serviceHotelArray = serviceHotel
				? serviceHotel.split(",").map((service: any) => service.trim())
				: [];
			const priceRangeArray = priceRange
				? priceRange
					.split(",")
					.map((price: string) => parseFloat(price.trim()))
				: [];
			const City = await CitySchema.findOne({ cityName: city });
			const listHotelByCity = await HotelSchema.find({
				_id: City?.hotelIds,
			});
			let hotelAvailable = [] as any;
			const hotelsMapBoolean = await Promise.all(
				listHotelByCity.map(async (hotel) => {
					const listRoom = await getListRoomActive(hotel.roomIds);
					if (listRoom.length === 0) {
						return false;
					}
					let totalRoomAvailable = 0;
					let totalPositionAvailable = 0;
					let roomIdsAvailable = [];
					for (let room of listRoom) {
						const quantityRoomAvailable = getQuantityRoomsIsAvailable(
							room,
							startDate,
							endDate
						);
						if (quantityRoomAvailable > 0) {
							roomIdsAvailable.push(room!._id);
						}
						totalRoomAvailable += quantityRoomAvailable;
						totalPositionAvailable +=
							quantityRoomAvailable * room!.maxPeople;
					}
					return {
						...hotel.toObject(),
						listRoomAvailable: roomIdsAvailable,
						isAvailable:
							totalRoomAvailable >= roomNum &&
							totalPositionAvailable >= totalPeopleNum,
					};
				})
			);

			const filterHotel = hotelsMapBoolean.filter(
				(hotel: any, index) => hotel.isAvailable
			) as any;


			if (filterHotel.length === 0) {
				return res.status(200).json([]);
			} else {
				for (let hotel of filterHotel) {
					const hotelServices = hotel.serviceIds;
					const hotelHasAllService = serviceHotelArray.every(
						(service: any) => hotelServices.includes(service)
					);
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
						const roomList = await RoomSchema.find({
							_id: roomAvailableIds,
						});
						const roomFilter = roomList.filter((room: any) => {
							const roomHasAllService = serviceRoomArray.every(
								(service: any) =>
									room.serviceIds.includes(service)
							);
							const isRoomComforPrice =
								priceRangeArray.length > 0
									? room.price >= minPrice &&
									room.price <= maxPrice
									: true;
							return roomHasAllService && isRoomComforPrice;
						});
						if (roomFilter.length > 0) {
							hotelAvailable.push(hotel);
						} else {
							continue;
						}
					}
				}


				const ResultFilterByService = await getHotelsByService(
					hotelAvailable
				);
				const hotelRating = await Promise.all(
					ResultFilterByService.map(
						async (hotel: any) => await getHotelsByRateAvg(hotel)
					)
				);
				return res.status(200).json(hotelRating);
			}
		} catch (error) {
			return res.status(400).json({ error: error });
		}
	},

	async updateStatusHotel(req: Request, res: Response) {
		try {
			const { id, status } = req.body;
			console.log(id)
			const hotel = await HotelSchema.findById(id);
			const city = hotel?.city;
			const cityHotel = await CitySchema.findOne({ cityName: city });
			if (status === "Đang hoạt động") {
				if (hotel?.isActive === false) {
					hotel.isActive = true;
					await hotel.save();
				}
				cityHotel?.hotelIds.push(id);
				await cityHotel?.save();
			}
			if (status === "Không duyệt") {
				hotel!.isActive = false;
				await hotel!.save();
				if (cityHotel?.hotelIds.includes(id)) {
					cityHotel.hotelIds = cityHotel.hotelIds.filter(
						(hotelId: any) => hotelId !== id
					);
					console.log(cityHotel.hotelIds)
					await cityHotel.save();
				}
			}
			return res.status(200).json({ message: "Update status success" });
		} catch (error) {
			return res.status(400).json({ error: error });
		}
	},
};

export default HotelController;
