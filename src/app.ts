import dotenv from "dotenv";
dotenv.config();
import express, { Application } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import router from "./routes/cover-letter";
import userRouter from "./routes/userRoutes";
import { connectToDb, disconnectFromDb } from "./database/db";

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
app.use("/api", userRouter);

const startServer = async () => {
	try {
		await connectToDb();
		app.listen(process.env.PORT, () => {
			console.log("Server Started on:", process.env.PORT);
		});
	} catch (err) {
		console.error("Failed to start server:", err);
		await disconnectFromDb();
		process.exit(1);
	}
};

startServer();
