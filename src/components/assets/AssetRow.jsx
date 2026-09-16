import React from "react";
import { Edit2, Trash2 } from "lucide-react";
import { AssetStatusBadge } from "./AssetStatusBadge";
import { formatCurrency, formatDate } from "../../utils/formatters";

export const AssetRow = ({ asset, onEdit, onDelete }) => {
  return (
    <tr className="hover:bg-slate-50/60 transition-colors">
      {/* Asset Tag */}
      <td className="py-3 px-4 font-mono text-xs font-semibold text-sky-600">
        {asset.AssetTag}
      </td>

      {/* Asset Name */}
      <td className="py-3 px-4 font-medium text-slate-800">
        {asset.AssetName}
      </td>

      {/* Category Name */}
      <td className="py-3 px-4 text-slate-600">{asset.CategoryName}</td>

      {/* Vendor */}
      <td className="py-3 px-4 text-slate-600">{asset.VendorName}</td>

      {/* Purchase Date */}
      <td className="py-3 px-4 text-slate-600">
        {formatDate(asset.PurchaseDate)}
      </td>

      {/* Price */}
      <td className="py-3 px-4 font-semibold text-slate-800">
        {formatCurrency(asset.Price)}
      </td>

      {/* Warranty Expiry */}
      <td className="py-3 px-4 text-slate-600">
        {formatDate(asset.WarrantyExpiryDate)}
      </td>

      {/* Status */}
      <td className="py-3 px-4">
        <AssetStatusBadge status={asset.Status} />
      </td>

      {/* Actions */}
      <td className="py-3 px-4 text-right">
        <div className="flex items-center justify-end gap-1.5">
          {/* Edit */}
          <button
            onClick={() => onEdit(asset)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
            title="Edit Asset"
          >
            <Edit2 className="w-4 h-4" />
          </button>

          {/* Delete */}
          <button
            onClick={() => onDelete(asset.AssetTag)}
            className="p-1.5 rounded-lg text-rose-400 hover:text-rose-600 hover:bg-rose-50"
            title="Delete Asset"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </td>
    </tr>
  );
};
