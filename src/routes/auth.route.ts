import { Router } from "express";
import AuthController from "../controller/auth.controller";
const route = Router();

//auth with user
route.post("/user/signin", AuthController.signinUser);
route.post("/user/signup", AuthController.signinUser);

//auth with staff
route.post("/staff/signin", AuthController.signinStaff);
route.post("/staff/signup", AuthController.signupStaff);


export default route;
