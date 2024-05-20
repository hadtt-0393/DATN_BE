/** @format */

import { Request, Response } from "express";
import HotelSchema from "../models/hotel"
import RoomSchema from "../models/room";

const RoomController = {
	async getListRoomsByHotel(req: Request, res: Response) {
		const id = req.params.id;
		const hotel = await HotelSchema.findById(id)
		const roomList = await Promise.all(
			hotel!.roomIds.map((roomId) => {
				return RoomSchema.findById(roomId);
			}),
		);
		res.status(200).json(roomList);
	},


};

export default RoomController;
