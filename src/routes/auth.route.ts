import { Router } from "express";
import AuthController from "../controller/auth.controller";
import middlewareToken from "../middleware/verifyToken";
const route = Router();

//auth with user
route.post("/user/signin", AuthController.signinUser);
route.post("/user/signup", AuthController.signupUser);

//auth with staff
route.post("/staff/signin", AuthController.signinStaff);
route.post("/staff/signup", AuthController.signupStaff);


//auth with admin
route.post("/admin/signin", AuthController.signinAdmin);
route.get("/admin/isLogin", middlewareToken.verifyToken as any, middlewareToken.verifyAdmin as any, AuthController.isLogin as any)

export default route;
