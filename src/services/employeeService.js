import { apiUrl } from "./api";

export const getEmployees = async () => {
  const response = await apiUrl.get("/employees");

  return response.data;
};
