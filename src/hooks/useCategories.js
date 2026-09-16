// hooks/useCategories.js
import { useState, useEffect, useCallback } from "react";
import { getCategories } from "../services/categoryService";

export const useCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getCategories();
      console.log("Categories API Response:", res); // <-- Console me data check karein

      // Agar response me direct array hai ya nested object:
      const list = Array.isArray(res)
        ? res
        : res?.categories || res?.data || [];

      setCategories(list);
    } catch (err) {
      console.error("Categories Fetch Error:", err);
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  return { categories, loading, error, refetchCategories: fetchCategories };
};
