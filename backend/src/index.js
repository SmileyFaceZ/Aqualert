import express from "express";
import "dotenv/config";
import { connectDB } from "./lib/db.js";
import cors from "cors";

import authRoutes from "./routes/authRoutes.js";
import reminderRoutes from "./routes/reminderRoutes.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json()); // Allow JSON data in requests
app.use(cors()); // Enable CORS for all routes

app.use("/api/auth", authRoutes);
app.use("/api/reminders", reminderRoutes);

app.listen(3000, () => {
  console.log(`Server is running on port ${PORT}`);
  connectDB();
});