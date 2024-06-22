/** @format */

import { Request, Response } from "express";
import CitySchema from "../models/city";

const CityController = {
	async getAllCity(req: Request, res: Response) {
		try {
			const Cities = await CitySchema.find({})	
			return res.status(200).json(Cities);
		} catch (error) {
			return res.status(400).json({ error: error });
		}

	},
};

export default CityController;
