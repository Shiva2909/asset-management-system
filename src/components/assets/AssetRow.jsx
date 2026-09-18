import React from "react";
import { Edit2, Trash2 } from "lucide-react";
import { AssetStatusBadge } from "./AssetStatusBadge";
import { formatCurrency, formatDate } from "../../utils/formatters";

export const AssetRow = ({ asset, onEdit, onDelete }) => {
  return (
    <tr className="transition-colors hover:bg-slate-50/60">
      {/* Asset Tag */}
      <td className="px-4 py-3 font-mono text-xs font-semibold text-sky-600">
        {asset.AssetTag}
      </td>

      {/* Asset Name */}
      <td className="px-4 py-3 text-xs font-medium text-slate-800">
        {asset.AssetName}
      </td>

      {/* Category */}
      <td className="px-4 py-3 text-xs text-slate-600">
        {asset.CategoryName || "N/A"}
      </td>

      {/* Vendor */}
      <td className="px-4 py-3 text-xs text-slate-600">
        {asset.VendorName || "N/A"}
      </td>

      {/* Purchase Date */}
      <td className="px-4 py-3 text-xs text-slate-600">
        {formatDate(asset.PurchaseDate)}
      </td>

      {/* Price */}
      <td className="px-4 py-3 text-xs font-semibold text-slate-800">
        {formatCurrency(asset.Price)}
      </td>

      {/* Warranty */}
      <td className="px-4 py-3 text-xs text-slate-600">
        {formatDate(asset.WarrantyExpiryDate)}
      </td>

      {/* Status */}
      <td className="px-4 py-3">
        <AssetStatusBadge status={asset.Status} />
      </td>

      {/* Actions */}
      <td className="px-4 py-3 text-right">
        <div className="flex items-center justify-end gap-1.5">
          <button
            type="button"
            onClick={() => onEdit(asset)}
            className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
            title="Edit Asset"
          >
            <Edit2 className="h-4 w-4" />
          </button>

          <button
            type="button"
            onClick={() => onDelete(asset.AssetID)}
            className="rounded-lg p-1.5 text-rose-400 transition hover:bg-rose-50 hover:text-rose-600"
            title="Delete Asset"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </td>
    </tr>
  );
};
