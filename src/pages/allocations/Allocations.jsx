import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAllocations } from "../../hooks/useAllocations";
import { useAssets } from "../../hooks/useAssets";

import { PageHeader } from "../../components/layout/PageHeader";
import { AllocationTable } from "../../components/allocations/AllocationTable";
import { AllocationModal } from "../../components/allocations/AllocationModal";
import { ReturnAssetModal } from "../../components/allocations/ReturnAssetModal";

import { Button } from "../../components/common/Button";
import { Loader } from "../../components/common/Loader";

import { Share2 } from "lucide-react";

export const Allocations = () => {
  const navigate = useNavigate();

  const { allocations, loading, assignAsset, returnAsset } = useAllocations();

  const { assets, refetch: refetchAssets } = useAssets();

  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [returnTarget, setReturnTarget] = useState(null);

  // Available assets filter
  const availableAssets = assets.filter((a) => {
    const assetStatus = a.status || a.Status;

    return assetStatus && assetStatus.toLowerCase() === "available";
  });

  // Return asset
  const handleReturnSuccess = async (allocationId) => {
    try {
      await returnAsset(allocationId);

      setReturnTarget(null);

      await refetchAssets();

      // Page reload ki jagah existing data refresh karna better hai.
      // Agar useAllocations mein refetch hai, use bhi call kar sakte ho.
    } catch (error) {
      console.error("Return failed:", error);

      alert(
        error.response?.data?.message ||
          "Return fail ho gaya, console check karo.",
      );
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Asset Allocation & Returns"
        subtitle="Monitor deployments, equipment handovers, and device recovery"
        actions={
          <Button onClick={() => setIsAssignModalOpen(true)}>
            <Share2 className="w-4 h-4" />
            Assign Device
          </Button>
        }
      />

      {loading ? (
        <Loader message="Loading active allocations..." />
      ) : (
        <AllocationTable
          allocations={allocations}
          onReturn={(allocation) => setReturnTarget(allocation)}
          onViewHistory={(allocation) => navigate("/allocations/view-history")}
        />
      )}

      <AllocationModal
        isOpen={isAssignModalOpen}
        onClose={() => setIsAssignModalOpen(false)}
        availableAssets={availableAssets}
        onSubmit={(data) => {
          assignAsset(data);
          refetchAssets();
        }}
      />

      <ReturnAssetModal
        isOpen={!!returnTarget}
        onClose={() => setReturnTarget(null)}
        allocation={returnTarget}
        onConfirm={handleReturnSuccess}
      />
    </div>
  );
};
