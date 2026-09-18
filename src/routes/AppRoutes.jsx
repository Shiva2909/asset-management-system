import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import { ProtectedRoute } from "./ProtectedRoute";
import { Layout } from "../components/layout/Layout";
import { useAuth } from "../hooks/useAuth";

import { Login } from "../pages/auth/Login";
import { Dashboard } from "../pages/dashboard/Dashboard";
import { Assets } from "../pages/assets/Assets";
import { Allocations } from "../pages/allocations/Allocations";
import { Bills } from "../pages/bills/Bills";
import Category from "../pages/category/Category";

import Employees from "../pages/Employee/Employees";

import AddMaintenance from "../pages/maintenance/AddMaintenance";
import { ViewHistory } from "../pages/view-history/ViewHistory";

export const AppRoutes = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      {/* Login */}
      <Route
        path="/login"
        element={
          isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />
        }
      />

      {/* Protected Routes */}
      <Route element={<ProtectedRoute />}>
        <Route element={<Layout />}>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />

          <Route path="/dashboard" element={<Dashboard />} />

          <Route path="/assets" element={<Assets />} />

          <Route path="/allocations" element={<Allocations />} />

          <Route path="/bills" element={<Bills />} />

          <Route path="/category" element={<Category />} />
          <Route path="/Employee" element={<Employees />} />

          <Route path="/maintenance" element={<AddMaintenance />} />
          
          {/* 🚨 YAHAN CHANGE KIYA HAI :assetId laga kar */}
          <Route path="/allocations/view-history/:assetId" element={<ViewHistory />} />
        </Route>
      </Route>

      {/* Unknown URL */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};