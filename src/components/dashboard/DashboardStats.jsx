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
      title: "Categories",
      count: stats.categories, // 🚨 FIX: Now uses actual categories count
      icon: ListSortDescending,
      color: "text-purple-600",
      bg: "bg-purple-50",
    },
    {
      title: "Employees",
      count: stats.employees, // 🚨 FIX: Now uses actual employees count
      icon: IdCardLanyard,
      color: "text-pink-600",
      bg: "bg-pink-50",
    },
  ];

  return (
    // 🚨 6 cards hain, toh 3 columns ki grid zyada acchi lagegi
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {cards.map((card) => (
        <StatCard key={card.title} {...card} />
      ))}
    </div>
  );
};