import { Request, Response } from "express";
import { Document } from "mongoose";
import CitySchema from "../models/city";
import FormSchema from "../models/form";

const FormControler =
{
    async createForm(req: Request, res: Response) {
        try {
            const { name, email, phoneNumber, address, note } = req.body;
            const form = new FormSchema({
                name,
                email,
                phoneNumber,
                address,
                note
            });
            await form.save();
        }
        catch (err) {
            console.error(err);
        }
    }   
}