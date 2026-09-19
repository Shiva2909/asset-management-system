import React from "react";
import { Badge } from "../common/Badge";
import { Button } from "../common/Button";
import { RotateCcw } from "lucide-react";
import { formatDate } from "../../utils/formatters";

export const AllocationRow = ({ allocation, onReturn, onViewHistory }) => {
  // Fix 1: ReturnDate
  const isReturned = Boolean(allocation.ReturnDate);

  return (
    <tr className="hover:bg-slate-50/60 transition-colors">
      {/* S.No. - Automatic serial number */}
      <td className="py-3.5 px-4 font-mono text-xs font-semibold text-slate-600">
        {allocation.sno}
      </td>

      {/* Fix 2: AssetTag */}
      <td className="py-3.5 px-4 font-mono text-xs font-semibold text-sky-600">
        {allocation.AssetTag}
      </td>

      {/* Fix 3: AssetName */}
      <td className="py-3.5 px-4 font-medium text-slate-800">
        {allocation.AssetName}
      </td>

      {/* Fix 4: emp_name and empid */}
      <td className="py-3.5 px-4 font-medium text-slate-700">
        {allocation.emp_name} <br />
        <span className="text-xs text-slate-400">({allocation.empid})</span>
      </td>

      {/* Fix 5: AssignedDate */}
      <td className="py-3.5 px-4 text-slate-600">
        {formatDate(allocation.AssignedDate)}
      </td>

      {/* Fix 6: ReturnDate */}
      <td className="py-3.5 px-4 text-slate-600">
        {isReturned ? (
          <Badge variant="success">
            Returned: {formatDate(allocation.ReturnDate)}
          </Badge>
        ) : (
          <Badge variant="warning">Assigned</Badge>
        )}
      </td>

      {/* Fix 7: Remarks */}
      <td className="py-3.5 px-4 text-xs italic text-slate-500">
        {allocation.Remarks || "—"}
      </td>

      {/* Action */}
      <td className="py-3.5 px-4 text-right">
        <div className="flex items-center justify-end gap-2">
          {!isReturned && (
            <Button
              size="sm"
              variant="secondary"
              onClick={() => onReturn(allocation)}
              className="text-xs gap-1"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Return
            </Button>
          )}

          <button
            type="button"
            onClick={() => onViewHistory?.(allocation)}
            className="rounded-lg bg-emerald-600 px-3 py-2 text-sm text-white hover:bg-emerald-700"
          >
            View History
          </button>
        </div>
      </td>
    </tr>
  );
};
