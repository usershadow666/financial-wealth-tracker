import express from "express";
import {
  getAdminOverview,
  getPlatformMetrics,
  getAllUsers,
} from "../controllers/adminController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

// Apply protect & adminOnly middleware across all admin routes
router.use(protect, adminOnly);

router.get("/", getAdminOverview);
router.get("/metrics", getPlatformMetrics);
router.get("/users", getAllUsers);

export default router;

