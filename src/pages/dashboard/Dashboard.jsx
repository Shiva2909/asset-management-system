import React, { useState, useEffect } from "react";

import { useAssets } from "../../hooks/useAssets";
import { useAllocations } from "../../hooks/useAllocations";
import { useCategories } from "../../hooks/useCategories";

import { getEmployees } from "../../services/employeeService";

import { DashboardStats } from "../../components/dashboard/DashboardStats";
import { PageHeader } from "../../components/layout/PageHeader";

export const Dashboard = () => {
  const { assets } = useAssets();
  const { assignAsset } = useAllocations();
  const { categories } = useCategories();

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
      const s = String(a.status || a.Status || "")
        .toLowerCase()
        .trim();

      return s === statusName.toLowerCase();
    }).length;
  };

  const availableAssets = assets.filter((a) => {
    const s = String(a.status || a.Status || "")
      .toLowerCase()
      .trim();

    return s === "available";
  });

  // Asset statistics
  const totalAssets = assets.length || 0;
  const availableCount = getAssetCount("available");
  const assignedCount = getAssetCount("assigned");

  // Maintenance calculation
  const stats = {
    total: totalAssets,
    available: availableCount,
    assigned: assignedCount,
    maintenance: totalAssets - (availableCount + assignedCount),
    categories: categories?.length || 0,
    employees: employeeCount,
  };

  return (
    <div className="w-full min-w-0 p-2 sm:p-3 lg:p-4 -mt-10">
      {/* Dashboard Header */}
      <div className="mb-3 ml-1">
        <div className="[&_h1]:!text-lg [&_p]:!text-xs">
          <PageHeader
            title="Dashboard Overview"
            subtitle="Real-time operational inventory & hardware metrics"
          />
        </div>
      </div>

      {/* Dashboard Statistics */}
      <div className="-mt-3 w-full">
        <DashboardStats stats={stats} />
      </div>
    </div>
  );
};

export default Dashboard;
