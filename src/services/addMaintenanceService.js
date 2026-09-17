import { apiUrl } from "./api";

export const addMaintenanceService = {
  // GET: specific asset ka maintenance
  getMaintenanceByAsset: async (assetId) => {
    const response = await apiUrl.get(`/assets/${assetId}/maintenance`);

    return response.data;
  },

  // GET: assets list
  // getAssets: async () => {
  //   const response = await apiUrl.get("/assets");
  //   return response.data;
  // },

  // POST: maintenance add
  addMaintenance: async (data) => {
    const response = await apiUrl.post("/maintenance", data);
    return response.data;
  },
};
