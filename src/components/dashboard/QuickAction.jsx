import React from "react";
import { Button } from "../common/Button";

export const QuickAction = ({
  label,
  icon: Icon,
  onClick,
  variant = "primary",
}) => {
  return (
    <Button variant={variant} onClick={onClick} className="gap-2 shadow-xs">
      <Icon className="w-4 h-4" />
      {label}
    </Button>
  );
};
