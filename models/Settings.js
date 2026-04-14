import mongoose from "mongoose";

const settingsSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", unique: true },
  name: String,
  email: String,
  notifications: Boolean,
  weeklyDigest: Boolean,
});

export default mongoose.model("Settings", settingsSchema);