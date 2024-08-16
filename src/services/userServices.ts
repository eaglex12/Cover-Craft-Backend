import User from "../models/userModel";
import { IUser } from "../interface/IUser";

class UserService {
	public async getUserByEmail(email: string): Promise<IUser | null> {
		return await User.findOne({ email });
	}

	public async createUser(data: Partial<IUser>): Promise<IUser> {
		const existingUser = await User.findOne({ email: data.email });
		if (existingUser) {
			throw new Error("Email already exists");
		}
		const newUser = new User(data);
		console.log("🚀 ~ UserService ~ createUser ~ newUser:", newUser);
		return await newUser.save();
	}

	public async updateUser(
		email: string,
		data: Partial<IUser>
	): Promise<IUser | null> {
		return await User.findOneAndUpdate({ email }, data, { new: true });
	}

	public async deleteUser(email: string): Promise<IUser | null> {
		return await User.findOneAndDelete({ email });
	}
}

export default new UserService();
