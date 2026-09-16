import React, { useEffect, useMemo, useState } from "react";
import { Pencil, Trash2, Save, X } from "lucide-react";

import { Dropdown } from "../../components/common/Dropdown";
import { SearchBar } from "../../components/common/SearchBar";
import { Button } from "../../components/common/Button";

import { getCategories } from "../../services/categoryService";

export default function SubCategory() {
  const [categories, setCategories] = useState([]);
  const [rows, setRows] = useState([]);

  const [formName, setFormName] = useState("");
  const [formCategory, setFormCategory] = useState("");

  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");

  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState("");
  const [editCategory, setEditCategory] = useState("");

  const [formError, setFormError] = useState("");
  const [toast, setToast] = useState("");

  // =========================
  // LOAD CATEGORIES
  // =========================

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const response = await getCategories();

      console.log("Categories:", response);

      setCategories(response.data || response);
    } catch (error) {
      console.error("Category API error:", error);
      showToast("Categories load nahi ho payi.");
    }
  };

  // =========================
  // ADD SUB CATEGORY
  // =========================

  const handleSubmit = (e) => {
    e.preventDefault();

    setFormError("");

    if (!formName.trim()) {
      setFormError("Sub category ka naam likhein.");
      return;
    }

    if (!formCategory) {
      setFormError("Category select karein.");
      return;
    }

    const newRow = {
      id: `SC${String(rows.length + 1).padStart(3, "0")}`,
      name: formName.trim(),
      category: formCategory,
    };

    setRows((prev) => [newRow, ...prev]);

    setFormName("");
    setFormCategory("");

    showToast("Sub category add ho gayi.");
  };

  // =========================
  // EDIT
  // =========================

  const startEdit = (row) => {
    setEditingId(row.id);
    setEditName(row.name);
    setEditCategory(row.category);
  };

  const saveEdit = (id) => {
    if (!editName.trim() || !editCategory) {
      return;
    }

    setRows((prev) =>
      prev.map((row) =>
        row.id === id
          ? {
              ...row,
              name: editName.trim(),
              category: editCategory,
            }
          : row,
      ),
    );

    setEditingId(null);
    setEditName("");
    setEditCategory("");

    showToast("Sub category update ho gayi.");
  };

  // =========================
  // DELETE
  // =========================

  const deleteRow = (id) => {
    setRows((prev) => prev.filter((row) => row.id !== id));

    showToast("Sub category delete ho gayi.");
  };

  // =========================
  // TOAST
  // =========================

  const showToast = (message) => {
    setToast(message);

    setTimeout(() => {
      setToast("");
    }, 2200);
  };

  // =========================
  // SEARCH + FILTER
  // =========================

  const filteredRows = useMemo(() => {
    return rows.filter((row) => {
      const searchMatch = row.name.toLowerCase().includes(search.toLowerCase());

      const categoryMatch =
        filterCategory === "All" || row.category === filterCategory;

      return searchMatch && categoryMatch;
    });
  }, [rows, search, filterCategory]);

  // =========================
  // UI
  // =========================

  return (
    <div className="min-h-screen bg-white px-5 py-10">
      <div className="mx-auto w-full max-w-[880px]">
        {/* PAGE TITLE */}

        <h1 className="mb-6 text-3xl font-semibold">Sub Category</h1>

        {/* ADD SUB CATEGORY */}

        <section className="mb-5 rounded-xl border bg-white p-6">
          <h2 className="mb-4 text-lg font-semibold">Add Sub Category</h2>

          <form onSubmit={handleSubmit}>
            <div className="flex flex-wrap items-end gap-4">
              {/* SUB CATEGORY NAME */}

              <div className="flex flex-1 flex-col gap-2">
                <label className="text-sm font-semibold">
                  Sub Category Name
                </label>

                <input
                  type="text"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="Mobile Phones"
                  className="h-10 rounded-lg border px-3 outline-none focus:border-green-600"
                />
              </div>

              {/* CATEGORY DROPDOWN */}

              <Dropdown
                categories={categories}
                value={formCategory}
                onChange={setFormCategory}
              />

              {/* COMMON BUTTON */}

              <Button title="Add" />
            </div>

            {formError && (
              <p className="mt-2 text-xs text-red-600">{formError}</p>
            )}
          </form>
        </section>

        {/* SEARCH + FILTER */}

        <section className="mb-4 flex gap-3">
          <SearchBar
            value={search}
            onChange={setSearch}
            placeholder="Search sub category..."
          />

          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="h-10 rounded-lg border bg-white px-3"
          >
            <option value="All">All Categories</option>

            {categories.map((category) => (
              <option key={category.categoryId} value={category.categoryName}>
                {category.categoryName}
              </option>
            ))}
          </select>
        </section>

        {/* TABLE */}

        <section className="overflow-hidden rounded-xl border bg-white">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-gray-50">
                  <th className="px-4 py-3 text-left text-sm">ID</th>

                  <th className="px-4 py-3 text-left text-sm">Sub Category</th>

                  <th className="px-4 py-3 text-left text-sm">Category</th>

                  <th className="px-4 py-3 text-right text-sm">Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredRows.map((row) => (
                  <tr key={row.id} className="border-b hover:bg-gray-50">
                    {/* ID */}

                    <td className="px-4 py-3 text-sm">{row.id}</td>

                    {/* SUB CATEGORY */}

                    <td className="px-4 py-3">
                      {editingId === row.id ? (
                        <input
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          className="rounded border px-2 py-1"
                        />
                      ) : (
                        row.name
                      )}
                    </td>

                    {/* CATEGORY */}

                    <td className="px-4 py-3">
                      {editingId === row.id ? (
                        <Dropdown
                          categories={categories}
                          value={editCategory}
                          onChange={setEditCategory}
                        />
                      ) : (
                        <span className="rounded-full bg-purple-100 px-3 py-1 text-xs font-semibold text-purple-700">
                          {row.category}
                        </span>
                      )}
                    </td>

                    {/* ACTIONS */}

                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-2">
                        {editingId === row.id ? (
                          <>
                            <button
                              type="button"
                              onClick={() => saveEdit(row.id)}
                              className="rounded bg-green-600 p-2 text-white"
                            >
                              <Save size={15} />
                            </button>

                            <button
                              type="button"
                              onClick={() => {
                                setEditingId(null);
                                setEditName("");
                                setEditCategory("");
                              }}
                              className="rounded border p-2"
                            >
                              <X size={15} />
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              type="button"
                              onClick={() => startEdit(row)}
                              className="rounded border p-2 hover:bg-gray-100"
                            >
                              <Pencil size={15} />
                            </button>

                            <button
                              type="button"
                              onClick={() => deleteRow(row.id)}
                              className="rounded bg-red-50 p-2 text-red-600"
                            >
                              <Trash2 size={15} />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}

                {filteredRows.length === 0 && (
                  <tr>
                    <td
                      colSpan="4"
                      className="px-4 py-8 text-center text-sm text-gray-500"
                    >
                      No sub category found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>

      {/* TOAST */}

      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 rounded-lg bg-gray-900 px-5 py-3 text-sm text-white shadow-lg">
          {toast}
        </div>
      )}
    </div>
  );
}
