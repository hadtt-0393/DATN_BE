import { Express } from "express";
import authRouter from "./auth.route";
import hotelRouter from "./hotel.route";
import roomRouter from "./room.route";
import cityRouter from "./city.route";

function route(app: Express) {
	app.use("/auth", authRouter);
	app.use("/hotel", hotelRouter);
	app.use("/room", roomRouter);
	app.use("/city", cityRouter);
}

export default route;