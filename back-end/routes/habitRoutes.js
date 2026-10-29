import express from "express";
import {
  getHabits,
  createHabit,
  checkinHabit,
  deleteHabit,
} from "../controllers/habitController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/")
  .get(protect, getHabits)
  .post(protect, createHabit);

router.route("/:id/checkin")
  .put(protect, checkinHabit);

router.route("/:id")
  .delete(protect, deleteHabit);

export default router;