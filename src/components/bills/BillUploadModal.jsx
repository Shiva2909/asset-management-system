import React from "react";
import { Modal } from "../common/Modal";
import { BillUploadForm } from "../../forms/BillUploadForm";

export const BillUploadModal = ({ isOpen, onClose, assets, onSubmit }) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Upload New Hardware Invoice"
    >
      <BillUploadForm
        assets={assets}
        onSubmit={(values) => {
          onSubmit(values);
          onClose();
        }}
        onCancel={onClose}
      />
    </Modal>
  );
};
