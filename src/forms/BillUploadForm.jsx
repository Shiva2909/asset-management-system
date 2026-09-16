import React, { useState } from "react";
import { Select } from "../components/common/Select";
import { Input } from "../components/common/Input";
import { FileUpload } from "../components/common/FileUpload";
import { Button } from "../components/common/Button";
import { validateBill } from "../utils/validators";

export const BillUploadForm = ({ assets = [], onSubmit, onCancel }) => {
  const [values, setValues] = useState({
    assetTag: "",
    billNumber: "",
    amount: "",
    billDate: new Date().toISOString().split("T")[0],
    file: null,
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: null }));
  };

  const handleFileSelect = (file) => {
    setValues((prev) => ({ ...prev, file }));
    if (errors.file) setErrors((prev) => ({ ...prev, file: null }));
  };

  const handleFileRemove = () => {
    setValues((prev) => ({ ...prev, file: null }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validateBill(values);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    const asset = assets.find((a) => a.assetTag === values.assetTag);
    onSubmit({
      ...values,
      assetName: asset ? asset.assetName : "Unknown Asset",
      amount: parseFloat(values.amount),
      fileName: values.file.name,
      fileUrl: URL.createObjectURL(values.file),
    });
  };

  const assetOptions = assets.map((a) => ({
    value: a.assetTag,
    label: `${a.assetTag} — ${a.assetName}`,
  }));

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Select
        label="Associated Asset"
        name="assetTag"
        options={assetOptions}
        placeholder="Select the purchased hardware"
        value={values.assetTag}
        onChange={handleChange}
        error={errors.assetTag}
        required
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Bill / Invoice Number"
          name="billNumber"
          value={values.billNumber}
          onChange={handleChange}
          placeholder="e.g. INV-9021"
          error={errors.billNumber}
          required
        />
        <Input
          label="Amount ($ USD)"
          name="amount"
          type="number"
          step="0.01"
          value={values.amount}
          onChange={handleChange}
          placeholder="0.00"
          error={errors.amount}
          required
        />
      </div>

      <Input
        label="Bill Date"
        name="billDate"
        type="date"
        value={values.billDate}
        onChange={handleChange}
        error={errors.billDate}
        required
      />

      <FileUpload
        file={values.file}
        onFileSelect={handleFileSelect}
        onFileRemove={handleFileRemove}
        error={errors.file}
      />

      <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
        <Button variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">Upload Invoice</Button>
      </div>
    </form>
  );
};
