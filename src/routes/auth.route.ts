import { Router } from "express";
import AuthController from "../controller/auth.controller";
const route = Router();

route.post("/signin", AuthController.signin);
route.post("/signup", AuthController.signup);

export default route;
