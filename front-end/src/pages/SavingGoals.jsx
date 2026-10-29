import React, { useState, useEffect } from "react";
import API from "../api/axios.js";
import Sidebar from "../components/Sidebar.jsx";
import Navbar from "../components/Navbar.jsx";
import {
  Target,
  PlusCircle,
  Trash2,
  DollarSign,
  Calendar,
  CheckCircle2,
  Clock,
  TrendingUp,
} from "lucide-react";

const SavingGoals = () => {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form State
  const [formData, setFormData] = useState({
    title: "",
    targetAmount: "",
    savedAmount: "",
    deadline: "",
    status: "in_progress",
  });

  // Modal or Quick Deposit State
  const [depositGoalId, setDepositGoalId] = useState(null);
  const [depositAmount, setDepositAmount] = useState("");

  const fetchGoals = async () => {
    try {
      const res = await API.get("/goals");
      setGoals(res.data);
    } catch (err) {
      console.error("Failed to load goals:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGoals();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCreateGoal = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.targetAmount) return;

    try {
      const res = await API.post("/goals", {
        ...formData,
        targetAmount: Number(formData.targetAmount),
        savedAmount: Number(formData.savedAmount || 0),
      });
      setGoals([res.data, ...goals]);
      setFormData({
        title: "",
        targetAmount: "",
        savedAmount: "",
        deadline: "",
        status: "in_progress",
      });
    } catch (err) {
      console.error("Failed to create goal:", err);
    }
  };

  const handleDeposit = async (e) => {
    e.preventDefault();
    if (!depositAmount || Number(depositAmount) <= 0) return;

    const targetGoal = goals.find((g) => g._id === depositGoalId);
    if (!targetGoal) return;

    const newSavedAmount = Number(targetGoal.savedAmount) + Number(depositAmount);

    try {
      const res = await API.put(`/goals/${depositGoalId}`, {
        savedAmount: newSavedAmount,
      });

      setGoals(goals.map((g) => (g._id === depositGoalId ? res.data : g)));
      setDepositGoalId(null);
      setDepositAmount("");
    } catch (err) {
      console.error("Failed to add contribution:", err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await API.delete(`/goals/${id}`);
      setGoals(goals.filter((g) => g._id !== id));
    } catch (err) {
      console.error("Failed to delete goal:", err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex">
      <Sidebar />

      <div className="flex-1 ml-64 flex flex-col min-h-screen">
        <Navbar />

        <main className="p-8 space-y-8 flex-1">
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">
              Wealth & Savings Targets
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              Set capital accumulation goals, schedule deadlines, and monitor your progress.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Create Goal Form */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 h-fit">
              <h2 className="text-lg font-bold text-white mb-5 flex items-center gap-2">
                <PlusCircle className="w-5 h-5 text-indigo-400" />
                New Milestone Target
              </h2>

              <form onSubmit={handleCreateGoal} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                    Goal Title
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                    placeholder="e.g. Emergency Reserve, Bike Down Payment"
                    className="w-full bg-slate-800/60 border border-slate-700 rounded-xl py-2.5 px-3.5 text-white text-sm placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                      Target (₹)
                    </label>
                    <input
                      type="number"
                      name="targetAmount"
                      value={formData.targetAmount}
                      onChange={handleChange}
                      required
                      placeholder="50000"
                      className="w-full bg-slate-800/60 border border-slate-700 rounded-xl py-2.5 px-3.5 text-white text-sm placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                      Initial Capital (₹)
                    </label>
                    <input
                      type="number"
                      name="savedAmount"
                      value={formData.savedAmount}
                      onChange={handleChange}
                      placeholder="0"
                      className="w-full bg-slate-800/60 border border-slate-700 rounded-xl py-2.5 px-3.5 text-white text-sm placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                    Target Date / Deadline
                  </label>
                  <input
                    type="date"
                    name="deadline"
                    value={formData.deadline}
                    onChange={handleChange}
                    className="w-full bg-slate-800/60 border border-slate-700 rounded-xl py-2.5 px-3.5 text-white text-sm focus:outline-none focus:border-indigo-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                    Status
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="w-full bg-slate-800/60 border border-slate-700 rounded-xl py-2.5 px-3.5 text-white text-sm focus:outline-none focus:border-indigo-500 transition-colors"
                  >
                    <option value="in_progress">In Progress</option>
                    <option value="achieved">Achieved</option>
                    <option value="paused">Paused</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full mt-2 bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg shadow-indigo-600/20"
                >
                  <Target className="w-4 h-4" />
                  Lock In Goal
                </button>
              </form>
            </div>

            {/* Goals Display List */}
            <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-lg font-bold text-white">Active Financial Goals</h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {goals.length} targets configured
                  </p>
                </div>
              </div>

              {loading ? (
                <p className="text-slate-500 text-sm py-12 text-center">
                  Loading goals...
                </p>
              ) : goals.length === 0 ? (
                <p className="text-slate-500 text-sm py-12 text-center">
                  No targets established yet. Set your first goal on the left.
                </p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {goals.map((g) => {
                    const progress = Math.min(
                      Math.round(((g.savedAmount || 0) / g.targetAmount) * 100),
                      100
                    );
                    const isCompleted = progress >= 100 || g.status === "achieved";

                    return (
                      <div
                        key={g._id}
                        className="bg-slate-800/40 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between hover:border-slate-700 transition-all"
                      >
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span
                              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold capitalize ${
                                isCompleted
                                  ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                                  : "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20"
                              }`}
                            >
                              {isCompleted ? (
                                <CheckCircle2 className="w-3.5 h-3.5" />
                              ) : (
                                <Clock className="w-3.5 h-3.5" />
                              )}
                              {isCompleted ? "Achieved" : g.status.replace("_", " ")}
                            </span>

                            <button
                              onClick={() => handleDelete(g._id)}
                              className="text-slate-500 hover:text-rose-400 p-1 rounded-lg transition-colors cursor-pointer"
                              title="Delete goal"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>

                          <h3 className="text-base font-semibold text-white tracking-tight">
                            {g.title}
                          </h3>

                          {g.deadline && (
                            <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                              <Calendar className="w-3.5 h-3.5" />
                              Target Date: {new Date(g.deadline).toLocaleDateString()}
                            </p>
                          )}

                          {/* Progress Metrics */}
                          <div className="mt-5 space-y-2">
                            <div className="flex justify-between items-baseline text-xs">
                              <span className="text-slate-400">
                                ₹{Number(g.savedAmount || 0).toLocaleString("en-IN")} of ₹
                                {Number(g.targetAmount).toLocaleString("en-IN")}
                              </span>
                              <span className="font-bold text-white">{progress}%</span>
                            </div>

                            <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full transition-all duration-500 ${
                                  isCompleted ? "bg-emerald-500" : "bg-indigo-600"
                                }`}
                                style={{ width: `${progress}%` }}
                              />
                            </div>
                          </div>
                        </div>

                        {/* Contribution Button / Form */}
                        <div className="mt-5 pt-4 border-t border-slate-800/80">
                          {depositGoalId === g._id ? (
                            <form onSubmit={handleDeposit} className="flex gap-2">
                              <input
                                type="number"
                                autoFocus
                                value={depositAmount}
                                onChange={(e) => setDepositAmount(e.target.value)}
                                placeholder="Amount (₹)"
                                className="w-full bg-slate-900 border border-slate-700 rounded-xl py-1.5 px-3 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-indigo-500"
                              />
                              <button
                                type="submit"
                                className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium rounded-xl cursor-pointer"
                              >
                                Save
                              </button>
                              <button
                                type="button"
                                onClick={() => setDepositGoalId(null)}
                                className="px-2 py-1.5 text-slate-400 hover:text-white text-xs cursor-pointer"
                              >
                                Cancel
                              </button>
                            </form>
                          ) : (
                            <button
                              onClick={() => {
                                setDepositGoalId(g._id);
                                setDepositAmount("");
                              }}
                              disabled={isCompleted}
                              className={`w-full py-2 px-3 rounded-xl text-xs font-medium flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                                isCompleted
                                  ? "bg-slate-800 text-slate-500 cursor-not-allowed"
                                  : "bg-slate-800/80 hover:bg-slate-800 text-indigo-400 border border-slate-700/60"
                              }`}
                            >
                              <TrendingUp className="w-3.5 h-3.5" />
                              {isCompleted ? "Goal Completed" : "Contribute Funds"}
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default SavingGoals;