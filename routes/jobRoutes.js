import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  getJobs,
  addJob,
  updateJob,
  deleteJob,
} from "../controllers/jobController.js";

const router = express.Router();

router.use(protect);

router.get("/", getJobs);
router.post("/", addJob);
router.put("/:id", updateJob);
router.delete("/:id", deleteJob);

export default router;