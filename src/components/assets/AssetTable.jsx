import React from "react";

export const AssetTable = ({
  assets = [],
  loading = false,
  error = null,
  onEdit,
  onDelete,
}) => {
  const columns = [
    { key: "AssetTag", label: "Asset Tag" },
    { key: "AssetName", label: "Asset Name" },
    { key: "CategoryName", label: "Category" },
    { key: "VendorName", label: "Vendor" },
    { key: "PurchaseDate", label: "Purchase Date" },
    { key: "Price", label: "Price" },
    { key: "WarrantyExpiryDate", label: "Warranty Expiry" },
    { key: "Status", label: "Status" },
    { key: "RAM", label: "RAM" },
    { key: "Processor", label: "Processor" },
    { key: "Storage", label: "Storage" },
    { key: "MAC_Address", label: "MAC Address" },
    { key: "PhoneNumber", label: "Phone Number" },
    { key: "ServiceProvider", label: "Service Provider" },
    { key: "IMEI_Number", label: "IMEI Number" },
    { key: "Material", label: "Material" },
    { key: "Color", label: "Color" },
    { key: "Dimensions", label: "Dimensions" },
  ];

  if (loading) {
    return (
      <div className="p-6 text-center text-xs font-medium text-slate-500">
        Loading assets...
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center text-xs font-medium text-rose-500">
        {error}
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200 text-left text-[11px]">
          {/* TABLE HEADER */}
          <thead className="border-b border-slate-200 bg-slate-50">
            <tr>
              {/* S.No Header */}
              <th className="px-3 py-2 text-[10px] font-semibold uppercase text-slate-700 whitespace-nowrap text-center">
                S.No
              </th>

              {/* Dynamic Columns Headers */}
              {columns.map((col) => (
                <th
                  key={col.key}
                  className="px-3 py-2 text-[10px] font-semibold uppercase text-slate-700 whitespace-nowrap"
                >
                  {col.label}
                </th>
              ))}

              {/* Actions Header */}
              <th className="px-3 py-2 text-right text-[10px] font-semibold uppercase text-slate-700 whitespace-nowrap sticky right-0 bg-slate-50">
                Actions
              </th>
            </tr>
          </thead>

          {/* TABLE BODY */}
          <tbody className="divide-y divide-slate-100 bg-white">
            {assets && assets.length > 0 ? (
              assets.map((asset, index) => (
                <tr
                  key={asset.AssetID || asset.AssetTag || index}
                  className="hover:bg-slate-50/80 transition-colors"
                >
                  {/* S.No Counter (index + 1) */}
                  <td className="px-3 py-2 font-medium text-slate-600 text-center whitespace-nowrap">
                    {index + 1}
                  </td>

                  {/* Dynamic Fields */}
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      className="px-3 py-2 whitespace-nowrap text-slate-700"
                    >
                      {col.key === "Status" ? (
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold ${
                            asset.Status === "Available"
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                              : "bg-amber-50 text-amber-700 border border-amber-200"
                          }`}
                        >
                          {asset.Status || "Available"}
                        </span>
                      ) : (
                        asset[col.key] || "-"
                      )}
                    </td>
                  ))}

                  {/* Action Buttons */}
                  <td className="px-3 py-2 text-right whitespace-nowrap sticky right-0 bg-white shadow-[-4px_0_6px_-2px_rgba(0,0,0,0.05)]">
                    <button
                      type="button"
                      onClick={() => onEdit && onEdit(asset)}
                      className="mr-2 text-blue-600 hover:text-blue-800 font-medium cursor-pointer"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        onDelete && onDelete(asset.AssetID || asset.AssetTag)
                      }
                      className="text-rose-600 hover:text-rose-800 font-medium cursor-pointer"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={columns.length + 2}
                  className="px-3 py-6 text-center text-[11px] text-slate-500"
                >
                  No assets found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AssetTable;
