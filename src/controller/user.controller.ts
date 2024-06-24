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
        try {
            const user = await UserSchema.findById(id);
            const { password,...info } = user.toObject();
            res.status(200).json(info);
        }
        catch(err){
            console.log(err);
            return res.status(400).json({error: err});
        }
    }
};

export default UserController;