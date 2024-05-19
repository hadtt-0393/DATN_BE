/** @format */

import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Document } from "mongoose";
import UserSchema from "../models/user"

const AuthController = {
	async signin(req: Request, res: Response) {
		try {
			const { email, password } = req.body;
			const user = await UserSchema.findByEmail(email);
			if (!user) {
				return res.status(400).json({ message: "Không tìm thấy email" });
			}
			const validPassword = await bcrypt.compare(password, user.password);
			if (!validPassword) {
				return res
					.status(400)
					.json({ message: "Mật khẩu không đúng" });
			}
			if (user && validPassword) {
				const accessToken = AuthController.accessToken(user);
				const { password, ...info } = user.toObject();
				const message = "Đăng nhập thành công";
				return res.status(200).json({ info, accessToken, message });
			}
		} catch (err) {
			return res.status(500).json({ message: err });
		}
	},

	async signup(req: Request, res: Response) {
		try {
			const { username, email, password, phone, city } = req.body;
			const user = await UserSchema.findByEmail(email);
			if (user) {
				return res
					.status(409)
					.json({ message: "Người dùng đã tồn tại" });
			}
			const salt = await bcrypt.genSalt(10);
			const hashedPassword = await bcrypt.hash(password, salt);
			const newUser = await UserSchema.create({
				username,
				email,
				password: hashedPassword,
				phone,
                city,
			});
			const { password: string, ...rest } = newUser.toObject();
			const message = "Đăng ký tài khoản thành công";

			return res.status(200).json({ ...rest, message });

		} catch (err) {
			res.status(500).json({ message: err });
		}
	},

	accessToken(user: Document) {
		return jwt.sign({ id: user._id }, process.env.ACCESS_TOKEN_SECRET!, {
			expiresIn: "1d",
		});
	},

};

export default AuthController;
