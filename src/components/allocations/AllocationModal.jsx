import React from "react";
import { Modal } from "../common/Modal";
import { AllocationForm } from "../../forms/AllocationForm";

export const AllocationModal = ({
  isOpen,
  onClose,
  availableAssets,
  onSubmit,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Assign Asset to Staff">
      <AllocationForm
        availableAssets={availableAssets}
        onSubmit={(values) => {
          onSubmit(values);
          onClose();
        }}
        onCancel={onClose}
      />
    </Modal>
  );
};
