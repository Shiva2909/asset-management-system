import React from "react";
import { PackageOpen } from "lucide-react";

export const EmptyState = ({
  icon: Icon = PackageOpen,
  title = "No records found",
  description = "There are no active records in this view.",
  action,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <div className="p-3 bg-slate-100 rounded-full text-slate-400 mb-3">
        <Icon className="w-8 h-8" />
      </div>
      <h4 className="text-sm font-semibold text-slate-800">{title}</h4>
      <p className="text-xs text-slate-500 max-w-sm mt-1 mb-4">{description}</p>
      {action && <div>{action}</div>}
    </div>
  );
};
