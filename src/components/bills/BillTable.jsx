import React from "react";
import { Table } from "../common/Table";
import { BillRow } from "./BillRow";

export const BillTable = ({ bills = [], onPreview }) => {
  const headers = [
    "Bill Number",
    "Associated Asset",
    "Asset Tag",
    "Billing Date",
    "Amount",
    "Documentation",
  ];

  return (
    <Table
      headers={headers}
      count={bills.length}
      emptyMessage="No invoices or bills currently recorded"
    >
      {bills.map((bill) => (
        <BillRow
          key={bill.id || bill.billNumber}
          bill={bill}
          onPreview={onPreview}
        />
      ))}
    </Table>
  );
};
