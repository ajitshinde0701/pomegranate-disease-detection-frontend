import React from "react";
import { Navigate } from "react-router-dom";

function RoleRoute({ allowedRole, children }) {
  const role = localStorage.getItem("role");
  return role === allowedRole ? children : <Navigate to="/login" />;
}

export default RoleRoute;