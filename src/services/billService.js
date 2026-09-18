import { apiUrl } from "./api"; // Apni API file ka path check kar lena

export const billService = {
  // 1. Backend se bills lana
  async getBills() {
    try {
      const response = await apiUrl.get("/bills");
      return response.data.data; // Backend 'data' array bhej raha hai
    } catch (error) {
      console.error("Error fetching bills:", error);
      throw error;
    }
  },

  // 2. File aur Data Backend ko bhejna (FormData zaroori hai file ke liye)
  async uploadBill(billData) {
    try {
      // Normal JSON ki jagah FormData banayenge
      const formData = new FormData();
      formData.append("assetID", billData.assetID);
      formData.append("billNumber", billData.billNumber);
      formData.append("amount", billData.amount);
      formData.append("billDate", billData.billDate);
      formData.append("invoiceFile", billData.file); // Backend 'upload.single("invoiceFile")' dhoondh raha hai

      // File bhejne ke liye header 'multipart/form-data' automatically set ho jata hai axios me
      const response = await apiUrl.post("/bills", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data;
    } catch (error) {
      console.error("Error uploading bill:", error);
      throw error;
    }
  },
};
