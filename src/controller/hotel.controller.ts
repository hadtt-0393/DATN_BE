/** @format */

import { Request, Response } from "express";
import { Document } from "mongoose";
import HotelSchema from "../models/hotel";

const AuthController = {
	async getHotelsByCity(req: Request, res: Response) {
		try {
			const city = req.params.city
			const hotels = await HotelSchema.find({ city });
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

	async getAllHotel(req: Request, res: Response) {
		try {
			const Hotels = await HotelSchema.find({})
			return res.status(200).json(Hotels);
		} catch (error) {
			return res.status(400).json({ error: error });
		}

	},

	async getTopTenRating(req: Request, res: Response) {
		try {
			const top10Rating = await HotelSchema.find({})
				.sort({ ratingAvg: -1 })  // Sắp xếp theo giá giảm dần
				.limit(10);           // Giới hạn kết quả trả về 10 bản ghi
			return res.status(200).json(top10Rating);
		} catch (err) {
			return res.status(400).json({ error: err });
		}
	},

	async getTopTenNewest(req: Request, res: Response) {
		try {
			const top10Newest = await HotelSchema.find({})
				.sort({ createdAt: -1 })  // Sắp xếp theo createdAt giảm dần
				.limit(10);               // Giới hạn kết quả trả về 10 bản ghi
			return res.status(200).json(top10Newest);
		} catch (err) {
			return res.status(400).json({ error: err });
		}
	},

	async createHotel(req: Request, res: Response) {
		try {
			const { name, city, rooms, ratingAvg } = req.body;
			const newHotel = await HotelSchema.create({
				name,
				city,
				rooms,
				ratingAvg
			})
			return res.status(200).json(newHotel)
		}
		catch (err) {
			return res.status(400).json({ error: err });
		}
	}
};

export default AuthController;
