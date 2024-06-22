/** @format */

import { Request, Response } from "express";
import UserSchema from "../models/user";
import FormSchema from "../models/form";

interface RequestWithUser extends Request {
   user: any;
} 


const UserController = {
	async getAllUser(req: RequestWithUser, res: Response) {
        const users = await UserSchema.find();
        return res.status(200).json(users);
    },

    async isLogin(req: RequestWithUser, res: Response) {
        const id = req.user.id;
        const user = await UserSchema.findById(id);
        const { password,...info } = user.toObject();
        res.status(200).json(info);
    }
};

export default UserController;