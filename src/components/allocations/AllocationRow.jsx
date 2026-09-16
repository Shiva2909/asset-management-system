import React from "react";
import { Badge } from "../common/Badge";
import { Button } from "../common/Button";
import { RotateCcw } from "lucide-react";
import { formatDate } from "../../utils/formatters";

export const AllocationRow = ({ allocation, onReturn }) => {
  const isReturned = Boolean(allocation.returnDate);

  return (
    <tr className="hover:bg-slate-50/60 transition-colors">
      <td className="py-3.5 px-4 font-mono text-xs font-semibold text-sky-600">
        {allocation.assetTag}
      </td>
      <td className="py-3.5 px-4 font-medium text-slate-800">
        {allocation.assetName}
      </td>
      <td className="py-3.5 px-4 font-medium text-slate-700">
        {allocation.employeeName}
      </td>
      <td className="py-3.5 px-4 text-slate-600">
        {formatDate(allocation.assignedDate)}
      </td>
      <td className="py-3.5 px-4 text-slate-600">
        {isReturned ? (
          <Badge variant="success">
            Returned: {formatDate(allocation.returnDate)}
          </Badge>
        ) : (
          <Badge variant="warning">Active Deployment</Badge>
        )}
      </td>
      <td className="py-3.5 px-4 text-xs italic text-slate-500">
        {allocation.remarks || "—"}
      </td>
      <td className="py-3.5 px-4 text-right">
        {!isReturned && (
          <Button
            size="sm"
            variant="secondary"
            onClick={() => onReturn(allocation)}
            className="text-xs gap-1"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Return
          </Button>
        )}
      </td>
    </tr>
  );
};
