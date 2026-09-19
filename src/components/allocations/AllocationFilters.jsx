import React from "react";

export const AllocationFilters = ({
  searchTerm,
  onSearchChange,
  assignedDateFilter,
  onAssignedDateChange,
  returnDateFilter,
  onReturnDateChange,
  onClear,
}) => {
  return (
    <div className="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {/* Search Asset Name / Employee Name */}

      {/* < className="flex flex-col gap-1">
        <h3 className="text-xs font-semibold text-slate-700">Searching...</h3> */}
      <input
        type="text"
        placeholder="Search Asset / Employee..."
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        className="w-full rounded-lg border border-slate-300
                   bg-white px-3 py-2 text-xs
                   focus:outline-none focus:ring-2
                   focus:ring-emerald-500"
      />

      {/* Assigned Date Filter */}
      {/* < className="flex flex-col gap-1">
        <h3 className="text-xs font-semibold text-slate-700">Assigned Date</h3> */}

      <input
        type="date"
        value={assignedDateFilter}
        onChange={(e) => onAssignedDateChange(e.target.value)}
        className="w-full rounded-lg border border-slate-300
               bg-white px-3 py-2 text-xs
               focus:outline-none focus:ring-2
               focus:ring-emerald-500"
      />

      {/* Return Date Filter
      <div className="flex flex-col gap-1">
        <h3 className="text-xs font-semibold text-slate-700">Return Date</h3>

        <input
          type="date"
          value={returnDateFilter}
          onChange={(e) => onReturnDateChange(e.target.value)}
          className="w-full rounded-lg border border-slate-300
               bg-white px-3 py-2 text-xs
               focus:outline-none focus:ring-2
               focus:ring-emerald-500"
        />
      </div> */}

      {/* Clear Filters */}
      <button
        type="button"
        onClick={onClear}
        className="rounded-lg bg-slate-100 px-3 py-2
                   text-xs font-medium text-slate-700
                   hover:bg-slate-200"
      >
        Clear Filters
      </button>
    </div>
  );
};
