import { Router } from "express";
import RoomController from "../controller/room.controller";
import middlewareToken from "../middleware/verifyToken";
const route = Router();

route.get("/getAllRoomByStaff", middlewareToken.verifyToken as any, middlewareToken.verifyStaff as any, RoomController.getAllRoomHotelByStaff as any)
route.get("/getAllRoomFilter/:id", RoomController.getAllRoomFilter)
route.post("/createRoom", middlewareToken.verifyToken as any, middlewareToken.verifyStaff as any, RoomController.createRoom as any)
route.get("/getAllRoomAvailable/:id", RoomController.getAllRoomAvailable);
route.put("/updateRoomByStaff/:id", middlewareToken.verifyToken as any, middlewareToken.verifyStaff as any, RoomController.updateRoomByStaff as any)
route.delete("/deleteRoomByStaff/:id", middlewareToken.verifyToken as any, middlewareToken.verifyStaff as any, RoomController.deleteRoomByStaff as any)

export default route;
