import React from "react";
import {
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  Info,
  X,
} from "lucide-react";

export const Alert = ({ type = "info", message, onClose, className = "" }) => {
  if (!message) return null;

  const types = {
    success: {
      bg: "bg-emerald-50 border-emerald-200 text-emerald-800",
      icon: CheckCircle2,
      iconColor: "text-emerald-500",
    },
    error: {
      bg: "bg-rose-50 border-rose-200 text-rose-800",
      icon: AlertCircle,
      iconColor: "text-rose-500",
    },
    warning: {
      bg: "bg-amber-50 border-amber-200 text-amber-800",
      icon: AlertTriangle,
      iconColor: "text-amber-500",
    },
    info: {
      bg: "bg-sky-50 border-sky-200 text-sky-800",
      icon: Info,
      iconColor: "text-sky-500",
    },
  };

  const current = types[type] || types.info;
  const Icon = current.icon;

  return (
    <div
      className={`flex items-center justify-between p-3.5 rounded-lg border text-sm ${current.bg} ${className}`}
    >
      <div className="flex items-center gap-2.5">
        <Icon className={`w-5 h-5 shrink-0 ${current.iconColor}`} />
        <span className="font-medium">{message}</span>
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className="p-1 text-slate-400 hover:text-slate-600"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};
