import { Router } from "express";
import HotelController from "../controller/hotel.controller";
import middlewareToken from "../middleware/verifyToken";
const route = Router();

route.get("/getAllHotel", middlewareToken.verifyToken as any, middlewareToken.verifyAdmin as any, HotelController.getAllHotel as any);         //lay ra toan bo hotel isActive
route.get("/topTenRating", HotelController.getTopTenRating);    // lay ra top10 hotel by Rating
route.get("/topTenNewest", HotelController.getTopTenNewest);    // lay ra top10 hotel theo thoi gian tao
route.get("/getHotelBySearch", HotelController.getHotelBySearch); //lay ra hotel by search
route.get("/getHotelByFilter", HotelController.getHotelByFilter); //lay ra hotel by filter")
route.get("/get-detail", middlewareToken.verifyToken as any, middlewareToken.verifyStaff as any, HotelController.getDetailhotelByStaff as any);  //lay ra detail hotel voi quyen cua staff
route.put('/update-detail-hotel', middlewareToken.verifyToken as any, middlewareToken.verifyStaff as any, HotelController.updateHotel as any); //
route.get("/:id", HotelController.getDetailHotel)               // lay ra detail cua hotel

export default route;
