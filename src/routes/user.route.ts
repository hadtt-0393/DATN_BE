import { Router } from "express";
import UserController from "../controller/user.controller";
import middlewareToken from "../middleware/verifyToken";
const route = Router();

route.get("/getAllUser", middlewareToken.verifyToken as any, middlewareToken.verifyAdmin as any,  UserController.getAllUser as any);
route.get("/isLogin", middlewareToken.verifyToken as any, middlewareToken.verifyUser as any, UserController.isLogin as any)

export default route;