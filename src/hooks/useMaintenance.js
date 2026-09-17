import { useEffect, useState, useCallback } from "react";
import { addMaintenanceService } from "../services/addMaintenanceService";
import { getAssets } from "../services/assetService";

export const useMaintenance = () => {
  const [assets, setAssets] = useState([]);
  const [records, setRecords] = useState([]);

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // ==========================================
  // GET ALL ASSETS
  // ==========================================
  const fetchAssets = useCallback(async () => {
    try {
      setError("");

      const response = await getAssets();

      const data = Array.isArray(response) ? response : response?.data || [];

      setAssets(data);

      return data;
    } catch (err) {
      console.error("Assets GET error:", err);
      console.error("Assets GET response:", err.response?.data);

      setError(err.response?.data?.message || "Assets load nahi ho sake.");

      return [];
    }
  }, []);

  // ==========================================
  // GET MAINTENANCE RECORDS
  // Backend: GET /assets/:assetId/maintenance
  // ==========================================
  const fetchMaintenance = useCallback(async (assetList = []) => {
    try {
      setLoading(true);
      setError("");

      if (!Array.isArray(assetList) || assetList.length === 0) {
        setRecords([]);
        return [];
      }

      const responses = await Promise.all(
        assetList.map((asset) => {
          const assetId =
            asset.assetID ?? asset.assetId ?? asset.AssetID ?? asset.id;

          if (assetId == null) {
            console.warn("Asset ID missing:", asset);
            return Promise.resolve(null);
          }

          return addMaintenanceService.getMaintenanceByAsset(assetId);
        }),
      );

      const allRecords = responses.flatMap((response) => {
        if (!response) {
          return [];
        }

        // API response: { success, assetId, history: [] }
        if (Array.isArray(response.history)) {
          return response.history;
        }

        // API response: { data: [] }
        if (Array.isArray(response.data)) {
          return response.data;
        }

        // API directly returns an array
        if (Array.isArray(response)) {
          return response;
        }

        return [];
      });

      setRecords(allRecords);

      return allRecords;
    } catch (err) {
      console.error("Maintenance GET error:", err);
      console.error("Maintenance GET response:", err.response?.data);

      setError(
        err.response?.data?.message || "Maintenance records load nahi ho sake.",
      );

      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  // ==========================================
  // POST MAINTENANCE
  // ==========================================
  const addMaintenance = async (formData) => {
    let payload;

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      // Validate required values
      const selectedAssetId = Number(formData.assetId);
      const maintenanceCost = Number(formData.cost);

      if (!selectedAssetId || !Number.isFinite(selectedAssetId)) {
        setError("Please select a valid asset.");
        return false;
      }

      if (
        formData.cost === "" ||
        formData.cost == null ||
        !Number.isFinite(maintenanceCost)
      ) {
        setError("Please enter a valid maintenance cost.");
        return false;
      }

      // Backend expects AssetID and Cost
      payload = {
        AssetID: selectedAssetId,
        Cost: maintenanceCost,
        MaintenanceDate: formData.maintenanceDate,
        Description: formData.description || "",
      };

      console.log("Maintenance POST payload:", payload);

      await addMaintenanceService.addMaintenance(payload);

      setSuccess("Maintenance added successfully!");

      // Refresh records for all loaded assets
      await fetchMaintenance(assets);

      return true;
    } catch (err) {
      console.error("Maintenance POST status:", err.response?.status);
      console.error("Maintenance POST response:", err.response?.data);
      console.error("Submitted payload:", payload);

      setError(err.response?.data?.message || "Maintenance add nahi ho saka.");

      return false;
    } finally {
      setSaving(false);
    }
  };

  // ==========================================
  // LOAD DATA ON COMPONENT MOUNT
  // ==========================================
  useEffect(() => {
    const loadData = async () => {
      const assetList = await fetchAssets();

      await fetchMaintenance(assetList);
    };

    loadData();
  }, [fetchAssets, fetchMaintenance]);

  // ==========================================
  // CLEAR MESSAGES
  // ==========================================
  const clearMessages = useCallback(() => {
    setError("");
    setSuccess("");
  }, []);

  // ==========================================
  // RETURN
  // ==========================================
  return {
    assets,
    records,

    loading,
    saving,

    error,
    success,

    fetchAssets,
    fetchMaintenance,
    addMaintenance,
    clearMessages,
  };
};
