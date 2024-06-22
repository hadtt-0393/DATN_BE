import { Request, Response } from "express";
import { Document } from "mongoose";
import CitySchema from "../models/city";
import RoomSchema from "../models/room";
import FormSchema from "../models/form";

interface RequestWithUser extends Request {
    user: any;
}

const FormControler = {
    async createForm(req: RequestWithUser, res: Response) {
        const id = req.user.id;
        try {
            const { name, email, phoneNumber, address, note, rooms, startDate, endDate, paymentStatus } = req.body;
            console.log(startDate)
            const formatStartDate = new Date(startDate);
            const formatEndDate = new Date(endDate);
            const roomIds = rooms.map((room: any) => room.roomId)
            const form = new FormSchema({
                userId: id,
                name,
                email,
                phoneNumber,
                address,
                note,
                rooms: roomIds,
                paymentStatus,
                startDate: formatStartDate,
                endDate: formatEndDate
            });
            await form.save();
            const booking = { start: formatStartDate, end: formatEndDate };

            await Promise.all(rooms.map(async (room: any) => {
                await RoomSchema.findByIdAndUpdate(room.roomId, {
                    $push: { bookings: booking }
                });
            }));

            return res.status(200).json(form);
        }
        catch (error) {
            return res.status(400).json({ error: error });
        }
    },

    async getAllFormByUser(req: RequestWithUser, res: Response) {
        try {
            const id = req.user.id;
            const forms = await FormSchema.find({ userId: id });
            return res.status(200).json(forms);
        }
        catch (error) {
            return res.status(400).json({ error: error });
        }
    }
}


export default FormControler;