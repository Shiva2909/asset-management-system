import React from "react";
import { ConfirmDialog } from "../common/ConfirmDialog";

export const ReturnAssetModal = ({
  isOpen,
  onClose,
  allocation,
  onConfirm,
}) => {
  if (!allocation) return null;

  return (
    <ConfirmDialog
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={() => {
        onConfirm(allocation.id, allocation.assetTag);
        onClose();
      }}
      title="Return Allocated Device"
      message={`Confirm return of ${allocation.assetName} (${allocation.assetTag}) from ${allocation.employeeName}? Device status will immediately revert to 'Available'.`}
      confirmLabel="Confirm Return"
    />
  );
};
