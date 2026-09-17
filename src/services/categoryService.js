import { apiUrl } from "./api";

// Get all categories
export const getCategories = async () => {
  const response = await apiUrl.get("/categories");

  return response.data.data.map((category) => ({
    categoryId: category.CategoryID,
    categoryName: category.CategoryName,
  }));
};

// Add category
export const addCategory = async (categoryName) => {
  const response = await apiUrl.post("/categories", {
    categoryName: categoryName.trim(),
  });

  return response.data;
};

// Get all types
export const getTypes = async () => {
  const response = await apiUrl.get("/types");

  return response.data;
};

// Add type
// Add type
export const addType = async (typeName, categoryId) => {
  const response = await apiUrl.post("/types", {
    TypeName: typeName.trim(),
    CategoryID: Number(categoryId),
  });

  return response.data;
};
