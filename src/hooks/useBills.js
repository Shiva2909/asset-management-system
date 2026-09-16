import { useState, useEffect, useCallback } from "react";
import { billService } from "../services/billService";

export const useBills = () => {
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBills = useCallback(() => {
    setLoading(true);
    const data = billService.getBills();
    setBills(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchBills();
  }, [fetchBills]);

  const uploadBill = (billData) => {
    billService.uploadBill(billData);
    fetchBills();
  };

  return {
    bills,
    loading,
    uploadBill,
    refetch: fetchBills,
  };
};
