import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import morgan from "morgan";

import { connectDB } from "./config/db.js";

import authRoutes from "./routes/authRoutes.js";
import jobRoutes from "./routes/jobRoutes.js";
import settingsRoutes from "./routes/settingsRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
// Load env variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// ✅ Middleware
app.use(cors());
app.use(express.json());
app.use(morgan("dev")); // logging

// ✅ Health check route
app.get("/", (req, res) => {
  res.json({ message: "API is running..." });
});

// ✅ Routes
app.use("/api/auth", authRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/settings", settingsRoutes);

// ❌ 404 Handler
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// ❌ Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: "Server error",
    error: process.env.NODE_ENV === "development" ? err.message : {},
  });
});

// ✅ Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

app.use("/api/notifications", notificationRoutes);