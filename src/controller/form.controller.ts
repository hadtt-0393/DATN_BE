import { Request, Response } from "express";
import { Document } from "mongoose";
import CitySchema from "../models/city";
const FormControler =
{
    async createForm(req: Request, res: Response) {
        try {
            const { name, email, phone, address, note } = req.body;
        }
        catch (err) {
            console.error(err);
        }
    }   
}