import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext.jsx";
import { LogOut, User } from "lucide-react";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <header className="h-16 bg-slate-900/80 backdrop-blur-md border-b border-slate-800 flex items-center justify-between px-8 sticky top-0 z-10">
      <div>
        <h1 className="text-base font-semibold text-slate-200">
          Welcome, <span className="text-indigo-400">{user?.name || "User"}</span>
        </h1>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2.5 px-3 py-1.5 bg-slate-800/60 border border-slate-700/60 rounded-xl">
          <div className="w-7 h-7 rounded-lg bg-indigo-600/30 text-indigo-400 flex items-center justify-center font-bold text-xs uppercase">
            {user?.name ? user.name.charAt(0) : <User className="w-4 h-4" />}
          </div>
          <span className="text-xs text-slate-300 font-medium">{user?.email}</span>
        </div>

        <button
          onClick={logout}
          className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors cursor-pointer"
          title="Sign Out"
        >
          <LogOut className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
};

export default Navbar;