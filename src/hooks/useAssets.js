import { useState, useEffect, useCallback } from "react";
import { useDebounce } from "./useDebounce";

import {
  getAssets1,
  getAssets,
  addAsset as apiAddAsset,
  updateAsset as apiUpdateAsset,
  deleteAsset as apiDeleteAsset,
} from "../services/assetService";

export const useAssets = (pageSize = 10, params = {}) => {
  // ==========================================
  // FILTER STATES
  // ==========================================
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  // SearchTerm kosam fast debounce (150ms)
  const debouncedSearchTerm = useDebounce(searchTerm, 150);

  // ==========================================
  // PAGINATION STATES
  // ==========================================
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // ==========================================
  // DATA & STATUS STATES
  // ==========================================
  const [assets, setAssets] = useState([]);
  const [totalItems, setTotalItems] = useState(0);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ==========================================
  // FETCH ASSETS
  // ==========================================
  const fetchAssets = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await getAssets1({
        searchTerm: debouncedSearchTerm,
        categoryFilter,
        statusFilter,
        page,
        pageSize,
        ...params,
      });

      console.log("FULL ASSETS RESPONSE:", response);

      // ==========================================
      // ASSETS LIST
      // ==========================================
      const list = Array.isArray(response) ? response : response?.data || [];

      console.log("ACTUAL ASSETS LIST:", list);

      setAssets(list);

      // ==========================================
      // TOTAL ITEMS
      // ==========================================
      setTotalItems(
        response?.totalRecords ??
          response?.totalCount ??
          response?.total ??
          response?.count ??
          list.length,
      );

      // ==========================================
      // TOTAL PAGES
      // ==========================================
      setTotalPages(
        response?.totalPages ??
          Math.max(
            1,
            Math.ceil(
              (response?.totalRecords ??
                response?.totalCount ??
                response?.total ??
                response?.count ??
                list.length) / pageSize,
            ),
          ),
      );
    } catch (err) {
      console.error("Failed to fetch assets:", err);

      const errorMessage =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        "Failed to fetch assets";

      setError(errorMessage);

      setAssets([]);
      setTotalItems(0);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  }, [
    debouncedSearchTerm,
    categoryFilter,
    statusFilter,
    page,
    pageSize,
    JSON.stringify(params),
  ]);

  // ==========================================
  // FETCH ON SEARCH / FILTER / PAGE CHANGE
  // ==========================================
  useEffect(() => {
    fetchAssets();
  }, [fetchAssets]);

  // ==========================================
  // SEARCH HANDLER
  // ==========================================
  const handleSearchChange = (value) => {
    setSearchTerm(value);
    setPage(1);
  };

  // ==========================================
  // CATEGORY HANDLER
  // ==========================================

  const handleCategoryChange = (categoryID) => {
    console.log("Selected Category ID:", categoryID);

    setCategoryFilter(String(categoryID ?? ""));
    setPage(1);
  };

  // ==========================================
  // STATUS HANDLER
  // ==========================================
  const handleStatusChange = (status) => {
    setStatusFilter(status);
    setPage(1);
  };

  // ==========================================
  // NEXT PAGE
  // ==========================================
  const nextPage = () => {
    if (page < totalPages) {
      setPage((currentPage) => currentPage + 1);
    }
  };

  // ==========================================
  // PREVIOUS PAGE
  // ==========================================
  const prevPage = () => {
    if (page > 1) {
      setPage((currentPage) => currentPage - 1);
    }
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

      await fetchAssets();

      return response;
    } catch (err) {
      console.error("Failed to add asset:", err);

      const errorMessage =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        "Failed to add asset";

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
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        "Failed to update asset";

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
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        "Failed to delete asset";

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

    // Loading & Error
    loading,
    error,

    // Pagination
    page,
    totalPages,
    nextPage,
    prevPage,

    // Refresh
    refetch: fetchAssets,

    // Filters
    searchTerm,
    categoryFilter,
    statusFilter,

    // Filter Handlers
    onSearchChange: handleSearchChange,
    onCategoryChange: handleCategoryChange,
    onStatusChange: handleStatusChange,

    // CRUD
    addAsset,
    editAsset,
    removeAsset,
  };
};

export default useAssets;
