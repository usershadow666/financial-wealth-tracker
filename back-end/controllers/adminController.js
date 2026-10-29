import User from "../models/user.js";
import Transaction from "../models/transaction.js";
import Goal from "../models/goal.js";
import Habit from "../models/habit.js";

// @desc    Get platform metrics and all user accounts
// @route   GET /api/admin
export const getAdminOverview = async (req, res) => {
  try {
    const [totalUsers, totalTransactions, totalGoals, totalHabits, users] =
      await Promise.all([
        User.countDocuments(),
        Transaction.countDocuments(),
        Goal.countDocuments(),
        Habit.countDocuments(),
        User.find().select("-password").sort({ createdAt: -1 }),
      ]);

    return res.status(200).json({
      metrics: {
        totalUsers,
        totalTransactions,
        totalGoals,
        totalHabits,
      },
      totalUsers,
      totalTransactions,
      totalGoals,
      totalHabits,
      users,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// @desc    Get platform metrics
// @route   GET /api/admin/metrics
export const getPlatformMetrics = async (req, res) => {
  try {
    const [totalUsers, totalTransactions, totalGoals, totalHabits] =
      await Promise.all([
        User.countDocuments(),
        Transaction.countDocuments(),
        Goal.countDocuments(),
        Habit.countDocuments(),
      ]);

    return res.status(200).json({
      totalUsers,
      totalTransactions,
      totalGoals,
      totalHabits,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// @desc    Get all user accounts
// @route   GET /api/admin/users
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    return res.status(200).json(users);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

