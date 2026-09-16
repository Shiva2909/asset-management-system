import React, { useState } from "react";
import { useAllocations } from "../../hooks/useAllocations";
import { useAssets } from "../../hooks/useAssets";
import { PageHeader } from "../../components/layout/PageHeader";
import { AllocationTable } from "../../components/allocations/AllocationTable";
import { AllocationModal } from "../../components/allocations/AllocationModal";
import { ReturnAssetModal } from "../../components/allocations/ReturnAssetModal";
import { Button } from "../../components/common/Button";
import { Loader } from "../../components/common/Loader";
import { ASSET_STATUS } from "../../utils/constants";
import { Share2 } from "lucide-react";

export const Allocations = () => {
  const { allocations, loading, assignAsset, returnAsset } = useAllocations();
  const { assets, refetch: refetchAssets } = useAssets();

  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [returnTarget, setReturnTarget] = useState(null);

  const availableAssets = assets.filter(
    (a) => a.status === ASSET_STATUS.AVAILABLE,
  );

  const handleReturnSuccess = (allocationId, assetTag) => {
    returnAsset(allocationId, assetTag);
    refetchAssets();
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Asset Allocation & Returns"
        subtitle="Monitor deployments, equipment handovers, and device recovery"
        actions={
          <Button onClick={() => setIsAssignModalOpen(true)}>
            <Share2 className="w-4 h-4" /> Assign Device
          </Button>
        }
      />

      {loading ? (
        <Loader message="Loading active allocations..." />
      ) : (
        <AllocationTable
          allocations={allocations}
          onReturn={(allocation) => setReturnTarget(allocation)}
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
