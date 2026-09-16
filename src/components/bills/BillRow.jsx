import React from "react";
import { FileText, Download } from "lucide-react";
import { formatCurrency, formatDate } from "../../utils/formatters";

export const BillRow = ({ bill, onPreview }) => {
  return (
    <tr className="hover:bg-slate-50/60 transition-colors">
      <td className="py-3 px-4 font-mono text-xs font-semibold text-slate-800">
        {bill.billNumber}
      </td>
      <td className="py-3 px-4 font-medium text-slate-800">{bill.assetName}</td>
      <td className="py-3 px-4 font-mono text-xs text-sky-600">
        {bill.assetTag}
      </td>
      <td className="py-3 px-4 text-slate-600">{formatDate(bill.billDate)}</td>
      <td className="py-3 px-4 font-semibold text-slate-900">
        {formatCurrency(bill.amount)}
      </td>
      <td className="py-3 px-4 text-right">
        <div className="flex items-center justify-end gap-2">
          <button
            onClick={() => onPreview(bill)}
            className="inline-flex items-center gap-1 text-xs font-medium text-sky-600 hover:text-sky-800 px-2 py-1 rounded bg-sky-50 border border-sky-100"
          >
            <FileText className="w-3.5 h-3.5" /> View
          </button>
          <a
            href={bill.fileUrl || "#"}
            download={bill.fileName || `Invoice-${bill.billNumber}`}
            className="inline-flex items-center gap-1 text-xs font-medium text-slate-600 hover:text-slate-800 px-2 py-1 rounded border border-slate-200"
          >
            <Download className="w-3.5 h-3.5" /> Download
          </a>
        </div>
      </td>
    </tr>
  );
};
