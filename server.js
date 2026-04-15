import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import morgan from "morgan";

import { connectDB } from "./config/db.js";

import authRoutes from "./routes/authRoutes.js";
import jobRoutes from "./routes/jobRoutes.js";
import settingsRoutes from "./routes/settingsRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";

dotenv.config();
connectDB();

const app = express();

// ✅ CORS CONFIGURATION
const allowedOrigins = [
  "https://job-tracker-front-zeta.vercel.app", 
  "http://localhost:5173",
  "http://localhost:3000"
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      return callback(new Error("CORS policy blocked this origin"), false);
    }
    return callback(null, true);
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));

// ❌ REMOVE THIS LINE - it's causing the error
// app.options("/*", cors());

app.use(express.json());
app.use(morgan("dev"));

app.get("/", (req, res) => {
  res.json({ message: "API is running..." });
});

// API ROUTES
app.use("/api/auth", authRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/settings", settingsRoutes);
app.use("/api/notifications", notificationRoutes);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Global Error Handler
app.use((err, req, res, next) => {
  res.header("Access-Control-Allow-Origin", req.headers.origin || "*");
  console.error("🔥 ERROR:", err);
  res.status(err.status || 500).json({
    message: err.message || "Server error",
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});