import React from "react";
import { EmptyState } from "./EmptyState";

export const Table = ({
  headers = [],
  children,
  count = 0,
  emptyMessage = "No records found",
}) => {
  return (
    <div className="w-full overflow-hidden border border-slate-200 rounded-xl bg-white shadow-xs">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50/75">
              {headers.map((h, i) => (
                <th
                  key={i}
                  className="py-2 px-3 text-[10px] font-semibold text-slate-600 uppercase tracking-wider"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">{children}</tbody>
        </table>
      </div>
      {count === 0 && (
        <div className="py-12">
          <EmptyState
            title={emptyMessage}
            description="Adjust your filters or register a new record."
          />
        </div>
      )}
    </div>
  );
};
