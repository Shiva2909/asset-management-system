import { apiUrl } from "./api";

// ==========================================
// GET ALL ASSETS
// GET /api/assets
// ==========================================

export const getAssets = async (params = {}) => {
  const response = await apiUrl.get("/assets", {
    params,
  });

  return response.data;
};

// ==========================================
// GET ASSET BY ID
// GET /api/assets/:id
// ==========================================

export const getAssetById = async (id) => {
  const response = await apiUrl.get(`/assets/${id}`);

  return response.data;
};

// ==========================================
// ADD ASSET
// POST /api/assets
// ==========================================

export const addAsset = async (assetData) => {
  const response = await apiUrl.post("/assets", assetData);

  return response.data;
};

// ==========================================
// UPDATE ASSET
// PUT /api/assets/:id
// ==========================================

export const updateAsset = async (id, assetData) => {
  const response = await apiUrl.put(`/assets/${id}`, assetData);

  return response.data;
};

// ==========================================
// DELETE ASSET
// DELETE /api/assets/:id
// ==========================================

export const deleteAsset = async (AssetID) => {
  const response = await apiUrl.delete(`/assets/${AssetID}`);

  return response.data;
};
