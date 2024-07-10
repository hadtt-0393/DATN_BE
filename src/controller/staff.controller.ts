/** @format */

import { Request, Response } from "express";
import StaffSchema from "../models/staff";
import HotelSchema from "../models/hotel";
import CitySchema from "../models/city";

interface RequestWithUser extends Request {
	user: any;
}


const StaffController = {
	async getInfo(req: RequestWithUser, res: Response) {
		const id = req.user.id;
		const staff = await StaffSchema.findById(id);
		const { password, ...info } = staff.toObject();
		res.status(200).json(info);
	},

	async updateInfo(req: RequestWithUser, res: Response) {
		const { distance, description, username, city } = req.body;
		const id = req.user.id;
		const staff = await StaffSchema.findByIdAndUpdate(id, {
			username: username,
			city: city,
		});
		const { password, ...info } = staff.toObject();

		if (distance && description) {
			const hotel = await HotelSchema.findOneAndUpdate({ owner: id }, {
				username: username,
				distance: distance,
				description: description,
				city: city,
				isStaff: true,
			})
		}

		res.status(200).json(info);
	},

	async isLogin(req: RequestWithUser, res: Response) {
		const id = req.user.id;
		let staff = await StaffSchema.findById(id);
		const hotel = await HotelSchema.findOne({owner: id})
		const hotelStatus = hotel?.isActive
		if (hotelStatus === false) {
			staff = { ...staff.toObject(), status: "Bị từ chối" }
			const { password, ...info } = staff;
			return res.status(200).json({ info, isLogin: true });
		}
		else {
			const cityName = staff.city
			const city = await CitySchema.findOne({ cityName })
			const hotelIds = city!.hotelIds
			if (hotelIds.includes(hotel.id)) {
				staff = { ...staff.toObject(), status: "Đã xác thực" }
				const { password, ...info } = staff;
				return res.status(200).json({ info, isLogin: true });
			}
			else {
				staff = { ...staff.toObject(), status: "Đang xác thực" }
				const { password, ...info } = staff;
				return res.status(200).json({ info, isLogin: true });
			}
		}
	}
};

export default StaffController;