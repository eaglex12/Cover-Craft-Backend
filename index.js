const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const coverLetterRoutes = require("./routes/coverLetterRoutes");

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(
	cors({
		origin: "*",
		methods: ["GET", "POST"],
	})
);

app.use(express.json({ limit: "10mb" }));

// Routes define

app.use("/api", coverLetterRoutes);

app.listen(port, () => {
	console.log(`Server running on port ${port}`);
});
