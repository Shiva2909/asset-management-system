import React, { useState } from "react";
import { Select } from "../components/common/Select";
import { Input } from "../components/common/Input";
import { Textarea } from "../components/common/Textarea";
import { Button } from "../components/common/Button";
import { EMPLOYEES } from "../utils/constants";
import { validateAllocation } from "../utils/validators";

export const AllocationForm = ({
  availableAssets = [],
  onSubmit,
  onCancel,
}) => {
  const [values, setValues] = useState({
    assetTag: "",
    employeeName: "",
    assignedDate: new Date().toISOString().split("T")[0],
    remarks: "",
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: null }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validateAllocation(values);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    const asset = availableAssets.find((a) => a.assetTag === values.assetTag);
    onSubmit({
      ...values,
      assetName: asset ? asset.assetName : "",
    });
  };

  const assetOptions = availableAssets.map((a) => ({
    value: a.assetTag,
    label: `${a.assetTag} — ${a.assetName}`,
  }));

  const employeeOptions = EMPLOYEES.map((e) => ({
    value: e.name,
    label: `${e.name} (${e.department})`,
  }));

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Select
        label="Available Device"
        name="assetTag"
        options={assetOptions}
        placeholder={
          assetOptions.length === 0
            ? "No available devices"
            : "Select an available asset"
        }
        value={values.assetTag}
        onChange={handleChange}
        error={errors.assetTag}
        disabled={assetOptions.length === 0}
        required
      />

      <Select
        label="Assign To Employee"
        name="employeeName"
        options={employeeOptions}
        placeholder="Select corporate assignee"
        value={values.employeeName}
        onChange={handleChange}
        error={errors.employeeName}
        required
      />

      <Input
        label="Assignment Date"
        name="assignedDate"
        type="date"
        value={values.assignedDate}
        onChange={handleChange}
        error={errors.assignedDate}
        required
      />

      <Textarea
        label="Remarks / Assignment Purpose"
        name="remarks"
        value={values.remarks}
        onChange={handleChange}
        placeholder="Specify deployment details or special configurations..."
      />

      <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
        <Button variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={assetOptions.length === 0}>
          Assign Device
        </Button>
      </div>
    </form>
  );
};
