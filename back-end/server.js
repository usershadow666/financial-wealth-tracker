import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import transactionRoutes from "./routes/transactionRoutes.js";
import habitRoutes from "./routes/habitRoutes.js";
import goalRoutes from "./routes/goalRoutes.js";

dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Mount Routes
app.use("/api/auth", authRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/habits", habitRoutes);
app.use("/api/goals", goalRoutes);

// Health check root route
app.get("/", (req, res) => {
  res.send("Wealth Tracker API is running...");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});





// token =eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjZhZTJjMGNmOWJjNjZlMmZmZjI2YTEyMCIsImlhdCI6MTc5MzI0NTM5MSwiZXhwIjoxNzk1ODM3MzkxfQ.kY4mAhcmYba-uxRJ0jczG0gMpLH6W22VGsBd3ULmEBY
// token 2 = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjZhZTJjMGNmOWJjNjZlMmZmZjI2YTEyMCIsImlhdCI6MTc5MzI0NTUxNywiZXhwIjoxNzk1ODM3NTE3fQ.XIJLv6vFl1_NGyiC2x1YPhSFUEGkXVcDhoNttQW-e7k