import React from "react";

const StatCard = ({ title, amount, icon: Icon, color = "indigo", subtitle }) => {
  const colorStyles = {
    indigo: "text-indigo-400 bg-indigo-500/10 border-indigo-500/20",
    emerald: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
    rose: "text-rose-400 bg-rose-500/10 border-rose-500/20",
    amber: "text-amber-400 bg-amber-500/10 border-amber-500/20",
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex items-center justify-between shadow-sm">
      <div className="space-y-1">
        <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">{title}</p>
        <p className="text-2xl font-bold text-white tracking-tight">{amount}</p>
        {subtitle && <p className="text-xs text-slate-500">{subtitle}</p>}
      </div>

      <div className={`p-3.5 rounded-xl border ${colorStyles[color] || colorStyles.indigo}`}>
        <Icon className="w-6 h-6" />
      </div>
    </div>
  );
};

export default StatCard;