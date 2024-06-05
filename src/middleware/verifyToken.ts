import { Response, Request } from "express";
const jwt = require('jsonwebtoken');

interface RequestWithUser extends Request {
    user: any;
}

const middlewareToken = {
    verifyToken: (req: RequestWithUser, res: Response, next: any) => {
        const token = req.headers.authorization
        if(token){
            const accessToken = token.split(" ")[1];
            jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET, (err: any, user: any) => {
                if(err){
                    return res.status(403).json("Token is not valid!");
                }
                req.user = user;
                next();
            });
        }
        else{
            return res.status(401).json("You are not authenticated!");
        }
    },

    verifyUser: (req: RequestWithUser, res: Response, next: any) => {
        if(req.user.role === "user"){
            next();
        }
        else{
            return res.status(403).json("You are not user");
        }
    },

    verifyStaff: (req: RequestWithUser, res: Response, next: any) => {
        if(req.user.role === "staff"){
            next();
        }
        else{
            return res.status(403).json("You are not staff!");
        }
    },

    verifyAdmin: (req: RequestWithUser, res: Response, next: any) => {
        if(req.user.role === "admin"){
            next();
        }
        else{
            return res.status(403).json("You are not admin!");
        }
    },
}

export default middlewareToken;