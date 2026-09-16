// services/assetService.js
import { apiUrl } from "./api";

// ==========================================
// 1. GET Requests (Fetch Data)
// ==========================================

// Get All Assets (Filters only, Pagination removed)
export const getAssets = async ({
  searchTerm = "",
  categoryFilter = "",
  statusFilter = "",
} = {}) => {
  const params = {
    ...(searchTerm.trim() && {
      search: searchTerm.trim(),
    }),

    ...(categoryFilter && {
      categoryName: categoryFilter,
    }),

    ...(statusFilter && {
      status: statusFilter,
    }),
  };

  const response = await apiUrl.get("/assets", {
    params,
  });

  console.log("GET ASSETS API:", response.data);

  return response.data;
};
// ==========================================
// 2. POST Request (Create Data)
// ==========================================

// Add New Asset
export const addAsset = async (assetData) => {
  const response = await apiUrl.post("/assets", {
    assetTag: assetData.assetTag,
    assetName: assetData.assetName,
    categoryID: assetData.categoryID,
    vendorName: assetData.vendorName,
    purchaseDate: assetData.purchaseDate,
    price: Number(assetData.price) || 0,
    warrantyExpiryDate: assetData.warrantyExpiryDate,
    status: assetData.status,
  });

  return response.data;
};

// ==========================================
// 3. PUT Request (Update Data)
// ==========================================

// Update Existing Asset by Asset Tag
export const updateAsset = async (assetTag, assetData) => {
  const response = await apiUrl.put(`/assets/${assetTag}`, {
    assetName: assetData.assetName,
    categoryID: assetData.categoryID,
    vendorName: assetData.vendorName,
    purchaseDate: assetData.purchaseDate,
    price: Number(assetData.price) || 0,
    warrantyExpiryDate: assetData.warrantyExpiryDate,
    status: assetData.status,
  });

  return response.data;
};

// ==========================================
// 4. DELETE Request (Remove Data)
// ==========================================

// Delete Asset by Asset Tag
export const deleteAsset = async (assetTag) => {
  const response = await apiUrl.delete(`/assets/${assetID}`);
  return response.data;
};
