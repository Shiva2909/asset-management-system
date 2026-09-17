import React, { useEffect, useMemo, useState } from "react";
import { useMaintenance } from "../../hooks/useMaintenance";

import {
  Plus,
  Search,
  Pencil,
  Trash2,
  FileText,
  Wrench,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const initialForm = {
  assetId: "",
  maintenanceDate: "",
  cost: "",
  description: "",
  receiptFile: null,
};
export const AddMaintenance = () => {
  const {
    assets,
    records,
    loading,
    saving,
    error: hookError,
    success: hookSuccess,
    addMaintenance: saveMaintenance,
    fetchMaintenance,
    clearMessages,
  } = useMaintenance();

  const [formData, setFormData] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Local messages are used for form validation and dismissing messages.
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (hookError) setError(hookError);
  }, [hookError]);

  useEffect(() => {
    if (hookSuccess) setSuccess(hookSuccess);
  }, [hookSuccess]);

  const getAssetName = (record) =>
    record.assetName ||
    record.asset?.assetName ||
    assets.find((asset) => String(asset.assetId) === String(record.assetId))
      ?.assetName ||
    "—";

  const getAssetTag = (record) =>
    record.assetTag ||
    record.asset?.assetTag ||
    assets.find((asset) => String(asset.assetId) === String(record.assetId))
      ?.assetTag ||
    "—";

  const filteredRecords = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return records;

    return records.filter((record) => {
      const name = getAssetName(record).toLowerCase();
      const tag = getAssetTag(record).toLowerCase();

      return name.includes(query) || tag.includes(query);
    });
  }, [records, search, assets]);

  const totalPages = Math.max(1, Math.ceil(filteredRecords.length / pageSize));

  const paginatedRecords = filteredRecords.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: files ? files[0] || null : value,
    }));
  };

  // POST: create maintenance record
  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");
    clearMessages();

    if (!formData.assetId) {
      setError("Please select an asset.");
      return;
    }

    const cost = Number(formData.cost);

    if (formData.cost === "" || !Number.isFinite(cost) || cost < 0) {
      setError("Please enter a valid cost.");
      return;
    }

    const payload = {
      assetId: Number(formData.assetId),
      maintenanceDate: formData.maintenanceDate,
      cost,
      description: formData.description.trim(),
    };

    try {
      const saved = await saveMaintenance(payload);

      if (!saved) {
        return;
      }

      // Hook refreshes maintenance records after successful POST.

      setFormData(initialForm);
      setEditingId(null);
      setCurrentPage(1);
      setSuccess("Maintenance record added successfully.");

      const fileInput = document.getElementById("receiptFile");
      if (fileInput) fileInput.value = "";
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Maintenance save nahi ho saka.");
    } finally {
    }
  };

  // UI-only Edit: loads selected record into the form.
  // It does not call PUT/PATCH.
  const handleEdit = (record) => {
    setEditingId(record.maintenanceId ?? record.id);

    setFormData({
      assetId: String(record.assetId ?? record.asset?.assetId ?? ""),
      maintenanceDate: record.maintenanceDate
        ? String(record.maintenanceDate).slice(0, 10)
        : "",
      cost: String(record.cost ?? ""),
      description: record.description || "",
      receiptFile: null,
    });

    setError("");
    setSuccess("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // UI-only Delete: removes the row from local state.
  // It does not call DELETE.
  const handleDelete = (record) => {
    const id = record.maintenanceId ?? record.id;

    if (!window.confirm("Remove this record from the current view?")) {
      return;
    }

    // This removes the item from the current display only when the hook exposes
    // a records setter; the current hook does not expose one.
    fetchMaintenance();
  };

  const resetForm = () => {
    setFormData(initialForm);
    setEditingId(null);
    setError("");
    setSuccess("");
    clearMessages();

    const fileInput = document.getElementById("receiptFile");
    if (fileInput) fileInput.value = "";
  };

  const formatDate = (date) => {
    if (!date) return "—";

    const parsed = new Date(date);

    return Number.isNaN(parsed.getTime())
      ? date
      : parsed.toLocaleDateString("en-IN");
  };

  const getReceiptName = (record) => {
    const path =
      record.receiptFilePath || record.receipt || record.receiptUrl || "";

    return path ? path.split(/[\\/]/).pop() : "";
  };

  return (
    <div className="min-h-screen bg-slate-50 p-3 sm:p-5">
      <div className="mx-auto max-w-[1400px] space-y-5">
        {/* Header */}
        <div>
          <div className="flex items-center gap-2">
            <div className="rounded-xl bg-blue-100 p-2 text-blue-700">
              <Wrench size={21} />
            </div>

            <h1 className="text-xl font-bold text-slate-800 sm:text-2xl">
              Maintenance Tracker
            </h1>
          </div>
        </div>

        {/* Messages */}
        {error && (
          <div className="flex items-start justify-between gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            <span>{error}</span>
            <button
              type="button"
              onClick={() => setError("")}
              aria-label="Close error"
            >
              <X size={17} />
            </button>
          </div>
        )}

        {success && (
          <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
            {success}
          </div>
        )}

        <div className="grid grid-cols-1 items-start gap-5 xl:grid-cols-[360px_minmax(0,1fr)]">
          {/* Maintenance Form */}
          <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
            <div className="mb-4 flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="flex items-center gap-2 font-semibold text-slate-800">
                <Plus size={18} className="text-blue-600" />
                {editingId ? "Edit Maintenance" : "Add Maintenance"}
              </h2>

              {editingId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="text-xs font-medium text-slate-500 hover:text-slate-800"
                >
                  Cancel edit
                </button>
              )}
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Asset */}
              <div>
                <label
                  htmlFor="assetId"
                  className="mb-1.5 block text-sm font-medium text-slate-700"
                >
                  Asset *
                </label>

                <select
                  id="assetId"
                  name="assetId"
                  value={formData.assetId}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                >
                  <option value="">Select asset</option>

                  {assets.map((asset) => (
                    <option key={asset.assetID} value={asset.assetID}>
                      {asset.assetName}{" "}
                      {asset.assetTag ? `(${asset.assetTag})` : ""}
                    </option>
                  ))}
                </select>
              </div>

              {/* Date */}
              <div>
                <label
                  htmlFor="maintenanceDate"
                  className="mb-1.5 block text-sm font-medium text-slate-700"
                >
                  Maintenance Date *
                </label>

                <input
                  id="maintenanceDate"
                  name="maintenanceDate"
                  type="date"
                  value={formData.maintenanceDate}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              {/* Cost */}
              <div>
                <label
                  htmlFor="cost"
                  className="mb-1.5 block text-sm font-medium text-slate-700"
                >
                  Cost (₹) *
                </label>

                <input
                  id="cost"
                  name="cost"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.cost}
                  onChange={handleChange}
                  placeholder="Enter maintenance cost"
                  required
                  className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              {/* Description */}
              <div>
                <label
                  htmlFor="description"
                  className="mb-1.5 block text-sm font-medium text-slate-700"
                >
                  Description
                </label>

                <textarea
                  id="description"
                  name="description"
                  rows={3}
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Enter maintenance details"
                  className="w-full resize-y rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              {/* Receipt */}
              <div>
                <label
                  htmlFor="receiptFile"
                  className="mb-1.5 block text-sm font-medium text-slate-700"
                >
                  Receipt File
                </label>

                <input
                  id="receiptFile"
                  name="receiptFile"
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={handleChange}
                  className="block w-full rounded-lg border border-dashed border-slate-300 p-2 text-xs text-slate-600 file:mr-3 file:rounded-md file:border-0 file:bg-blue-50 file:px-3 file:py-1.5 file:text-xs file:font-medium file:text-blue-700"
                />

                <p className="mt-1 text-xs text-slate-400">PDF, JPG, PNG</p>
              </div>

              <button
                type="submit"
                disabled={saving}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Plus size={17} />
                {saving
                  ? "Saving..."
                  : editingId
                    ? "Save Maintenance"
                    : "Add Maintenance"}
              </button>
            </form>
          </section>

          {/* Records Table */}
          <section className="min-w-0 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 p-4">
              <div>
                <h2 className="font-semibold text-slate-800">
                  Maintenance Records
                </h2>
                <p className="mt-1 text-xs text-slate-500">
                  {filteredRecords.length} records found
                </p>
              </div>

              <div className="relative w-full sm:w-72">
                <Search
                  size={17}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type="text"
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setCurrentPage(1);
                  }}
                  placeholder="Search asset name or tag..."
                  className="w-full rounded-lg border border-slate-300 py-2 pl-9 pr-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>
            </div>

            {loading ? (
              <div className="p-10 text-center text-sm text-slate-500">
                Loading maintenance records...
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[900px] text-left text-sm">
                    <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                      <tr>
                        <th className="px-4 py-3">S.No</th>
                        <th className="px-4 py-3">Asset Tag</th>
                        <th className="px-4 py-3">Asset Name</th>
                        <th className="px-4 py-3">Date</th>
                        <th className="px-4 py-3">Cost</th>
                        <th className="px-4 py-3">Description</th>
                        <th className="px-4 py-3">Receipt</th>
                        <th className="px-4 py-3">Action</th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-slate-100">
                      {paginatedRecords.length === 0 ? (
                        <tr>
                          <td
                            colSpan={8}
                            className="px-4 py-10 text-center text-sm text-slate-500"
                          >
                            No maintenance records found.
                          </td>
                        </tr>
                      ) : (
                        paginatedRecords.map((record, index) => {
                          const receiptName = getReceiptName(record);

                          return (
                            <tr
                              key={record.maintenanceId ?? record.id ?? index}
                              className="hover:bg-slate-50"
                            >
                              <td className="whitespace-nowrap px-4 py-3 text-slate-500">
                                {(currentPage - 1) * pageSize + index + 1}
                              </td>

                              <td className="whitespace-nowrap px-4 py-3 font-medium text-blue-700">
                                {getAssetTag(record)}
                              </td>

                              <td className="px-4 py-3 font-medium text-slate-700">
                                {getAssetName(record)}
                              </td>

                              <td className="whitespace-nowrap px-4 py-3 text-slate-600">
                                {formatDate(record.maintenanceDate)}
                              </td>

                              <td className="whitespace-nowrap px-4 py-3 font-medium text-slate-700">
                                ₹
                                {Number(record.cost || 0).toLocaleString(
                                  "en-IN",
                                )}
                              </td>

                              <td
                                className="max-w-[180px] truncate px-4 py-3 text-slate-600"
                                title={record.description || ""}
                              >
                                {record.description || "—"}
                              </td>

                              <td className="px-4 py-3">
                                {receiptName ? (
                                  <span
                                    className="inline-flex max-w-[150px] items-center gap-1 truncate text-xs text-blue-700"
                                    title={receiptName}
                                  >
                                    <FileText size={15} />
                                    {receiptName}
                                  </span>
                                ) : (
                                  <span className="text-slate-400">—</span>
                                )}
                              </td>

                              <td className="px-4 py-3">
                                <div className="flex items-center gap-2">
                                  <button
                                    type="button"
                                    onClick={() => handleEdit(record)}
                                    title="Edit"
                                    className="rounded-md border border-blue-200 p-2 text-blue-700 hover:bg-blue-50"
                                  >
                                    <Pencil size={15} />
                                  </button>

                                  <button
                                    type="button"
                                    onClick={() => handleDelete(record)}
                                    title="Delete from current view"
                                    className="rounded-md border border-red-200 p-2 text-red-600 hover:bg-red-50"
                                  >
                                    <Trash2 size={15} />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 px-4 py-3">
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <span>Rows:</span>

                    <select
                      value={pageSize}
                      onChange={(e) => {
                        setPageSize(Number(e.target.value));
                        setCurrentPage(1);
                      }}
                      className="rounded-md border border-slate-300 bg-white px-2 py-1.5 text-xs"
                    >
                      {[5, 10, 20, 50].map((size) => (
                        <option key={size} value={size}>
                          {size}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      disabled={currentPage === 1}
                      onClick={() =>
                        setCurrentPage((page) => Math.max(1, page - 1))
                      }
                      className="rounded-md border border-slate-200 p-2 text-slate-600 hover:bg-slate-50 disabled:opacity-40"
                    >
                      <ChevronLeft size={16} />
                    </button>

                    <span className="text-xs text-slate-600">
                      Page {currentPage} of {totalPages}
                    </span>

                    <button
                      type="button"
                      disabled={currentPage >= totalPages}
                      onClick={() =>
                        setCurrentPage((page) => Math.min(totalPages, page + 1))
                      }
                      className="rounded-md border border-slate-200 p-2 text-slate-600 hover:bg-slate-50 disabled:opacity-40"
                    >
                      <ChevronRight size={16} />
                    </button>
                  </div>
                </div>
              </>
            )}
          </section>
        </div>
      </div>
    </div>
  );
};

export default AddMaintenance;
