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

    async isLogin(req: Request, res: Response) {
        return res.status(200).json
            ({ isLogin: true });
    }
};

export default UserController;