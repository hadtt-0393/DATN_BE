import { Router } from "express";
import ServiceHotelController from "../controller/serviceHotel.controller";
const route = Router();

route.get("/getAllServiceHotelSystem", ServiceHotelController.getAllServiceHotelSystem)

export default route;
