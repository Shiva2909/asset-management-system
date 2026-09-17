import React from "react";

export const Dropdown = ({ categories = [], value = "", onChange }) => {
  return (
    <div className="flex w-full flex-col gap-1">
      <label className="text-xs font-medium text-slate-700">Category</label>

      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm outline-none focus:border-green-600"
      >
        <option value="">Select Category</option>

        {categories.map((category) => (
          <option key={category.categoryId} value={category.categoryId}>
            {category.categoryName}
          </option>
        ))}
      </select>
    </div>
  );
};
