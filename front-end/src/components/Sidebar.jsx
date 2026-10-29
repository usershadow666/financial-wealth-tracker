import React from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Receipt,
  CheckSquare,
  Target,
  BarChart3,
  ShieldCheck,
  Wallet,
} from "lucide-react";

const navItems = [
  { name: "Dashboard", path: "/", icon: LayoutDashboard },
  { name: "Expenses", path: "/expenses", icon: Receipt },
  { name: "Habits", path: "/habits", icon: CheckSquare },
  { name: "Goals", path: "/goals", icon: Target },
  { name: "Analytics", path: "/analytics", icon: BarChart3 },
  { name: "Admin", path: "/admin", icon: ShieldCheck },
];

const Sidebar = () => {
  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col h-screen fixed left-0 top-0 z-20">
      {/* Brand Header */}
      <div className="h-16 flex items-center gap-3 px-6 border-b border-slate-800">
        <div className="p-2 bg-indigo-600/20 text-indigo-400 rounded-lg">
          <Wallet className="w-5 h-5" />
        </div>
        <span className="text-lg font-bold text-white tracking-wide">Expense Tracker</span>
      </div>

      {/* Nav Links */}
      <nav className="flex-1 px-4 py-6 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
                }`
              }
            >
              <Icon className="w-4 h-4" />
              {item.name}
            </NavLink>
          );
        })}
      </nav>

      {/* Footer Info */}
      <div className="p-4 border-t border-slate-800 text-xs text-slate-500">
        Expense Tracker Engine v1.0
      </div>
    </aside>
  );
};

export default Sidebar;
