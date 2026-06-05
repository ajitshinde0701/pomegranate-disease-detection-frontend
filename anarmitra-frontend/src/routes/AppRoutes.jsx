import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";

import Navbar from "../components/Navbar";
import ProtectedRoute from "../components/ProtectedRoute";
import RoleRoute from "../components/RoleRoute";

import Home from "../pages/Home";
import About from "../pages/About";
import Services from "../pages/Services";
import Contact from "../pages/Contact";
import Login from "../pages/Login";
import Register from "../pages/Register";

import FarmerDashboard from "../dashboards/farmer/FarmerDashboard";
import MerchantDashboard from "../dashboards/merchant/MerchantDashboard";
import AdvisorDashboard from "../dashboards/advisor/AdvisorDashboard";
import FertilizerDashboard from "../dashboards/fertilizer/FertilizerDashboard";
import AdminDashboard from "../dashboards/admin/AdminDashboard";

function AppRoutes() {
  return (
    <>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/services" element={<Services />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registration" element={<Register />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/dashboard/farmer"
          element={
            <ProtectedRoute>
              <RoleRoute allowedRole="FARMER">
                <FarmerDashboard />
              </RoleRoute>
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard/merchant"
          element={
            <ProtectedRoute>
              <RoleRoute allowedRole="MERCHANT">
                <MerchantDashboard />
              </RoleRoute>
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard/advisor"
          element={
            <ProtectedRoute>
              <RoleRoute allowedRole="ADVISOR">
                <AdvisorDashboard />
              </RoleRoute>
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard/fertilizer-store"
          element={
            <ProtectedRoute>
              <RoleRoute allowedRole="FERTILIZER_STORE">
                <FertilizerDashboard />
              </RoleRoute>
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard/admin"
          element={
            <ProtectedRoute>
              <RoleRoute allowedRole="ADMIN">
                <AdminDashboard />
              </RoleRoute>
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/" />} />
        <Route path="/admin-dashboard/*" element={<AdminDashboard />} />
      </Routes>
    </>
  );
}

export default AppRoutes;