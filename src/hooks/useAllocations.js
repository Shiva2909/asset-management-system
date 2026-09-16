import { useState, useEffect, useCallback } from "react";
import { allocationService } from "../services/allocationService";

export const useAllocations = () => {
  const [allocations, setAllocations] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAllocations = useCallback(() => {
    setLoading(true);
    const data = allocationService.getAllocations();
    setAllocations(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchAllocations();
  }, [fetchAllocations]);

  const assignAsset = (data) => {
    allocationService.createAllocation(data);
    fetchAllocations();
  };

  const returnAsset = (allocationId, assetTag) => {
    allocationService.returnAsset(allocationId, assetTag);
    fetchAllocations();
  };

  return {
    allocations,
    loading,
    assignAsset,
    returnAsset,
    refetch: fetchAllocations,
  };
};
