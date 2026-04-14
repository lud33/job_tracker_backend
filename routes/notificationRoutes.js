import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { sendEmailNotification, sendJobNotification } from "../config/emailConfig.js";
import User from "../models/User.js";
import Job from "../models/Job.js";

const router = express.Router();

// Test notification endpoint
router.post("/test", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const result = await sendEmailNotification(
      user.email,
      "Job Tracker - Test Notification",
      `
      <div style="font-family: Arial, sans-serif;">
        <h2>✅ Test Notification Successful!</h2>
        <p>Hello ${user.name},</p>
        <p>This is a test notification from your Job Tracker app.</p>
        <p>Your notification settings are working correctly!</p>
        <p>You will receive real-time updates when your job applications change status.</p>
      </div>
      `
    );

    if (result.success) {
      res.json({ message: "Test email sent successfully" });
    } else {
      res.status(500).json({ message: "Failed to send email", error: result.error });
    }
  } catch (error) {
    console.error("Test notification error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// When job status changes, send notification
router.post("/job-status-change", protect, async (req, res) => {
  try {
    const { jobId, newStatus, oldStatus } = req.body;
    const user = await User.findById(req.user);
    const job = await Job.findById(jobId);

    if (!user || !job) {
      return res.status(404).json({ message: "User or job not found" });
    }

    // Check if user has notifications enabled
    const settings = await Settings.findOne({ user: user._id });
    if (settings && settings.notifications) {
      await sendJobNotification(user.email, user.name, job.title, newStatus);
    }

    res.json({ message: "Notification sent if enabled" });
  } catch (error) {
    console.error("Job status notification error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;