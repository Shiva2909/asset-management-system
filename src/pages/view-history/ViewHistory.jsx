import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, History, RefreshCw } from "lucide-react";

import { PageHeader } from "../../components/layout/PageHeader";
import { Button } from "../../components/common/Button";
import { Loader } from "../../components/common/Loader";

// Ensure this imports exactly where your service file is
import { allocationService } from "../../services/allocationService";

export const ViewHistory = () => {
  const navigate = useNavigate();
  const { assetId } = useParams();

  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchHistory = async () => {
    if (!assetId) {
      setError("Asset ID URL mein nahi mili. Wapas jaa kar dubara click karein.");
      setHistory([]);
      return;
    }

    try {
      setLoading(true);
      setError("");

      // 🚨 Backend route call kiya
      const response = await allocationService.getAssetHistory(assetId);

      // 🚨 Backend data extract and merge (Current + Past History)
      let allRecords = [];
      
      if (response?.currentStatus) {
        allRecords.push(response.currentStatus);
      }
      
      if (response?.historyLog && Array.isArray(response.historyLog)) {
        allRecords = [...allRecords, ...response.historyLog];
      }

      setHistory(allRecords);
    } catch (err) {
      console.error("History fetch failed:", err);
      setHistory([]);
      setError(
        err.response?.data?.message ||
        err.message ||
        "Allocation history load nahi ho saki."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [assetId]);

  const formatDate = (date) => {
    if (!date) return "—";
    const parsedDate = new Date(date);
    return Number.isNaN(parsedDate.getTime()) ? "—" : parsedDate.toLocaleDateString("en-IN");
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Allocation History"
        subtitle={`View assignment records for Asset ID: ${assetId || ""}`}
        actions={
          <div className="flex flex-wrap gap-2">
            <Button variant="secondary" onClick={() => navigate("/allocations")}>
              <ArrowLeft className="h-4 w-4" /> Back
            </Button>
            <Button onClick={fetchHistory} disabled={loading || !assetId}>
              <RefreshCw className="h-4 w-4" /> Refresh
            </Button>
          </div>
        }
      />

      {loading ? (
        <Loader message="Loading allocation history..." />
      ) : error ? (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4">
          <p className="text-sm text-red-700">{error}</p>
          <button type="button" onClick={fetchHistory} className="mt-2 text-sm font-semibold text-red-700 underline">
            Try again
          </button>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center gap-2 border-b border-slate-200 p-4">
            <History className="h-5 w-5 text-sky-600" />
            <h2 className="font-semibold text-slate-800">History Records</h2>
            <span className="ml-auto rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
              {history.length} Records
            </span>
          </div>

          <table className="min-w-[1000px] w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase text-slate-500">
              <tr>
                <th className="px-4 py-3">Allocation ID</th>
                <th className="px-4 py-3">Employee ID</th>
                <th className="px-4 py-3">Employee Name</th>
                <th className="px-4 py-3">Department</th>
                <th className="px-4 py-3">Assigned Date</th>
                <th className="px-4 py-3">Return Date</th>
                <th className="px-4 py-3">Days Used</th>
                <th className="px-4 py-3">Remarks</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {history.length > 0 ? (
                history.map((item, index) => (
                  <tr key={item.AllocationID ?? index} className="transition-colors hover:bg-slate-50">
                    <td className="px-4 py-3 font-mono text-xs font-semibold text-sky-600">{item.AllocationID ?? "—"}</td>
                    <td className="px-4 py-3 text-slate-700">{item.empid ?? "—"}</td>
                    <td className="px-4 py-3 font-medium text-slate-800">{item.emp_name ?? "—"}</td>
                    <td className="px-4 py-3 text-slate-600">{item.emp_dept ?? "—"}</td>
                    <td className="px-4 py-3 text-slate-600">{formatDate(item.AssignedDate)}</td>
                    <td className="px-4 py-3 text-slate-600">{formatDate(item.ReturnDate)}</td>
                    <td className="px-4 py-3 text-slate-700">{item.DaysUsed ?? "Currently Active"}</td>
                    <td className="max-w-xs px-4 py-3 text-slate-600">{item.Remarks || "—"}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="px-4 py-10 text-center text-slate-500">
                    No allocation history found for this asset.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ViewHistory;