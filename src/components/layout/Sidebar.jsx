import React from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Box,
  Share2,
  Receipt,
  LogOut,
  ListSortDescending,
  ChartBarStacked,
  IdCardLanyard,
} from "lucide-react";
import { useAuth } from "../../hooks/useAuth";

export const Sidebar = () => {
  const { user, logout } = useAuth();

  const links = [
    { name: "Dashboard", to: "/dashboard", icon: LayoutDashboard },
    { name: "Asset Inventory", to: "/assets", icon: Box },
    { name: "Asset Allocation", to: "/allocations", icon: Share2 },
    { name: "Bills & Invoices", to: "/bills", icon: Receipt },
    { name: "Category", to: "/category", icon: ListSortDescending },
    { name: "SubCategory", to: "/subCategory", icon: ChartBarStacked },
    { name: "Employees", to: "/employees", icon: IdCardLanyard },
  ];

  return (
    <aside className="hidden lg:flex flex-col w-64 bg-slate-900 border-r border-slate-800 text-white min-h-screen shrink-0">
      <div className="flex h-16 items-center px-6 border-b border-slate-800 gap-3">
        <div className="w-8 h-8 rounded-lg bg-sky-500 flex items-center justify-center font-bold text-white shadow-md shadow-sky-500/20">
          A
        </div>
        <div>
          <h1 className="text-sm font-bold tracking-wide uppercase text-white">
            EquipTrack
          </h1>
          <p className="text-[10px] text-slate-400 font-medium">
            Enterprise AMS
          </p>
        </div>
      </div>

      <nav className="flex-1 space-y-1.5 px-3 py-6">
        {links.map((link) => {
          const Icon = link.icon;
          return (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-sky-600 text-white shadow-sm"
                    : "text-slate-400 hover:bg-slate-800 hover:text-slate-200"
                }`
              }
            >
              <Icon className="w-4 h-4" />
              {link.name}
            </NavLink>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-800">
        <div className="flex items-center gap-3 px-2 mb-4">
          <div className="w-9 h-9 rounded-full bg-slate-700 flex items-center justify-center font-semibold text-slate-200">
            {user?.name ? user.name[0] : "U"}
          </div>
          <div className="overflow-hidden">
            <p className="text-xs font-semibold text-white truncate">
              {user?.name || "Admin"}
            </p>
            <p className="text-[11px] text-slate-400 truncate">
              {user?.role || "Administrator"}
            </p>
          </div>
        </div>
        <button
          onClick={logout}
          className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>
    </aside>
  );
};
