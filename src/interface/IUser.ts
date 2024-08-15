// /src/interfaces/IUser.ts
import { Document } from "mongoose";

export interface IUser extends Document {
	email: string;
	password: string;
	name: string;
	createdAt: Date;
	updatedAt: Date;
}
