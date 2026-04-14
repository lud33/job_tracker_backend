import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import morgan from "morgan";

import { connectDB } from "./config/db.js";

import authRoutes from "./routes/authRoutes.js";
import jobRoutes from "./routes/jobRoutes.js";
import settingsRoutes from "./routes/settingsRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// ✅ Middleware
app.use(cors({
  origin: "*", // allow all (you can restrict later)
}));
app.use(express.json());
app.use(morgan("dev"));

// ✅ Health check route
app.get("/", (req, res) => {
  res.json({ message: "API is running..." });
});

// ✅ API Routes (ORDER MATTERS)
app.use("/api/auth", authRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/settings", settingsRoutes);
app.use("/api/notifications", notificationRoutes); // ✅ FIXED POSITION

// ❌ 404 Handler (must come AFTER routes)
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// ❌ Global Error Handler
app.use((err, req, res, next) => {
  console.error("🔥 ERROR:", err);

  res.status(err.status || 500).json({
    message: err.message || "Server error",
  });
});

// ✅ Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});