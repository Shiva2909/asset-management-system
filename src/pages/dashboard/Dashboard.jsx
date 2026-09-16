import React, { useState } from "react";
import { useAssets } from "../../hooks/useAssets";
import { useAllocations } from "../../hooks/useAllocations";
import { DashboardStats } from "../../components/dashboard/DashboardStats";
import { QuickAction } from "../../components/dashboard/QuickAction";
import { PageHeader } from "../../components/layout/PageHeader";
import { AssetModal } from "../../components/assets/AssetModal";
import { AllocationModal } from "../../components/allocations/AllocationModal";
import { ASSET_STATUS } from "../../utils/constants";
import { Plus, Share2 } from "lucide-react";

export const Dashboard = () => {
  const { assets, addAsset } = useAssets();
  const { assignAsset } = useAllocations();
  const [isAssetModalOpen, setIsAssetModalOpen] = useState(false);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);

  const availableAssets = assets.filter(
    (a) => a.status === ASSET_STATUS.AVAILABLE,
  );

  const stats = {
    total: assets.length,
    available: availableAssets.length,
    assigned: assets.filter((a) => a.status === ASSET_STATUS.ASSIGNED).length,
    maintenance: assets.filter((a) => a.status === ASSET_STATUS.MAINTENANCE)
      .length,
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard Overview"
        subtitle="Real-time operational inventory & hardware metrics"
        actions={
          <>
            <QuickAction
              label="Add Asset"
              icon={Plus}
              onClick={() => setIsAssetModalOpen(true)}
            />
            <QuickAction
              label="Assign Asset"
              icon={Share2}
              variant="secondary"
              onClick={() => setIsAssignModalOpen(true)}
            />
          </>
        }
      />

      <DashboardStats stats={stats} />

      <AssetModal
        isOpen={isAssetModalOpen}
        onClose={() => setIsAssetModalOpen(false)}
        onSubmit={addAsset}
      />

      <AllocationModal
        isOpen={isAssignModalOpen}
        onClose={() => setIsAssignModalOpen(false)}
        availableAssets={availableAssets}
        onSubmit={assignAsset}
      />
    </div>
  );
};
