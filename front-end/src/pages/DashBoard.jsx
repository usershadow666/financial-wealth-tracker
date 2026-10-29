import React, { useState, useEffect } from "react";
import API from "../api/axios.js";
import Sidebar from "../components/Sidebar.jsx";
import Navbar from "../components/Navbar.jsx";
import StatCard from "../components/StatCard.jsx";
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  Target,
  Flame,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
} from "lucide-react";

const DashBoard = () => {
  const [transactions, setTransactions] = useState([]);
  const [habits, setHabits] = useState([]);
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [txnRes, habitRes, goalRes] = await Promise.all([
          API.get("/transactions"),
          API.get("/habits"),
          API.get("/goals"),
        ]);

        setTransactions(txnRes.data);
        setHabits(habitRes.data);
        setGoals(goalRes.data);
      } catch (err) {
        console.error("Failed to load dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Compute Financial Aggregates
  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((acc, curr) => acc + Number(curr.amount), 0);

  const totalExpense = transactions
    .filter((t) => t.type === "expense")
    .reduce((acc, curr) => acc + Number(curr.amount), 0);

  const netBalance = totalIncome - totalExpense;

  const totalSavedInGoals = goals.reduce(
    (acc, curr) => acc + Number(curr.savedAmount || 0),
    0
  );

  const bestStreak = habits.reduce(
    (max, h) => (h.streak > max ? h.streak : max),
    0
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex">
      {/* Fixed Navigation Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 ml-64 flex flex-col min-h-screen">
        <Navbar />

        <main className="p-8 space-y-8 flex-1">
          {/* Header */}
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">
              Financial Overview & Habits
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              Real-time summary of your cashflow, savings targets, and daily consistency.
            </p>
          </div>

          {loading ? (
            <div className="flex items-center justify-center h-64 text-slate-500 text-sm">
              Loading financial metrics...
            </div>
          ) : (
            <>
              {/* Top Stats Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                <StatCard
                  title="Net Balance"
                  amount={`₹${netBalance.toLocaleString("en-IN")}`}
                  icon={Wallet}
                  color={netBalance >= 0 ? "emerald" : "rose"}
                  subtitle="Available liquidity"
                />
                <StatCard
                  title="Total Income"
                  amount={`₹${totalIncome.toLocaleString("en-IN")}`}
                  icon={TrendingUp}
                  color="indigo"
                  subtitle={`${transactions.filter((t) => t.type === "income").length} credit entries`}
                />
                <StatCard
                  title="Total Expenses"
                  amount={`₹${totalExpense.toLocaleString("en-IN")}`}
                  icon={TrendingDown}
                  color="rose"
                  subtitle={`${transactions.filter((t) => t.type === "expense").length} debit entries`}
                />
                <StatCard
                  title="Best Habit Streak"
                  amount={`${bestStreak} Days`}
                  icon={Flame}
                  color="amber"
                  subtitle={`${habits.length} habits tracked`}
                />
              </div>

              {/* Lower Section: Recent Transactions & Goal Milestones */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Recent Ledger Entries (2 cols) */}
                <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-5">
                    <h2 className="text-lg font-bold text-white">Recent Transactions</h2>
                    <span className="text-xs text-slate-400">
                      Showing latest {Math.min(transactions.length, 5)} records
                    </span>
                  </div>

                  {transactions.length === 0 ? (
                    <p className="text-slate-500 text-sm py-8 text-center">
                      No transactions recorded yet. Add your first entry in the Expenses tab.
                    </p>
                  ) : (
                    <div className="space-y-3">
                      {transactions.slice(0, 5).map((t) => (
                        <div
                          key={t._id}
                          className="flex items-center justify-between p-3.5 bg-slate-800/40 border border-slate-800 rounded-xl hover:border-slate-700/80 transition-colors"
                        >
                          <div className="flex items-center gap-3.5">
                            <div
                              className={`p-2.5 rounded-lg border ${
                                t.type === "income"
                                  ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                                  : "bg-rose-500/10 border-rose-500/20 text-rose-400"
                              }`}
                            >
                              {t.type === "income" ? (
                                <ArrowUpRight className="w-4 h-4" />
                              ) : (
                                <ArrowDownRight className="w-4 h-4" />
                              )}
                            </div>
                            <div>
                              <p className="text-sm font-medium text-white">{t.title}</p>
                              <p className="text-xs text-slate-500">
                                {t.category} • {new Date(t.date).toLocaleDateString()}
                              </p>
                            </div>
                          </div>

                          <span
                            className={`text-sm font-semibold ${
                              t.type === "income" ? "text-emerald-400" : "text-slate-200"
                            }`}
                          >
                            {t.type === "income" ? "+" : "-"}₹
                            {Number(t.amount).toLocaleString("en-IN")}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Savings Goal Status Panel (1 col) */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col">
                  <div className="flex items-center justify-between mb-5">
                    <h2 className="text-lg font-bold text-white">Target Milestones</h2>
                    <Target className="w-5 h-5 text-indigo-400" />
                  </div>

                  {goals.length === 0 ? (
                    <p className="text-slate-500 text-sm py-8 text-center flex-1 flex items-center justify-center">
                      No active targets. Define goals in the Goals tab.
                    </p>
                  ) : (
                    <div className="space-y-4 flex-1">
                      {goals.slice(0, 4).map((g) => {
                        const progress = Math.min(
                          Math.round((g.savedAmount / g.targetAmount) * 100),
                          100
                        );

                        return (
                          <div key={g._id} className="space-y-2">
                            <div className="flex justify-between items-center text-xs">
                              <span className="font-medium text-slate-300">{g.title}</span>
                              <span className="text-slate-400">
                                {progress}% (₹{g.savedAmount.toLocaleString("en-IN")})
                              </span>
                            </div>
                            <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-indigo-600 rounded-full transition-all duration-500"
                                style={{ width: `${progress}%` }}
                              />
                            </div>
                          </div>
                        );
                      })}

                      <div className="mt-auto pt-6 border-t border-slate-800 flex justify-between items-center text-xs text-slate-400">
                        <span>Total Accumulated:</span>
                        <span className="text-indigo-400 font-bold text-sm">
                          ₹{totalSavedInGoals.toLocaleString("en-IN")}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default DashBoard;