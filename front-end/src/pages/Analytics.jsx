import React, { useState, useEffect } from "react";
import API from "../api/axios.js";
import Sidebar from "../components/Sidebar.jsx";
import Navbar from "../components/Navbar.jsx";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  CartesianGrid,
} from "recharts";
import { BarChart3, PieChart as PieIcon, TrendingUp, Wallet } from "lucide-react";

const EXPENSE_COLORS = [
  "#6366F1", // Indigo
  "#F43F5E", // Rose
  "#F59E0B", // Amber
  "#EC4899", // Pink
  "#8B5CF6", // Purple
  "#06B6D4", // Cyan
  "#64748B", // Slate
];

const INCOME_COLORS = [
  "#10B981", // Emerald
  "#06B6D4", // Cyan
  "#6366F1", // Indigo
  "#3B82F6", // Blue
  "#14B8A6", // Teal
  "#84CC16", // Lime
  "#F59E0B", // Amber
];

const Analytics = () => {
  const [transactions, setTransactions] = useState([]);
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalyticsData = async () => {
      try {
        const [txnRes, goalRes] = await Promise.all([
          API.get("/transactions"),
          API.get("/goals"),
        ]);
        setTransactions(txnRes.data);
        setGoals(goalRes.data);
      } catch (err) {
        console.error("Failed to load analytics data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalyticsData();
  }, []);

  // 1. Category Breakdown for Expenses (Pie Chart)
  const expenseCategoryData = transactions
    .filter((t) => t.type?.toLowerCase() === "expense")
    .reduce((acc, curr) => {
      const existing = acc.find((item) => item.name === curr.category);
      if (existing) {
        existing.value += Number(curr.amount);
      } else {
        acc.push({ name: curr.category, value: Number(curr.amount) });
      }
      return acc;
    }, []);

  // 2. Category Breakdown for Income (Pie Chart)
  const incomeCategoryData = transactions
    .filter((t) => t.type?.toLowerCase() === "income")
    .reduce((acc, curr) => {
      const existing = acc.find((item) => item.name === curr.category);
      if (existing) {
        existing.value += Number(curr.amount);
      } else {
        acc.push({ name: curr.category, value: Number(curr.amount) });
      }
      return acc;
    }, []);

  // 3. Cash Flow Aggregate: Income vs Expenses (Bar Chart)
  const totalIncome = transactions
    .filter((t) => t.type?.toLowerCase() === "income")
    .reduce((acc, curr) => acc + Number(curr.amount), 0);

  const totalExpense = transactions
    .filter((t) => t.type?.toLowerCase() === "expense")
    .reduce((acc, curr) => acc + Number(curr.amount), 0);

  const comparisonData = [
    { name: "Total Inflow", amount: totalIncome, fill: "#10B981" },
    { name: "Total Outflow", amount: totalExpense, fill: "#F43F5E" },
  ];

  // 4. Goal Accumulation Progress (Bar Chart)
  const goalProgressData = goals.map((g) => {
    const title = g.title || g.goal || "Goal";
    return {
      name: title.length > 12 ? `${title.substring(0, 10)}...` : title,
      Saved: Number(g.savedAmount || g.currentSavings || 0),
      Target: Number(g.targetAmount || 0),
    };
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex">
      <Sidebar />

      <div className="flex-1 ml-64 flex flex-col min-h-screen">
        <Navbar />

        <main className="p-8 space-y-8 flex-1">
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">
              Visual Wealth Analytics & Insights
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              Deep dive into cash flow comparisons, savings milestones, and category distributions.
            </p>
          </div>

          {loading ? (
            <div className="flex items-center justify-center h-64 text-slate-500 text-sm">
              Crunching analytical data...
            </div>
          ) : (
            <div className="space-y-8">
              {/* Row 1: Bar Charts (Cash Flow & Goal Reserves) */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Cash Flow Distribution */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className="text-lg font-bold text-white flex items-center gap-2">
                        <BarChart3 className="w-5 h-5 text-indigo-400" />
                        Inflow vs Outflow
                      </h2>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Net comparison of total revenue vs spend
                      </p>
                    </div>
                  </div>

                  <div className="h-72 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={comparisonData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
                        <XAxis dataKey="name" stroke="#94A3B8" fontSize={12} tickLine={false} />
                        <YAxis
                          stroke="#94A3B8"
                          fontSize={12}
                          tickLine={false}
                          tickFormatter={(val) => `₹${val}`}
                        />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "#0F172A",
                            borderColor: "#334155",
                            borderRadius: "0.75rem",
                            color: "#F8FAFC",
                          }}
                          formatter={(value) => [`₹${Number(value).toLocaleString("en-IN")}`, "Amount"]}
                        />
                        <Bar dataKey="amount" radius={[8, 8, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Goal Capital vs Target Progress */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className="text-lg font-bold text-white flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-indigo-400" />
                        Goal Reserve Comparison
                      </h2>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Saved liquidity versus target goal thresholds
                      </p>
                    </div>
                  </div>

                  <div className="h-72 w-full">
                    {goalProgressData.length === 0 ? (
                      <div className="h-full flex items-center justify-center text-slate-500 text-sm">
                        No goal milestones established yet
                      </div>
                    ) : (
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={goalProgressData} barGap={8}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
                          <XAxis dataKey="name" stroke="#94A3B8" fontSize={12} tickLine={false} />
                          <YAxis
                            stroke="#94A3B8"
                            fontSize={12}
                            tickLine={false}
                            tickFormatter={(val) => `₹${val}`}
                          />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: "#0F172A",
                              borderColor: "#334155",
                              borderRadius: "0.75rem",
                              color: "#F8FAFC",
                            }}
                            formatter={(value) => [`₹${Number(value).toLocaleString("en-IN")}`]}
                          />
                          <Legend wrapperStyle={{ fontSize: "12px", color: "#94A3B8" }} />
                          <Bar dataKey="Saved" fill="#6366F1" radius={[6, 6, 0, 0]} />
                          <Bar dataKey="Target" fill="#334155" radius={[6, 6, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    )}
                  </div>
                </div>
              </div>

              {/* Row 2: Pie Charts (Expense & Income Category Allocations) */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Expense Allocation by Category */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className="text-lg font-bold text-white flex items-center gap-2">
                        <PieIcon className="w-5 h-5 text-rose-400" />
                        Expense Category Share
                      </h2>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Proportional distribution of outgoings
                      </p>
                    </div>
                  </div>

                  <div className="h-72 w-full">
                    {expenseCategoryData.length === 0 ? (
                      <div className="h-full flex items-center justify-center text-slate-500 text-sm">
                        No expenses logged yet
                      </div>
                    ) : (
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
                          <Pie
                            data={expenseCategoryData}
                            dataKey="value"
                            nameKey="name"
                            cx="50%"
                            cy="45%"
                            innerRadius={55}
                            outerRadius={85}
                            paddingAngle={4}
                          >
                            {expenseCategoryData.map((entry, index) => (
                              <Cell
                                key={`cell-expense-${index}`}
                                fill={EXPENSE_COLORS[index % EXPENSE_COLORS.length]}
                              />
                            ))}
                          </Pie>
                          <Tooltip
                            contentStyle={{
                              backgroundColor: "#0F172A",
                              borderColor: "#334155",
                              borderRadius: "0.75rem",
                              color: "#F8FAFC",
                            }}
                            formatter={(value) => [
                              `₹${Number(value).toLocaleString("en-IN")}`,
                              "Spent",
                            ]}
                          />
                          <Legend
                            verticalAlign="bottom"
                            height={36}
                            wrapperStyle={{ fontSize: "12px", color: "#94A3B8", paddingTop: "8px" }}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    )}
                  </div>
                </div>

                {/* Income Allocation by Category */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className="text-lg font-bold text-white flex items-center gap-2">
                        <Wallet className="w-5 h-5 text-emerald-400" />
                        Income Category Share
                      </h2>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Proportional distribution of incoming revenue
                      </p>
                    </div>
                  </div>

                  <div className="h-72 w-full">
                    {incomeCategoryData.length === 0 ? (
                      <div className="h-full flex items-center justify-center text-slate-500 text-sm">
                        No income logged yet
                      </div>
                    ) : (
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
                          <Pie
                            data={incomeCategoryData}
                            dataKey="value"
                            nameKey="name"
                            cx="50%"
                            cy="45%"
                            innerRadius={55}
                            outerRadius={85}
                            paddingAngle={4}
                          >
                            {incomeCategoryData.map((entry, index) => (
                              <Cell
                                key={`cell-income-${index}`}
                                fill={INCOME_COLORS[index % INCOME_COLORS.length]}
                              />
                            ))}
                          </Pie>
                          <Tooltip
                            contentStyle={{
                              backgroundColor: "#0F172A",
                              borderColor: "#334155",
                              borderRadius: "0.75rem",
                              color: "#F8FAFC",
                            }}
                            formatter={(value) => [
                              `₹${Number(value).toLocaleString("en-IN")}`,
                              "Earned",
                            ]}
                          />
                          <Legend
                            verticalAlign="bottom"
                            height={36}
                            wrapperStyle={{ fontSize: "12px", color: "#94A3B8", paddingTop: "8px" }}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Analytics;
