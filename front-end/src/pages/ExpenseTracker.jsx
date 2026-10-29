import React, { useState, useEffect } from "react";
import API from "../api/axios.js";
import Sidebar from "../components/Sidebar.jsx";
import Navbar from "../components/Navbar.jsx";
import {
  PlusCircle,
  Trash2,
  ArrowUpRight,
  ArrowDownRight,
  Filter,
} from "lucide-react";

const categories = [
  "Food & Dining",
  "Transport",
  "Salary",
  "Freelance",
  "Investments",
  "Rent & Utilities",
  "Entertainment",
  "Health & Wellness",
  "Other",
];

const ExpenseTracker = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState("all");

  const [formData, setFormData] = useState({
    title: "",
    amount: "",
    type: "expense",
    category: "Food & Dining",
    date: new Date().toISOString().split("T")[0],
  });

  const fetchTransactions = async () => {
    try {
      const res = await API.get("/transactions");
      setTransactions(res.data);
    } catch (err) {
      console.error("Error loading transactions:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCreateTransaction = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.amount) return;

    try {
      const res = await API.post("/transactions", {
        ...formData,
        amount: Number(formData.amount),
      });
      setTransactions([res.data, ...transactions]);
      setFormData({
        title: "",
        amount: "",
        type: "expense",
        category: "Food & Dining",
        date: new Date().toISOString().split("T")[0],
      });
    } catch (err) {
      console.error("Failed to add transaction:", err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await API.delete(`/transactions/${id}`);
      setTransactions(transactions.filter((t) => t._id !== id));
    } catch (err) {
      console.error("Failed to delete transaction:", err);
    }
  };

  const filteredTransactions = transactions.filter((t) => {
    if (filterType === "all") return true;
    return t.type === filterType;
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex">
      <Sidebar />

      <div className="flex-1 ml-64 flex flex-col min-h-screen">
        <Navbar />

        <main className="p-8 space-y-8 flex-1">
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">
              Expense & Cash Flow Ledger
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              Log your inflow and outflows to keep an accurate real-time balance.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Create Transaction Form */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 h-fit">
              <h2 className="text-lg font-bold text-white mb-5 flex items-center gap-2">
                <PlusCircle className="w-5 h-5 text-indigo-400" />
                Add Entry
              </h2>

              <form onSubmit={handleCreateTransaction} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                    Title / Description
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                    placeholder="e.g. Protein supplies, Grocery, Salary"
                    className="w-full bg-slate-800/60 border border-slate-700 rounded-xl py-2.5 px-3.5 text-white text-sm placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                      Amount (₹)
                    </label>
                    <input
                      type="number"
                      name="amount"
                      value={formData.amount}
                      onChange={handleChange}
                      required
                      placeholder="0.00"
                      className="w-full bg-slate-800/60 border border-slate-700 rounded-xl py-2.5 px-3.5 text-white text-sm placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                      Entry Type
                    </label>
                    <select
                      name="type"
                      value={formData.type}
                      onChange={handleChange}
                      className="w-full bg-slate-800/60 border border-slate-700 rounded-xl py-2.5 px-3.5 text-white text-sm focus:outline-none focus:border-indigo-500 transition-colors"
                    >
                      <option value="expense">Expense (Debit)</option>
                      <option value="income">Income (Credit)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                    Category
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full bg-slate-800/60 border border-slate-700 rounded-xl py-2.5 px-3.5 text-white text-sm focus:outline-none focus:border-indigo-500 transition-colors"
                  >
                    {categories.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                    Date
                  </label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    className="w-full bg-slate-800/60 border border-slate-700 rounded-xl py-2.5 px-3.5 text-white text-sm focus:outline-none focus:border-indigo-500 transition-colors"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full mt-2 bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg shadow-indigo-600/20"
                >
                  Record Entry
                </button>
              </form>
            </div>

            {/* Transactions List */}
            <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                  <h2 className="text-lg font-bold text-white">Ledger Records</h2>
                  <p className="text-xs text-slate-400">
                    {filteredTransactions.length} recorded items
                  </p>
                </div>

                {/* Filter Selector */}
                <div className="flex items-center gap-2 bg-slate-800/70 border border-slate-700/60 p-1 rounded-xl">
                  {["all", "expense", "income"].map((type) => (
                    <button
                      key={type}
                      onClick={() => setFilterType(type)}
                      className={`px-3 py-1 text-xs font-medium rounded-lg capitalize transition-colors cursor-pointer ${
                        filterType === type
                          ? "bg-indigo-600 text-white"
                          : "text-slate-400 hover:text-white"
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              {loading ? (
                <p className="text-slate-500 text-sm py-12 text-center">
                  Loading ledger...
                </p>
              ) : filteredTransactions.length === 0 ? (
                <p className="text-slate-500 text-sm py-12 text-center">
                  No records match your selection.
                </p>
              ) : (
                <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
                  {filteredTransactions.map((t) => (
                    <div
                      key={t._id}
                      className="flex items-center justify-between p-4 bg-slate-800/40 border border-slate-800 rounded-xl hover:border-slate-700 transition-colors"
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

                      <div className="flex items-center gap-4">
                        <span
                          className={`text-sm font-semibold ${
                            t.type === "income"
                              ? "text-emerald-400"
                              : "text-slate-200"
                          }`}
                        >
                          {t.type === "income" ? "+" : "-"}₹
                          {Number(t.amount).toLocaleString("en-IN")}
                        </span>

                        <button
                          onClick={() => handleDelete(t._id)}
                          className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors cursor-pointer"
                          title="Delete entry"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ExpenseTracker;