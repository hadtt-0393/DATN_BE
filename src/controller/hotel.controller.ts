/** @format */

import { Request, Response } from "express";
import { Document } from "mongoose";
import HotelSchema from "../models/hotel";

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
			const {distance, description, usename, city} = req.body;
			const id = req.user.id;
			console.log(id)
            const hotel = await HotelSchema.findOneAndUpdate({ owner: id }, {
				distance: distance,
                description: description,
                username: usename,
                city: city,
				isActive: true,
			});
			console.log('log')
            return res.status(200).json(hotel);
		}
		catch(error){
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

};

export default HotelController;
