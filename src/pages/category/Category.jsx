import { useEffect, useState } from "react";
import { Plus, Loader2 } from "lucide-react";

import { getCategories, addCategory } from "../../services/categoryService";

function Category() {
  const [categoryName, setCategoryName] = useState("");
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Get all categories
  const loadCategories = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getCategories();
      console.log("API RESPONSE DATA:", response);

      // Extract array safely from response.data or response
      if (response && Array.isArray(response.data)) {
        setCategories(response.data);
      } else if (Array.isArray(response)) {
        setCategories(response);
      } else {
        setCategories([]);
      }
    } catch (error) {
      console.error("Get Categories Error:", error);
      setError(error.response?.data?.message || "Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  // Add category
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!categoryName.trim()) {
      setError("Category name is required");
      return;
    }

    try {
      setLoading(true);
      setError("");

      await addCategory(categoryName.trim());
      setCategoryName("");

      // Reload category list
      await loadCategories();
    } catch (error) {
      console.error("Add Category Error:", error);
      setError(error.response?.data?.message || "Failed to add category");
    } finally {
      setLoading(false);
    }
  };

  // Load categories when page opens
  useEffect(() => {
    loadCategories();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      {/* Page Title */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Category</h1>
        <p className="mt-1 text-sm text-slate-500">
          Add and manage asset categories
        </p>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* Add Category */}
      <div className="mb-6 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold text-slate-800">
          Add Category
        </h2>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-3 sm:flex-row"
        >
          <input
            type="text"
            value={categoryName}
            onChange={(e) => {
              setCategoryName(e.target.value);
              setError("");
            }}
            placeholder="Enter category name"
            disabled={loading}
            className="flex-1 rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100 disabled:bg-slate-100"
          />

          <button
            type="submit"
            disabled={loading}
            className="flex items-center justify-center gap-2 rounded-lg bg-sky-600 px-6 py-3 text-sm font-semibold text-white hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Adding...
              </>
            ) : (
              <>
                <Plus className="h-4 w-4" />
                Add Category
              </>
            )}
          </button>
        </form>
      </div>

      {/* Category List */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <h2 className="text-lg font-semibold text-slate-800">
            Category List
          </h2>

          <span className="text-sm text-slate-500">
            Total: {categories?.length || 0}
          </span>
        </div>

        {/* Loading */}
        {loading && categories?.length === 0 && (
          <div className="px-5 py-8 text-center text-sm text-slate-500">
            Loading categories...
          </div>
        )}

        {/* Empty */}
        {!loading && categories?.length === 0 && (
          <div className="px-5 py-8 text-center text-sm text-slate-500">
            No categories found
          </div>
        )}

        {/* Table */}
        {categories?.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  <th className="px-5 py-3 text-xs font-semibold uppercase text-slate-500">
                    Category ID
                  </th>

                  <th className="px-5 py-3 text-xs font-semibold uppercase text-slate-500">
                    Category Name
                  </th>
                </tr>
              </thead>

              <tbody>
                {categories.map((category, index) => (
                  <tr
                    key={category.CategoryID || index}
                    className="border-b border-slate-100 last:border-0 hover:bg-slate-50"
                  >
                    {/* Exact Backend Keys Used Here */}
                    <td className="px-5 py-4 text-sm font-medium text-slate-700">
                      {category.CategoryID}
                    </td>

                    <td className="px-5 py-4 text-sm text-slate-800">
                      {category.CategoryName}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default Category;
