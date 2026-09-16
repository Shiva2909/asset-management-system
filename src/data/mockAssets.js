import { ASSET_STATUS } from "../utils/constants";

export const INITIAL_ASSETS = [
  {
    assetTag: "AST-0901",
    assetName: 'MacBook Pro 16" M3 Max',
    categoryID: "Laptops",
    vendorName: "Apple Direct Enterprise",
    purchaseDate: "2025-01-10",
    price: 3499.0,
    warrantyExpiryDate: "2028-01-10",
    status: ASSET_STATUS.ASSIGNED,
  },
  {
    assetTag: "AST-0902",
    assetName: 'Dell UltraSharp 32" 4K Video Hub',
    categoryID: "Monitors",
    vendorName: "Dell Global Direct",
    purchaseDate: "2025-02-14",
    price: 899.99,
    warrantyExpiryDate: "2028-02-14",
    status: ASSET_STATUS.AVAILABLE,
  },
  {
    assetTag: "AST-0903",
    assetName: "ThinkPad P16 Gen 2 Workstation",
    categoryID: "Laptops",
    vendorName: "Lenovo Commercial",
    purchaseDate: "2024-11-05",
    price: 2850.0,
    warrantyExpiryDate: "2027-11-05",
    status: ASSET_STATUS.AVAILABLE,
  },
  {
    assetTag: "AST-0904",
    assetName: "Herman Miller Embody Gaming Chair",
    categoryID: "Furniture",
    vendorName: "Herman Miller Work",
    purchaseDate: "2024-08-20",
    price: 1695.0,
    warrantyExpiryDate: "2036-08-20",
    status: ASSET_STATUS.MAINTENANCE,
  },
  {
    assetTag: "AST-0905",
    assetName: "Cisco Catalyst 9200 48-Port PoE+",
    categoryID: "Networking",
    vendorName: "Cisco Systems Inc",
    purchaseDate: "2024-03-12",
    price: 4200.0,
    warrantyExpiryDate: "2029-03-12",
    status: ASSET_STATUS.ASSIGNED,
  },
];

export default INITIAL_ASSETS;
