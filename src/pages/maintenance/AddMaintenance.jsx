import React, { useEffect, useMemo, useState, useRef } from "react";
import { useMaintenance } from "../../hooks/useMaintenance";
import {
  Plus, Search, Pencil, Trash2, FileText, Wrench, X, ChevronLeft, ChevronRight, Activity, Wrench as WrenchIcon, IndianRupee, ChevronDown
} from "lucide-react";

const initialForm = {
  assetId: "",
  maintenanceDate: new Date().toISOString().split("T")[0], 
  cost: "",
  description: "",
  receiptFile: null,
};

// 🚨 Searchable Dropdown (Fix: Z-index aur clipping issue theek kiya)
const SearchableAssetSelect = ({ assets, value, onChange, placeholder, required }) => {
  const [search, setSearch] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
        setSearch("");
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedAsset = assets.find(a => String(a.AssetID || a.assetID || a.assetId || a.id) === String(value));
  const displayValue = selectedAsset
    ? `${selectedAsset.AssetName || selectedAsset.assetName || "Unknown"} ${selectedAsset.AssetTag || selectedAsset.assetTag ? `(${selectedAsset.AssetTag || selectedAsset.assetTag})` : ""}`
    : "";

  const filtered = assets.filter(a => {
    const n = (a.AssetName || a.assetName || "").toLowerCase();
    const t = (a.AssetTag || a.assetTag || "").toLowerCase();
    const s = search.toLowerCase();
    return n.includes(s) || t.includes(s);
  });

  return (
    <div className="relative" ref={dropdownRef}>
      <div
        className="w-full flex items-center justify-between rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100 cursor-text"
        onClick={() => setIsOpen(true)}
      >
        <input
          type="text"
          className="w-full outline-none bg-transparent"
          placeholder={displayValue || placeholder || "Search asset name or tag..."}
          value={isOpen ? search : displayValue}
          onChange={(e) => {
            setSearch(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          required={required && !value}
        />
        <ChevronDown size={16} className="text-slate-400 shrink-0 ml-2" />
      </div>

      {isOpen && (
        <div className="absolute z-[999] mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 border border-slate-200">
          {filtered.length === 0 ? (
            <div className="px-3 py-2 text-sm text-slate-500">No assets found</div>
          ) : (
            filtered.map((asset, i) => {
              const astId = asset.AssetID || asset.assetID || asset.assetId || asset.id;
              const astName = asset.AssetName || asset.assetName || `Asset ${i + 1}`;
              const astTag = asset.AssetTag || asset.assetTag || "";
              return (
                <div
                  key={astId}
                  className={`cursor-pointer px-3 py-2 text-sm hover:bg-blue-50 hover:text-blue-700 ${String(astId) === String(value) ? "bg-blue-50 text-blue-700 font-medium" : "text-slate-700"}`}
                  onClick={() => {
                    onChange(astId);
                    setSearch("");
                    setIsOpen(false);
                  }}
                >
                  {astName} {astTag ? `(${astTag})` : ""}
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
};

export const AddMaintenance = () => {
  const { 
    assets, 
    records, 
    assetStats, 
    loading, 
    saving, 
    error: hookError, 
    success: hookSuccess, 
    addMaintenance: saveMaintenance, 
    fetchMaintenance, 
    clearMessages 
  } = useMaintenance();

  const [formData, setFormData] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  
  const [insightAssetId, setInsightAssetId] = useState("");
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => { if (hookError) setError(hookError); }, [hookError]);
  useEffect(() => { if (hookSuccess) setSuccess(hookSuccess); }, [hookSuccess]);

  const getAssetName = (record) => {
    const recordId = String(record.AssetID || record.assetId || record.assetID || "");
    const assetMatch = assets.find((a) => String(a.AssetID || a.assetId || a.assetID || a.id) === recordId);
    return record.AssetName || record.assetName || assetMatch?.AssetName || assetMatch?.assetName || "—";
  };

  const getAssetTag = (record) => {
    const recordId = String(record.AssetID || record.assetId || record.assetID || "");
    const assetMatch = assets.find((a) => String(a.AssetID || a.assetId || a.assetID || a.id) === recordId);
    return record.AssetTag || record.assetTag || assetMatch?.AssetTag || assetMatch?.assetTag || "—";
  };

  const filteredRecords = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return records;
    return records.filter((record) => 
      getAssetName(record).toLowerCase().includes(query) || 
      getAssetTag(record).toLowerCase().includes(query)
    );
  }, [records, search, assets]);

  const totalPages = Math.max(1, Math.ceil(filteredRecords.length / pageSize));
  const paginatedRecords = filteredRecords.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((previous) => ({
      ...previous,
      [name]: files ? files[0] || null : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); setSuccess(""); clearMessages();

    if (!formData.assetId) { setError("Please select an asset."); return; }
    if (!formData.cost || Number(formData.cost) < 0) { setError("Please enter a valid cost."); return; }

    const payload = {
      assetId: formData.assetId,
      maintenanceDate: formData.maintenanceDate,
      cost: formData.cost,
      description: formData.description.trim(),
      receiptFile: formData.receiptFile, 
    };

    try {
      const saved = await saveMaintenance(payload);
      if (saved) {
        setFormData(initialForm);
        setEditingId(null);
        setCurrentPage(1);
        const fileInput = document.getElementById("receiptFile");
        if (fileInput) fileInput.value = "";
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (record) => {
    setEditingId(record.MaintenanceID ?? record.id);
    setFormData({
      assetId: String(record.AssetID ?? record.assetId ?? record.assetID ?? ""),
      maintenanceDate: record.MaintenanceDate ? String(record.MaintenanceDate).slice(0, 10) : "",
      cost: String(record.Cost ?? record.cost ?? ""),
      description: record.Description ?? record.description ?? "",
      receiptFile: null,
    });
    setError(""); setSuccess(""); window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = (record) => {
    if (window.confirm("Remove this record from the current view?")) fetchMaintenance();
  };

  const resetForm = () => {
    setFormData(initialForm); setEditingId(null); setError(""); setSuccess(""); clearMessages();
    const fileInput = document.getElementById("receiptFile");
    if (fileInput) fileInput.value = "";
  };

  const formatDate = (date) => {
    if (!date) return "—";
    const parsed = new Date(date);
    return Number.isNaN(parsed.getTime()) ? date : parsed.toLocaleDateString("en-IN");
  };

  const getReceiptName = (record) => {
    const path = record.ReceiptFilePath || record.receiptFilePath || "";
    return path ? path.split(/[\\/]/).pop() : "";
  };

  const selectedInsight = insightAssetId ? assetStats[insightAssetId] : null;

  return (
    <div className="min-h-screen bg-slate-50 p-3 sm:p-5">
      <div className="mx-auto max-w-[1400px] space-y-5">
        <div>
          <div className="flex items-center gap-2">
            <div className="rounded-xl bg-blue-100 p-2 text-blue-700"><Wrench size={21} /></div>
            <h1 className="text-xl font-bold text-slate-800 sm:text-2xl">Maintenance Tracker</h1>
          </div>
        </div>

        {error && (
          <div className="flex items-start justify-between gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            <span>{error}</span>
            <button type="button" onClick={() => setError("")} aria-label="Close error"><X size={17} /></button>
          </div>
        )}
        {success && <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">{success}</div>}

        <div className="grid grid-cols-1 items-start gap-5 xl:grid-cols-[360px_minmax(0,1fr)]">
          
          {/* Form Section (relative z-20 taaki iska dropdown sabse upar rahe) */}
          <section className="relative z-20 rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
            <div className="mb-4 flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="flex items-center gap-2 font-semibold text-slate-800">
                <Plus size={18} className="text-blue-600" />
                {editingId ? "Edit Maintenance" : "Add Maintenance"}
              </h2>
              {editingId && <button type="button" onClick={resetForm} className="text-xs font-medium text-slate-500 hover:text-slate-800">Cancel edit</button>}
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">Asset *</label>
                <SearchableAssetSelect 
                  assets={assets}
                  value={formData.assetId}
                  onChange={(val) => setFormData(prev => ({ ...prev, assetId: val }))}
                  placeholder="Select or search asset..."
                  required={true}
                />
              </div>

              <div>
                <label htmlFor="maintenanceDate" className="mb-1.5 block text-sm font-medium text-slate-700">Date *</label>
                <input id="maintenanceDate" name="maintenanceDate" type="date" value={formData.maintenanceDate} onChange={handleChange} required className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100" />
              </div>

              <div>
                <label htmlFor="cost" className="mb-1.5 block text-sm font-medium text-slate-700">Cost (₹) *</label>
                <input id="cost" name="cost" type="number" min="0" step="1" value={formData.cost} onChange={handleChange} placeholder="Enter maintenance cost" required className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100" />
              </div>

              <div>
                <label htmlFor="description" className="mb-1.5 block text-sm font-medium text-slate-700">Description</label>
                <textarea id="description" name="description" rows={3} value={formData.description} onChange={handleChange} placeholder="Details..." className="w-full resize-y rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100" />
              </div>

              <div>
                <label htmlFor="receiptFile" className="mb-1.5 block text-sm font-medium text-slate-700">Receipt File</label>
                <input id="receiptFile" name="receiptFile" type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={handleChange} className="block w-full rounded-lg border border-dashed border-slate-300 p-2 text-xs text-slate-600 file:mr-3 file:rounded-md file:border-0 file:bg-blue-50 file:px-3 file:py-1.5 file:text-xs file:font-medium file:text-blue-700" />
              </div>

              <button type="submit" disabled={saving} className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60">
                <Plus size={17} />
                {saving ? "Saving..." : editingId ? "Save Maintenance" : "Add Maintenance"}
              </button>
            </form>
          </section>

          <div className="flex flex-col gap-5 min-w-0">
            
            {/* Insights Section (Fix: overflow-hidden hata diya aur z-10 laga diya) */}
            <section className="relative z-10 rounded-xl border border-slate-200 bg-white shadow-sm">
              <div className="border-b border-slate-100 bg-slate-50/50 p-4 rounded-t-xl">
                <h2 className="flex items-center gap-2 font-semibold text-slate-800">
                  <Activity size={18} className="text-indigo-600" />
                  Asset Health Insights
                </h2>
              </div>
              <div className="p-4 flex flex-col sm:flex-row sm:items-start justify-between gap-6">
                
                <div className="w-full sm:max-w-[280px]">
                  <label className="mb-2 block text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Select Asset to Check Stats
                  </label>
                  <SearchableAssetSelect 
                    assets={assets}
                    value={insightAssetId}
                    onChange={(val) => setInsightAssetId(val)}
                    placeholder="Search asset name or tag..."
                  />
                </div>

                {/* 🚨 DONO CARDS WAPAS: Total Repairs & Total Maintenance */}
                {selectedInsight && selectedInsight.totalRepairs > 0 ? (
                  <div className="flex flex-wrap gap-4 flex-1">
                    <div className="flex-1 flex flex-col items-center justify-center rounded-xl bg-orange-50 border border-orange-100 p-4 text-center shadow-sm">
                      <WrenchIcon size={20} className="mb-1 text-orange-600" />
                      <p className="text-xs font-semibold text-orange-600 uppercase">Total Repairs</p>
                      <p className="mt-1 text-2xl font-bold text-orange-900">{selectedInsight.totalRepairs}</p>
                    </div>
                    <div className="flex-1 flex flex-col items-center justify-center rounded-xl bg-emerald-50 border border-emerald-100 p-4 text-center shadow-sm">
                      <IndianRupee size={20} className="mb-1 text-emerald-600" />
                      <p className="text-xs font-semibold text-emerald-600 uppercase">Total Maintenance</p>
                      <p className="mt-1 text-2xl font-bold text-emerald-900">₹{Number(selectedInsight.totalCost).toLocaleString("en-IN")}</p>
                    </div>
                  </div>
                ) : insightAssetId ? (
                  <div className="flex-1 flex items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50 p-4 text-sm text-slate-500">
                    No maintenance records found for this asset.
                  </div>
                ) : (
                  <div className="flex-1 flex items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50 p-4 text-sm text-slate-500">
                    Search & select an asset to view its maintenance metrics.
                  </div>
                )}
              </div>
            </section>

            {/* Table Section */}
            <section className="min-w-0 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 p-4">
                <div>
                  <h2 className="font-semibold text-slate-800">Maintenance Records</h2>
                  <p className="mt-1 text-xs text-slate-500">{filteredRecords.length} records found</p>
                </div>
                <div className="relative w-full sm:w-72">
                  <Search size={17} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input type="text" value={search} onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }} placeholder="Search asset name or tag..." className="w-full rounded-lg border border-slate-300 py-2 pl-9 pr-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100" />
                </div>
              </div>

              {loading ? (
                <div className="p-10 text-center text-sm text-slate-500">Loading maintenance records...</div>
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
                          <tr><td colSpan={8} className="px-4 py-10 text-center text-sm text-slate-500">No maintenance records found.</td></tr>
                        ) : (
                          paginatedRecords.map((record, index) => {
                            const receiptName = getReceiptName(record);
                            return (
                              <tr key={record.MaintenanceID ?? index} className="hover:bg-slate-50">
                                <td className="whitespace-nowrap px-4 py-3 text-slate-500">{(currentPage - 1) * pageSize + index + 1}</td>
                                <td className="whitespace-nowrap px-4 py-3 font-medium text-blue-700">{getAssetTag(record)}</td>
                                <td className="px-4 py-3 font-medium text-slate-700">{getAssetName(record)}</td>
                                <td className="whitespace-nowrap px-4 py-3 text-slate-600">{formatDate(record.MaintenanceDate || record.maintenanceDate)}</td>
                                <td className="whitespace-nowrap px-4 py-3 font-medium text-slate-700">
                                  ₹{Number(record.Cost || record.cost || 0).toLocaleString("en-IN")}
                                </td>
                                <td className="max-w-[180px] truncate px-4 py-3 text-slate-600" title={record.Description || record.description}>{record.Description || record.description || "—"}</td>
                                <td className="px-4 py-3">
                                  {receiptName ? (
                                    <a href={`http://192.168.1.17:5000/${record.ReceiptFilePath || record.receiptFilePath}`} target="_blank" rel="noreferrer" className="inline-flex max-w-[150px] items-center gap-1 truncate text-xs text-blue-700 hover:underline" title={receiptName}>
                                      <FileText size={15} />
                                      {receiptName}
                                    </a>
                                  ) : (<span className="text-slate-400">—</span>)}
                                </td>
                                <td className="px-4 py-3">
                                  <div className="flex items-center gap-2">
                                    <button type="button" onClick={() => handleEdit(record)} title="Edit" className="rounded-md border border-blue-200 p-2 text-blue-700 hover:bg-blue-50"><Pencil size={15} /></button>
                                    <button type="button" onClick={() => handleDelete(record)} title="Delete" className="rounded-md border border-red-200 p-2 text-red-600 hover:bg-red-50"><Trash2 size={15} /></button>
                                  </div>
                                </td>
                              </tr>
                            );
                          })
                        )}
                      </tbody>
                    </table>
                  </div>
                  <div className="flex items-center justify-between border-t border-slate-100 px-4 py-3">
                      <span className="text-xs text-slate-600">Page {currentPage} of {totalPages}</span>
                      <div className="flex gap-2">
                          <button disabled={currentPage === 1} onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} className="p-2 border rounded-md disabled:opacity-40"><ChevronLeft size={16} /></button>
                          <button disabled={currentPage >= totalPages} onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} className="p-2 border rounded-md disabled:opacity-40"><ChevronRight size={16} /></button>
                      </div>
                  </div>
                </>
              )}
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};
export default AddMaintenance;