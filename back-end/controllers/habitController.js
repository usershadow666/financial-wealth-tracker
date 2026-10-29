import Habit from "../models/habit.js";

// @desc    Get all habits for logged-in user
// @route   GET /api/habits
export const getHabits = async (req, res) => {
  try {
    const habits = await Habit.find({ user: req.user._id }).sort({ createdAt: -1 });
    return res.status(200).json(habits);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// @desc    Create a new habit
// @route   POST /api/habits
export const createHabit = async (req, res) => {
  try {
    const { title, description } = req.body;

    if (!title) {
      return res.status(400).json({ message: "Habit title is required" });
    }

    const habit = await Habit.create({
      user: req.user._id,
      title,
      description: description || "",
      streak: 0,
      streakLog: [],
    });

    return res.status(201).json(habit);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// @desc    Log a completed day & increment streak
// @route   PUT /api/habits/:id/checkin
export const checkinHabit = async (req, res) => {
  try {
    const habit = await Habit.findById(req.params.id);

    if (!habit) {
      return res.status(404).json({ message: "Habit not found" });
    }

    if (habit.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "User not authorized" });
    }

    // Append today's timestamp and increment streak count
    habit.streak += 1;
    habit.streakLog.push(new Date());

    const updatedHabit = await habit.save();
    return res.status(200).json(updatedHabit);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a habit
// @route   DELETE /api/habits/:id
export const deleteHabit = async (req, res) => {
  try {
    const habit = await Habit.findById(req.params.id);

    if (!habit) {
      return res.status(404).json({ message: "Habit not found" });
    }

    if (habit.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "User not authorized" });
    }

    await habit.deleteOne();
    return res.status(200).json({ id: req.params.id, message: "Habit removed" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};