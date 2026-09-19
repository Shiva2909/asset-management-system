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

// export const getAssets1 = async (params = {}) => {
//   // 1. Khali (empty strings) values ko saaf karein
//   const cleanParams = Object.fromEntries(
//     Object.entries(params).filter(
//       ([_, value]) => value !== "" && value !== null && value !== undefined,
//     ),
//   );

//   // 2. Backend ke alag-alag possible parameter names yahan map karein
//   const mappedParams = {
//     ...cleanParams,
//     search: cleanParams.searchTerm, // Backend me agar 'search' likha ho
//     keyword: cleanParams.searchTerm, // Backend me agar 'keyword' likha ho
//     q: cleanParams.searchTerm, // Backend me agar 'q' likha ho
//     name: cleanParams.searchTerm, // Backend me agar 'name' likha ho
//     categoryId: cleanParams.categoryFilter, // Category ke liye
//     typeId: cleanParams.categoryFilter, // Category ke liye
//     status: cleanParams.statusFilter, // Status ke liye
//   };

//   const response = await apiUrl.get("/assets", {
//     params: mappedParams,
//   });

//   return response.data;
// };

export const getAssets1 = async (params = {}) => {
  // Empty values remove
  const cleanParams = Object.fromEntries(
    Object.entries(params).filter(
      ([_, value]) => value !== "" && value !== null && value !== undefined,
    ),
  );

  const mappedParams = {
    ...cleanParams,

    // Search
    search: cleanParams.searchTerm,
    keyword: cleanParams.searchTerm,
    q: cleanParams.searchTerm,
    name: cleanParams.searchTerm,

    // Category
    categoryId: cleanParams.categoryFilter,
    CategoryID: cleanParams.categoryFilter,
    categoryID: cleanParams.categoryFilter,
    category_id: cleanParams.categoryFilter,
    typeId: cleanParams.categoryFilter,

    // Status
    status: cleanParams.statusFilter,
  };

  // Remove empty mapped values too
  const finalParams = Object.fromEntries(
    Object.entries(mappedParams).filter(
      ([_, value]) => value !== "" && value !== null && value !== undefined,
    ),
  );

  console.log("ASSET API FILTER PARAMS:", finalParams);

  const response = await apiUrl.get("/assets", {
    params: finalParams,
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
