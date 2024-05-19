import { Router } from "express";
import RoomController from "../controller/room.controller";
const route = Router();

route.get("/:id", RoomController.getListRoomsByHotel);   // lay ra room by id hotel

export default route;
