import { Router } from "express";
import StaffController from "../controller/staff.controller";
import middlewareToken from "../middleware/verifyToken";
const route = Router();

route.get("/isLogin", middlewareToken.verifyToken as any, middlewareToken.verifyStaff as any, StaffController.isLogin as any)
route.get("/info", middlewareToken.verifyToken as any, middlewareToken.verifyStaff as any,  StaffController.getInfo as any);
route.put("/info", middlewareToken.verifyToken as any, middlewareToken.verifyStaff as any,  StaffController.updateInfo as any);

export default route;