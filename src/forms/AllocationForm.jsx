import React, { useState, useEffect } from "react";
import { Select } from "../components/common/Select";
import { Input } from "../components/common/Input";
import { Textarea } from "../components/common/Textarea";
import { Button } from "../components/common/Button";
import { apiUrl } from "../services/api";
import ReactSelect from "react-select";

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

    if (!values.assetId || !values.employeeId) {
      setErrors({
        assetId: !values.assetId ? "Required" : null,
        employeeId: !values.employeeId ? "Required" : null,
      });
      return;
    }

    const payload = {
      assetID: parseInt(values.assetId, 10),
      employeeID: parseInt(values.employeeId, 10),
      assignedDate: values.assignedDate,
      remarks: values.remarks || "",
    };

    onSubmit(payload);
  };

  const assetOptions = availableAssets.map((a) => ({
    value: a.AssetID || a.assetId || a.id,
    label: `${a.AssetTag || a.assetTag} — ${a.AssetName || a.assetName}`,
  }));

  const employeeOptions = employees.map((e) => ({
    value: e.id || e.EmployeeID || e.emp_id,
    label: `${e.emp_name || e.name} (${e.emp_dept || e.department || "Staff"})`,
  }));

  // Bill form jaisa compact React-Select style
  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      minHeight: "34px",
      fontSize: "13px",
      borderColor: errors.assetId ? "#ef4444" : "#cbd5e1",
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
      {/* Searchable Dropdown for Assets */}
      <div className="flex flex-col space-y-1">
        <label className="text-xs font-semibold text-slate-700">
          Available Device <span className="text-red-500">*</span>
        </label>
        <ReactSelect
          options={assetOptions}
          styles={customStyles}
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
        />
        {errors.assetId && (
          <span className="text-red-500 text-xs">{errors.assetId}</span>
        )}
      </div>

      {/* Employee Dropdown Wrapper */}
      <div className="[&_select]:py-1.5 [&_select]:text-xs [&_input]:py-1.5 [&_input]:text-xs">
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
      </div>

      {/* Assignment Date */}
      <div className="[&_input]:py-1.5 [&_input]:text-xs">
        <Input
          label="Assignment Date *"
          name="assignedDate"
          type="date"
          value={values.assignedDate}
          onChange={handleChange}
          error={errors.assignedDate}
          required
        />
      </div>

      {/* Remarks */}
      <div className="[&_textarea]:py-1.5 [&_textarea]:text-xs">
        <Textarea
          label="Remarks / Assignment Purpose"
          name="remarks"
          rows={2}
          value={values.remarks}
          onChange={handleChange}
          placeholder="Specify deployment details or special configurations..."
        />
      </div>

      <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
        <Button
          variant="secondary"
          onClick={onCancel}
          type="button"
          className="text-xs py-1.5"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          className="text-xs py-1.5"
          disabled={assetOptions.length === 0 || employeeOptions.length === 0}
        >
          Assign Assets
        </Button>
      </div>
    </form>
  );
};
