import React from "react";
import { Badge } from "../common/Badge";
import { ASSET_STATUS } from "../../utils/constants";

export const AssetStatusBadge = ({ status }) => {
  switch (status) {
    case ASSET_STATUS.AVAILABLE:
      return <Badge variant="success">Available</Badge>;
    case ASSET_STATUS.ASSIGNED:
      return <Badge variant="info">Assigned</Badge>;
    case ASSET_STATUS.MAINTENANCE:
      return <Badge variant="warning">Maintenance</Badge>;
    default:
      return <Badge variant="default">{status}</Badge>;
  }
};
