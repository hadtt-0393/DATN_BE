/** @format */

import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import UserSchema from "../models/user"
import StaffSchema from "../models/staff"
import HotelSchema from "../models/hotel"
import CitySchema from "../models/city"
import { createRandomCheapestPrice } from "../utils/hotel";

const AuthController = {
	async signinUser(req: Request, res: Response) {
		try {
			const { email, password } = req.body;
			const user = await UserSchema.findByEmail(email);
			if (!user) {
				return res.status(400).json();
			}
			const validPassword = await bcrypt.compare(password, user.password);
			if (!validPassword) {
				return res
					.status(400)
					.json({ message: "Mật khẩu không đúng!" });
			}
			if (user && validPassword) {
				const accessToken = AuthController.accessToken(user, 'user');
				const { password, ...info } = user.toObject();
				const message = "Đăng nhập thành công!";
				return res.status(200).json({ ...info, accessToken, message });
			}
		} catch (err) {
			return res.status(500).json({ message: err });
		}
	},

	async signupUser(req: Request, res: Response) {
		try {
			const { username, email, password, phoneNumber, city } = req.body;
			const user = await UserSchema.findByEmail(email);
			if (user) {
				return res
					.status(409)
					.json({ message: "Người dùng đã tồn tại!" });
			}
			const salt = await bcrypt.genSalt(10);
			const hashedPassword = await bcrypt.hash(password, salt);
			const newUser = await UserSchema.create({
				username,
				email,
				password: hashedPassword,
				phoneNumber,
				city,
			});
			const { password: string, ...rest } = newUser.toObject();
			const message = "Đăng ký thành công!";

			return res.status(200).json({ ...rest, message });

		} catch (err) {
			res.status(500).json({ message: err });
		}
	},

	async signinStaff(req: Request, res: Response) {
		try {
			const { email, password } = req.body;
			let staff = await StaffSchema.findByEmail(email);
			if (!staff) {
				return res.status(400).json({ message: "Không tìm thấy email!" });
			}
			const validPassword = await bcrypt.compare(password, staff.password);
			if (!validPassword) {
				return res
					.status(400)
					.json({ message: "Mật khẩu không đúng!" });
			}
			if (staff && validPassword) {
				const accessToken = AuthController.accessToken(staff, 'staff');
				const hotel = await HotelSchema.findOne({ owner: staff._id })
				const hotelStatus = hotel?.isActive
				const message = "Đăng nhập thành công!";
				if (hotelStatus === false) {
					staff = { ...staff.toObject(), status: "Bị từ chối" }
					const { password, ...info } = staff;
					return res.status(200).json({ info, accessToken, message });
				}
				else {
					const cityName = staff.city
					const city = await CitySchema.findOne({ cityName })
					const hotelIds = city!.hotelIds
					if (hotelIds.includes(hotel.id)) {
						staff = { ...staff.toObject(), status: "Đã xác thực" }
						const { password, ...info } = staff;
						return res.status(200).json({ info, accessToken, message });
					}
					else{
						staff = { ...staff.toObject(), status: "Đang xác thực" }
                        const { password, ...info } = staff;
                        return res.status(200).json({ info, accessToken, message });
					}
				}
			}
		} catch (err) {
			return res.status(500).json({ message: err });
		}
	},

	async signupStaff(req: Request, res: Response) {
		try {
			const { username, email, password, phoneNumber, city } = req.body;
			const staff = await StaffSchema.findByEmail(email);
			if (staff) {
				return res
					.status(409)
					.json({ message: "Người dùng đã tồn tại!" });
			}
			const salt = await bcrypt.genSalt(10);
			const hashedPassword = await bcrypt.hash(password, salt);
			const newStaff = await StaffSchema.create({
				username,
				email,
				password: hashedPassword,
				phoneNumber,
				city,
			});

			const newHotel = await HotelSchema.create({
				hotelName: username,
				city: city,
				owner: newStaff.id,
				email: email,
				hotline: phoneNumber,
				cheapestPrice: createRandomCheapestPrice(),
			})

			const { password: string, ...rest } = newStaff.toObject();
			const message = "Đăng ký thành công!";
			return res.status(200).json({ ...rest, message });

		} catch (err) {
			res.status(500).json({ message: err });
		}
	},

	async signinAdmin(req: Request, res: Response) {
		try {
			const { account, password } = req.body;
			if ((account === "admin" && password === "123456") || (account === "admin2" && password === "123456")) {
				const accessToken = AuthController.accessTokenAdmin('admin');
				return res.status(200).json({ message: "Đăng nhập thành công!", accessToken: accessToken });
			}
			else {
				return res
					.status(400)
					.json({ message: "Tên đăng nhập hoặc mật khẩu không đúng!" });
			}
		} catch (err) {
			return res.status(500).json({ message: err });
		}
	},

	async isLogin(req: Request, res: Response) {
		return res.status(200).json
			({ isLogin: true });
	},


	accessToken(user: any, role: string) {
		return jwt.sign({ id: user._id, role: role }, process.env.ACCESS_TOKEN_SECRET!, {
			expiresIn: "1d",
		});
	},

	accessTokenAdmin(role: string) {
		return jwt.sign({ role: role }, process.env.ACCESS_TOKEN_SECRET!, {
			expiresIn: "1d",
		});
	}
};

export default AuthController;

