// /src/controllers/UserController.ts
import { Request, Response } from "express";
import UserService from "../services/userServices";

class UserController {
	public async getUser(req: Request, res: Response): Promise<void> {
		try {
			const user = await UserService.getUserByEmail(req.body.email);
			if (user) {
				res.status(200).json(user);
			} else {
				res.status(404).json({ message: "User not found" });
			}
		} catch (error) {
			res.status(500).json({ message: "Internal Server Error" });
		}
	}

	public async createUser(req: Request, res: Response): Promise<void> {
		try {
			console.log("Request body for getUser:", req.body);
			const user = await UserService.createUser(req.body);

			res.status(201).json(user);
		} catch (error) {
			console.error("🚀 ~ UserController ~ createUser ~ error:", error);

			res.status(500).json({ message: "Internal Server Error" });
		}
	}

	public async updateUser(req: Request, res: Response): Promise<void> {
		try {
			const user = await UserService.updateUser(req.body.email, req.body);
			if (user) {
				res.status(200).json(user);
			} else {
				res.status(404).json({ message: "User not found" });
			}
		} catch (error) {
			res.status(500).json({ message: "Internal Server Error" });
		}
	}

	public async deleteUser(req: Request, res: Response): Promise<void> {
		try {
			const user = await UserService.deleteUser(req.body.email);
			if (user) {
				res.status(200).json({ message: "User deleted successfully" });
			} else {
				res.status(404).json({ message: "User not found" });
			}
		} catch (error) {
			res.status(500).json({ message: "Internal Server Error" });
		}
	}
}

export default new UserController();
