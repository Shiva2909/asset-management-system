import React from "react";
import { Table } from "../common/Table";
import { AllocationRow } from "./AllocationRow";

export const AllocationTable = ({
  allocations = [],
  onReturn,
  onViewHistory,
}) => {
  const headers = [
    "Asset Tag",
    "Asset Name",
    "Employee",
    "Assigned Date",
    "Return Status",
    "Remarks",
    "Action",
  ];

  return (
    <Table
      headers={headers}
      count={allocations.length}
      emptyMessage="No asset allocation records logged"
    >
      {allocations.map((alloc) => (
        <AllocationRow
          key={alloc.id ?? alloc.AllocationID}
          allocation={alloc}
          onReturn={onReturn}
          onViewHistory={onViewHistory}
        />
      ))}
    </Table>
  );
};
