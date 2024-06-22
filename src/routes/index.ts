import { Express } from "express";
import authRouter from "./auth.route";
import hotelRouter from "./hotel.route";
import roomRouter from "./room.route";
import cityRouter from "./city.route";
import staffRouter from "./staff.route";
import userRouter from "./user.route";
import formRouter from "./form.route";

function route(app: Express) {
	app.use("/api/auth", authRouter);
	app.use("/api/hotel", hotelRouter);
	app.use("/api/room", roomRouter);
	app.use("/api/city", cityRouter);
	app.use("/api/staff", staffRouter);
	app.use("/api/user", userRouter);
	app.use("/api/form", formRouter);
}

export default route;