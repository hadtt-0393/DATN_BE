/** @format */

import { Request, Response } from "express";
import UserSchema from "../models/user";
import FormSchema from "../models/form";
import HotelSchema from "../models/hotel";

interface RequestWithUser extends Request {
    user: any;
}


const UserController = {
    async getAllUser(req: RequestWithUser, res: Response) {
        try {
            const users = await UserSchema.find();
            let usersForm = await Promise.all(users.map(async (user: any) => {
                const userId = user._id;
                let forms = await FormSchema.find({ userId: userId });
                forms = await Promise.all(forms.map(async(form: any) => {
                    const hotelId = form.hotelId;
                    const hotel = await HotelSchema.findById(hotelId);
                    return {
                       ...form.toJSON(),
                        hotel: hotel
                    }
                }))
                return {...user.toJSON(), forms}
            }))
            return res.status(200).json(usersForm);
        }
        catch (err) {
            return res.status(404).json({ error: err });
        }

    },

    async isLogin(req: RequestWithUser, res: Response) {
        const id = req.user.id;
        try {
            const user = await UserSchema.findById(id);
            const { password, ...info } = user.toObject();
            res.status(200).json(info);
        }
        catch (err) {
            return res.status(400).json({ error: err });
        }
    }
};

export default UserController;