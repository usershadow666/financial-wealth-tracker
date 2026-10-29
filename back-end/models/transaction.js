import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true, trim: true },
    amount: { type: Number, required: true },
    type: {
      type: String,
      enum: ["income", "expense", "Income", "Expense"],
      required: true,
      set: (v) => (v ? v.toLowerCase() : v),
    },
    category: { type: String, required: true, trim: true },
    date: { type: Date, default: Date.now, required: true },
    description: { type: String, trim: true },
  },
  { timestamps: true }
);

const Transaction = mongoose.model("Transaction", transactionSchema);
export default Transaction;
