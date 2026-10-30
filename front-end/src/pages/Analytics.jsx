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
import { BarChart3, PieChart as PieIcon, TrendingUp } from "lucide-react";

const COLORS = [
  "#6366F1",
  "#10B981",
  "#F59E0B",
  "#EC4899",
  "#8B5CF6",
  "#06B6D4",
  "#F43F5E",
  "#64748B",
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
  const categoryData = transactions
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

  const goalProgressData = goals.map((g) => ({
    name:
      (g.title || g.goal || "Goal").length > 12
        ? `${(g.title || g.goal || "Goal").substring(0, 10)}...`
        : g.title || g.goal || "Goal",
    Saved: Number(g.savedAmount || g.currentSavings || 0),
    Target: Number(g.targetAmount),
  }));

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex">
      <Sidebar />

      <div className="flex-1 ml-64 flex flex-col min-h-screen min-w-0">
        <Navbar />

        <main className="p-8 space-y-8 flex-1 min-w-0">
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">
              Visual Wealth Analytics & Insights
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              Deep dive into category allocations, cash flow balance, and goal pacing.
            </p>
          </div>

          {loading ? (
            <div className="flex items-center justify-center h-64 text-slate-500 text-sm">
              Crunching analytical data...
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 min-w-0">
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col min-w-0">
                <div className="flex items-center justify-between mb-4">
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

                <div className="w-full h-64 min-w-0">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={comparisonData}
                      margin={{ top: 10, right: 10, left: 10, bottom: 10 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
                      <XAxis
                        dataKey="name"
                        stroke="#94A3B8"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                      />
                      <YAxis
                        stroke="#94A3B8"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                        tickFormatter={(val) => `₹${val}`}
                        width={48}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#0F172A",
                          borderColor: "#334155",
                          borderRadius: "0.75rem",
                          color: "#F8FAFC",
                        }}
                        formatter={(value) => [
                          `₹${Number(value).toLocaleString("en-IN")}`,
                          "Amount",
                        ]}
                      />
                      <Bar dataKey="amount" radius={[8, 8, 0, 0]} maxBarSize={60} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col min-w-0">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-lg font-bold text-white flex items-center gap-2">
                      <PieIcon className="w-5 h-5 text-indigo-400" />
                      Expense Category Share
                    </h2>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Proportional distribution of outgoings
                    </p>
                  </div>
                </div>

                <div className="w-full h-64 min-w-0 flex items-center justify-center">
                  {categoryData.length === 0 ? (
                    <p className="text-slate-500 text-sm">No expenses logged yet</p>
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart margin={{ top: 10, right: 10, left: 10, bottom: 20 }}>
                        <Pie
                          data={categoryData}
                          dataKey="value"
                          nameKey="name"
                          cx="50%"
                          cy="45%"
                          innerRadius={48}
                          outerRadius={78}
                          paddingAngle={4}
                          stroke="#0F172A"
                          strokeWidth={2}
                        >
                          {categoryData.map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={COLORS[index % COLORS.length]}
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
                          layout="horizontal"
                          verticalAlign="bottom"
                          align="center"
                          wrapperStyle={{
                            fontSize: "12px",
                            color: "#94A3B8",
                            paddingTop: "10px",
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </div>

              <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col min-w-0">
                <div className="flex items-center justify-between mb-4">
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

                <div className="w-full h-72 min-w-0">
                  {goalProgressData.length === 0 ? (
                    <div className="h-full flex items-center justify-center text-slate-500 text-sm">
                      No goal milestones established yet
                    </div>
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={goalProgressData}
                        barGap={8}
                        margin={{ top: 10, right: 10, left: 10, bottom: 10 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
                        <XAxis
                          dataKey="name"
                          stroke="#94A3B8"
                          fontSize={12}
                          tickLine={false}
                          axisLine={false}
                        />
                        <YAxis
                          stroke="#94A3B8"
                          fontSize={12}
                          tickLine={false}
                          axisLine={false}
                          tickFormatter={(val) => `₹${val}`}
                          width={48}
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
                        <Legend
                          wrapperStyle={{ fontSize: "12px", color: "#94A3B8" }}
                          align="center"
                        />
                        <Bar dataKey="Saved" fill="#6366F1" radius={[6, 6, 0, 0]} maxBarSize={45} />
                        <Bar dataKey="Target" fill="#334155" radius={[6, 6, 0, 0]} maxBarSize={45} />
                      </BarChart>
                    </ResponsiveContainer>
                  )}
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
