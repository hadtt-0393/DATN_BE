import { Router } from "express";
import CityController from "../controller/city.controller";
const route = Router();

route.get("/getAllCity", CityController.getAllCity);

export default route;
