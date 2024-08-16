import { MongoClient } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

const url = process.env.MONGODB_URL;

if (!url) {
	throw new Error("MONGODB_URL environment variable is not set");
}

const client = new MongoClient(url);

export const connectTodb = async () => {
	try {
		await client.connect();
		console.log("Connected successfully to server");
		const db = client.db("Cover Letter");
		return db;
	} catch (err) {
		console.error(`Failed to connect to MongoDB: ${err}`);
		throw err;
	}
};

export const disconnectdb = async () => {
	if (!client) {
		console.log("No MongoDB client to disconnect");
		return;
	}

	try {
		await client.close();
		console.log("Disconnected successfully from MongoDB");
	} catch (err) {
		console.error(`Failed to disconnect from MongoDB: ${err}`);
		throw err;
	}
};
