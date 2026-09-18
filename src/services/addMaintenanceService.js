import { apiUrl } from "./api";

export const addMaintenanceService = {
  // GET: specific asset ka maintenance
  getMaintenanceByAsset: async (assetId) => {
    const response = await apiUrl.get(`/assets/${assetId}/maintenance`);
    return response.data;
  },

  // POST: maintenance add (File ke sath)
  addMaintenance: async (formData) => {
    // 🚨 Headers me multipart/form-data lagaya hai for File Upload
    const response = await apiUrl.post("/maintenance", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },
};