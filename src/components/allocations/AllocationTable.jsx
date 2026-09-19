import React, { useState } from "react";
import { Table } from "../common/Table";
import { AllocationRow } from "./AllocationRow";

export const AllocationTable = ({
  allocations = [],
  onReturn,
  onViewHistory,
}) => {
  const [currentPage, setCurrentPage] = useState(1);

  const pageSize = 10;
  const totalPages = 10;

  const headers = [
    "S.No.",
    "Asset Tag",
    "Asset Name",
    "Employee",
    "Assigned Date",
    "Return Status",
    "Remarks",
    "Action",
  ];

  const startIndex = (currentPage - 1) * pageSize;

  const paginatedAllocations = allocations.slice(
    startIndex,
    startIndex + pageSize,
  );

  return (
    <div>
      <Table
        headers={headers}
        count={allocations.length}
        emptyMessage="No asset allocation records logged"
      >
        {paginatedAllocations.map((alloc, index) => (
          <AllocationRow
            key={alloc.id ?? alloc.AllocationID}
            allocation={{
              ...alloc,

              // Automatic serial number
              sno: startIndex + index + 1,

              // Actual Asset Tag from allocation data
              AssetTag:
                alloc.AssetTag ??
                alloc.assetTag ??
                alloc.ASSETTAG ??
                alloc.AssetID ??
                alloc.assetId,
            }}
            onReturn={onReturn}
            onViewHistory={onViewHistory}
          />
        ))}
      </Table>

      {/* STATIC PAGINATION: 1 TO 10 */}
      <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
        {Array.from({ length: totalPages }, (_, index) => index + 1).map(
          (pageNumber) => (
            <button
              key={pageNumber}
              type="button"
              onClick={() => setCurrentPage(pageNumber)}
              className={`rounded-md border px-3 py-1.5 text-xs font-medium ${
                currentPage === pageNumber
                  ? "border-emerald-600 bg-emerald-600 text-white"
                  : "border-slate-300 bg-white text-slate-700 hover:bg-slate-100"
              }`}
            >
              {pageNumber}
            </button>
          ),
        )}
      </div>
    </div>
  );
};
