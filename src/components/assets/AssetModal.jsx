import React, { useState, useEffect } from "react";

export const AssetModal = ({
  isOpen,
  onClose,
  onSubmit,
  assetToEdit,
  types = [],
}) => {
  const [formData, setFormData] = useState({
    AssetTag: "",
    AssetName: "",
    TypeID: "",
    VendorName: "",
    PurchaseDate: "",
    Price: Number,
    WarrantyExpiryDate: "",
    Status: "Available",
    RAM: "",
    Processor: "",
    Storage: "",
    MAC_Address: "",
    PhoneNumber: "",
    ServiceProvider: "",
    IMEI_Number: "",
    Material: "",
    Color: "",
    Dimensions: "",
  });

  useEffect(() => {
    if (assetToEdit) {
      setFormData({
        AssetTag: assetToEdit.AssetTag || "",
        AssetName: assetToEdit.AssetName || "",
        TypeID: assetToEdit.TypeID || "",
        VendorName: assetToEdit.VendorName || "",
        PurchaseDate: assetToEdit.PurchaseDate
          ? assetToEdit.PurchaseDate.split("T")[0]
          : "",
        Price: assetToEdit.Price || "",
        WarrantyExpiryDate: assetToEdit.WarrantyExpiryDate
          ? assetToEdit.WarrantyExpiryDate.split("T")[0]
          : "",
        Status: assetToEdit.Status || "Available",
        RAM: assetToEdit.RAM || "",
        Processor: assetToEdit.Processor || "",
        Storage: assetToEdit.Storage || "",
        MAC_Address: assetToEdit.MAC_Address || "",
        PhoneNumber: assetToEdit.PhoneNumber || "",
        ServiceProvider: assetToEdit.ServiceProvider || "",
        IMEI_Number: assetToEdit.IMEI_Number || "",
        Material: assetToEdit.Material || "",
        Color: assetToEdit.Color || "",
        Dimensions: assetToEdit.Dimensions || "",
      });
    } else {
      setFormData({
        AssetTag: "",
        AssetName: "",
        TypeID: "",
        VendorName: "",
        PurchaseDate: "",
        Price: Number,
        WarrantyExpiryDate: "",
        Status: "Available",
        RAM: "",
        Processor: "",
        Storage: "",
        MAC_Address: "",
        PhoneNumber: "",
        ServiceProvider: "",
        IMEI_Number: "",
        Material: "",
        Color: "",
        Dimensions: "",
      });
    }
  }, [assetToEdit]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData, assetToEdit ? assetToEdit.AssetID : null);
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        background: "rgba(0,0,0,0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
      }}
    >
      <div
        style={{
          background: "#fff",
          padding: "25px",
          borderRadius: "8px",
          width: "700px",
          maxHeight: "90vh",
          overflowY: "auto",
          fontSize: "12px",
        }}
      >
        <h3 style={{ fontSize: "16px" }}>
          {assetToEdit ? "Edit Asset" : "Add New Asset"}
        </h3>

        <form
          onSubmit={handleSubmit}
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "15px",
            marginTop: "15px",
          }}
        >
          {/* <div>
            <label style={{ fontSize: "12px", fontWeight: "bold" }}>
              Asset Tag *
            </label>
            <input
              type="text"
              name="AssetTag"
              value={formData.AssetTag}
              onChange={handleChange}
              required
              style={{
                width: "100%",
                padding: "8px",
                border: "1px solid #ccc",
                borderRadius: "4px",
                fontSize: "12px",
              }}
            />
          </div> */}

          <div>
            <label style={{ fontSize: "12px", fontWeight: "bold" }}>
              Asset Name *
            </label>
            <input
              type="text"
              name="AssetName"
              value={formData.AssetName}
              onChange={handleChange}
              required
              style={{
                width: "100%",
                padding: "8px",
                border: "1px solid #ccc",
                borderRadius: "4px",
                fontSize: "12px",
              }}
            />
          </div>

          <div>
            <label style={{ fontSize: "12px", fontWeight: "bold" }}>
              Asset Type *
            </label>
            <select
              name="TypeID"
              value={formData.TypeID}
              onChange={handleChange}
              required
              style={{
                width: "100%",
                padding: "8px",
                border: "1px solid #ccc",
                borderRadius: "4px",
                fontSize: "12px",
              }}
            >
              <option value="">Select Type</option>
              {types.map((t) => (
                <option key={t.TypeID} value={t.TypeID}>
                  {t.TypeName} ({t.CategoryName})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ fontSize: "12px", fontWeight: "bold" }}>
              Status
            </label>
            <select
              name="Status"
              value={formData.Status}
              onChange={handleChange}
              style={{
                width: "100%",
                padding: "8px",
                border: "1px solid #ccc",
                borderRadius: "4px",
                fontSize: "12px",
              }}
            >
              <option value="Available">Available</option>
              <option value="Assigned">Assigned</option>
              <option value="Decommissioned">Decommissioned</option>
            </select>
          </div>

          <div>
            <label style={{ fontSize: "12px", fontWeight: "bold" }}>
              Vendor Name
            </label>
            <input
              type="text"
              name="VendorName"
              value={formData.VendorName}
              onChange={handleChange}
              style={{
                width: "100%",
                padding: "8px",
                border: "1px solid #ccc",
                borderRadius: "4px",
                fontSize: "12px",
              }}
            />
          </div>

          <div>
            <label style={{ fontSize: "12px", fontWeight: "bold" }}>
              Price
            </label>
            <input
              type="number"
              name="Price"
              value={formData.Price}
              onChange={handleChange}
              style={{
                width: "100%",
                padding: "8px",
                border: "1px solid #ccc",
                borderRadius: "4px",
                fontSize: "12px",
              }}
            />
          </div>

          <div>
            <label style={{ fontSize: "12px", fontWeight: "bold" }}>
              Purchase Date
            </label>
            <input
              type="date"
              name="PurchaseDate"
              value={formData.PurchaseDate}
              onChange={handleChange}
              style={{
                width: "100%",
                padding: "8px",
                border: "1px solid #ccc",
                borderRadius: "4px",
                fontSize: "12px",
              }}
            />
          </div>

          <div>
            <label style={{ fontSize: "12px", fontWeight: "bold" }}>
              Warranty Expiry
            </label>
            <input
              type="date"
              name="WarrantyExpiryDate"
              value={formData.WarrantyExpiryDate}
              onChange={handleChange}
              style={{
                width: "100%",
                padding: "8px",
                border: "1px solid #ccc",
                borderRadius: "4px",
                fontSize: "12px",
              }}
            />
          </div>

          {/* Dynamic Fields Section */}
          <div
            style={{
              gridColumn: "span 2",
              borderTop: "1px solid #eee",
              paddingTop: "10px",
              marginTop: "5px",
              fontWeight: "bold",
              color: "#555",
              fontSize: "12px",
            }}
          >
            Specific Attributes (Electronics, Network/SIM, Furniture)
          </div>

          <div>
            <input
              type="text"
              name="RAM"
              placeholder="RAM (e.g. 16GB)"
              value={formData.RAM}
              onChange={handleChange}
              style={{
                width: "100%",
                padding: "8px",
                border: "1px solid #ccc",
                borderRadius: "4px",
                fontSize: "12px",
              }}
            />
          </div>

          <div>
            <input
              type="text"
              name="Processor"
              placeholder="Processor (e.g. M3 Pro)"
              value={formData.Processor}
              onChange={handleChange}
              style={{
                width: "100%",
                padding: "8px",
                border: "1px solid #ccc",
                borderRadius: "4px",
                fontSize: "12px",
              }}
            />
          </div>

          <div>
            <input
              type="text"
              name="Storage"
              placeholder="Storage (e.g. 512GB SSD)"
              value={formData.Storage}
              onChange={handleChange}
              style={{
                width: "100%",
                padding: "8px",
                border: "1px solid #ccc",
                borderRadius: "4px",
                fontSize: "12px",
              }}
            />
          </div>

          <div>
            <input
              type="text"
              name="MAC_Address"
              placeholder="MAC Address"
              value={formData.MAC_Address}
              onChange={handleChange}
              style={{
                width: "100%",
                padding: "8px",
                border: "1px solid #ccc",
                borderRadius: "4px",
                fontSize: "12px",
              }}
            />
          </div>

          {/* Network / SIM Fields */}
          <div>
            <input
              type="text"
              name="PhoneNumber"
              placeholder="Phone Number (SIM Asset)"
              value={formData.PhoneNumber}
              onChange={handleChange}
              style={{
                width: "100%",
                padding: "8px",
                border: "1px solid #ccc",
                borderRadius: "4px",
                fontSize: "12px",
              }}
            />
          </div>

          <div>
            <input
              type="text"
              name="ServiceProvider"
              placeholder="Service Provider (Airtel/Jio)"
              value={formData.ServiceProvider}
              onChange={handleChange}
              style={{
                width: "100%",
                padding: "8px",
                border: "1px solid #ccc",
                borderRadius: "4px",
                fontSize: "12px",
              }}
            />
          </div>

          <div>
            <input
              type="text"
              name="IMEI_Number"
              placeholder="IMEI Number"
              value={formData.IMEI_Number}
              onChange={handleChange}
              style={{
                width: "100%",
                padding: "8px",
                border: "1px solid #ccc",
                borderRadius: "4px",
                fontSize: "12px",
              }}
            />
          </div>

          {/* Furniture Fields */}
          <div>
            <input
              type="text"
              name="Material"
              placeholder="Material (e.g. Wood/Mesh)"
              value={formData.Material}
              onChange={handleChange}
              style={{
                width: "100%",
                padding: "8px",
                border: "1px solid #ccc",
                borderRadius: "4px",
                fontSize: "12px",
              }}
            />
          </div>

          <div>
            <input
              type="text"
              name="Color"
              placeholder="Color"
              value={formData.Color}
              onChange={handleChange}
              style={{
                width: "100%",
                padding: "8px",
                border: "1px solid #ccc",
                borderRadius: "4px",
                fontSize: "12px",
              }}
            />
          </div>

          <div style={{ gridColumn: "span 2" }}>
            <input
              type="text"
              name="Dimensions"
              placeholder="Dimensions (e.g. 24x24x40 inches)"
              value={formData.Dimensions}
              onChange={handleChange}
              style={{
                width: "100%",
                padding: "8px",
                border: "1px solid #ccc",
                borderRadius: "4px",
                fontSize: "12px",
              }}
            />
          </div>

          <div
            style={{
              gridColumn: "span 2",
              display: "flex",
              justifyContent: "flex-end",
              gap: "10px",
              marginTop: "15px",
            }}
          >
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: "8px 15px",
                background: "#ccc",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                fontSize: "12px",
              }}
            >
              Cancel
            </button>

            <button
              type="submit"
              style={{
                padding: "8px 15px",
                background: "#2563eb",
                color: "#fff",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                fontSize: "12px",
              }}
            >
              Save Asset
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
