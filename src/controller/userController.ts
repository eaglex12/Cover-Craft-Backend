import { Request, Response } from "express";
import UserService from "../services/userServices";

class UserController {
	public async getUser(req: Request, res: Response): Promise<void> {
		try {
			const email = req.body.email;
			if (!email) {
				res.status(400).json({ message: "Email is required" });
				return;
			}

			const user = await UserService.getUserByEmail(email);
			if (user) {
				res.status(200).json(user);
			} else {
				res.status(404).json({ message: "User not found" });
			}
		} catch (error) {
			console.error("🚀 ~ UserController ~ getUser ~ error:", error);
			res.status(500).json({ message: "Internal Server Error" });
		}
	}

	public async createUser(req: Request, res: Response): Promise<void> {
		try {
			const userData = req.body;
			if (!userData.email || !userData.password || !userData.name) {
				res
					.status(400)
					.json({ message: "Email, password, and name are required" });
				return;
			}

			const newUser = await UserService.createUser(userData);
			res.status(201).json(newUser);
		} catch (error) {
			console.error("🚀 ~ UserController ~ createUser ~ error:", error);
			res.status(500).json({ message: "Internal Server Error" });
		}
	}

	public async updateUser(req: Request, res: Response): Promise<void> {
		try {
			const email = req.body.email;
			const updateData = req.body;

			if (!email) {
				res.status(400).json({ message: "Email is required" });
				return;
			}

			const updatedUser = await UserService.updateUser(email, updateData);
			if (updatedUser) {
				res.status(200).json(updatedUser);
			} else {
				res.status(404).json({ message: "User not found" });
			}
		} catch (error) {
			console.error("🚀 ~ UserController ~ updateUser ~ error:", error);
			res.status(500).json({ message: "Internal Server Error" });
		}
	}

	public async deleteUser(req: Request, res: Response): Promise<void> {
		try {
			const email = req.body.email;

			if (!email) {
				res.status(400).json({ message: "Email is required" });
				return;
			}

			const deletedUser = await UserService.deleteUser(email);
			if (deletedUser) {
				res.status(200).json({ message: "User deleted successfully" });
			} else {
				res.status(404).json({ message: "User not found" });
			}
		} catch (error) {
			console.error("🚀 ~ UserController ~ deleteUser ~ error:", error);
			res.status(500).json({ message: "Internal Server Error" });
		}
	}
}

export default new UserController();
