import { useEffect, useState, useCallback } from "react";
import { addMaintenanceService } from "../services/addMaintenanceService";
import { getAssets } from "../services/assetService";

export const useMaintenance = () => {
  const [assets, setAssets] = useState([]);
  const [records, setRecords] = useState([]);
  
  // 🚨 Backend se aaye totals yahan store honge
  const [assetStats, setAssetStats] = useState({});
  
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchAssets = useCallback(async () => {
    try {
      setError("");
      const response = await getAssets();
      const data = Array.isArray(response) ? response : response?.data || [];
      setAssets(data);
      return data;
    } catch (err) {
      console.error("Assets GET error:", err);
      setError(err.response?.data?.message || "Assets load nahi ho sake.");
      return [];
    }
  }, []);

  const fetchMaintenance = useCallback(async (assetList = []) => {
    try {
      setLoading(true);
      setError("");

      if (!Array.isArray(assetList) || assetList.length === 0) {
        setRecords([]);
        setAssetStats({});
        return [];
      }

      const responses = await Promise.all(
        assetList.map((asset) => {
          const assetId = asset.AssetID ?? asset.assetID ?? asset.assetId ?? asset.id;
          if (assetId == null) return Promise.resolve(null);
          return addMaintenanceService.getMaintenanceByAsset(assetId);
        })
      );

      const newStats = {};
      const allRecords = responses.flatMap((response) => {
        if (!response) return [];

        // 🚨 Postman structure ko explicitly map kiya
        if (response.assetId) {
          newStats[String(response.assetId)] = {
            totalRepairs: response.totalRepairs || 0,
            totalCost: response.totalCost || 0,
          };
        }

        if (Array.isArray(response.history)) {
          return response.history.map(record => ({
            ...record,
            AssetID: response.assetId
          }));
        }
        
        if (Array.isArray(response.data)) return response.data;
        if (Array.isArray(response)) return response;
        return [];
      });

      allRecords.sort((a, b) => new Date(b.MaintenanceDate || b.maintenanceDate) - new Date(a.MaintenanceDate || a.maintenanceDate));
      
      setRecords(allRecords);
      setAssetStats(newStats); 
      return allRecords;
    } catch (err) {
      console.error("Maintenance GET error:", err);
      setError(err.response?.data?.message || "Maintenance records load nahi ho sake.");
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const addMaintenance = async (formData) => {
    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const selectedAssetId = Number(formData.assetId);
      const maintenanceCost = Number(formData.cost);

      if (!selectedAssetId) { setError("Please select a valid asset."); return false; }
      if (formData.cost === "" || !Number.isFinite(maintenanceCost)) { setError("Please enter a valid maintenance cost."); return false; }

      const payload = new FormData();
      payload.append("assetID", selectedAssetId);
      payload.append("cost", maintenanceCost);
      payload.append("maintenanceDate", formData.maintenanceDate);
      payload.append("description", formData.description || "");
      if (formData.receiptFile) payload.append("receipt", formData.receiptFile);

      await addMaintenanceService.addMaintenance(payload);

      setSuccess("Maintenance added successfully!");
      await fetchMaintenance(assets); 
      return true;

    } catch (err) {
      console.error("Maintenance POST error:", err);
      setError(err.response?.data?.message || "Maintenance add nahi ho saka.");
      return false;
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      const assetList = await fetchAssets();
      await fetchMaintenance(assetList);
    };
    loadData();
  }, [fetchAssets, fetchMaintenance]);

  const clearMessages = useCallback(() => {
    setError(""); setSuccess("");
  }, []);

  return { assets, records, assetStats, loading, saving, error, success, fetchAssets, fetchMaintenance, addMaintenance, clearMessages };
};