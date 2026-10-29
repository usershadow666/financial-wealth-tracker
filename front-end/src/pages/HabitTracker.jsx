import React, { useState, useEffect } from "react";
import API from "../api/axios.js";
import Sidebar from "../components/Sidebar.jsx";
import Navbar from "../components/Navbar.jsx";
import {
  Flame,
  PlusCircle,
  Check,
  Trash2,
  Calendar,
  Sparkles,
} from "lucide-react";

const HabitTracker = () => {
  const [habits, setHabits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    frequency: "daily",
  });

  const fetchHabits = async () => {
    try {
      const res = await API.get("/habits");
      setHabits(res.data);
    } catch (err) {
      console.error("Failed to load habits:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHabits();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCreateHabit = async (e) => {
    e.preventDefault();
    if (!formData.title) return;

    try {
      const res = await API.post("/habits", formData);
      setHabits([res.data, ...habits]);
      setFormData({ title: "", description: "", frequency: "daily" });
    } catch (err) {
      console.error("Failed to create habit:", err);
    }
  };

  const handleCheckin = async (id) => {
    try {
      const res = await API.put(`/habits/${id}/checkin`);
      setHabits(habits.map((h) => (h._id === id ? res.data : h)));
    } catch (err) {
      console.error("Failed to log checkin:", err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await API.delete(`/habits/${id}`);
      setHabits(habits.filter((h) => h._id !== id));
    } catch (err) {
      console.error("Failed to delete habit:", err);
    }
  };

  // Check if a habit was already completed today
  const isCompletedToday = (streakLog) => {
    if (!streakLog || streakLog.length === 0) return false;
    const latestDate = new Date(streakLog[streakLog.length - 1]).toDateString();
    return latestDate === new Date().toDateString();
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex">
      <Sidebar />

      <div className="flex-1 ml-64 flex flex-col min-h-screen">
        <Navbar />

        <main className="p-8 space-y-8 flex-1">
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">
              Financial & Lifestyle Habit Builder
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              Reinforce daily financial discipline, health, and skill routines.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Create Habit Form */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 h-fit">
              <h2 className="text-lg font-bold text-white mb-5 flex items-center gap-2">
                <PlusCircle className="w-5 h-5 text-indigo-400" />
                Define Habit
              </h2>

              <form onSubmit={handleCreateHabit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                    Habit Title
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                    placeholder="e.g. Review daily balance, Zero impulsive spends"
                    className="w-full bg-slate-800/60 border border-slate-700 rounded-xl py-2.5 px-3.5 text-white text-sm placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                    Frequency
                  </label>
                  <select
                    name="frequency"
                    value={formData.frequency}
                    onChange={handleChange}
                    className="w-full bg-slate-800/60 border border-slate-700 rounded-xl py-2.5 px-3.5 text-white text-sm focus:outline-none focus:border-indigo-500 transition-colors cursor-pointer"
                  >
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                    Description / Rule (Optional)
                  </label>
                  <textarea
                    rows={3}
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Log expenses before 10 PM every evening..."
                    className="w-full bg-slate-800/60 border border-slate-700 rounded-xl py-2.5 px-3.5 text-white text-sm placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 transition-colors resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full mt-2 bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg shadow-indigo-600/20"
                >
                  <Sparkles className="w-4 h-4" />
                  Initiate Habit
                </button>
              </form>
            </div>

            {/* Active Habits List */}
            <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-lg font-bold text-white">Active Habits</h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Continuous streaks power compounded habits over time.
                  </p>
                </div>
              </div>

              {loading ? (
                <p className="text-slate-500 text-sm py-12 text-center">
                  Loading habits...
                </p>
              ) : habits.length === 0 ? (
                <p className="text-slate-500 text-sm py-12 text-center">
                  No habits set yet. Create your first routine using the form.
                </p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {habits.map((h) => {
                    const completedToday = isCompletedToday(h.streakLog);

                    return (
                      <div
                        key={h._id}
                        className="bg-slate-800/40 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between hover:border-slate-700 transition-all"
                      >
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-amber-500/10 border border-amber-500/20 rounded-lg text-amber-400 text-xs font-semibold">
                                <Flame className="w-3.5 h-3.5 fill-amber-400" />
                                {h.streak} {h.streak === 1 ? "Day" : "Days"}
                              </span>
                              <span className="inline-flex items-center px-2 py-0.5 bg-slate-800 text-slate-400 border border-slate-700 rounded-md text-[11px] font-medium capitalize">
                                {h.frequency || "daily"}
                              </span>
                            </div>

                            <button
                              onClick={() => handleDelete(h._id)}
                              className="text-slate-500 hover:text-rose-400 p-1 rounded-lg transition-colors cursor-pointer"
                              title="Delete habit"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>

                          <h3 className="text-base font-semibold text-white tracking-tight">
                            {h.title}
                          </h3>
                          {h.description && (
                            <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                              {h.description}
                            </p>
                          )}
                        </div>

                        <div className="mt-5 pt-4 border-t border-slate-800/80 flex items-center justify-between">
                          <span className="text-xs text-slate-500 flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5" />
                            {completedToday ? "Done for today" : "Pending check-in"}
                          </span>

                          <button
                            onClick={() => handleCheckin(h._id)}
                            disabled={completedToday}
                            className={`px-3 py-1.5 rounded-xl text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
                              completedToday
                                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 cursor-not-allowed"
                                : "bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/20"
                            }`}
                          >
                            <Check className="w-3.5 h-3.5" />
                            {completedToday ? "Completed" : "Check-in"}
                          </button>
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

export default HabitTracker;
