import React from "react";

export const Dropdown = ({ categories = [], value = "", onChange }) => {
  return (
    <div className="flex flex-1 flex-col gap-2">
      <label className="text-sm font-semibold">Category</label>

      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-10 rounded-lg border px-3 outline-none focus:border-green-600"
      >
        <option value="">Select Category</option>

        {categories.map((category) => (
          <option key={category.categoryId} value={category.categoryName}>
            {category.categoryName}
          </option>
        ))}
      </select>
    </div>
  );
};
