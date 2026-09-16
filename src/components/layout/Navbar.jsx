import React from "react";
import { Menu, ShieldCheck } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";

export const Navbar = ({ onOpenSidebar }) => {
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-200 bg-white/80 px-4 sm:px-6 lg:px-8 backdrop-blur-md">
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenSidebar}
          className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 lg:hidden focus:outline-none"
          aria-label="Open mobile navigation"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-2 text-slate-700">
          <ShieldCheck className="w-5 h-5 text-sky-600 hidden sm:block" />
          <span className="text-xs sm:text-sm font-semibold tracking-wide uppercase">
            AMS Control Platform
          </span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden sm:flex flex-col text-right">
          <span className="text-xs font-semibold text-slate-800">
            {user?.name || "Administrator"}
          </span>
          <span className="text-[10px] text-slate-500">
            {user?.email || "admin@company.com"}
          </span>
        </div>
        <div className="h-8 w-8 rounded-full bg-sky-100 border border-sky-300 flex items-center justify-center font-bold text-sky-700 text-xs">
          {user?.name ? user.name[0] : "A"}
        </div>
      </div>
    </header>
  );
};
