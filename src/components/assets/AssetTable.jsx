import React from "react";
import { Table } from "../common/Table";
import { AssetRow } from "./AssetRow";

export const AssetTable = ({ assets = [], onEdit, onDelete }) => {
  const headers = [
    "Asset Tag",
    "Asset Name",
    "Category",
    "Vendor",
    "Purchase Date",
    "Price",
    "Warranty Expiry",
    "Status",
    "Actions",
  ];

  return (
    <Table
      headers={headers}
      count={assets.length}
      emptyMessage="No matching assets found"
    >
      {assets.map((asset) => (
        <AssetRow
          key={asset.AssetID}
          asset={asset}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </Table>
  );
};
