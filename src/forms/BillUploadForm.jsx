import React, { useState } from "react";
import ReactSelect from "react-select"; // Searchable dropdown
import { Input } from "../components/common/Input";
import { FileUpload } from "../components/common/FileUpload";
import { Button } from "../components/common/Button";
import { validateBill } from "../utils/validators";

export const BillUploadForm = ({ assets = [], onSubmit, onCancel }) => {
  const [values, setValues] = useState({
    assetID: "", // assetTag ki jagah assetID
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

    // File validation
    if (!values.file) {
      setErrors((prev) => ({ ...prev, file: "Invoice document is required" }));
      return;
    }
    if (!values.assetID) {
      setErrors((prev) => ({
        ...prev,
        assetID: "Asset selection is required",
      }));
      return;
    }

    onSubmit(values); // Seedha object bhejo, hook handle karega FormData
  };

  // Map for searchable dropdown
  const assetOptions = assets.map((a) => ({
    value: a.AssetID,
    label: `${a.AssetTag} — ${a.AssetName}`,
  }));

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex flex-col space-y-1">
        <label className="text-sm font-medium text-slate-700">
          Associated Asset *
        </label>
        <ReactSelect
          options={assetOptions}
          isSearchable={true}
          placeholder="Select or search hardware..."
          value={
            assetOptions.find((opt) => opt.value === values.assetID) || null
          }
          onChange={(selected) => {
            setValues((prev) => ({
              ...prev,
              assetID: selected ? selected.value : "",
            }));
            if (errors.assetID)
              setErrors((prev) => ({ ...prev, assetID: null }));
          }}
        />
        {errors.assetID && (
          <span className="text-red-500 text-xs">{errors.assetID}</span>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Bill / Invoice Number *"
          name="billNumber"
          value={values.billNumber}
          onChange={handleChange}
          required
        />
        <Input
          label="Amount *"
          name="amount"
          type="number"
          step="0.01"
          value={values.amount}
          onChange={handleChange}
          required
        />
      </div>

      <Input
        label="Bill Date *"
        name="billDate"
        type="date"
        value={values.billDate}
        onChange={handleChange}
        required
      />

      <FileUpload
        file={values.file}
        onFileSelect={handleFileSelect}
        onFileRemove={handleFileRemove}
        error={errors.file}
      />

      <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
        <Button variant="secondary" type="button" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">Upload Invoice</Button>
      </div>
    </form>
  );
};
