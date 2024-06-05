/** @format */

import { Request, Response } from "express";
import HotelSchema from "../models/hotel"
import RoomSchema from "../models/room";

interface RequestWithUser extends Request {
	user: any;
}

const RoomController = {
	async getListRoomsByHotel(req: Request, res: Response) {
		try {
			const id = req.params.id;
			const hotel = await HotelSchema.findById(id)
			const roomList = await Promise.all(
				hotel!.rooms.map((roomId) => {
					return RoomSchema.findById(roomId);
				}),
			);
			res.status(200).json(roomList);
		} catch (error) {
			return res.status(400).json({ error: error });
		}

	},

	async getAllRoomHotelByStaff(req: RequestWithUser, res: Response) {
		try {
			const id = req.user.id;
			const hotel = await HotelSchema.findOne({ owner: id });
			const roomList = await Promise.all(
				hotel!.rooms.map((roomId) => {
					return RoomSchema.findById(roomId);
				}),
			);
			res.status(200).json(roomList);
		} catch (error) {
			return res.status(400).json({ error: error });
		}
	},

	async updateRoomByStaff(req: RequestWithUser, res: Response) {
		try {
			const { roomNumber, price, name, status, description, type, image, max_person, services } = req.body;
			const id = req.params.id;
			const room = await RoomSchema.findByIdAndUpdate(id, {
				roomNumber: roomNumber,
				price: price,
				type: type,
				name: name,
				description: description,
				image: image,
				status: status,
				max_person: max_person,
				services: services
			},
				{
					new: true,
					useFindAndModify: false,
				}
			)
			res.status(200).json(room);
		} catch (error) {
			return res.status(400).json({ error: error });
		}
	},

	async createRoom(req: RequestWithUser, res: Response){
		try {
            const id = req.user.id;
			console.log(id)
			const { roomNumber, price, type, description, image, max_person, service } = req.body;
            const hotel = await HotelSchema.findOne({ owner: id });
            const room = new RoomSchema({
                roomNumber: roomNumber,
                price: price,
				type: type,
                description: description,
				image: image,
				max_person: max_person,
                status: true,
				services: service
            });
            await room.save();
            hotel!.rooms.push(room.id);
            await hotel!.save();
			
            res.status(200).json(room);
		} catch (error) {
			return res.status(400).json({ error: error });
		}
	},

	async getAllRoomFilter(req: Request, res: Response){
		try {
			const id = req.params.id;
			const { startDate, endDate, adult, children, roomNumber} : any = req.query
			const hotel = await HotelSchema.findById(id)

			const totalPeople = parseInt(adult) + parseInt(children);
			const roomNum = parseInt(roomNumber)
			const people = Math.ceil(totalPeople / roomNum);
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

			const roomList = await Promise.all(
				hotel!.rooms.map((roomId) => {
					return RoomSchema.findById(roomId);
				}),
			);

			const suitableRooms = roomList.filter(room => {
				return room && room.max_person >= people && isRoomAvailable(formatStart, formatEnd, room.bookings);
			});

			res.status(200).json(suitableRooms);

		} catch (error) {
			return res.status(400).json({ error: error });
		}
	}





};

export default RoomController;
