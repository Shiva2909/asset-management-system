import React from "react";
import { Spinner } from "./Spinner";

export const Loader = ({ message = "Loading records..." }) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 space-y-3">
      <Spinner className="w-8 h-8 text-sky-600" />
      <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">
        {message}
      </p>
    </div>
  );
};
