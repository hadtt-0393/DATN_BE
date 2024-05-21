/** @format */

import { Request, Response } from "express";
import StaffSchema from "../models/staff";
import HotelSchema from "../models/hotel";

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
		const {distance, description, username, city} = req.body;
		const id = req.user.id;
		const staff = await StaffSchema.findByIdAndUpdate(id, {
			username: username,
			city: city,
		});
		const { password, ...info } = staff.toObject();

		if(distance && description){
			const hotel = await HotelSchema.findOneAndUpdate({ owner: id}, {
				username: username,
				distance: distance,
                description: description,
                city: city,
                isStaff: true,
			})
		}

		res.status(200).json(info);
	},

    async isLogin(req: Request, res: Response) {
        return res.status(200).json
            ({ isLogin: true });
    }
};

export default StaffController;