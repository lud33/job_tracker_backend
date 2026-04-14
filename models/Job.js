import mongoose from "mongoose";

const jobSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  title: String,
  company: String,
  status: String,
}, { timestamps: true });

export default mongoose.model("Job", jobSchema);