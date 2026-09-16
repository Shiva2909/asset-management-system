import React from "react";

export const Textarea = ({
  label,
  id,
  name,
  value,
  onChange,
  placeholder,
  rows = 3,
  error,
  disabled = false,
  className = "",
  required = false,
  ...props
}) => {
  const areaId = id || name;

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={areaId}
          className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5"
        >
          {label} {required && <span className="text-rose-500">*</span>}
        </label>
      )}
      <textarea
        id={areaId}
        name={name}
        rows={rows}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        className={`w-full rounded-lg border bg-white px-3 py-2 text-sm text-slate-900 placeholder-slate-400 shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 disabled:bg-slate-50 disabled:text-slate-400 ${
          error ? "border-rose-500 ring-1 ring-rose-500" : "border-slate-300"
        } ${className}`}
        {...props}
      />
      {error && (
        <p className="mt-1 text-xs text-rose-600 font-medium">{error}</p>
      )}
    </div>
  );
};
