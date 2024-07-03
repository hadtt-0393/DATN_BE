import { Router } from "express";
import FormController from "../controller/form.controller";
import middlewareToken from "../middleware/verifyToken";
const route = Router();

route.post("/createForm", middlewareToken.verifyToken as any, middlewareToken.verifyUser as any, FormController.createForm as any)
route.get("/getAllFormByUser", middlewareToken.verifyToken as any, middlewareToken.verifyUser as any, FormController.getAllFormByUser as any)
route.get("/getAllFormByStaff", middlewareToken.verifyToken as any, middlewareToken.verifyStaff as any, FormController.getAllFormByStaff as any)
route.post("/createComment/:id", middlewareToken.verifyToken as any, middlewareToken.verifyUser as any, FormController.createComment as any)
route.get("/getCommentByUser/:id", middlewareToken.verifyToken as any, middlewareToken.verifyUser as any, FormController.getCommentByUser as any)
route.get("/getCommentByHotel/:id", FormController.getCommentByHotel as any)
export default route;
