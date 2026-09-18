import React, { useState, useEffect } from "react";
import { useAssets } from "../../hooks/useAssets";
import { useAllocations } from "../../hooks/useAllocations";
import { useCategories } from "../../hooks/useCategories"; 
import { getEmployees } from "../../services/employeeService"; 
import { DashboardStats } from "../../components/dashboard/DashboardStats";
import { QuickAction } from "../../components/dashboard/QuickAction";
import { PageHeader } from "../../components/layout/PageHeader";
import { AssetModal } from "../../components/assets/AssetModal";
import { AllocationModal } from "../../components/allocations/AllocationModal";
import { Plus, Share2 } from "lucide-react";

export const Dashboard = () => {
  const { assets, addAsset } = useAssets();
  const { assignAsset } = useAllocations();
  const { categories } = useCategories(); 
  
  const [isAssetModalOpen, setIsAssetModalOpen] = useState(false);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);

  const [employeeCount, setEmployeeCount] = useState(0);

  useEffect(() => {
    const fetchEmployeeData = async () => {
      try {
        const response = await getEmployees();
        if (response && response.success) {
          setEmployeeCount(response.data?.length || 0);
        }
      } catch (err) {
        console.error("Dashboard Employee Fetch Error:", err);
      }
    };
    fetchEmployeeData();
  }, []);

  const getAssetCount = (statusName) => {
    return assets.filter((a) => {
      const s = String(a.status || a.Status || "").toLowerCase().trim();
      return s === statusName.toLowerCase();
    }).length;
  };

  const availableAssets = assets.filter((a) => {
    const s = String(a.status || a.Status || "").toLowerCase().trim();
    return s === "available";
  });

  // 🚨 Ye variables zaroori hain stats calculate karne ke liye
  const totalAssets = assets.length || 0;
  const availableCount = getAssetCount("available");
  const assignedCount = getAssetCount("assigned");

  // 🚨 SMART FIX: Jo Available aur Assigned nahi hai, wo Maintenance mein hai
  const stats = {
    total: totalAssets,
    available: availableCount,
    assigned: assignedCount,
    maintenance: totalAssets - (availableCount + assignedCount), 
    categories: categories?.length || 0, 
    employees: employeeCount, 
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

export default Dashboard;