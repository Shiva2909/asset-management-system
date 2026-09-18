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
        // 🚨 Fix: 'id' ki jagah 'AllocationID' aur 'assetTag' ki jagah 'AssetTag'
        onConfirm(allocation.AllocationID, allocation.AssetTag);
        onClose();
      }}
      title="Return Allocated Device"
      // 🚨 Fix: Saare variables ko exact backend keys se match kar diya
      message={`Confirm return of ${allocation.AssetName} (${allocation.AssetTag}) from ${allocation.emp_name}? Device status will immediately revert to 'Available'.`}
      confirmLabel="Confirm Return"
    />
  );
};
