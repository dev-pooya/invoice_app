import React from "react";
import { Navigate } from "react-router";

function Dashboard() {
  return <Navigate to="/invoices/create" />;
}

export default Dashboard;
