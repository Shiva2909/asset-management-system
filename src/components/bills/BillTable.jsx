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

  const safeBills = Array.isArray(bills) ? bills : [];

  return (
    <Table
      headers={headers}
      count={safeBills.length}
      emptyMessage="No invoices or bills currently recorded"
    >
      {safeBills.map((bill) => (
        // ID ko backend wale BillID se replace kiya
        <BillRow key={bill.BillID} bill={bill} onPreview={onPreview} />
      ))}
    </Table>
  );
};
