import React from "react";

export const StatCard = ({
  title,
  count = 0,
  icon: Icon,
  color = "text-sky-600",
  bg = "bg-sky-50",
}) => {
  return (
    <div className="relative overflow-hidden rounded-xl border border-slate-200 bg-white p-5 shadow-xs transition-hover hover:border-slate-300">
      <div className="flex items-center gap-4">
        <div className={`p-3 rounded-lg ${bg} ${color}`}>
          <Icon className="w-4 h-4" />
        </div>
        <div>
          <p className=" text-sm font-semibold text-slate-500 uppercase tracking-wider">
            {title}
          </p>
          <p className="text-1xl font-bold text-slate-900 mt-0.5">{count}</p>
        </div>
      </div>
    </div>
  );
};
