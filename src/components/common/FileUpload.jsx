import React, { useRef } from "react";
import { UploadCloud, File, X } from "lucide-react";

export const FileUpload = ({
  file,
  onFileSelect,
  onFileRemove,
  error,
  label = "Invoice File Attachment",
  accept = ".pdf,.jpg,.jpeg,.png",
}) => {
  const fileInputRef = useRef(null);

  const handleChange = (e) => {
    const selected = e.target.files[0];
    if (selected) onFileSelect(selected);
  };

  return (
    <div className="w-full">
      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
        {label}
      </label>
      {!file ? (
        <div
          onClick={() => fileInputRef.current?.click()}
          className={`flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-xl cursor-pointer transition-colors bg-slate-50 hover:bg-slate-100 ${
            error ? "border-rose-400" : "border-slate-300"
          }`}
        >
          <UploadCloud className="w-8 h-8 text-slate-400 mb-2" />
          <p className="text-xs font-medium text-slate-700">
            Click or drag file to upload
          </p>
          <p className="text-[11px] text-slate-400 mt-1">
            Accepts PDF, PNG, JPG (Max 10MB)
          </p>
          <input
            ref={fileInputRef}
            type="file"
            accept={accept}
            onChange={handleChange}
            className="hidden"
          />
        </div>
      ) : (
        <div className="flex items-center justify-between p-3 border border-slate-200 rounded-xl bg-slate-50">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <File className="w-5 h-5 text-sky-600 shrink-0" />
            <span className="text-xs font-medium text-slate-800 truncate">
              {file.name}
            </span>
          </div>
          <button
            type="button"
            onClick={onFileRemove}
            className="p-1 rounded text-slate-400 hover:text-rose-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
      {error && (
        <p className="mt-1 text-xs text-rose-600 font-medium">{error}</p>
      )}
    </div>
  );
};
