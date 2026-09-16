// hooks/useAssets.js

import { useState, useEffect, useCallback } from "react";

import {
  getAssets,
  addAsset as apiAddAsset,
  updateAsset as apiUpdateAsset,
  deleteAsset as apiDeleteAsset,
} from "../services/assetService";

export const useAssets = () => {
  // ==========================================
  // Filter States
  // ==========================================
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  // ==========================================
  // Data & Status States
  // ==========================================
  const [assets, setAssets] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // ==========================================
  // Fetch Assets
  // ==========================================
  const fetchAssets = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await getAssets({
        searchTerm,
        categoryFilter,
        statusFilter,
      });

      console.log("FULL ASSETS RESPONSE:", response);

      /*
        Backend response:

        {
          success: true,
          currentPage: 1,
          totalPages: 1,
          totalRecords: 5,
          count: 5,
          data: [
            {
              AssetID: 5,
              AssetTag: "AST102",
              AssetName: "hp",
              VendorName: "hppro",
              PurchaseDate: "...",
              Price: 700000,
              WarrantyExpiryDate: "...",
              Status: "Available",
              CategoryID: 1,
              CategoryName: "Laptop"
            }
          ]
        }
      */

      const list = Array.isArray(response) ? response : response?.data || [];

      console.log("ACTUAL ASSETS LIST:", list);

      setAssets(list);

      // API mein totalRecords aa raha hai
      setTotalItems(
        response?.totalRecords ||
          response?.totalCount ||
          response?.total ||
          list.length,
      );
    } catch (err) {
      console.error("Failed to fetch assets:", err);

      const errorMessage =
        err.response?.data?.message || err.message || "Failed to fetch assets";

      setError(errorMessage);

      setAssets([]);
      setTotalItems(0);
    } finally {
      setLoading(false);
    }
  }, [searchTerm, categoryFilter, statusFilter]);

  // ==========================================
  // Fetch on Search / Filter Change
  // ==========================================
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchAssets();
    }, 400);

    return () => clearTimeout(timer);
  }, [fetchAssets]);

  // ==========================================
  // Search Handler
  // ==========================================
  const handleSearchChange = (value) => {
    setSearchTerm(value);
  };

  // ==========================================
  // Category Handler
  // ==========================================
  const handleCategoryChange = (categoryID) => {
    setCategoryFilter(categoryID);
  };

  // ==========================================
  // Status Handler
  // ==========================================
  const handleStatusChange = (status) => {
    setStatusFilter(status);
  };

  // ==========================================
  // ADD ASSET
  // ==========================================
  const addAsset = async (assetData) => {
    setLoading(true);
    setError(null);

    try {
      const response = await apiAddAsset(assetData);

      console.log("ADD ASSET RESPONSE:", response);

      // Add ke baad table refresh
      await fetchAssets();

      return response;
    } catch (err) {
      console.error("Failed to add asset:", err);

      const errorMessage =
        err.response?.data?.message || err.message || "Failed to add asset";

      setError(errorMessage);

      throw err;
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // UPDATE ASSET
  // ==========================================
  const editAsset = async (assetTag, assetData) => {
    setLoading(true);
    setError(null);

    try {
      const response = await apiUpdateAsset(assetTag, assetData);

      console.log("UPDATE ASSET RESPONSE:", response);

      await fetchAssets();

      return response;
    } catch (err) {
      console.error("Failed to update asset:", err);

      const errorMessage =
        err.response?.data?.message || err.message || "Failed to update asset";

      setError(errorMessage);

      throw err;
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // DELETE ASSET
  // ==========================================
  const removeAsset = async (assetTag) => {
    setLoading(true);
    setError(null);

    try {
      const response = await apiDeleteAsset(assetTag);

      console.log("DELETE ASSET RESPONSE:", response);

      await fetchAssets();

      return response;
    } catch (err) {
      console.error("Failed to delete asset:", err);

      const errorMessage =
        err.response?.data?.message || err.message || "Failed to delete asset";

      setError(errorMessage);

      throw err;
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // RETURN
  // ==========================================
  return {
    // Assets
    assets,
    totalItems,
    loading,
    error,

    // Refresh
    refetch: fetchAssets,

    // Filters
    searchTerm,
    categoryFilter,
    statusFilter,

    // Filter handlers
    onSearchChange: handleSearchChange,
    onCategoryChange: handleCategoryChange,
    onStatusChange: handleStatusChange,

    // CRUD
    addAsset,
    editAsset,
    removeAsset,
  };
};
