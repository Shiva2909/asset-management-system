// src/forms/AssetForm.jsx

import React, { useEffect, useState, useMemo } from "react";
import { Input } from "../components/common/Input";
import { Select } from "../components/common/Select";
import { Button } from "../components/common/Button";
import { ASSET_STATUS } from "../utils/constants";
import { validateAsset } from "../utils/validators";
import { getCategories } from "../services/categoryService";

export const AssetForm = ({ initialValues, onSubmit, onCancel }) => {
  // ==========================================
  // Categories State
  // ==========================================
  const [categories, setCategories] = useState([]);
  const [categoryLoading, setCategoryLoading] = useState(false);

  const formatDate = (dateString) => {
    if (!dateString) return "";
    return dateString.split("T")[0];
  };

  // ==========================================
  // Form Values
  // ==========================================
  const [values, setValues] = useState({
    assetTag: "",
    assetName: "",
    categoryID: "",
    vendorName: "",
    purchaseDate: new Date().toISOString().split("T")[0],
    price: "",
    warrantyExpiryDate: "",
    status: ASSET_STATUS?.AVAILABLE || "AVAILABLE",
  });

  const [errors, setErrors] = useState({});

  // ==========================================
  // Fetch Categories
  // ==========================================
  useEffect(() => {
    const fetchCats = async () => {
      try {
        setCategoryLoading(true);

        const response = await getCategories();

        console.log("Category API Response:", response);

        /*
          Backend response:

          {
            success: true,
            data: [
              {
                CategoryID: 10,
                CategoryName: "bike"
              },
              {
                CategoryID: 8,
                CategoryName: "bus"
              }
            ]
          }
        */

        const list = Array.isArray(response) ? response : response?.data || [];

        console.log("Categories List:", list);

        setCategories(list);
      } catch (error) {
        console.error("Failed to load categories in AssetForm:", error);

        setCategories([]);
      } finally {
        setCategoryLoading(false);
      }
    };

    fetchCats();
  }, []);

  // ==========================================
  // Category Dropdown Options
  // ==========================================
  const categoryOptions = useMemo(() => {
    return [
      {
        label: categoryLoading ? "Loading categories..." : "Select Category",
        value: "",
      },

      ...(categories || []).map((category) => ({
        key: category.CategoryID,
        label: category.CategoryName,
        value: String(category.CategoryID),
      })),
    ];
  }, [categories, categoryLoading]);

  // ==========================================
  // Initial Values / Edit Asset
  // ==========================================
  useEffect(() => {
    if (initialValues) {
      setValues({
        assetTag: initialValues.assetTag || "",
        assetName: initialValues.assetName || "",

        // Category ID ko priority do
        categoryID:
          initialValues.categoryID !== undefined &&
          initialValues.categoryID !== null
            ? String(initialValues.categoryID)
            : "",

        vendorName: initialValues.vendorName || "",

        purchaseDate: formatDate(initialValues.purchaseDate),

        price:
          initialValues.price !== undefined ? String(initialValues.price) : "",

        warrantyExpiryDate: formatDate(initialValues.warrantyExpiryDate),

        status: initialValues.status || ASSET_STATUS?.AVAILABLE || "AVAILABLE",
      });
    }
  }, [initialValues]);

  // ==========================================
  // Handle Input Change
  // ==========================================
  const handleChange = (e) => {
    const { name, value } = e.target;

    setValues((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Error clear
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: null,
      }));
    }
  };

  // ==========================================
  // Submit Form
  // ==========================================
  const handleSubmit = (e) => {
    e.preventDefault();

    // Validation
    const validationErrors =
      typeof validateAsset === "function" ? validateAsset(values) : {};

    if (validationErrors && Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    // ==========================================
    // Final Asset Data
    // ==========================================
    const assetData = {
      assetTag: values.assetTag.trim(),

      assetName: values.assetName.trim(),

      // IMPORTANT:
      // Select se value string aati hai.
      // Backend ko CategoryID number bhej rahe hain.
      categoryID: Number(values.categoryID),

      vendorName: values.vendorName.trim(),

      purchaseDate: values.purchaseDate,

      price: Number(values.price) || 0,

      warrantyExpiryDate: values.warrantyExpiryDate,

      status: values.status,
    };

    console.log("Asset Data Before Save:", assetData);

    onSubmit(assetData);
  };

  // ==========================================
  // UI
  // ==========================================
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* ================================
          Asset Tag + Asset Name
      ================================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Asset Tag"
          name="assetTag"
          value={values.assetTag}
          onChange={handleChange}
          placeholder="e.g. AST-1049"
          error={errors.assetTag}
          disabled={!!initialValues}
          required
        />

        <Input
          label="Asset Name"
          name="assetName"
          value={values.assetName}
          onChange={handleChange}
          placeholder="e.g. MacBook Pro 14 M3"
          error={errors.assetName}
          required
        />
      </div>

      {/* ================================
          Category + Vendor
      ================================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Select
          label="Category"
          name="categoryID"
          options={categoryOptions}
          value={values.categoryID}
          onChange={handleChange}
          error={errors.categoryID}
          required
        />

        <Input
          label="Vendor"
          name="vendorName"
          value={values.vendorName}
          onChange={handleChange}
          placeholder="e.g. Apple Direct"
          error={errors.vendorName}
          required
        />
      </div>

      {/* ================================
          Price + Purchase Date + Warranty
      ================================= */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Input
          label="Price ($ USD)"
          name="price"
          type="number"
          step="0.01"
          min="0"
          value={values.price}
          onChange={handleChange}
          placeholder="0.00"
          error={errors.price}
          required
        />

        <Input
          label="Purchase Date"
          name="purchaseDate"
          type="date"
          value={values.purchaseDate}
          onChange={handleChange}
          error={errors.purchaseDate}
          required
        />

        <Input
          label="Warranty Expiry"
          name="warrantyExpiryDate"
          type="date"
          value={values.warrantyExpiryDate}
          onChange={handleChange}
          error={errors.warrantyExpiryDate}
          required
        />
      </div>

      {/* ================================
          Buttons
      ================================= */}
      <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>

        <Button type="submit">
          {initialValues ? "Update Asset" : "Save Asset"}
        </Button>
      </div>
    </form>
  );
};
