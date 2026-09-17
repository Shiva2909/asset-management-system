import React from "react";
import { AssetRow } from "./AssetRow";

export const AssetTable = ({ assets = [], onEdit, onDelete }) => {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full table-fixed text-left text-[11px]">
          {/* TABLE HEADER */}
          <thead className="border-b border-slate-200 bg-slate-50">
            <tr>
              <th className="w-[11%] px-2 py-2 text-[10px] font-semibold uppercase text-slate-700">
                Asset Tag
              </th>

              <th className="w-[12%] px-2 py-2 text-[10px] font-semibold uppercase text-slate-700">
                Asset Name
              </th>

              <th className="w-[11%] px-2 py-2 text-[10px] font-semibold uppercase text-slate-700">
                Category
              </th>

              <th className="w-[11%] px-2 py-2 text-[10px] font-semibold uppercase text-slate-700">
                Vendor
              </th>

              <th className="w-[12%] px-2 py-2 text-[10px] font-semibold uppercase text-slate-700">
                Purchase Date
              </th>

              <th className="w-[9%] px-2 py-2 text-[10px] font-semibold uppercase text-slate-700">
                Price
              </th>

              <th className="w-[13%] px-2 py-2 text-[10px] font-semibold uppercase text-slate-700">
                Warranty Expiry
              </th>

              <th className="w-[9%] px-2 py-2 text-[10px] font-semibold uppercase text-slate-700">
                Status
              </th>

              <th className="w-[12%] px-2 py-2 text-right text-[10px] font-semibold uppercase text-slate-700">
                Actions
              </th>
            </tr>
          </thead>

          {/* TABLE BODY */}
          <tbody className="divide-y divide-slate-100">
            {assets.length > 0 ? (
              assets.map((asset) => (
                <AssetRow
                  key={asset.AssetID || asset.AssetTag}
                  asset={asset}
                  onEdit={onEdit}
                  onDelete={onDelete}
                />
              ))
            ) : (
              <tr>
                <td
                  colSpan="9"
                  className="px-2 py-6 text-center text-[11px] text-slate-500"
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
