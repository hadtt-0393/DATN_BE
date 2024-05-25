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
			const { roomNumber, price, name, status, description, type, image } = req.body;
			const id = req.params.id;
			const room = await RoomSchema.findByIdAndUpdate(id, {
				roomNumber: roomNumber,
				price: price,
				type: type,
				name: name,
				description: description,
				image: image,
				status: status,
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
			const { roomNumber, price, type, description, image } = req.body;
            const hotel = await HotelSchema.findOne({ owner: id });
			console.log(hotel);
            const room = new RoomSchema({
                roomNumber: roomNumber,
                price: price,
				type: type,
                description: description,
				image: image,
                status: true,
            });
            await room.save();
            hotel!.rooms.push(room.id);
            await hotel!.save();
            res.status(200).json(room);
		} catch (error) {
			return res.status(400).json({ error: error });
		}
	}





};

export default RoomController;
