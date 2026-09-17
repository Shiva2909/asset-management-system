import { useState, useEffect, useCallback } from "react";
import { billService } from "../services/billService";

export const useBills = () => {
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBills = useCallback(async () => {
    setLoading(true);
    try {
      const data = await billService.getBills();
      setBills(data);
    } catch (error) {
      console.error("Failed to fetch bills");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBills();
  }, [fetchBills]);

  const uploadBill = async (billData) => {
    try {
      await billService.uploadBill(billData);
      fetchBills(); // Upload ke baad table refresh
    } catch (error) {
      console.error("Upload failed");
      alert("Failed to upload invoice.");
    }
  };

  return { bills, loading, uploadBill, refetch: fetchBills };
};
