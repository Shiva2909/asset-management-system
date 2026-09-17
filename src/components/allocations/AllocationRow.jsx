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
      <td className="py-3.5 px-4 font-mono text-xs font-semibold text-sky-600">
        {/* Fix 2: AssetTag */}
        {allocation.AssetTag}
      </td>

      <td className="py-3.5 px-4 font-medium text-slate-800">
        {/* Fix 3: AssetName */}
        {allocation.AssetName}
      </td>

      <td className="py-3.5 px-4 font-medium text-slate-700">
        {/* Fix 4: emp_name and empid */}
        {allocation.emp_name} <br />
        <span className="text-xs text-slate-400">({allocation.empid})</span>
      </td>

      <td className="py-3.5 px-4 text-slate-600">
        {/* Fix 5: AssignedDate */}
        {formatDate(allocation.AssignedDate)}
      </td>

      <td className="py-3.5 px-4 text-slate-600">
        {isReturned ? (
          <Badge variant="success">
            {/* Fix 6: ReturnDate */}
            Returned: {formatDate(allocation.ReturnDate)}
          </Badge>
        ) : (
          <Badge variant="warning">Assigned</Badge>
        )}
      </td>

      <td className="py-3.5 px-4 text-xs italic text-slate-500">
        {/* Fix 7: Remarks */}
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
