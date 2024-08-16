import mongoose from "mongoose";
import dotenv from "dotenv";
import { ServerApiVersion } from "mongodb";

dotenv.config();

const mongoUri = process.env.MONGODB_URL;

if (!mongoUri) {
	throw new Error("MONGODB_URL environment variable is not set");
}

const connectToDb = async () => {
	try {
		await mongoose.connect(mongoUri, {
			serverApi: {
				version: ServerApiVersion.v1,
				strict: true,
				deprecationErrors: true,
			},
		});
		console.log("Connected successfully to MongoDB");
	} catch (error) {
		console.error("Failed to connect to MongoDB:", error);
		throw error;
	}
};

const disconnectFromDb = async () => {
	try {
		await mongoose.disconnect();
		console.log("Disconnected successfully from MongoDB");
	} catch (error) {
		console.error("Failed to disconnect from MongoDB:", error);
		throw error;
	}
};

export { connectToDb, disconnectFromDb };
