import mongoose, { Schema } from "mongoose";
import { IUser } from "../interface/IUser";

const UserSchema: Schema = new Schema({
	email: {
		type: String,
		required: true,
		unique: true,
		trim: true,
	},
	password: {
		type: String,
		required: true,
	},
	name: {
		type: String,
		required: true,
		trim: true,
	},
	createdAt: {
		type: Date,
		default: () => new Date(),
	},
	updatedAt: {
		type: Date,
		default: () => new Date(),
	},
});

UserSchema.pre<IUser>("save", function (next) {
	this.updatedAt = new Date();
	next();
});

export default mongoose.model<IUser>("User", UserSchema);
