import { apiUrl } from "./api";

// Get all categories
export const getCategories = async () => {
  const response = await apiUrl.get("/categories");

  return response.data;
};

// Add category
export const addCategory = async (categoryName) => {
  const response = await apiUrl.post("/categories", {
    categoryName: categoryName.trim(),
  });

  return response.data;
};
