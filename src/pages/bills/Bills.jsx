import React, { useState } from "react";
import { useBills } from "../../hooks/useBills";
import { useAssets } from "../../hooks/useAssets";
import { BillTable } from "../../components/bills/BillTable";
import { BillUploadModal } from "../../components/bills/BillUploadModal";
import { BillPreview } from "../../components/bills/BillPreview";
import { Button } from "../../components/common/Button";
import { Loader } from "../../components/common/Loader";
import { Upload, ReceiptText } from "lucide-react";

export const Bills = () => {
  const { bills, loading, uploadBill } = useBills();
  const { assets } = useAssets();

  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [previewBill, setPreviewBill] = useState(null);

  return (
    <div className="min-h-screen bg-slate-50 p-3 sm:p-5">
      <div className="mx-auto w-full max-w-7xl space-y-4">
        {/* HEADER - Upar shift kiya aur highlight kiya */}
        <div className="-mt-8 sm:-mt-10 flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-2">
            <div className="rounded-lg bg-blue-100 p-1.5 text-blue-700">
              <ReceiptText size={18} />
            </div>
            <div>
              <h1 className="text-lg font-bold text-slate-800 sm:text-xl">
                Bills & Purchase Invoices
              </h1>
              <p className="text-[11px] text-slate-500">
                Manage hardware receipts, procurement documentation, and audit
                files
              </p>
            </div>
          </div>

          <Button
            onClick={() => setIsUploadModalOpen(true)}
            className="flex items-center gap-1.5 text-xs py-2"
          >
            <Upload className="w-4 h-4" /> Upload Invoice
          </Button>
        </div>

        {loading ? (
          <Loader message="Loading purchase records..." />
        ) : (
          <BillTable bills={bills} onPreview={(bill) => setPreviewBill(bill)} />
        )}

        <BillUploadModal
          isOpen={isUploadModalOpen}
          onClose={() => setIsUploadModalOpen(false)}
          assets={assets}
          onSubmit={uploadBill}
        />

        <BillPreview
          isOpen={!!previewBill}
          onClose={() => setPreviewBill(null)}
          bill={previewBill}
        />
      </div>
    </div>
  );
};
