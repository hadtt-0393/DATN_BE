import { Router } from "express";
import FormController from "../controller/form.controller";
import middlewareToken from "../middleware/verifyToken";
const route = Router();

route.post("/createForm", middlewareToken.verifyToken as any, middlewareToken.verifyUser as any, FormController.createForm as any)
route.get("/getAllFormByUser", middlewareToken.verifyToken as any, middlewareToken.verifyUser as any, FormController.getAllFormByUser as any)
route.get("/getAllFormByStaff", middlewareToken.verifyToken as any, middlewareToken.verifyStaff as any, FormController.getAllFormByStaff as any)
route.get("/getAllFormByAdmin", middlewareToken.verifyToken as any, middlewareToken.verifyAdmin as any, FormController.getAllFormByAdmin as any)
route.get("/getTopTenHotelsByForms",  middlewareToken.verifyToken as any, middlewareToken.verifyAdmin as any, FormController.getTopTenHotelsByForms as any)
route.post("/createComment/:id", middlewareToken.verifyToken as any, middlewareToken.verifyUser as any, FormController.createComment as any)
route.post("/cancleForm", middlewareToken.verifyToken as any, middlewareToken.verifyUser as any, FormController.cancleForm as any)

export default route;
