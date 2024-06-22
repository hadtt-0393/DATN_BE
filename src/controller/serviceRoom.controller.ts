/** @format */

import { Request, Response } from "express";
import ServiceRoomSchema from "../models/serviceRoom";


const ServiceRoomController = {
    async getAllServiceRoomSystem(req: Request, res: Response) {
        try {
            const servicesRoomSystem = await ServiceRoomSchema.find({})
            return res.status(200).json(servicesRoomSystem);
        } catch (error) {
            return res.status(400).json({ error: error });
        }

    },
};

export default ServiceRoomController;
