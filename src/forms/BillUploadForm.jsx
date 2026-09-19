import React, { useState } from "react";
import ReactSelect from "react-select";
import { Input } from "../components/common/Input";
import { FileUpload } from "../components/common/FileUpload";
import { Button } from "../components/common/Button";

export const BillUploadForm = ({ assets = [], onSubmit, onCancel }) => {
  const [values, setValues] = useState({
    assetID: "",
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
    onSubmit(values);
  };

  const assetOptions = assets.map((a) => ({
    value: a.AssetID,
    label: `${a.AssetTag} — ${a.AssetName}`,
  }));

  const customStyles = {
    control: (provided) => ({
      ...provided,
      minHeight: "34px",
      fontSize: "13px",
      borderColor: "#cbd5e1",
      boxShadow: "none",
      "&:hover": { borderColor: "#94a3b8" },
    }),
    valueContainer: (provided) => ({
      ...provided,
      padding: "0px 6px",
    }),
    input: (provided) => ({
      ...provided,
      margin: "0px",
      fontSize: "13px",
    }),
    singleValue: (provided) => ({
      ...provided,
      fontSize: "13px",
      color: "#1e293b",
    }),
    placeholder: (provided) => ({
      ...provided,
      fontSize: "13px",
      color: "#94a3b8",
    }),
    indicatorSeparator: () => ({ display: "none" }),
    dropdownIndicator: (provided) => ({
      ...provided,
      padding: "4px",
    }),
    menuList: (provided) => ({
      ...provided,
      padding: "4px",
    }),
    option: (provided, state) => ({
      ...provided,
      padding: "4px 8px",
      fontSize: "12px",
      lineHeight: "1.2",
      backgroundColor: state.isSelected
        ? "#e2e8f0"
        : state.isFocused
          ? "#f1f5f9"
          : "transparent",
      color: "#1e293b",
    }),
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="flex flex-col space-y-1">
        <label className="text-xs font-semibold text-slate-700">
          Associated Asset *
        </label>
        <ReactSelect
          options={assetOptions}
          styles={customStyles}
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

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="[&_input]:py-1.5 [&_input]:text-xs">
          <Input
            label="Bill / Invoice Number *"
            name="billNumber"
            value={values.billNumber}
            onChange={handleChange}
            required
          />
        </div>
        <div className="[&_input]:py-1.5 [&_input]:text-xs">
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
      </div>

      <div className="[&_input]:py-1.5 [&_input]:text-xs">
        <Input
          label="Bill Date *"
          name="billDate"
          type="date"
          value={values.billDate}
          onChange={handleChange}
          required
        />
      </div>

      <FileUpload
        file={values.file}
        onFileSelect={handleFileSelect}
        onFileRemove={handleFileRemove}
        error={errors.file}
      />

      <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
        <Button variant="secondary" type="button" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">Upload Invoice</Button>
      </div>
    </form>
  );
};
