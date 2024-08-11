import dotenv from "dotenv";
dotenv.config();
import express, { Application } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import router from "./routes/cover-letter";
import { connectTodb, disconnectdb } from "./database/db";

const url = process.env.FRONTEND_URL ?? "";
const app: Application = express();

app.use(cookieParser());
app.use(express.json());
app.use(
	cors({
		origin: [url],
		methods: "GET, HEAD, PUT, PATCH, POST, DELETE",
		credentials: true,
	})
);

app.use("/api", router);

const startServer = async () => {
	try {
		await connectTodb();
		console.log("Database connected successfully");
		app.listen(process.env.PORT, () => {
			console.log("Server Started on:", process.env.PORT);
		});
	} catch (err) {
		console.error("Failed to start server:", err);
		await disconnectdb();
		process.exit(1);
	}
};

startServer();
