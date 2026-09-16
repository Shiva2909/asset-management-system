export const validateLogin = (values) => {
  const errors = {};
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!values.email?.trim()) {
    errors.email = "Email address is required.";
  } else if (!emailRegex.test(values.email)) {
    errors.email = "Please enter a valid email format.";
  }

  if (!values.password) {
    errors.password = "Password is required.";
  } else if (values.password.length < 6) {
    errors.password = "Password must be at least 6 characters.";
  }

  return errors;
};

export const validateAsset = (values) => {
  const errors = {};
  if (!values.assetTag?.trim()) errors.assetTag = "Asset Tag is required.";
  if (!values.assetName?.trim()) errors.assetName = "Asset Name is required.";
  if (!values.categoryID) errors.categoryID = "Asset category must be chosen.";
  if (!values.vendorName?.trim())
    errors.vendorName = "Vendor name is required.";
  if (!values.purchaseDate) errors.purchaseDate = "Purchase date is required.";
  if (!values.warrantyExpiryDate)
    errors.warrantyExpiryDate = "Warranty expiry date is required.";

  if (
    values.price === undefined ||
    values.price === "" ||
    isNaN(values.price) ||
    Number(values.price) <= 0
  ) {
    errors.price = "Price must be a valid positive number.";
  }

  return errors;
};

export const validateAllocation = (values) => {
  const errors = {};
  if (!values.assetTag)
    errors.assetTag = "An available asset must be selected.";
  if (!values.employeeName)
    errors.employeeName = "Employee assignment is required.";
  if (!values.assignedDate)
    errors.assignedDate = "Assignment date is required.";
  return errors;
};

export const validateBill = (values) => {
  const errors = {};
  if (!values.assetTag) errors.assetTag = "Associated asset is required.";
  if (!values.billNumber?.trim())
    errors.billNumber = "Invoice/Bill number is required.";
  if (!values.amount || isNaN(values.amount) || Number(values.amount) <= 0) {
    errors.amount = "Valid invoice amount is required.";
  }
  if (!values.billDate) errors.billDate = "Bill issue date is required.";
  if (!values.file) errors.file = "Please upload a PDF or image invoice file.";
  return errors;
};
