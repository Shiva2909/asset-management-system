import React from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Box,
  Share2,
  Receipt,
  LogOut,
  ListSortDescending,
  IdCardLanyard,
  ToolCase,
} from "lucide-react";
import { useAuth } from "../../hooks/useAuth";

export const Sidebar = () => {
  const { user, logout } = useAuth();

  const links = [
    {
      name: "Dashboard",
      to: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "Asset Inventory",
      to: "/assets",
      icon: Box,
    },
    {
      name: "Asset Allocation",
      to: "/allocations",
      icon: Share2,
    },
    {
      name: "Bills & Invoices",
      to: "/bills",
      icon: Receipt,
    },
    {
      name: "Category",
      to: "/category",
      icon: ListSortDescending,
    },
    {
      name: "Employees",
      to: "/Employee",
      icon: IdCardLanyard,
    },
    {
      name: "Maintenance",
      to: "/maintenance",
      icon: ToolCase,
    },
  ];

  return (
    <aside
      className="
        hidden lg:flex
        flex-col
        w-56
        bg-slate-900
        border-r border-slate-800
        text-white
        min-h-screen
        shrink-0
      "
    >
      {/* ================= HEADER ================= */}
      <div
        className="
          flex
          h-16
          items-center
          px-4
          border-b border-slate-800
          gap-2.5
        "
      >
        {/* Logo */}
        <div
          className="
            w-8 h-8
            rounded-lg
            bg-sky-500
            flex items-center justify-center
            font-bold
            text-sm
            text-white
            shadow-md
            shadow-sky-500/20
            shrink-0
          "
        >
          A
        </div>

        {/* Company Name */}
        <div className="min-w-0">
          <h1
            className="
              text-xs
              font-bold
              tracking-wide
              uppercase
              text-white
            "
          >
            PDPL
          </h1>

          <p
            className="
              text-[9px]
              text-slate-400
              font-medium
            "
          >
            Enterprise AMS
          </p>
        </div>
      </div>

      {/* ================= NAVIGATION ================= */}
      <nav className="flex-1 space-y-1 px-2.5 py-5">
        {links.map((link) => {
          const Icon = link.icon;

          return (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `
                flex
                items-center
                gap-2.5
                rounded-lg
                px-2.5
                py-2.5
                text-xs
                font-medium
                transition-colors
                ${
                  isActive
                    ? "bg-sky-600 text-white shadow-sm"
                    : "text-slate-400 hover:bg-slate-800 hover:text-slate-200"
                }
                `
              }
            >
              <Icon className="w-4 h-4 shrink-0" />

              <span className="truncate">{link.name}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* ================= USER SECTION ================= */}
      <div className="p-3 border-t border-slate-800">
        <div className="flex items-center gap-2.5 px-2 mb-3">
          {/* Avatar */}
          <div
            className="
              w-9 h-9
              rounded-full
              bg-slate-700
              flex items-center justify-center
              font-semibold
              text-sm
              text-slate-200
              shrink-0
            "
          >
            {user?.name ? user.name[0] : "U"}
          </div>

          {/* User Details */}
          <div className="overflow-hidden min-w-0">
            <p
              className="
                text-[11px]
                font-semibold
                text-white
                truncate
              "
            >
              {user?.name || "Admin"}
            </p>

            <p
              className="
                text-[10px]
                text-slate-400
                truncate
              "
            >
              {user?.role || "Administrator"}
            </p>
          </div>
        </div>

        {/* Logout */}
        <button
          onClick={logout}
          className="
            flex
            w-full
            items-center
            gap-2
            rounded-lg
            px-2.5
            py-2
            text-xs
            font-medium
            text-rose-400
            hover:bg-rose-500/10
            hover:text-rose-300
            transition-colors
          "
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
};
