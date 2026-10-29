import React, { useState, useEffect } from "react";
import API from "../api/axios.js";
import Sidebar from "../components/Sidebar.jsx";
import Navbar from "../components/Navbar.jsx";
import StatCard from "../components/StatCard.jsx";
import {
  Users,
  Receipt,
  Target,
  Flame,
  Shield,
  ShieldCheck,
  Search,
  RefreshCw,
  AlertTriangle,
} from "lucide-react";

const AdminPanel = () => {
  const [data, setData] = useState({
    totalUsers: 0,
    totalTransactions: 0,
    totalGoals: 0,
    totalHabits: 0,
    users: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");

  const fetchAdminData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await API.get("/admin");
      const result = res.data;

      const metrics = result.metrics || {};
      setData({
        totalUsers: metrics.totalUsers ?? result.totalUsers ?? (result.users ? result.users.length : 0),
        totalTransactions: metrics.totalTransactions ?? result.totalTransactions ?? 0,
        totalGoals: metrics.totalGoals ?? result.totalGoals ?? 0,
        totalHabits: metrics.totalHabits ?? result.totalHabits ?? 0,
        users: result.users || [],
      });
    } catch (err) {
      console.error("Failed to fetch admin data:", err);
      const message =
        err.response?.status === 403
          ? "Access denied. You need admin privileges to view this portal."
          : err.response?.data?.message || "Failed to load admin panel data.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const filteredUsers = data.users.filter((user) => {
    const matchesSearch =
      (user.name && user.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (user.email && user.email.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesRole =
      roleFilter === "all" || (user.role || "user") === roleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="flex bg-slate-950 min-h-screen text-slate-100">
      <Sidebar />

      <div className="flex-1 ml-64 flex flex-col min-h-screen">
        <Navbar />

        <main className="p-8 space-y-8 flex-1">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-6 h-6 text-indigo-400" />
                <h1 className="text-2xl font-bold text-white tracking-tight">
                  Platform Administration
                </h1>
              </div>
              <p className="text-slate-400 text-sm mt-1">
                Monitor system metrics, platform engagement, and registered accounts.
              </p>
            </div>

            <button
              onClick={fetchAdminData}
              disabled={loading}
              className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-xl text-sm font-medium text-slate-300 hover:text-white transition-all cursor-pointer shadow-sm disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </button>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="bg-rose-500/10 border border-rose-500/30 text-rose-400 p-4 rounded-2xl flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 flex-shrink-0" />
              <p className="text-sm font-medium">{error}</p>
            </div>
          )}

          {/* Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <StatCard
              title="Total Users"
              amount={loading ? "..." : data.totalUsers.toLocaleString()}
              icon={Users}
              color="indigo"
              subtitle="Registered accounts"
            />
            <StatCard
              title="Total Transactions"
              amount={loading ? "..." : data.totalTransactions.toLocaleString()}
              icon={Receipt}
              color="emerald"
              subtitle="Tracked finances"
            />
            <StatCard
              title="Active Goals"
              amount={loading ? "..." : data.totalGoals.toLocaleString()}
              icon={Target}
              color="amber"
              subtitle="Savings milestones"
            />
            <StatCard
              title="Habits Logged"
              amount={loading ? "..." : data.totalHabits.toLocaleString()}
              icon={Flame}
              color="rose"
              subtitle="Routines in progress"
            />
          </div>

          {/* User Accounts Section */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-white">Registered Users</h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Showing {filteredUsers.length} of {data.users.length} total user accounts
                </p>
              </div>

              {/* Filters */}
              <div className="flex flex-wrap items-center gap-3">
                <div className="relative">
                  <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search name or email..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-slate-800/60 border border-slate-700/80 rounded-xl pl-9 pr-3.5 py-1.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 transition-colors w-56"
                  />
                </div>

                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className="bg-slate-800/60 border border-slate-700/80 rounded-xl px-3 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-indigo-500 transition-colors"
                >
                  <option value="all">All Roles</option>
                  <option value="admin">Admins</option>
                  <option value="user">Users</option>
                </select>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-800 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    <th className="pb-3 px-4">User</th>
                    <th className="pb-3 px-4">Email</th>
                    <th className="pb-3 px-4">Role</th>
                    <th className="pb-3 px-4">Account ID</th>
                    <th className="pb-3 px-4 text-right">Joined</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {loading ? (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-slate-500 text-sm">
                        Loading accounts...
                      </td>
                    </tr>
                  ) : filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-slate-500 text-sm">
                        No user accounts found matching your query.
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map((u) => {
                      const isAdmin = u.role === "admin";
                      const joinedDate = u.createdAt
                        ? new Date(u.createdAt).toLocaleDateString(undefined, {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })
                        : "N/A";

                      return (
                        <tr key={u._id} className="hover:bg-slate-800/30 transition-colors">
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-lg bg-indigo-600/20 text-indigo-400 flex items-center justify-center font-bold text-xs uppercase border border-indigo-500/20">
                                {u.name ? u.name.charAt(0) : "U"}
                              </div>
                              <span className="font-medium text-white">{u.name}</span>
                            </div>
                          </td>
                          <td className="py-3.5 px-4 text-slate-300">{u.email}</td>
                          <td className="py-3.5 px-4">
                            <span
                              className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                                isAdmin
                                  ? "bg-purple-500/10 text-purple-300 border-purple-500/30"
                                  : "bg-slate-800 text-slate-400 border-slate-700"
                              }`}
                            >
                              <Shield className="w-3 h-3" />
                              {isAdmin ? "Admin" : "User"}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 font-mono text-xs text-slate-500">
                            {u._id}
                          </td>
                          <td className="py-3.5 px-4 text-right text-xs text-slate-400">
                            {joinedDate}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminPanel;

