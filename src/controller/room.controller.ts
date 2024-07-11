/** @format */

import { Request, Response } from "express";
import HotelSchema from "../models/hotel";
import RoomSchema from "../models/room";
import { createBed, getRoomsByBed } from "../utils/bed";
import {
	getListRoomActive,
	getQuantityRoomsIsAvailable,
	getRoomsByService,
} from "../utils/room";
import { generateCombinationDFS } from "../utils/search";

interface RequestWithUser extends Request {
	user: any;
}

const RoomController = {
	async getAllRoomHotelByStaff(req: RequestWithUser, res: Response) {
		const currentDate = new Date();
		const start = currentDate.toLocaleDateString("en-US");
		const end = new Date(
			currentDate.getTime() + 86400000
		).toLocaleDateString("en-US");
		try {
			const id = req.user.id;
			const hotel = await HotelSchema.findOne({ owner: id });
			let roomList = await Promise.all(
				hotel!.roomIds.map(async (roomId) => {
					return await RoomSchema.findOne({
						_id: roomId,
						isActive: true,
					});
				})
			);
			roomList = roomList.filter(
				(room) => room !== null && room !== undefined
			);
			if (roomList.length === 0) {
				return res.status(200).json([]);
			}
			roomList = roomList.map((room: any) => ({
				...room.toJSON(),
				quantityAvailable: getQuantityRoomsIsAvailable(room!, start, end),
			}));
			res.status(200).json(roomList);
		} catch (error) {
			return res.status(400).json({ error: error });
		}
	},

	async updateRoomByStaff(req: RequestWithUser, res: Response) {
		try {
			const {
				roomType,
				price,
				quantity,
				description,
				maxPeople,
				serviceIds,
				image,
			} = req.body;
			const id = req.params.id;
			const idStaff = req.user.id;
			const hotel = await HotelSchema.findOne({ owner: idStaff });
			const roomIds = hotel!.roomIds;
			if (!roomIds.includes(id)) {
				return res
					.status(200)
					.json({
						message:
							"Bạn không có quyền sửa room này khi không phải là chủ sở hữu",
					});
			}
			const room = await RoomSchema.findByIdAndUpdate(
				id,
				{
					roomType: roomType,
					quantity: quantity,
					price: price,
					maxPeople: maxPeople,
					description: description,
					serviceIds: serviceIds,
					image: image,
				},
				{
					new: true,
					useFindAndModify: false,
				}
			);
			res.status(200).json(room);
		} catch (error) {
			return res.status(400).json({ error: error });
		}
	},

	async deleteRoomByStaff(req: RequestWithUser, res: Response) {
		try {
			const id = req.params.id;
			const idStaff = req.user.id;
			const hotel = await HotelSchema.findOne({ owner: idStaff });
			const roomIds = hotel!.roomIds;
			if (!roomIds.includes(id)) {
				return res
					.status(200)
					.json({
						message:
							"Bạn không có quyền xóa room này khi không phải là chủ sở hữu",
					});
			}
			const room = await RoomSchema.findById(id);
			room!.isActive = false;
			await room!.save();
			res.status(200).json({ message: "Xóa room thành công" });
		} catch (error) {
			return res.status(400).json({ error: error });
		}
	},

	async createRoom(req: RequestWithUser, res: Response) {
		try {
			const id = req.user.id;
			const {
				roomType,
				price,
				quantity,
				description,
				image,
				maxPeople,
				services,
			} = req.body;
			const hotel = await HotelSchema.findOne({ owner: id });
			const room = new RoomSchema({
				roomType,
				quantity,
				price,
				description,
				image: image,
				maxPeople,
				serviceIds: services,
				beds: createBed(maxPeople),
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
			const { startDate, endDate, adult, children, roomNumber }: any =
				req.query;
			const totalPeople = parseInt(adult) + parseInt(children);
			const roomNum = parseInt(roomNumber);
			const hotel = await HotelSchema.findById(id);
			let roomList = await getListRoomActive(hotel!.roomIds);

			roomList = roomList.map((room) => ({
				...room!.toJSON(),
				quantity: getQuantityRoomsIsAvailable(room!, startDate, endDate),
				quantityAvailable: getQuantityRoomsIsAvailable(
					room!,
					startDate,
					endDate
				),
			}));
			const roomService: any = await getRoomsByService(roomList);
			const roomBed: any = await getRoomsByBed(roomService);
			const resultSearch = generateCombinationDFS(
				roomBed,
				totalPeople,
				roomNum
			);
			res.json(resultSearch);
		} catch (error) {
			console.log(error);
		}
	},

	async getAllRoomAvailable(req: Request, res: Response) {
		try {
			const id = req.params.id;
			const { startDate, endDate }: any = req.query;
			const hotel = await HotelSchema.findById(id);
			const listRoomActive = await getListRoomActive(hotel!.roomIds);

			const roomFilter = listRoomActive.filter((room) => {
				const availableRooms = getQuantityRoomsIsAvailable(
					room,
					startDate,
					endDate
				);
				return availableRooms > 0;
			}).map((room: any) => room.toObject());

			const resultRoomByService = await getRoomsByService(roomFilter);
			const resultRoomByBed = await getRoomsByBed(resultRoomByService);
			const resultRoomAvailable = resultRoomByBed.map((room) => {
				const quantityAvailable = getQuantityRoomsIsAvailable(
					room,
					startDate,
					endDate
				);
				return { ...room, quantityAvailable };
			});

			return res.status(200).json(resultRoomAvailable);
		} catch (error) {
			res.status(400).json({ error: error });
		}
	},
};

export default RoomController;
