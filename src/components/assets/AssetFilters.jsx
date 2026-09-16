import React from "react";
import { SearchBar } from "../common/SearchBar";
import { Select } from "../common/Select";
import { ASSET_STATUS } from "../../utils/constants";
import { useCategories } from "../../hooks/useCategories";

export const AssetFilters = ({
  searchTerm,
  onSearchChange,
  categoryFilter,
  onCategoryChange,
  statusFilter,
  onStatusChange,
}) => {
  // Categories API se fetch hongi
  const {
    categories,
    loading: loadingCats,
    error: categoryError,
  } = useCategories();

  // -----------------------------
  // Status Options
  // -----------------------------
  const statusOptions = [
    {
      label: "All Statuses",
      value: "",
    },
    {
      label: ASSET_STATUS?.AVAILABLE || "AVAILABLE",
      value: ASSET_STATUS?.AVAILABLE || "AVAILABLE",
    },
    {
      label: ASSET_STATUS?.ASSIGNED || "ASSIGNED",
      value: ASSET_STATUS?.ASSIGNED || "ASSIGNED",
    },
    {
      label: ASSET_STATUS?.MAINTENANCE || "MAINTENANCE",
      value: ASSET_STATUS?.MAINTENANCE || "MAINTENANCE",
    },
  ];

  // -----------------------------
  // Category Options
  // API Response:
  //
  // {
  //   CategoryID: 10,
  //   CategoryName: "bike"
  // }
  //
  // UI me CategoryName dikhega
  // Backend ko CategoryID milegi
  // -----------------------------

  const categoryOptions = [
    {
      label: loadingCats ? "Loading categories..." : "All Categories",
      value: "",
    },

    ...(categories || []).map((category) => ({
      key: category.CategoryID,
      label: category.CategoryName,
      value: category.CategoryID,
    })),
  ];

  // Agar API error aaye
  if (categoryError) {
    console.error("Category API Error:", categoryError);
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-white p-4 rounded-xl border border-slate-200">
      {/* Search */}
      <SearchBar
        value={searchTerm}
        onChange={onSearchChange}
        placeholder="Search by name or asset tag..."
      />

      {/* Category Filter */}
      <Select
        placeholder="Filter by Category"
        options={categoryOptions}
        value={categoryFilter}
        onChange={(e) => {
          const categoryId = e.target.value;

          console.log("Selected Category ID:", categoryId);

          onCategoryChange(categoryId);
        }}
      />

      {/* Status Filter */}
      <Select
        placeholder="Filter by Status"
        options={statusOptions}
        value={statusFilter}
        onChange={(e) => {
          onStatusChange(e.target.value);
        }}
      />
    </div>
  );
};
