import { Router } from "express";
import ServiceRoomController from "../controller/serviceRoom.controller";
const route = Router();

route.get("/getAllServiceRoomSystem", ServiceRoomController.getAllServiceRoomSystem)

export default route;
