import Transaction from "../models/transaction.js";

// @desc    Get all transactions for logged-in user
// @route   GET /api/transactions
export const getTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find({ user: req.user._id }).sort({
      date: -1,
    });
    return res.status(200).json(transactions);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// @desc    Add a new transaction
// @route   POST /api/transactions
export const addTransaction = async (req, res) => {
  try {
    const { title, amount, type, category, date, description } = req.body;

    if (!title || !amount || !type || !category) {
      return res.status(400).json({ message: "Please provide all required fields" });
    }

    const transaction = await Transaction.create({
      user: req.user._id,
      title,
      amount,
      type,
      category,
      date: date || Date.now(),
      description,
    });

    return res.status(201).json(transaction);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a transaction
// @route   DELETE /api/transactions/:id
export const deleteTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);

    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    // Ensure transaction belongs to the logged-in user
    if (transaction.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "User not authorized" });
    }

    await transaction.deleteOne();
    return res.status(200).json({ id: req.params.id, message: "Transaction removed" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};