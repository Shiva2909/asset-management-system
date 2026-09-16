import { getStorageItem, setStorageItem } from "../utils/helpers";
import { INITIAL_BILLS } from "../data/mockBills";

const STORAGE_KEY = "ams_bills_data";

export const billService = {
  getBills() {
    return getStorageItem(STORAGE_KEY, INITIAL_BILLS);
  },

  saveBills(bills) {
    setStorageItem(STORAGE_KEY, bills);
  },

  uploadBill(billData) {
    const bills = this.getBills();
    const newBill = {
      id: `BILL-${Date.now().toString().slice(-4)}`,
      ...billData,
    };
    this.saveBills([newBill, ...bills]);
    return newBill;
  },
};
