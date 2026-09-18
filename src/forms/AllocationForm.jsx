import React, { useState, useEffect } from "react";
import { Select } from "../components/common/Select"; // Tera custom dropdown
import { Input } from "../components/common/Input";
import { Textarea } from "../components/common/Textarea";
import { Button } from "../components/common/Button";
import { apiUrl } from "../services/api";
import ReactSelect from "react-select"; // 🚨 Iska naam change kiya taaki conflict na ho

export const AllocationForm = ({
  availableAssets = [],
  onSubmit,
  onCancel,
}) => {
  const [values, setValues] = useState({
    assetId: "",
    employeeId: "",
    assignedDate: new Date().toISOString().split("T")[0],
    remarks: "",
  });

  const [errors, setErrors] = useState({});
  const [employees, setEmployees] = useState([]);
  const [loadingEmployees, setLoadingEmployees] = useState(true);

  // 1. Employees Fetching
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await apiUrl.get("/employees");
        setEmployees(response.data.data || response.data || []);
      } catch (error) {
        console.error("Failed to load employees:", error);
        setEmployees([]);
      } finally {
        setLoadingEmployees(false);
      }
    };
    fetchEmployees();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: null }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Basic Validation
    if (!values.assetId || !values.employeeId) {
      setErrors({
        assetId: !values.assetId ? "Required" : null,
        employeeId: !values.employeeId ? "Required" : null,
      });
      return;
    }

    // 2. STRICT PAYLOAD (Like Postman)
    const payload = {
      assetID: parseInt(values.assetId, 10), // 🚨 ID capital
      employeeID: parseInt(values.employeeId, 10), // 🚨 ID capital
      assignedDate: values.assignedDate,
      remarks: values.remarks || "",
    };

    console.log("🚀 SENDING TO DATABASE:", payload);

    onSubmit(payload);
  };

  // 3. BULLETPROOF MAPPING
  const assetOptions = availableAssets.map((a) => ({
    value: a.AssetID || a.assetId || a.id,
    label: `${a.AssetTag || a.assetTag} — ${a.AssetName || a.assetName}`,
  }));

  const employeeOptions = employees.map((e) => ({
    value: e.id || e.EmployeeID || e.emp_id,
    label: `${e.emp_name || e.name} (${e.emp_dept || e.department || "Staff"})`,
  }));

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* 🚨 NAYA SEARCHABLE DROPDOWN ASSETS KE LIYE 🚨 */}
      <div className="flex flex-col space-y-1">
        <label className="text-sm font-medium text-slate-700">
          Available Device <span className="text-red-500">*</span>
        </label>
        <ReactSelect
          options={assetOptions}
          isSearchable={true}
          placeholder={
            assetOptions.length === 0
              ? "No available devices"
              : "Type to search asset (e.g. ASUS)..."
          }
          value={
            assetOptions.find((opt) => opt.value === values.assetId) || null
          }
          onChange={(selectedOption) => {
            setValues((prev) => ({
              ...prev,
              assetId: selectedOption ? selectedOption.value : "",
            }));
            if (errors.assetId)
              setErrors((prev) => ({ ...prev, assetId: null }));
          }}
          noOptionsMessage={() => "No available devices found"}
          isDisabled={assetOptions.length === 0}
          styles={{
            control: (baseStyles) => ({
              ...baseStyles,
              borderColor: errors.assetId ? "#ef4444" : "#cbd5e1",
              padding: "2px",
              borderRadius: "0.375rem",
              boxShadow: "none",
              "&:hover": {
                borderColor: "#94a3b8",
              },
            }),
          }}
        />
        {errors.assetId && (
          <span className="text-red-500 text-xs">{errors.assetId}</span>
        )}
      </div>

      {/* Purana custom dropdown Employee ke liye */}
      <Select
        label="Assign To Employee *"
        name="employeeId"
        options={employeeOptions}
        placeholder={
          loadingEmployees
            ? "Loading employees..."
            : "Select corporate assignee"
        }
        value={values.employeeId}
        onChange={handleChange}
        error={errors.employeeId}
        disabled={loadingEmployees || employeeOptions.length === 0}
        required
      />

      <Input
        label="Assignment Date *"
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
        <Button variant="secondary" onClick={onCancel} type="button">
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={assetOptions.length === 0 || employeeOptions.length === 0}
        >
          Assign Device
        </Button>
      </div>
    </form>
  );
};
