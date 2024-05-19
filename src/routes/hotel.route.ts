import { Router } from "express";
import HotelController from "../controller/hotel.controller";
const route = Router();

route.post("/createHotel", HotelController.createHotel);
route.get("/getAllHotel", HotelController.getAllHotel);
route.get("/count/:city", HotelController.getHotelsByCity);   // lay ra hotel by city
route.get("/topTenRating", HotelController.getTopTenRating);
route.get("/topTenNewest", HotelController.getTopTenNewest);
route.get("/:id", HotelController.getDetailHotel)

export default route;
