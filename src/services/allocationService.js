import { getStorageItem, setStorageItem } from "../utils/helpers";
import { INITIAL_ALLOCATIONS } from "../data/mockAllocations";
import { ASSET_STATUS } from "../utils/constants";

const STORAGE_KEY = "ams_allocations_data";

export const allocationService = {
  getAllocations() {
    return getStorageItem(STORAGE_KEY, INITIAL_ALLOCATIONS);
  },

  saveAllocations(allocations) {
    setStorageItem(STORAGE_KEY, allocations);
  },

  createAllocation(data) {
    const allocations = this.getAllocations();
    const newRecord = {
      id: `ALC-${Date.now().toString().slice(-4)}`,
      ...data,
      returnDate: null,
    };
    this.saveAllocations([newRecord, ...allocations]);
    assetService.updateAsset(data.assetTag, { status: ASSET_STATUS.ASSIGNED });
    return newRecord;
  },

  returnAsset(allocationId, assetTag) {
    const allocations = this.getAllocations();
    const today = new Date().toISOString().split("T")[0];
    const updated = allocations.map((al) =>
      al.id === allocationId ? { ...al, returnDate: today } : al,
    );
    this.saveAllocations(updated);
    assetService.updateAsset(assetTag, { status: ASSET_STATUS.AVAILABLE });
    return true;
  },
};
