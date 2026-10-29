import Goal from "../models/goal.js";

// @desc    Get all goals for logged-in user
// @route   GET /api/goals
export const getGoals = async (req, res) => {
  try {
    const goals = await Goal.find({ user: req.user._id }).sort({ createdAt: -1 });
    return res.status(200).json(goals);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// @desc    Create a new financial goal
// @route   POST /api/goals
export const createGoal = async (req, res) => {
  try {
    const { title, targetAmount, savedAmount, deadline, status } = req.body;

    if (!title || !targetAmount) {
      return res.status(400).json({ message: "Title and target amount are required" });
    }

    const goal = await Goal.create({
      user: req.user._id,
      title,
      targetAmount,
      savedAmount: savedAmount || 0,
      deadline,
      status: status || "in_progress",
    });

    return res.status(201).json(goal);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// @desc    Update progress or status of a goal
// @route   PUT /api/goals/:id
export const updateGoal = async (req, res) => {
  try {
    const goal = await Goal.findById(req.params.id);

    if (!goal) {
      return res.status(404).json({ message: "Goal not found" });
    }

    if (goal.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "User not authorized" });
    }

    const { title, targetAmount, savedAmount, deadline, status } = req.body;

    goal.title = title || goal.title;
    goal.targetAmount = targetAmount !== undefined ? targetAmount : goal.targetAmount;
    goal.savedAmount = savedAmount !== undefined ? savedAmount : goal.savedAmount;
    goal.deadline = deadline || goal.deadline;
    goal.status = status || goal.status;

    // Auto-update status if target reached
    if (goal.savedAmount >= goal.targetAmount) {
      goal.status = "achieved";
    }

    const updatedGoal = await goal.save();
    return res.status(200).json(updatedGoal);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a goal
// @route   DELETE /api/goals/:id
export const deleteGoal = async (req, res) => {
  try {
    const goal = await Goal.findById(req.params.id);

    if (!goal) {
      return res.status(404).json({ message: "Goal not found" });
    }

    if (goal.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "User not authorized" });
    }

    await goal.deleteOne();
    return res.status(200).json({ id: req.params.id, message: "Goal removed" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};