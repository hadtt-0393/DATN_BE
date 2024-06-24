import { Request, Response } from "express";
import { Document } from "mongoose";
import RoomSchema from "../models/room";
import HotelSchema from "../models/hotel";
import FormSchema from "../models/form";

interface RequestWithUser extends Request {
    user: any;
}

const FormControler = {
    async createForm(req: RequestWithUser, res: Response) {
        const id = req.user.id;
        try {
            const { name, email, phoneNumber, address, note, rooms, startDate, endDate, paymentStatus, cost, adults, children, hotelId } = req.body;
            const formatStartDate = new Date(startDate);
            const formatEndDate = new Date(endDate);
            let RoomsForm = rooms.map((room: any) => ({roomId: room._id, quantity: room.quantityChoose}));
            const form = new FormSchema({
                userId: id,
                hotelId: hotelId,
                name,
                email,
                phoneNumber,
                address,
                note,
                adults,
                children,
                cost,
                rooms: RoomsForm,
                paymentStatus,
                startDate: formatStartDate,
                endDate: formatEndDate
            });
            await form.save();
            const booking = { start: formatStartDate, end: formatEndDate };

            await Promise.all(rooms.map(async (room: any) => {
                await RoomSchema.findByIdAndUpdate(
                    room._id,
                    {
                        $push: { bookings: { $each: new Array(room.quantityChoose).fill(booking) } }
                    }
                );
            }));
            

            return res.status(200).json(form);
        }
        catch (error) {
            return res.status(400).json({ error: error });
        }
    },

    async convertForm (forms: any) {
        const resultFooms = await Promise.all(forms.map(async (form:any) => {
            let ROOM = [] as any;
            for (let room of form.rooms) {
                const Room = await RoomSchema.findById(room.roomId);
                ROOM.push({ ...Room?.toObject(), quantity: room.quantity });
            }
            return {
                ...form.toJSON(),
                Rooms: ROOM.map((item: any) => {
                    return { roomName: item?.roomType, quantity: item?.quantity }
                })
            };
        }))
        return resultFooms;
    },

    async convertIdHotelInForm(forms: any){
        const resultFooms = await Promise.all(forms.map(async (form:any) => {
            const hotel = await HotelSchema.findById(form.hotelId);
            return {
               ...form,
                hotel: hotel
            };
        }))
        return resultFooms;
    },

    async getAllFormByUser(req: RequestWithUser, res: Response) {
        try {   
            const id = req.user.id;
            const forms = await FormSchema.find({ userId: id })
            let results = await FormControler.convertForm(forms);
            let result = await FormControler.convertIdHotelInForm(results);
            return res.status(200).json(result);
        }
        catch (error) {
            return res.status(400).json({ error: error });
        }
    },

    async getAllFormByStaff(req: RequestWithUser, res: Response) {
        try {
            const id = req.user.id;
            const hotel = await HotelSchema.findOne({ owner: id });
            console.log(hotel)
            const hotelId = hotel?._id;
            const listForm = await FormSchema.find({ hotelId });
            let result = await FormControler.convertForm(listForm);
            return res.status(200).json(result);
        }
        catch (error) {
            return res.status(400).json({ error: error });
        }
    }
}


export default FormControler;