import mongoose from "mongoose";

const goalSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true, trim: true },
    targetAmount: { type: Number, required: true },
    savedAmount: { type: Number, default: 0 },
    deadline: { type: Date },
    status: {
      type: String,
      enum: ["in_progress", "achieved", "on_hold", "Achieved", "On Hold"],
      default: "in_progress",
    },
  },
  { timestamps: true }
);

const Goal = mongoose.model("Goal", goalSchema);
export default Goal;
