import React from "react";
import { Modal } from "../common/Modal";
import { formatCurrency, formatDate } from "../../utils/formatters";

export const BillPreview = ({ isOpen, onClose, bill }) => {
  if (!bill) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Invoice: ${bill.BillNumber}`}
    >
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4 text-xs bg-slate-50 p-4 rounded-lg border border-slate-200">
          <div>
            <span className="font-semibold text-slate-500 uppercase">
              Asset Tag:
            </span>
            <p className="font-mono text-slate-800 mt-0.5">{bill.AssetTag}</p>
          </div>
          <div>
            <span className="font-semibold text-slate-500 uppercase">
              Asset:
            </span>
            <p className="font-medium text-slate-800 mt-0.5">
              {bill.AssetName}
            </p>
          </div>
          <div>
            <span className="font-semibold text-slate-500 uppercase">
              Invoice Date:
            </span>
            <p className="text-slate-800 mt-0.5">{formatDate(bill.BillDate)}</p>
          </div>
          <div>
            <span className="font-semibold text-slate-500 uppercase">
              Total Amount:
            </span>
            <p className="font-bold text-slate-900 mt-0.5">
              {formatCurrency(bill.Amount)}
            </p>
          </div>
        </div>
        <div className="p-8 border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center text-center">
          {/* File path backend se aayega */}
          <p className="text-xs font-medium text-slate-600 mb-1">
            {bill.InvoiceFilePath || "Attached Invoice Document"}
          </p>
        </div>
      </div>
    </Modal>
  );
};
