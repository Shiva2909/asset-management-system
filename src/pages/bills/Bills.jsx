import React, { useState } from "react";
import { useBills } from "../../hooks/useBills";
import { useAssets } from "../../hooks/useAssets";
import { PageHeader } from "../../components/layout/PageHeader";
import { BillTable } from "../../components/bills/BillTable";
import { BillUploadModal } from "../../components/bills/BillUploadModal";
import { BillPreview } from "../../components/bills/BillPreview";
import { Button } from "../../components/common/Button";
import { Loader } from "../../components/common/Loader";
import { Upload } from "lucide-react";

export const Bills = () => {
  const { bills, loading, uploadBill } = useBills();
  const { assets } = useAssets();

  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [previewBill, setPreviewBill] = useState(null);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Bills & Purchase Invoices"
        subtitle="Manage hardware receipts, procurement documentation, and audit files"
        actions={
          <Button onClick={() => setIsUploadModalOpen(true)}>
            <Upload className="w-4 h-4" /> Upload Invoice
          </Button>
        }
      />

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
  );
};
