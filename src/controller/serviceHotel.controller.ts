/** @format */

import { Request, Response } from "express";
import ServiceHotelSchema from "../models/serviceHotel";


const ServiceHotelController = {
    async getAllServiceHotelSystem(req: Request, res: Response) {
        try {
            const servicesHotelSystem = await ServiceHotelSchema.find({})
            return res.status(200).json(servicesHotelSystem);
        } catch (error) {
            return res.status(400).json({ error: error });
        }

    },
};

export default ServiceHotelController;
