/** @format */

import { Request, Response } from "express";
import HotelSchema from "../models/hotel"
import RoomSchema from "../models/room";
import { generateCombinationDFS } from "../utils/search";
import { getQuantityRoomsIsActive, getRoomsByService } from "../utils/room";
import { getRoomsByBed } from "../utils/bed";
import { totalmem } from "os";

interface RequestWithUser extends Request {
	user: any;
}

const RoomController = {
	async getListRoomsByHotel(req: Request, res: Response) {
		try {
			const id = req.params.id;
			const hotel = await HotelSchema.findById(id)
			const roomList = await Promise.all(
				hotel!.roomIds.map((roomId) => {
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
				hotel!.roomIds.map((roomId) => {
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

	async createRoom(req: RequestWithUser, res: Response) {
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
			hotel!.roomIds.push(room.id);
			await hotel!.save();

			res.status(200).json(room);
		} catch (error) {
			return res.status(400).json({ error: error });
		}
	},

	async getAllRoomFilter(req: Request, res: Response) {
		try {
			const id = req.params.id;
			const { startDate, endDate, adult, children, roomNumber }: any = req.query;
			const totalPeople = parseInt(adult) + parseInt(children);
			const roomNum = parseInt(roomNumber);
			const hotel = await HotelSchema.findById(id);
			let roomList = await RoomSchema.find({ _id: hotel?.roomIds });
			roomList = roomList.map((room) => ({ ...room.toJSON(), quantity: getQuantityRoomsIsActive(room!, startDate, endDate) }));
			const resultSearch = generateCombinationDFS(roomList, totalPeople, roomNum);
			res.json(resultSearch);
		}
		catch (error) {
			console.log(error);
		}
	},

	async getAllRoomAvailable(req: Request, res: Response) {
		try {
			const id = req.params.id;
			const { startDate, endDate }: any = req.query;
			const hotel = await HotelSchema.findById(id);
			const listIdRoom = hotel?.roomIds;
			const listRoom = await RoomSchema.find({ _id: listIdRoom });
			const roomFilter = listRoom
				.filter((room) => {
					const activeRooms = getQuantityRoomsIsActive(room, startDate, endDate);
					return activeRooms > 0;
				})

			const resultRoomByService = await getRoomsByService(roomFilter);
			const resultRoomByBed = await getRoomsByBed(resultRoomByService)
			const resultRoomAvailable = resultRoomByBed.map((room) => {
				const quantityAvailable = getQuantityRoomsIsActive(room, startDate, endDate);
				return { ...room, quantityAvailable}
			})

			return res.status(200).json(resultRoomAvailable);
		}
		catch (error) {
			res.status(400).json({ error: error });
		}
	}

};

export default RoomController;
