import React from "react";
import {
  Box,
  CheckCircle2,
  UserCheck,
  AlertTriangle,
  ListSortDescending,
  IdCardLanyard,
} from "lucide-react";
import { StatCard } from "./StatCard";

export const DashboardStats = ({ stats }) => {
  const cards = [
    {
      title: "Total Assets",
      count: stats.total,
      icon: Box,
      color: "text-sky-600",
      bg: "bg-sky-50",
    },
    {
      title: "Available Assets",
      count: stats.available,
      icon: CheckCircle2,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
    },
    {
      title: "Assigned Assets",
      count: stats.assigned,
      icon: UserCheck,
      color: "text-indigo-600",
      bg: "bg-indigo-50",
    },
    {
      title: "Under Maintenance",
      count: stats.maintenance,
      icon: AlertTriangle,
      color: "text-amber-600",
      bg: "bg-amber-50",
    },
    {
      title: "category",
      count: stats.available,
      icon: ListSortDescending,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
    },
    {
      title: "Employees",
      count: stats.available,
      icon: IdCardLanyard,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => (
        <StatCard key={card.title} {...card} />
      ))}
    </div>
  );
};
